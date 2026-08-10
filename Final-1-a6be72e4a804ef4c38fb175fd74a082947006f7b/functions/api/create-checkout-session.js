export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.STRIPE_SECRET_KEY) return json({ error: 'Missing STRIPE_SECRET_KEY.' }, 500);

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const shipping = body.shipping || null;
    const recipient = body.recipient || null;

    if (!items.length) return json({ error: 'Cart is empty.' }, 400);
    if (!shipping || !Number.isFinite(Number(shipping.rate))) {
      return json({ error: 'Select a shipping rate.' }, 400);
    }

    const origin = env.SITE_URL || new URL(request.url).origin;
    const orderId = createOrderId();
    const params = new URLSearchParams();

    params.set('mode', 'payment');
    params.set('automatic_tax[enabled]', 'true');
    params.set('success_url', `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`);
    params.set('cancel_url', `${origin}/cancel.html`);
    params.set('phone_number_collection[enabled]', 'true');
    params.set('allow_promotion_codes', 'true');
    params.set('billing_address_collection', 'auto');
    params.set('customer_creation', 'always');
    params.set('shipping_address_collection[allowed_countries][0]', recipient?.country_code || 'US');
    params.set('client_reference_id', orderId);

    if (recipient?.email) params.set('customer_email', recipient.email);

    const readableItems = [];

    items.forEach((item, index) => {
      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitAmount = Math.round(Number(item.unitAmount || 0));
      if (!Number.isFinite(unitAmount) || unitAmount < 50) {
        throw new Error(`Invalid price for ${item.productId || item.displayName || 'product'}.`);
      }

      const displayName = clean(item.displayName || item.name || 'No Vanity 33 Product', 180);
      const color = clean(item.color || 'Default', 80);
      const size = clean(item.size || 'One Size', 40);
      const variantLabel = `${color} • ${size}`;
      const fullLineName = clean(`${displayName} — ${variantLabel}`, 250);
      const description = clean(`Color: ${color} | Size: ${size} | NV33 Order: ${orderId}`, 500);

      /*
       * Always create readable one-time Stripe line items instead of using a
       * saved Price ID. This makes product, color and size visible directly
       * in Stripe Checkout, the payment record and line-item details.
       */
      params.set(`line_items[${index}][price_data][currency]`, 'usd');
      params.set(`line_items[${index}][price_data][unit_amount]`, String(unitAmount));
      params.set(`line_items[${index}][price_data][product_data][name]`, fullLineName);
      params.set(`line_items[${index}][price_data][product_data][description]`, description);
      params.set(`line_items[${index}][quantity]`, String(quantity));

      if (item.productId) params.set(`metadata[product_${index}_id]`, clean(item.productId, 500));
      if (item.name) params.set(`metadata[product_${index}_name]`, clean(item.name, 500));
      params.set(`metadata[product_${index}_size]`, size);
      params.set(`metadata[product_${index}_color]`, color);
      params.set(`metadata[product_${index}_quantity]`, String(quantity));
      params.set(`metadata[product_${index}_display]`, clean(`${displayName} | ${color} | ${size} | Qty ${quantity}`, 500));

      readableItems.push(`${displayName} (${color}, ${size}) x${quantity}`);
    });

    const shippingAmount = Math.round(Number(shipping.rate) * 100);
    params.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
    params.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(shippingAmount));
    params.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', String(shipping.currency || 'USD').toLowerCase());
    params.set('shipping_options[0][shipping_rate_data][display_name]', Number(shipping.rate) === 0 ? 'FREE U.S. Shipping' : (shipping.name || 'Standard Shipping'));

    if (shipping.minDeliveryDays) {
      params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
      params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', String(shipping.minDeliveryDays));
    }
    if (shipping.maxDeliveryDays) {
      params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
      params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', String(shipping.maxDeliveryDays));
    }

    const orderSummary = clean(readableItems.join(' || '), 500);
    params.set('metadata[order_id]', orderId);
    params.set('metadata[order_summary]', orderSummary);
    params.set('metadata[shipping_rate_id]', clean(shipping.id || 'printful-rate', 500));
    params.set('metadata[shipping_rate_name]', clean(shipping.name || 'Standard Shipping', 500));
    params.set('metadata[shipping_rate_amount]', String(shipping.rate));
    params.set('metadata[item_count]', String(items.length));

    /* Put the same readable information on the PaymentIntent shown in Stripe Payments. */
    params.set('payment_intent_data[description]', clean(`No Vanity 33 ${orderId}: ${orderSummary}`, 500));
    params.set('payment_intent_data[metadata][order_id]', orderId);
    params.set('payment_intent_data[metadata][order_summary]', orderSummary);
    params.set('payment_intent_data[metadata][item_count]', String(items.length));

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      return json({ error: session.error?.message || 'Stripe checkout error.' }, 500);
    }

    return json({ url: session.url, orderId });
  } catch (error) {
    return json({ error: error.message || 'Checkout failed.' }, 500);
  }
}

function createOrderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `NV33-${stamp}-${random}`;
}

function clean(value, maxLength) {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, maxLength);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.STRIPE_SECRET_KEY) return json({ error: 'Missing STRIPE_SECRET_KEY.' }, 500);

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const shipping = body.shipping || null;
    const recipient = body.recipient || null;
    if (!items.length) return json({ error: 'Cart is empty.' }, 400);
    if (!shipping || !Number.isFinite(Number(shipping.rate))) return json({ error: 'Select a shipping rate.' }, 400);

    const origin = env.SITE_URL || new URL(request.url).origin;
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

    if (recipient?.email) params.set('customer_email', recipient.email);

    items.forEach((item, index) => {
      if (!item.price) throw new Error(`Missing Stripe Price ID for ${item.productId || 'product'}.`);
      params.set(`line_items[${index}][price]`, item.price);
      params.set(`line_items[${index}][quantity]`, String(item.quantity || 1));
      if (item.productId) params.set(`metadata[product_${index}_id]`, item.productId);
      if (item.name) params.set(`metadata[product_${index}_name]`, item.name);
      if (item.size) params.set(`metadata[product_${index}_size]`, item.size);
      if (item.color) params.set(`metadata[product_${index}_color]`, item.color);
      params.set(`metadata[product_${index}_quantity]`, String(item.quantity || 1));
    });

    const amount = Math.round(Number(shipping.rate) * 100);
    params.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
    params.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(amount));
    params.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', String(shipping.currency || 'USD').toLowerCase());
    params.set('shipping_options[0][shipping_rate_data][display_name]', shipping.name || 'Standard Shipping');
    if (shipping.minDeliveryDays) params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
    if (shipping.minDeliveryDays) params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', String(shipping.minDeliveryDays));
    if (shipping.maxDeliveryDays) params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
    if (shipping.maxDeliveryDays) params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', String(shipping.maxDeliveryDays));

    params.set('metadata[shipping_rate_id]', shipping.id || 'printful-rate');
    params.set('metadata[shipping_rate_name]', shipping.name || 'Standard Shipping');
    params.set('metadata[shipping_rate_amount]', String(shipping.rate));
    params.set('metadata[item_count]', String(items.length));

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    const session = await stripeRes.json();
    if (!stripeRes.ok) return json({ error: session.error?.message || 'Stripe checkout error.' }, 500);
    return json({ url: session.url });
  } catch (error) {
    return json({ error: error.message || 'Checkout failed.' }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

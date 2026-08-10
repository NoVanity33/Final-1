import { getSyncCatalog, printfulFetch, resolveVariant, json } from './_printful.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const recipient = body.recipient || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (!recipient.country_code || !recipient.address1 || !recipient.city || !recipient.zip) {
      return json({ error: 'A complete shipping address is required.' }, 400);
    }
    if (!items.length) return json({ error: 'Cart is empty.' }, 400);

    const catalog = await getSyncCatalog(env);
    const resolvedItems = items.map((item) => {
      const match = resolveVariant(catalog, item.productId, item.name, item.size, item.color);
      return {
        variant_id: match.variant.catalogVariantId,
        quantity: Number(item.quantity || 1),
        value: item.value ? String(item.value) : undefined
      };
    });

    const quote = await printfulFetch(env, '/shipping/rates', {
      method: 'POST',
      body: JSON.stringify({ recipient, items: resolvedItems })
    });

    const rates = (quote.result || []).map((rate) => ({
      id: rate.id,
      name: rate.name,
      rate: Number(rate.rate || 0),
      currency: rate.currency || 'USD',
      minDeliveryDays: rate.minDeliveryDays ?? rate.min_delivery_days ?? null,
      maxDeliveryDays: rate.maxDeliveryDays ?? rate.max_delivery_days ?? null
    }));
    return json({ rates });
  } catch (error) {
    return json({ error: error.message || 'Could not calculate shipping.' }, 500);
  }
}

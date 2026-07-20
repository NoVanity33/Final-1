const PRINTFUL_BASE = 'https://api.printful.com';

export function printfulHeaders(env, extra = {}) {
  if (!env.PRINTFUL_API_KEY) throw new Error('Missing PRINTFUL_API_KEY.');
  const headers = {
    Authorization: `Bearer ${env.PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
    ...extra
  };
  if (env.PRINTFUL_STORE_ID) headers['X-PF-Store-Id'] = String(env.PRINTFUL_STORE_ID);
  return headers;
}

export async function printfulFetch(env, path, options = {}) {
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    ...options,
    headers: printfulHeaders(env, options.headers || {})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message || data?.result || data?.message || `Printful request failed (${res.status}).`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function normalizeSize(value = '') {
  const size = String(value).toUpperCase().replace(/\s+/g, '');
  const aliases = {
    SMALL: 'S', MEDIUM: 'M', LARGE: 'L',
    '2X': '2XL', XXL: '2XL',
    '3X': '3XL', XXXL: '3XL'
  };
  return aliases[size] || size;
}

export async function getAllSyncProducts(env) {
  const products = [];
  const limit = 100;
  let offset = 0;
  while (true) {
    const page = await printfulFetch(env, `/store/products?limit=${limit}&offset=${offset}`);
    const result = Array.isArray(page.result) ? page.result : [];
    products.push(...result);
    if (result.length < limit) break;
    offset += limit;
  }
  return products;
}

export async function getSyncCatalog(env) {
  const cache = caches.default;
  const cacheKey = new Request('https://nv33.internal/printful-catalog-v1');
  const cached = await cache.match(cacheKey);
  if (cached) return cached.json();

  const summaries = await getAllSyncProducts(env);
  const details = [];
  for (const summary of summaries) {
    const id = summary?.id || summary?.sync_product?.id;
    if (!id) continue;
    const detail = await printfulFetch(env, `/store/products/${id}`);
    if (detail?.result) details.push(detail.result);
  }

  const catalog = details.map((entry) => ({
    syncProductId: entry.sync_product?.id,
    externalId: entry.sync_product?.external_id || '',
    name: entry.sync_product?.name || '',
    variants: (entry.sync_variants || []).map((variant) => ({
      syncVariantId: variant.id,
      externalId: variant.external_id || '',
      catalogVariantId: variant.variant_id,
      name: variant.name || '',
      size: normalizeSize(variant.size || extractSize(variant.name)),
      color: variant.color || '',
      sku: variant.sku || '',
      retailPrice: variant.retail_price || ''
    }))
  }));

  const response = new Response(JSON.stringify(catalog), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
  await cache.put(cacheKey, response.clone());
  return catalog;
}

function extractSize(name = '') {
  const match = String(name).match(/(?:\/|–|-)\s*(S|M|L|XL|2XL|3XL|XXL|XXXL)\s*$/i);
  return match ? match[1] : '';
}

export function resolveVariant(catalog, productId, productName, size, color = '') {
  const productNeedles = [productId, productName].filter(Boolean).map(normalize);
  const wantedSize = normalizeSize(size);
  const wantedColor = normalize(color);

  const scored = catalog.map((product) => {
    const haystacks = [product.name, product.externalId].map(normalize);
    let score = 0;
    for (const needle of productNeedles) {
      if (!needle) continue;
      for (const hay of haystacks) {
        if (hay === needle) score = Math.max(score, 100);
        else if (hay.includes(needle) || needle.includes(hay)) score = Math.max(score, 70);
        else {
          const words = needle.split(' ').filter(Boolean);
          const matches = words.filter((word) => hay.includes(word)).length;
          score = Math.max(score, matches * 10);
        }
      }
    }
    return { product, score };
  }).sort((a, b) => b.score - a.score);

  const chosenProduct = scored[0]?.score > 0 ? scored[0].product : null;
  if (!chosenProduct) throw new Error(`No Printful product matched ${productName || productId}.`);

  const variants = chosenProduct.variants.filter((variant) => normalizeSize(variant.size) === wantedSize);
  const exactColor = wantedColor ? variants.find((variant) => normalize(variant.color) === wantedColor) : null;
  const chosenVariant = exactColor || variants[0];
  if (!chosenVariant) throw new Error(`No Printful variant matched ${chosenProduct.name} in size ${size}.`);

  return { product: chosenProduct, variant: chosenVariant };
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}

import { getSyncCatalog, requireAdmin, resolveStoreId, json } from './_printful.js';
export async function onRequestGet({ request, env }) {
  try {
    if (!requireAdmin(request, env)) return json({ error:'Unauthorized.' }, 401);
    const refresh = new URL(request.url).searchParams.get('refresh') === '1';
    const catalog = await getSyncCatalog(env, refresh);
    return json({ storeId: await resolveStoreId(env) || null, count:catalog.length, variants:catalog.reduce((n,p)=>n+p.variants.length,0), products:catalog });
  } catch (error) { return json({ error:error.message || 'Could not sync Printful catalog.' }, 500); }
}

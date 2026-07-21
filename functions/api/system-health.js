import { getSyncCatalog, requireAdmin, resolveStoreId, json } from './_printful.js';
export async function onRequestGet({ request, env }) {
  if (!requireAdmin(request, env)) return json({ error:'Unauthorized.' }, 401);
  const checks = {
    STRIPE_SECRET_KEY: Boolean(env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: Boolean(env.STRIPE_WEBHOOK_SECRET),
    PRINTFUL_API_KEY: Boolean(env.PRINTFUL_API_KEY),
    ADMIN_SYNC_TOKEN: Boolean(env.ADMIN_SYNC_TOKEN),
    SITE_URL: env.SITE_URL || null
  };
  let printful = { ok:false, storeId:null, products:0, variants:0, error:null };
  try {
    const catalog = await getSyncCatalog(env);
    printful = { ok:true, storeId:await resolveStoreId(env) || null, products:catalog.length, variants:catalog.reduce((n,p)=>n+p.variants.length,0), error:null };
  } catch (e) { printful.error = e.message; }
  return json({ ok:Object.values(checks).slice(0,4).every(Boolean) && printful.ok, checks, printful, version:'7.0.0' });
}

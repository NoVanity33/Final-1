import { getSyncCatalog, json } from './_printful.js';

export async function onRequestGet({ request, env }) {
  try {
    const supplied = request.headers.get('x-admin-token') || new URL(request.url).searchParams.get('token');
    if (!env.ADMIN_SYNC_TOKEN || supplied !== env.ADMIN_SYNC_TOKEN) {
      return json({ error: 'Unauthorized.' }, 401);
    }
    const catalog = await getSyncCatalog(env);
    return json({ count: catalog.length, products: catalog });
  } catch (error) {
    return json({ error: error.message || 'Could not sync Printful catalog.' }, 500);
  }
}

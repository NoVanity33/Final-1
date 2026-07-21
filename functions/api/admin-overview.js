import { printfulFetch, requireAdmin, json } from './_printful.js';
export async function onRequestGet({ request, env }) {
  if (!requireAdmin(request, env)) return json({ error:'Unauthorized.' }, 401);
  try {
    const [orders, sessions] = await Promise.all([getPrintfulOrders(env), getStripeSessions(env)]);
    const paid = sessions.filter(s=>s.payment_status==='paid');
    const gross = paid.reduce((n,s)=>n+Number(s.amount_total||0),0)/100;
    return json({
      gross, paidOrders:paid.length, printfulOrders:orders.length,
      recentStripe:paid.slice(0,10).map(s=>({ id:s.id, created:s.created, email:s.customer_details?.email||s.customer_email||'', total:Number(s.amount_total||0)/100, currency:s.currency||'usd', status:s.payment_status })),
      recentPrintful:orders.slice(0,10).map(o=>({ id:o.id, externalId:o.external_id||'', status:o.status||'', created:o.created||0, recipient:o.recipient?.name||'', total:o.costs?.total||o.retail_costs?.total||'' }))
    });
  } catch (e) { return json({ error:e.message || 'Could not load dashboard.' }, 500); }
}
async function getPrintfulOrders(env) {
  const data = await printfulFetch(env, '/orders?limit=25&offset=0');
  return Array.isArray(data.result) ? data.result : [];
}
async function getStripeSessions(env) {
  if (!env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY.');
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions?limit=25', { headers:{ Authorization:`Bearer ${env.STRIPE_SECRET_KEY}` } });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error?.message || 'Stripe dashboard request failed.');
  return Array.isArray(data.data) ? data.data : [];
}

import { getSyncCatalog, printfulFetch, resolveVariant, json } from './_printful.js';
export async function onRequestPost({ request, env, waitUntil }) {
  try {
    if (!env.STRIPE_WEBHOOK_SECRET) return json({ error:'Missing STRIPE_WEBHOOK_SECRET.' },500);
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    if (!await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)) return json({ error:'Invalid Stripe signature.' },400);
    const event = JSON.parse(rawBody);
    if (['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)) {
      const session = event.data?.object;
      if (session?.payment_status === 'paid') waitUntil(createPrintfulDraft(env, session));
    }
    return json({ received:true });
  } catch (error) { return json({ error:error.message || 'Webhook failed.' },400); }
}
async function createPrintfulDraft(env, eventSession) {
  const session = await retrieveSession(env, eventSession.id).catch(()=>eventSession);
  const metadata = session.metadata || {};
  const count = Number(metadata.item_count || 0);
  const catalog = await getSyncCatalog(env);
  const items = [];
  for (let index=0; index<count; index++) {
    const match = resolveVariant(catalog, metadata[`product_${index}_id`]||'', metadata[`product_${index}_name`]||'', metadata[`product_${index}_size`]||'', metadata[`product_${index}_color`]||'');
    items.push({ sync_variant_id:match.variant.syncVariantId, quantity:Number(metadata[`product_${index}_quantity`]||1) });
  }
  if (!items.length) throw new Error(`Stripe session ${session.id} had no fulfillable items.`);
  const shipping = session.shipping_details || session.collected_information?.shipping_details;
  const address = shipping?.address || session.customer_details?.address;
  if (!address) throw new Error(`Stripe session ${session.id} had no shipping address.`);
  const recipient = { name:shipping?.name||session.customer_details?.name||'Customer', email:session.customer_details?.email||session.customer_email||'', phone:session.customer_details?.phone||'', address1:address.line1||'', address2:address.line2||'', city:address.city||'', state_code:address.state||'', country_code:address.country||'', zip:address.postal_code||'' };
  try {
    await printfulFetch(env, '/orders?confirm=false', { method:'POST', body:JSON.stringify({ external_id:session.id, shipping:metadata.shipping_rate_id||undefined, recipient, items, retail_costs:{ currency:String(session.currency||'usd').toUpperCase(), subtotal:cents(session.amount_subtotal), discount:cents(session.total_details?.amount_discount), shipping:cents(session.total_details?.amount_shipping), tax:cents(session.total_details?.amount_tax) } }) });
  } catch (error) { if (!String(error.message).toLowerCase().includes('external')) throw error; }
}
async function retrieveSession(env,id){
  const res=await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`}});
  const data=await res.json(); if(!res.ok)throw new Error(data.error?.message||'Could not retrieve Stripe session.'); return data;
}
function cents(v){return (Number(v||0)/100).toFixed(2);}
async function verifyStripeSignature(payload,header,secret){
  const pairs=header.split(',').map(p=>p.split('=').map(v=>v.trim())); const timestamp=pairs.find(p=>p[0]==='t')?.[1]; const signatures=pairs.filter(p=>p[0]==='v1').map(p=>p[1]);
  if(!timestamp||!signatures.length||Math.abs(Date.now()/1000-Number(timestamp))>300)return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${timestamp}.${payload}`));
  const actual=[...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,'0')).join(''); return signatures.some(s=>timingSafeEqual(actual,s));
}
function timingSafeEqual(a,b){if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0;}

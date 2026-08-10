const NV33_VALID_PROMO_CODES={'M2-10':{discount:10,ambassador:'Michael McAllister'}};
function validateNv33Promo(code){return NV33_VALID_PROMO_CODES[String(code||'').trim().toUpperCase()]||null;}

const grid=document.getElementById('grid');
const founderGrid=document.getElementById('founderGrid');
const comingGrid=document.getElementById('comingGrid');
const cartBtn=document.getElementById('cartBtn');
const cartCount=document.getElementById('cartCount');
const cartBox=document.getElementById('cartBox');
let products=[];
const nv33ViewState={};
let cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
const money=v=>'$'+Number(v||0).toFixed(2);

function save(){localStorage.setItem('nv33cart',JSON.stringify(cart));renderCart();}
function selectedColor(id){
  const select=document.querySelector(`select[name="color-${id}"]`);
  if(select)return select.value;
  const checked=document.querySelector(`input[name="color-${id}"]:checked`);
  return checked?.value||'Default';
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p||p.status==='coming-soon')return;
  const size=document.getElementById('size-'+id)?.value||'One Size';
  const color=selectedColor(id);
  cart.push({id:p.id,name:p.name,price:p.price,size,color,stripePriceId:p.stripePriceId||'',shippingIncluded:true});
  save();
  cartBox.classList.add('show');
}
function removeCartItem(index){cart.splice(index,1);save();}
function closeCart(){cartBox.classList.remove('show');}
function clearCart(){cart=[];save();}
function renderCart(){
  cartCount.textContent=cart.length;
  const total=cart.reduce((s,i)=>s+Number(i.price||0),0);
  cartBox.innerHTML=`<button class="cart-close" onclick="closeCart()" aria-label="Close cart">×</button>
    <h3>Your Cart</h3>
    ${cart.length?cart.map((i,idx)=>`<div class="cartrow"><span>${i.name}<br><small>${i.color||''}${i.color?' • ':''}${i.size}</small></span><b>${money(i.price)}</b><button class="remove" onclick="removeCartItem(${idx})" aria-label="Remove item">×</button></div>`).join(''):'<p>Your cart is empty.</p>'}
    <p class="cart-total"><b>Total: ${money(total)}</b></p>
    <button class="add dark-button" onclick="clearCart()">Clear Cart</button>
    <a class="btn primary checkout-link" href="checkout.html">Secure Checkout →</a>`;
}
function colorChoices(p){
  if(!p.colors?.length)return '';
  return `<div class="color-picker" aria-label="Choose color for ${p.name}">${p.colors.map((c,i)=>`
    <label class="color-option ${i===0?'selected':''}" title="${c.name}">
      <input type="radio" name="color-${p.id}" value="${c.name}" ${i===0?'checked':''} onchange="swapProductImage('${p.id}','${c.image}',this)">
      <span class="color-dot" style="--swatch:${swatchColor(c.name)}"></span><small>${c.name}</small>
    </label>`).join('')}</div>`;
}
function swatchColor(name){
  const map={'Black':'#111','White':'#fff','Sand':'#c8b18f','Brown':'#7a563f','Chocolate':'#4b2e22','Military Green':'#66704f','Cardinal':'#861f3a','Red':'#c92127','Maroon':'#651c32','Teal':'#147c7d','Tropical Blue':'#08a9bc','Light Blue':'#9ecde5','Baby Blue':'#b9dff2','Carolina Blue':'#7baed1','Royal Blue':'#244d9b','Navy':'#17243a','Purple':'#5d3b78','Charcoal':'#454545','Dark Heather':'#3d3d3f','Graphite':'#55575a','Heather Grey':'#b9b9b7','Athletic Heather':'#c9c9c9','Haze':'#b7aaa7','Cream':'#eee3c7'};
  return map[name]||'#c7a75b';
}
function nv33SelectedColorObject(id){
  const p=products.find(x=>x.id===id);
  if(!p)return null;
  const selected=document.querySelector(`input[name="color-${id}"]:checked`)?.value;
  return p.colors?.find(c=>c.name===selected)||p.colors?.[0]||null;
}
function nv33ViewImage(c,view){
  if(!c)return '';
  if(view==='Back')return c.backImage||c.image;
  if(view==='Bottom')return c.bottomImage||c.image;
  return c.image;
}
function swapProductImage(id,image,input){
  document.querySelectorAll(`input[name="color-${id}"]`).forEach(el=>el.closest('label')?.classList.toggle('selected',el.checked));
  nv33ViewState[id]='Front';
  const c=nv33SelectedColorObject(id);
  const img=document.getElementById('img-'+id);
  if(img)img.src=c?.image||image;
}
function setProductView(id,view,button){
  nv33ViewState[id]=view;
  const c=nv33SelectedColorObject(id);
  const img=document.getElementById('img-'+id);
  if(img)img.src=nv33ViewImage(c,view);
  document.querySelectorAll(`#${id}-card .view-button`).forEach(b=>b.classList.toggle('selected',b===button));
}
function viewChoices(p){
  if(!p.views?.length)return '';
  return `<div class="view-picker">${p.views.map((v,i)=>`<button type="button" class="view-button ${i===0?'selected':''}" onclick="setProductView('${p.id}','${v}',this)">${v}</button>`).join('')}</div>`;
}



function openImageForProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const c=nv33SelectedColorObject(id)||p.colors?.[0]||{image:p.image};
  const views=[];
  if(c.image)views.push({label:'Front',src:c.image});
  if(c.backImage)views.push({label:'Back',src:c.backImage});
  if(c.bottomImage)views.push({label:'Bottom',src:c.bottomImage});
  openProductGallery(p.name,views.length?views:[{label:'View',src:p.image}]);
}
function openProductGallery(alt,views){
  let modal=document.getElementById('imageModal');
  if(!modal){
    modal=document.createElement('div');modal.id='imageModal';modal.className='image-modal';
    modal.innerHTML='<button class="modal-close" aria-label="Close image">×</button><div class="modal-inner"><img alt=""><div class="modal-views"></div></div>';
    modal.onclick=e=>{if(e.target===modal||e.target.classList.contains('modal-close'))modal.classList.remove('show');};
    document.body.appendChild(modal);
  }
  const img=modal.querySelector('img');
  const controls=modal.querySelector('.modal-views');
  const setView=(idx)=>{img.src=views[idx].src;img.alt=`${alt} — ${views[idx].label}`;controls.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('selected',i===idx));};
  controls.innerHTML=views.length>1?views.map((v,i)=>`<button type="button" data-index="${i}">${v.label}</button>`).join(''):'';
  controls.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>setView(i));
  setView(0);modal.classList.add('show');
}
function liveCard(p){
  const purchasable=p.status==='available';
  return `<article class="card product-card" id="${p.id}-card">
    <span class="badge">${p.tag||'Available'}</span>
    <div class="imgbox clickable" onclick="openImageForProduct('${p.id}')" title="Click to enlarge"><img id="img-${p.id}" src="${p.image}" alt="${p.name}" loading="lazy"></div>
    <h3>${p.name}</h3>
    <p class="price">${money(p.price)}</p>
    <div class="free-shipping-badge">🚚 FREE U.S. SHIPPING</div>
    <p class="desc">${p.desc||'Premium Christian apparel.'}</p>
    ${colorChoices(p)}
    <select id="size-${p.id}" aria-label="Choose size for ${p.name}">${(p.sizes||['One Size']).map(s=>`<option>${s}</option>`).join('')}</select>
    ${purchasable?`<button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>`:`<a class="add waitlist-button" href="mailto:novanity2026@gmail.com?subject=V8%20Product%20Interest%20-%20${encodeURIComponent(p.name)}">Printful Setup Pending</a>`}
  </article>`;
}
function previewCard(p){
  return `<article class="card preview-card">
    <div class="preview-ribbon">FOUNDER'S PREVIEW</div>
    <div class="imgbox preview-img clickable" onclick="openImage('${p.image}','${p.name}')"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
    <h3>${p.name}</h3>
    <p class="desc">${p.desc}</p>
    <a class="add waitlist-button" href="mailto:novanity2026@gmail.com?subject=Waitlist%20-%20${encodeURIComponent(p.name)}">Notify Me</a>
  </article>`;
}

function nv33StorefrontOrder(product){
  const id=nv33CanonicalProductKey(product);
  const everyday=['99-for-1','faith-over-fear','faithful-servant','child-of-god','every-knee-will-bow','disciple','repent-tee','jesus-is-king','protected-by-the-blood','king-of-kings','love-thy-neighbor-tee','satisfied'];
  const premium=['armor-of-god','burning-bush','crimson-worm','crown-33','lamb-of-god','lion-of-judah','parting-the-sea','philippians-4-13','prayer-cross','living-word','worthy-is-the-lamb','yahweh'];
  if(product?.id==='shroud-tee')return 0;
  if(product?.category==='Everyday Tees')return 100+(everyday.indexOf(id)>=0?everyday.indexOf(id):90);
  if(product?.category==='Hoodies')return 300;
  if(product?.category==='Shorts')return 400;
  if(product?.category==='Headwear')return 450;
  if(product?.category==="Women's Tees")return 500;
  if(product?.category==='Premium Tees')return 700+(premium.indexOf(id)>=0?premium.indexOf(id):90);
  return 900;
}

function renderAvailable(filter='All'){
  // Products shown in Founder's Collection are intentionally excluded here
  // so customers do not see duplicate cards on the same page.
  const items=products.filter(p=>p.status==='available'&&!p.founderFeatured&&(filter==='All'||p.category===filter)).sort((a,b)=>nv33StorefrontOrder(a)-nv33StorefrontOrder(b));
  grid.innerHTML=items.map(liveCard).join('');
}
function renderAll(){
  founderGrid.innerHTML=products.filter(p=>p.founderFeatured&&p.status==='available').map(liveCard).join('');
  comingGrid.innerHTML=products.filter(p=>p.status==='coming-soon').map(previewCard).join('');
  renderAvailable();
  renderCart();
}
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderAvailable(btn.dataset.filter);
  };
});
cartBtn.onclick=e=>{e.preventDefault();cartBox.classList.toggle('show');};

/* ===== NV33 LAUNCH DAY RUNTIME CATALOG FIX =====
   This runs after products.json loads, so approved defaults/removals
   apply even when an older catalog file is cached or contains duplicates.
*/
function nv33Key(value){
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

const NV33_LAUNCH_COLOR_RULES = [
  {match:['crimson-worm-tee','crimson-worm'], default:['navy'], remove:[]},
  {match:['crown33-tee','crown-33-tee','crown-33'], default:['graphite','dark-grey','dark-gray','charcoal'], remove:['heather-grey','light-grey','light-gray']},
  {match:['disciple-tee','disciple'], default:['military-green'], remove:[]},
  {match:['every-knee-will-bow-tee','every-knee-will-bow'], default:['black'], remove:['white']},
  {match:['faith-over-fear-tee','faith-over-fear'], default:['brown'], remove:[]},
  {match:['faithful-servant-tee','faithful-servant'], default:['navy'], remove:[]},
  {match:['jesus-is-king-tee','jesus-is-king'], default:['black'], remove:['orange']},
  {match:['lamb-of-god-tee','lamb-of-god'], default:['black'], remove:['pink']},
  {match:['lion-of-judah-tee','lion-of-judah'], default:['black'], remove:[]},
  {match:['love-thy-neighbor-tee','love-thy-neighbor'], default:['royal-blue','royal'], remove:['navy']},
  {match:['parting-the-sea-tee','parting-the-seas-tee','parting-the-sea','parting-the-seas'], default:['black'], remove:[]},
  {match:['philippians-4-13-tee','simple-cross-tee','philippians-4-13'], default:['black'], remove:[]},
  {match:['prayer-cross-tee','prayer-cross'], default:['black'], remove:[]},
  {match:['protected-by-the-blood-tee','protected-by-the-blood'], default:['navy'], remove:[]},
  {match:['shroud-tee','the-shroud-tee','shroud'], default:['black'], remove:[]},
  {match:['worthy-is-the-lamb-tee','worthy-lamb-grey-tee','worthy-is-the-lamb'], default:['natural','cream'], remove:['purple','maroon']},
  {match:['yahweh-tee','yahweh'], default:['black'], remove:[]}
];

function nv33FindRule(product){
  const candidates = [nv33Key(product.id), nv33Key(product.name)];
  return NV33_LAUNCH_COLOR_RULES.find(rule =>
    rule.match.some(m => candidates.some(c => c === m || c.includes(m)))
  );
}

function nv33CanonicalProductKey(product){
  const text=nv33Key(`${product?.id||''}-${product?.name||''}`);
  const aliases=[
    {terms:['parting-the-sea','parting-seas'],key:'parting-the-sea'},
    {terms:['living-word'],key:'living-word'},
    {terms:['prayer-cross','prayer-changes-things'],key:'prayer-cross'},
    {terms:['philippians-4-13','phillipians-4-13','simple-cross'],key:'philippians-4-13'},
    {terms:['crown-33-maroon','crown33-maroon','crown-33-tee','crown33-tee'],key:'crown-33'},
    {terms:['jesus-is-king'],key:'jesus-is-king'},
    {terms:['protected-by-the-blood'],key:'protected-by-the-blood'},
    {terms:['king-of-kings'],key:'king-of-kings'},
    {terms:['99-for-1','ninety-nine-for-one'],key:'99-for-1'},
    {terms:['crimson-worm'],key:'crimson-worm'},
    {terms:['armor-of-god'],key:'armor-of-god'},
    {terms:['every-knee-will-bow'],key:'every-knee-will-bow'},
    {terms:['disciple-tee'],key:'disciple'}
  ];
  const match=aliases.find(group=>group.terms.some(term=>text.includes(term)));
  return match?.key||String(product?.id||text);
}

function nv33CatalogScore(product){
  const image=String(product?.image||'');
  const colors=Array.isArray(product?.colors)?product.colors.length:0;
  return (image.includes('/corrected/')?1000:0)
    +(product?.status==='available'?200:0)
    +(colors?100:0)+colors
    +(product?.featured?20:0)
    +String(product?.desc||'').length/1000;
}

function nv33NormalizeCatalog(input){
  const chosen=new Map();
  const order=[];

  for(const original of Array.isArray(input)?input:[]){
    if(!original||!original.id)continue;
    const product={...original};
    const key=nv33CanonicalProductKey(product);
    if(!chosen.has(key)){
      chosen.set(key,product);
      order.push(key);
    }else if(nv33CatalogScore(product)>nv33CatalogScore(chosen.get(key))){
      chosen.set(key,product);
    }
  }

  return order.map(key=>chosen.get(key)).filter(product=>{
    /* Remove legacy standalone Crown 33 Maroon card now represented as a color variant. */
    return product.id!=='crown33-maroon-tee';
  }).map(product=>{
    const rule=nv33FindRule(product);
    if(rule&&Array.isArray(product.colors)&&product.colors.length){
      const removed=new Set(rule.remove);
      let colors=product.colors.filter(c=>!removed.has(nv33Key(c.name)));
      let selected=null;
      for(const preferred of rule.default){
        selected=colors.find(c=>nv33Key(c.name)===preferred);
        if(selected)break;
      }
      if(selected){ colors=[selected,...colors.filter(c=>c!==selected)]; }
      product.colors=colors;
    }
    return product;
  });
}

fetch('data/products.json?v=nv33-restored-clean-20260809-2358')
  .then(r=>{if(!r.ok)throw new Error('Catalog failed to load');return r.json();})
  .then(d=>{products=nv33NormalizeCatalog(d);renderAll();})
  .catch(err=>{
    console.error(err);
    grid.innerHTML='<p class="load-error">Product catalog could not load. Please refresh the page.</p>';
  });

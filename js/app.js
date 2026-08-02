const grid=document.getElementById('grid');
const founderGrid=document.getElementById('founderGrid');
const comingGrid=document.getElementById('comingGrid');
const cartBtn=document.getElementById('cartBtn');
const cartCount=document.getElementById('cartCount');
const cartBox=document.getElementById('cartBox');
let products=[];
let cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
const referralFromUrl=new URLSearchParams(location.search).get('ref');
if(referralFromUrl){
  localStorage.setItem('nv33ambassador',referralFromUrl.trim().toUpperCase());
}
const ambassadorCode=localStorage.getItem('nv33ambassador')||'';
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
  cart.push({id:p.id,name:p.name,price:p.price,size,color,stripePriceId:p.stripePriceId||'',shippingIncluded:!!p.shippingIncluded});
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
    <h3>Your Cart</h3>${ambassadorCode?`<div class="ambassador-cart-note">Ambassador code: <strong>${ambassadorCode}</strong> — 10% discount will be applied at checkout.</div>`:''}
    ${cart.length?cart.map((i,idx)=>`<div class="cartrow"><span>${i.name}<br><small>${i.color||''}${i.color?' • ':''}${i.size}</small></span><b>${money(i.price)}</b><button class="remove" onclick="removeCartItem(${idx})" aria-label="Remove item">×</button></div>`).join(''):'<p>Your cart is empty.</p>'}
    <p class="cart-total"><b>Total: ${money(total)}</b></p>
    <button class="add dark-button" onclick="clearCart()">Clear Cart</button>
    <a class="btn primary checkout-link" href="checkout.html">Secure Checkout →</a>`;
}
function colorChoices(p){
  if(!p.colors?.length)return '';
  return `<div class="selected-color" id="selected-color-${p.id}">Color: <strong>${p.colors[0].name}</strong></div>
    <div class="swatches" role="radiogroup" aria-label="Choose color for ${p.name}">
      ${p.colors.map((c,i)=>`<label class="swatch-wrap" title="${c.name}">
        <input type="radio" name="color-${p.id}" value="${c.name}" ${i===0?'checked':''}
          onchange="swapProductImage('${p.id}','${c.image}',this)">
        <span class="swatch ${i===0?'active':''}" style="--swatch:${swatchColor(c.name)}" aria-hidden="true"></span>
      </label>`).join('')}
    </div>`;
}
function swatchColor(name){
  const map={
    'Black':'#111111','White':'#ffffff','Sand':'#c8b18f','Natural':'#dfd2b6','Brown':'#7a563f',
    'Brown Savana':'#84684f','Chocolate':'#4b2e22','Military Green':'#66704f','Cardinal':'#861f3a',
    'Red':'#c92127','Maroon':'#651c32','Teal':'#147c7d','Tropical Blue':'#08a9bc',
    'Light Blue':'#9ecde5','Baby Blue':'#b9dff2','Carolina Blue':'#7baed1','Sky Blue':'#87ceeb',
    'Royal Blue':'#244d9b','Navy':'#17243a','Purple':'#5d3b78','Azalea':'#ef77a5','Pink':'#ef9fba',
    'Orange':'#e77725','Charcoal':'#454545','Dark Heather':'#3d3d3f','Graphite':'#55575a',
    'Graphite Heather':'#606266','Heather Grey':'#b9b9b7','Sport Grey':'#c3c3c1','Ice Grey':'#d9dcdd',
    'Haze':'#b7aaa7','Sapphire':'#126b9a','Cream':'#eee3c7'
  };
  return map[name]||'#c7a75b';
}
function swapProductImage(id,image,input){
  const img=document.getElementById('img-'+id);
  if(img)img.src=image;
  document.querySelectorAll(`input[name="color-${id}"]`).forEach(el=>{
    el.closest('label')?.querySelector('.swatch')?.classList.toggle('active',el.checked);
  });
  const label=document.querySelector(`#selected-color-${id} strong`);
  if(label)label.textContent=input.value;
}


function openImage(src,alt){
  let modal=document.getElementById('imageModal');
  if(!modal){
    modal=document.createElement('div');modal.id='imageModal';modal.className='image-modal';
    modal.innerHTML='<button aria-label="Close image">×</button><img alt="">';
    modal.onclick=e=>{if(e.target===modal||e.target.tagName==='BUTTON')modal.classList.remove('show');};
    document.body.appendChild(modal);
  }
  modal.querySelector('img').src=src;modal.querySelector('img').alt=alt;modal.classList.add('show');
}
function liveCard(p){
  const purchasable=p.status==='available';
  return `<article class="card product-card" id="${p.id}-card">
    <span class="badge">${p.tag||'Available'}</span>
    <div class="imgbox clickable" onclick="openImage(document.getElementById('img-${p.id}').src,'${p.name}')" title="Click to enlarge"><img id="img-${p.id}" src="${p.image}" alt="${p.name}" loading="lazy"></div>
    <h3>${p.name}</h3>
    <p class="price">${money(p.price)}</p>
    ${p.shippingIncluded?'<div class="free-shipping-badge">🚚 FREE U.S. SHIPPING</div>':'<div class="shipping-note">Shipping calculated at checkout</div>'}
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
function renderAvailable(filter='All'){
  // Products shown in Founder's Collection are intentionally excluded here
  // so customers do not see duplicate cards on the same page.
  const items=products.filter(p=>p.status==='available'&&!p.founderFeatured&&(filter==='All'||p.category===filter));
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
fetch('data/products.json?v=version9-ambassador')
  .then(r=>{if(!r.ok)throw new Error('Catalog failed to load');return r.json();})
  .then(d=>{products=d;renderAll();})
  .catch(err=>{
    console.error(err);
    grid.innerHTML='<p class="load-error">Product catalog could not load. Please refresh the page.</p>';
  });

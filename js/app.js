const grid=document.getElementById('grid');
const founderGrid=document.getElementById('founderGrid');
const comingGrid=document.getElementById('comingGrid');
const cartBtn=document.getElementById('cartBtn');
const cartCount=document.getElementById('cartCount');
const cartBox=document.getElementById('cartBox');

let products=[];
let cart=[];
try{
  cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
  if(!Array.isArray(cart)) cart=[];
}catch(e){ cart=[]; }

const money=v=>'$'+Number(v||0).toFixed(2);

function save(){
  localStorage.setItem('nv33cart',JSON.stringify(cart));
  renderCart();
}

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
  cart.push({
    id:p.id,name:p.name,price:p.price,size,color,
    stripePriceId:p.stripePriceId||'',
    shippingIncluded:!!p.shippingIncluded
  });
  save();
  if(cartBox) cartBox.classList.add('show');
}

function removeCartItem(index){cart.splice(index,1);save();}
function closeCart(){if(cartBox)cartBox.classList.remove('show');}
function clearCart(){cart=[];save();}

function renderCart(){
  if(!cartCount||!cartBox)return;
  cartCount.textContent=cart.length;
  const total=cart.reduce((s,i)=>s+Number(i.price||0),0);
  cartBox.innerHTML=`<button class="cart-close" onclick="closeCart()" aria-label="Close cart">×</button>
    <h3>Your Cart</h3>
    ${cart.length?cart.map((i,idx)=>`<div class="cartrow"><span>${i.name}<br><small>${i.color||''}${i.color?' • ':''}${i.size}</small></span><b>${money(i.price)}</b><button class="remove" onclick="removeCartItem(${idx})" aria-label="Remove item">×</button></div>`).join(''):'<p>Your cart is empty.</p>'}
    <p class="cart-total"><b>Total: ${money(total)}</b></p>
    <button class="add dark-button" onclick="clearCart()">Clear Cart</button>
    <a class="btn primary checkout-link" href="checkout.html">Secure Checkout →</a>`;
}

function swatchColor(name){
  const map={
    'Black':'#111','White':'#fff','Sand':'#c8b18f','Brown':'#7a563f',
    'Chocolate':'#4b2e22','Military Green':'#66704f','Cardinal':'#861f3a',
    'Red':'#c92127','Maroon':'#651c32','Teal':'#147c7d',
    'Tropical Blue':'#08a9bc','Light Blue':'#9ecde5','Baby Blue':'#b9dff2',
    'Carolina Blue':'#7baed1','Royal Blue':'#244d9b','Navy':'#17243a',
    'Purple':'#5d3b78','Charcoal':'#454545','Dark Heather':'#3d3d3f',
    'Graphite':'#55575a','Heather Grey':'#b9b9b7','Athletic Heather':'#c9c9c9',
    'Haze':'#b7aaa7','Cream':'#eee3c7','Grey':'#8c8c8c','Khaki':'#b69a6a','Natural':'#e7dfce','Blue':'#2454a6'
  };
  return map[name]||'#c7a75b';
}

function colorChoices(p){
  if(!Array.isArray(p.colors)||!p.colors.length)return '';
  if(p.id==='lion-of-judah-hoodie'){
    return `<div class="hoodie-color-control">
      <label for="hoodie-color-${p.id}">Hoodie Color</label>
      <select id="hoodie-color-${p.id}" class="hoodie-color-select" name="color-${p.id}" onchange="swapHoodieColor('${p.id}',this)">
        ${p.colors.map(c=>`<option value="${c.name}" data-image="${c.image}">${c.name}</option>`).join('')}
      </select>
      <div class="hoodie-color-key">${p.colors.map((c,i)=>`<span class="hoodie-color-chip ${i===0?'selected':''}" data-color="${c.name}"><i style="--swatch:${swatchColor(c.name)}"></i>${c.name}</span>`).join('')}</div>
    </div>`;
  }
  return `<div class="color-picker" aria-label="Choose color for ${p.name}">${p.colors.map((c,i)=>`
    <label class="color-option ${i===0?'selected':''}" title="${c.name}">
      <input type="radio" name="color-${p.id}" value="${c.name}" ${i===0?'checked':''} onchange="swapProductImage('${p.id}','${c.image}',this)">
      <span class="color-dot" style="--swatch:${swatchColor(c.name)}"></span><small>${c.name}</small>
    </label>`).join('')}</div>`;
}

function swapProductImage(id,image,input){
  const img=document.getElementById('img-'+id);
  if(img&&image)img.src=image;
  document.querySelectorAll(`input[name="color-${id}"]`).forEach(el=>{
    el.closest('label')?.classList.toggle('selected',el.checked);
  });
}

function swapHoodieColor(id,select){
  const option=select.options[select.selectedIndex];
  const image=option?.dataset.image;
  const img=document.getElementById('img-'+id);
  if(img&&image)img.src=image;
  document.querySelectorAll(`#${id}-card .hoodie-color-chip`).forEach(chip=>{
    chip.classList.toggle('selected',chip.dataset.color===select.value);
  });
}

function openImage(src,alt){
  let modal=document.getElementById('imageModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='imageModal';
    modal.className='image-modal';
    modal.innerHTML='<button aria-label="Close image">×</button><img alt="">';
    modal.onclick=e=>{
      if(e.target===modal||e.target.tagName==='BUTTON')modal.classList.remove('show');
    };
    document.body.appendChild(modal);
  }
  modal.querySelector('img').src=src;
  modal.querySelector('img').alt=alt;
  modal.classList.add('show');
}

function liveCard(p){
  const purchasable=p.status==='available';
  const firstColor=Array.isArray(p.colors)&&p.colors.length?p.colors[0]:null;
  const displayImage=p.image||((firstColor&&firstColor.image)||'');
  return `<article class="card product-card" id="${p.id}-card">
    <span class="badge">${p.tag||'Available'}</span>
    <div class="imgbox clickable" onclick="openImage(document.getElementById('img-${p.id}').src,'${p.name}')" title="Click to enlarge">
      <img id="img-${p.id}" src="${displayImage}" alt="${p.name}" loading="lazy">
    </div>
    <h3>${p.name}</h3>
    <p class="price">${money(p.price)}</p>
    <div class="free-shipping-badge">🚚 FREE U.S. SHIPPING</div>
    <p class="desc">${p.desc||'Premium Christian apparel.'}</p>
    ${colorChoices(p)}
    <select id="size-${p.id}" aria-label="Choose size for ${p.name}">
      ${(p.sizes&&p.sizes.length?p.sizes:['One Size']).map(s=>`<option>${s}</option>`).join('')}
    </select>
    ${purchasable?`<button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>`:`<a class="add waitlist-button" href="mailto:novanity2026@gmail.com?subject=Product%20Interest%20-%20${encodeURIComponent(p.name)}">Notify Me</a>`}
  </article>`;
}

function previewCard(p){
  return `<article class="card preview-card">
    <div class="preview-ribbon">FOUNDER'S PREVIEW</div>
    <div class="imgbox preview-img clickable" onclick="openImage('${p.image}','${p.name}')">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </div>
    <h3>${p.name}</h3>
    <p class="desc">${p.desc||''}</p>
    <a class="add waitlist-button" href="mailto:novanity2026@gmail.com?subject=Waitlist%20-%20${encodeURIComponent(p.name)}">Notify Me</a>
  </article>`;
}

function renderAvailable(filter='All'){
  if(!grid)return;
  const items=products.filter(p=>p.status==='available'&&!p.founderFeatured&&(filter==='All'||p.category===filter));
  grid.innerHTML=items.map(liveCard).join('');
}

function renderAll(){
  if(founderGrid){
    founderGrid.innerHTML=products.filter(p=>p.founderFeatured&&p.status==='available').map(liveCard).join('');
  }
  if(comingGrid){
    comingGrid.innerHTML=products.filter(p=>p.status==='coming-soon').map(previewCard).join('');
  }
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

if(cartBtn&&cartBox){
  cartBtn.onclick=e=>{
    e.preventDefault();
    cartBox.classList.toggle('show');
  };
}

async function loadCatalog(){
  try{
    // New URL + no-store prevents Cloudflare/browser from reusing the old broken JSON.
    const response=await fetch('data/products.json?v=hats-shorts-kok-loj-20260816-1',{cache:'no-store'});
    if(!response.ok)throw new Error(`Catalog request failed: HTTP ${response.status}`);
    const data=await response.json();
    if(!Array.isArray(data))throw new Error('Catalog is not an array');
    products=data;
    renderAll();
    console.log(`NV33 catalog loaded: ${products.length} products`);
  }catch(err){
    console.error('NV33 catalog load error:',err);
    if(grid){
      grid.innerHTML='<p class="load-error">Product catalog could not load. Please refresh the page.</p>';
    }
  }
}
loadCatalog();

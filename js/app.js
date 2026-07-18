const grid=document.getElementById('grid');
const founderGrid=document.getElementById('founderGrid');
const comingGrid=document.getElementById('comingGrid');
const cartBtn=document.getElementById('cartBtn');
const cartCount=document.getElementById('cartCount');
const cartBox=document.getElementById('cartBox');
let products=[];
let cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
const money=v=>'$'+Number(v||0).toFixed(2);

function save(){localStorage.setItem('nv33cart',JSON.stringify(cart));renderCart();}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p||p.status==='coming-soon')return;
  const size=document.getElementById('size-'+id)?.value||'One Size';
  cart.push({id:p.id,name:p.name,price:p.price,size,stripePriceId:p.stripePriceId||p.priceId||''});
  save();cartBox.classList.add('show');
}
function removeCartItem(index){cart.splice(index,1);save();}
function closeCart(){cartBox.classList.remove('show');}
function renderCart(){
  cartCount.textContent=cart.length;
  const total=cart.reduce((s,i)=>s+Number(i.price||0),0);
  cartBox.innerHTML=`<button class="cart-close" onclick="closeCart()" aria-label="Close cart">×</button><h3>Your Cart</h3>${cart.length?cart.map((i,idx)=>`<div class="cartrow"><span>${i.name}<br><small>${i.size}</small></span><b>${money(i.price)}</b><button class="remove" onclick="removeCartItem(${idx})" aria-label="Remove item">×</button></div>`).join(''):'<p>Your cart is empty.</p>'}<p class="cart-total"><b>Total: ${money(total)}</b></p><button class="add dark-button" onclick="cart=[];save()">Clear Cart</button><a class="btn primary checkout-link" href="checkout.html">Secure Checkout →</a>`;
}
function productCard(p,coming=false){
  const idAttr=p.id==='shroud-tee'?' id="shroud-tee-card"':'';
  if(coming){return `<article class="card coming-card"${idAttr}>
    <div class="coming-ribbon">COMING SOON</div>
    <div class="imgbox coming-img">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logos/crown33.png'">
      <div class="coming-overlay"><span>${p.comingSoonLabel||'In Development'}</span><small>Quality first. Launching when ready.</small></div>
    </div>
    <h3>${p.name}</h3>
    <p class="desc">${p.desc||'Currently in development.'}</p>
    <a class="add coming-button waitlist-button" href="mailto:novanity2026@gmail.com?subject=Waitlist%20-%20${encodeURIComponent(p.name)}">Join the Waitlist</a>
  </article>`;}
  return `<article class="card"${idAttr}><span class="badge">${p.tag||'Available'}</span><div class="imgbox"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logos/crown33.png'"></div><h3>${p.name}</h3><p class="price">${money(p.price)}</p><p class="desc">${p.desc||'Premium Christian apparel.'}</p><select id="size-${p.id}" aria-label="Choose size for ${p.name}">${(p.sizes||['One Size']).map(s=>`<option>${s}</option>`).join('')}</select><button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button></article>`;
}
function renderAvailable(filter='All'){
  const items=products.filter(p=>p.status!=='coming-soon'&&(filter==='All'||p.category===filter));
  grid.innerHTML=items.map(p=>productCard(p)).join('');
}
function renderAll(){
  founderGrid.innerHTML=products.filter(p=>p.founderFeatured&&p.status!=='coming-soon').map(p=>productCard(p)).join('');
  comingGrid.innerHTML=products.filter(p=>p.status==='coming-soon').map(p=>productCard(p,true)).join('');
  renderAvailable();renderCart();
}
document.querySelectorAll('[data-filter]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderAvailable(btn.dataset.filter);};});
cartBtn.onclick=e=>{e.preventDefault();cartBox.classList.toggle('show');};
fetch('data/products.json?v=version3-20260717').then(r=>{if(!r.ok)throw new Error('Catalog failed to load');return r.json();}).then(d=>{products=d;renderAll();}).catch(err=>{console.error(err);grid.innerHTML='<p class="load-error">Product catalog could not load. Please refresh the page.</p>';});

const cartKey='novanity33_cart';
function money(n){return '$'+Number(n).toFixed(2)}
function getCart(){try{return JSON.parse(localStorage.getItem(cartKey))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem(cartKey,JSON.stringify(c));updateCartCount()}
function updateCartCount(){const n=getCart().reduce((a,i)=>a+Number(i.qty||1),0);document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=n)}
function imageBgClass(p){return /hoodie|duffel|bottle|wristband|hat|beanie/i.test(p.name)?'dark':''}
function renderProducts(filter='All Products'){
 const grid=document.getElementById('productsGrid'); if(!grid) return;
 const list=filter==='All Products'?PRODUCTS:PRODUCTS.filter(p=>p.category===filter);
 grid.innerHTML=list.map((p,i)=>`<article class="product-card" data-category="${p.category}">
  <div class="image-wrap ${imageBgClass(p)}"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
  <div class="product-body"><div class="product-title">${p.name}</div><div class="price">${money(p.price)}</div>
  <div class="selectors"><select aria-label="Color">${p.colors.map(c=>`<option>${c}</option>`).join('')}</select><select aria-label="Size">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select></div>
  <div class="qty-row"><div class="qty-control"><button type="button" data-minus="${i}">−</button><span data-qty="${i}">1</span><button type="button" data-plus="${i}">+</button></div><button class="add-btn" data-add="${i}">Add to Cart</button></div>
  </div></article>`).join('');
 grid.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{const s=grid.querySelector(`[data-qty="${b.dataset.plus}"]`);s.textContent=Number(s.textContent)+1});
 grid.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const s=grid.querySelector(`[data-qty="${b.dataset.minus}"]`);s.textContent=Math.max(1,Number(s.textContent)-1)});
 grid.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const p=list[Number(b.dataset.add)];const card=b.closest('.product-card');const sels=card.querySelectorAll('select');const qty=Number(card.querySelector('[data-qty]').textContent);const cart=getCart();cart.push({id:p.id,name:p.name,price:p.price,image:p.image,color:sels[0].value,size:sels[1].value,qty});saveCart(cart);toast(`${p.name} added to cart`)})
}
function toast(t){const el=document.getElementById('toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();renderProducts();document.querySelectorAll('.filter-btn').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderProducts(btn.dataset.filter)})});

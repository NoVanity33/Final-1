const $ = (sel) => document.querySelector(sel);
const grid = $('#grid');
const cartCount = $('#cartCount');
const drawer = $('#cartDrawer');
let products = [];
let currentFilter = 'All';

function money(n){ return `$${Number(n).toFixed(2)}`; }
function getCart(){ return JSON.parse(localStorage.getItem('nv33_cart_v3') || '[]'); }
function saveCart(items){ localStorage.setItem('nv33_cart_v3', JSON.stringify(items)); updateCart(); }
function addToCart(id){
  const product = products.find(p=>p.id===id);
  const size = document.querySelector(`[data-size="${id}"]`)?.value || 'One Size';
  const cart = getCart();
  cart.push({id:product.id,name:product.name,price:product.price,size});
  saveCart(cart);
  drawer.classList.add('open');
}
function removeItem(i){ const cart=getCart(); cart.splice(i,1); saveCart(cart); }
function updateCart(){
  const cart = getCart();
  cartCount.textContent = cart.length;
  const list = $('#cartItems');
  const total = cart.reduce((s,i)=>s+Number(i.price),0);
  if(list){
    list.innerHTML = cart.length ? cart.map((i,idx)=>`<div class="cart-item"><span>${i.name}<br><small>${i.size}</small></span><strong>${money(i.price)}</strong><button onclick="removeItem(${idx})">×</button></div>`).join('') : '<p>Your cart is empty.</p>';
    $('#cartTotal').textContent = money(total);
  }
}
function render(){
  const list = currentFilter === 'All' ? products : products.filter(p=>p.category===currentFilter);
  grid.innerHTML = list.map(p=>`<article class="card">
    <div class="card-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logo/crown-33-mark.png'"></div>
    <div class="card-body">
      <span class="badge">${p.badge || p.category}</span>
      <h3>${p.name}</h3>
      <div class="scripture">${p.scripture || ''}</div>
      <div class="price">${money(p.price)}</div>
      <p class="desc">${p.description || ''}</p>
      <select data-size="${p.id}" aria-label="Choose size for ${p.name}">${(p.sizes||['One Size']).map(s=>`<option>${s}</option>`).join('')}</select>
      <button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
    </div>
  </article>`).join('');
}
function setupFilters(){
  document.querySelectorAll('[data-filter]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });
}
fetch('data/products.json').then(r=>r.json()).then(data=>{products=data; render(); setupFilters(); updateCart();});
window.addToCart = addToCart;
window.removeItem = removeItem;
window.clearCart = ()=>saveCart([]);
window.toggleCart = ()=>drawer.classList.toggle('open');

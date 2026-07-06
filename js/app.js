
const grid=document.getElementById('grid'), count=document.getElementById('cartCount'), box=document.getElementById('cartBox');
let products=[], cart=JSON.parse(localStorage.getItem('nv33_cart')||'[]');
const money=n=>'$'+Number(n||0).toFixed(2);
function save(){localStorage.setItem('nv33_cart',JSON.stringify(cart));count.textContent=cart.length;renderCart()}
function add(id){const p=products.find(x=>x.id===id); if(!p)return; const size=document.getElementById('size-'+id)?.value||'One Size'; cart.push({name:p.name,price:p.price,size}); save(); box.classList.add('show')}
function renderCart(){box.innerHTML=`<h3>Your Cart</h3>${cart.map(i=>`<div class="cart-row"><span>${i.name}<br><small>${i.size}</small></span><b>${money(i.price)}</b></div>`).join('')||'<p>Your cart is empty.</p>'}<p><b>Total: ${money(cart.reduce((s,i)=>s+Number(i.price||0),0))}</b></p><button class="add" onclick="cart=[];save()">Clear Cart</button><a class="btn primary" href="checkout.html">Checkout</a>`}
function render(f='All'){const list=products.filter(p=>f==='All'||p.category===f); grid.innerHTML=list.map(p=>`<article class="card"><div class="card-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logos/crown33-mark.png'"></div><div class="body"><h3>${p.name}</h3><p class="price">${money(p.price)}</p><p class="desc">${p.description||''}</p><select id="size-${p.id}">${(p.sizes||['One Size']).map(s=>`<option>${s}</option>`).join('')}</select><button class="add" onclick="add('${p.id}')">🛒 Add to Cart</button></div></article>`).join('')}
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
document.querySelector('.cart')?.addEventListener('click',e=>{e.preventDefault();box.classList.toggle('show');renderCart()});
fetch('data/products.json').then(r=>r.json()).then(d=>{products=d;render();count.textContent=cart.length;renderCart()});

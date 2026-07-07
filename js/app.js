
const grid=document.getElementById('grid'),cartBtn=document.getElementById('cartBtn'),cartCount=document.getElementById('cartCount'),cartBox=document.getElementById('cartBox');
let products=[],cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
const money=v=>'$'+Number(v||0).toFixed(2);
function save(){localStorage.setItem('nv33cart',JSON.stringify(cart));renderCart();}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const size=document.getElementById('size-'+id)?.value||'One Size';cart.push({name:p.name,price:p.price,size});save();cartBox.classList.add('show');}
function renderCart(){cartCount.textContent=cart.length;const total=cart.reduce((s,i)=>s+Number(i.price||0),0);cartBox.innerHTML=`<h3>Your Cart</h3>${cart.length?cart.map(i=>`<div class="cartrow"><span>${i.name}<br><small>${i.size}</small></span><b>${money(i.price)}</b></div>`).join(''):'<p>Your cart is empty.</p>'}<p><b>Total: ${money(total)}</b></p><button class="add" onclick="cart=[];save()">Clear Cart</button><a class="btn primary" href="checkout.html" style="margin-top:10px;width:100%;justify-content:center">Checkout</a>`}
function render(f='All'){const items=products.filter(p=>f==='All'||p.category===f||p.tag===f);grid.innerHTML=items.map(p=>`<article class="card"><span class="badge">${p.tag||'NEW'}</span><span class="heart">♡</span><div class="imgbox"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logos/crown33.png'"></div><h3>${p.name}</h3><p class="price">${money(p.price)}</p><p class="desc">${p.desc||'Premium Cotton'}</p><select id="size-${p.id}">${(p.sizes||['One Size']).map(s=>`<option>${s}</option>`).join('')}</select><button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button></article>`).join('');}
document.querySelectorAll('[data-filter]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter);};});
cartBtn.onclick=e=>{e.preventDefault();cartBox.classList.toggle('show');};
fetch('data/products.json').then(r=>r.json()).then(d=>{products=d;render();renderCart();});

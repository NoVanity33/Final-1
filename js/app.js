
const grid=document.getElementById('grid');
const cartBtn=document.getElementById('cartBtn');
const cartCount=document.getElementById('cartCount');
const cartBox=document.getElementById('cartBox');
let products=[];
let cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');
const money=v=>'$'+Number(v).toFixed(2);

function save(){localStorage.setItem('nv33cart',JSON.stringify(cart));renderCart();}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const size=document.getElementById('size-'+id)?.value||'One Size';
  cart.push({name:p.name,price:p.price,size});
  save();
  cartBox.classList.add('show');
}
function renderCart(){
  cartCount.textContent=cart.length;
  const total=cart.reduce((s,i)=>s+Number(i.price),0);
  cartBox.innerHTML=`<h3>Your Cart</h3>${cart.length?cart.map(i=>`<div class="cartrow"><span>${i.name}<br><small>${i.size}</small></span><b>${money(i.price)}</b></div>`).join(''):'<p>Your cart is empty.</p>'}<p><b>Total: ${money(total)}</b></p><button class="add" onclick="cart=[];save()">Clear Cart</button><a class="btn primary" style="margin-top:10px;width:100%;text-align:center" href="https://paypal.me/novanity33">Pay Now</a>`;
}
function render(filter='All'){
  const items=products.filter(p=>filter==='All'||p.category===filter||p.tag===filter);
  grid.innerHTML=items.map(p=>`
    <article class="card">
      <span class="badge">${p.tag}</span>
      <div class="imgbox"><img src="${p.image}" alt="${p.name}" onerror="this.src='assets/logos/lion33.png'"></div>
      <h4>${p.name}</h4>
      <p class="price">${money(p.price)}</p>
      <p class="desc">${p.desc}</p>
      <select id="size-${p.id}">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select>
      <button class="add" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
    </article>
  `).join('');
}
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  };
});
cartBtn.onclick=e=>{e.preventDefault();cartBox.classList.toggle('show');}
fetch('data/products.json')
  .then(r=>r.json())
  .then(d=>{products=d;render();renderCart();})
  .catch(()=>{grid.innerHTML='<p style="color:#f6c442">Product catalog could not load. Check data/products.json.</p>';});

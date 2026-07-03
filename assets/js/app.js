
let cart = JSON.parse(localStorage.getItem('nv33_cart') || '[]');
const grid=document.getElementById('productGrid');
const count=document.getElementById('cartCount');
const drawer=document.getElementById('cartDrawer');
function money(n){return '$'+Number(n).toFixed(2)}
function renderProducts(cat='All Products'){
 if(!grid) return;
 grid.innerHTML='';
 PRODUCTS.filter(p=>cat==='All Products'||p.category===cat).forEach(p=>{
  const el=document.createElement('article'); el.className='card';
  el.innerHTML=`<div class="imageBox"><img src="${p.image}" alt="${p.name}"></div><div class="cardBody"><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="controls"><select id="color-${p.id}">${p.colors.map(c=>`<option>${c}</option>`).join('')}</select><select id="size-${p.id}">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select></div><div class="controls"><input id="qty-${p.id}" type="number" min="1" value="1"><a class="printfulBtn" target="_blank" href="${p.printfulUrl}">Printful Link</a></div><button class="add" onclick="addToCart('${p.id}')">Add to Cart</button></div>`;
  grid.appendChild(el);
 });
}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const item={...p,color:document.getElementById('color-'+id).value,size:document.getElementById('size-'+id).value,qty:Number(document.getElementById('qty-'+id).value||1)};cart.push(item);save();openCart();}
function save(){localStorage.setItem('nv33_cart',JSON.stringify(cart)); if(count) count.textContent=cart.reduce((a,b)=>a+b.qty,0); renderCart();}
function renderCart(){const box=document.getElementById('cartItems'); if(!box)return; let total=0; box.innerHTML=''; cart.forEach((i,idx)=>{total+=i.price*i.qty; box.innerHTML+=`<div class="cartItem"><b>${i.name}</b><br>${i.size} / ${i.color}<br>Qty ${i.qty} — ${money(i.price*i.qty)} <button onclick="removeItem(${idx})">Remove</button></div>`}); document.getElementById('cartTotal').textContent=money(total);}
function removeItem(i){cart.splice(i,1);save()} function openCart(){drawer.classList.add('open');renderCart()} function closeCart(){drawer.classList.remove('open')}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.textContent.trim())}));
function checkout(){alert('Printful-ready build: connect Stripe/PayPal checkout or replace each product Printful link in assets/js/products.js.');}
renderProducts();save();

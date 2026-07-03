
const cart=[];
function money(n){return Number(n).toFixed(2)}
function updateCart(){
 const c=document.getElementById('cart-count'); const items=document.getElementById('cart-items'); const total=document.getElementById('cart-total');
 if(!items) return; c.textContent=cart.length;
 if(cart.length===0){items.textContent='Your cart is empty.'; total.textContent='0.00'; return;}
 let sum=cart.reduce((a,i)=>a+i.price,0); total.textContent=money(sum);
 items.innerHTML=cart.map(i=>`<div class="cart-line"><strong>${i.name}</strong> — Size ${i.size} — $${money(i.price)}</div>`).join('');
}
document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',e=>{
 const card=e.target.closest('.product-card'); const size=card.querySelector('.size-select')?.value || 'One Size';
 cart.push({name:e.target.dataset.name, price:Number(e.target.dataset.price), size}); updateCart(); location.hash='cart';
}));
document.querySelectorAll('.filter,[data-filter]').forEach(btn=>btn.addEventListener('click',e=>{
 const f=e.currentTarget.dataset.filter; if(!f) return;
 document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===f));
 document.querySelectorAll('.product-card').forEach(card=>{card.style.display=(f==='All'||card.dataset.category===f)?'block':'none'});
}));
document.getElementById('prayer-form')?.addEventListener('submit',e=>{e.preventDefault(); alert('Prayer request received locally for now. Backend connection comes next.');});
document.getElementById('pray-btn')?.addEventListener('click',()=>{document.getElementById('pray-count').textContent='34 praying';});

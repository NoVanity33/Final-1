
const STRIPE_LINKS = {
  // Paste real Stripe Payment Links here later, for example:
  // "Simple Cross Prayer Tee - Black": "https://buy.stripe.com/..."
};
let cart = JSON.parse(localStorage.getItem('nv33_cart') || '[]');
const saveCart = () => localStorage.setItem('nv33_cart', JSON.stringify(cart));
function updateCart(){
  const count = cart.reduce((n,i)=>n+i.qty,0);
  document.getElementById('cartCount').textContent = count;
  const box = document.getElementById('cartItems');
  const total = cart.reduce((sum,i)=>sum + i.price*i.qty,0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
  if(!cart.length){ box.innerHTML = '<p class="section-intro">Your cart is empty.</p>'; return; }
  box.innerHTML = cart.map((i,idx)=>`<div class="cart-row"><div><strong>${i.name}</strong><br><span>${i.size} • Qty ${i.qty}</span></div><div><strong>$${(i.price*i.qty).toFixed(2)}</strong> <button class="remove" data-idx="${idx}">Remove</button></div></div>`).join('');
  document.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click',()=>{cart.splice(+btn.dataset.idx,1);saveCart();updateCart();}));
}
document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click', e=>{
  const card = e.target.closest('.card');
  const name = card.dataset.name, price = Number(card.dataset.price), size = card.querySelector('.size').value;
  const existing = cart.find(i=>i.name===name && i.size===size);
  if(existing) existing.qty += 1; else cart.push({name,price,size,qty:1});
  saveCart(); updateCart(); document.getElementById('cart').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.card').forEach(card=>{card.style.display = (filter==='All' || card.dataset.category===filter) ? '' : 'none';});
}));
// product thumbnails and modal
const modal=document.getElementById('productModal'), modalImg=document.getElementById('modalImg'), modalThumbs=document.getElementById('modalThumbs');
function openModal(card, startSrc){
  const imgs=(card.dataset.gallery||card.dataset.img).split('|');
  modalImg.src=startSrc || imgs[0]; modalImg.alt=card.dataset.name;
  modalThumbs.innerHTML=imgs.map(src=>`<button type="button"><img src="${src}" alt="${card.dataset.name}"></button>`).join('');
  modalThumbs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>modalImg.src=b.querySelector('img').src));
  modal.setAttribute('aria-hidden','false');
}
document.querySelectorAll('.product-image-button').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.closest('.card'), btn.querySelector('img').src)));
document.querySelectorAll('.thumb').forEach(t=>t.addEventListener('click',()=>{const card=t.closest('.card'); const src=t.querySelector('img').getAttribute('src'); card.querySelector('.main-img').src=src;}));
document.getElementById('modalClose').addEventListener('click',()=>modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click',e=>{if(e.target===modal) modal.setAttribute('aria-hidden','true');});
// prayer wall local version
const defaultPrayers=[{name:'No Vanity 33',cat:'Mission',text:'Pray that this brand points people to Christ and helps those in need.',count:33}];
let prayers=JSON.parse(localStorage.getItem('nv33_prayers')||JSON.stringify(defaultPrayers));
function renderPrayers(){
  const list=document.getElementById('prayerList');
  list.innerHTML=prayers.map((p,i)=>`<div class="prayer-item"><h4>${p.name||'Anonymous'} • ${p.cat}</h4><p>${p.text}</p><div class="prayer-actions"><button class="btn secondary pray-btn" data-i="${i}">❤️ I’m praying</button><span>${p.count||0} praying</span></div></div>`).join('');
  document.querySelectorAll('.pray-btn').forEach(btn=>btn.addEventListener('click',()=>{prayers[+btn.dataset.i].count=(prayers[+btn.dataset.i].count||0)+1;localStorage.setItem('nv33_prayers',JSON.stringify(prayers));renderPrayers();}));
}
const form=document.getElementById('prayerForm');
form.addEventListener('submit',e=>{e.preventDefault(); const text=document.getElementById('prayerText').value.trim(); if(!text) return; prayers.unshift({name:document.getElementById('prayerName').value.trim()||'Anonymous',cat:document.getElementById('prayerCategory').value,text,count:0}); localStorage.setItem('nv33_prayers',JSON.stringify(prayers)); form.reset(); renderPrayers();});
document.getElementById('navToggle').addEventListener('click',()=>document.getElementById('navMenu').classList.toggle('open'));
renderPrayers(); updateCart();

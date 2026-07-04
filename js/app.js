
let products=[];
const grid=document.getElementById('grid');
const count=document.getElementById('cartCount');

function render(filter='All'){
  const visible=products.filter(p=>filter==='All'||p.category===filter);
  grid.innerHTML=visible.map(p=>`
    <article class="card">
      <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="price">$${Number(p.price).toFixed(2)}</p>
        <p class="purpose">${p.purpose}</p>
        <div class="opts">
          <select aria-label="Color"><option>${p.color}</option></select>
          <select aria-label="Size">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select>
        </div>
        <button class="add" onclick="addCart()">🛒 Add to Cart</button>
      </div>
    </article>
  `).join('');
}
function addCart(){
  const next=Number(localStorage.getItem('nv33cart')||0)+1;
  localStorage.setItem('nv33cart',next);
  count.textContent=next;
}
document.querySelectorAll('.filters button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});
fetch('data/products.json').then(r=>r.json()).then(data=>{
  products=data;
  render();
  count.textContent=localStorage.getItem('nv33cart')||0;
});

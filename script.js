let products=[];
const grid=document.getElementById('productGrid');
const cartCount=document.getElementById('cartCount');

function card(p,i){
  const colorOptions=[p.color].map(c=>`<option>${c}</option>`).join('');
  const sizeOptions=p.sizes.map(s=>`<option>${s}</option>`).join('');
  return `<article class="card" data-cat="${p.cat}">
    <img src="${p.image}" alt="${p.name}">
    <div class="card-body">
      <h3>${p.name}</h3>
      <p class="price">$${p.price.toFixed(2)}</p>
      <div class="options">
        <select aria-label="Color">${colorOptions}</select>
        <select aria-label="Size">${sizeOptions}</select>
      </div>
      <button class="add" onclick="addCart()">🛒 Add to Cart</button>
    </div>
  </article>`;
}
function render(filter='All'){
  grid.innerHTML=products.filter(p=>filter==='All'||p.cat===filter).map(card).join('');
}
function addCart(){
  const n=Number(localStorage.getItem('nv33cart')||0)+1;
  localStorage.setItem('nv33cart',n);
  cartCount.textContent=n;
}
document.querySelectorAll('.filters button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});
fetch('products.json').then(r=>r.json()).then(data=>{products=data;render();cartCount.textContent=localStorage.getItem('nv33cart')||0;});

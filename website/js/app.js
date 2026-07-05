
const grid=document.getElementById('grid');const count=document.getElementById('cartCount');
function addCart(){let n=Number(localStorage.getItem('nv33cart')||0)+1;localStorage.setItem('nv33cart',n);count.textContent=n}
fetch('data/products.json').then(r=>r.json()).then(products=>{
grid.innerHTML=products.map(p=>`<article class="card"><div class="card-img"><img src="${p.image}" alt="${p.name}"></div><div class="body"><h3>${p.name}</h3><p class="price">$${Number(p.price).toFixed(2)}</p><p class="purpose">${p.purpose}</p><div class="opts"><select><option>${p.color}</option></select><select>${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select></div><button class="add" onclick="addCart()">Add to Cart</button></div></article>`).join('');
count.textContent=localStorage.getItem('nv33cart')||0;
});

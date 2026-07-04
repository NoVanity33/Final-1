
let products = [];
const grid = document.getElementById('grid');
const count = document.getElementById('cartCount');

function render(filter = 'All') {
  const visible = products.filter(p => filter === 'All' || p.category === filter);
  grid.innerHTML = visible.map(p => `
    <article class="card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="price">$${Number(p.price).toFixed(2)}</p>
        <p class="purpose">${p.purpose || 'Wear the Word. Live the Gospel.'}</p>
        <div class="opts">
          <select aria-label="Color"><option>${p.color || 'Black'}</option></select>
          <select aria-label="Size">${(p.sizes || ['One Size']).map(s => `<option>${s}</option>`).join('')}</select>
        </div>
        <button class="add" onclick="addCart()">🛒 Add to Cart</button>
      </div>
    </article>
  `).join('');
}

function addCart() {
  const next = Number(localStorage.getItem('nv33cart') || 0) + 1;
  localStorage.setItem('nv33cart', next);
  count.textContent = next;
}

document.querySelectorAll('.filters button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.filter);
  });
});

fetch('data/products.json')
  .then(r => r.json())
  .then(data => {
    products = data;
    render();
    count.textContent = localStorage.getItem('nv33cart') || 0;
  });

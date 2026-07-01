const STORE = {
  email: 'novanity2026@gmail.com',
  paypalMe: 'https://paypal.me/novanity33',
  cashApp: 'https://cash.app/$NoVanity33'
};

const products = [
  // New $20 launch tees
  {id:'cross-prayer-black', category:'Launch Tees', name:'Simple Cross Prayer Tee - Black', price:20, img:'images/cross-prayer-black.png', desc:'Simple white cross front with Scripture and prayer invitation on back.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'cross-prayer-white', category:'Launch Tees', name:'Simple Cross Prayer Tee - White', price:20, img:'images/cross-prayer-white.png', desc:'Clean white tee with black cross, Scripture, and prayer invitation.', sizes:['S','M','L','XL','2XL','3XL'], colors:['White']},
  {id:'yahweh-black', category:'Launch Tees', name:'YAHWEH Scripture Tee - Black', price:20, img:'images/yahweh-black.png', desc:'YAHWEH arched chest design with Exodus Scripture on back.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'yahweh-white', category:'Launch Tees', name:'YAHWEH Scripture Tee - White', price:20, img:'images/yahweh-white.png', desc:'White YAHWEH Scripture tee with bold black lettering.', sizes:['S','M','L','XL','2XL','3XL'], colors:['White']},

  // Original restored catalog
  {id:'crown-thorns-33', category:'Shirts', name:'Crown of Thorns 33 Tee', price:25, img:'images/crown-thorns-33-tee.png', desc:'Crown of thorns with 33 and Isaiah 53:5 Scripture back.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'logo-crown-tee', category:'Shirts', name:'Gold Crown 33 Logo Tee', price:25, img:'images/logo-crown-tee.png', desc:'Minimal No Vanity 33 crown logo shirt with John 3:33.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'no-vanity-black', category:'Shirts', name:'No Vanity Statement Tee - Black', price:25, img:'images/no-vanity-shirt.png', desc:'No Vanity 33 statement tee with 1 Corinthians 10:31.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'no-vanity-tan', category:'Shirts', name:'No Vanity Statement Tee - Tan', price:25, img:'images/no-vanity-tan-shirt.png', desc:'Tan No Vanity 33 tee with Scripture back.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Tan']},
  {id:'christ-returns', category:'Shirts', name:'Christ Returns King of Kings Tee', price:30, img:'images/christ-returns-tee.png', desc:'Christ returning on the white horse with Revelation 19:11–16 theme.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'lion-judah', category:'Shirts', name:'Lion of Judah Tee', price:30, img:'images/lion-of-judah-tee.png', desc:'Lion of the tribe of Judah design with Revelation 5:5 back.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'crown-logo-alt', category:'Shirts', name:'Crown 33 Logo Tee Alt', price:25, img:'images/crown-thorns-logo-tee-alt.png', desc:'Alternate crown logo product image for No Vanity 33.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},

  {id:'black-cross-sweatpants', category:'Sweatpants', name:'Black Cross Scripture Sweatpants', price:45, img:'images/black-cross-sweatpants.png', desc:'Black sweatpants with cross and multiple Scripture references.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'gray-cross-sweatpants', category:'Sweatpants', name:'Gray Cross Scripture Sweatpants', price:45, img:'images/gray-cross-sweatpants.png', desc:'Gray sweatpants with cross and Scripture down the leg.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Gray']},
  {id:'gray-sweatpants-alt', category:'Sweatpants', name:'Gray Scripture Sweatpants Alt', price:45, img:'images/gray-sweatpants-alt.png', desc:'Alternate gray sweatpants product image.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Gray']},

  {id:'black-cross-shorts', category:'Shorts', name:'Black Cross Shorts', price:30, img:'images/black-cross-shorts.png', desc:'Black athletic shorts with simple white cross.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Black']},
  {id:'red-crown-shorts', category:'Shorts', name:'Red Crown 33 Shorts', price:30, img:'images/red-crown-shorts.png', desc:'Red shorts with crown 33 logo and Isaiah 53:5 Scripture.', sizes:['S','M','L','XL','2XL','3XL'], colors:['Red']},

  {id:'black-red-cross-socks', category:'Socks', name:'Black Socks with Red Cross', price:15, img:'images/black-red-cross-socks.png', desc:'Black crew socks with red cross on front.', sizes:['One Size'], colors:['Black / Red']},
  {id:'red-cross-socks', category:'Socks', name:'Red Cross Socks', price:15, img:'images/red-cross-socks.png', desc:'Red socks with white cross details.', sizes:['One Size'], colors:['Red']},
  {id:'blue-cross-socks', category:'Socks', name:'Blue Cross Socks', price:15, img:'images/blue-cross-socks.png', desc:'Blue socks with white cross details.', sizes:['One Size'], colors:['Blue']},
  {id:'green-cross-socks', category:'Socks', name:'Green Cross Socks', price:15, img:'images/green-cross-socks.png', desc:'Green socks with white cross details.', sizes:['One Size'], colors:['Green']}
];

let currentCategory = 'All';
let cart = [];

function money(n){ return Number(n).toFixed(2); }

function categories(){
  return ['All', ...Array.from(new Set(products.map(p => p.category)))];
}

function renderFilters(){
  const el = document.getElementById('filters');
  el.innerHTML = categories().map(cat => `<button class="filter-btn ${cat===currentCategory?'active':''}" data-cat="${cat}">${cat}</button>`).join('');
  el.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    currentCategory = btn.dataset.cat;
    renderFilters();
    renderProducts();
  }));
}

function productCard(p){
  return `<article class="card">
    ${p.category==='Launch Tees' ? '<span class="badge">New $20 Launch Tee</span>' : `<span class="badge">${p.category}</span>`}
    <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.opacity=.35;this.alt='Image missing: ${p.img}'">
    <h3>${p.name}</h3>
    <div class="price">$${money(p.price)}</div>
    <p class="desc">${p.desc}</p>
    <div class="options">
      <label>Size
        <select id="size-${p.id}">${p.sizes.map(s => `<option>${s}</option>`).join('')}</select>
      </label>
      <label>Color
        <select id="color-${p.id}">${p.colors.map(c => `<option>${c}</option>`).join('')}</select>
      </label>
    </div>
    <button class="btn add" onclick="addToCart('${p.id}')">Add to Cart</button>
  </article>`;
}

function renderProducts(){
  const list = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);
  document.getElementById('products').innerHTML = list.map(productCard).join('');
}

function addToCart(id){
  const p = products.find(x => x.id === id);
  const size = document.getElementById(`size-${id}`).value;
  const color = document.getElementById(`color-${id}`).value;
  cart.push({...p, size, color});
  renderCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  renderCart();
}

function renderCart(){
  document.getElementById('cartCount').textContent = cart.length;
  const items = document.getElementById('cartItems');
  if(!cart.length){
    items.innerHTML = '<p class="section-intro">Your cart is empty.</p>';
  } else {
    items.innerHTML = cart.map((item, i) => `<div class="cart-row">
      <div><strong>${item.name}</strong><br><span>${item.size} / ${item.color}</span></div>
      <div><strong>$${money(item.price)}</strong> <button onclick="removeFromCart(${i})">Remove</button></div>
    </div>`).join('');
  }
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  document.getElementById('cartTotal').textContent = money(total);
}

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderProducts();
  renderCart();
});

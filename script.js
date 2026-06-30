const products = [
  {id:'cross-prayer-black',name:'Simple Cross Prayer Tee - Black',price:20,img:'images/cross-prayer-black.png',desc:'Simple white cross on front with scripture and prayer invitation on the back.',featured:true},
  {id:'cross-prayer-white',name:'Simple Cross Prayer Tee - White',price:20,img:'images/cross-prayer-white.png',desc:'Clean black cross on front with scripture and prayer invitation on the back.',featured:true},
  {id:'yahweh-black',name:'YAHWEH Scripture Tee - Black',price:20,img:'images/yahweh-black.png',desc:'Slightly curved YAHWEH chest design with Exodus scripture on the back.',featured:true},
  {id:'yahweh-white',name:'YAHWEH Scripture Tee - White',price:20,img:'images/yahweh-white.png',desc:'Black YAHWEH chest design with Exodus scripture on the back.',featured:true},
  {id:'crown-tee',name:'Crown of Thorns 33 Tee',price:25,img:'images/crown-tee.svg',desc:'Logo front with bold scripture back.'},
  {id:'lion-tee',name:'Lion Crown Tee',price:25,img:'images/lion-tee.svg',desc:'Lion of Judah inspired front with scripture back.'},
  {id:'cross-bible-tee',name:'Cross & Open Bible Tee',price:25,img:'images/cross-bible-tee.svg',desc:'Simple cross front and Word-centered back.'},
  {id:'white-horse-tee',name:'Christ Returns Tee',price:30,img:'images/white-horse-tee.svg',desc:'White horse return design with King of Kings theme.'},
  {id:'armor-tee',name:'Armor of God Tee',price:25,img:'images/armor-tee.svg',desc:'Armor of God design with scripture back.'},
  {id:'black-shorts',name:'Black Sport Shorts',price:22,img:'images/black-shorts.svg',desc:'Simple cross athletic shorts.'},
  {id:'red-shorts',name:'Red Cross Shorts',price:22,img:'images/red-shorts.svg',desc:'Red shorts with gold cross detail.'},
  {id:'sweatpants',name:'Cross Scripture Sweatpants',price:35,img:'images/sweatpants.svg',desc:'Cross down one leg and scripture on the other.'},
  {id:'hoodie',name:'No Vanity 33 Hoodie',price:45,img:'images/hoodie.svg',desc:'Premium hoodie with crown logo and scripture.'},
  {id:'socks',name:'Cross Socks',price:12,img:'images/socks.svg',desc:'Black socks with red cross detail.'},
  {id:'custom-shirt',name:'Custom Scripture Shirt',price:30,img:'images/custom-shirt.svg',desc:'Use the Scripture Generator for the back.'},
  {id:'beanie',name:'Crown 33 Beanie',price:18,img:'images/beanie.svg',desc:'Simple No Vanity 33 headwear.'}
];

const verses = {
  faith:[
    'Hebrews 11:1 — Now faith is the substance of things hoped for, the evidence of things not seen.',
    '2 Corinthians 5:7 — For we walk by faith, not by sight.'
  ],
  strength:[
    'Philippians 4:13 — I can do all things through Christ which strengtheneth me.',
    'Isaiah 40:31 — They that wait upon the LORD shall renew their strength.'
  ],
  hope:[
    'Jeremiah 29:11 — For I know the thoughts that I think toward you, saith the LORD.',
    'Romans 15:13 — Now the God of hope fill you with all joy and peace in believing.'
  ],
  salvation:[
    'John 3:16 — For God so loved the world, that he gave his only begotten Son.',
    'Romans 10:9 — If thou shalt confess with thy mouth the Lord Jesus...'
  ],
  peace:[
    'John 14:27 — Peace I leave with you, my peace I give unto you.',
    'Philippians 4:7 — The peace of God, which passeth all understanding...'
  ]
};

let cart = [];
let currentVerse = '';

function productOptions(product) {
  const colors = product.id.includes('black') ? ['Black'] : product.id.includes('white') ? ['White'] : ['Black','White','Cream','Olive','Red','Gold','Gray'];
  return `
    <div class="options">
      <select id="size-${product.id}" aria-label="Size for ${product.name}">
        <option>S</option><option>M</option><option>L</option><option>XL</option><option>2X</option><option>3X</option>
      </select>
      <select id="color-${product.id}" aria-label="Color for ${product.name}">
        ${colors.map(c => `<option>${c}</option>`).join('')}
      </select>
    </div>`;
}

function renderProducts() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = products.map(p => `
    <div class="card ${p.featured ? 'featured-card' : ''}">
      ${p.featured ? '<div class="badge">New $20 Launch Tee</div>' : ''}
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p class="prayer-line">If you need prayer, just ask me.</p>
      ${productOptions(p)}
      <div class="price">$${p.price}</div>
      <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
    </div>`).join('');
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  cart.push({
    ...p,
    size: document.getElementById('size-' + id).value,
    color: document.getElementById('color-' + id).value,
    verse: currentVerse
  });
  renderCart();
  document.getElementById('cart').scrollIntoView({behavior:'smooth'});
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  document.getElementById('cartCount').textContent = cart.length;
  if (!cart.length) {
    document.getElementById('cartItems').textContent = 'Cart is empty.';
    document.getElementById('total').textContent = '0';
    return;
  }
  document.getElementById('cartItems').innerHTML = cart.map((i,n) => `
    <div class="cart-row">
      <span>${i.name} — ${i.size}, ${i.color}</span>
      <strong>$${i.price}</strong>
      <button class="remove" onclick="removeFromCart(${n})">Remove</button>
    </div>`).join('');
  document.getElementById('total').textContent = cart.reduce((s,i) => s + i.price, 0);
}

document.getElementById('generateVerse').onclick = () => {
  const t = document.getElementById('topic').value;
  const arr = verses[t];
  currentVerse = arr[Math.floor(Math.random() * arr.length)];
  document.getElementById('verseBox').textContent = currentVerse;
};

document.getElementById('useGenerated').onclick = () => {
  document.getElementById('customVerse').value = currentVerse || 'Let God choose my scripture.';
};

renderProducts();
renderCart();

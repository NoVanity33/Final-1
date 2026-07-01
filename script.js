const products = [
  {id:'cross-prayer-black',name:'Cross Prayer Tee - Black',price:20,img:'images/cross-prayer-black.png',desc:'Simple cross front, Scripture across the upper back, and a small prayer invitation.'},
  {id:'cross-prayer-white',name:'Cross Prayer Tee - White',price:20,img:'images/cross-prayer-white.png',desc:'White launch tee with black lettering, Scripture, and the No Vanity prayer invitation.'},
  {id:'yahweh-black',name:'YAHWEH Tee - Black',price:20,img:'images/qr-prayer-black.png',desc:'Bold faith tee with YAHWEH across the chest and Scripture on the back.'},
  {id:'yahweh-white',name:'YAHWEH Tee - White',price:20,img:'images/yahweh-white.png',desc:'White YAHWEH launch tee with Scripture on the back.'},

  {id:'crown-tee',name:'Crown of Thorns 33 Tee',price:25,img:'images/crown-tee.svg',desc:'Logo front with bold scripture back.'},
  {id:'lion-tee',name:'Lion Crown Tee',price:25,img:'images/lion-tee.svg',desc:'Lion of Judah inspired front with scripture back.'},
  {id:'cross-bible-tee',name:'Cross & Open Bible Tee',price:25,img:'images/cross-bible-tee.svg',desc:'Simple cross front and Word-centered back.'},
  {id:'white-horse-tee',name:'Christ Returns Tee',price:30,img:'images/white-horse-tee.svg',desc:'White horse return design with King of Kings theme.'},
  {id:'armor-tee',name:'Armor of God Tee',price:25,img:'images/armor-tee.svg',desc:'Armor of God design with scripture back.'},
  {id:'custom-shirt',name:'Custom Scripture Shirt',price:30,img:'images/custom-shirt.svg',desc:'Use the Scripture Generator for the back.'},
  {id:'hoodie',name:'No Vanity 33 Hoodie',price:45,img:'images/hoodie.svg',desc:'Premium hoodie with crown logo and scripture.'},
  {id:'sweatpants',name:'Cross Scripture Sweatpants',price:35,img:'images/sweatpants.svg',desc:'Cross down one leg and scripture on the other.'},
  {id:'black-shorts',name:'Black Sport Shorts',price:22,img:'images/black-shorts.svg',desc:'Simple cross athletic shorts.'},
  {id:'red-shorts',name:'Red Cross Shorts',price:22,img:'images/red-shorts.svg',desc:'Red shorts with gold cross detail.'},
  {id:'socks',name:'Cross Socks',price:12,img:'images/socks.svg',desc:'Cross socks with multiple color options.'},
  {id:'beanie',name:'Crown 33 Beanie',price:18,img:'images/beanie.svg',desc:'Simple No Vanity 33 headwear.'}
];

const verses={
  faith:['Hebrews 11:1 — Now faith is the substance of things hoped for, the evidence of things not seen.','2 Corinthians 5:7 — For we walk by faith, not by sight.'],
  strength:['Philippians 4:13 — I can do all things through Christ which strengtheneth me.','Isaiah 40:31 — They that wait upon the LORD shall renew their strength.'],
  hope:['Jeremiah 29:11 — For I know the thoughts that I think toward you, saith the LORD.','Romans 15:13 — Now the God of hope fill you with all joy and peace in believing.'],
  salvation:['John 3:16 — For God so loved the world, that he gave his only begotten Son.','Romans 10:9 — If thou shalt confess with thy mouth the Lord Jesus...'],
  peace:['John 14:27 — Peace I leave with you, my peace I give unto you.','Philippians 4:7 — The peace of God, which passeth all understanding...']
};

let cart=[];
let currentVerse='';

function renderProducts(){
  const productGrid = document.getElementById('products');
  productGrid.innerHTML=products.map(p=>`<div class="card">
    <div class="image-wrap"><img src="${p.img}" alt="${p.name}"></div>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <p class="prayer-line">If you need prayer, just ask me.</p>
    <div class="options">
      <select id="size-${p.id}"><option>S</option><option>M</option><option>L</option><option>XL</option><option>2X</option><option>3X</option></select>
      <select id="color-${p.id}"><option>Black</option><option>White</option><option>Cream</option><option>Olive</option><option>Red</option><option>Gold</option><option>Gray</option></select>
    </div>
    <div class="price">$${p.price}</div>
    <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
  </div>`).join('')
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  cart.push({...p,size:document.getElementById('size-'+id).value,color:document.getElementById('color-'+id).value,verse:currentVerse});
  renderCart();
}

function renderCart(){
  document.getElementById('cartCount').textContent=cart.length;
  if(!cart.length){document.getElementById('cartItems').textContent='Cart is empty.';document.getElementById('total').textContent='0';return}
  document.getElementById('cartItems').innerHTML=cart.map((i,n)=>`<div class="cart-row"><span>${i.name} — ${i.size}, ${i.color}</span><strong>$${i.price}</strong></div>`).join('');
  document.getElementById('total').textContent=cart.reduce((s,i)=>s+i.price,0)
}

document.getElementById('generateVerse').onclick=()=>{
  const t=document.getElementById('topic').value;
  const arr=verses[t];
  currentVerse=arr[Math.floor(Math.random()*arr.length)];
  document.getElementById('verseBox').textContent=currentVerse
};

document.getElementById('useGenerated').onclick=()=>{document.getElementById('customVerse').value=currentVerse||'Let God choose my scripture.'};

renderProducts();
renderCart();

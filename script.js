const products=[
{id:'cross-prayer-black',cat:'Launch Tees',name:'Simple Cross Prayer Tee - Black',price:20,img:'images/cross-prayer-black.webp',desc:'Simple cross front with Scripture back and prayer invitation.'},
{id:'cross-prayer-white',cat:'Launch Tees',name:'Simple Cross Prayer Tee - White',price:20,img:'images/cross-prayer-white.webp',desc:'White launch tee with black cross lettering and prayer message.'},
{id:'yahweh-black',cat:'Launch Tees',name:'YAHWEH Scripture Tee - Black',price:20,img:'images/yahweh-black.webp',desc:'YAHWEH arched chest design with Scripture on back.'},
{id:'yahweh-white',cat:'Launch Tees',name:'YAHWEH Scripture Tee - White',price:20,img:'images/yahweh-white.webp',desc:'White YAHWEH launch tee with Scripture on back.'},
{id:'crown-thorns',cat:'Shirts',name:'Crown of Thorns 33 Tee - Black',price:25,img:'images/crown-thorns-33.webp',desc:'Crown of thorns 33 design with Isaiah 53:5 on back.'},
{id:'no-vanity-black',cat:'Shirts',name:'No Vanity Statement Tee - Black',price:25,img:'images/no-vanity-black.webp',desc:'Bold No Vanity statement tee made to point attention back to God.'},
{id:'no-vanity-tan',cat:'Shirts',name:'No Vanity Statement Tee - Tan',price:25,img:'images/no-vanity-tan.webp',desc:'Tan No Vanity tee with clean everyday wear styling.'},
{id:'lion-judah',cat:'Shirts',name:'Lion of Judah Tee - Black',price:30,img:'images/lion-of-judah.webp',desc:'Lion of Judah artwork with bold Christ-centered presence.'},
{id:'christ-returns',cat:'Shirts',name:'Christ Returns King of Kings Tee',price:30,img:'images/christ-returns.webp',desc:'Christ returning imagery with Revelation 19:11–16 theme.'},
{id:'logo-crown',cat:'Shirts',name:'Gold Crown 33 Logo Tee',price:25,img:'images/logo-crown-black.webp',desc:'Clean No Vanity 33 crown logo tee.'},
{id:'black-sweats',cat:'Sweatpants',name:'Black Logo Cross Sweatpants',price:45,img:'images/black-logo-cross-sweatpants-clean.webp',desc:'Black sweatpants concept updated with logo and cross only.'},
{id:'gray-sweats',cat:'Sweatpants',name:'Gray Logo Cross Sweatpants',price:45,img:'images/gray-logo-cross-sweatpants-clean.webp',desc:'Gray sweatpants concept updated with logo and cross only.'},
{id:'cream-sweats',cat:'Sweatpants',name:'Cream Logo Cross Sweatpants',price:45,img:'images/cream-logo-cross-sweatpants-clean.webp',desc:'Third sweatpants color concept with logo and cross only.'},
{id:'black-shorts',cat:'Shorts',name:'Black Cross Shorts',price:30,img:'images/black-shorts.webp',desc:'Black athletic shorts with simple white cross.'},
{id:'red-shorts',cat:'Shorts',name:'Red Crown 33 Shorts',price:30,img:'images/red-shorts.webp',desc:'Red shorts with crown 33 branding.'},
{id:'white-shorts',cat:'Shorts',name:'White Crown 33 Shorts',price:30,img:'images/white-crown-shorts.webp',desc:'White shorts concept with No Vanity 33 styling.'},
{id:'black-socks',cat:'Socks',name:'Black Red Cross Socks',price:12,img:'images/black-socks.webp',desc:'Black socks with red cross design.'},
{id:'blue-socks',cat:'Socks',name:'Blue Cross Socks',price:12,img:'images/blue-socks.webp',desc:'Blue socks with white cross.'},
{id:'green-socks',cat:'Socks',name:'Green Cross Socks',price:12,img:'images/green-socks.webp',desc:'Green socks with white cross.'},
{id:'red-socks',cat:'Socks',name:'Red Cross Socks',price:12,img:'images/red-socks.webp',desc:'Red socks with white cross.'}
];
const sizes=['S','M','L','XL','2XL','3XL'];
let active='All';
let cart=JSON.parse(localStorage.getItem('nv33_cart')||'[]');
const fmt=n=>'$'+Number(n).toFixed(2);
function renderFilters(){const cats=['All',...new Set(products.map(p=>p.cat))];document.getElementById('filters').innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" data-cat="${c}">${c}</button>`).join('');document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{active=b.dataset.cat;renderProducts();renderFilters();});}
function renderProducts(){const list=active==='All'?products:products.filter(p=>p.cat===active);document.getElementById('products').innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy"></div><div class="product-body"><span class="tag">${p.cat}</span><h3>${p.name}</h3><div class="price">${fmt(p.price)}</div><p>${p.desc}</p><p class="gold">If you need prayer, just ask me.</p><div class="product-row"><label>Size <select id="size-${p.id}">${sizes.map(s=>`<option>${s}</option>`).join('')}</select></label><button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button></div></div></article>`).join('');}
function addToCart(id){const p=products.find(x=>x.id===id);const size=document.getElementById('size-'+id)?.value||'M';cart.push({...p,size,qty:1});localStorage.setItem('nv33_cart',JSON.stringify(cart));renderCart();location.hash='cart';}
function renderCart(){document.getElementById('cartCount').textContent=cart.length;const box=document.getElementById('cartItems');if(!cart.length){box.innerHTML='<p>Your cart is empty.</p>';document.getElementById('cartTotal').textContent='Total: $0.00';return;}box.innerHTML=cart.map((item,i)=>`<div class="cart-item"><span><b>${item.name}</b><br>Size: ${item.size}</span><span>${fmt(item.price)} <button class="pray-btn" onclick="removeItem(${i})">Remove</button></span></div>`).join('');const total=cart.reduce((a,b)=>a+b.price,0);document.getElementById('cartTotal').textContent='Total: '+fmt(total);}
function removeItem(i){cart.splice(i,1);localStorage.setItem('nv33_cart',JSON.stringify(cart));renderCart();}
document.querySelectorAll('[data-filter]').forEach(a=>a.addEventListener('click',()=>{active=a.dataset.filter;setTimeout(()=>{renderFilters();renderProducts()},80)}));
function renderPrayer(){let prayers=JSON.parse(localStorage.getItem('nv33_prayers')||'[]');if(!prayers.length) prayers=[{name:'No Vanity 33 • Mission',cat:'Mission',text:'Pray that this brand points people to Christ and helps those in need.',count:33}];document.getElementById('prayerList').innerHTML=prayers.map((p,i)=>`<div class="prayer-item"><h4>${p.name||'Anonymous'} • ${p.cat}</h4><p>${p.text}</p><button class="pray-btn" onclick="pray(${i})">❤️ I’m praying</button> <span>${p.count||0} praying</span></div>`).join('');}
function pray(i){let prayers=JSON.parse(localStorage.getItem('nv33_prayers')||'[]');if(!prayers.length) prayers=[{name:'No Vanity 33 • Mission',cat:'Mission',text:'Pray that this brand points people to Christ and helps those in need.',count:33}];prayers[i].count=(prayers[i].count||0)+1;localStorage.setItem('nv33_prayers',JSON.stringify(prayers));renderPrayer();}
document.getElementById('prayerForm').addEventListener('submit',e=>{e.preventDefault();let prayers=JSON.parse(localStorage.getItem('nv33_prayers')||'[]');prayers.unshift({name:document.getElementById('prayerName').value||'Anonymous',cat:document.getElementById('prayerCategory').value,text:document.getElementById('prayerText').value,count:0});localStorage.setItem('nv33_prayers',JSON.stringify(prayers));e.target.reset();renderPrayer();});
renderFilters();renderProducts();renderCart();renderPrayer();

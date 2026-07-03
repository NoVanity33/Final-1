const products=[
{n:'Lion of Judah Tee - Black',p:30,c:'tshirts',img:'lion-crown-tee.png',color:'Black'},
{n:'King of Kings Tee - Black',p:30,c:'tshirts',img:'christ-returns-tee.png',color:'Black'},
{n:'YAHWEH Tee - Black',p:20,c:'tshirts',img:'yahweh-black.png',color:'Black'},
{n:'No Vanity 33 Tee - White',p:25,c:'tshirts',img:'no-vanity-white.png',color:'White'},
{n:'Lion of Judah Hoodie - Black',p:50,c:'hoodies',img:'lion-crown-tee.png',color:'Black'},
{n:'Christ Returns Tee - Black',p:30,c:'tshirts',img:'christ-returns-tee.png',color:'Black'},
{n:'Lion Crown Tee - Black',p:30,c:'tshirts',img:'lion-crown-tee.png',color:'Black'},
{n:'YAHWEH Tee - White',p:20,c:'tshirts',img:'yahweh-white.png',color:'White'},
{n:'Cross & Discipleship Tee - Black',p:25,c:'tshirts',img:'discipleship-qr-tee.png',color:'Black'},
{n:'Prayer Cross Tee - Black',p:25,c:'tshirts',img:'crown-33-tee.png',color:'Black'},
{n:'Black Crown 33 Sweatpants',p:45,c:'sweatpants',img:'black-crown-sweatpants.png',color:'Black'},
{n:'Gray Crown 33 Sweatpants',p:45,c:'sweatpants',img:'gray-crown-sweatpants.png',color:'Gray'},
{n:'Tan Crown 33 Sweatpants',p:45,c:'sweatpants',img:'tan-crown-sweatpants.png',color:'Tan'},
{n:'Black Cross Shorts',p:30,c:'shorts',img:'black-cross-shorts.png',color:'Black'},
{n:'Red Crown 33 Shorts',p:30,c:'shorts',img:'red-crown-shorts.png',color:'Red'},
{n:'White Crown 33 Shorts',p:30,c:'shorts',img:'white-crown-shorts.png',color:'White'},
{n:'Cross Crew Socks (4-Pack)',p:20,c:'socks',img:'sock-pack.png',color:'4-Pack',sizes:['One Size']},
{n:'Cross Dad Hat - Black',p:20,c:'hats',img:'dad-hat.png',color:'Black',sizes:['One Size']},
{n:'No Vanity 33 Duffle Bag',p:60,c:'accessories',img:'duffle-bag.png',color:'Black',sizes:['One Size']},
{n:'No Vanity 33 Water Bottle',p:25,c:'accessories',img:'water-bottle.png',color:'Black',sizes:['One Size']},
{n:'Wear The Word. Wristband',p:5,c:'accessories',img:'wristband.png',color:'Black',sizes:['One Size']}
];
const sizes=['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL'];
const grid=document.getElementById('productGrid');let cart=JSON.parse(localStorage.getItem('nv33-cart')||'[]');function updateCart(){document.getElementById('cartCount').textContent=cart.reduce((a,b)=>a+b.qty,0)}
function render(){grid.innerHTML=products.map((x,i)=>`<article class="card" data-cat="${x.c}"><div class="product-img"><img src="assets/images/products/${x.img}" alt="${x.n}"></div><div class="info"><h3>${x.n}</h3><div class="price">$${x.p.toFixed(2)}</div><div class="selectors"><select><option>${x.color}</option></select><select>${(x.sizes||sizes).map(s=>`<option>${s}</option>`).join('')}</select></div><button class="add" data-i="${i}">🛒 Add to Cart</button></div></article>`).join('');document.querySelectorAll('.add').forEach(b=>b.onclick=()=>{const pr=products[b.dataset.i];cart.push({name:pr.n,price:pr.p,qty:1});localStorage.setItem('nv33-cart',JSON.stringify(cart));updateCart();b.textContent='✓ Added';setTimeout(()=>b.textContent='🛒 Add to Cart',900)})}
document.querySelectorAll('.filters button').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');let f=btn.dataset.filter;document.querySelectorAll('.card').forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.cat!==f))});render();updateCart();

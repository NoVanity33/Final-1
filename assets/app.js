const products=[
{id:'lion',name:'Lion of Judah Tee - Black',price:30,cat:'tshirts',img:'lion-judah-tee.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'king',name:'King of Kings Tee - Black',price:30,cat:'tshirts',img:'king-of-kings-tee.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'yahwehblack',name:'YAHWEH Tee - Black',price:20,cat:'tshirts',img:'yahweh-black.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'yahwehwhite',name:'YAHWEH Tee - White',price:20,cat:'tshirts',img:'yahweh-white.png',color:['White'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'novanitywhite',name:'No Vanity 33 Tee - White',price:25,cat:'tshirts',img:'no-vanity-white.png',color:['White'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL'],wide:true},
{id:'hoodie',name:'Lion of Judah Hoodie - Black',price:50,cat:'hoodies',img:'lion-judah-tee.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'christ',name:'Christ Returns Tee - Black',price:30,cat:'tshirts',img:'christ-returns-tee.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'lioncrown',name:'Lion Crown Tee - Black',price:30,cat:'tshirts',img:'lion-judah-tee.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'crossdisciple',name:'Cross & Discipleship Tee - Black',price:25,cat:'tshirts',img:'cross-discipleship.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'prayer',name:'Prayer Cross Tee - Black',price:25,cat:'tshirts',img:'prayer-cross.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'sg',name:'Crown 33 Sweatpants - Gray',price:45,cat:'sweatpants',img:'sweatpants-gray.png',color:['Gray'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL'],tall:true},
{id:'sb',name:'Crown 33 Sweatpants - Black',price:45,cat:'sweatpants',img:'sweatpants-black.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL'],tall:true},
{id:'st',name:'Crown 33 Sweatpants - Tan',price:45,cat:'sweatpants',img:'sweatpants-tan.png',color:['Tan'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL'],tall:true},
{id:'shb',name:'Crown 33 Shorts - Black',price:30,cat:'shorts',img:'black-cross-shorts.png',color:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'shr',name:'Crown 33 Shorts - Red',price:30,cat:'shorts',img:'red-crown-shorts.png',color:['Red'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'shw',name:'Crown 33 Shorts - White',price:30,cat:'shorts',img:'white-crown-shorts.png',color:['White'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'socks',name:'Cross Crew Socks (4-Pack)',price:20,cat:'socks',img:'socks-pack.png',color:['4-Pack'],sizes:['One Size'],wide:true},
{id:'hat',name:'Crown 33 Dad Hat - Black',price:20,cat:'hats',img:'hat.png',color:['Black'],sizes:['One Size']},
{id:'bag',name:'No Vanity 33 Duffle Bag',price:60,cat:'accessories',img:'duffle.png',color:['Black'],sizes:['One Size']},
{id:'bottle',name:'Crown 33 Water Bottle',price:25,cat:'accessories',img:'bottle.png',color:['Black'],sizes:['One Size']},
{id:'wrist',name:'Wear The Word. Wristband',price:5,cat:'accessories',img:'wristband.png',color:['Black'],sizes:['One Size']},
{id:'bible',name:'Bible Kit',price:25,cat:'accessories',img:'bible-kit.png',color:['Black'],sizes:['One Size'],wide:true}
];
const grid=document.getElementById('productGrid');
function opts(arr){return arr.map(v=>`<option>${v}</option>`).join('')}
function render(){grid.innerHTML=products.map(p=>`<article class="product ${p.tall?'tall':''} ${p.wide?'wide':''}" data-cat="${p.cat}"><div class="photo"><img src="assets/images/products/${p.img}" alt="${p.name}" loading="lazy"></div><div class="info"><h3 class="name">${p.name}</h3><p class="price">$${p.price.toFixed(2)}</p><div class="selectors"><select>${opts(p.color)}</select><select>${opts(p.sizes)}</select></div><button class="add" data-id="${p.id}">🛒 Add to Cart</button></div></article>`).join('')}
render();
document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');let f=btn.dataset.filter;document.querySelectorAll('.product').forEach(card=>card.classList.toggle('hide',f!=='all'&&card.dataset.cat!==f))}));
function count(){let c=JSON.parse(localStorage.getItem('nv33cart')||'[]');document.getElementById('cartCount').textContent=c.reduce((s,i)=>s+i.qty,0)}
document.addEventListener('click',e=>{if(e.target.classList.contains('add')){let card=e.target.closest('.product'),p=products.find(x=>x.id===e.target.dataset.id),sels=card.querySelectorAll('select');let cart=JSON.parse(localStorage.getItem('nv33cart')||'[]');cart.push({id:p.id,name:p.name,price:p.price,color:sels[0].value,size:sels[1].value,qty:1});localStorage.setItem('nv33cart',JSON.stringify(cart));count();e.target.textContent='Added ✓';setTimeout(()=>e.target.textContent='🛒 Add to Cart',900)}});count();

const PRODUCTS=[
{id:'prayer-cross-tee',name:'Prayer Cross Tee - Black',cat:'tees',price:25,img:'No Vanity Shirt(5).png',file:'no-vanity-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'discipleship-tee',name:'Discipleship QR Tee - Black',cat:'tees',price:25,file:'logo-33-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'crown-33-tee',name:'Crown 33 Tee - Black',cat:'tees',price:25,file:'crown-33-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'lion-judah-tee',name:'Lion of Judah Tee - Black',cat:'tees',price:30,file:'lion-of-judah-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'christ-returning-tee',name:'Christ Returning Tee - Black',cat:'tees',price:30,file:'christ-returning-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'crown-thorns-tee',name:'Crown of Thorns 33 Tee - Black',cat:'tees',price:25,file:'crown-of-thorns-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'lion-hoodie',name:'Lion of Judah Hoodie - Black',cat:'hoodies',price:50,file:'lion-of-judah-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'cross-hoodie',name:'Cross Hoodie - Black',cat:'hoodies',price:50,file:'no-vanity-tee.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'black-crown-sweats',name:'Black Crown 33 Sweatpants',cat:'sweatpants',price:45,file:'black-crown-33-sweatpants.png',colors:['Black'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'gray-crown-sweats',name:'Gray Crown 33 Sweatpants',cat:'sweatpants',price:45,file:'gray-crown-33-sweatpants.png',colors:['Gray'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'tan-crown-sweats',name:'Tan Crown 33 Sweatpants',cat:'sweatpants',price:45,file:'tan-crown-33-sweatpants.png',colors:['Tan'],sizes:['Youth S','Youth M','Youth L','S','M','L','XL','2XL','3XL']},
{id:'black-shorts',name:'Black Cross Shorts',cat:'shorts',price:30,file:'black-cross-shorts.png',colors:['Black'],sizes:['S','M','L','XL','2XL','3XL']},
{id:'white-shorts',name:'White Crown 33 Shorts',cat:'shorts',price:30,file:'white-crown-33-shorts.png',colors:['White'],sizes:['S','M','L','XL','2XL','3XL']},
{id:'red-shorts',name:'Red Crown 33 Shorts',cat:'shorts',price:30,file:'red-crown-33-shorts.png',colors:['Red'],sizes:['S','M','L','XL','2XL','3XL']},
{id:'black-socks',name:'Black Red Cross Socks',cat:'socks',price:15,file:'black-red-cross-socks.png',colors:['Black'],sizes:['S','M','L']},
{id:'blue-socks',name:'Blue Cross Socks',cat:'socks',price:15,file:'blue-cross-socks.png',colors:['Blue'],sizes:['S','M','L']},
{id:'green-socks',name:'Green Cross Socks',cat:'socks',price:15,file:'green-cross-socks.png',colors:['Green'],sizes:['S','M','L']},
{id:'duffel',name:'No Vanity 33 Duffel Bag',cat:'accessories',price:60,file:'duffel-bag.png',colors:['Black'],sizes:['One Size']},
{id:'water-bottle',name:'No Vanity 33 Water Bottle',cat:'accessories',price:25,file:'logo-33-tee.png',colors:['Black'],sizes:['One Size']},
{id:'wristband',name:'Wear The Word Wristband',cat:'accessories',price:5,file:'crown-33-tee.png',colors:['Black'],sizes:['One Size']}
];
let cart=JSON.parse(localStorage.getItem('nv33_cart')||'[]');
const grid=document.getElementById('productGrid');
function money(n){return '$'+n.toFixed(2)}
function render(filter='all'){
 grid.innerHTML='';
 PRODUCTS.filter(p=>filter==='all'||p.cat===filter).forEach(p=>{
  const card=document.createElement('article'); card.className='card';
  card.innerHTML=`<div class="photo"><img src="assets/images/products/${p.file}" alt="${p.name}"></div><div class="info"><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="controls"><select class="color">${p.colors.map(c=>`<option>${c}</option>`).join('')}</select><select class="size">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select></div><div class="controls"><div class="qty-control"><button class="minus">−</button><span class="qty">1</span><button class="plus">+</button></div><button class="add">Add to Cart</button></div><span class="printful-note" data-printful-id="ADD_PRINTFUL_PRODUCT_ID_HERE"></span></div>`;
  let qty=1; card.querySelector('.minus').onclick=()=>{qty=Math.max(1,qty-1);card.querySelector('.qty').textContent=qty}; card.querySelector('.plus').onclick=()=>{qty++;card.querySelector('.qty').textContent=qty}; card.querySelector('.add').onclick=()=>{cart.push({id:p.id,name:p.name,price:p.price,qty,color:card.querySelector('.color').value,size:card.querySelector('.size').value});saveCart();openCart()};
  grid.appendChild(card);
 });
}
function saveCart(){localStorage.setItem('nv33_cart',JSON.stringify(cart));document.getElementById('cartCount').textContent=cart.reduce((a,i)=>a+i.qty,0)}
function openCart(){const items=document.getElementById('cartItems');items.innerHTML=cart.length?cart.map(i=>`<div class="cart-row"><b>${i.name}</b><br>${i.color} / ${i.size} × ${i.qty}<br>${money(i.price*i.qty)}</div>`).join(''):'<p>Your cart is empty.</p>';document.getElementById('cartTotal').textContent=money(cart.reduce((a,i)=>a+i.price*i.qty,0));document.getElementById('cartDrawer').classList.add('open')}
document.getElementById('cartButton').onclick=openCart;document.getElementById('closeCart').onclick=()=>document.getElementById('cartDrawer').classList.remove('open');
document.querySelectorAll('#filters button').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter)});
render();saveCart();

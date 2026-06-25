const products = [
  {
    id: "christ-returning",
    name: "Christ Returning Tee",
    price: 35,
    image: "images/christ-returning.png",
    description: "King of Kings artwork with Revelation 19 design."
  },
  {
    id: "lion-judah",
    name: "Lion of Judah Tee",
    price: 35,
    image: "images/lion-head.png",
    description: "Lion with crown of thorns and Revelation 5:5 back."
  },
  {
    id: "crown-thorns",
    name: "Crown of Thorns 33 Tee",
    price: 35,
    image: "images/crown-of-thorns-shirt.png",
    description: "Crown of thorns 33 front with Isaiah 53:5 back."
  },
  {
    id: "logo-shirt",
    name: "No Vanity 33 Logo Tee",
    price: 30,
    image: "images/logo-shirt.png",
    description: "No Vanity 33 crown logo with John 3:33."
  },
  {
    id: "no-vanity-shirt",
    name: "No Vanity Scripture Tee",
    price: 30,
    image: "images/no-vanity-shirt.png",
    description: "No Vanity 33 front with 1 Corinthians 10:31 back."
  },
  {
    id: "black-shorts",
    name: "Black Cross Shorts",
    price: 30,
    image: "images/black-shorts.png",
    description: "Black athletic shorts with a simple white cross."
  },
  {
    id: "red-shorts",
    name: "Red 33 Shorts",
    price: 30,
    image: "images/red-shorts.png",
    description: "Red shorts with crown 33 and Isaiah 53:5."
  },
  {
    id: "white-shorts",
    name: "White 33 Shorts",
    price: 30,
    image: "images/white-shorts.png",
    description: "White shorts with crown 33 and Isaiah 53:5."
  },
  {
    id: "black-sweatpants",
    name: "Black Scripture Sweatpants",
    price: 45,
    image: "images/black-sweatpants.png",
    description: "Black sweats with cross and scripture leg design."
  },
  {
    id: "grey-sweats",
    name: "Grey Scripture Sweatpants",
    price: 45,
    image: "images/grey-sweats.png",
    description: "Grey sweats with cross and scripture leg design."
  },
  {
    id: "black-socks",
    name: "Long Black Cross Socks",
    price: 15,
    image: "images/long-black-socks.png",
    description: "Black socks with red cross design."
  }
];

const verses = [
  "2 Corinthians 5:7 — For we walk by faith, not by sight.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "1 Corinthians 10:31 — Whatever you do, do all to the glory of God.",
  "Joshua 1:9 — Be strong and courageous. Do not be afraid.",
  "Jeremiah 29:11 — For I know the plans I have for you, declares the Lord.",
  "John 3:16 — For God so loved the world, that he gave his only begotten Son.",
  "Isaiah 53:5 — By His wounds we are healed.",
  "Revelation 5:5 — The Lion of the tribe of Judah, the Root of David, has triumphed."
];

const sizes = ["S", "M", "L", "XL", "2X", "3X"];
const colors = ["Black", "White", "Cream", "Olive", "Red", "Grey", "Gold"];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">$${product.price}</div>
        <div class="controls">
          <select id="size-${product.id}">
            ${sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
          </select>
          <select id="color-${product.id}">
            ${colors.map(color => `<option value="${color}">${color}</option>`).join("")}
          </select>
        </div>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  const size = document.getElementById(`size-${productId}`).value;
  const color = document.getElementById(`color-${productId}`).value;

  cart.push({ ...product, size, color });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartCount.textContent = cart.length;

  cartItems.innerHTML = cart.length ? cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong><br>
        Size: ${item.size} | Color: ${item.color}
      </div>
      <div>
        $${item.price}
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    </div>
  `).join("") : "<p>Your cart is empty.</p>";

  cartTotal.textContent = cart.reduce((sum, item) => sum + item.price, 0);
}

document.getElementById("verseBtn").addEventListener("click", () => {
  const verse = verses[Math.floor(Math.random() * verses.length)];
  document.getElementById("verseText").textContent = verse;
});

renderProducts();
renderCart();

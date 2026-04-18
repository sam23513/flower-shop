let cart = [];

const products = [
  { name: "Rose", price: 10 },
  { name: "Tulip", price: 8 },
  { name: "Sunflower", price: 12 }
];

function renderProducts() {
  const div = document.getElementById("products");
  div.innerHTML = "";

  products.forEach((p, i) => {
    div.innerHTML += `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="add(${i})">Add</button>
      </div>
    `;
  });
}

function add(i) {
  cart.push(products[i]);
  renderCart();
}

function renderCart() {
  const div = document.getElementById("cart");
  div.innerHTML = cart.map(c => `<p>${c.name} - $${c.price}</p>`).join("");
}

async function signup() {
  await fetch("/signup", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  alert("Account created!");
}

async function login() {
  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  if (res.ok) {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("shop").classList.remove("hidden");
    renderProducts();
  } else {
    alert("Login failed");
  }
}

async function checkout() {
  await fetch("/order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ cart })
  });

  alert("Order placed!");
  cart = [];
  renderCart();
}

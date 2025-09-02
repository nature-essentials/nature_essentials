// -----------------------------
// Utility: format currency
// -----------------------------
function formatPrice(price) {
  return new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency: "MKD",
    minimumFractionDigits: 0
  }).format(price);
}

// -----------------------------
// Toggle product description
// -----------------------------
function toggleDesc(button) {
  const desc = button.nextElementSibling;
  desc.classList.toggle("open");
  button.textContent = desc.classList.contains("open")
    ? "Hide Details"
    : "Details";
}

// -----------------------------
// Add to Cart (basic example)
// -----------------------------
function addToCart(name, price) {
  console.log(`Added to cart: ${name} - ${price}`);
  // TODO: Hook into your real cart logic
  showToast(`${name} added to cart!`);
}

// -----------------------------
// Toast notification
// -----------------------------
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// -----------------------------
// Load products from JSON
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  fetch("json/products.json")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("products-container");
      container.innerHTML = "";

      products.forEach((p) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}" />
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="price">${formatPrice(p.price)}</p>
            <button class="btn btn-primary" onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
            <button class="toggle-desc" onclick="toggleDesc(this)">Details</button>
            <div class="product-desc">
              <p>${p.description}</p>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error loading products:", err);
    });
});

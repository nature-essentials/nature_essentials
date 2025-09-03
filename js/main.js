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

// // -----------------------------
// // Toggle product description
// // -----------------------------
function toggleDesc(button) {
  const card = button.closest(".product-card"); // find parent card
  const desc = card.querySelector(".product-desc"); // only inside this card
  if (!desc) return;

  desc.classList.toggle("open");
  button.textContent = desc.classList.contains("open")
    ? "Hide Details"
    : "Details";
}


function openModal(product) {
  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-price").textContent = formatPrice(product.price);
  document.getElementById("modal-description").textContent = product.description || "No description available.";

  // Add-to-cart inside modal
  const addBtn = document.getElementById("modal-add-to-cart");
  addBtn.onclick = () => addToCart(product.name, product.price, product.image);

  document.getElementById("product-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("product-modal").style.display = "none";
}

// Close modal if user clicks outside
window.onclick = function (event) {
  const modal = document.getElementById("product-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


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
// document.addEventListener("DOMContentLoaded", () => {
//   fetch("json/products.json")
//     .then((res) => res.json())
//     .then((products) => {
//       const container = document.getElementById("products-container");
//       container.innerHTML = "";

//       products.forEach((p) => {
//         const card = document.createElement("article");
//         card.className = "product-card";
//         card.innerHTML = `
//           <img src="${p.image}" alt="${p.name}" />
//           <div class="product-info">
//             <h3>${p.name}</h3>
//             <p class="price">${formatPrice(p.price)}</p>
//             <button class="btn btn-primary" onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
//             <button class="btn btn-secondary" onclick='openModal(${JSON.stringify(p)})'>Details</button>
//             <div class="product-desc">
//               <p>${p.description}</p>
//             </div>
//           </div>
//         `;
//         container.appendChild(card);
//       });
//     })
//     .catch((err) => {
//       console.error("Error loading products:", err);
//     });
// });
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
            <button class="btn btn-secondary" onclick='showDetails(this, ${JSON.stringify(p)})'>Details</button>
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

function showDetails(button, product) {
  if (window.innerWidth <= 768) {
    // Mobile: toggle only inside this card
    const card = button.closest(".product-card");
    const desc = card.querySelector(".product-desc");

    if (!desc) return;

    const isOpen = desc.classList.contains("open");
    desc.classList.toggle("open");

    button.textContent = isOpen ? "Details" : "Hide Details";
  } else {
    // Desktop: open modal
    const modal = document.getElementById("product-modal");
    document.getElementById("modal-name").textContent = product.name;
    document.getElementById("modal-price").textContent = formatPrice(product.price);
    document.getElementById("modal-description").textContent = product.description;
    document.getElementById("modal-image").src = product.image;

    const addBtn = document.getElementById("modal-add-to-cart");
    addBtn.onclick = () => addToCart(product.name, product.price, product.image);

    modal.style.display = "flex";
  }
}


function closeModal() {
  document.getElementById("product-modal").style.display = "none";
}



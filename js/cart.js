/* -------------------------
   Minimal Storefront Cart
   ------------------------- */

const CART_KEY = "cart_v1";
// --- EmailJS config (fill these from your dashboard) ---
const EMAILJS_SERVICE_ID = "service_989u6eg";
const EMAILJS_TEMPLATE_ID = "template_fegxrje";


/* Cart helpers */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function formatCurrency(n) {
  return `${Number(n).toFixed(0)} ден`;
}

/* Header badge count */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  const count = getCart().reduce((acc, it) => acc + it.qty, 0);
  countEl.textContent = count;
}

/* Add item */
function addToCart(name, price, image) {
  const cart = getCart();
  const found = cart.find(i => i.name === name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name, price: Number(price), qty: 1, image });
  }
  saveCart(cart);
  showToast(`${name} додадено во кошничка 🛒`);
}

/* Toast feedback */
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 2500);
}

/* Remove item */
function removeFromCart(name) {
  let cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
  renderCart();
}

/* Update quantity */
function setQty(name, qty) {
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) item.qty = qty;
  saveCart(cart);
  renderCart();
}

/* Render cart list */
// function renderCart() {
//   const wrap = document.getElementById("cart-items");
//   if (!wrap) return;

//   const cart = getCart();
//   wrap.innerHTML = "";

//   if (cart.length === 0) {
//     wrap.innerHTML = `<div class="empty">Your cart is empty. <a href="products.html">Browse products</a>.</div>`;
//     renderCartTotals();
//     return;
//   }

//   cart.forEach(item => {
//     const row = document.createElement("div");
//     row.className = "cart-row";
//     row.innerHTML = `
//       <div class="cart-item-name">${item.name}</div>
//       <div class="cart-item-controls">
//         <label class="qty">
//           <span>Qty</span>
//           <input type="number" min="1" value="${item.qty}" aria-label="Quantity for ${item.name}" />
//         </label>
//         <div class="cart-item-price">${formatCurrency(item.price * item.qty)}</div>
//         <button class="link danger" aria-label="Remove ${item.name}">Remove</button>
//       </div>
//     `;

//     row.querySelector("input").addEventListener("change", (e) => setQty(item.name, e.target.value));
//     row.querySelector("button").addEventListener("click", () => removeFromCart(item.name));

//     wrap.appendChild(row);
//   });

//   renderCartTotals();
// }
/* Render cart list (cart.html) */
function renderCart() {
  const wrap = document.getElementById("cart-items");
  if (!wrap) return;

  const cart = getCart();
  wrap.innerHTML = "";

  if (cart.length === 0) {
    wrap.innerHTML = `<div class="empty">Your cart is empty. <a href="products.html">Browse products</a>.</div>`;
    renderCartTotals();
    return;
  }

  cart.forEach(item => {
    // fallback image if missing
    const imageUrl = item.image 
      ? `https://nature-essentials.github.io/nature_essentials/${item.image}` 
      : "https://nature-essentials.github.io/nature_essentials/images/logo.png";

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${imageUrl}" 
             alt="${item.name}" width="64" height="64" />
      </div>
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-controls">
        <label class="qty">
          <span>Qty</span>
          <input type="number" min="1" value="${item.qty}" aria-label="Quantity for ${item.name}" />
        </label>
        <div class="cart-item-price">${formatCurrency(item.price * item.qty)}</div>
        <button class="link danger" aria-label="Remove ${item.name}">Remove</button>
      </div>
    `;

    // listeners
    row.querySelector("input").addEventListener("change", (e) => setQty(item.name, e.target.value));
    row.querySelector("button").addEventListener("click", () => removeFromCart(item.name));

    wrap.appendChild(row);
  });

  renderCartTotals();
}


/* Totals */
function renderCartTotals() {
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (!subtotalEl || !totalEl) return;
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal);
}

/* Checkout submission via EmailJS */
function handleCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const data = new FormData(form);
    const name = data.get("name")?.toString().trim();
    const phone = data.get("phone")?.toString().trim();
    const address = data.get("address")?.toString().trim();
    const email = data.get("email")?.toString().trim();

    const orderId = `NE-${Date.now().toString().slice(-6)}`;
    const orderTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // Map cart items to match EmailJS template
    const orders = cart.map(i => ({
      name: i.name,
      units: i.qty, // matches {{units}}
      line_total: i.price * i.qty, // matches {{line_total}}
      image_url: i.image
        ? `https://nature-essentials.github.io/nature_essentials/${i.image}`
        : "https://nature-essentials.github.io/nature_essentials/images/logo.png"
    }));

    const templateData = {
      order_id: orderId,
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      customer_email: email,
      cost: {
        subtotal: orderTotal,
        total: orderTotal
      },
      orders // repeater array
    };

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn?.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateData);
      afterOrderSuccess(form);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("There was a problem sending your order. Please try again.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText || "Place Order";
      }
    }
  });
}


function afterOrderSuccess(form) {
  alert("Order placed successfully! You’ll receive a confirmation email shortly.");
  localStorage.removeItem(CART_KEY);
  form.reset();
  renderCart();
  updateCartCount();
}

/* Footer year + newsletter */
function initMeta() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  const nForm = document.getElementById("newsletter-form");
  if (nForm) {
    nForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for subscribing!");
      nForm.reset();
    });
  }
}

/* Init per page */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  handleCheckout();
  initMeta();
});

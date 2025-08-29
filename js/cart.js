/* -------------------------
   Minimal Storefront Cart
   ------------------------- */

const CART_KEY = "cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function formatCurrency(n) {
  return `$${Number(n).toFixed(2)}`;
}

/* Header badge count */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  const count = getCart().reduce((acc, it) => acc + it.qty, 0);
  countEl.textContent = count;
}

/* Add item */
function addToCart(name, price) {
  const cart = getCart();
  const found = cart.find(i => i.name === name);
  if (found) found.qty += 1;
  else cart.push({ name, price: Number(price), qty: 1 });
  saveCart(cart);
  // Toast-y alert without blocking UX
  alert(`${name} added to cart`);
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
  renderCartTotals();
}

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
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
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

/* Totals (cart.html) */
function renderCartTotals() {
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (!subtotalEl || !totalEl) return;
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal); // no shipping added
}

/* Checkout submission (EmailJS or Formspree)
   - EmailJS quick setup:
     1) Sign up at emailjs.com, add a service + template.
     2) Replace EMAILJS_PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID below.
     3) Uncomment EmailJS code and include their SDK in cart.html <head>:
        <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
        <script> (function(){ emailjs.init("EMAILJS_PUBLIC_KEY"); })(); </script>
*/
function handleCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: data.get("name")?.toString().trim(),
      phone: data.get("phone")?.toString().trim(),
      address: data.get("address")?.toString().trim(),
      email: data.get("email")?.toString().trim(),
      items: cart.map(i => `${i.name} x${i.qty} = ${formatCurrency(i.price * i.qty)}`).join("\n"),
      total: cart.reduce((s, i) => s + i.price * i.qty, 0)
    };

    // ---- Option A: EmailJS (uncomment after setup) ----
    /*
    emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
      customer_name: payload.name,
      customer_phone: payload.phone,
      customer_address: payload.address,
      customer_email: payload.email,
      order_items: payload.items,
      order_total: formatCurrency(payload.total)
    }).then(() => {
      afterOrderSuccess(form);
    }).catch((err) => {
      console.error(err);
      alert("There was a problem sending your order. Please try again.");
    });
    */

    // ---- Option B: Formspree (replace with your Formspree endpoint) ----
    // fetch("https://formspree.io/f/yourid", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload)
    // }).then(r => r.ok ? afterOrderSuccess(form) : alert("Order failed."))
    //   .catch(() => alert("Order failed."));

    // Temporary success (until you wire EmailJS or Formspree)
    console.log("Order payload:", payload);
    afterOrderSuccess(form);
  });
}

function afterOrderSuccess(form) {
  alert("Order placed successfully! You’ll receive a confirmation email shortly.");
  localStorage.removeItem(CART_KEY);
  form.reset();
  renderCart();
  updateCartCount();
}

/* Footer year + newsletter stub */
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

// js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  injectNavbar();

  // Keep badge in sync if cart changes in another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "cart_v1") safeUpdateBadge();
  });
});

function injectNavbar() {
  fetch("components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      const host = document.getElementById("navbar");
      host.innerHTML = html;

      // Highlight active page
      const page = document.body.dataset.page;
      const active = host.querySelector(`[data-page="${page}"]`);
      if (active) active.classList.add("active");

      // Now that #cart-count exists, set it
      safeUpdateBadge();
    })
    .catch((err) => console.error("Navbar load failed:", err));
}

function safeUpdateBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  // Prefer the function from cart.js
  if (typeof window.updateCartCount === "function") {
    window.updateCartCount();
    return;
  }

  // Fallback if cart.js hasn't run yet
  try {
    const cart = JSON.parse(localStorage.getItem("cart_v1")) || [];
    const total = cart.reduce((s, i) => s + (i.qty || i.quantity || 0), 0);
    badge.textContent = total;
  } catch {}
}

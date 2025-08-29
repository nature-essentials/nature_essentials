

function toggleDesc(button) {
      const desc = button.nextElementSibling;
      desc.classList.toggle('open');
      button.textContent = desc.classList.contains('open') ? 'Hide Details' : 'Details';
    }
// js/load-products.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/product-card.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("products-container").innerHTML += html;
    });
});

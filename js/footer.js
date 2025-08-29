// js/footer.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer").innerHTML = html;

      // Set current year
      const yearSpan = document.getElementById("year");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    });
});
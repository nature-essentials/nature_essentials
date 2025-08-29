// js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      const navbarContainer = document.getElementById("navbar");
      navbarContainer.innerHTML = html;

      // Set active link
      const page = document.body.dataset.page;
      const activeLink = navbarContainer.querySelector(`[data-page="${page}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    });
});

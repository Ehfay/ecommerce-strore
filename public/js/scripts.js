
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById("menu-toggle");
    const dropdownMenu = document.getElementById("dropdown-menu");
  
    if (menuToggle && dropdownMenu) {
      menuToggle.addEventListener("click", () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
      });
    } else {
      console.error("menu-toggle or dropdown-menu not found!");
    }
  });
  
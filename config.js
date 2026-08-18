const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const KITCHEN_API_URL =
  "https://dummyjson.com/products/category/kitchen-accessories";

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      navbar.classList.remove("navbar-background-visible");
    } else {
      navbar.classList.add("navbar-background-visible");
    }
  });
}

window.handleSignOut = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

window.signIn = () => {};
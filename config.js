const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

addEventListener("scroll", () => {
  if (window.scrollY === 0) {
    document
      .querySelector(".navbar")
      .classList.remove("navbar-background-visible");
  } else {
    document
      .querySelector(".navbar")
      .classList.add("navbar-background-visible");
  }
});

window.handleSignOut = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

window.signIn = () => {};

if (localStorage.getItem("currentUser")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  document.querySelector("#avatar-action-container").innerHTML += `
    <div tabindex="0" class="avatar-action">
      <img src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        currentUser.username
      )}" />

      <div class="popup">
        <button class="action-button" onclick="handleSignOut()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `;
} else {
  document.querySelector("#avatar-action-container").innerHTML += `
    <a style="font-size: 25px" href="./login.html">
      <i class="fa-solid fa-right-to-bracket"></i>
    </a>
  `;
}
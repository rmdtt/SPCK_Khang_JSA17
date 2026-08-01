if (!localStorage.getItem("currentUser")) {
    location.href = "Login.html";
}

const dropdown = document.getElementById("dropdown");
const avatarInput = document.getElementById("avatarInput");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");

container.addEventListener("click", (e) => {
    if (!e.target.closest("#dropdown")) {
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".container")) {
        dropdown.style.display = "none";
    }
});

avatarInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        avatar.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    window.location.href = "Login.html";
});
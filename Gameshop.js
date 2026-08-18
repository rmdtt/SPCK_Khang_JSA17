const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const dropdown = document.getElementById("dropdown");
const avatarInput = document.getElementById("avatarInput");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");

if (!localStorage.getItem("currentUser")) {
    location.href = "Login.html";
}

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (currentUser && username) {
    username.textContent = currentUser.username;
}

const savedAvatar = localStorage.getItem("avatar");

if (savedAvatar && avatar) {
    avatar.src = savedAvatar;
}

if (container && dropdown) {
    container.addEventListener("click", (e) => {
        if (!e.target.closest("#dropdown")) {
            dropdown.style.display =
                dropdown.style.display === "block"
                    ? "none"
                    : "block";
        }
    });
}

document.addEventListener("click", (e) => {
    if (
        container &&
        dropdown &&
        !e.target.closest(".container")
    ) {
        dropdown.style.display = "none";
    }
});

if (avatarInput && avatar) {
    avatarInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            avatar.src = e.target.result;

            localStorage.setItem(
                "avatar",
                e.target.result
            );
        };

        reader.readAsDataURL(file);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        sessionStorage.clear();
        location.href = "Login.html";
    });
}

fetch(KITCHEN_API_URL)
  .then(response => response.json())
  .then(data => {
    console.log(data.products);
  })
  .catch(error => {
    console.error("Lỗi khi lấy dữ liệu đồ bếp:", error);
  });
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", () => {

        const keyword = searchInput.value.trim();

        if (keyword === "") {
            alert("Vui lòng nhập tên đồ bếp!");
            return;
        }

        window.location.href =
            `Search.html?search=${encodeURIComponent(keyword)}`;
    });

    searchInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            searchBtn.click();
        }

    });
}
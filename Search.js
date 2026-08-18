const searchResults = document.getElementById("searchResults");
const searchTitle = document.getElementById("searchTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
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

const params = new URLSearchParams(window.location.search);
const searchName = params.get("search") || "";

let allMeals = [];

searchInput.value = searchName;

searchTitle.textContent = searchName
    ? `Search results for "${searchName}"`
    : "Search results";

function performSearch() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        return;
    }

    window.location.href = `Search.html?search=${encodeURIComponent(keyword)}`;
}

searchBtn.addEventListener("click", performSearch);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

async function searchMeals() {
    if (!searchName) {
        searchResults.innerHTML = `
            <div class="no-results">
                Nhập tên món ăn để tìm kiếm
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchName)}`
        );

        const data = await response.json();

        allMeals = data.meals || [];

        if (allMeals.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    Không tìm thấy món ăn
                </div>
            `;
            return;
        }

        displayMeals();

    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);

        searchResults.innerHTML = `
            <div class="no-results">
                Không thể tải dữ liệu
            </div>
        `;
    }
}

function displayMeals() {
    searchResults.innerHTML = "";

    allMeals.forEach((meal, index) => {
        const card = document.createElement("a");

        card.href = `Detail-meals.html?id=${meal.idMeal}`;
        card.className = "search-card";

        if (index === 0) {
            card.classList.add("featured-card");
        }

        card.innerHTML = `
            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            <div class="search-card-content">
                <h2>${meal.strMeal}</h2>
                <p>${meal.strCategory || ""}</p>
            </div>
        `;

        searchResults.appendChild(card);
    });
}

searchMeals();
const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const dropdown = document.getElementById("dropdown");
const avatarInput = document.getElementById("avatarInput");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");
const randomMeals = document.getElementById("randomMeals");

if (!localStorage.getItem("currentUser")) {
    location.href = "Login.html";
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
    username.textContent = currentUser.username;
}

const savedAvatar = localStorage.getItem("avatar");

if (savedAvatar) {
    avatar.src = savedAvatar;
}

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
        localStorage.setItem("avatar", e.target.result);
    };

    reader.readAsDataURL(file);
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    location.href = "Login.html";
});

async function loadRandomMeals() {
    randomMeals.innerHTML = "";

    const requests = [];

    for (let i = 0; i < 10; i++) {
        requests.push(
            fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        );
    }

    const responses = await Promise.all(requests);

    for (const response of responses) {
        const data = await response.json();
        const meal = data.meals[0];

        randomMeals.innerHTML += `
            <a href="Detail-meals.html?id=${meal.idMeal}" class="meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            </a>
        `;
    }
}

if (randomMeals) {
    loadRandomMeals();
}

if (randomMeals) {
    loadRandomMeals();

    randomMeals.addEventListener("wheel", (e) => {
        e.preventDefault();
        randomMeals.scrollLeft += e.deltaY;
    });
}
const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const dropdown = document.getElementById("dropdown");
const avatarInput = document.getElementById("avatarInput");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

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


if (!mealId) {
    alert("Không có ID món ăn");
    location.href = "Main.html";
}


fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {

        if (!data.meals) {
            alert("Không tìm thấy món ăn");
            return;
        }

        const meal = data.meals[0];


        document.getElementById("mealImage").src = meal.strMealThumb;

        document.getElementById("mealName").textContent = meal.strMeal;

        document.getElementById("backgroundImage").src = meal.strMealThumb;

    })
    .catch(error => {
        console.log(error);
    });

fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {

        if (!data.meals) {
            alert("Không tìm thấy món ăn");
            return;
        }

        const meal = data.meals[0];

        document.getElementById("mealImage").src = meal.strMealThumb;
        document.getElementById("mealName").textContent = meal.strMeal;
        document.getElementById("backgroundImage").src = meal.strMealThumb;

        const ingredientList = document.getElementById("ingredientList");
        ingredientList.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredientList.innerHTML += `
                    <div class="ingredient-item">
                        <img src="https://www.themealdb.com/images/ingredients/${ingredient}.png" alt="${ingredient}">
                        <span>${ingredient}</span>
                        <span>${measure}</span>
                    </div>
                `;
            }
        }

    })
    .catch(error => {
        console.log(error);
    });
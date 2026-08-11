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

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

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
            dropdown.style.display === "block"
                ? "none"
                : "block";
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

        localStorage.setItem(
            "avatar",
            e.target.result
        );
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

fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
)
    .then(response => response.json())
    .then(data => {

        if (!data.meals) {
            alert("Không tìm thấy món ăn");
            return;
        }

        const meal = data.meals[0];

        const mealImage =
            document.getElementById("mealImage");

        const mealName =
            document.getElementById("mealName");

        const backgroundImage =
            document.getElementById("backgroundImage");

        const ingredientList =
            document.getElementById("ingredientList");

        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;

        mealName.textContent = meal.strMeal;

        backgroundImage.src = meal.strMealThumb;

        ingredientList.innerHTML = "";

        for (let i = 1; i <= 20; i++) {

            const ingredient =
                meal[`strIngredient${i}`];

            const measure =
                meal[`strMeasure${i}`];

            if (
                ingredient &&
                ingredient.trim() !== ""
            ) {

                const ingredientItem =
                    document.createElement("div");

                ingredientItem.className =
                    "ingredient-item";

                ingredientItem.dataset.name =
                    ingredient.trim();

                ingredientItem.dataset.measure =
                    measure ? measure.trim() : "";

                const ingredientImage =
                    document.createElement("img");

                ingredientImage.src =
                    `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
                        ingredient.trim()
                    )}.png`;

                ingredientImage.alt =
                    ingredient.trim();

                ingredientItem.appendChild(
                    ingredientImage
                );

                ingredientList.appendChild(
                    ingredientItem
                );
            }
        }

        document
            .querySelectorAll(".ingredient-item")
            .forEach(item => {

                item.addEventListener(
                    "mouseenter",
                    function () {

                        const name =
                            this.dataset.name;

                        const measure =
                            this.dataset.measure;

                        const tooltip =
                            document.createElement("div");

                        tooltip.className =
                            "ingredient-tooltip";

                        tooltip.textContent =
                            measure
                                ? `${name} - ${measure}`
                                : name;

                        document.body.appendChild(
                            tooltip
                        );

                        const rect =
                            this.getBoundingClientRect();

                        let left =
                            rect.left +
                            rect.width / 2;

                        let top =
                            rect.top -
                            tooltip.offsetHeight -
                            10;

                        tooltip.style.left =
                            `${left}px`;

                        tooltip.style.top =
                            `${top}px`;

                        tooltip.style.transform =
                            "translateX(-50%)";

                        const tooltipRect =
                            tooltip.getBoundingClientRect();

                        if (
                            tooltipRect.left < 10
                        ) {
                            left =
                                10 +
                                tooltip.offsetWidth / 2;

                            tooltip.style.left =
                                `${left}px`;
                        }

                        if (
                            tooltipRect.right >
                            window.innerWidth - 10
                        ) {
                            left =
                                window.innerWidth -
                                10 -
                                tooltip.offsetWidth / 2;

                            tooltip.style.left =
                                `${left}px`;
                        }

                        if (
                            tooltipRect.top < 10
                        ) {
                            top =
                                rect.bottom + 10;

                            tooltip.style.top =
                                `${top}px`;
                        }

                        tooltip.style.opacity = "1";

                        this._tooltip =
                            tooltip;
                    }
                );

                item.addEventListener(
                    "mouseleave",
                    function () {

                        if (this._tooltip) {
                            this._tooltip.remove();
                            this._tooltip = null;
                        }

                    }
                );
            });
    })
    .catch(error => {

        console.error(
            "Lỗi khi lấy dữ liệu món ăn:",
            error
        );

        alert(
            "Không thể tải dữ liệu món ăn"
        );
    });
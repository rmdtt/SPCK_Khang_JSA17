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

container.addEventListener("click", e => {
    if (!e.target.closest("#dropdown")) {
        dropdown.style.display =
            dropdown.style.display === "block"
                ? "none"
                : "block";
    }
});

document.addEventListener("click", e => {
    if (!e.target.closest(".container")) {
        dropdown.style.display = "none";
    }
});

avatarInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
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

const commentInput = document.getElementById("commentInput");
const commentBtn = document.getElementById("commentBtn");
const commentList = document.getElementById("commentList");
const favoriteBtn = document.getElementById("favoriteBtn");

const favoriteKey = `favorite_${mealId}`;
const commentKey = `comments_${mealId}`;

function getFavoriteMeals() {
    return JSON.parse(
        localStorage.getItem("favoriteMeals") || "[]"
    );
}

function saveFavoriteMeals(meals) {
    localStorage.setItem(
        "favoriteMeals",
        JSON.stringify(meals)
    );
}

function addFavoriteHeart() {
    const mealName = document.getElementById("mealName");

    if (!mealName) return;

    if (!mealName.querySelector(".favorite-heart")) {
        const heart = document.createElement("span");

        heart.className = "favorite-heart";
        heart.textContent = " ♥";

        mealName.appendChild(heart);
    }
}

function removeFavoriteHeart() {
    const heart =
        document.querySelector(".favorite-heart");

    if (heart) {
        heart.remove();
    }
}

function loadFavorite() {
    const isFavorite =
        localStorage.getItem(favoriteKey) === "true";

    if (isFavorite) {
        favoriteBtn.classList.add("active");
        favoriteBtn.textContent = "♥ Favorated";

        addFavoriteHeart();
    } else {
        favoriteBtn.classList.remove("active");
        favoriteBtn.textContent = "♡ Favorate";

        removeFavoriteHeart();
    }
}

favoriteBtn.addEventListener("click", () => {
    const isFavorite =
        localStorage.getItem(favoriteKey) === "true";

    if (!isFavorite) {
        localStorage.setItem(favoriteKey, "true");

        const mealName =
            document.getElementById("mealName");

        const mealImage =
            document.getElementById("mealImage");

        const meal = {
            id: mealId,
            name: mealName.textContent,
            image: mealImage.src
        };

        let favoriteMeals = getFavoriteMeals();

        const existed = favoriteMeals.some(
            item => item.id === meal.id
        );

        if (!existed) {
            favoriteMeals.push(meal);
            saveFavoriteMeals(favoriteMeals);
        }
    } else {
        localStorage.setItem(favoriteKey, "false");

        let favoriteMeals = getFavoriteMeals();

        favoriteMeals = favoriteMeals.filter(
            item => item.id !== mealId
        );

        saveFavoriteMeals(favoriteMeals);
    }

    loadFavorite();
});

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

        const instructionList =
            document.getElementById("instructionList");

        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;

        mealName.textContent = meal.strMeal;

        backgroundImage.src = meal.strMealThumb;

        loadFavorite();

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
                const item =
                    document.createElement("div");

                item.className = "ingredient-item";

                item.dataset.name =
                    ingredient.trim();

                item.dataset.measure =
                    measure
                        ? measure.trim()
                        : "";

                const img =
                    document.createElement("img");

                img.src =
                    `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
                        ingredient.trim()
                    )}.png`;

                img.alt = ingredient.trim();

                item.appendChild(img);

                ingredientList.appendChild(item);

                item.addEventListener(
                    "mouseenter",
                    function () {
                        const tooltip =
                            document.createElement("div");

                        tooltip.className =
                            "ingredient-tooltip";

                        tooltip.textContent =
                            this.dataset.measure
                                ? `${this.dataset.name} - ${this.dataset.measure}`
                                : this.dataset.name;

                        document.body.appendChild(
                            tooltip
                        );

                        const rect =
                            this.getBoundingClientRect();

                        let left =
                            rect.left +
                            rect.width / 2;

                        let top =
                            rect.bottom + 10;

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
                                tooltipRect.width /
                                    2;
                        }

                        if (
                            tooltipRect.right >
                            window.innerWidth - 10
                        ) {
                            left =
                                window.innerWidth -
                                10 -
                                tooltipRect.width /
                                    2;
                        }

                        if (
                            tooltipRect.bottom >
                            window.innerHeight - 10
                        ) {
                            top =
                                rect.top -
                                tooltipRect.height -
                                10;
                        }

                        tooltip.style.left =
                            `${left}px`;

                        tooltip.style.top =
                            `${top}px`;

                        this._tooltip =
                            tooltip;
                    }
                );

                item.addEventListener(
                    "mouseleave",
                    function () {
                        if (this._tooltip) {
                            this._tooltip.remove();

                            this._tooltip =
                                null;
                        }
                    }
                );
            }
        }

        const instructions =
            meal.strInstructions || "";

        const cleanedInstructions =
            instructions
                .replace(
                    /\b(?:step|steps)\s*\d+\s*[:.)-]?\s*/gi,
                    ""
                )
                .replace(
                    /^\s*\d+\s*[:.)-]\s*/gm,
                    ""
                )
                .trim();

        const steps =
            cleanedInstructions
                .split(/\r?\n/)
                .map(step => step.trim())
                .filter(
                    step => step !== ""
                );

        instructionList.innerHTML = "";

        steps.forEach((step, index) => {
            const stepBox =
                document.createElement("div");

            stepBox.className =
                "instruction-step";

            const img =
                document.createElement("img");

            img.src =
                meal.strMealThumb;

            img.alt =
                `Step ${index + 1}`;

            const content =
                document.createElement("div");

            content.className =
                "instruction-content";

            const number =
                document.createElement("div");

            number.className =
                "instruction-number";

            number.textContent =
                `Step ${index + 1}`;

            const text =
                document.createElement("div");

            text.className =
                "instruction-text";

            text.textContent =
                step;

            content.appendChild(number);
            content.appendChild(text);

            stepBox.appendChild(img);
            stepBox.appendChild(content);

            instructionList.appendChild(
                stepBox
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

function loadComments() {
    const comments =
        JSON.parse(
            localStorage.getItem(commentKey) ||
                "[]"
        );

    commentList.innerHTML = "";

    comments.forEach(comment => {
        const commentItem =
            document.createElement("div");

        commentItem.className =
            "comment-item";

        const commentAvatar =
            document.createElement("img");

        commentAvatar.className =
            "comment-avatar";

        commentAvatar.src =
            comment.avatar ||
            "Img/Avatar.png";

        commentAvatar.alt =
            "Avatar";

        const commentContent =
            document.createElement("div");

        commentContent.className =
            "comment-content";

        const commentUsername =
            document.createElement("div");

        commentUsername.className =
            "comment-username";

        commentUsername.textContent =
            comment.username ||
            "User";

        const commentText =
            document.createElement("div");

        commentText.className =
            "comment-text";

        commentText.textContent =
            comment.text;

        commentContent.appendChild(
            commentUsername
        );

        commentContent.appendChild(
            commentText
        );

        commentItem.appendChild(
            commentAvatar
        );

        commentItem.appendChild(
            commentContent
        );

        commentList.appendChild(
            commentItem
        );
    });
}

commentBtn.addEventListener("click", () => {
    const text =
        commentInput.value.trim();

    if (!text) {
        alert("Vui lòng nhập bình luận");
        return;
    }

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    const savedAvatar =
        localStorage.getItem("avatar") ||
        "Img/Avatar.png";

    const comments =
        JSON.parse(
            localStorage.getItem(commentKey) ||
                "[]"
        );

    const newComment = {
        username:
            currentUser
                ? currentUser.username
                : "User",

        avatar: savedAvatar,

        text: text
    };

    comments.unshift(newComment);

    localStorage.setItem(
        commentKey,
        JSON.stringify(comments)
    );

    commentInput.value = "";

    loadComments();

    commentList.scrollTop = 0;
});

loadFavorite();
loadComments();

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", () => {

        const keyword = searchInput.value.trim();

        if (keyword === "") {
            alert("Vui lòng nhập tên món ăn!");
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
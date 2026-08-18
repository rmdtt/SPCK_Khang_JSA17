const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const dropdown = document.getElementById("dropdown");
const avatarInput = document.getElementById("avatarInput");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");

const randomMeals = document.getElementById("randomMeals");

const favoriteMealsContainer =
    document.getElementById("favoriteMeals");

const favoriteTitle =
    document.getElementById("favoriteTitle");



if (!localStorage.getItem("currentUser")) {
    location.href = "Login.html";
}



const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);



if (currentUser && username) {
    username.textContent =
        currentUser.username;
}



const savedAvatar =
    localStorage.getItem("avatar");



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

        dropdown.style.display =
            "none";
    }
});



if (avatarInput && avatar) {

    avatarInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    avatar.src =
                        e.target.result;

                    localStorage.setItem(
                        "avatar",
                        e.target.result
                    );
                };

            reader.readAsDataURL(file);
        }
    );
}



if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "currentUser"
            );

            sessionStorage.clear();

            location.href =
                "Login.html";
        }
    );
}



async function loadRandomMeals() {

    if (!randomMeals) {
        return;
    }

    randomMeals.innerHTML =
        "";

    const requests = [];

    for (let i = 0; i < 10; i++) {

        requests.push(
            fetch(
                "https://www.themealdb.com/api/json/v1/1/random.php"
            )
        );
    }

    try {

        const responses =
            await Promise.all(
                requests
            );

        for (
            const response
            of responses
        ) {

            const data =
                await response.json();

            if (
                !data.meals ||
                !data.meals.length
            ) {
                continue;
            }

            const meal =
                data.meals[0];

            randomMeals.innerHTML += `
                <a
                    href="Detail-meals.html?id=${meal.idMeal}"
                    class="meal-card"
                >

                    <img
                        src="${meal.strMealThumb}"
                        alt="${meal.strMeal}"
                    >

                    <h3>
                        ${meal.strMeal}
                    </h3>

                </a>
            `;
        }

    } catch (error) {

        console.error(
            "Lỗi khi tải Random meals:",
            error
        );
    }
}



if (randomMeals) {

    loadRandomMeals();

    randomMeals.addEventListener(
        "wheel",
        (e) => {

            e.preventDefault();

            randomMeals.scrollLeft +=
                e.deltaY;
        }
    );
}



async function loadFavoriteMeals() {

    if (!favoriteMealsContainer) {
        return;
    }

    favoriteMealsContainer.innerHTML =
        "";



    const favoriteKeys =
        Object.keys(localStorage)
            .filter((key) => {

                return key.startsWith(
                    "favorite_"
                );

            })
            .filter((key) => {

                return (
                    localStorage.getItem(key) ===
                    "true"
                );

            });



    if (favoriteKeys.length === 0) {

        if (favoriteTitle) {

            favoriteTitle.textContent =
                "🎆 Favorated meals (Empty)";
        }

        return;
    }



    if (favoriteTitle) {

        favoriteTitle.textContent =
            "🎆 Favorated meals";
    }



    for (
        const key
        of favoriteKeys
    ) {

        const mealId =
            key.replace(
                "favorite_",
                ""
            );

        try {

            const response =
                await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
                );

            const data =
                await response.json();

            if (
                !data.meals ||
                !data.meals.length
            ) {
                continue;
            }

            const meal =
                data.meals[0];



            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "favorite-card";



            card.innerHTML = `
                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <h3>
                    ${meal.strMeal}
                </h3>
            `;



            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `Detail-meals.html?id=${meal.idMeal}`;
                }
            );



            favoriteMealsContainer.appendChild(
                card
            );

        } catch (error) {

            console.error(
                "Lỗi khi tải món Favorated:",
                error
            );
        }
    }



    if (
        favoriteMealsContainer.children.length ===
        0
    ) {

        if (favoriteTitle) {

            favoriteTitle.textContent =
                "🎆 Favorated meals (Empty)";
        }
    }
}



loadFavoriteMeals();



const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );



if (
    searchBtn &&
    searchInput
) {

    searchBtn.addEventListener(
        "click",
        () => {

            const keyword =
                searchInput.value.trim();

            if (keyword === "") {

                alert(
                    "Vui lòng nhập tên món ăn!"
                );

                return;
            }

            window.location.href =
                `Search.html?search=${encodeURIComponent(keyword)}`;
        }
    );



    searchInput.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Enter") {
                searchBtn.click();
            }

        }
    );
}



function showFireworks() {

    const fireworks =
        document.getElementById(
            "fireworks"
        );

    if (!fireworks) {
        return;
    }



    const centerX =
        Math.random() *
        window.innerWidth;



    const centerY =
        Math.random() *
        (window.innerHeight * 0.6) +
        100;



    const particleCount = 50;



    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "firework";



        const angle =
            (Math.PI * 2 * i) /
            particleCount;



        const distance =
            80 +
            Math.random() * 180;



        const x =
            Math.cos(angle) *
            distance;



        const y =
            Math.sin(angle) *
            distance;



        particle.style.left =
            `${centerX}px`;



        particle.style.top =
            `${centerY}px`;



        particle.style.setProperty(
            "--x",
            `${x}px`
        );



        particle.style.setProperty(
            "--y",
            `${y}px`
        );



        fireworks.appendChild(
            particle
        );



        setTimeout(
            () => {
                particle.remove();
            },
            1000
        );
    }
}



function addFavorite(mealId) {

    const key =
        `favorite_${mealId}`;



    const isFavorite =
        localStorage.getItem(key) ===
        "true";



    if (isFavorite) {

        localStorage.removeItem(
            key
        );

        return false;
    }



    localStorage.setItem(
        key,
        "true"
    );



    showFireworks();



    return true;
}
const searchResults = document.getElementById("searchResults");
const searchTitle = document.getElementById("searchTitle");

const params = new URLSearchParams(window.location.search);
const searchName = params.get("search") || "";

let allMeals = [];

searchTitle.textContent = `Search results for "${searchName}"`;

async function searchMeals() {
    if (!searchName) {
        searchResults.innerHTML = `
            <div class="no-results">
                Không có từ khóa tìm kiếm
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
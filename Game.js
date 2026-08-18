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


const startScreen =
    document.getElementById("startScreen");

const memorizeScreen =
    document.getElementById("memorizeScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const gachaBtn =
    document.getElementById("gachaBtn");

const nextBtn =
    document.getElementById("nextBtn");

const checkBtn =
    document.getElementById("checkBtn");

const skipBtn =
    document.getElementById("skipBtn");

const backGameBtn =
    document.getElementById("backGameBtn");

const timer =
    document.getElementById("timer");

const answerTimer =
    document.getElementById("answerTimer");

const mealImage =
    document.getElementById("mealImage");

const mealName =
    document.getElementById("mealName");

const gameMealName =
    document.getElementById("gameMealName");

const mealCategory =
    document.getElementById("mealCategory");

const recipeSteps =
    document.getElementById("recipeSteps");

const answerSlots =
    document.getElementById("answerSlots");

const stepPool =
    document.getElementById("stepPool");

const finalScore =
    document.getElementById("finalScore");

const correctCount =
    document.getElementById("correctCount");

const usedTime =
    document.getElementById("usedTime");

const resultBest =
    document.getElementById("resultBest");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const resultIcon =
    document.getElementById("resultIcon");

const loading =
    document.getElementById("loading");

const moneyElement =
    document.getElementById("money");

const playsTodayElement =
    document.getElementById("playsToday");

const bestScoreDisplay =
    document.getElementById("bestScoreDisplay");


const GAME_API =
    "https://www.themealdb.com/api/json/v1/1/random.php";


const MAX_PLAYS_PER_DAY = 3;

const MEMORIZE_TIME = 60;

const ANSWER_TIME = 60;


let currentMeal = null;

let correctSteps = [];

let memorizeInterval = null;

let answerInterval = null;

let memorizeSeconds = MEMORIZE_TIME;

let answerSeconds = ANSWER_TIME;

let gameStartTime = 0;

let gameStarted = false;


let bestScore =
    Number(
        localStorage.getItem(
            "foodGachaBestScore"
        )
    ) || 0;


function getToday() {

    const date = new Date();

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}


function resetDailyData() {

    const today = getToday();

    const savedDate =
        localStorage.getItem(
            "foodGachaPlayDate"
        );

    if (savedDate !== today) {

        localStorage.setItem(
            "foodGachaPlayDate",
            today
        );

        localStorage.setItem(
            "foodGachaPlaysToday",
            "0"
        );
    }
}


function getPlaysToday() {

    resetDailyData();

    return Number(
        localStorage.getItem(
            "foodGachaPlaysToday"
        )
    ) || 0;
}


function increasePlayCount() {

    resetDailyData();

    const plays =
        getPlaysToday();

    if (plays >= MAX_PLAYS_PER_DAY) {
        return false;
    }

    localStorage.setItem(
        "foodGachaPlaysToday",
        String(plays + 1)
    );

    updateGameInfo();

    return true;
}


function getMoney() {

    return Number(
        localStorage.getItem(
            "foodGachaMoney"
        )
    ) || 0;
}


function addMoney(amount) {

    if (amount <= 0) {
        return;
    }

    const money =
        getMoney();

    localStorage.setItem(
        "foodGachaMoney",
        String(money + amount)
    );

    updateGameInfo();
}


function updateGameInfo() {

    resetDailyData();

    const money =
        getMoney();

    const plays =
        getPlaysToday();

    if (moneyElement) {
        moneyElement.textContent =
            money;
    }

    if (playsTodayElement) {
        playsTodayElement.textContent =
            `${plays}/${MAX_PLAYS_PER_DAY}`;
    }

    if (bestScoreDisplay) {
        bestScoreDisplay.textContent =
            bestScore;
    }
}


function canPlay() {

    const plays =
        getPlaysToday();

    if (plays >= MAX_PLAYS_PER_DAY) {

        alert(
            "Bạn đã hết 3 lượt chơi hôm nay. Hãy quay lại vào ngày mai!"
        );

        return false;
    }

    return true;
}


function showScreen(screen) {

    document
        .querySelectorAll(".game-screen")
        .forEach(item => {
            item.classList.remove("active");
        });

    if (screen) {
        screen.classList.add("active");
    }
}


function showLoading(show) {

    if (!loading) {
        return;
    }

    loading.classList.toggle(
        "hidden",
        !show
    );
}


function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent =
        text;

    return element.innerHTML;
}


function parseInstructions(instructions) {

    if (!instructions) {
        return [];
    }

    let text =
        instructions
            .replace(/\r/g, "\n")
            .replace(/\t/g, " ")
            .trim();

    let steps =
        text
            .split(/\n+/)
            .map(step => step.trim())
            .filter(Boolean);

    if (steps.length < 3) {

        steps =
            text
                .split(
                    /(?<=[.!?])\s+/
                )
                .map(step => step.trim())
                .filter(Boolean);
    }

    steps =
        steps
            .map(step => {

                return step
                    .replace(
                        /^\s*(step\s*)?\d+[\s:.)-]*/i,
                        ""
                    )
                    .trim();

            })
            .filter(
                step =>
                    step.length > 5
            );

    if (steps.length > 8) {
        steps =
            steps.slice(0, 8);
    }

    return steps;
}


function renderRecipeSteps(steps) {

    if (!recipeSteps) {
        return;
    }

    recipeSteps.innerHTML = "";

    steps.forEach(
        (step, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "recipe-step";

            element.innerHTML = `
                <span class="recipe-step-number">
                    ${index + 1}
                </span>

                <span>
                    ${escapeHTML(step)}
                </span>
            `;

            recipeSteps.appendChild(
                element
            );
        }
    );
}


async function getRandomMeal() {

    showLoading(true);

    try {

        const response =
            await fetch(GAME_API);

        if (!response.ok) {

            throw new Error(
                "API request failed"
            );
        }

        const data =
            await response.json();

        if (
            !data.meals ||
            !data.meals.length
        ) {

            throw new Error(
                "No meal found"
            );
        }

        return data.meals[0];

    } finally {

        showLoading(false);
    }
}


async function startGacha() {

    if (!canPlay()) {
        return;
    }

    clearIntervals();

    gameStarted = false;

    try {

        const meal =
            await getRandomMeal();

        const steps =
            parseInstructions(
                meal.strInstructions
            );

        if (steps.length < 3) {

            startGacha();

            return;
        }

        currentMeal =
            meal;

        correctSteps =
            steps;

        mealImage.src =
            meal.strMealThumb;

        mealImage.alt =
            meal.strMeal;

        mealName.textContent =
            meal.strMeal;

        gameMealName.textContent =
            meal.strMeal;

        mealCategory.textContent =
            meal.strCategory ||
            "Food";

        renderRecipeSteps(
            correctSteps
        );

        showScreen(
            memorizeScreen
        );

        startMemorizeTimer();

    } catch (error) {

        console.error(error);

        alert(
            "Không thể tải món ăn. Vui lòng thử lại."
        );
    }
}


function startMemorizeTimer() {

    memorizeSeconds =
        MEMORIZE_TIME;

    timer.textContent =
        memorizeSeconds;

    timer.classList.remove(
        "warning"
    );

    clearInterval(
        memorizeInterval
    );

    memorizeInterval =
        setInterval(() => {

            memorizeSeconds--;

            timer.textContent =
                memorizeSeconds;

            if (
                memorizeSeconds <= 10
            ) {

                timer.classList.add(
                    "warning"
                );
            }

            if (
                memorizeSeconds <= 0
            ) {

                clearInterval(
                    memorizeInterval
                );

                startAnswerPhase();
            }

        }, 1000);
}


function skipMemorize() {

    clearInterval(
        memorizeInterval
    );

    startAnswerPhase();
}


function startAnswerPhase() {

    if (!gameStarted) {

        const success =
            increasePlayCount();

        if (!success) {

            showScreen(
                startScreen
            );

            return;
        }

        gameStarted = true;
    }

    buildAnswerBoard();

    answerSeconds =
        ANSWER_TIME;

    answerTimer.textContent =
        answerSeconds;

    gameStartTime =
        Date.now();

    showScreen(
        gameScreen
    );

    clearInterval(
        answerInterval
    );

    answerInterval =
        setInterval(() => {

            answerSeconds--;

            answerTimer.textContent =
                answerSeconds;

            if (
                answerSeconds <= 0
            ) {

                clearInterval(
                    answerInterval
                );

                checkAnswer();
            }

        }, 1000);
}


function buildAnswerBoard() {

    answerSlots.innerHTML = "";

    stepPool.innerHTML = "";

    correctSteps.forEach(
        (step, index) => {

            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "answer-slot";

            slot.dataset.index =
                index;

            slot.innerHTML = `
                <span class="slot-number">
                    ${index + 1}
                </span>
            `;

            setupDropZone(
                slot
            );

            answerSlots.appendChild(
                slot
            );
        }
    );


    const shuffledSteps =
        shuffle(
            correctSteps.map(
                (text, index) => ({
                    text,
                    id: index
                })
            )
        );


    shuffledSteps.forEach(
        item => {

            const step =
                document.createElement(
                    "div"
                );

            step.className =
                "step";

            step.draggable =
                true;

            step.dataset.id =
                item.id;

            step.textContent =
                item.text;

            setupDraggable(
                step
            );

            stepPool.appendChild(
                step
            );
        }
    );
}


function setupDraggable(element) {

    element.addEventListener(
        "dragstart",
        event => {

            event.dataTransfer.setData(
                "text/plain",
                element.dataset.id
            );

            element.classList.add(
                "dragging"
            );
        }
    );

    element.addEventListener(
        "dragend",
        () => {

            element.classList.remove(
                "dragging"
            );
        }
    );
}


function setupDropZone(slot) {

    slot.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            slot.classList.add(
                "drag-over"
            );
        }
    );


    slot.addEventListener(
        "dragleave",
        () => {

            slot.classList.remove(
                "drag-over"
            );
        }
    );


    slot.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            slot.classList.remove(
                "drag-over"
            );

            const id =
                event.dataTransfer.getData(
                    "text/plain"
                );

            const step =
                document.querySelector(
                    `.step[data-id="${id}"]`
                );

            if (!step) {
                return;
            }

            const existing =
                slot.querySelector(
                    ".step"
                );

            if (existing) {

                stepPool.appendChild(
                    existing
                );
            }

            slot.appendChild(
                step
            );
        }
    );
}


function checkAnswer() {

    if (!gameStarted) {
        return;
    }

    gameStarted = false;

    clearInterval(
        answerInterval
    );

    const slots =
        [
            ...answerSlots.children
        ];

    let correct = 0;

    slots.forEach(
        (slot, index) => {

            const step =
                slot.querySelector(
                    ".step"
                );

            if (!step) {
                return;
            }

            const answerId =
                Number(
                    step.dataset.id
                );

            if (
                answerId === index
            ) {

                correct++;
            }
        }
    );


    const total =
        correctSteps.length;


    const score =
        correct * 10;


    const perfectBonus =
        correct === total
            ? 30
            : 0;


    const finalScoreValue =
        score +
        perfectBonus;


    const timeUsed =
        Math.min(
            ANSWER_TIME,
            Math.round(
                (
                    Date.now() -
                    gameStartTime
                ) / 1000
            )
        );


    if (
        finalScoreValue >
        bestScore
    ) {

        bestScore =
            finalScoreValue;

        localStorage.setItem(
            "foodGachaBestScore",
            String(bestScore)
        );
    }


    addMoney(
        finalScoreValue
    );


    updateGameInfo();


    showResult(
        correct,
        total,
        timeUsed,
        finalScoreValue,
        perfectBonus
    );
}


function showResult(
    correct,
    total,
    timeUsed,
    score,
    perfectBonus
) {

    finalScore.textContent =
        score;

    correctCount.textContent =
        `${correct}/${total}`;

    usedTime.textContent =
        `${timeUsed}s`;

    resultBest.textContent =
        bestScore;


    if (
        perfectBonus > 0
    ) {

        resultMessage.textContent =
            `Correct: ${correct} × 10 + Perfect Bonus: 30`;

    } else {

        resultMessage.textContent =
            `Correct: ${correct} × 10`;
    }


    if (
        correct === total
    ) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "PERFECT!";

    } else if (
        correct >=
        Math.ceil(total * 0.7)
    ) {

        resultIcon.textContent =
            "🔥";

        resultTitle.textContent =
            "GREAT!";

    } else if (
        correct >=
        Math.ceil(total * 0.4)
    ) {

        resultIcon.textContent =
            "👍";

        resultTitle.textContent =
            "GOOD TRY!";

    } else {

        resultIcon.textContent =
            "😅";

        resultTitle.textContent =
            "TRY AGAIN!";
    }


    showScreen(
        resultScreen
    );
}


function clearIntervals() {

    clearInterval(
        memorizeInterval
    );

    clearInterval(
        answerInterval
    );
}


if (gachaBtn) {

    gachaBtn.addEventListener(
        "click",
        startGacha
    );
}


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            showScreen(
                startScreen
            );

            updateGameInfo();
        }
    );
}


if (skipBtn) {

    skipBtn.addEventListener(
        "click",
        skipMemorize
    );
}


if (checkBtn) {

    checkBtn.addEventListener(
        "click",
        checkAnswer
    );
}


if (backGameBtn) {

    backGameBtn.addEventListener(
        "click",
        () => {

            clearIntervals();

            window.location.href =
                "Game.html";
        }
    );
}


resetDailyData();

updateGameInfo();


window.addEventListener(
    "beforeunload",
    clearIntervals
);
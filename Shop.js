const username =
    document.getElementById("username");

const avatar =
    document.getElementById("avatar");

const dropdown =
    document.getElementById("dropdown");

const avatarInput =
    document.getElementById("avatarInput");

const logoutBtn =
    document.getElementById("logoutBtn");

const container =
    document.querySelector(".container");


const productGrid =
    document.getElementById("productGrid");

const loading =
    document.getElementById("loading");

const emptyMessage =
    document.getElementById("emptyMessage");

const shopMoney =
    document.getElementById("shopMoney");


const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");


const productModal =
    document.getElementById("productModal");

const successModal =
    document.getElementById("successModal");

const closeModal =
    document.getElementById("closeModal");

const successClose =
    document.getElementById("successClose");

const modalImage =
    document.getElementById("modalImage");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const modalCategory =
    document.getElementById("modalCategory");

const modalPrice =
    document.getElementById("modalPrice");

const modalShopPrice =
    document.getElementById("modalShopPrice");

const buyRealMoneyBtn =
    document.getElementById("buyRealMoneyBtn");

const buyCoinBtn =
    document.getElementById("buyCoinBtn");

const purchaseMessage =
    document.getElementById("purchaseMessage");


let products = [];

let currentProduct = null;


if (!localStorage.getItem("currentUser")) {

    location.href =
        "Login.html";

}


const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );


if (currentUser && username) {

    username.textContent =
        currentUser.username;

}


const savedAvatar =
    localStorage.getItem("avatar");


if (savedAvatar && avatar) {

    avatar.src =
        savedAvatar;

}


if (container && dropdown) {

    container.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    "#dropdown"
                )
            ) {

                dropdown.style.display =
                    dropdown.style.display ===
                        "block"
                        ? "none"
                        : "block";

            }

        }
    );

}


document.addEventListener(
    "click",
    event => {

        if (
            container &&
            dropdown &&
            !event.target.closest(
                ".container"
            )
        ) {

            dropdown.style.display =
                "none";

        }

    }
);


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
                event => {

                    avatar.src =
                        event.target.result;

                    localStorage.setItem(
                        "avatar",
                        event.target.result
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


function getMoney() {

    return Number(
        localStorage.getItem(
            "foodGachaMoney"
        )
    ) || 0;

}


function saveMoney(value) {

    localStorage.setItem(
        "foodGachaMoney",
        String(value)
    );

    updateMoney();

}


function updateMoney() {

    if (shopMoney) {

        shopMoney.textContent =
            getMoney().toLocaleString();

    }

}


function escapeHTML(text) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        text || "";

    return element.innerHTML;

}


function formatPrice(price) {

    return Number(price)
        .toFixed(2);

}


function priceToShopMoney(price) {

    return Math.round(
        Number(price) * 100
    );

}


async function loadKitchenProducts() {

    if (!productGrid) {
        return;
    }

    loading.classList.remove(
        "hidden"
    );

    emptyMessage.classList.add(
        "hidden"
    );

    productGrid.innerHTML =
        "";

    try {

        const response =
            await fetch(
                KITCHEN_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Không thể tải sản phẩm"
            );

        }

        const data =
            await response.json();

        products =
            data.products || [];

        renderProducts(
            products
        );

    } catch (error) {

        console.error(
            "Shop API Error:",
            error
        );

        emptyMessage.textContent =
            "Không thể tải sản phẩm. Vui lòng thử lại.";

        emptyMessage.classList.remove(
            "hidden"
        );

    } finally {

        loading.classList.add(
            "hidden"
        );

    }

}


function renderProducts(list) {

    productGrid.innerHTML =
        "";

    if (!list.length) {

        emptyMessage.classList.remove(
            "hidden"
        );

        return;

    }

    emptyMessage.classList.add(
        "hidden"
    );


    list.forEach(product => {

        const shopPrice =
            priceToShopMoney(
                product.price
            );


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card";


        card.innerHTML = `

            <img
                class="product-image"
                src="${escapeHTML(
                    product.thumbnail
                )}"
                alt="${escapeHTML(
                    product.title
                )}"
            >

            <div class="product-info">

                <span class="product-category">
                    Kitchen
                </span>

                <h3 class="product-title">
                    ${escapeHTML(
                        product.title
                    )}
                </h3>

                <div class="product-price">

                    <strong>
                        $${formatPrice(
                            product.price
                        )}
                    </strong>

                    <span>
                        ${shopPrice.toLocaleString()}
                        Shop Money
                    </span>

                </div>

                <div class="product-actions">

                    <button
                        class="view-button"
                        data-id="${product.id}"
                    >
                        View
                    </button>

                    <button
                        class="buy-button"
                        data-id="${product.id}"
                    >
                        💰 Buy Now
                    </button>

                </div>

            </div>

        `;


        const viewButton =
            card.querySelector(
                ".view-button"
            );

        const buyButton =
            card.querySelector(
                ".buy-button"
            );


        viewButton.addEventListener(
            "click",
            () => {

                openProduct(
                    product
                );

            }
        );


        buyButton.addEventListener(
            "click",
            () => {

                openProduct(
                    product
                );

            }
        );


        productGrid.appendChild(
            card
        );

    });

}


function openProduct(product) {

    currentProduct =
        product;

    const shopPrice =
        priceToShopMoney(
            product.price
        );


    modalImage.src =
        product.thumbnail;

    modalImage.alt =
        product.title;

    modalTitle.textContent =
        product.title;

    modalDescription.textContent =
        product.description ||
        "Kitchen accessory.";

    modalCategory.textContent =
        product.category ||
        "Kitchen";

    modalPrice.textContent =
        `$${formatPrice(
            product.price
        )}`;

    modalShopPrice.textContent =
        `${shopPrice.toLocaleString()} Shop Money`;


    productModal.classList.remove(
        "hidden"
    );

}


function closeProductModal() {

    productModal.classList.add(
        "hidden"
    );

}


function buyWithCoin() {

    if (!currentProduct) {
        return;
    }


    const price =
        priceToShopMoney(
            currentProduct.price
        );

    const money =
        getMoney();


    if (money < price) {

        alert(
            `Bạn không đủ Shop Money.\n\n` +
            `Giá: ${price.toLocaleString()} Shop Money\n` +
            `Bạn đang có: ${money.toLocaleString()} Shop Money`
        );

        return;

    }


    const newMoney =
        money - price;


    saveMoney(
        newMoney
    );


    savePurchase(
        currentProduct,
        price,
        "coin"
    );


    closeProductModal();


    purchaseMessage.textContent =
        `Bạn đã mua "${currentProduct.title}" với giá ${price.toLocaleString()} Shop Money.`;

    successModal.classList.remove(
        "hidden"
    );

}


function buyWithRealMoney() {

    if (!currentProduct) {
        return;
    }


    const price =
        Number(
            currentProduct.price
        );


    savePurchase(
        currentProduct,
        price,
        "real-money"
    );


    closeProductModal();


    purchaseMessage.textContent =
        `Bạn đã mua "${currentProduct.title}" với giá $${formatPrice(price)}.`;

    successModal.classList.remove(
        "hidden"
    );

}


function savePurchase(
    product,
    price,
    paymentMethod
) {

    const purchases =
        JSON.parse(
            localStorage.getItem(
                "shopPurchases"
            ) || "[]"
        );


    purchases.push({

        id:
            product.id,

        title:
            product.title,

        image:
            product.thumbnail,

        price:
            product.price,

        shopMoney:
            paymentMethod === "coin"
                ? price
                : 0,

        paymentMethod:
            paymentMethod,

        date:
            new Date().toISOString()

    });


    localStorage.setItem(
        "shopPurchases",
        JSON.stringify(
            purchases
        )
    );

}


if (buyCoinBtn) {

    buyCoinBtn.addEventListener(
        "click",
        buyWithCoin
    );

}


if (buyRealMoneyBtn) {

    buyRealMoneyBtn.addEventListener(
        "click",
        buyWithRealMoney
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeProductModal
    );

}


if (successClose) {

    successClose.addEventListener(
        "click",
        () => {

            successModal.classList.add(
                "hidden"
            );

        }
    );

}


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            closeProductModal();

        }

    }
);


successModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            successModal
        ) {

            successModal.classList.add(
                "hidden"
            );

        }

    }
);


if (searchBtn && searchInput) {

    searchBtn.addEventListener(
        "click",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                renderProducts(
                    products
                );

                return;

            }


            const filtered =
                products.filter(
                    product => {

                        return (
                            product.title
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            product.description
                                .toLowerCase()
                                .includes(
                                    keyword
                                )
                        );

                    }
                );


            renderProducts(
                filtered
            );

        }
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                searchBtn.click();

            }

        }
    );

}


document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );


                if (
                    button.dataset.category ===
                    "all"
                ) {

                    renderProducts(
                        products
                    );

                } else {

                    renderProducts(
                        products
                    );

                }

            }
        );

    });


updateMoney();

loadKitchenProducts();
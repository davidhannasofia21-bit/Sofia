
/* =====================================
   HOFUR HOME FURNITURE WEBSITE
   JAVASCRIPT FUNCTIONS
===================================== */

// 1. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");

        const isOpen = navLinks.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}

// 2. AUTOMATIC FOOTER YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// 3. PRODUCT PRICES
const productPrices = {
    "Modern Sofa": 12500,
    "Comfortable Bed": 15000,
    "Wooden Table": 5500,
    "Wooden Dining Table": 8500,
    "Coffee Table": 5500,
    "Bedroom Cabinet": 7000,
    "Dining Chair": 2500
};

// 4. LOAD SHOPPING CART
let cart = [];

try {
    const savedCart = localStorage.getItem("hofurCart");

    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart.filter(function (item) {
                return (
                    item &&
                    typeof item.name === "string" &&
                    Number.isFinite(item.price) &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0
                );
            });
        }
    }
} catch (error) {
    cart = [];
}

// 5. SAVE SHOPPING CART
function saveCart() {
    try {
        localStorage.setItem("hofurCart", JSON.stringify(cart));
    } catch (error) {
        console.error("Unable to save shopping cart.");
    }

    updateCart();
}

// 6. UPDATE SHOPPING CART
function updateCart() {

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(function (item) {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartItems) {

        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.textContent = "Your cart is empty.";
        }

        cart.forEach(function (item, index) {

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            const name = document.createElement("span");

            name.textContent =
                item.name + " x " + item.quantity;

            const price = document.createElement("span");

            price.textContent =
                "₱" +
                (item.price * item.quantity).toLocaleString("en-PH");

            const removeButton = document.createElement("button");

            removeButton.textContent = "Remove";
            removeButton.className = "remove-item";
            removeButton.type = "button";

            removeButton.addEventListener("click", function () {

                cart.splice(index, 1);

                saveCart();

            });

            cartItem.appendChild(name);
            cartItem.appendChild(price);
            cartItem.appendChild(removeButton);

            cartItems.appendChild(cartItem);

        });
    }

    if (cartTotal) {
        cartTotal.textContent =
            "₱" + totalPrice.toLocaleString("en-PH");
    }
}

// 7. ADD PRODUCTS TO CART
const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productName = button.dataset.name;

        const productPrice = productPrices[productName];

        if (!productName || productPrice === undefined) {
            alert("Product information is unavailable.");
            return;
        }

        const existingProduct = cart.find(function (item) {
            return item.name === productName;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });

        }

        saveCart();

        alert(productName + " added to your cart!");

    });

});

// 8. PRODUCT SEARCH
const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const productCards = document.querySelectorAll(".product-card");

const noProducts = document.getElementById("noProducts");

function filterProducts() {

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "All";

    let visibleProducts = 0;

    productCards.forEach(function (card) {

        const productName =
            (card.dataset.name || "").toLowerCase();

        const productCategory =
            card.dataset.category || "";

        const matchesSearch =
            productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {

            card.style.display = "";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });

    if (noProducts) {
        noProducts.hidden = visibleProducts > 0;
    }
}

// SEARCH EVENT
if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

// CATEGORY FILTER EVENT
if (categoryFilter) {

    categoryFilter.addEventListener("change", filterProducts);

    // CATEGORY FROM URL
    const urlParameters = new URLSearchParams(
        window.location.search
    );

    const requestedCategory =
        urlParameters.get("category");

    if (
        requestedCategory &&
        ["Living Room", "Bedroom", "Dining Room"].includes(
            requestedCategory
        )
    ) {
        categoryFilter.value = requestedCategory;
        filterProducts();
    }
}

// 9. CHECKOUT BUTTON
const checkoutButton = document.getElementById("checkoutBtn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        if (cart.length === 0) {

            alert("Your shopping cart is empty!");

            return;

        }

        let total = 0;

        cart.forEach(function (item) {
            total += item.price * item.quantity;
        });

        alert(
            "THANK YOU FOR SHOPPING AT HOFUR!\n\n" +
            "Total Amount: ₱" +
            total.toLocaleString("en-PH") +
            "\n\nThis is a demonstration checkout. " +
            "Online payment is not yet available."
        );

    });

}

// 10. CONTACT FORM
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const nameInput =
            document.getElementById("contactName");

        const emailInput =
            document.getElementById("contactEmail");

        const messageInput =
            document.getElementById("contactMessage");

        const customerName = nameInput.value.trim();

        const customerEmail = emailInput.value.trim();

        const customerMessage = messageInput.value.trim();

        if (
            !customerName ||
            !customerEmail ||
            !customerMessage
        ) {
            alert("Please complete all fields.");
            return;
        }

        alert(
            "Thank you, " + customerName + "!\n\n" +
            "Your message has been received in this demo."
        );

        contactForm.reset();

    });

}

// 11. INITIALIZE WEBSITE
updateCart();

console.log("HOFUR website successfully loaded!");

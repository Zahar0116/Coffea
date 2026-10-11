// Requires src/script.js to be loaded first (uses KEY, getLocalStorageItem, setLocalStorageItem).
(() => {
    // Fallback data by product name, used when an item in the cart
    // only has { name, quantity } (the format saved by the catalog button).
    // Add your real products here, or save price/image/description
    // from the card in script.js (see the updated click handler).
    const PRODUCTS = {
        "CoffeeName": {
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit,",
            price: 1225,
            image: "./public/images/rectangle 7.png",
        },
    };

    const DEFAULT_IMAGE = "./public/images/rectangle 7.png";

    const list = document.getElementById("cart-list");
    const empty = document.getElementById("cart-empty");
    const summary = document.getElementById("cart-summary");
    const totalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    const formatPrice = (n) => `${n.toLocaleString("uk-UA")} UAH`;
    const escapeHtml = (s) =>
        String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    // Cart in storage: [{ name, quantity, price?, description?, image? }]
    let cart = getLocalStorageItem(KEY) || [];

    // Open cart.html?demo to preview the layout with a sample item
    if (!cart.length && new URLSearchParams(location.search).has("demo")) {
        cart = [{ name: "CoffeeName", quantity: 12 }];
    }

    // Combine the stored item with the fallback catalog
    const view = (item) => {
        const fallback = PRODUCTS[item.name] || {};
        return {
            name: item.name,
            quantity: item.quantity,
            price: Number(item.price ?? fallback.price ?? 0),
            description: item.description ?? fallback.description ?? "",
            image: item.image ?? fallback.image ?? DEFAULT_IMAGE,
        };
    };

    function render() {
        const hasItems = cart.length > 0;
        empty.hidden = hasItems;
        summary.hidden = !hasItems;

        const items = cart.map(view);

        list.innerHTML = items
            .map(
                (item) => `
            <li class="cart-item" data-name="${escapeHtml(item.name)}">
                <img class="cart-item__img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                <div class="cart-item__body">
                    <h2 class="cart-item__name">${escapeHtml(item.name)}</h2>
                    <p class="cart-item__desc">${escapeHtml(item.description)}</p>
                    <div class="cart-item__footer">
                        <p class="cart-item__price">${formatPrice(item.price)}</p>
                        <div class="qty" role="group" aria-label="Quantity of ${escapeHtml(item.name)}">
                            <button type="button" class="qty__btn qty__btn--minus" data-action="dec" aria-label="Decrease quantity">&minus;</button>
                            <span class="qty__value" aria-live="polite">${item.quantity}</span>
                            <button type="button" class="qty__btn qty__btn--plus" data-action="inc" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                </div>
            </li>`
            )
            .join("");

        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        totalEl.textContent = formatPrice(total);
    }

    list.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const name = btn.closest(".cart-item").dataset.name;
        const item = cart.find((i) => i.name === name);
        if (!item) return;

        if (btn.dataset.action === "inc") item.quantity += 1;
        if (btn.dataset.action === "dec") item.quantity -= 1;

        // Quantity reached 0 — remove the item from the cart
        if (item.quantity <= 0) cart = cart.filter((i) => i.name !== name);

        setLocalStorageItem(KEY, cart);
        render();
    });

    checkoutBtn.addEventListener("click", () => {
        // TODO: navigate to checkout / send the order to the backend
        console.log("Checkout", cart.map(view));
    });

    render();
})();
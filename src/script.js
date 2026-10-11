/* ---------- localStorage helpers ---------- */
function setLocalStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting local storage item:', error);
  }
}

function getLocalStorageItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting local storage item:', error);
    return null;
  }
}

function removeLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing local storage item:', error);
  }
}

function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}

/* ---------- Add to cart (catalog cards) ---------- */
const KEY = "veranda_cart";

// "1225₴" -> 1225
function parsePrice(text) {
  const value = parseFloat(String(text).replace(/[^\d.,]/g, '').replace(',', '.'));
  return Number.isNaN(value) ? 0 : value;
}

const orderButtons = document.querySelectorAll(".productcard button");
orderButtons.forEach(button => {
  button.addEventListener("click", event => {
    const card = event.target.closest('.productcard');

    const product = {
      name: card.querySelector('h3').innerText.trim(),
      description: card.querySelector('.desc')?.innerText.trim() ?? "",
      price: parsePrice(card.querySelector('.price')?.innerText ?? ""),
      image: card.querySelector('img')?.getAttribute('src') ?? ""
    };

    const cart = getLocalStorageItem(KEY) || [];
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += 1;
      Object.assign(existingItem, product); // refresh price/description/image
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setLocalStorageItem(KEY, cart);
    window.location.href = './cart.html';
  });
});
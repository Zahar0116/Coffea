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

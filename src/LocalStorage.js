class LocalStorage {
  getItem(key) {
    return new Promise((resolve) => {
      resolve(window.localStorage.getItem(key));
    });
  }

  setItem(key, value) {
    return new Promise((resolve) => {
      window.localStorage.setItem(key, value);
      resolve();
    });
  }
}

export default LocalStorage;

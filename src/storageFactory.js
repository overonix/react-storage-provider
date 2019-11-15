import LocalStorage from './LocalStorage';

const logError = () => {
  console.error(new Error(`
    LOCAL STORAGE ISN'T AVAILABLE
    Try to pass your storage to storage prop in <StorageProvider/>
  `));
};


const noop = () => new Promise(((resolve) => resolve()));
const noopStorage = {
  getItem: noop,
  setItem: noop,
};

const checkStorageOnError = (type) => {
  if (typeof window !== 'object' || !window[type]) {
    logError();
    return noopStorage;
  }
  return null;
};

const storageFactory = (storage = '') => {
  if (storage === 'localStorage') {
    return checkStorageOnError(storage) || new LocalStorage();
  }
  if (storage.getItem && storage.setItem) {
    return storage;
  }
  logError();
  return noopStorage;
};

export default storageFactory;

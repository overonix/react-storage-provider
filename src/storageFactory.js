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

const isWebStorageAvailable = (storage) => typeof window === 'object' && window[storage];

const storageFactory = (storage = '') => {
  if (storage === 'localStorage' && isWebStorageAvailable(storage)) {
    return new LocalStorage();
  }

  if (storage.getItem && storage.setItem) {
    return storage;
  }

  logError();

  return noopStorage;
};

export default storageFactory;

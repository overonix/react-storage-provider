import LocalStorage from './LocalStorage';

const logError = () => {
  console.error(new Error(`
    STORAGE ISN'T AVAILABLE
    Try to pass your storage to storage prop in <StorageProvider/>
  `));
};

const noop = () => new Promise(((resolve) => resolve()));
const noopStorage = {
  getItem: noop,
  setItem: noop,
};

const isWebStorageAvailable = (storage) => typeof window === 'object' && window[storage];

const checkStorageAPI = async (storage) => {
  try {
    const testKey = 'react-storage-provider__test';
    const testValue = 'test';

    await storage.setItem(testKey, testValue);
    const storageValue = await storage.getItem(testKey);

    if (storageValue === testValue) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

const storageFactory = async (storage) => {
  if (storage === 'localStorage' && isWebStorageAvailable(storage)) {
    return new LocalStorage();
  }

  /**
   * Check if provided storage has storage API methods and works like storage
   */

  if (typeof storage === 'object' && await checkStorageAPI(storage)) {
    return storage;
  }

  logError();

  return noopStorage;
};

export default storageFactory;

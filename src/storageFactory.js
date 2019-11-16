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


const checkStorageAPI = async (storage) => {
  try {
    const testKey = 'react-storage-provider__test';
    const testValue = 'test';

    await storage.setItem(testKey, testValue);
    await storage.getItem(testKey);
    await storage.removeItem(testKey);

    return true;
  } catch (e) {
    return false;
  }
};

const storageFactory = async (storage) => {
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

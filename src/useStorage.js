import { useContext } from 'react';

import { StorageContext } from './StorageProvider';

/**
 * useStorage hook to provide storage object with methods and subscribe to fields in storage
 *
 * Example:
 *
 * Get `storage` object in component:
 *
 * const [, storage] = useStorage();
 *
 * ==============================================
 *
 * Get `storage` object and fields (with subscription) from storage to component:
 *
 * const [{ token }, storage] = useStorage(['token']);
 *
 * @param keys {Array} Should be array with fields keys to subscribe
 *
 * @return {[{ [key]: value }, storage]}
 */
const useStorage = (keys = []) => {
  const { storage } = useContext(StorageContext);

  const stateKeys = keys.reduce((acc, key) => ({ ...acc, [key]: storage.get(key) }), {});

  return [stateKeys, storage];
};

export default useStorage;

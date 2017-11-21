import getStore from '../store';

// Get the store with the given filename.
const store = getStore('settings');

export const getSettings = () => {
  return store.fetch() || [];
};

export const getSetting = key => {
  return store.get(key);
};

export const saveSetting = (key, value) => {
  return store.set(key, value);
};

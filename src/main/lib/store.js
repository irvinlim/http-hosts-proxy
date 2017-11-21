import Store from 'electron-store';

const store = new Store();

export default storageFilename => {
  return {
    fetch() {
      return store.get(storageFilename);
    },
    save(data) {
      return store.set(storageFilename, data);
    },
    delete() {
      return store.delete(storageFilename);
    },
    get(key) {
      if (!key) {
        return null;
      }
      return store.get(`${storageFilename}.${key}`);
    },
    set(key, value) {
      if (!key) {
        return null;
      }
      return store.set(`${storageFilename}.${key}`, value);
    },
  };
};

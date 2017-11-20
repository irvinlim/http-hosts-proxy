import storage from 'electron-json-storage';

// Load hostname mappings from storage into memory.
export let loadedMappings = {};

/**
 * Loads hostname mappings from local JSON storage.
 * @return {Promise} Resolves once the storage data is loaded into memory.
 */
export const loadFromStorage = () => {
  return new Promise((resolve, reject) => {
    storage.get('hostnameMappings', function(err, data) {
      // Handle rejections.
      if (err) {
        return reject(err);
      }

      // Load hostname mappings into memory.
      loadedMappings = data;

      resolve();
    });
  });
};

/**
 * Adds or updates the hostname mapping for a given hostname to a given address.
 * Also saves the mapping to local storage.
 * @param {string} hostname
 * @param {string} address
 * @return {Promise} Resolves once the changes are persisted to disk.
 */
export const upsertMapping = (hostname, address) => {
  // Updates the local dictionary.
  loadedMappings[hostname] = address;

  // Persist the change to disk.
  return saveIntoStorage();
};

/**
 * Deletes the hostname mapping for a given address.
 * @param {string} hostname
 * @return {Promise} Resolves once the changes are persisted to disk.
 */
export const deleteMapping = hostname => {
  // Deletes the mapping for the given hostname.
  delete loadedMappings[hostname];

  // Persist the change to disk.
  return saveIntoStorage();
};

/**
 * Saves the hostname mappings from memory into JSON storage.
 * @return {Promise} Resolves once the changes are persisted to disk.
 */
const saveIntoStorage = () => {
  return new Promise((resolve, reject) => {
    storage.set('hostnameMapings', loadedMappings, function(err) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

import getStore from '../store';
import { populate } from './proxy_globs';

// Get the store with the given filename.
const store = getStore('hostname_mappings');

// Load hostname mappings into memory.
let loadedMappings = null;
let loadedMappingsList = [];

/**
 * Loads hostname mappings from local JSON storage.
 */
export const loadFromStorage = () => {
  let mappings = store.fetch();

  if (!mappings) {
    mappings = {};
  }

  // Load into memory.
  loadIntoMemory(mappings);
};

/**
 * Retrieves all hostname mappings from memory.
 * @return {object} Returns an object containing mappings from hostname to address.
 */
export const getMappings = () => {
  if (loadedMappings === null) {
    loadFromStorage();
  }

  return loadedMappings;
};

/**
 * Loads a mapping for a hostname to an address.
 * @param {string} hostname
 */
export const getMapping = hostname => {
  const data = loadedMappings[hostname];
  return data;
};

/**
 * Performs a complete replacement of all mappings.
 * @param {object} mappings
 */
export const putMappings = mappings => {
  // Replace mappings in memory.
  loadIntoMemory(mappings);

  // Persist changes to disk.
  saveIntoStorage();
};

/**
 * Adds or updates the hostname mapping for a given hostname to a given address.
 * Also saves the mapping to local storage.
 * @param {string} hostname
 * @param {Object} data
 */
export const upsertMapping = (hostname, data) => {
  // Load mappings if necessary first.
  loadFromStorage();

  // Updates the local dictionary.
  loadedMappings[hostname] = data;

  // Persist the change to disk.
  saveIntoStorage();
};

/**
 * Deletes the hostname mapping for a given address.
 * @param {string} hostname
 */
export const deleteMapping = hostname => {
  // Load mappings if necessary first.
  loadFromStorage();

  // Deletes the mapping for the given hostname.
  delete loadedMappings[hostname];

  // Persist the change to disk.
  saveIntoStorage();
};

/**
 * Saves the hostname mappings from memory into JSON storage.
 * @return {Promise} Resolves once the changes are persisted to disk.
 */
const saveIntoStorage = () => {
  // Save dictionary of mappings.
  store.save(loadedMappings);

  // Reload all data structures into memory.
  loadIntoMemory(loadedMappings);
};

const loadIntoMemory = mappings => {
  // Save dictionary to memory.
  loadedMappings = mappings;

  // Convert to array for easy iteration.
  loadedMappingsList = convertDictToArray(loadedMappings);

  // Reload domain tree for fast glob lookups.
  populate(loadedMappingsList);
};

const convertDictToArray = mappingsDict => {
  const array = [];

  for (let hostname in mappingsDict) {
    array.push({
      hostname,
      ...mappingsDict[hostname],
    });
  }

  return array;
};

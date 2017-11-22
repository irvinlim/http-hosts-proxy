import { ipcRenderer } from 'electron';

/**
 * Uses IPC to perform a GET request from the main process. Depends on the
 * main process to invoke the "data" event once the data is ready.
 *
 * @param {Event} event
 * @return {Promise}
 */
export const ipcGet = event => {
  ipcRenderer.send(event);
  return new Promise(resolve =>
    ipcRenderer.once(`${event}.data`, (event, data) => resolve(data))
  );
};

/**
 * Uses IPC to receive data from the main process. Depends on the main process
 * to call the "data" event to push the data to the ipcRenderer.
 *
 * @param {Event} event
 * @param {Function} callbacl
 */
export const ipcReceive = (event, callback) => {
  ipcRenderer.on(`${event}.data`, (event, data) => callback(data));
};

/**
 * Uses IPC to perform a ACTION request to the main process. Depends on the
 * main process to invoke the "success" event once the data has been
 * successfully sent.
 *
 * @param {Event} event
 * @return {Promise}
 */
export const ipcAction = event => {
  ipcRenderer.send(event);
  return new Promise((resolve, reject) => {
    ipcRenderer.once(`${event}.success`, resolve);
    ipcRenderer.once(`${event}.fail`, reject);
  });
};

/**
 * Uses IPC to perform a POST request to the main process. Depends on the
 * main process to invoke the "success" event once the data has been
 * successfully sent.
 *
 * @param {Event} event
 * @param {*} data
 * @return {Promise}
 */
export const ipcPost = (event, data) => {
  ipcRenderer.send(event, data);
  return new Promise(resolve =>
    ipcRenderer.once(`${event}.data`, (event, result) => resolve(result))
  );
};

/**
 * Uses IPC to perform a PUT request to the main process. Depends on the
 * main process to invoke the "success" event once the data has been
 * successfully sent.
 *
 * @param {Event} event
 * @param {*} data
 * @return {Promise}
 */
export const ipcPut = (event, data) => {
  ipcRenderer.send(event, data);
  return new Promise(resolve => ipcRenderer.once(`${event}.success`, resolve));
};

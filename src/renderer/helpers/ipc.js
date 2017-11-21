/**
 * Uses IPC to perform a GET request from the main process. Depends on the
 * main process to invoke the "data" event once the data is ready.
 *
 * @param {Vue} self
 * @param {Event} event
 * @return {Promise}
 */
export const ipcGet = (self, event) => {
  self.$electron.ipcRenderer.send(event);
  return new Promise(resolve =>
    self.$electron.ipcRenderer.once(`${event}.data`, (event, data) =>
      resolve(data)
    )
  );
};

/**
 * Uses IPC to receive data from the main process. Depends on the main process
 * to call the "data" event to push the data to the ipcRenderer.
 *
 * @param {Vue} self
 * @param {Event} event
 * @param {Function} callbacl
 */
export const ipcReceive = (self, event, callback) => {
  self.$electron.ipcRenderer.on(`${event}.data`, (event, data) =>
    callback(data)
  );
};

/**
 * Uses IPC to perform a ACTION request to the main process. Depends on the
 * main process to invoke the "success" event once the data has been
 * successfully sent.
 *
 * @param {Vue} self
 * @param {Event} event
 * @return {Promise}
 */
export const ipcAction = (self, event) => {
  self.$electron.ipcRenderer.send(event);
  return new Promise((resolve, reject) => {
    self.$electron.ipcRenderer.once(`${event}.success`, resolve);
    self.$electron.ipcRenderer.once(`${event}.fail`, reject);
  });
};

/**
 * Uses IPC to perform a PUT request to the main process. Depends on the
 * main process to invoke the "success" event once the data has been
 * successfully sent.
 *
 * @param {Vue} self
 * @param {Event} event
 * @param {*} data
 * @return {Promise}
 */
export const ipcPut = (self, event, data) => {
  self.$electron.ipcRenderer.send(event, data);
  return new Promise(resolve =>
    self.$electron.ipcRenderer.once(`${event}.success`, resolve)
  );
};

import { ipcMain } from 'electron';
import proxy from '../lib/proxy';

/**
 * GET proxy.storage.mappings
 *
 * Allows ipcRenderers to fetch hostname mappings from the main process.
 */
ipcMain.on('proxy.storage.getMappings', event => {
  const mappings = proxy.storage.getMappings();

  // Reply back via IPC to send data over.
  event.sender.send('proxy.storage.getMappings.data', mappings);
});

/**
 * PUT proxy.storage.mappings
 *
 * Allows ipcRenderers to save new hostname mappings to disk.
 */
ipcMain.on('proxy.storage.putMappings', (event, data) => {
  // Store data into storage.
  proxy.storage.putMappings(data);

  // Reply back via IPC that it was successful.
  event.sender.send('proxy.storage.putMappings.success');
});

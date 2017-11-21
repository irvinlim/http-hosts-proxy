import { ipcMain } from 'electron';
import settings from '../lib/settings';

/**
 * GET proxy.storage.mappings
 *
 * Allows ipcRenderers to fetch app settings from the main process.
 */
ipcMain.on('settings.storage.getSettings', event => {
  const mappings = settings.storage.getSettings();

  // Reply back via IPC to send data over.
  event.sender.send('settings.storage.getSettings.data', mappings);
});

/**
 * PUT settings.storage.saveSetting
 *
 * Allows ipcRenderers to save a setting to disk.
 */
ipcMain.on('settings.storage.saveSetting', (event, data) => {
  const { key, value } = data;

  // Store data into storage.
  settings.storage.saveSetting(key, value);

  // Reply back via IPC that it was successful.
  event.sender.send('settings.storage.saveSetting.success');
});

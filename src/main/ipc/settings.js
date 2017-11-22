import { ipcMain } from 'electron';
import settings from '../lib/settings';

/**
 * GET proxy.storage.getSettings
 *
 * Allows ipcRenderers to fetch app settings from the main process.
 */
ipcMain.on('settings.storage.getSettings', event => {
  const data = settings.storage.getSettings();
  event.sender.send('settings.storage.getSettings.data', data);
});

/**
 * POST proxy.storage.getSetting
 *
 * Allows ipcRenderers to fetch app settings from the main process.
 */
ipcMain.on('settings.storage.getSetting', (event, data) => {
  const { key, defaultValue } = data;
  const setting = settings.storage.getSetting(key, defaultValue);
  event.sender.send('settings.storage.getSetting.data', setting);
});

/**
 * PUT settings.storage.saveSetting
 *
 * Allows ipcRenderers to save a setting to disk.
 */
ipcMain.on('settings.storage.saveSetting', (event, data) => {
  const { key, value } = data;
  settings.storage.saveSetting(key, value);
  event.sender.send('settings.storage.saveSetting.success');
});

import { ipcMain } from 'electron';
import proxy from '../lib/proxy';
import settings from '../lib/settings';

/**
 * ACTION proxy.server.start
 *
 * Allows ipcRenderers to start the proxy server.
 */
ipcMain.on('proxy.server.start', async event => {
  // Get listening port number from settings.
  const listeningPort = settings.storage.getSetting('listeningPort', 0);

  // Start the server.
  try {
    await proxy.server.start(listeningPort);
    event.sender.send('proxy.server.start.success');
  } catch (err) {
    event.sender.send('proxy.server.start.fail');
  }

  // Push isListening event.
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);

  // Push getAddress event.
  const address = proxy.server.getAddress();
  event.sender.send('proxy.server.getAddress.data', address);
});

/**
 * ACTION proxy.server.stop
 *
 * Allows ipcRenderers to stop the proxy server.
 */
ipcMain.on('proxy.server.stop', async event => {
  // Stop the server.
  await proxy.server.stop();

  // Push success event.
  event.sender.send('proxy.server.stop.success');

  // Push isListening event.
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);

  // Push getAddress event.
  const address = proxy.server.getAddress();
  event.sender.send('proxy.server.getAddress.data', address);
});

/**
 * ACTION proxy.server.restart
 *
 * Allows ipcRenderers to restart the proxy server.
 */
ipcMain.on('proxy.server.restart', async event => {
  // Get listening port number from settings.
  const listeningPort = settings.storage.getSetting('listeningPort', 0);

  // Restart the server.
  try {
    await proxy.server.restart(listeningPort);
    event.sender.send('proxy.server.restart.success');
  } catch (err) {
    event.sender.send('proxy.server.restart.fail');
  }

  // Push success event.
  event.sender.send('proxy.server.restart.success');

  // Push isListening event.
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);

  // Push getAddress event.
  const address = proxy.server.getAddress();
  event.sender.send('proxy.server.getAddress.data', address);
});

/**
 * GET proxy.server.isListening
 *
 * Allows ipcRenderers to get the status of the proxy server.
 */
ipcMain.on('proxy.server.isListening', event => {
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);
});

/**
 * GET proxy.server.getAddress
 *
 * Allows ipcRenderers to get the status of the proxy server.
 */
ipcMain.on('proxy.server.getAddress', event => {
  const address = proxy.server.getAddress();
  event.sender.send('proxy.server.getAddress.data', address);
});

/**
 * GET proxy.storage.getMappings
 *
 * Allows ipcRenderers to fetch hostname mappings from the main process.
 */
ipcMain.on('proxy.storage.getMappings', event => {
  const mappings = proxy.storage.getMappings();
  event.sender.send('proxy.storage.getMappings.data', mappings);
});

/**
 * PUT proxy.storage.putMappings
 *
 * Allows ipcRenderers to save new hostname mappings to disk.
 */
ipcMain.on('proxy.storage.putMappings', (event, data) => {
  proxy.storage.putMappings(data);
  event.sender.send('proxy.storage.putMappings.success');
});

import { ipcMain } from 'electron';
import proxy from '../lib/proxy';

/**
 * ACTION proxy.server.start
 *
 * Allows ipcRenderers to start the proxy server.
 */
ipcMain.on('proxy.server.start', event => {
  // Start the server.
  proxy.server.start();

  // Push success event.
  event.sender.send('proxy.server.start.success');

  // Push isListening event.
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);
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
});

/**
 * ACTION proxy.server.restart
 *
 * Allows ipcRenderers to restart the proxy server.
 */
ipcMain.on('proxy.server.restart', async event => {
  // Restart the server.
  await proxy.server.restart();

  // Push success event.
  event.sender.send('proxy.server.restart.success');

  // Push isListening event.
  const isListening = proxy.server.isListening();
  event.sender.send('proxy.server.isListening.data', isListening);
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

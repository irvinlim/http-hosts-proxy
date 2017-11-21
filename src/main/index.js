'use strict';

import './ipc';

import * as tray from './app/tray';
import * as window from './app/window';

import { app } from 'electron';
import proxy from './lib/proxy';
import settings from './lib/settings';

// Set the userData path to separate folders for each environment.
if (process.env.NODE_ENV !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${process.env.NODE_ENV})`);
}

app.on('ready', () => {
  // Get listening port number from settings.
  const listeningPort = settings.storage.getSetting('listeningPort', 0);

  // Loads hostname mappings from storage.
  proxy.storage.loadFromStorage();

  // Starts the proxy listening on a port.
  proxy.server.start(listeningPort);

  // Instantiates the app window.
  window.create();

  // Instantiates the tray icon.
  tray.init();
});

// Called when the app wants to quit and wants to start closing all the windows.
// We have to tell the windows to close, otherwise they will continue to minimize to tray.
app.on('before-quit', () => {
  window.prepareForQuit();
});

// TODO: Handle uncaught exceptions like ETIMEDOUT.
process.on('uncaughtException', function(error) {
  console.error('Uncaught exception: ', error);
});

'use strict';

import createWindow from './helpers/window';

// Store main window instance.
let mainWindow = null;

// Store state if instance is quitting.
let isInstanceQuitting = false;

// Enable hot reloading of the window during development.
const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

/**
 * Creates a new instance of the main window for the application.
 * @return {BrowserWindow} Returns the window object.
 */
export const create = () => {
  // Creates a window.
  mainWindow = createWindow('main', {
    width: 1200,
    height: 900,
  });

  // Load the main HTML page.
  mainWindow.loadURL(winURL);

  // Auto open DevTools only in development.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  // Auto-hide on start.
  mainWindow.hide();

  // Handle minimizing to tray.
  const handleMinimize = event => {
    event.preventDefault();
    mainWindow.hide();
  };

  mainWindow.on('minimize', handleMinimize);

  // Handle window closing event.
  // @see https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/8
  mainWindow.on('close', event => {
    if (isInstanceQuitting) {
      mainWindow = null;
    } else {
      handleMinimize(event);
    }
  });

  return mainWindow;
};

/**
 * Shows the main window.
 */
export const show = () => {
  if (!mainWindow) {
    return;
  }

  mainWindow.show();
};

/**
 * Allows the main window to close in order to quit, instead of minimizing to the tray.
 */
export const prepareForQuit = () => {
  isInstanceQuitting = true;
};

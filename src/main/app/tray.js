'use strict';

import * as window from './window';

import { Menu, Tray, app } from 'electron';

import { platform } from 'os';

// Prevent tray icon from being GC'ed.
let tray = null;

// Tooltip which will be shown on hover.
const tooltip = app.getName();

// Context menu items.
const contextMenuItems = [
  {
    label: `Open ${app.getName()}`,
    click() {
      window.show();
    },
  },
  { type: 'separator' },
  {
    label: 'Quit',
    click() {
      app.quit();
    },
  },
];

// Path to icons.
const iconsPath = 'static/icons';

// Get tray image paths depending on platform.
const getTrayImage = platform => {
  if (platform === 'darwin') {
    return `${iconsPath}/macos/iconTemplate.png`;
  } else if (platform === 'win32') {
    return `${iconsPath}/win/tray.icns`;
  }
};

/**
 * Performs the initialization of the tray icon in the system's notification area.
 */
export const init = () => {
  // Create tray icon.
  tray = new Tray(getTrayImage(platform()));

  // Set highlighted image (for macOS only).
  if (platform === 'darwin') {
    tray.setPressedImage(`${iconsPath}/trayHighlight.png`);
  }

  // Create context menu.
  const contextMenu = Menu.buildFromTemplate(contextMenuItems);
  tray.setContextMenu(contextMenu);

  // Set tooltip.
  tray.setToolTip(tooltip);
};

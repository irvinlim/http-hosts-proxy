import { BrowserWindow, screen } from 'electron';

export default (name, options) => {
  let win;

  const defaultSize = {
    width: options.width,
    height: options.height,
  };

  // Get the bounds of the primary display.
  const bounds = screen.getPrimaryDisplay().bounds;

  // Center the window in the screen.
  options = Object.assign({}, options, {
    x: (bounds.width - defaultSize.width) / 2,
    y: (bounds.height - defaultSize.height) / 2,
  });

  // Create the browser window object.
  win = new BrowserWindow(options);

  return win;
};

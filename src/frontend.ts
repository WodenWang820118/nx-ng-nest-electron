import { BrowserWindow } from 'electron';
import { join } from 'path';
import { existsSync } from 'fs';
import * as pathUtils from './path-utils';
import * as fileUtils from './file-utils';
import * as environmentUtils from './environment-utils';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let loadingWindow: null | BrowserWindow = null;

function createLoadingWindow() {
  console.log('Creating loading window');
  if (loadingWindow) {
    console.log('Loading window already exists');
    return loadingWindow;
  }

  try {
    loadingWindow = new BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        preload: join(__dirname, 'preload.js'),
      },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      loadingWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      loadingWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    loadingWindow.center();

    loadingWindow.on('closed', () => {
      loadingWindow = null;
    });

    return loadingWindow;
  } catch (error) {
    console.error('Error creating loading window:', error);
    fileUtils.logToFile(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        process.resourcesPath
      ),
      error,
      'error'
    );
    return null;
  }
}

function createWindow(resourcesPath: string) {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  try {
    const entryPath = pathUtils.getProductionFrontendPath(resourcesPath);
    fileUtils.logToFile(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        resourcesPath
      ),
      `Loading file: ${entryPath}`,
      'info'
    );
    if (!existsSync(entryPath)) {
      const devFrontendPath = pathUtils.getDevFrontendPath();
      mainWindow.loadFile(devFrontendPath);
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(entryPath);
    }
  } catch (e) {
    console.error(e);
  }
}

export { createLoadingWindow, createWindow };

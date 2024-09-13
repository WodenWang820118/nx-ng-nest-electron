'use strict';
const { BrowserWindow } = require('electron');
const { join } = require('path');
const pathUtils = require('./path-utils.cjs');
const fileUtils = require('./file-utils.cjs');

let loadingWindow = null;

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
      },
    });

    loadingWindow.loadFile(join(__dirname, 'loading.html'));
    loadingWindow.center();

    loadingWindow.on('closed', () => {
      loadingWindow = null;
    });

    return loadingWindow;
  } catch (error) {
    console.error('Error creating loading window:', error);
    return null;
  }
}

function createWindow(env, resourcesPath) {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  try {
    const entryPath = pathUtils.getFrontendPath(env, resourcesPath);
    fileUtils.logToFile(
      join(pathUtils.getRootBackendFolderPath(env, resourcesPath)),
      entryPath,
      'info'
    );
    mainWindow.loadFile(entryPath);
    mainWindow.webContents.openDevTools(); // Open DevTools in development
  } catch (e) {
    console.error(e);
    fileUtils.logToFile(
      join(pathUtils.getRootBackendFolderPath(env, resourcesPath)),
      e,
      'error'
    );
  }
}

module.exports = {
  createLoadingWindow,
  createWindow,
};

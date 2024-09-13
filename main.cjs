'use strict';
const { app, BrowserWindow } = require('electron');
const { join } = require('path');
const pathUtils = require('./main-process/path-utils.cjs');
const environmentUtils = require('./main-process/environment-utils.cjs');
const backend = require('./main-process/backend.cjs');
const frontend = require('./main-process/frontend.cjs');
const constants = require('./main-process/constants.cjs');
const fileUtils = require('./main-process/file-utils.cjs');

let server;
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('use-gl', 'desktop');

app.whenReady().then(async () => {
  server = backend.startBackend(process.resourcesPath);
  const loadingWindow = frontend.createLoadingWindow();
  server.once('spawn', async () => {
    try {
      if (
        await backend.checkIfPortIsOpen(
          constants.URLs,
          20,
          2000,
          process.resourcesPath,
          loadingWindow
        )
      ) {
        loadingWindow.close();
        frontend.createWindow(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        );
      }
    } catch (error) {
      console.error(error);
      fileUtils.logToFile(
        join(
          pathUtils.getRootBackendFolderPath(
            environmentUtils.getEnvironment(),
            process.resourcesPath
          )
        ),
        error,
        'error'
      );
    }
  });

  server.on('message', (message) => {
    console.log(`Message from child: ${message}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      message,
      'info'
    );
  });

  server.on('error', (error) => {
    console.error(`Error from child: ${error}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      error,
      'error'
    );
  });

  server.on('exit', (code, signal) => {
    console.log(`Child exited with code ${code} and signal ${signal}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      `Child exited with code ${code} and signal ${signal}`,
      'error'
    );
  });
});

app.on('before-quit', async () => {
  // Perform any necessary cleanup here
  console.log('App is about to quit. Performing cleanup...');
  fileUtils.logToFile(
    join(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        process.resourcesPath
      )
    ),
    'App is about to quit. Performing cleanup...',
    'info'
  );
  if (server) {
    server.kill();
  }

  // Wait for all asynchronous operations to complete
  await new Promise((resolve) => {
    setTimeout(resolve, 1000); // Adjust the timeout as needed
  });

  // Quit the app
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
  }
});

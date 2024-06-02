'use strict';
// electron
const { app, BrowserWindow } = require('electron');
// child_process
const { fork } = require('child_process');
// os module
const path = require('path');
const fs = require('fs');

const ROOT_DATABASE_NAME = 'database.sqlite3';

// utils
let server;
function getRootBackendFolderPath() {
  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'staging':
      return path.join('dist', 'nest-backend');
    case 'prod':
      return process.resourcesPath;
    default:
      // Default to production path
      return process.resourcesPath;
  }
}

function writePath(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function getFrontendPath() {
  const devFrontendPath = path.join(
    'dist',
    'ng-tracker',
    'browser',
    'index.html'
  );

  const prodFrontendPath = path.join(
    process.resourcesPath,
    'ng-tracker',
    'browser',
    'index.html'
  );

  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'staging':
      return devFrontendPath;
    case 'prod':
      return prodFrontendPath;
    default:
      return prodFrontendPath;
  }
}

// backend

function startBackend() {
  let env;
  const rootBackendFolderPath = getRootBackendFolderPath();
  const serverPath = path.join(rootBackendFolderPath, 'main.js');
  const databasePath = path.join(rootBackendFolderPath, ROOT_DATABASE_NAME);
  switch (process.env.NODE_ENV) {
    case 'dev':
      env = {
        NODE_ENV: 'dev',
        DATABASE_PATH: databasePath,
        PORT: 3000,
      };
      break;
    case 'staging':
      env = {
        NODE_ENV: 'staging',
        DATABASE_PATH: databasePath,
        PORT: 3000,
      };
      break;
    case 'prod':
      env = {
        NODE_ENV: 'prod',
        DATABASE_PATH: databasePath,
        PORT: 5000,
      };
      break;
    default:
      env = {
        NODE_ENV: 'prod',
        DATABASE_PATH: databasePath,
        PORT: 5000,
      };
      break;
  }

  writePath(
    path.join(getRootBackendFolderPath(), 'env.txt'),
    JSON.stringify(env, null, 2)
  );

  writePath(
    path.join(getRootBackendFolderPath(), 'serverPath.txt'),
    serverPath
  );

  return fork(serverPath, { env });
}

async function checkIfPortIsOpen(urls, maxAttempts = 20, timeout = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response) {
          console.log('Server is ready');
          return true; // Port is open
        }
      } catch (error) {
        console.log(`Attempt ${attempt}: Waiting for server to start...`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, timeout)); // Wait for 2 seconds before retrying
  }
  throw new Error(
    `Failed to connect to the server after ${maxAttempts} attempts`
  );
}

// electron

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  try {
    const entryPath = getFrontendPath();
    writePath(
      path.join(getRootBackendFolderPath(), 'entryPath.txt'),
      entryPath
    );
    mainWindow.loadFile(entryPath);
    mainWindow.webContents.openDevTools(); // Open DevTools in development
  } catch (e) {
    console.error(e);
    writePath(
      path.join(getRootBackendFolderPath(), 'entryPathError.txt'),
      e.message
    );
  }
}

// Electron app

app.whenReady().then(async () => {
  server = startBackend();
  server.once('spawn', async () => {
    const urls = ['http://localhost:5000', 'http://localhost:3000'];

    try {
      if (await checkIfPortIsOpen(urls, 20, 2000)) {
        createWindow();
      }
    } catch (error) {
      console.error(error.message);
      writePath(
        path.join(getRootBackendFolderPath(), 'portErrorLog.txt'),
        error.message
      );
    }
  });

  server.on('message', (message) => {
    console.log(`Message from child: ${message}`);
  });

  server.on('error', (error) => {
    console.error(`Error from child: ${error}`);
    writePath(
      path.join(getRootBackendFolderPath(), 'childErrorLog.txt'),
      error.message
    );
  });

  server.on('exit', (code, signal) => {
    console.log(`Child exited with code ${code} and signal ${signal}`);
    writePath(
      path.join(getRootBackendFolderPath(), 'childExitLog.txt'),
      `Child exited with code ${code} and signal ${signal}`
    );
  });
});

app.on('before-quit', async () => {
  // Perform any necessary cleanup here
  console.log('App is about to quit. Performing cleanup...');
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

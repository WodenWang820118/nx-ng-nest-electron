// electron
const { app, BrowserWindow } = require('electron');
// child_process
const { spawn } = require('child_process');
// os module
const path = require('path');
const fs = require('fs');

('use strict');
const ROOT_DATABASE_NAME = 'database.sqlite3';

// utils

function getRootBackendFolderPath() {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return path.join('dist', 'nest-backend');
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
  let env, serverProcess;
  const rootBackendFolderPath = getRootBackendFolderPath();
  const serverPath = path.join(rootBackendFolderPath, 'main.js');
  const commonEnv = {
    ...process.env,
    DATABASE_PATH: path.join(rootBackendFolderPath, ROOT_DATABASE_NAME),
  };

  switch (process.env.NODE_ENV) {
    case 'dev':
      env = {
        ...commonEnv,
        NODE_ENV: 'dev',
      };
      break;
    case 'staging':
      env = {
        ...commonEnv,
        NODE_ENV: 'staging',
      };
      break;
    case 'prod':
      env = {
        ...commonEnv,
        NODE_ENV: 'prod',
        PORT: 5000,
      };
      break;
    default:
      env = {
        ...commonEnv,
        NODE_ENV: 'prod',
        PORT: 5000,
      };
      break;
  }

  writePath(path.join(rootBackendFolderPath, 'serverPath.txt'), serverPath);
  writePath(
    path.join(rootBackendFolderPath, 'env.txt'),
    JSON.stringify(env, null, 2)
  );

  try {
    serverProcess = spawn('node', [serverPath], { env });
    serverProcess.stdout.on('data', (data) => {
      if (data) {
        console.log(`Backend: ${data}`);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      if (data) {
        writePath(path.join(rootBackendFolderPath, 'serverErrorLog.txt'), data);
        console.error(`Backend Error: ${data}`);
      }
    });

    serverProcess.on('close', (code) => {
      writePath(
        path.join(rootBackendFolderPath, 'serverCloseLog.txt'),
        `Process exited with code ${code}`
      );
      console.log(`Backend process exited with code ${code}`);
    });
  } catch (error) {
    console.error(`Failed to start the backend process: ${error.message}`);
    writePath(
      path.join(rootBackendFolderPath, 'serverErrorLog.txt'),
      error.message
    );
  }
}

// electron

async function createWindow() {
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
  startBackend();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

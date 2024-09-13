'use strict';
// const { utilityProcess } = require('electron');
const { fork } = require('child_process');
const { join } = require('path');
const constants = require('./constants.cjs');
const environmentUtils = require('./environment-utils.cjs');
const fileUtils = require('./file-utils.cjs');
const pathUtils = require('./path-utils.cjs');

function startBackend(resourcesPath) {
  let env;
  const rootBackendFolderPath = pathUtils.getRootBackendFolderPath(
    environmentUtils.getEnvironment(),
    resourcesPath
  );
  fileUtils.logToFile(rootBackendFolderPath, `Starting server`, 'info');
  const serverPath = join(rootBackendFolderPath, 'main.js');
  const databasePath = join(
    rootBackendFolderPath,
    constants.ROOT_DATABASE_NAME
  );
  switch (environmentUtils.getEnvironment()) {
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

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Starting server with environment: ${JSON.stringify(env, null, 2)}`
  );

  fileUtils.logToFile(rootBackendFolderPath, `Server path: ${serverPath}`);

  // return utilityProcess.fork(serverPath, { env });
  return fork(serverPath, { env });
}

async function checkIfPortIsOpen(
  urls,
  maxAttempts = 20,
  timeout = 1000,
  resourcesPath,
  loadingWindow
) {
  const logFilePath = join(
    pathUtils.getRootBackendFolderPath(
      environmentUtils.getEnvironment(),
      resourcesPath
    )
  );
  await new Promise((resolve) => setTimeout(resolve, 5000)); // await the backend to start
  fileUtils.logToFile(logFilePath, `Checking if port is open`, 'info');
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const url of urls) {
      try {
        const response = await fetch(url);

        console.log('Response status:', response.status);
        console.log(
          'Response headers:',
          JSON.stringify(Object.fromEntries(response.headers), null, 2)
        );

        const responseData = await response.text();
        console.log('Response body:', responseData);

        fileUtils.logToFile(logFilePath, responseData, 'info');

        if (response.ok) {
          console.log('Server is ready');
          fileUtils.logToFile(
            logFilePath,
            `Server is ready: ${responseData}`,
            'info'
          );
          return true; // Port is open
        } else {
          console.log(`Server responded with status: ${response.status}`);
          fileUtils.logToFile(
            logFilePath,
            `Server responded with status: ${response.status}`,
            'warning'
          );
        }
      } catch (error) {
        console.error(`Attempt ${attempt}: Error connecting to ${url}:`, error);
        fileUtils.logToFile(
          logFilePath,
          `Attempt ${attempt}: Error connecting to ${url}: ${error.toString()}`,
          'error'
        );
        fileUtils.logToFile(
          logFilePath,
          `Attempt ${attempt}: ${error.toString()}`,
          'error'
        );
      }
    }

    if (attempt < maxAttempts) {
      console.log(`Waiting ${timeout}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }

  loadingWindow.close();
  throw new Error(
    `Failed to connect to the server after ${maxAttempts} attempts`
  );
}

module.exports = {
  startBackend,
  checkIfPortIsOpen,
};

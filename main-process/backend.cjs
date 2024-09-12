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

  fileUtils.writePath(
    join(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        resourcesPath
      ),
      'env.txt'
    ),
    JSON.stringify(env, null, 2)
  );

  fileUtils.writePath(
    join(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        resourcesPath
      ),
      'serverPath.txt'
    ),
    serverPath
  );

  // return utilityProcess.fork(serverPath, { env });
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

module.exports = {
  startBackend,
  checkIfPortIsOpen,
};

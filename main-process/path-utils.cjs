'use strict';
const { join } = require('path');

function getRootBackendFolderPath(env, resourcesPath) {
  switch (env) {
    case 'dev':
    case 'staging':
      return join('dist', 'nest-backend');
    case 'prod':
      return resourcesPath;
    default:
      // Default to production path
      return resourcesPath;
  }
}

function getFrontendPath(env, resourcesPath) {
  const devFrontendPath = join('dist', 'ng-tracker', 'browser', 'index.html');

  const prodFrontendPath = join(
    resourcesPath,
    'ng-tracker',
    'browser',
    'index.html'
  );

  switch (env) {
    case 'dev':
    case 'staging':
      return devFrontendPath;
    case 'prod':
      return prodFrontendPath;
    default:
      return prodFrontendPath;
  }
}

module.exports = {
  getRootBackendFolderPath,
  getFrontendPath,
};

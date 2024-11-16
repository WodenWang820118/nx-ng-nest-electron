import { join } from 'path';
import { cwd } from 'process';

function getRootBackendFolderPath(env: string, resourcesPath: string) {
  switch (env) {
    case 'dev':
    case 'staging':
      return join(cwd(), 'dist', 'nest-backend');
    case 'prod':
      return resourcesPath;
    default:
      return join(cwd(), 'dist', 'nest-backend');
  }
}

function getProductionFrontendPath(resourcesPath: string) {
  return join(resourcesPath, 'ng-tracker', 'browser', 'index.html');
}

function getDevFrontendPath() {
  return join(cwd(), 'dist', 'ng-tracker', 'browser', 'index.html');
}

export { getRootBackendFolderPath, getProductionFrontendPath, getDevFrontendPath };

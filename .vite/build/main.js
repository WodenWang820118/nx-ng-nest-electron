"use strict";
const require$$8 = require("electron");
const require$$4 = require("path");
const require$$0 = require("assert");
const require$$5 = require("fs");
const require$$6 = require("os");
const require$$7 = require("util");
const process$1 = require("process");
const child_process = require("child_process");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var dist = {};
var isUrl_1 = isUrl$1;
var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
function isUrl$1(string) {
  if (typeof string !== "string") {
    return false;
  }
  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }
  return false;
}
var s = 1e3;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === "string" && val.length > 0) {
    return parse(val);
  } else if (type === "number" && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
  );
};
function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || "ms").toLowerCase();
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return void 0;
  }
}
function fmtShort(ms2) {
  var msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return Math.round(ms2 / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(ms2 / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(ms2 / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(ms2 / s) + "s";
  }
  return ms2 + "ms";
}
function fmtLong(ms2) {
  var msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return plural(ms2, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms2, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms2, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms2, msAbs, s, "second");
  }
  return ms2 + " ms";
}
function plural(ms2, msAbs, n, name2) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms2 / n) + " " + name2 + (isPlural ? "s" : "");
}
var isUrl = isUrl_1;
var laxUrlRegex = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/;
var commonjs = function(repoUrl, opts) {
  var obj = {};
  opts = opts || {};
  if (!repoUrl) {
    return null;
  }
  if (repoUrl.url) {
    repoUrl = repoUrl.url;
  }
  if (typeof repoUrl !== "string") {
    return null;
  }
  var shorthand = repoUrl.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/);
  var mediumhand = repoUrl.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/);
  var antiquated = repoUrl.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
  if (shorthand) {
    obj.user = shorthand[1];
    obj.repo = shorthand[2];
    obj.branch = shorthand[3] || "master";
    obj.host = "github.com";
  } else if (mediumhand) {
    obj.user = mediumhand[1];
    obj.repo = mediumhand[2];
    obj.branch = mediumhand[3] || "master";
    obj.host = "github.com";
  } else if (antiquated) {
    obj.user = antiquated[1];
    obj.repo = antiquated[2].replace(/\.git$/i, "");
    obj.branch = "master";
    obj.host = "github.com";
  } else {
    repoUrl = repoUrl.replace(/^git\+/, "");
    if (!isUrl(repoUrl)) {
      return null;
    }
    var ref = repoUrl.match(laxUrlRegex) || [];
    var hostname = ref[1];
    var pathname = ref[2];
    if (!hostname) {
      return null;
    }
    if (hostname !== "github.com" && hostname !== "www.github.com" && !opts.enterprise) {
      return null;
    }
    var parts = pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!parts) {
      return null;
    }
    obj.user = parts[1];
    obj.repo = parts[2].replace(/\.git$/i, "");
    obj.host = hostname || "github.com";
    if (parts[3] && /^\/tree\/master\//.test(parts[3])) {
      obj.branch = "master";
      obj.path = parts[3].replace(/\/$/, "");
    } else if (parts[3]) {
      var branchMatch = parts[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      obj.branch = branchMatch && branchMatch[0];
    } else if (parts[4]) {
      var branchMatch = parts[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      obj.branch = branchMatch && branchMatch[0];
    } else {
      obj.branch = "master";
    }
  }
  if (obj.host === "github.com") {
    obj.apiHost = "api.github.com";
  } else {
    obj.apiHost = obj.host + "/api/v3";
  }
  obj.tarball_url = "https://" + obj.apiHost + "/repos/" + obj.user + "/" + obj.repo + "/tarball/" + obj.branch;
  obj.clone_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo;
  if (obj.branch === "master") {
    obj.https_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo;
    obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo;
    obj.zip_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/archive/master.zip";
  } else {
    obj.https_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/blob/" + obj.branch;
    obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo + "?branch=" + obj.branch;
    obj.zip_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/archive/" + obj.branch + ".zip";
  }
  if (obj.path) {
    obj.https_url += obj.path;
  }
  obj.api_url = "https://" + obj.apiHost + "/repos/" + obj.user + "/" + obj.repo;
  return obj;
};
const name = "update-electron-app";
const version = "3.0.0";
const description = "A drop-in module that adds autoUpdating capabilities to Electron apps";
const repository = "https://github.com/electron/update-electron-app";
const main = "dist/index.js";
const types = "dist/index.d.ts";
const license = "MIT";
const dependencies = {
  "github-url-to-object": "^4.0.4",
  "is-url": "^1.2.4",
  ms: "^2.1.1"
};
const devDependencies = {
  "@continuous-auth/semantic-release-npm": "^3.0.0",
  "@types/github-url-to-object": "^4.0.1",
  "@types/is-url": "^1.2.30",
  "@types/ms": "^0.7.31",
  electron: "^22.0.0",
  jest: "^29.0.0",
  prettier: "^3.0.3",
  standard: "^14.3.4",
  "standard-markdown": "^6.0.0",
  tsd: "^0.25.0",
  typescript: "^4.9.4"
};
const scripts = {
  prepare: "tsc",
  test: "jest && tsd && standard --fix && standard-markdown",
  watch: "jest --watch --notify --notifyMode=change --coverage"
};
const tsd = {
  directory: "test"
};
const standard = {
  env: {
    jest: true
  }
};
const require$$9 = {
  name,
  version,
  description,
  repository,
  main,
  types,
  license,
  dependencies,
  devDependencies,
  scripts,
  tsd,
  standard
};
(function(exports) {
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.updateElectronApp = exports.UpdateSourceType = void 0;
  const assert_1 = __importDefault(require$$0);
  const is_url_1 = __importDefault(isUrl_1);
  const ms_1 = __importDefault(ms);
  const github_url_to_object_1 = __importDefault(commonjs);
  const path_1 = __importDefault(require$$4);
  const fs_1 = __importDefault(require$$5);
  const os_1 = __importDefault(require$$6);
  const util_1 = require$$7;
  const electron_1 = require$$8;
  var UpdateSourceType;
  (function(UpdateSourceType2) {
    UpdateSourceType2[UpdateSourceType2["ElectronPublicUpdateService"] = 0] = "ElectronPublicUpdateService";
    UpdateSourceType2[UpdateSourceType2["StaticStorage"] = 1] = "StaticStorage";
  })(UpdateSourceType = exports.UpdateSourceType || (exports.UpdateSourceType = {}));
  const pkg = require$$9;
  const userAgent = (0, util_1.format)("%s/%s (%s: %s)", pkg.name, pkg.version, os_1.default.platform(), os_1.default.arch());
  const supportedPlatforms = ["darwin", "win32"];
  function updateElectronApp(opts = {}) {
    const safeOpts = validateInput(opts);
    if (!electron_1.app.isPackaged) {
      const message = "update-electron-app config looks good; aborting updates since app is in development mode";
      opts.logger ? opts.logger.log(message) : console.log(message);
      return;
    }
    if (safeOpts.electron.app.isReady())
      initUpdater(safeOpts);
    else
      electron_1.app.on("ready", () => initUpdater(safeOpts));
  }
  exports.updateElectronApp = updateElectronApp;
  function initUpdater(opts) {
    const { updateSource, updateInterval, logger, electron } = opts;
    if (!supportedPlatforms.includes(process === null || process === void 0 ? void 0 : process.platform)) {
      log(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
      return;
    }
    const { app, autoUpdater, dialog } = electron;
    let feedURL;
    let serverType = "default";
    switch (updateSource.type) {
      case UpdateSourceType.ElectronPublicUpdateService: {
        feedURL = `${updateSource.host}/${updateSource.repo}/${process.platform}-${process.arch}/${app.getVersion()}`;
        break;
      }
      case UpdateSourceType.StaticStorage: {
        feedURL = updateSource.baseUrl;
        if (process.platform === "darwin") {
          feedURL += "/RELEASES.json";
          serverType = "json";
        }
        break;
      }
    }
    const requestHeaders = { "User-Agent": userAgent };
    function log(...args) {
      logger.log(...args);
    }
    log("feedURL", feedURL);
    log("requestHeaders", requestHeaders);
    autoUpdater.setFeedURL({
      url: feedURL,
      headers: requestHeaders,
      serverType
    });
    autoUpdater.on("error", (err) => {
      log("updater error");
      log(err);
    });
    autoUpdater.on("checking-for-update", () => {
      log("checking-for-update");
    });
    autoUpdater.on("update-available", () => {
      log("update-available; downloading...");
    });
    autoUpdater.on("update-not-available", () => {
      log("update-not-available");
    });
    if (opts.notifyUser) {
      autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
        log("update-downloaded", [event, releaseNotes, releaseName, releaseDate, updateURL]);
        const dialogOpts = {
          type: "info",
          buttons: ["Restart", "Later"],
          title: "Application Update",
          message: process.platform === "win32" ? releaseNotes : releaseName,
          detail: "A new version has been downloaded. Restart the application to apply the updates."
        };
        dialog.showMessageBox(dialogOpts).then(({ response }) => {
          if (response === 0)
            autoUpdater.quitAndInstall();
        });
      });
    }
    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, (0, ms_1.default)(updateInterval));
  }
  function guessRepo(electron) {
    var _a;
    const pkgBuf = fs_1.default.readFileSync(path_1.default.join(electron.app.getAppPath(), "package.json"));
    const pkg2 = JSON.parse(pkgBuf.toString());
    const repoString = ((_a = pkg2.repository) === null || _a === void 0 ? void 0 : _a.url) || pkg2.repository;
    const repoObject = (0, github_url_to_object_1.default)(repoString);
    (0, assert_1.default)(repoObject, "repo not found. Add repository string to your app's package.json file");
    return `${repoObject.user}/${repoObject.repo}`;
  }
  function validateInput(opts) {
    var _a;
    const defaults = {
      host: "https://update.electronjs.org",
      updateInterval: "10 minutes",
      logger: console,
      notifyUser: true
    };
    const { host, updateInterval, logger, notifyUser } = Object.assign({}, defaults, opts);
    const electron = opts.electron || require$$8;
    let updateSource = opts.updateSource;
    if (!updateSource) {
      updateSource = {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: opts.repo || guessRepo(electron),
        host
      };
    }
    switch (updateSource.type) {
      case UpdateSourceType.ElectronPublicUpdateService: {
        (0, assert_1.default)((_a = updateSource.repo) === null || _a === void 0 ? void 0 : _a.includes("/"), "repo is required and should be in the format `owner/repo`");
        (0, assert_1.default)(updateSource.host && (0, is_url_1.default)(updateSource.host) && updateSource.host.startsWith("https:"), "host must be a valid HTTPS URL");
        break;
      }
      case UpdateSourceType.StaticStorage: {
        (0, assert_1.default)(updateSource.baseUrl && (0, is_url_1.default)(updateSource.baseUrl) && updateSource.baseUrl.startsWith("https:"), "baseUrl must be a valid HTTPS URL");
        break;
      }
    }
    (0, assert_1.default)(typeof updateInterval === "string" && updateInterval.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`");
    (0, assert_1.default)((0, ms_1.default)(updateInterval) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more");
    (0, assert_1.default)(logger && typeof logger.log, "function");
    return { updateSource, updateInterval, logger, electron, notifyUser };
  }
})(dist);
function getRootBackendFolderPath(env, resourcesPath) {
  switch (env) {
    case "dev":
    case "staging":
      return require$$4.join(process$1.cwd(), "dist", "nest-backend");
    case "prod":
      return resourcesPath;
    default:
      return require$$4.join(process$1.cwd(), "dist", "nest-backend");
  }
}
function getProductionFrontendPath(resourcesPath) {
  return require$$4.join(resourcesPath, "ng-tracker", "browser", "index.html");
}
function getDevFrontendPath() {
  return require$$4.join(process$1.cwd(), "dist", "ng-tracker", "browser", "index.html");
}
function getEnvironment() {
  return process.env.NODE_ENV || "prod";
}
const URLs = ["http://localhost:5000/health", "http://localhost:3000/health"];
const ROOT_DATABASE_NAME = "database.sqlite3";
function logToFile(path, message, type = "info") {
  const logPath = require$$4.join(path, `${type}.log`);
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logMessage = `${timestamp} - ${type.toUpperCase()}: ${message}
`;
  try {
    require$$5.appendFileSync(logPath, logMessage);
  } catch (error) {
    console.error("Failed to write to log file:", error);
  }
}
function startBackend(resourcesPath) {
  let env;
  const rootBackendFolderPath = getRootBackendFolderPath(
    getEnvironment(),
    resourcesPath
  );
  logToFile(
    rootBackendFolderPath,
    "Starting backend service...",
    "info"
  );
  const serverPath = require$$4.join(rootBackendFolderPath, "main.js");
  const databasePath = require$$4.join(
    rootBackendFolderPath,
    ROOT_DATABASE_NAME
  );
  switch (getEnvironment()) {
    case "dev":
      env = {
        DATABASE_PATH: databasePath,
        PORT: 3e3,
        NODE_ENV: "dev"
      };
      break;
    case "staging":
      env = {
        DATABASE_PATH: databasePath,
        PORT: 3e3,
        NODE_ENV: "staging"
      };
      break;
    case "prod":
      env = {
        DATABASE_PATH: databasePath,
        PORT: 5e3,
        NODE_ENV: "prod"
      };
      break;
    default:
      env = {
        DATABASE_PATH: databasePath,
        PORT: 5e3,
        NODE_ENV: "prod"
      };
      break;
  }
  logToFile(
    rootBackendFolderPath,
    `Starting server with environment: ${JSON.stringify(env, null, 2)}`
  );
  logToFile(
    rootBackendFolderPath,
    `Server path: ${serverPath}`,
    "info"
  );
  return child_process.fork(serverPath, { env });
}
async function checkIfPortIsOpen(urls, maxAttempts = 20, timeout = 1e3, resourcesPath, loadingWindow2) {
  const logFilePath = require$$4.join(
    getRootBackendFolderPath(
      getEnvironment(),
      resourcesPath
    )
  );
  await new Promise((resolve) => setTimeout(resolve, 5e3));
  logToFile(
    logFilePath,
    `Checking if ports are open: ${urls}`,
    "info"
  );
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const url of urls) {
      try {
        logToFile(
          logFilePath,
          `Attempt ${attempt}: Checking port: ${url}`,
          "info"
        );
        const response = await fetch(url);
        console.log("Response status:", response.status);
        const responseData = await response.text();
        console.log("Response body:", responseData);
        logToFile(logFilePath, responseData, "info");
        if (response.ok) {
          console.log("Server is ready");
          logToFile(
            logFilePath,
            `Server is ready: ${responseData}`,
            "info"
          );
          return true;
        } else {
          console.log(`Server responded with status: ${response.status}`);
          logToFile(
            logFilePath,
            `Server responded with status: ${response.status}`,
            "warning"
          );
        }
      } catch (error) {
        console.error(`Attempt ${attempt}: Error connecting to ${url}:`, error);
        logToFile(
          logFilePath,
          `Attempt ${attempt}: ${error.toString()}`,
          "error"
        );
      }
    }
    if (attempt < maxAttempts) {
      console.log(`Waiting ${timeout}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
  loadingWindow2 == null ? void 0 : loadingWindow2.close();
  throw new Error(
    `Failed to connect to the server after ${maxAttempts} attempts`
  );
}
let loadingWindow = null;
function createLoadingWindow() {
  console.log("Creating loading window");
  if (loadingWindow) {
    console.log("Loading window already exists");
    return loadingWindow;
  }
  try {
    loadingWindow = new require$$8.BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        preload: require$$4.join(__dirname, "preload.js")
      }
    });
    if ("http://localhost:5173") {
      loadingWindow.loadURL("http://localhost:5173");
    }
    loadingWindow.center();
    loadingWindow.on("closed", () => {
      loadingWindow = null;
    });
    return loadingWindow;
  } catch (error) {
    console.error("Error creating loading window:", error);
    logToFile(
      getRootBackendFolderPath(
        getEnvironment(),
        process.resourcesPath
      ),
      error,
      "error"
    );
    return null;
  }
}
function createWindow(resourcesPath) {
  const mainWindow = new require$$8.BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });
  try {
    const entryPath = getProductionFrontendPath(resourcesPath);
    logToFile(
      getRootBackendFolderPath(
        getEnvironment(),
        resourcesPath
      ),
      `Loading file: ${entryPath}`,
      "info"
    );
    if (!require$$5.existsSync(entryPath)) {
      const devFrontendPath = getDevFrontendPath();
      mainWindow.loadFile(devFrontendPath);
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(entryPath);
    }
  } catch (e) {
    console.error(e);
  }
}
dist.updateElectronApp({
  updateInterval: "1 hour",
  logger: require("electron-log")
});
let server;
require$$8.app.commandLine.appendSwitch("disable-gpu");
require$$8.app.commandLine.appendSwitch("use-gl", "desktop");
require$$8.app.whenReady().then(async () => {
  server = startBackend(process.resourcesPath);
  const loadingWindow2 = createLoadingWindow();
  server.once("spawn", async () => {
    try {
      if (await checkIfPortIsOpen(
        URLs,
        20,
        2e3,
        process.resourcesPath,
        loadingWindow2
      )) {
        loadingWindow2 == null ? void 0 : loadingWindow2.close();
        createWindow(
          process.resourcesPath
        );
      }
    } catch (error) {
      console.error(error);
      logToFile(
        require$$4.join(
          getRootBackendFolderPath(
            getEnvironment(),
            process.resourcesPath
          )
        ),
        error,
        "error"
      );
    }
  });
  server.on("message", (message) => {
    console.log(`Message from child: ${message}`);
    logToFile(
      require$$4.join(
        getRootBackendFolderPath(
          getEnvironment(),
          process.resourcesPath
        )
      ),
      message,
      "info"
    );
  });
  server.on("error", (error) => {
    console.error(`Error from child: ${error}`);
    logToFile(
      require$$4.join(
        getRootBackendFolderPath(
          getEnvironment(),
          process.resourcesPath
        )
      ),
      error,
      "error"
    );
  });
  server.on("exit", (code, signal) => {
    console.log(`Child exited with code ${code} and signal ${signal}`);
    logToFile(
      require$$4.join(
        getRootBackendFolderPath(
          getEnvironment(),
          process.resourcesPath
        )
      ),
      `Child exited with code ${code} and signal ${signal}`,
      "error"
    );
  });
});
require$$8.app.on("before-quit", async () => {
  console.log("App is about to quit. Performing cleanup...");
  logToFile(
    require$$4.join(
      getRootBackendFolderPath(
        getEnvironment(),
        process.resourcesPath
      )
    ),
    "App is about to quit. Performing cleanup...",
    "info"
  );
  if (server) {
    server.kill();
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 1e3);
  });
  require$$8.app.quit();
});
require$$8.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$8.app.quit();
  }
});
require$$8.app.on("activate", () => {
  if (require$$8.BrowserWindow.getAllWindows().length === 0) ;
});

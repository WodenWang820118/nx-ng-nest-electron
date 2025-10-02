import st, { BrowserWindow as Ae, app as T } from "electron";
import k, { join as P } from "path";
import ht from "node:assert";
import dt from "node:fs";
import gt from "node:os";
import mt from "node:path";
import yt from "node:util";
import vt, { fork as bt } from "child_process";
import W from "os";
import I, { appendFileSync as wt, existsSync as St } from "fs";
import Et from "util";
import it from "events";
import At from "http";
import _t from "https";
import { cwd as Ee } from "process";
function Ot(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var x = {}, B, Le;
function Lt() {
  if (Le) return B;
  Le = 1;
  var u = 1e3, c = u * 60, s = c * 60, i = s * 24, e = i * 7, r = i * 365.25;
  B = function(l, p) {
    p = p || {};
    var f = typeof l;
    if (f === "string" && l.length > 0)
      return t(l);
    if (f === "number" && isFinite(l))
      return p.long ? o(l) : n(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function t(l) {
    if (l = String(l), !(l.length > 100)) {
      var p = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (p) {
        var f = parseFloat(p[1]), h = (p[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * r;
          case "weeks":
          case "week":
          case "w":
            return f * e;
          case "days":
          case "day":
          case "d":
            return f * i;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * s;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * c;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * u;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function n(l) {
    var p = Math.abs(l);
    return p >= i ? Math.round(l / i) + "d" : p >= s ? Math.round(l / s) + "h" : p >= c ? Math.round(l / c) + "m" : p >= u ? Math.round(l / u) + "s" : l + "ms";
  }
  function o(l) {
    var p = Math.abs(l);
    return p >= i ? a(l, p, i, "day") : p >= s ? a(l, p, s, "hour") : p >= c ? a(l, p, c, "minute") : p >= u ? a(l, p, u, "second") : l + " ms";
  }
  function a(l, p, f, h) {
    var S = p >= f * 1.5;
    return Math.round(l / f) + " " + h + (S ? "s" : "");
  }
  return B;
}
var J, Pe;
function Pt() {
  if (Pe) return J;
  Pe = 1, J = i;
  var u = /^(?:\w+:)?\/\/(\S+)$/, c = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, s = /^[^\s\.]+\.\S{2,}$/;
  function i(e) {
    if (typeof e != "string")
      return !1;
    var r = e.match(u);
    if (!r)
      return !1;
    var t = r[1];
    return t ? !!(c.test(t) || s.test(t)) : !1;
  }
  return J;
}
var V, $e;
function $t() {
  if ($e) return V;
  $e = 1;
  var u = Pt(), c = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/;
  return V = function(s, i) {
    var e = {};
    if (i = i || {}, !s || (s.url && (s = s.url), typeof s != "string"))
      return null;
    var r = s.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), t = s.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), n = s.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
    if (r)
      e.user = r[1], e.repo = r[2], e.branch = r[3] || "master", e.host = "github.com";
    else if (t)
      e.user = t[1], e.repo = t[2], e.branch = t[3] || "master", e.host = "github.com";
    else if (n)
      e.user = n[1], e.repo = n[2].replace(/\.git$/i, ""), e.branch = "master", e.host = "github.com";
    else {
      if (s = s.replace(/^git\+/, ""), !u(s))
        return null;
      var o = s.match(c) || [], a = o[1], l = o[2];
      if (!a || a !== "github.com" && a !== "www.github.com" && !i.enterprise)
        return null;
      var p = l.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
      if (!p)
        return null;
      if (e.user = p[1], e.repo = p[2].replace(/\.git$/i, ""), e.host = a || "github.com", p[3] && /^\/tree\/master\//.test(p[3]))
        e.branch = "master", e.path = p[3].replace(/\/$/, "");
      else if (p[3]) {
        var f = p[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
        e.branch = f && f[0];
      } else if (p[4]) {
        var f = p[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
        e.branch = f && f[0];
      } else
        e.branch = "master";
    }
    return e.host === "github.com" ? e.apiHost = "api.github.com" : e.apiHost = e.host + "/api/v3", e.tarball_url = "https://" + e.apiHost + "/repos/" + e.user + "/" + e.repo + "/tarball/" + e.branch, e.clone_url = "https://" + e.host + "/" + e.user + "/" + e.repo, e.branch === "master" ? (e.https_url = "https://" + e.host + "/" + e.user + "/" + e.repo, e.travis_url = "https://travis-ci.org/" + e.user + "/" + e.repo, e.zip_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/archive/master.zip") : (e.https_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/blob/" + e.branch, e.travis_url = "https://travis-ci.org/" + e.user + "/" + e.repo + "?branch=" + e.branch, e.zip_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/archive/" + e.branch + ".zip"), e.path && (e.https_url += e.path), e.api_url = "https://" + e.apiHost + "/repos/" + e.user + "/" + e.repo, e;
  }, V;
}
const Ft = "update-electron-app", xt = "3.1.1", Dt = {
  name: Ft,
  version: xt
};
var Fe;
function Rt() {
  if (Fe) return x;
  Fe = 1;
  var u = x && x.__importDefault || function(d) {
    return d && d.__esModule ? d : { default: d };
  };
  Object.defineProperty(x, "__esModule", { value: !0 }), x.UpdateSourceType = void 0, x.updateElectronApp = S, x.makeUserNotifier = g;
  const c = u(Lt()), s = u($t()), i = u(ht), e = u(dt), r = u(gt), t = u(mt), n = yt, o = st;
  var a;
  (function(d) {
    d[d.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", d[d.StaticStorage = 1] = "StaticStorage";
  })(a || (x.UpdateSourceType = a = {}));
  const l = Dt, p = (0, n.format)("%s/%s (%s: %s)", l.name, l.version, r.default.platform(), r.default.arch()), f = ["darwin", "win32"], h = (d) => {
    try {
      const { protocol: E } = new URL(d);
      return E === "https:";
    } catch {
      return !1;
    }
  };
  function S(d = {}) {
    const E = $(d);
    if (!o.app.isPackaged) {
      const m = "update-electron-app config looks good; aborting updates since app is in development mode";
      d.logger ? d.logger.log(m) : console.log(m);
      return;
    }
    o.app.isReady() ? b(E) : o.app.on("ready", () => b(E));
  }
  function b(d) {
    const { updateSource: E, updateInterval: m, logger: y } = d;
    if (!f.includes(process == null ? void 0 : process.platform)) {
      L(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
      return;
    }
    let v, O = "default";
    switch (E.type) {
      case a.ElectronPublicUpdateService: {
        v = `${E.host}/${E.repo}/${process.platform}-${process.arch}/${o.app.getVersion()}`;
        break;
      }
      case a.StaticStorage: {
        v = E.baseUrl, process.platform === "darwin" && (v += "/RELEASES.json", O = "json");
        break;
      }
    }
    const R = { "User-Agent": p };
    function L(...w) {
      y.log(...w);
    }
    L("feedURL", v), L("requestHeaders", R), o.autoUpdater.setFeedURL({
      url: v,
      headers: R,
      serverType: O
    }), o.autoUpdater.on("error", (w) => {
      L("updater error"), L(w);
    }), o.autoUpdater.on("checking-for-update", () => {
      L("checking-for-update");
    }), o.autoUpdater.on("update-available", () => {
      L("update-available; downloading...");
    }), o.autoUpdater.on("update-not-available", () => {
      L("update-not-available");
    }), d.notifyUser && o.autoUpdater.on("update-downloaded", (w, M, U, z, Oe) => {
      L("update-downloaded", [w, M, U, z, Oe]), typeof d.onNotifyUser != "function" ? ((0, i.default)(d.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), L("update-downloaded: notifyUser is true, opening default dialog"), d.onNotifyUser = g()) : L("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), d.onNotifyUser({
        event: w,
        releaseNotes: M,
        releaseDate: z,
        releaseName: U,
        updateURL: Oe
      });
    }), o.autoUpdater.checkForUpdates(), setInterval(() => {
      o.autoUpdater.checkForUpdates();
    }, (0, c.default)(m));
  }
  function g(d) {
    const m = Object.assign({}, {
      title: "Application Update",
      detail: "A new version has been downloaded. Restart the application to apply the updates.",
      restartButtonText: "Restart",
      laterButtonText: "Later"
    }, d);
    return (y) => {
      const { releaseNotes: v, releaseName: O } = y, { title: R, restartButtonText: L, laterButtonText: w, detail: M } = m, U = {
        type: "info",
        buttons: [L, w],
        title: R,
        message: process.platform === "win32" ? v : O,
        detail: M
      };
      o.dialog.showMessageBox(U).then(({ response: z }) => {
        z === 0 && o.autoUpdater.quitAndInstall();
      });
    };
  }
  function A() {
    var d;
    const E = e.default.readFileSync(t.default.join(o.app.getAppPath(), "package.json")), m = JSON.parse(E.toString()), y = ((d = m.repository) === null || d === void 0 ? void 0 : d.url) || m.repository, v = (0, s.default)(y);
    return (0, i.default)(v, "repo not found. Add repository string to your app's package.json file"), `${v.user}/${v.repo}`;
  }
  function $(d) {
    var E;
    const m = {
      host: "https://update.electronjs.org",
      updateInterval: "10 minutes",
      logger: console,
      notifyUser: !0
    }, { host: y, updateInterval: v, logger: O, notifyUser: R, onNotifyUser: L } = Object.assign({}, m, d);
    let w = d.updateSource;
    switch (w || (w = {
      type: a.ElectronPublicUpdateService,
      repo: d.repo || A(),
      host: y
    }), w.type) {
      case a.ElectronPublicUpdateService: {
        (0, i.default)((E = w.repo) === null || E === void 0 ? void 0 : E.includes("/"), "repo is required and should be in the format `owner/repo`"), w.host || (w.host = y), (0, i.default)(w.host && h(w.host), "host must be a valid HTTPS URL");
        break;
      }
      case a.StaticStorage: {
        (0, i.default)(w.baseUrl && h(w.baseUrl), "baseUrl must be a valid HTTPS URL");
        break;
      }
    }
    return (0, i.default)(typeof v == "string" && v.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, i.default)((0, c.default)(v) >= 300 * 1e3, "updateInterval must be `5 minutes` or more"), (0, i.default)(O && typeof O.log, "function"), { updateSource: w, updateInterval: v, logger: O, notifyUser: R, onNotifyUser: L };
  }
  return x;
}
var jt = Rt(), C = { exports: {} }, G = { exports: {} }, xe;
function at() {
  return xe || (xe = 1, (function(u) {
    let c = {};
    try {
      c = require("electron");
    } catch {
    }
    c.ipcRenderer && s(c), u.exports = s;
    function s({ contextBridge: i, ipcRenderer: e }) {
      if (!e)
        return;
      e.on("__ELECTRON_LOG_IPC__", (t, n) => {
        window.postMessage({ cmd: "message", ...n });
      }), e.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((t) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${t.message}`
      )));
      const r = {
        sendToMain(t) {
          try {
            e.send("__ELECTRON_LOG__", t);
          } catch (n) {
            console.error("electronLog.sendToMain ", n, "data:", t), e.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: n?.message, stack: n?.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...t) {
          r.sendToMain({ data: t, level: "info" });
        }
      };
      for (const t of ["error", "warn", "info", "verbose", "debug", "silly"])
        r[t] = (...n) => r.sendToMain({
          data: n,
          level: t
        });
      if (i && process.contextIsolated)
        try {
          i.exposeInMainWorld("__electronLog", r);
        } catch {
        }
      typeof window == "object" ? window.__electronLog = r : __electronLog = r;
    }
  })(G)), G.exports;
}
var Y = { exports: {} }, Q, De;
function qt() {
  if (De) return Q;
  De = 1, Q = u;
  function u(c) {
    return Object.defineProperties(s, {
      defaultLabel: { value: "", writable: !0 },
      labelPadding: { value: !0, writable: !0 },
      maxLabelLength: { value: 0, writable: !0 },
      labelLength: {
        get() {
          switch (typeof s.labelPadding) {
            case "boolean":
              return s.labelPadding ? s.maxLabelLength : 0;
            case "number":
              return s.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function s(i) {
      s.maxLabelLength = Math.max(s.maxLabelLength, i.length);
      const e = {};
      for (const r of c.levels)
        e[r] = (...t) => c.logData(t, { level: r, scope: i });
      return e.log = e.info, e;
    }
  }
  return Q;
}
var X, Re;
function Nt() {
  if (Re) return X;
  Re = 1;
  class u {
    constructor({ processMessage: s }) {
      this.processMessage = s, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
    }
    addMessage(s) {
      this.buffer.push(s);
    }
    begin() {
      this.enabled = [];
    }
    commit() {
      this.enabled = !1, this.buffer.forEach((s) => this.processMessage(s)), this.buffer = [];
    }
    reject() {
      this.enabled = !1, this.buffer = [];
    }
  }
  return X = u, X;
}
var Z, je;
function ct() {
  if (je) return Z;
  je = 1;
  const u = qt(), c = Nt();
  class s {
    static instances = {};
    dependencies = {};
    errorHandler = null;
    eventLogger = null;
    functions = {};
    hooks = [];
    isDev = !1;
    levels = null;
    logId = null;
    scope = null;
    transports = {};
    variables = {};
    constructor({
      allowUnknownLevel: e = !1,
      dependencies: r = {},
      errorHandler: t,
      eventLogger: n,
      initializeFn: o,
      isDev: a = !1,
      levels: l = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId: p,
      transportFactories: f = {},
      variables: h
    } = {}) {
      this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = e, this.buffering = new c(this), this.dependencies = r, this.initializeFn = o, this.isDev = a, this.levels = l, this.logId = p, this.scope = u(this), this.transportFactories = f, this.variables = h || {};
      for (const S of this.levels)
        this.addLevel(S, !1);
      this.log = this.info, this.functions.log = this.log, this.errorHandler = t, t?.setOptions({ ...r, logFn: this.error }), this.eventLogger = n, n?.setOptions({ ...r, logger: this });
      for (const [S, b] of Object.entries(f))
        this.transports[S] = b(this, r);
      s.instances[p] = this;
    }
    static getInstance({ logId: e }) {
      return this.instances[e] || this.instances.default;
    }
    addLevel(e, r = this.levels.length) {
      r !== !1 && this.levels.splice(r, 0, e), this[e] = (...t) => this.logData(t, { level: e }), this.functions[e] = this[e];
    }
    catchErrors(e) {
      return this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      ), this.errorHandler.startCatching(e);
    }
    create(e) {
      return typeof e == "string" && (e = { logId: e }), new s({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...e
      });
    }
    compareLevels(e, r, t = this.levels) {
      const n = t.indexOf(e), o = t.indexOf(r);
      return o === -1 || n === -1 ? !0 : o <= n;
    }
    initialize(e = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...e });
    }
    logData(e, r = {}) {
      this.buffering.enabled ? this.buffering.addMessage({ data: e, date: /* @__PURE__ */ new Date(), ...r }) : this.processMessage({ data: e, ...r });
    }
    processMessage(e, { transports: r = this.transports } = {}) {
      if (e.cmd === "errorHandler") {
        this.errorHandler.handle(e.error, {
          errorName: e.errorName,
          processType: "renderer",
          showDialog: !!e.showDialog
        });
        return;
      }
      let t = e.level;
      this.allowUnknownLevel || (t = this.levels.includes(e.level) ? e.level : "info");
      const n = {
        date: /* @__PURE__ */ new Date(),
        logId: this.logId,
        ...e,
        level: t,
        variables: {
          ...this.variables,
          ...e.variables
        }
      };
      for (const [o, a] of this.transportEntries(r))
        if (!(typeof a != "function" || a.level === !1) && this.compareLevels(a.level, e.level))
          try {
            const l = this.hooks.reduce((p, f) => p && f(p, a, o), n);
            l && a({ ...l, data: [...l.data] });
          } catch (l) {
            this.processInternalErrorFn(l);
          }
    }
    processInternalErrorFn(e) {
    }
    transportEntries(e = this.transports) {
      return (Array.isArray(e) ? e : Object.entries(e)).map((t) => {
        switch (typeof t) {
          case "string":
            return this.transports[t] ? [t, this.transports[t]] : null;
          case "function":
            return [t.name, t];
          default:
            return Array.isArray(t) ? t : null;
        }
      }).filter(Boolean);
    }
  }
  return Z = s, Z;
}
var K, qe;
function Tt() {
  if (qe) return K;
  qe = 1;
  const u = console.error;
  class c {
    logFn = null;
    onError = null;
    showDialog = !1;
    preventDefault = !0;
    constructor({ logFn: i = null } = {}) {
      this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.startCatching = this.startCatching.bind(this), this.logFn = i;
    }
    handle(i, {
      logFn: e = this.logFn,
      errorName: r = "",
      onError: t = this.onError,
      showDialog: n = this.showDialog
    } = {}) {
      try {
        t?.({ error: i, errorName: r, processType: "renderer" }) !== !1 && e({ error: i, errorName: r, showDialog: n });
      } catch {
        u(i);
      }
    }
    setOptions({ logFn: i, onError: e, preventDefault: r, showDialog: t }) {
      typeof i == "function" && (this.logFn = i), typeof e == "function" && (this.onError = e), typeof r == "boolean" && (this.preventDefault = r), typeof t == "boolean" && (this.showDialog = t);
    }
    startCatching({ onError: i, showDialog: e } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: i, showDialog: e }), window.addEventListener("error", (r) => {
        this.preventDefault && r.preventDefault?.(), this.handleError(r.error || r);
      }), window.addEventListener("unhandledrejection", (r) => {
        this.preventDefault && r.preventDefault?.(), this.handleRejection(r.reason || r);
      }));
    }
    handleError(i) {
      this.handle(i, { errorName: "Unhandled" });
    }
    handleRejection(i) {
      const e = i instanceof Error ? i : new Error(JSON.stringify(i));
      this.handle(e, { errorName: "Unhandled rejection" });
    }
  }
  return K = c, K;
}
var ee, Ne;
function N() {
  if (Ne) return ee;
  Ne = 1, ee = { transform: u };
  function u({
    logger: c,
    message: s,
    transport: i,
    initialData: e = s?.data || [],
    transforms: r = i?.transforms
  }) {
    return r.reduce((t, n) => typeof n == "function" ? n({ data: t, logger: c, message: s, transport: i }) : t, e);
  }
  return ee;
}
var te, Te;
function kt() {
  if (Te) return te;
  Te = 1;
  const { transform: u } = N();
  te = s;
  const c = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  function s(e) {
    return Object.assign(r, {
      format: "{h}:{i}:{s}.{ms}{scope} › {text}",
      transforms: [i],
      writeFn({ message: { level: t, data: n } }) {
        const o = c[t] || c.info;
        setTimeout(() => o(...n));
      }
    });
    function r(t) {
      r.writeFn({
        message: { ...t, data: u({ logger: e, message: t, transport: r }) }
      });
    }
  }
  function i({
    data: e = [],
    logger: r = {},
    message: t = {},
    transport: n = {}
  }) {
    if (typeof n.format == "function")
      return n.format({
        data: e,
        level: t?.level || "info",
        logger: r,
        message: t,
        transport: n
      });
    if (typeof n.format != "string")
      return e;
    e.unshift(n.format), typeof e[1] == "string" && e[1].match(/%[1cdfiOos]/) && (e = [`${e[0]}${e[1]}`, ...e.slice(2)]);
    const o = t.date || /* @__PURE__ */ new Date();
    return e[0] = e[0].replace(/\{(\w+)}/g, (a, l) => {
      switch (l) {
        case "level":
          return t.level;
        case "logId":
          return t.logId;
        case "scope": {
          const p = t.scope || r.scope?.defaultLabel;
          return p ? ` (${p})` : "";
        }
        case "text":
          return "";
        case "y":
          return o.getFullYear().toString(10);
        case "m":
          return (o.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return o.getDate().toString(10).padStart(2, "0");
        case "h":
          return o.getHours().toString(10).padStart(2, "0");
        case "i":
          return o.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return o.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return o.getMilliseconds().toString(10).padStart(3, "0");
        case "iso":
          return o.toISOString();
        default:
          return t.variables?.[l] || a;
      }
    }).trim(), e;
  }
  return te;
}
var re, ke;
function Ct() {
  if (ke) return re;
  ke = 1;
  const { transform: u } = N();
  re = s;
  const c = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
  function s(r) {
    return Object.assign(t, {
      depth: 5,
      transforms: [e]
    });
    function t(n) {
      if (!window.__electronLog) {
        r.processMessage(
          {
            data: ["electron-log: logger isn't initialized in the main process"],
            level: "error"
          },
          { transports: ["console"] }
        );
        return;
      }
      try {
        const o = u({
          initialData: n,
          logger: r,
          message: n,
          transport: t
        });
        __electronLog.sendToMain(o);
      } catch (o) {
        r.transports.console({
          data: ["electronLog.transports.ipc", o, "data:", n.data],
          level: "error"
        });
      }
    }
  }
  function i(r) {
    return Object(r) !== r;
  }
  function e({
    data: r,
    depth: t,
    seen: n = /* @__PURE__ */ new WeakSet(),
    transport: o = {}
  } = {}) {
    const a = t || o.depth || 5;
    return n.has(r) ? "[Circular]" : a < 1 ? i(r) ? r : Array.isArray(r) ? "[Array]" : `[${typeof r}]` : ["function", "symbol"].includes(typeof r) ? r.toString() : i(r) ? r : c.has(r.constructor) ? `[${r.constructor.name}]` : Array.isArray(r) ? r.map((l) => e({
      data: l,
      depth: a - 1,
      seen: n
    })) : r instanceof Date ? r.toISOString() : r instanceof Error ? r.stack : r instanceof Map ? new Map(
      Array.from(r).map(([l, p]) => [
        e({ data: l, depth: a - 1, seen: n }),
        e({ data: p, depth: a - 1, seen: n })
      ])
    ) : r instanceof Set ? new Set(
      Array.from(r).map(
        (l) => e({ data: l, depth: a - 1, seen: n })
      )
    ) : (n.add(r), Object.fromEntries(
      Object.entries(r).map(
        ([l, p]) => [
          l,
          e({ data: p, depth: a - 1, seen: n })
        ]
      )
    ));
  }
  return re;
}
var Ce;
function It() {
  return Ce || (Ce = 1, (function(u) {
    const c = ct(), s = Tt(), i = kt(), e = Ct();
    typeof process == "object" && process.type === "browser" && console.warn(
      "electron-log/renderer is loaded in the main process. It could cause unexpected behaviour."
    ), u.exports = r(), u.exports.Logger = c, u.exports.default = u.exports;
    function r() {
      const t = new c({
        allowUnknownLevel: !0,
        errorHandler: new s(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: i,
          ipc: e
        },
        variables: {
          processType: "renderer"
        }
      });
      return t.errorHandler.setOptions({
        logFn({ error: n, errorName: o, showDialog: a }) {
          t.transports.console({
            data: [o, n].filter(Boolean),
            level: "error"
          }), t.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: n?.cause,
              code: n?.code,
              name: n?.name,
              message: n?.message,
              stack: n?.stack
            },
            errorName: o,
            logId: t.logId,
            showDialog: a
          });
        }
      }), typeof window == "object" && window.addEventListener("message", (n) => {
        const { cmd: o, logId: a, ...l } = n.data || {}, p = c.getInstance({ logId: a });
        o === "message" && p.processMessage(l, { transports: ["console"] });
      }), new Proxy(t, {
        get(n, o) {
          return typeof n[o] < "u" ? n[o] : (...a) => t.logData(a, { level: o });
        }
      });
    }
  })(Y)), Y.exports;
}
var ne, Ie;
function Mt() {
  if (Ie) return ne;
  Ie = 1;
  const u = I, c = k;
  ne = {
    findAndReadPackageJson: s,
    tryReadJsonAt: i
  };
  function s() {
    return i(t()) || i(r()) || i(process.resourcesPath, "app.asar") || i(process.resourcesPath, "app") || i(process.cwd()) || { name: void 0, version: void 0 };
  }
  function i(...n) {
    if (n[0])
      try {
        const o = c.join(...n), a = e("package.json", o);
        if (!a)
          return;
        const l = JSON.parse(u.readFileSync(a, "utf8")), p = l?.productName || l?.name;
        return !p || p.toLowerCase() === "electron" ? void 0 : p ? { name: p, version: l?.version } : void 0;
      } catch {
        return;
      }
  }
  function e(n, o) {
    let a = o;
    for (; ; ) {
      const l = c.parse(a), p = l.root, f = l.dir;
      if (u.existsSync(c.join(a, n)))
        return c.resolve(c.join(a, n));
      if (a === p)
        return null;
      a = f;
    }
  }
  function r() {
    const n = process.argv.filter((a) => a.indexOf("--user-data-dir=") === 0);
    return n.length === 0 || typeof n[0] != "string" ? null : n[0].replace("--user-data-dir=", "");
  }
  function t() {
    try {
      return require.main?.filename;
    } catch {
      return;
    }
  }
  return ne;
}
var oe, Me;
function lt() {
  if (Me) return oe;
  Me = 1;
  const u = vt, c = W, s = k, i = Mt();
  class e {
    appName = void 0;
    appPackageJson = void 0;
    platform = process.platform;
    getAppLogPath(t = this.getAppName()) {
      return this.platform === "darwin" ? s.join(this.getSystemPathHome(), "Library/Logs", t) : s.join(this.getAppUserDataPath(t), "logs");
    }
    getAppName() {
      const t = this.appName || this.getAppPackageJson()?.name;
      if (!t)
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      return t;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      return typeof this.appPackageJson != "object" && (this.appPackageJson = i.findAndReadPackageJson()), this.appPackageJson;
    }
    getAppUserDataPath(t = this.getAppName()) {
      return t ? s.join(this.getSystemPathAppData(), t) : void 0;
    }
    getAppVersion() {
      return this.getAppPackageJson()?.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const t = Number(c.release().split(".")[0]);
      return t <= 19 ? `10.${t - 4}` : t - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let t = c.type().replace("_", " "), n = c.release();
      return t === "Darwin" && (t = "macOS", n = this.getMacOsVersion()), `${t} ${n}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const t = this.getAppName(), n = this.getAppVersion(), o = this;
      return {
        appData: this.getSystemPathAppData(),
        appName: t,
        appVersion: n,
        get electronDefaultDir() {
          return o.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(t),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(t)
      };
    }
    getSystemPathAppData() {
      const t = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin":
          return s.join(t, "Library/Application Support");
        case "win32":
          return process.env.APPDATA || s.join(t, "AppData/Roaming");
        default:
          return process.env.XDG_CONFIG_HOME || s.join(t, ".config");
      }
    }
    getSystemPathHome() {
      return c.homedir?.() || process.env.HOME;
    }
    getSystemPathTemp() {
      return c.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return !!process.versions.electron;
    }
    onAppEvent(t, n) {
    }
    onAppReady(t) {
      t();
    }
    onEveryWebContentsEvent(t, n) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(t, n) {
    }
    onIpcInvoke(t, n) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(t, n = console.error) {
      const a = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
      u.exec(`${a} ${t}`, {}, (l) => {
        l && n(l);
      });
    }
    setAppName(t) {
      this.appName = t;
    }
    setPlatform(t) {
      this.platform = t;
    }
    setPreloadFileForSessions({
      filePath: t,
      // eslint-disable-line no-unused-vars
      includeFutureSession: n = !0,
      // eslint-disable-line no-unused-vars
      getSessions: o = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(t, n) {
    }
    showErrorBox(t, n) {
    }
  }
  return oe = e, oe;
}
var se, Ue;
function Ut() {
  if (Ue) return se;
  Ue = 1;
  const u = k, c = lt();
  class s extends c {
    /**
     * @type {typeof Electron}
     */
    electron = void 0;
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron: e } = {}) {
      super(), this.electron = e;
    }
    getAppName() {
      let e;
      try {
        e = this.appName || this.electron.app?.name || this.electron.app?.getName();
      } catch {
      }
      return e || super.getAppName();
    }
    getAppUserDataPath(e) {
      return this.getPath("userData") || super.getAppUserDataPath(e);
    }
    getAppVersion() {
      let e;
      try {
        e = this.electron.app?.getVersion();
      } catch {
      }
      return e || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(e) {
      try {
        return this.electron.app?.getPath(e);
      } catch {
        return;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      return this.electron.app?.isPackaged !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? u.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
    }
    onAppEvent(e, r) {
      return this.electron.app?.on(e, r), () => {
        this.electron.app?.off(e, r);
      };
    }
    onAppReady(e) {
      this.electron.app?.isReady() ? e() : this.electron.app?.once ? this.electron.app?.once("ready", e) : e();
    }
    onEveryWebContentsEvent(e, r) {
      return this.electron.webContents?.getAllWebContents()?.forEach((n) => {
        n.on(e, r);
      }), this.electron.app?.on("web-contents-created", t), () => {
        this.electron.webContents?.getAllWebContents().forEach((n) => {
          n.off(e, r);
        }), this.electron.app?.off("web-contents-created", t);
      };
      function t(n, o) {
        o.on(e, r);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(e, r) {
      this.electron.ipcMain?.on(e, r);
    }
    onIpcInvoke(e, r) {
      this.electron.ipcMain?.handle?.(e, r);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(e, r = console.error) {
      this.electron.shell?.openExternal(e).catch(r);
    }
    setPreloadFileForSessions({
      filePath: e,
      includeFutureSession: r = !0,
      getSessions: t = () => [this.electron.session?.defaultSession]
    }) {
      for (const o of t().filter(Boolean))
        n(o);
      r && this.onAppEvent("session-created", (o) => {
        n(o);
      });
      function n(o) {
        typeof o.registerPreloadScript == "function" ? o.registerPreloadScript({
          filePath: e,
          id: "electron-log-preload",
          type: "frame"
        }) : o.setPreloads([...o.getPreloads(), e]);
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(e, r) {
      this.electron.BrowserWindow?.getAllWindows()?.forEach((t) => {
        t.webContents?.isDestroyed() === !1 && t.webContents?.isCrashed() === !1 && t.webContents.send(e, r);
      });
    }
    showErrorBox(e, r) {
      this.electron.dialog?.showErrorBox(e, r);
    }
  }
  return se = s, se;
}
var ie, ze;
function zt() {
  if (ze) return ie;
  ze = 1;
  const u = I, c = W, s = k, i = at();
  let e = !1, r = !1;
  ie = {
    initialize({
      externalApi: o,
      getSessions: a,
      includeFutureSession: l,
      logger: p,
      preload: f = !0,
      spyRendererConsole: h = !1
    }) {
      o.onAppReady(() => {
        try {
          f && t({
            externalApi: o,
            getSessions: a,
            includeFutureSession: l,
            logger: p,
            preloadOption: f
          }), h && n({ externalApi: o, logger: p });
        } catch (S) {
          p.warn(S);
        }
      });
    }
  };
  function t({
    externalApi: o,
    getSessions: a,
    includeFutureSession: l,
    logger: p,
    preloadOption: f
  }) {
    let h = typeof f == "string" ? f : void 0;
    if (e) {
      p.warn(new Error("log.initialize({ preload }) already called").stack);
      return;
    }
    e = !0;
    try {
      h = s.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!h || !u.existsSync(h)) {
      h = s.join(
        o.getAppUserDataPath() || c.tmpdir(),
        "electron-log-preload.js"
      );
      const S = `
      try {
        (${i.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      u.writeFileSync(h, S, "utf8");
    }
    o.setPreloadFileForSessions({
      filePath: h,
      includeFutureSession: l,
      getSessions: a
    });
  }
  function n({ externalApi: o, logger: a }) {
    if (r) {
      a.warn(
        new Error("log.initialize({ spyRendererConsole }) already called").stack
      );
      return;
    }
    r = !0;
    const l = ["debug", "info", "warn", "error"];
    o.onEveryWebContentsEvent(
      "console-message",
      (p, f, h) => {
        a.processMessage({
          data: [h],
          level: l[f],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return ie;
}
var ae, We;
function Wt() {
  if (We) return ae;
  We = 1;
  class u {
    externalApi = void 0;
    isActive = !1;
    logFn = void 0;
    onError = void 0;
    showDialog = !0;
    constructor({
      externalApi: i,
      logFn: e = void 0,
      onError: r = void 0,
      showDialog: t = void 0
    } = {}) {
      this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: i, logFn: e, onError: r, showDialog: t }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
    }
    handle(i, {
      logFn: e = this.logFn,
      onError: r = this.onError,
      processType: t = "browser",
      showDialog: n = this.showDialog,
      errorName: o = ""
    } = {}) {
      i = c(i);
      try {
        if (typeof r == "function") {
          const a = this.externalApi?.getVersions() || {}, l = this.createIssue;
          if (r({
            createIssue: l,
            error: i,
            errorName: o,
            processType: t,
            versions: a
          }) === !1)
            return;
        }
        o ? e(o, i) : e(i), n && !o.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
          `A JavaScript error occurred in the ${t} process`,
          i.stack
        );
      } catch {
        console.error(i);
      }
    }
    setOptions({ externalApi: i, logFn: e, onError: r, showDialog: t }) {
      typeof i == "object" && (this.externalApi = i), typeof e == "function" && (this.logFn = e), typeof r == "function" && (this.onError = r), typeof t == "boolean" && (this.showDialog = t);
    }
    startCatching({ onError: i, showDialog: e } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: i, showDialog: e }), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
    }
    stopCatching() {
      this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(i, e) {
      this.externalApi?.openUrl(
        `${i}?${new URLSearchParams(e).toString()}`
      );
    }
    handleError(i) {
      this.handle(i, { errorName: "Unhandled" });
    }
    handleRejection(i) {
      const e = i instanceof Error ? i : new Error(JSON.stringify(i));
      this.handle(e, { errorName: "Unhandled rejection" });
    }
  }
  function c(s) {
    if (s instanceof Error)
      return s;
    if (s && typeof s == "object") {
      if (s.message)
        return Object.assign(new Error(s.message), s);
      try {
        return new Error(JSON.stringify(s));
      } catch (i) {
        return new Error(`Couldn't normalize error ${String(s)}: ${i}`);
      }
    }
    return new Error(`Can't normalize error ${String(s)}`);
  }
  return ae = u, ae;
}
var ce, He;
function Ht() {
  if (He) return ce;
  He = 1;
  class u {
    disposers = [];
    format = "{eventSource}#{eventName}:";
    formatters = {
      app: {
        "certificate-error": ({ args: s }) => this.arrayToObject(s.slice(1, 4), [
          "url",
          "error",
          "certificate"
        ]),
        "child-process-gone": ({ args: s }) => s.length === 1 ? s[0] : s,
        "render-process-gone": ({ args: [s, i] }) => i && typeof i == "object" ? { ...i, ...this.getWebContentsDetails(s) } : []
      },
      webContents: {
        "console-message": ({ args: [s, i, e, r] }) => {
          if (!(s < 3))
            return { message: i, source: `${r}:${e}` };
        },
        "did-fail-load": ({ args: s }) => this.arrayToObject(s, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "did-fail-provisional-load": ({ args: s }) => this.arrayToObject(s, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "plugin-crashed": ({ args: s }) => this.arrayToObject(s, ["name", "version"]),
        "preload-error": ({ args: s }) => this.arrayToObject(s, ["preloadPath", "error"])
      }
    };
    events = {
      app: {
        "certificate-error": !0,
        "child-process-gone": !0,
        "render-process-gone": !0
      },
      webContents: {
        // 'console-message': true,
        "did-fail-load": !0,
        "did-fail-provisional-load": !0,
        "plugin-crashed": !0,
        "preload-error": !0,
        unresponsive: !0
      }
    };
    externalApi = void 0;
    level = "error";
    scope = "";
    constructor(s = {}) {
      this.setOptions(s);
    }
    setOptions({
      events: s,
      externalApi: i,
      level: e,
      logger: r,
      format: t,
      formatters: n,
      scope: o
    }) {
      typeof s == "object" && (this.events = s), typeof i == "object" && (this.externalApi = i), typeof e == "string" && (this.level = e), typeof r == "object" && (this.logger = r), (typeof t == "string" || typeof t == "function") && (this.format = t), typeof n == "object" && (this.formatters = n), typeof o == "string" && (this.scope = o);
    }
    startLogging(s = {}) {
      this.setOptions(s), this.disposeListeners();
      for (const i of this.getEventNames(this.events.app))
        this.disposers.push(
          this.externalApi.onAppEvent(i, (...e) => {
            this.handleEvent({ eventSource: "app", eventName: i, handlerArgs: e });
          })
        );
      for (const i of this.getEventNames(this.events.webContents))
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            i,
            (...e) => {
              this.handleEvent(
                { eventSource: "webContents", eventName: i, handlerArgs: e }
              );
            }
          )
        );
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(s, i) {
      const e = {};
      return i.forEach((r, t) => {
        e[r] = s[t];
      }), s.length > i.length && (e.unknownArgs = s.slice(i.length)), e;
    }
    disposeListeners() {
      this.disposers.forEach((s) => s()), this.disposers = [];
    }
    formatEventLog({ eventName: s, eventSource: i, handlerArgs: e }) {
      const [r, ...t] = e;
      if (typeof this.format == "function")
        return this.format({ args: t, event: r, eventName: s, eventSource: i });
      const n = this.formatters[i]?.[s];
      let o = t;
      if (typeof n == "function" && (o = n({ args: t, event: r, eventName: s, eventSource: i })), !o)
        return;
      const a = {};
      return Array.isArray(o) ? a.args = o : typeof o == "object" && Object.assign(a, o), i === "webContents" && Object.assign(a, this.getWebContentsDetails(r?.sender)), [this.format.replace("{eventSource}", i === "app" ? "App" : "WebContents").replace("{eventName}", s), a];
    }
    getEventNames(s) {
      return !s || typeof s != "object" ? [] : Object.entries(s).filter(([i, e]) => e).map(([i]) => i);
    }
    getWebContentsDetails(s) {
      if (!s?.loadURL)
        return {};
      try {
        return {
          webContents: {
            id: s.id,
            url: s.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName: s, eventSource: i, handlerArgs: e }) {
      const r = this.formatEventLog({ eventName: s, eventSource: i, handlerArgs: e });
      r && (this.scope ? this.logger.scope(this.scope) : this.logger)?.[this.level]?.(...r);
    }
  }
  return ce = u, ce;
}
var le, Be;
function ut() {
  if (Be) return le;
  Be = 1;
  const { transform: u } = N();
  le = {
    concatFirstStringElements: c,
    formatScope: i,
    formatText: r,
    formatVariables: e,
    timeZoneFromOffset: s,
    format({ message: t, logger: n, transport: o, data: a = t?.data }) {
      switch (typeof o.format) {
        case "string":
          return u({
            message: t,
            logger: n,
            transforms: [e, i, r],
            transport: o,
            initialData: [o.format, ...a]
          });
        case "function":
          return o.format({
            data: a,
            level: t?.level || "info",
            logger: n,
            message: t,
            transport: o
          });
        default:
          return a;
      }
    }
  };
  function c({ data: t }) {
    return typeof t[0] != "string" || typeof t[1] != "string" || t[0].match(/%[1cdfiOos]/) ? t : [`${t[0]} ${t[1]}`, ...t.slice(2)];
  }
  function s(t) {
    const n = Math.abs(t), o = t > 0 ? "-" : "+", a = Math.floor(n / 60).toString().padStart(2, "0"), l = (n % 60).toString().padStart(2, "0");
    return `${o}${a}:${l}`;
  }
  function i({ data: t, logger: n, message: o }) {
    const { defaultLabel: a, labelLength: l } = n?.scope || {}, p = t[0];
    let f = o.scope;
    f || (f = a);
    let h;
    return f === "" ? h = l > 0 ? "".padEnd(l + 3) : "" : typeof f == "string" ? h = ` (${f})`.padEnd(l + 3) : h = "", t[0] = p.replace("{scope}", h), t;
  }
  function e({ data: t, message: n }) {
    let o = t[0];
    if (typeof o != "string")
      return t;
    o = o.replace("{level}]", `${n.level}]`.padEnd(6, " "));
    const a = n.date || /* @__PURE__ */ new Date();
    return t[0] = o.replace(/\{(\w+)}/g, (l, p) => {
      switch (p) {
        case "level":
          return n.level || "info";
        case "logId":
          return n.logId;
        case "y":
          return a.getFullYear().toString(10);
        case "m":
          return (a.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return a.getDate().toString(10).padStart(2, "0");
        case "h":
          return a.getHours().toString(10).padStart(2, "0");
        case "i":
          return a.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return a.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return a.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return s(a.getTimezoneOffset());
        case "iso":
          return a.toISOString();
        default:
          return n.variables?.[p] || l;
      }
    }).trim(), t;
  }
  function r({ data: t }) {
    const n = t[0];
    if (typeof n != "string")
      return t;
    if (n.lastIndexOf("{text}") === n.length - 6)
      return t[0] = n.replace(/\s?{text}/, ""), t[0] === "" && t.shift(), t;
    const a = n.split("{text}");
    let l = [];
    return a[0] !== "" && l.push(a[0]), l = l.concat(t.slice(1)), a[1] !== "" && l.push(a[1]), l;
  }
  return le;
}
var ue = { exports: {} }, Je;
function H() {
  return Je || (Je = 1, (function(u) {
    const c = Et;
    u.exports = {
      serialize: i,
      maxDepth({ data: e, transport: r, depth: t = r?.depth ?? 6 }) {
        if (!e)
          return e;
        if (t < 1)
          return Array.isArray(e) ? "[array]" : typeof e == "object" && e ? "[object]" : e;
        if (Array.isArray(e))
          return e.map((o) => u.exports.maxDepth({
            data: o,
            depth: t - 1
          }));
        if (typeof e != "object" || e && typeof e.toISOString == "function")
          return e;
        if (e === null)
          return null;
        if (e instanceof Error)
          return e;
        const n = {};
        for (const o in e)
          Object.prototype.hasOwnProperty.call(e, o) && (n[o] = u.exports.maxDepth({
            data: e[o],
            depth: t - 1
          }));
        return n;
      },
      toJSON({ data: e }) {
        return JSON.parse(JSON.stringify(e, s()));
      },
      toString({ data: e, transport: r }) {
        const t = r?.inspectOptions || {}, n = e.map((o) => {
          if (o !== void 0)
            try {
              const a = JSON.stringify(o, s(), "  ");
              return a === void 0 ? void 0 : JSON.parse(a);
            } catch {
              return o;
            }
        });
        return c.formatWithOptions(t, ...n);
      }
    };
    function s(e = {}) {
      const r = /* @__PURE__ */ new WeakSet();
      return function(t, n) {
        if (typeof n == "object" && n !== null) {
          if (r.has(n))
            return;
          r.add(n);
        }
        return i(t, n, e);
      };
    }
    function i(e, r, t = {}) {
      const n = t?.serializeMapAndSet !== !1;
      return r instanceof Error ? r.stack : r && (typeof r == "function" ? `[function] ${r.toString()}` : r instanceof Date ? r.toISOString() : n && r instanceof Map && Object.fromEntries ? Object.fromEntries(r) : n && r instanceof Set && Array.from ? Array.from(r) : r);
    }
  })(ue)), ue.exports;
}
var pe, Ve;
function _e() {
  if (Ve) return pe;
  Ve = 1, pe = {
    transformStyles: i,
    applyAnsiStyles({ data: e }) {
      return i(e, c, s);
    },
    removeStyles({ data: e }) {
      return i(e, () => "");
    }
  };
  const u = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m",
    gray: "\x1B[90m"
  };
  function c(e) {
    const r = e.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return u[r] || "";
  }
  function s(e) {
    return e + u.unset;
  }
  function i(e, r, t) {
    const n = {};
    return e.reduce((o, a, l, p) => {
      if (n[l])
        return o;
      if (typeof a == "string") {
        let f = l, h = !1;
        a = a.replace(/%[1cdfiOos]/g, (S) => {
          if (f += 1, S !== "%c")
            return S;
          const b = p[f];
          return typeof b == "string" ? (n[f] = !0, h = !0, r(b, a)) : S;
        }), h && t && (a = t(a));
      }
      return o.push(a), o;
    }, []);
  }
  return pe;
}
var fe, Ge;
function Bt() {
  if (Ge) return fe;
  Ge = 1;
  const {
    concatFirstStringElements: u,
    format: c
  } = ut(), { maxDepth: s, toJSON: i } = H(), {
    applyAnsiStyles: e,
    removeStyles: r
  } = _e(), { transform: t } = N(), n = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  fe = l;
  const a = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
  Object.assign(l, {
    DEFAULT_FORMAT: a
  });
  function l(b) {
    return Object.assign(g, {
      colorMap: {
        error: "red",
        warn: "yellow",
        info: "cyan",
        verbose: "unset",
        debug: "gray",
        silly: "gray",
        default: "unset"
      },
      format: a,
      level: "silly",
      transforms: [
        p,
        c,
        h,
        u,
        s,
        i
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message: A }) {
        (n[A.level] || n.info)(...A.data);
      }
    });
    function g(A) {
      const $ = t({ logger: b, message: A, transport: g });
      g.writeFn({
        message: { ...A, data: $ }
      });
    }
  }
  function p({ data: b, message: g, transport: A }) {
    return typeof A.format != "string" || !A.format.includes("%c") ? b : [
      `color:${S(g.level, A)}`,
      "color:unset",
      ...b
    ];
  }
  function f(b, g) {
    if (typeof b == "boolean")
      return b;
    const $ = g === "error" || g === "warn" ? process.stderr : process.stdout;
    return $ && $.isTTY;
  }
  function h(b) {
    const { message: g, transport: A } = b;
    return (f(A.useStyles, g.level) ? e : r)(b);
  }
  function S(b, g) {
    return g.colorMap[b] || g.colorMap.default;
  }
  return fe;
}
var he, Ye;
function pt() {
  if (Ye) return he;
  Ye = 1;
  const u = it, c = I, s = W;
  class i extends u {
    asyncWriteQueue = [];
    bytesWritten = 0;
    hasActiveAsyncWriting = !1;
    path = null;
    initialSize = void 0;
    writeOptions = null;
    writeAsync = !1;
    constructor({
      path: t,
      writeOptions: n = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync: o = !1
    }) {
      super(), this.path = t, this.writeOptions = n, this.writeAsync = o;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        return c.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        }), this.reset(), !0;
      } catch (t) {
        return t.code === "ENOENT" ? !0 : (this.emit("error", t, this), !1);
      }
    }
    crop(t) {
      try {
        const n = e(this.path, t || 4096);
        this.clear(), this.writeLine(`[log cropped]${s.EOL}${n}`);
      } catch (n) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${n.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0)
        try {
          const t = c.statSync(this.path);
          this.initialSize = t.size;
        } catch {
          this.initialSize = 0;
        }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(t) {
      this.bytesWritten += Buffer.byteLength(t, this.writeOptions.encoding);
    }
    isNull() {
      return !1;
    }
    nextAsyncWrite() {
      const t = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0)
        return;
      const n = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, c.writeFile(this.path, n, this.writeOptions, (o) => {
        t.hasActiveAsyncWriting = !1, o ? t.emit(
          "error",
          new Error(`Couldn't write to ${t.path}. ${o.message}`),
          this
        ) : t.increaseBytesWrittenCounter(n), t.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0, this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(t) {
      if (t += s.EOL, this.writeAsync) {
        this.asyncWriteQueue.push(t), this.nextAsyncWrite();
        return;
      }
      try {
        c.writeFileSync(this.path, t, this.writeOptions), this.increaseBytesWrittenCounter(t);
      } catch (n) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${n.message}`),
          this
        );
      }
    }
  }
  he = i;
  function e(r, t) {
    const n = Buffer.alloc(t), o = c.statSync(r), a = Math.min(o.size, t), l = Math.max(0, o.size - t), p = c.openSync(r, "r"), f = c.readSync(p, n, 0, a, l);
    return c.closeSync(p), n.toString("utf8", 0, f);
  }
  return he;
}
var de, Qe;
function Jt() {
  if (Qe) return de;
  Qe = 1;
  const u = pt();
  class c extends u {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return !0;
    }
    writeLine() {
    }
  }
  return de = c, de;
}
var ge, Xe;
function Vt() {
  if (Xe) return ge;
  Xe = 1;
  const u = it, c = I, s = k, i = pt(), e = Jt();
  class r extends u {
    store = {};
    constructor() {
      super(), this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath: n, writeOptions: o = {}, writeAsync: a = !1 }) {
      let l;
      try {
        if (n = s.resolve(n), this.store[n])
          return this.store[n];
        l = this.createFile({ filePath: n, writeOptions: o, writeAsync: a });
      } catch (p) {
        l = new e({ path: n }), this.emitError(p, l);
      }
      return l.on("error", this.emitError), this.store[n] = l, l;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath: n, writeOptions: o, writeAsync: a }) {
      return this.testFileWriting({ filePath: n, writeOptions: o }), new i({ path: n, writeOptions: o, writeAsync: a });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(n, o) {
      this.emit("error", n, o);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath: n, writeOptions: o }) {
      c.mkdirSync(s.dirname(n), { recursive: !0 }), c.writeFileSync(n, "", { flag: "a", mode: o.mode });
    }
  }
  return ge = r, ge;
}
var me, Ze;
function Gt() {
  if (Ze) return me;
  Ze = 1;
  const u = I, c = W, s = k, i = Vt(), { transform: e } = N(), { removeStyles: r } = _e(), {
    format: t,
    concatFirstStringElements: n
  } = ut(), { toString: o } = H();
  me = l;
  const a = new i();
  function l(f, { registry: h = a, externalApi: S } = {}) {
    let b;
    return h.listenerCount("error") < 1 && h.on("error", (m, y) => {
      $(`Can't write to ${y}`, m);
    }), Object.assign(g, {
      fileName: p(f.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile: d,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs: E,
      sync: !0,
      transforms: [r, t, n, o],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn(m) {
        const y = m.toString(), v = s.parse(y);
        try {
          u.renameSync(y, s.join(v.dir, `${v.name}.old${v.ext}`));
        } catch (O) {
          $("Could not rotate log", O);
          const R = Math.round(g.maxSize / 4);
          m.crop(Math.min(R, 256 * 1024));
        }
      },
      resolvePathFn(m) {
        return s.join(m.libraryDefaultDir, m.fileName);
      },
      setAppName(m) {
        f.dependencies.externalApi.setAppName(m);
      }
    });
    function g(m) {
      const y = d(m);
      g.maxSize > 0 && y.size > g.maxSize && (g.archiveLogFn(y), y.reset());
      const O = e({ logger: f, message: m, transport: g });
      y.writeLine(O);
    }
    function A() {
      b || (b = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            S.getPathVariables()
          ),
          fileName: {
            get() {
              return g.fileName;
            },
            enumerable: !0
          }
        }
      ), typeof g.archiveLog == "function" && (g.archiveLogFn = g.archiveLog, $("archiveLog is deprecated. Use archiveLogFn instead")), typeof g.resolvePath == "function" && (g.resolvePathFn = g.resolvePath, $("resolvePath is deprecated. Use resolvePathFn instead")));
    }
    function $(m, y = null, v = "error") {
      const O = [`electron-log.transports.file: ${m}`];
      y && O.push(y), f.transports.console({ data: O, date: /* @__PURE__ */ new Date(), level: v });
    }
    function d(m) {
      A();
      const y = g.resolvePathFn(b, m);
      return h.provide({
        filePath: y,
        writeAsync: !g.sync,
        writeOptions: g.writeOptions
      });
    }
    function E({ fileFilter: m = (y) => y.endsWith(".log") } = {}) {
      A();
      const y = s.dirname(g.resolvePathFn(b));
      return u.existsSync(y) ? u.readdirSync(y).map((v) => s.join(y, v)).filter(m).map((v) => {
        try {
          return {
            path: v,
            lines: u.readFileSync(v, "utf8").split(c.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean) : [];
    }
  }
  function p(f = process.type) {
    switch (f) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return me;
}
var ye, Ke;
function Yt() {
  if (Ke) return ye;
  Ke = 1;
  const { maxDepth: u, toJSON: c } = H(), { transform: s } = N();
  ye = i;
  function i(e, { externalApi: r }) {
    return Object.assign(t, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: e.isDev ? "silly" : !1,
      transforms: [c, u]
    }), r?.isElectron() ? t : void 0;
    function t(n) {
      n?.variables?.processType !== "renderer" && r?.sendIpc(t.eventId, {
        ...n,
        data: s({ logger: e, message: n, transport: t })
      });
    }
  }
  return ye;
}
var ve, et;
function Qt() {
  if (et) return ve;
  et = 1;
  const u = At, c = _t, { transform: s } = N(), { removeStyles: i } = _e(), { toJSON: e, maxDepth: r } = H();
  ve = t;
  function t(n) {
    return Object.assign(o, {
      client: { name: "electron-application" },
      depth: 6,
      level: !1,
      requestOptions: {},
      transforms: [i, e, r],
      makeBodyFn({ message: a }) {
        return JSON.stringify({
          client: o.client,
          data: a.data,
          date: a.date.getTime(),
          level: a.level,
          scope: a.scope,
          variables: a.variables
        });
      },
      processErrorFn({ error: a }) {
        n.processMessage(
          {
            data: [`electron-log: can't POST ${o.url}`, a],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl: a, requestOptions: l, body: p }) {
        const h = (a.startsWith("https:") ? c : u).request(a, {
          method: "POST",
          ...l,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": p.length,
            ...l.headers
          }
        });
        return h.write(p), h.end(), h;
      }
    });
    function o(a) {
      if (!o.url)
        return;
      const l = o.makeBodyFn({
        logger: n,
        message: { ...a, data: s({ logger: n, message: a, transport: o }) },
        transport: o
      }), p = o.sendRequestFn({
        serverUrl: o.url,
        requestOptions: o.requestOptions,
        body: Buffer.from(l, "utf8")
      });
      p.on("error", (f) => o.processErrorFn({
        error: f,
        logger: n,
        message: a,
        request: p,
        transport: o
      }));
    }
  }
  return ve;
}
var be, tt;
function ft() {
  if (tt) return be;
  tt = 1;
  const u = ct(), c = Wt(), s = Ht(), i = Bt(), e = Gt(), r = Yt(), t = Qt();
  be = n;
  function n({ dependencies: o, initializeFn: a }) {
    const l = new u({
      dependencies: o,
      errorHandler: new c(),
      eventLogger: new s(),
      initializeFn: a,
      isDev: o.externalApi?.isDev(),
      logId: "default",
      transportFactories: {
        console: i,
        file: e,
        ipc: r,
        remote: t
      },
      variables: {
        processType: "main"
      }
    });
    return l.default = l, l.Logger = u, l.processInternalErrorFn = (p) => {
      l.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", p],
          level: "error"
        }
      });
    }, l;
  }
  return be;
}
var we, rt;
function Xt() {
  if (rt) return we;
  rt = 1;
  const u = st, c = Ut(), { initialize: s } = zt(), i = ft(), e = new c({ electron: u }), r = i({
    dependencies: { externalApi: e },
    initializeFn: s
  });
  we = r, e.onIpc("__ELECTRON_LOG__", (n, o) => {
    o.scope && r.Logger.getInstance(o).scope(o.scope);
    const a = new Date(o.date);
    t({
      ...o,
      date: a.getTime() ? a : /* @__PURE__ */ new Date()
    });
  }), e.onIpcInvoke("__ELECTRON_LOG__", (n, { cmd: o = "", logId: a }) => {
    switch (o) {
      case "getOptions":
        return {
          levels: r.Logger.getInstance({ logId: a }).levels,
          logId: a
        };
      default:
        return t({ data: [`Unknown cmd '${o}'`], level: "error" }), {};
    }
  });
  function t(n) {
    r.Logger.getInstance(n)?.processMessage(n);
  }
  return we;
}
var Se, nt;
function Zt() {
  if (nt) return Se;
  nt = 1;
  const u = lt(), c = ft(), s = new u();
  return Se = c({
    dependencies: { externalApi: s }
  }), Se;
}
var ot;
function Kt() {
  if (ot) return C.exports;
  ot = 1;
  const u = typeof process > "u" || process.type === "renderer" || process.type === "worker", c = typeof process == "object" && process.type === "browser";
  return u ? (at(), C.exports = It()) : c ? C.exports = Xt() : C.exports = Zt(), C.exports;
}
var er = Kt();
const tr = /* @__PURE__ */ Ot(er);
function D(u, c) {
  switch (u) {
    case "dev":
    case "staging":
      return P(Ee(), "dist", "nest-backend");
    case "prod":
      return c;
    default:
      return P(Ee(), "dist", "nest-backend");
  }
}
function rr(u) {
  return P(u, "ng-tracker", "browser", "index.html");
}
function nr() {
  return P(Ee(), "dist", "ng-tracker", "browser", "index.html");
}
function F() {
  return process.env.NODE_ENV || "prod";
}
const or = ["http://localhost:5000/health", "http://localhost:3000/health"], sr = "database.sqlite3";
function _(u, c, s = "info") {
  const i = P(u, `${s}.log`), r = `${(/* @__PURE__ */ new Date()).toISOString()} - ${s.toUpperCase()}: ${c}
`;
  try {
    wt(i, r);
  } catch (t) {
    console.error("Failed to write to log file:", t);
  }
}
function ir(u) {
  let c;
  const s = D(
    F(),
    u
  );
  _(
    s,
    "Starting backend service...",
    "info"
  );
  const i = P(s, "main.js"), e = P(
    s,
    sr
  );
  switch (F()) {
    case "dev":
      c = {
        DATABASE_PATH: e,
        PORT: 3e3,
        NODE_ENV: "dev"
      };
      break;
    case "staging":
      c = {
        DATABASE_PATH: e,
        PORT: 3e3,
        NODE_ENV: "staging"
      };
      break;
    case "prod":
      c = {
        DATABASE_PATH: e,
        PORT: 5e3,
        NODE_ENV: "prod"
      };
      break;
    default:
      c = {
        DATABASE_PATH: e,
        PORT: 5e3,
        NODE_ENV: "prod"
      };
      break;
  }
  return _(
    s,
    `Starting server with environment: ${JSON.stringify(c, null, 2)}`
  ), _(
    s,
    `Server path: ${i}`,
    "info"
  ), bt(i, { env: c });
}
async function ar(u, c = 20, s = 1e3, i, e) {
  const r = P(
    D(
      F(),
      i
    )
  );
  await new Promise((t) => setTimeout(t, 5e3)), _(
    r,
    `Checking if ports are open: ${u}`,
    "info"
  );
  for (let t = 1; t <= c; t++) {
    for (const n of u)
      try {
        _(
          r,
          `Attempt ${t}: Checking port: ${n}`,
          "info"
        );
        const o = await fetch(n);
        console.log("Response status:", o.status);
        const a = await o.text();
        if (console.log("Response body:", a), _(r, a, "info"), o.ok)
          return console.log("Server is ready"), _(
            r,
            `Server is ready: ${a}`,
            "info"
          ), !0;
        console.log(`Server responded with status: ${o.status}`), _(
          r,
          `Server responded with status: ${o.status}`,
          "warning"
        );
      } catch (o) {
        console.error(`Attempt ${t}: Error connecting to ${n}:`, o), _(
          r,
          `Attempt ${t}: ${o.toString()}`,
          "error"
        );
      }
    t < c && (console.log(`Waiting ${s}ms before next attempt...`), await new Promise((n) => setTimeout(n, s)));
  }
  throw e?.close(), new Error(
    `Failed to connect to the server after ${c} attempts`
  );
}
let j = null;
function cr() {
  if (console.log("Creating loading window"), j)
    return console.log("Loading window already exists"), j;
  try {
    return j = new Ae({
      width: 400,
      height: 200,
      frame: !1,
      transparent: !0,
      alwaysOnTop: !0,
      webPreferences: {
        nodeIntegration: !0,
        preload: P(__dirname, "preload.js")
      }
    }), j.loadFile(P(__dirname, "../renderer/main_window/index.html")), j.center(), j.on("closed", () => {
      j = null;
    }), j;
  } catch (u) {
    return console.error("Error creating loading window:", u), _(
      D(
        F(),
        process.resourcesPath
      ),
      u,
      "error"
    ), null;
  }
}
function lr(u) {
  const c = new Ae({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: !0
    }
  });
  try {
    const s = rr(u);
    if (_(
      D(
        F(),
        u
      ),
      `Loading file: ${s}`,
      "info"
    ), St(s))
      c.loadFile(s);
    else {
      const i = nr();
      c.loadFile(i), c.webContents.openDevTools();
    }
  } catch (s) {
    console.error(s);
  }
}
jt.updateElectronApp({
  updateInterval: "1 hour",
  logger: tr
});
let q;
T.whenReady().then(async () => {
  q = ir(process.resourcesPath);
  const u = cr();
  q.once("spawn", async () => {
    try {
      await ar(
        or,
        20,
        2e3,
        process.resourcesPath,
        u
      ) && (u?.close(), lr(
        process.resourcesPath
      ));
    } catch (c) {
      console.error(c), _(
        P(
          D(
            F(),
            process.resourcesPath
          )
        ),
        c,
        "error"
      );
    }
  }), q.on("message", (c) => {
    console.log(`Message from child: ${c}`), _(
      P(
        D(
          F(),
          process.resourcesPath
        )
      ),
      c,
      "info"
    );
  }), q.on("error", (c) => {
    console.error(`Error from child: ${c}`), _(
      P(
        D(
          F(),
          process.resourcesPath
        )
      ),
      c,
      "error"
    );
  }), q.on("exit", (c, s) => {
    console.log(`Child exited with code ${c} and signal ${s}`), _(
      P(
        D(
          F(),
          process.resourcesPath
        )
      ),
      `Child exited with code ${c} and signal ${s}`,
      "error"
    );
  });
});
T.on("before-quit", async () => {
  console.log("App is about to quit. Performing cleanup..."), _(
    P(
      D(
        F(),
        process.resourcesPath
      )
    ),
    "App is about to quit. Performing cleanup...",
    "info"
  ), q && q.kill(), await new Promise((u) => {
    setTimeout(u, 1e3);
  }), T.quit();
});
T.on("window-all-closed", () => {
  process.platform !== "darwin" && T.quit();
});
T.on("activate", () => {
  Ae.getAllWindows().length;
});

// src/app/api/[locale]/system/unified-interface/vibe-frame/types.ts
var DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups";
var BRIDGE_PREFIX = "vf:";
var FREQUENCY_KEY_PREFIX = "vf-freq-";
function generateFrameId() {
  return `vf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function isBridgeCall(event) {
  return typeof event.data === "object" && event.data !== null && "type" in event.data && event.data.type === "BRIDGE_CALL" && "action" in event.data && typeof event.data.action === "string" && "requestId" in event.data && typeof event.data.requestId === "string";
}
function isVibeFrameMessage(event) {
  const data = event.data;
  return typeof data === "object" && data !== null && "type" in data && typeof data.type === "string" && data.type.startsWith(BRIDGE_PREFIX);
}
function isFrameMessage(msg) {
  return "frameId" in msg;
}

// src/app/api/[locale]/system/unified-interface/vibe-frame/bridge.ts
function getCookieAction(payload) {
  try {
    const value = document.cookie.split("; ").find((row) => row.startsWith(`${payload.name}=`));
    return value ? decodeURIComponent(value.split("=")[1] || "") : null;
  } catch {
    return null;
  }
}
function setCookieAction(payload) {
  try {
    let cookieString = `${encodeURIComponent(payload.name)}=${encodeURIComponent(payload.value)}`;
    if (payload.options?.expires) {
      cookieString += `; expires=${payload.options.expires.toUTCString()}`;
    }
    if (payload.options?.maxAge) {
      cookieString += `; max-age=${payload.options.maxAge}`;
    }
    if (payload.options?.domain) {
      cookieString += `; domain=${payload.options.domain}`;
    }
    if (payload.options?.path) {
      cookieString += `; path=${payload.options.path}`;
    }
    if (payload.options?.secure) {
      cookieString += "; Secure";
    }
    if (payload.options?.httpOnly) {
      cookieString += "; HttpOnly";
    }
    if (payload.options?.sameSite) {
      cookieString += `; SameSite=${payload.options.sameSite}`;
    }
    document.cookie = cookieString;
    return true;
  } catch {
    return false;
  }
}
function deleteCookieAction(payload) {
  try {
    let cookieString = `${payload.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (payload.options?.domain) {
      cookieString += `; domain=${payload.options.domain}`;
    }
    if (payload.options?.path) {
      cookieString += `; path=${payload.options.path}`;
    }
    document.cookie = cookieString;
    return true;
  } catch {
    return false;
  }
}
function getAllCookiesAction() {
  try {
    if (!document.cookie) {
      return [];
    }
    return document.cookie.split(";").map((c) => c.trim()).filter((c) => c.length > 0).map((c) => {
      const [encodedName, ...valueParts] = c.split("=");
      return {
        name: decodeURIComponent(encodedName?.trim() || ""),
        value: decodeURIComponent(valueParts.join("=").trim())
      };
    }).filter((c) => c.name.length > 0);
  } catch {
    return [];
  }
}
function getStorageAction(payload) {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    return store.getItem(payload.key);
  } catch {
    return null;
  }
}
function setStorageAction(payload) {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.setItem(payload.key, payload.value);
    return true;
  } catch {
    return false;
  }
}
function removeStorageAction(payload) {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.removeItem(payload.key);
    return true;
  } catch {
    return false;
  }
}
function clearStorageAction(payload) {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.clear();
    return true;
  } catch {
    return false;
  }
}
function getStorageKeysAction(payload) {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    const keys = [];
    for (let i = 0;i < store.length; i++) {
      const k = store.key(i);
      if (k) {
        keys.push(k);
      }
    }
    return keys;
  } catch {
    return [];
  }
}
function getUrlParamsAction() {
  try {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  } catch {
    return {};
  }
}
function setUrlParamsAction(payload) {
  try {
    const url = new URL(window.location.href);
    Object.entries(payload.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url.toString());
    return true;
  } catch {
    return false;
  }
}
function getUrlAction() {
  return window.location.href;
}
function navigateAction(payload) {
  try {
    if (payload.target) {
      window.open(payload.url, payload.target);
    } else if (payload.replace) {
      window.location.replace(payload.url);
    } else {
      window.location.href = payload.url;
    }
    return true;
  } catch {
    return false;
  }
}
function getWindowSizeAction() {
  return { width: window.innerWidth, height: window.innerHeight };
}
function getScrollPositionAction() {
  return { x: window.scrollX, y: window.scrollY };
}
function setScrollPositionAction(payload) {
  try {
    window.scrollTo({
      left: payload.x,
      top: payload.y,
      behavior: payload.behavior ?? "auto"
    });
    return true;
  } catch {
    return false;
  }
}
function getViewportInfoAction() {
  const w = window.innerWidth;
  const deviceType = w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  return {
    width: w,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    deviceType
  };
}
function trackInteractionAction(payload) {
  if (payload.data.action === "first-paint" || payload.data.action === "first-interactive") {}
  return true;
}
function logMessageAction() {
  return true;
}
var actionMap = {
  getCookie: getCookieAction,
  setCookie: setCookieAction,
  deleteCookie: deleteCookieAction,
  getAllCookies: getAllCookiesAction,
  getStorage: getStorageAction,
  setStorage: setStorageAction,
  removeStorage: removeStorageAction,
  clearStorage: clearStorageAction,
  getStorageKeys: getStorageKeysAction,
  getUrlParams: getUrlParamsAction,
  setUrlParams: setUrlParamsAction,
  getUrl: getUrlAction,
  navigate: navigateAction,
  getWindowSize: getWindowSizeAction,
  getScrollPosition: getScrollPositionAction,
  setScrollPosition: setScrollPositionAction,
  getViewportInfo: getViewportInfoAction,
  trackInteraction: trackInteractionAction,
  logMessage: logMessageAction
};
function createParentBridge(options) {
  const { iframe, frameId, allowedOrigin, onMessage } = options;
  function handleMessage(event) {
    if (allowedOrigin !== "*" && event.origin !== allowedOrigin) {
      return;
    }
    if (isBridgeCall(event)) {
      handleBridgeCall(event.data, event.source);
      return;
    }
    if (!isVibeFrameMessage(event)) {
      return;
    }
    const msg = event.data;
    if (isFrameMessage(msg) && msg.frameId === frameId) {
      onMessage(msg);
    }
  }
  window.addEventListener("message", handleMessage);
  return {
    send(message) {
      const targetOrigin = allowedOrigin === "*" ? "*" : allowedOrigin;
      iframe.contentWindow?.postMessage(message, targetOrigin);
    },
    destroy() {
      window.removeEventListener("message", handleMessage);
    }
  };
}
function handleBridgeCall(call, source) {
  const { action, requestId, payload } = call;
  let response;
  try {
    const handler = actionMap[action];
    if (!handler) {
      response = {
        type: "BRIDGE_RESPONSE",
        requestId,
        success: false,
        error: `Unknown action: ${action}`
      };
    } else {
      const data = handler(payload);
      response = {
        type: "BRIDGE_RESPONSE",
        requestId,
        success: true,
        data
      };
    }
  } catch (error) {
    response = {
      type: "BRIDGE_RESPONSE",
      requestId,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
  sendBridgeResponse(response, source);
}
function sendBridgeResponse(response, target) {
  if (target && "postMessage" in target) {
    target.postMessage(response, "*");
  }
}
function createFrameBridge(options) {
  const { onMessage } = options;
  function handleMessage(event) {
    if (!isVibeFrameMessage(event)) {
      return;
    }
    const msg = event.data;
    if (!isFrameMessage(msg)) {
      onMessage(msg);
    }
  }
  window.addEventListener("message", handleMessage);
  return {
    send(message) {
      window.parent.postMessage(message, "*");
    },
    destroy() {
      window.removeEventListener("message", handleMessage);
    }
  };
}
function checkDisplayFrequency(frameId, frequency) {
  if (!frequency || frequency === "always") {
    return true;
  }
  const key = FREQUENCY_KEY_PREFIX + frameId;
  switch (frequency) {
    case "once-per-session": {
      try {
        return !sessionStorage.getItem(key);
      } catch {
        return true;
      }
    }
    case "once-per-user": {
      try {
        return !localStorage.getItem(key);
      } catch {
        return true;
      }
    }
    case "once-per-day": {
      try {
        const lastShown = localStorage.getItem(key);
        if (!lastShown) {
          return true;
        }
        return Date.now() - parseInt(lastShown) >= 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }
    case "once-per-week": {
      try {
        const lastShown = localStorage.getItem(key);
        if (!lastShown) {
          return true;
        }
        return Date.now() - parseInt(lastShown) >= 7 * 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }
    default:
      return true;
  }
}
function recordDisplay(frameId, frequency) {
  if (!frequency || frequency === "always") {
    return;
  }
  const key = FREQUENCY_KEY_PREFIX + frameId;
  const now = String(Date.now());
  switch (frequency) {
    case "once-per-session":
      try {
        sessionStorage.setItem(key, now);
      } catch {}
      break;
    case "once-per-user":
    case "once-per-day":
    case "once-per-week":
      try {
        localStorage.setItem(key, now);
      } catch {}
      break;
    default:
      break;
  }
}
// src/app/api/[locale]/system/unified-interface/vibe-frame/triggers.ts
var sharedState = {
  scroll: 0,
  time: 0,
  clicks: 0,
  moves: 0,
  keys: 0,
  exit: false,
  viewport: {
    w: window.innerWidth,
    h: window.innerHeight,
    mobile: window.innerWidth < 768
  }
};
var sharedStateInitialized = false;
var startTime = Date.now();
function initSharedState() {
  if (sharedStateInitialized) {
    return;
  }
  sharedStateInitialized = true;
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        sharedState = {
          ...sharedState,
          scroll: Math.round(window.scrollY / scrollHeight * 100)
        };
      }
    }, 100);
  }, { passive: true });
  window.addEventListener("click", () => {
    sharedState = { ...sharedState, clicks: sharedState.clicks + 1 };
  }, { passive: true });
  let moveTimeout;
  window.addEventListener("mousemove", () => {
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      sharedState = { ...sharedState, moves: sharedState.moves + 1 };
    }, 50);
  }, { passive: true });
  window.addEventListener("keydown", () => {
    sharedState = { ...sharedState, keys: sharedState.keys + 1 };
  }, { passive: true });
  document.addEventListener("mouseleave", (event) => {
    if (event.clientY <= 0) {
      sharedState = { ...sharedState, exit: true };
    }
  });
  const updateViewport = () => {
    sharedState = {
      ...sharedState,
      viewport: {
        w: window.innerWidth,
        h: window.innerHeight,
        mobile: window.innerWidth < 768
      }
    };
  };
  window.addEventListener("resize", updateViewport, { passive: true });
  setInterval(() => {
    sharedState = { ...sharedState, time: Date.now() - startTime };
  }, 1000);
}
function setupTrigger(config, onTrigger) {
  initSharedState();
  switch (config.type) {
    case "immediate":
      onTrigger();
      return noop;
    case "scroll":
      return scrollTrigger(config.scrollPercent ?? 50, onTrigger);
    case "time":
      return timeTrigger(config.delayMs ?? 3000, onTrigger);
    case "exit-intent":
      return exitIntentTrigger(onTrigger);
    case "click":
      return clickTrigger(config.selector ?? "", onTrigger);
    case "hover":
      return hoverTrigger(config.selector ?? "", onTrigger);
    case "viewport":
      return viewportTrigger(config, onTrigger);
    default:
      onTrigger();
      return noop;
  }
}
var noop = () => {
  return;
};
function scrollTrigger(percent, callback) {
  let fired = false;
  function check() {
    if (fired) {
      return;
    }
    if (sharedState.scroll >= percent) {
      fired = true;
      callback();
    }
  }
  const interval = setInterval(check, 200);
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight > 0) {
    const current = Math.round(window.scrollY / scrollHeight * 100);
    if (current >= percent) {
      fired = true;
      clearInterval(interval);
      callback();
      return noop;
    }
  }
  return () => clearInterval(interval);
}
function timeTrigger(delayMs, callback) {
  const timer = setTimeout(callback, delayMs);
  return () => clearTimeout(timer);
}
function exitIntentTrigger(callback) {
  let fired = false;
  function onMouseLeave(event) {
    if (fired) {
      return;
    }
    if (event.clientY <= 0) {
      fired = true;
      callback();
    }
  }
  document.addEventListener("mouseleave", onMouseLeave);
  return () => document.removeEventListener("mouseleave", onMouseLeave);
}
function clickTrigger(selector, callback) {
  if (!selector) {
    return noop;
  }
  function onClick(event) {
    const target = event.target;
    if (target?.closest(selector)) {
      callback();
    }
  }
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
function hoverTrigger(selector, callback) {
  if (!selector) {
    return noop;
  }
  let fired = false;
  function onMouseEnter(event) {
    if (fired) {
      return;
    }
    const target = event.target;
    if (target?.closest(selector)) {
      fired = true;
      callback();
    }
  }
  document.addEventListener("mouseover", onMouseEnter);
  return () => document.removeEventListener("mouseover", onMouseEnter);
}
function viewportTrigger(config, callback) {
  let fired = false;
  function check() {
    if (fired) {
      return;
    }
    const { w, h, mobile } = sharedState.viewport;
    const widthOk = !config.viewportWidth || w >= config.viewportWidth[0] && w <= config.viewportWidth[1];
    const heightOk = !config.viewportHeight || h >= config.viewportHeight[0] && h <= config.viewportHeight[1];
    const deviceOk = !config.deviceType || config.deviceType === "mobile" && mobile || config.deviceType === "desktop" && !mobile;
    if (widthOk && heightOk && deviceOk) {
      fired = true;
      callback();
    }
  }
  check();
  if (fired) {
    return noop;
  }
  const handler = () => check();
  window.addEventListener("resize", handler, { passive: true });
  return () => window.removeEventListener("resize", handler);
}

// src/app/api/[locale]/system/unified-interface/vibe-frame/embed.ts
var frames = new Map;
var configSignal;
var configSubscribers = [];
function getConfig() {
  return configSignal;
}
function setConfig(next) {
  configSignal = next;
  const subs = configSubscribers;
  for (const sub of subs) {
    sub(next);
  }
}
function subscribeConfig(fn) {
  configSubscribers.push(fn);
  return () => {
    configSubscribers = configSubscribers.filter((s) => s !== fn);
  };
}
var initialized = false;
function initContext(cfg) {
  if (initialized) {
    return false;
  }
  initialized = true;
  setConfig(cfg);
  Object.defineProperty(window, "vibeFrameConfig", {
    get() {
      return configSignal;
    },
    set(next) {
      setConfig(next);
    },
    enumerable: true,
    configurable: true
  });
  return true;
}
function scheduleIdle(fn) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(fn);
  } else {
    requestAnimationFrame(fn);
  }
}
var ELEMENT_WAIT_TIMEOUT = 1e4;
async function waitForElement(selector) {
  const start = Date.now();
  let delay = 50;
  while (Date.now() - start < ELEMENT_WAIT_TIMEOUT) {
    const el = document.querySelector(selector);
    if (el) {
      return el;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
    delay = Math.min(delay * 1.5, 500);
  }
  return null;
}
function mount(config) {
  const frameId = generateFrameId();
  const display = config.trigger?.display ?? "inline";
  if (!checkDisplayFrequency(frameId, config.displayFrequency)) {
    return createStubInstance(frameId);
  }
  if (config.trigger && config.trigger.type !== "immediate") {
    return mountWithTrigger(frameId, config, display);
  }
  return mountImmediate(frameId, config, display);
}
function mountWithTrigger(frameId, config, display) {
  let realInstance = null;
  const triggerCleanup = setupTrigger(config.trigger, () => {
    if (realInstance) {
      return;
    }
    if (!checkDisplayFrequency(frameId, config.displayFrequency)) {
      return;
    }
    scheduleIdle(() => {
      realInstance = mountImmediate(frameId, config, display);
      recordDisplay(frameId, config.displayFrequency);
      const managed = frames.get(frameId);
      if (managed) {
        managed.instance = realInstance;
      }
    });
  });
  const iframe = document.createElement("iframe");
  const stub = createStubInstance(frameId, iframe, () => {
    triggerCleanup();
    realInstance?.destroy();
    frames.delete(frameId);
  });
  frames.set(frameId, {
    instance: stub,
    bridge: null,
    container: document.createElement("div"),
    triggerCleanup,
    config,
    display
  });
  return stub;
}
function mountImmediate(frameId, config, displayMode) {
  const display = displayMode ?? config.trigger?.display ?? "inline";
  const locale = config.locale ?? detectLocale();
  const iframe = document.createElement("iframe");
  iframe.id = frameId;
  iframe.title = config.endpoint;
  iframe.setAttribute("sandbox", config.sandbox ?? DEFAULT_SANDBOX);
  iframe.style.cssText = "border:none;width:100%;height:0;overflow:hidden;transition:height 0.2s ease;";
  if (config.maxHeight) {
    iframe.style.maxHeight = `${config.maxHeight}px`;
  }
  let container = document.createElement("div");
  const serverOrigin = new URL(config.serverUrl).origin;
  const bridge = createParentBridge({
    iframe,
    frameId,
    allowedOrigin: serverOrigin,
    onMessage: (msg) => handleFrameMessage(frameId, msg, config)
  });
  iframe.addEventListener("load", () => {
    bridge.send({
      type: "vf:init",
      frameId,
      origin: window.location.origin,
      theme: config.theme ?? "system",
      locale,
      cssVars: config.cssVars ?? {}
    });
    if (config.authToken) {
      bridge.send({ type: "vf:auth", token: config.authToken });
    }
  });
  const instance = {
    id: frameId,
    iframe,
    setData: (data) => bridge.send({ type: "vf:data", data }),
    setTheme: (theme) => bridge.send({ type: "vf:theme", theme }),
    authenticate: (token) => bridge.send({ type: "vf:auth", token }),
    back: () => bridge.send({ type: "vf:navigate", action: "back" }),
    close: () => bridge.send({ type: "vf:navigate", action: "close" }),
    destroy: () => destroyFrame(frameId)
  };
  frames.set(frameId, {
    instance,
    bridge,
    container,
    triggerCleanup: null,
    config,
    display
  });
  (async () => {
    const widgets = await fetchFrameConfig(config.serverUrl, locale, [
      {
        id: frameId,
        endpoint: config.endpoint,
        theme: config.theme,
        urlPathParams: config.urlPathParams,
        data: config.data,
        frameId
      }
    ], config.leadId, config.authToken);
    const widget = widgets[0];
    if (!widget || !frames.has(frameId)) {
      return;
    }
    iframe.src = widget.widgetUrl;
    const resolvedContainer = await insertIntoDOM(iframe, config, display);
    const managed = frames.get(frameId);
    if (managed) {
      managed.container = resolvedContainer;
    }
    container = resolvedContainer;
  })();
  return instance;
}
async function insertIntoDOM(iframe, config, display) {
  if (display === "inline") {
    return insertInline(iframe, config);
  }
  return insertOverlay(iframe, config, display);
}
async function insertInline(iframe, config) {
  const targetSpec = config.target;
  if (typeof targetSpec === "string") {
    const el = await waitForElement(targetSpec);
    if (!el) {
      const fallback = document.createElement("div");
      document.body.appendChild(fallback);
      scheduleIdle(() => fallback.appendChild(iframe));
      return fallback;
    }
    scheduleIdle(() => el.appendChild(iframe));
    return el;
  }
  scheduleIdle(() => targetSpec.appendChild(iframe));
  return targetSpec;
}
function insertOverlay(iframe, config, display) {
  const overlay = document.createElement("div");
  overlay.className = `vf-overlay vf-overlay--${display}`;
  overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;";
  const dialog = document.createElement("div");
  dialog.className = `vf-dialog vf-dialog--${display}`;
  dialog.style.cssText = getDialogStyles(display);
  const closeBtn = document.createElement("button");
  closeBtn.className = "vf-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.style.cssText = "position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;z-index:1;";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    config.onClose?.();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      config.onClose?.();
    }
  });
  dialog.appendChild(closeBtn);
  dialog.appendChild(iframe);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  return overlay;
}
function getDialogStyles(display) {
  const base = "position:relative;background:white;border-radius:8px;overflow:hidden;";
  switch (display) {
    case "modal":
      return `${base}width:90%;max-width:600px;max-height:90vh;`;
    case "slideIn":
      return `${base}position:fixed;right:0;top:0;bottom:0;width:400px;max-width:90vw;border-radius:0;`;
    case "bottomSheet":
      return `${base}position:fixed;left:0;right:0;bottom:0;max-height:80vh;border-radius:12px 12px 0 0;`;
    default:
      return base;
  }
}
function handleFrameMessage(frameId, msg, config) {
  const managed = frames.get(frameId);
  switch (msg.type) {
    case "vf:ready":
      config.onReady?.();
      break;
    case "vf:resize":
      if (managed) {
        managed.instance.iframe.style.height = `${msg.height}px`;
      }
      break;
    case "vf:close":
      config.onClose?.();
      if (managed?.container.classList.contains("vf-overlay")) {
        managed.container.remove();
      }
      break;
    case "vf:success":
      config.onSuccess?.(msg.data);
      break;
    case "vf:error":
      config.onError?.(msg.error);
      break;
    case "vf:navigate":
      config.onNavigate?.(msg.path);
      break;
    case "vf:authRequired":
      config.onAuthRequired?.();
      break;
    case "vf:formState":
    case "vf:log":
      break;
  }
}
function destroyFrame(frameId) {
  const managed = frames.get(frameId);
  if (!managed) {
    return;
  }
  managed.bridge?.destroy();
  managed.triggerCleanup?.();
  managed.instance.iframe.remove();
  if (managed.container.classList.contains("vf-overlay")) {
    managed.container.remove();
  }
  frames.delete(frameId);
}
function destroyAll() {
  const keys = frames.keys();
  const ids = [...keys];
  for (const frameId of ids) {
    destroyFrame(frameId);
  }
}
async function fetchFrameConfig(serverUrl, locale, integrations, leadId, authToken) {
  const base = serverUrl.replace(/\/$/, "");
  const url = `${base}/api/${locale}/system/unified-interface/vibe-frame/mount`;
  const body = { integrations };
  if (leadId) {
    body.leadId = leadId;
  }
  if (authToken) {
    body.authToken = authToken;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.widgets ?? [];
  } catch {
    return [];
  }
}
function detectLocale() {
  const lang = navigator.language;
  if (lang.includes("-")) {
    return lang;
  }
  const regionMap = {
    en: "en-US",
    de: "de-DE",
    pl: "pl-PL"
  };
  return regionMap[lang] ?? "en-US";
}
function createStubInstance(frameId, iframe, onDestroy) {
  const el = iframe ?? document.createElement("iframe");
  return {
    id: frameId,
    iframe: el,
    setData: () => {
      return;
    },
    setTheme: () => {
      return;
    },
    authenticate: () => {
      return;
    },
    back: () => {
      return;
    },
    close: () => {
      return;
    },
    destroy: onDestroy ?? (() => {
      return;
    })
  };
}
function mountBatch(configs, shared) {
  return configs.map((cfg) => {
    const full = {
      ...cfg,
      target: cfg.target ?? "body",
      serverUrl: cfg.serverUrl ?? shared.serverUrl,
      locale: cfg.locale ?? shared.locale,
      authToken: cfg.authToken ?? shared.authToken,
      leadId: cfg.leadId ?? shared.leadId
    };
    return mount(full);
  });
}
function mountFromConfig(cfg) {
  for (const integration of cfg.integrations ?? []) {
    const full = {
      ...integration,
      target: integration.target ?? "body",
      serverUrl: integration.serverUrl ?? cfg.serverUrl,
      locale: integration.locale ?? cfg.locale,
      authToken: integration.authToken ?? cfg.authToken,
      leadId: integration.leadId ?? cfg.leadId
    };
    mount(full);
  }
}
function autoInit() {
  const raw = window.vibeFrameConfig;
  if (!raw) {
    return;
  }
  const isFirst = initContext(raw);
  if (!isFirst) {
    return;
  }
  mountFromConfig(raw);
  subscribeConfig((next) => {
    destroyAll();
    mountFromConfig(next);
  });
}
var VibeFrame = {
  mount(configOrConfigs, shared) {
    if (Array.isArray(configOrConfigs)) {
      if (!shared) {
        return [];
      }
      return mountBatch(configOrConfigs, shared);
    }
    return mount(configOrConfigs);
  },
  destroy: destroyFrame,
  destroyAll,
  get(frameId) {
    return frames.get(frameId)?.instance;
  },
  list() {
    const keys = frames.keys();
    return [...keys];
  },
  version: "1.0.0"
};
if (typeof window !== "undefined") {
  window.VibeFrame = VibeFrame;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    scheduleIdle(autoInit);
  }
}
export {
  subscribeConfig,
  setupTrigger,
  getConfig,
  generateFrameId,
  createParentBridge,
  createFrameBridge,
  VibeFrame,
  DEFAULT_SANDBOX
};

//# debugId=059F981BC52359DD64756E2164756E21

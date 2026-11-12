import type { EndpointLogger } from "../../../logger/types";

export function getCurrentUrl(): string {
  return window.location.href;
}

export function getCurrentOrigin(): string {
  return window.location.origin;
}

export function getCurrentPathname(): string {
  return window.location.pathname;
}

export function getCurrentSearch(): string {
  return window.location.search;
}

export function getCurrentHostname(): string {
  return window.location.hostname;
}

export function getCurrentProtocol(): string {
  return window.location.protocol;
}

export function getCurrentHost(): string {
  return window.location.host;
}

export function openUrl(url: string): void {
  window.location.href = url;
}

/**
 * Open a URL in a new tab. Pass a logger so a popup blocker swallowing the
 * window (window.open returns null) reaches the error log.
 */
export function openInNewTab(url: string, logger: EndpointLogger): void {
  const opened = window.open(url, "_blank");
  if (!opened) {
    logger.warn("window.open returned null (popup blocked?)", {
      operation: "openInNewTab",
      urlScheme: url.split(":")[0]?.slice(0, 16) ?? null,
    });
  }
}

export function assignUrl(url: string): void {
  window.location.assign(url);
}

export function reloadPage(): void {
  window.location.reload();
}

export function silentPushState(url: string): void {
  window.history.pushState(null, "", url);
}

export function silentReplaceState(url: string): void {
  window.history.replaceState(null, "", url);
}

export function historyBack(): void {
  window.history.back();
}

export function replaceUrl(url: string): void {
  window.location.replace(url);
}

export function openWithTarget(
  url: string,
  target: string,
  logger: EndpointLogger,
): void {
  const opened = window.open(url, target);
  if (!opened) {
    logger.warn("window.open returned null (popup blocked?)", {
      operation: "openWithTarget",
      target,
      urlScheme: url.split(":")[0]?.slice(0, 16) ?? null,
    });
  }
}

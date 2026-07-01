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

export function openInNewTab(url: string): void {
  window.open(url, "_blank");
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

export function openWithTarget(url: string, target: string): void {
  window.open(url, target);
}

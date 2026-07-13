import { execSync } from "node:child_process";

function openSystemUrl(url: string): void {
  try {
    const platform = process.platform;
    if (platform === "darwin") {
      execSync(`open "${url}"`, { stdio: "ignore" });
    } else if (platform === "win32") {
      execSync(`cmd /c start "" "${url}"`, { stdio: "ignore" });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: "ignore" });
    }
  } catch {
    // silent
  }
}

export function getCurrentUrl(): string {
  return "";
}

export function getCurrentOrigin(): string {
  return "";
}

export function getCurrentPathname(): string {
  return "/";
}

export function getCurrentSearch(): string {
  return "";
}

export function getCurrentHostname(): string {
  return "";
}

export function getCurrentProtocol(): string {
  return "http:";
}

export function getCurrentHost(): string {
  return "localhost";
}

export function openUrl(url: string): void {
  openSystemUrl(url);
}

export function openInNewTab(url: string): void {
  openSystemUrl(url);
}

export function assignUrl(url: string): void {
  openSystemUrl(url);
}

export function reloadPage(): void {
  // no-op in terminal
}

export function silentPushState(url: string): void {
  void url;
}

export function silentReplaceState(url: string): void {
  void url;
}

export function historyBack(): void {
  // no-op in terminal
}

export function replaceUrl(url: string): void {
  openSystemUrl(url);
}

export function openWithTarget(url: string, target: string): void {
  void target;
  openSystemUrl(url);
}

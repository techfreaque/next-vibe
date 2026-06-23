import { Linking } from "react-native";

export function getCurrentUrl(): string {
  return "app://native";
}

export function getCurrentOrigin(): string {
  return "app://native";
}

export function getCurrentPathname(): string {
  return "/";
}

export function getCurrentSearch(): string {
  return "";
}

export function getCurrentHostname(): string {
  return "native";
}

export function getCurrentProtocol(): string {
  return "app:";
}

export function getCurrentHost(): string {
  return "native";
}

export function openUrl(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}

export function openInNewTab(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}

export function assignUrl(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}

export function reloadPage(): void {
  // no-op on native
}

export function silentPushState(url: string): void {
  void url;
}

export function silentReplaceState(url: string): void {
  void url;
}

export function historyBack(): void {
  // no-op on native
}

export function replaceUrl(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}

export function openWithTarget(url: string, target: string): void {
  void target;
  Linking.openURL(url).catch(() => undefined);
}

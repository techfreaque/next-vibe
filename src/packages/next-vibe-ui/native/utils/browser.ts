/**
 * Platform-agnostic browser utilities (Native implementation)
 */

import { Linking } from "react-native";

export function getCurrentUrl(): string {
  return "app://native";
}

export function getReferrer(): string {
  return "";
}

export function getUserAgent(): string {
  return "React Native";
}

export function openUrl(url: string): void {
  Linking.openURL(url).catch(() => {
    // Silently handle URL opening failures
  });
}

export function openInNewTab(url: string): void {
  Linking.openURL(url).catch(() => {
    // Silently handle URL opening failures
  });
}

export function getScreenWidth(): number {
  return 0;
}

export function silentPushState(url: string): void {
  void url; // no browser history on native
}

export function silentReplaceState(url: string): void {
  void url; // no browser history on native
}

export function getCurrentOrigin(): string {
  return "app://native";
}

export function getCurrentHostname(): string {
  return "native";
}

export function getCurrentPathname(): string {
  return "/";
}

export function getCurrentSearch(): string {
  return "";
}

export function reloadPage(): void {
  // no-op on native
}

export function assignUrl(url: string): void {
  Linking.openURL(url).catch(() => {
    // Silently handle
  });
}

export function scrollToTop(behavior?: ScrollBehavior): void {
  void behavior; // no-op on native — use ScrollView ref instead
}

export function triggerPrint(): void {
  // no-op on native
}

export async function copyToClipboard(text: string): Promise<boolean> {
  const Clipboard = await import("@react-native-clipboard/clipboard");
  Clipboard.default.setString(text);
  return true;
}

export function downloadFile(
  filename: string,
  content: string,
  mimeType?: string,
): void {
  void filename;
  void content;
  void mimeType; // no-op on native — use react-native-fs or expo-file-system for file ops
}

export function getRootCssVar(name: string): string {
  void name; // no DOM on native
  return "";
}

export function setRootCssVar(name: string, value: string): void {
  void name;
  void value; // no DOM on native
}

export function removeRootCssVar(name: string): void {
  void name; // no DOM on native
}

export function rootHasClass(className: string): boolean {
  void className; // no DOM on native
  return false;
}

export function addRootClass(className: string): void {
  void className; // no DOM on native
}

export function removeRootClass(className: string): void {
  void className; // no DOM on native
}

export function getDocumentScrollHeight(): number {
  return 0;
}

export function getDocumentBody(): null {
  return null;
}

export function getElementById(id: string): null {
  void id; // no DOM on native
  return null;
}

export function querySelector<T extends Element = Element>(
  selector: string,
): T | null {
  void selector; // no DOM on native
  return null;
}

export function addDocumentListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
): () => void {
  void event;
  void handler; // no DOM on native
  return (): void => undefined;
}

export function addWindowListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
): () => void {
  void event;
  void handler; // no DOM on native
  return (): void => undefined;
}

export function observeRootMutations(
  callback: MutationCallback,
  options: MutationObserverInit,
): () => void {
  void callback;
  void options; // no DOM on native
  return (): void => undefined;
}

export async function getGeolocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null> {
  const Geolocation = await import("@react-native-community/geolocation");
  return new Promise((resolve) => {
    Geolocation.default.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
    );
  });
}

export async function getMicrophoneStream(): Promise<null> {
  return null;
}

export function hasClipboardAccess(): boolean {
  return false;
}

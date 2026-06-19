/**
 * Platform-agnostic browser utilities (CLI/Ink implementation)
 * Opens URLs via the system's default browser, reads terminal dimensions from stdout.
 */

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
    // URL opening failed silently
  }
}

export function getCurrentUrl(): string {
  return "";
}

export function getReferrer(): string {
  return "";
}

export function getUserAgent(): string {
  return "CLI";
}

export function getCurrentOrigin(): string {
  return "";
}

export function getCurrentHostname(): string {
  return "";
}

export function getCurrentPathname(): string {
  return "/";
}

export function getCurrentSearch(): string {
  return "";
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

export function getScreenWidth(): number {
  return process.stdout?.columns ?? 80;
}

export function silentPushState(url: string): void {
  void url; // no browser history in terminal
}

export function silentReplaceState(url: string): void {
  void url; // no browser history in terminal
}

export function reloadPage(): void {
  // no-op in terminal
}

export function scrollToTop(behavior?: ScrollBehavior): void {
  void behavior; // no-op in terminal
}

export function triggerPrint(): void {
  process.stdout.write("\x1B[?1049h"); // switch to alternate screen = closest equivalent
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    const platform = process.platform;
    if (platform === "darwin") {
      execSync("pbcopy", { input: text });
    } else if (platform === "win32") {
      execSync("clip", { input: text });
    } else {
      try {
        execSync("xclip -selection clipboard", { input: text });
      } catch {
        execSync("xsel --clipboard --input", { input: text });
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function downloadFile(
  filename: string,
  content: string,
  mimeType?: string,
): void {
  void mimeType; // mimeType not applicable in terminal, write as-is
  void import("node:fs").then(({ writeFileSync }) => {
    writeFileSync(filename, content);
    process.stdout.write(`Saved: ${filename}\n`);
    return undefined;
  });
}

export function getRootCssVar(name: string): string {
  void name; // no DOM in terminal
  return "";
}

export function setRootCssVar(name: string, value: string): void {
  void name;
  void value; // no DOM in terminal
}

export function removeRootCssVar(name: string): void {
  void name; // no DOM in terminal
}

export function rootHasClass(className: string): boolean {
  void className; // no DOM in terminal
  return false;
}

export function addRootClass(className: string): void {
  void className; // no DOM in terminal
}

export function removeRootClass(className: string): void {
  void className; // no DOM in terminal
}

export function getDocumentScrollHeight(): number {
  return 0;
}

export function getDocumentBody(): null {
  return null;
}

export function getElementById(id: string): null {
  void id; // no DOM in terminal
  return null;
}

export function querySelector<T extends Element = Element>(
  selector: string,
): T | null {
  void selector; // no DOM in terminal
  return null;
}

export function addDocumentListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
): () => void {
  void event;
  void handler; // no DOM in terminal
  return (): void => undefined;
}

export function addWindowListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
): () => void {
  void event;
  void handler; // no DOM in terminal
  return (): void => undefined;
}

export function observeRootMutations(
  callback: MutationCallback,
  options: MutationObserverInit,
): () => void {
  void callback;
  void options; // no DOM in terminal
  return (): void => undefined;
}

export async function getGeolocation(): Promise<null> {
  return null;
}

export async function getMicrophoneStream(): Promise<null> {
  return null;
}

export function hasClipboardAccess(): boolean {
  return false;
}

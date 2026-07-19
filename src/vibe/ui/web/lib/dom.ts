export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({ top: 0, behavior });
}

export function getScrollX(): number {
  return window.scrollX;
}

export function getScrollY(): number {
  return window.scrollY;
}

export function scrollToPosition(
  x: number,
  y: number,
  behavior: ScrollBehavior = "auto",
): void {
  window.scrollTo({ left: x, top: y, behavior });
}

export function triggerPrint(): void {
  window.print();
}

export function getReferrer(): string {
  return document.referrer;
}

export function getDocumentScrollHeight(): number {
  return document.documentElement.scrollHeight;
}

export function getDocumentBody(): HTMLElement {
  return document.body;
}

export function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function querySelector<T extends Element = Element>(
  selector: string,
): T | null {
  return document.querySelector<T>(selector);
}

export function addDocumentListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
): () => void {
  document.addEventListener(event, handler);
  return (): void => document.removeEventListener(event, handler);
}

export function addWindowListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
): () => void {
  window.addEventListener(event, handler);
  return (): void => window.removeEventListener(event, handler);
}

export function getReadyState(): DocumentReadyState {
  return document.readyState;
}

export function onDOMReady(fn: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): HTMLElementTagNameMap[K] {
  return document.createElement(tag);
}

export function appendToBody(el: HTMLElement): void {
  document.body.append(el);
}

export function observeRootMutations(
  callback: MutationCallback,
  options: MutationObserverInit,
): () => void {
  const mo = new MutationObserver(callback);
  mo.observe(document.documentElement, options);
  return (): void => mo.disconnect();
}

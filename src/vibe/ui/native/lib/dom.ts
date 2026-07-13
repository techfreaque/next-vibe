export function scrollToTop(behavior?: ScrollBehavior): void {
  void behavior;
}

export function getScrollX(): number {
  return 0;
}

export function getScrollY(): number {
  return 0;
}

export function scrollToPosition(
  x: number,
  y: number,
  behavior?: ScrollBehavior,
): void {
  void x;
  void y;
  void behavior;
}

export function triggerPrint(): void {
  // no-op on native
}

export function getReferrer(): string {
  return "";
}

export function getDocumentScrollHeight(): number {
  return 0;
}

export function getDocumentBody(): null {
  return null;
}

export function getElementById(id: string): null {
  void id;
  return null;
}

export function querySelector<T extends Element = Element>(
  selector: string,
): T | null {
  void selector;
  return null;
}

export function addDocumentListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
): () => void {
  void event;
  void handler;
  return (): void => undefined;
}

export function addWindowListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
): () => void {
  void event;
  void handler;
  return (): void => undefined;
}

export function getReadyState(): DocumentReadyState {
  return "complete";
}

export function onDOMReady(fn: () => void): void {
  fn();
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): HTMLElementTagNameMap[K] {
  void tag;
  return {} as HTMLElementTagNameMap[K];
}

export function appendToBody(el: HTMLElement): void {
  void el;
}

export function observeRootMutations(
  callback: MutationCallback,
  options: MutationObserverInit,
): () => void {
  void callback;
  void options;
  return (): void => undefined;
}

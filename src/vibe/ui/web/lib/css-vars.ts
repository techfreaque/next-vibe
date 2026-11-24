export function getDocumentLang(): string {
  return document.documentElement.lang;
}

export function setDocumentLang(lang: string, dir?: "ltr" | "rtl"): void {
  const root = document.documentElement;
  if (root.lang !== lang) {
    root.lang = lang;
  }
  if (dir && root.dir !== dir) {
    root.dir = dir;
  }
}

export function getRootCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function setRootCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}

export function removeRootCssVar(name: string): void {
  document.documentElement.style.removeProperty(name);
}

export function rootHasClass(className: string): boolean {
  return document.documentElement.classList.contains(className);
}

export function addRootClass(className: string): void {
  document.documentElement.classList.add(className);
}

export function removeRootClass(className: string): void {
  document.documentElement.classList.remove(className);
}

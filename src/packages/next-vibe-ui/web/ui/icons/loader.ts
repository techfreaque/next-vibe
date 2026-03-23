/**
 * Statically-analyzable icon lazy loader.
 *
 * Vite/TanStack: uses import.meta.glob so Vite statically analyzes all icon
 * files and creates proper lazy chunks - fixing the "dynamic import cannot be
 * analyzed" warning and the "!" hydration error caused by failed imports.
 *
 * Next.js/webpack: uses a dynamic import with a static `./` prefix and `.tsx`
 * suffix, which webpack can analyze via its partial static analysis.
 *
 * The glob/import must live here (co-located with icons) for the relative
 * path to resolve correctly at build time.
 */

import type { IconComponent } from "../../lib/helper";

type IconModule = Record<string, IconComponent>;
type IconModuleLoader = () => Promise<IconModule>;

// Augment ImportMeta so TypeScript accepts import.meta.glob in non-Vite envs.
declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, IconModuleLoader>;
  }
}

// Vite statically analyzes this at build time and creates a lazy chunk per
// icon file. Must be a top-level call so Vite's transform regex matches it.
// In Next.js/webpack, import.meta.glob is undefined at runtime so the
// fallback webpack dynamic import path is used instead.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not defined outside Vite
const iconGlob: Record<string, IconModuleLoader> | undefined =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- guard for non-Vite
  typeof import.meta.glob === "function"
    ? import.meta.glob("./*.tsx")
    : undefined;

/**
 * Load a single icon module by its PascalCase name (e.g. "Folder", "Activity").
 * Returns the module's named exports so callers can do `mod[name]`.
 */
export async function loadIconModule(name: string): Promise<IconModule> {
  // Vite path: glob map is populated at build time (client + SSR)
  const loader = iconGlob?.[`./${name}.tsx`];
  if (loader) {
    return loader();
  }
  // Next.js/webpack path: dynamic import with static prefix+suffix so webpack
  // can statically analyze the icons directory and code-split per icon.
  return import(
    /* webpackMode: "lazy-once" */ /* @vite-ignore */
    `./${name}.tsx`
  ) as Promise<IconModule>;
}

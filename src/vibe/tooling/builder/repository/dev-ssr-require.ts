/**
 * Dev-only `require()` for SSR modules (injected by the `cjs-require-polyfill`
 * Vite plugin in vite-compiler.ts — never used in builds).
 *
 * Scoped i18n loads non-English locales lazily: `de: () => require("./de")`.
 * On SSR that is the runtime's native require, whose cache lives OUTSIDE
 * Vite's module graph: HMR re-evaluates the i18n index, but `require("./de")`
 * kept returning the pre-edit object until the dev server restarted.
 *
 * The dev server re-evaluates an i18n index whenever one of its de/pl files
 * changes (see REQUIRED_LOCALE_FILE in vite-compiler.ts), and every evaluation
 * creates a fresh require here. So each fresh require drops the native cache
 * for the folder it loads from (the locale folder, incl. nested files) on its
 * first use of a specifier — one re-read per re-evaluation, nothing per call.
 */

import { createRequire } from "node:module";
import { dirname } from "node:path";

function isProjectSource(path: string): boolean {
  return path.includes("/src/") && !path.includes("/node_modules/");
}

export function createDevSsrRequire(fromFile: string): NodeJS.Require {
  const nativeRequire = createRequire(fromFile);
  const fresh = new Set<string>();
  const devRequire = (specifier: string): ReturnType<NodeJS.Require> => {
    if (!fresh.has(specifier)) {
      fresh.add(specifier);
      const resolved = nativeRequire.resolve(specifier);
      if (isProjectSource(resolved)) {
        const folder = `${dirname(resolved)}/`;
        for (const key of Object.keys(nativeRequire.cache)) {
          if (key.startsWith(folder)) {
            // oxlint-disable-next-line typescript/no-dynamic-delete -- require cache is keyed by path
            delete nativeRequire.cache[key];
          }
        }
      }
    }
    return nativeRequire(specifier);
  };
  return Object.assign(devRequire, {
    resolve: nativeRequire.resolve,
    cache: nativeRequire.cache,
    extensions: nativeRequire.extensions,
    main: nativeRequire.main,
  });
}

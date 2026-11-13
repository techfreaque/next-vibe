/**
 * Webpack loader (browser compile only): per-locale translations.
 *
 * Every scope's `i18n/index.ts` lazy-loads its non-English translations with
 * `de: () => require("./de").translations`. A synchronous require still puts
 * the de + pl objects into the same client chunk, so every visitor downloaded
 * all three languages.
 *
 * In the browser the page language is fixed by the URL (`/de-DE/...`; a
 * language switch is a full navigation, see `TranslationProvider`), so this
 * loader rewrites each lazy require into a top-level-awaited dynamic import
 * that only runs for the page's language:
 *
 *   const __vibeI18n_0 = __vibeI18nLang === "de"
 *     ? (await import("./de")).translations : undefined;
 *   ...
 *   de: () => __vibeI18n_0 ?? {},
 *
 * Top-level await keeps `t()` synchronous: importers wait for the chunk before
 * they render, on hydration and on lazily loaded routes alike. A missing
 * language resolves to `{}` and `createScopedTranslation` falls back to English.
 *
 * Server, native and CLI builds never run this loader (they keep the sync
 * require). The Vite dev client (`vite-compiler.ts`, `cjs-require-polyfill`)
 * calls `transformClientLocaleSource` below, so dev and prod behave the same.
 */

"use strict";

const LAZY_LOCALE_PATTERN =
  /\(\)\s*=>\s*require\((["'])([^"'`]+\/(de|pl))\1\)\.translations/g;

const LANGUAGE_EXPRESSION =
  'typeof location === "undefined" ? undefined : (location.pathname.split("/")[1] || "").split("-")[0].toLowerCase()';

/**
 * @param {string} source
 * @returns {string}
 */
function transformClientLocaleSource(source) {
  if (!source.includes("require(")) {
    return source;
  }
  const declarations = [];
  let counter = 0;
  const rewritten = source.replace(
    LAZY_LOCALE_PATTERN,
    (...[, , specifier, language]) => {
      const name = `__vibeI18n_${counter++}`;
      declarations.push(
        `const ${name} = __vibeI18nLang === ${JSON.stringify(language)} ? (await import(${JSON.stringify(specifier)})).translations : undefined;`,
      );
      return `() => ${name} ?? {}`;
    },
  );
  if (declarations.length === 0) {
    return source;
  }
  return `const __vibeI18nLang = ${LANGUAGE_EXPRESSION};\n${declarations.join("\n")}\n${rewritten}`;
}

/**
 * @this {{ cacheable?: (flag: boolean) => void }}
 * @param {string} source
 * @returns {string}
 */
function clientLocaleLoader(source) {
  if (this && typeof this.cacheable === "function") {
    this.cacheable(true);
  }
  return transformClientLocaleSource(source);
}

module.exports = clientLocaleLoader;
module.exports.transformClientLocaleSource = transformClientLocaleSource;

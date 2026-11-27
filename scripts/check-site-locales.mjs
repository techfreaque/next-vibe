import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { Glob } from "bun";

// Run with Bun so the verifier reads the same TypeScript dictionaries as SSR.
// --allow-protected lists the explicitly deferred design scopes separately.
// --locale=hi checks Hindi, which is still being rolled out: scopes without a
// hi dictionary are counted as pending unless --strict makes them errors.
const allowProtected = process.argv.includes("--allow-protected");
const strict = process.argv.includes("--strict");
const siteLocales = ["it", "es", "sk"];
const rolloutLocales = ["hi"];
const requestedLocale = process.argv
  .find((argument) => argument.startsWith("--locale="))
  ?.slice("--locale=".length);
if (
  requestedLocale !== undefined &&
  !siteLocales.includes(requestedLocale) &&
  !rolloutLocales.includes(requestedLocale)
) {
  process.stderr.write(`Unsupported locale: ${requestedLocale}\n`);
  process.exit(1);
}
const locales = requestedLocale === undefined ? siteLocales : [requestedLocale];
const pending = [];
// Hindi copy keeps Western digits (0-9), never Devanagari numerals.
const devanagariDigits = /[\u0966-\u096F]/;
const protectedScope =
  /^src\/(?:_pages\/skill\/\[skillId\]\/|vibe\/agent\/(?:chat\/folder[^/]*\/|ai-stream\/stream\/widget\/chat-ui\/))/;
const root = resolve(import.meta.dirname, "..");
const errors = [];
const deferred = [];
let scopes = 0;
let strings = 0;
const tokenList = (value) =>
  (value.match(/\{\{[^{}]+\}\}|\{[a-zA-Z_][\w.-]*\}/g) ?? []).toSorted();

function compare(source, translated, path) {
  if (
    typeof source !== typeof translated ||
    Array.isArray(source) !== Array.isArray(translated)
  ) {
    errors.push(`${path} has the wrong value type`);
    return;
  }
  if (source !== null && typeof source === "object") {
    if (!translated) {
      errors.push(`${path} is missing its dictionary`);
      return;
    }
    for (const key of Object.keys(translated)) {
      if (!Object.hasOwn(source, key)) {
        errors.push(`${path}.${key} has no matching English key`);
      }
    }
    for (const [key, value] of Object.entries(source)) {
      if (!Object.hasOwn(translated, key)) {
        errors.push(`${path}.${key} is missing`);
        continue;
      }
      compare(value, translated[key], `${path}.${key}`);
    }
  } else if (typeof source === "string") {
    strings++;
    if (tokenList(source).join("\0") !== tokenList(translated).join("\0")) {
      errors.push(`${path} has different placeholders`);
    }
    if (source.trim() && !translated.trim()) {
      errors.push(`${path} is empty`);
    }
    if (translated.includes("—")) {
      errors.push(`${path} contains an em dash`);
    }
    if (path.includes("/hi.") || /\/hi(?:\.|$)/.test(path)) {
      if (devanagariDigits.test(translated) && !devanagariDigits.test(source)) {
        errors.push(`${path} uses Devanagari digits`);
      }
    }
  } else if (source !== translated) {
    errors.push(`${path} changes a non-text value`);
  }
}

for (const english of [
  ...new Glob("src/**/en/index.ts").scanSync({ cwd: root }),
].toSorted()) {
  const scope = dirname(dirname(english));
  if (!existsSync(join(root, scope, "fr/index.ts"))) {
    errors.push(`${scope} has no French reference`);
  }
  const source = (await import(pathToFileURL(join(root, english)).href))
    .translations;
  const previousLocalesDeferred =
    allowProtected &&
    protectedScope.test(scope) &&
    ["it", "es"].every(
      (lang) => !existsSync(join(root, scope, lang, "index.ts")),
    );
  const loaderPath = join(root, scope, "index.ts");
  const loader = existsSync(loaderPath) ? readFileSync(loaderPath, "utf8") : "";
  scopes++;
  for (const lang of locales) {
    if (previousLocalesDeferred && (lang === "it" || lang === "es")) {
      deferred.push(`${scope}/${lang}`);
      continue;
    }
    const path = join(root, scope, lang, "index.ts");
    if (!existsSync(path)) {
      if (rolloutLocales.includes(lang) && !strict) {
        pending.push(`${scope}/${lang}`);
      } else {
        errors.push(`${scope} is missing ${lang}`);
      }
      continue;
    }
    if (!new RegExp(`^\\s*${lang}:\\s*`, "m").test(loader)) {
      errors.push(`${scope} does not register ${lang}`);
    }
    try {
      const dictionary = (await import(pathToFileURL(path).href)).translations;
      compare(source, dictionary, `${scope}/${lang}`);
    } catch (error) {
      errors.push(`${scope}/${lang} could not load: ${error.message}`);
    }
  }
}

process.stdout.write(
  `${scopes} scopes, ${strings} translated string entries compared, ${errors.length} errors\n`,
);
if (pending.length) {
  process.stdout.write(
    `${pending.length} scopes have no ${locales.join("/")} dictionary yet (English fallback; --strict lists them as errors)\n`,
  );
}
for (const scope of deferred) {
  process.stdout.write(`Deferred design scope: ${scope}\n`);
}
for (const error of errors) {
  process.stderr.write(`${error}\n`);
}
process.exitCode = errors.length ? 1 : 0;

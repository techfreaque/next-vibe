import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { Glob } from "bun";

// Run with Bun so the verifier reads the same TypeScript dictionaries as SSR.
// --allow-protected lists the explicitly deferred design scopes separately.
const allowProtected = process.argv.includes("--allow-protected");
const protectedScope =
  /^src\/(?:_pages\/skill\/\[skillId\]\/|vibe\/agent\/(?:chat\/folder[^/]*\/|ai-stream\/stream\/widget\/chat-ui\/))/;
const root = resolve(import.meta.dirname, "..");
const errors = [];
const deferred = [];
let scopes = 0;
let strings = 0;
const tokenList = (value) => (value.match(/\{\{[^{}]+\}\}/g) ?? []).toSorted();

function compare(source, translated, path) {
  if (
    typeof source !== typeof translated ||
    Array.isArray(source) !== Array.isArray(translated)
  ) {
    errors.push(`${path} has the wrong value type`);
    return;
  }
  if (source !== null && typeof source === "object") {
    if (
      !translated ||
      Object.keys(source).toSorted().join("\0") !==
        Object.keys(translated).toSorted().join("\0")
    ) {
      errors.push(`${path} has different keys`);
      return;
    }
    for (const [key, value] of Object.entries(source)) {
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
  if (
    allowProtected &&
    protectedScope.test(scope) &&
    ["it", "es"].every(
      (lang) => !existsSync(join(root, scope, lang, "index.ts")),
    )
  ) {
    deferred.push(scope);
    continue;
  }
  scopes++;
  for (const lang of ["it", "es"]) {
    const path = join(root, scope, lang, "index.ts");
    if (!existsSync(path)) {
      errors.push(`${scope} is missing ${lang}`);
      continue;
    }
    compare(
      source,
      (await import(pathToFileURL(path).href)).translations,
      `${scope}/${lang}`,
    );
  }
}

process.stdout.write(
  `${scopes} scopes, ${strings} translated string entries compared, ${errors.length} errors\n`,
);
for (const scope of deferred) {
  process.stdout.write(`Deferred design scope: ${scope}\n`);
}
for (const error of errors) {
  process.stderr.write(`${error}\n`);
}
process.exitCode = errors.length ? 1 : 0;

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { Glob } from "bun";
import { describe, expect, it } from "bun:test";

import {
  transformClientLocaleSource,
  transformDevSsrLocaleSource,
  transformViteClientLocaleSource,
  transformViteDevSsrLocaleSource,
} from "./client-locale-loader.cjs";

const SCOPE_GLOB = new Glob("src/**/en/index.ts");

describe("client-locale-loader", () => {
  it("rewrites lazy non-English requires into page-language dynamic imports", () => {
    const source = [
      'import { translations as enTranslations } from "./en";',
      "export const scopedTranslation = createScopedTranslation({",
      "  en: enTranslations,",
      '  de: () => require("./de").translations,',
      '  pl: () => require("next-vibe/ui/i18n/pl").translations,',
      '  fr: () => require("./fr").translations,',
      '  it: () => require("./it").translations,',
      '  es: () => require("./es").translations,',
      "});",
    ].join("\n");

    const out = transformClientLocaleSource(source);

    expect(out).not.toContain("require(");
    expect(out).toContain(
      'const __vibeI18n_0 = __vibeI18nLang === "de" ? (await import("./de")).translations : undefined;',
    );
    expect(out).toContain(
      'const __vibeI18n_1 = __vibeI18nLang === "pl" ? (await import("next-vibe/ui/i18n/pl")).translations : undefined;',
    );
    expect(out).toContain('await import("./it")');
    expect(out).toContain('await import("./es")');
    expect(out).toContain("de: () => __vibeI18n_0 ?? {},");
    expect(out).toContain("pl: () => __vibeI18n_1 ?? {},");
    expect(out).toContain(
      'const __vibeI18n_2 = __vibeI18nLang === "fr" ? (await import("./fr")).translations : undefined;',
    );
    expect(out).toContain("fr: () => __vibeI18n_2 ?? {},");
  });

  it("leaves files without the lazy pattern untouched", () => {
    const source = 'export const a = require("./x").value;';
    expect(transformClientLocaleSource(source)).toBe(source);
  });

  it.each([
    "src/_pages/create/i18n/index.ts",
    "src/_pages/layout-i18n/index.ts",
    "src/vibe/core/i18n/shared/index.ts",
  ])("keeps Vite locale loading lazy after an HMR request for %s", (file) => {
    const id = resolve(file);
    const source = readFileSync(id, "utf8");
    const out = transformViteClientLocaleSource(source, id);

    expect(out).not.toContain("require(");
    for (const language of ["de", "pl", "fr", "it", "es", "sk"]) {
      expect(out).toContain(
        `__vibeI18nLang === "${language}" ? (await import("./${language}")).translations : undefined`,
      );
    }
    expect(transformViteClientLocaleSource(source, `${id}?t=123`)).toBe(out);
  });

  it("makes edited locale sources dependencies of the dev SSR transform", () => {
    const out = transformDevSsrLocaleSource(
      'export const locales = { pl: () => require("./pl").translations };',
    );
    expect(out).toBe(
      'import { translations as __vibeSsrI18n_0 } from "./pl";\nexport const locales = { pl: () => __vibeSsrI18n_0 };',
    );
  });

  it.each([
    ["src/_pages/story/framework/i18n/index.ts", "de"],
    ["src/_pages/story/self-host/i18n/index.ts", "de"],
    ["src/user/public/signup/i18n/index.ts", "de"],
    ["src/vibe/agent/ai-stream/stream/i18n/index.ts", "de"],
    ["src/vibe/agent/models/i18n/index.ts", "sk"],
    ["src/vibe/help-tool/i18n/index.ts", "de"],
    ["src/vibe/help-tool/i18n/index.ts", "sk"],
  ])("keeps SSR up to date with locale edits in %s", (file, language) => {
    const id = resolve(file);
    const source = readFileSync(id, "utf8");
    const out = transformViteDevSsrLocaleSource(source, id);
    expect(out).toContain(`from "./${language}"`);
    expect(out).not.toContain("require(");
    expect(transformViteDevSsrLocaleSource(source, `${id}?t=123`)).toBe(out);
    expect(
      transformViteDevSsrLocaleSource(
        source,
        "/repo/src/unrelated/i18n/index.ts",
      ),
    ).toBe(source);
  });

  it("covers every scope in the repo (no non-English left in client bundles)", () => {
    const missed: string[] = [];
    let scopes = 0;
    for (const english of SCOPE_GLOB.scanSync({ cwd: process.cwd() })) {
      const file = join(dirname(dirname(english)), "index.ts");
      if (file.includes("/generated/")) {
        continue;
      }
      const source = readFileSync(file, "utf8");
      if (!/require\(["'][^"']+\/(de|pl)["']\)/.test(source)) {
        continue;
      }
      scopes++;
      if (transformClientLocaleSource(source).includes("require(")) {
        missed.push(file);
      }
    }
    expect(scopes).toBeGreaterThan(100);
    expect(missed).toEqual([]);
  });
});

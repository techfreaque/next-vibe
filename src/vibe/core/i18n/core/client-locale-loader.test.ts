import { readFileSync } from "node:fs";

import { Glob } from "bun";
import { describe, expect, it } from "bun:test";

import { transformClientLocaleSource } from "./client-locale-loader.cjs";

const SCOPE_GLOB = new Glob("src/**/i18n/index.ts");

describe("client-locale-loader", () => {
  it("rewrites lazy de/pl requires into page-language dynamic imports", () => {
    const source = [
      'import { translations as enTranslations } from "./en";',
      "export const scopedTranslation = createScopedTranslation({",
      "  en: enTranslations,",
      '  de: () => require("./de").translations,',
      '  pl: () => require("next-vibe/ui/i18n/pl").translations,',
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
    expect(out).toContain("de: () => __vibeI18n_0 ?? {},");
    expect(out).toContain("pl: () => __vibeI18n_1 ?? {},");
  });

  it("leaves files without the lazy pattern untouched", () => {
    const source = 'export const a = require("./x").value;';
    expect(transformClientLocaleSource(source)).toBe(source);
  });

  it("covers every scope in the repo (no de/pl left in client bundles)", () => {
    const missed: string[] = [];
    let scopes = 0;
    for (const file of SCOPE_GLOB.scanSync({ cwd: process.cwd() })) {
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

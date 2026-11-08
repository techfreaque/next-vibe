/**
 * Unused-i18n-key detection unit tests for vibe deps (mode=unused-i18n).
 */

import { describe, expect, it } from "bun:test";

import {
  collectI18nReferences,
  extractTranslationKeys,
  isI18nKeyReferenced,
} from "./i18n-keys";

const EN = `
import { shared } from "../shared";

export const translations = {
  // comment with "quotes" and { braces }
  title: "Title",
  "quoted-key": 'single {{x}}',
  get: {
    form: {
      label: \`template \${"x"} value\`,
      description:
        "multi-line, with } brace",
    },
    steps: ["a", "b"],
  },
  ...shared,
  enums: { provider: { BRAVE: "Brave", KAGI: "Kagi" } },
  dead: { one: "x", two: "y" },
} as const;
`;

describe("extractTranslationKeys", () => {
  it("collects leaf keys, skipping spreads", () => {
    expect(extractTranslationKeys(EN).map((k) => k.key)).toEqual([
      "title",
      "quoted-key",
      "get.form.label",
      "get.form.description",
      "get.steps",
      "enums.provider.BRAVE",
      "enums.provider.KAGI",
      "dead.one",
      "dead.two",
    ]);
  });

  it("reports 1-based lines", () => {
    const title = extractTranslationKeys(EN).find((k) => k.key === "title");
    expect(title?.line).toBe(6);
  });

  it("returns nothing without a translations export", () => {
    expect(extractTranslationKeys("export const x = { a: 1 };")).toEqual([]);
  });
});

describe("isI18nKeyReferenced", () => {
  const index = collectI18nReferences([
    `t("title"); t('quoted-key'); label: "get.form.label";`,
    "t(`enums.provider.${p}`); t(`dead${n}`);",
    `t("get.steps.0"); helper("get.form");`,
  ]);
  const used = (key: string): boolean => isI18nKeyReferenced(key, index);

  it("matches exact literals", () => {
    expect(used("title")).toBe(true);
    expect(used("quoted-key")).toBe(true);
    expect(used("get.form.label")).toBe(true);
  });

  it("dotted template prefixes protect their subtree", () => {
    expect(used("enums.provider.BRAVE")).toBe(true);
    expect(used("enums.provider.KAGI")).toBe(true);
  });

  it("undotted template prefixes protect nothing", () => {
    expect(used("dead.one")).toBe(false);
    expect(used("dead.two")).toBe(false);
  });

  it("array leaves count when a child index is referenced", () => {
    expect(used("get.steps")).toBe(true);
    const viaPrefix = collectI18nReferences(["t(`math.rows.${i}.spend`);"]);
    expect(isI18nKeyReferenced("math.rows", viaPrefix)).toBe(true);
  });

  it("whole templates with in-segment holes match their own shape", () => {
    const shaped = collectI18nReferences(["t(`what.item${i}Label`);"]);
    expect(isI18nKeyReferenced("what.item0Label", shaped)).toBe(true);
    expect(isI18nKeyReferenced("what.item0Body", shaped)).toBe(false);
    expect(isI18nKeyReferenced("what.title", shaped)).toBe(false);
  });

  it("a dotted ancestor literal protects its subtree", () => {
    expect(used("get.form.description")).toBe(true);
  });
});

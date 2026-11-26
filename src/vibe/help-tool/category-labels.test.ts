import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import { CountryLanguageValues } from "../core/i18n/core/config";
import { categoryLabel, localizedLabel } from "./localized-label";
import { buildCategories } from "./repository/meta-filter";
import { parseSidebarPathFromSearch } from "./sidebar-path";

const locales = Object.values(CountryLanguageValues);
const registry = new Map(CATEGORY_REGISTRY.map((entry) => [entry.key, entry]));

function expectReadable(label: string | undefined, context: string): void {
  expect(typeof label, context).toBe("string");
  expect(label?.trim().length ?? 0, context).toBeGreaterThan(0);
  expect(label, context).not.toContain("[object");
  expect(label, context).not.toContain("undefined");
}

describe("catalog category titles", () => {
  it("renders every local category and subcategory in every locale", () => {
    for (const category of CATEGORY_REGISTRY) {
      for (const locale of locales) {
        expectReadable(
          categoryLabel(category.key, locale, category),
          `${category.key} ${locale}`,
        );
        for (const [subKey, sub] of Object.entries(
          category.subcategories ?? {},
        )) {
          expectReadable(
            localizedLabel(sub.labels, locale) ?? sub.label,
            `${category.key}/${subKey} ${locale}`,
          );
        }
        const heading = category.landing?.heading;
        if (heading) {
          const value = localizedLabel(heading, locale);
          if (value !== undefined) {
            expectReadable(value, `${category.key} heading ${locale}`);
          }
        }
      }
    }
  });

  it("renders every remote capability category as a string title", () => {
    const root = join(
      import.meta.dir,
      "../../generated/remote-capabilities",
    );
    const languages = readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(languages.length).toBeGreaterThan(0);
    for (const language of languages) {
      for (const file of readdirSync(join(root, language))) {
        if (!file.endsWith(".json")) {
          continue;
        }
        const capabilities: { toolName: string; category?: string }[] =
          JSON.parse(readFileSync(join(root, language, file), "utf8"));
        const categories = buildCategories(
          capabilities.map(({ category }) => ({ category })),
        );
        expect(categories.length).toBeGreaterThan(0);
        for (const { name } of categories) {
          const locale =
            locales.find((value) => value.startsWith(`${language}-`)) ??
            locales[0];
          expectReadable(
            categoryLabel(name, locale, registry.get(name)),
            `${language}/${file} ${name}`,
          );
        }
      }
    }
  });
});

describe("catalog sidebar path from the URL", () => {
  it("keeps real category and subcategory keys", () => {
    expect(
      parseSidebarPathFromSearch(
        new URLSearchParams("cat=pos&sub=POS%3A+Orders"),
      ),
    ).toEqual(["pos", "POS: Orders"]);
  });

  it("drops a stringified click event saved in old links", () => {
    expect(
      parseSidebarPathFromSearch(
        new URLSearchParams("catalog=all&cat=%5Bobject+Object%5D&sf=web"),
      ),
    ).toEqual([]);
  });
});

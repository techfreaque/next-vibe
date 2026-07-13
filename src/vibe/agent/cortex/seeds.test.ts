/**
 * Cortex seeds registry unit tests
 *
 * Tests the locale-aware template registry without a live DB.
 * Verifies:
 * - All 3 locales produce 16 memory templates + 5 document templates
 * - Each locale uses its own translated paths and content
 * - No duplicate IDs or paths within a locale
 * - All templates have non-empty content
 * - seedOnlyNew on memory templates, updateIfUnchanged on document templates
 */

import { describe, expect, it } from "vitest";

import {
  getAllTemplates,
  getDefaultDocumentDirs,
  getDefaultMemoryDirs,
  getDocumentTemplates,
  getLocaleRoots,
  getMemoryTemplates,
} from "./seeds/templates";

const LOCALES = ["en-US", "de-DE", "pl-PL"] as const;

for (const locale of LOCALES) {
  describe(`Template registry [${locale}]`, () => {
    const memoryTemplates = getMemoryTemplates(locale);
    const docTemplates = getDocumentTemplates(locale);
    const allTemplates = getAllTemplates(locale);

    it("has exactly 16 memory templates", () => {
      expect(memoryTemplates.length).toBe(16);
    });

    it("has exactly 5 document templates", () => {
      expect(docTemplates.length).toBe(5);
    });

    it("getAllTemplates returns 21 total", () => {
      expect(allTemplates.length).toBe(21);
    });

    it("has no duplicate IDs", () => {
      const ids = allTemplates.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has no duplicate paths", () => {
      const paths = allTemplates.map((s) => s.path);
      expect(new Set(paths).size).toBe(paths.length);
    });

    it("all templates have non-empty content", () => {
      for (const item of allTemplates) {
        expect(item.content.trim().length).toBeGreaterThan(0);
      }
    });

    it("all memory templates use seedOnlyNew", () => {
      for (const item of memoryTemplates) {
        expect(item.seedOnlyNew).toBe(true);
        expect(item.updateIfUnchanged).toBeFalsy();
      }
    });

    it("all document templates use updateIfUnchanged", () => {
      for (const item of docTemplates) {
        expect(item.updateIfUnchanged).toBe(true);
        expect(item.seedOnlyNew).toBeFalsy();
      }
    });

    it("all paths use CANONICAL roots (paths match DB storage; only content is localized)", () => {
      // Template paths are stored canonically (/memories, /documents) to match
      // the DB; getLocaleRoots() is only for display. Content is translated.
      for (const item of memoryTemplates) {
        expect(item.path.startsWith("/memories/")).toBe(true);
      }
      for (const item of docTemplates) {
        expect(item.path.startsWith("/documents/")).toBe(true);
      }
    });

    it("all paths end with .md", () => {
      for (const item of allTemplates) {
        expect(item.path).toMatch(/\.md$/);
      }
    });
  });
}

describe("Locale roots", () => {
  it("en-US uses English roots", () => {
    const roots = getLocaleRoots("en-US");
    expect(roots.memories).toBe("/memories");
    expect(roots.documents).toBe("/documents");
  });

  it("de-DE uses German roots", () => {
    const roots = getLocaleRoots("de-DE");
    expect(roots.memories).toBe("/erinnerungen");
    expect(roots.documents).toBe("/dokumente");
  });

  it("pl-PL uses Polish roots", () => {
    const roots = getLocaleRoots("pl-PL");
    expect(roots.memories).toBe("/wspomnienia");
    expect(roots.documents).toBe("/dokumenty");
  });
});

describe("Locale content isolation (paths canonical, content translated)", () => {
  it("EN and DE memory templates SHARE canonical paths but DIFFER in content", () => {
    const en = getMemoryTemplates("en-US");
    const de = getMemoryTemplates("de-DE");
    const enPaths = en.map((item) => item.path).toSorted();
    const dePaths = de.map((item) => item.path).toSorted();
    // Same canonical paths across locales (DB storage is canonical).
    expect(dePaths).toEqual(enPaths);
    // But the translated content differs for at least one template.
    const enById = new Map(en.map((item) => [item.id, item.content]));
    const anyContentDiffers = de.some(
      (item) => enById.get(item.id) !== item.content,
    );
    expect(anyContentDiffers).toBe(true);
  });

  it("EN and PL memory templates SHARE canonical paths but DIFFER in content", () => {
    const en = getMemoryTemplates("en-US");
    const pl = getMemoryTemplates("pl-PL");
    expect(pl.map((item) => item.path).toSorted()).toEqual(
      en.map((item) => item.path).toSorted(),
    );
    const enById = new Map(en.map((item) => [item.id, item.content]));
    const anyContentDiffers = pl.some(
      (item) => enById.get(item.id) !== item.content,
    );
    expect(anyContentDiffers).toBe(true);
  });
});

describe("Default document dirs", () => {
  for (const locale of LOCALES) {
    it(`[${locale}] has exactly 5 default document dirs`, () => {
      expect(getDefaultDocumentDirs(locale).length).toBe(5);
    });

    it(`[${locale}] all dirs have path, purpose, icon, viewType`, () => {
      for (const dir of getDefaultDocumentDirs(locale)) {
        expect(dir.path.length).toBeGreaterThan(1);
        expect(dir.purpose.length).toBeGreaterThan(0);
        expect(dir.icon.length).toBeGreaterThan(0);
        expect(dir.viewType.length).toBeGreaterThan(0);
      }
    });
  }
});

describe("Default memory dirs", () => {
  for (const locale of LOCALES) {
    it(`[${locale}] has exactly 4 default memory dirs`, () => {
      expect(getDefaultMemoryDirs(locale).length).toBe(4);
    });

    it(`[${locale}] all dirs have dirPath and purpose`, () => {
      for (const dir of getDefaultMemoryDirs(locale)) {
        expect(dir.dirPath.length).toBeGreaterThan(1);
        expect(dir.purpose.length).toBeGreaterThan(0);
      }
    });
  }
});

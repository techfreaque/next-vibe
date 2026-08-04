/**
 * Category Index Generator (domain-co-located).
 *
 * Scans all category.ts files and generates src/generated/categories/registry.ts —
 * CATEGORY_REGISTRY (sorted by group+order) + ADMIN_GROUPS + GROUP_LABELS. Consumed
 * by system/core/definition/create.ts. Byte-identical to the former
 * tooling/generators/category-index. Category file list comes from the shared context;
 * each category.ts is imported here to read its values.
 */

import "server-only";

import { readFileSync } from "node:fs";
import { basename } from "node:path";

import { GENERATED_DIR, VIBE_DIR } from "@/env/paths";

import type {
  CategoryDefinition,
  SubcategoryDefinition,
} from "../../../help-tool/category-types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import type {
  GeneratorContext,
  GeneratorResult,
} from "../../generators/shared/shared-inputs";
import {
  generateFileHeader,
  getRelativeImportPath,
  jsonToTs,
  toImportUrl,
  writeGeneratedFile,
} from "../../generators/shared/utils";
import { parseError } from "../../utils/parse-error";

const OUTPUT_FILE = `${GENERATED_DIR}/categories/registry.ts`;

/**
 * Where the category types actually live. The emitted import resolves from the
 * generated file's directory, not this one — a hand-written "../../../help-tool/
 * category-types" was computed against this generator (where it is correct, see
 * the type-only import above) and pointed outside src/ entirely.
 */
const CATEGORY_TYPES_MODULE = `${VIBE_DIR}/help-tool/category-types.ts`;

interface CategoryEntry {
  exportName: string;
  absPath: string;
  def: CategoryDefinition;
}

async function extractCategories(
  categoryFiles: string[],
  logger: GeneratorContext["logger"],
): Promise<CategoryEntry[]> {
  const entries: CategoryEntry[] = [];

  for (const catFile of categoryFiles) {
    try {
      const content = readFileSync(catFile, "utf-8");
      const exportMatch =
        /export const (category)\s*:\s*CategoryDefinition/.exec(content);
      if (!exportMatch) {
        logger.warn(
          `category.ts at ${basename(catFile)} does not export 'category: CategoryDefinition' — skipping`,
        );
        continue;
      }

      const mod = (await import(
        /* @vite-ignore */
        toImportUrl(catFile)
      )) as Record<string, CategoryDefinition>;
      const def = mod["category"];

      if (!def?.key || !def.group || !def.icon) {
        logger.warn(
          `category.ts at ${catFile} has missing required fields (key, group, icon) — skipping`,
        );
        continue;
      }

      entries.push({ exportName: "category", absPath: catFile, def });
    } catch (error) {
      logger.warn(
        `Could not read category.ts at ${catFile}: ${parseError(error).message}`,
      );
    }
  }

  return entries.toSorted((a, b) => {
    if (a.def.group !== b.def.group) {
      return a.def.group.localeCompare(b.def.group);
    }
    return (a.def.order ?? 99) - (b.def.order ?? 99);
  });
}

function generateContent(
  categories: CategoryEntry[],
  outputFile: string,
): string {
  const header = generateFileHeader(
    "AUTO-GENERATED CATEGORY REGISTRY",
    "generators/category-index",
    {
      "Categories found": categories.length,
      Groups: [...new Set(categories.map((c) => c.def.group))].join(", "),
    },
  );

  const keys = categories.map((c) => c.def.key);
  const keyUnionSingle = keys.map((k) => `"${k}"`).join(" | ");
  // keyUnion: either " value1 | value2" (inline) or "\n  | v1\n  | v2" (expanded).
  // With NO categories the join yields "", which would emit the syntactically
  // invalid `export type CategoryKey = ;` — every consumer of the generated file
  // then fails to parse. With zero categories there is no registry to constrain against, so `string`
  // (accept any) is the right contract — `never` would reject every definition.
  const keyUnion =
    keys.length === 0
      ? " string"
      : `export type CategoryKey = ${keyUnionSingle};`.length <= 80
        ? ` ${keyUnionSingle}`
        : `\n  | ${keys.map((k) => `"${k}"`).join("\n  | ")}`;

  const subKeys = new Set<string>();
  for (const c of categories) {
    if (c.def.subcategories) {
      for (const k of Object.keys(c.def.subcategories)) {
        subKeys.add(k);
      }
    }
  }
  const subKeysSorted = [...subKeys];
  const subKeyUnionSingle = subKeysSorted.map((k) => `"${k}"`).join(" | ");
  // Same empty-union guard as CategoryKey above.
  const subKeyUnion =
    subKeysSorted.length === 0
      ? " string"
      : `export type SubCategoryKey = ${subKeyUnionSingle};`.length <= 80
        ? ` ${subKeyUnionSingle}`
        : `\n  | ${subKeysSorted.map((k) => `"${k}"`).join("\n  | ")}`;

  const registryEntries = categories
    .map((c) => {
      const { key, label, group, icon, order, defaultEntry, subcategories } =
        c.def;

      const labelRecord = typeof label === "object" ? label : {};
      const labelsJson = jsonToTs(labelRecord, 2, "    labels: ".length);
      const labelFallback =
        typeof label === "string"
          ? label
          : (labelRecord["en-US"] ?? labelRecord["en-GLOBAL"] ?? key);

      const defaultEntryAlias =
        typeof defaultEntry === "object" && defaultEntry !== null
          ? defaultEntry[UserPermissionRole.ADMIN]
          : defaultEntry;

      const subcatLines = subcategories
        ? Object.entries(subcategories)
            .toSorted(
              (a, b) =>
                ((a[1] as SubcategoryDefinition).order ?? 0) -
                ((b[1] as SubcategoryDefinition).order ?? 0),
            )
            .map(([k, v]) => {
              const sv = v as SubcategoryDefinition;
              const subcatLabelRecord =
                typeof sv.label === "object" ? sv.label : {};
              const subcatLabelFallback =
                typeof sv.label === "string"
                  ? sv.label
                  : (subcatLabelRecord["en-US"] ??
                    subcatLabelRecord["en-GLOBAL"] ??
                    k);
              const needsQuotes = /[^a-zA-Z0-9_$]/.test(k);
              const subcatKey = needsQuotes ? JSON.stringify(k) : k;
              // labels indented at level 4 (8 spaces), prefix = "        labels: " = 16 chars
              const subcatLabelsJson = jsonToTs(
                subcatLabelRecord,
                4,
                "        labels: ".length,
              );
              return `      ${subcatKey}: {\n        icon: "${sv.icon}",\n        order: ${sv.order ?? 0},\n        label: "${subcatLabelFallback}",\n        labels: ${subcatLabelsJson},\n      },`;
            })
            .join("\n")
        : null;

      const subcatBlock = subcatLines
        ? `\n    subcategories: {\n${subcatLines}\n    },`
        : "";

      const defaultEntryPart = defaultEntryAlias
        ? `\n    defaultEntryAlias: "${String(defaultEntryAlias)}",`
        : "";

      return `  {\n    key: "${key}",\n    label: "${labelFallback}",\n    labels: ${labelsJson},\n    group: "${group}",\n    icon: "${icon}",\n    order: ${order ?? 99},${defaultEntryPart}${subcatBlock}\n  },`;
    })
    .join("\n");

  return `${header}

/* eslint-disable prettier/prettier */

import type {
  AdminGroup,
  CategoryDefinitionSerialized,
} from "${getRelativeImportPath(CATEGORY_TYPES_MODULE, outputFile)}";

export type CategoryKey =${keyUnion};

export type SubCategoryKey =${subKeyUnion};

export const CATEGORY_REGISTRY: CategoryDefinitionSerialized[] = [
${registryEntries}
];

export const ADMIN_GROUPS: AdminGroup[] = [
  "ai",
  "analytics",
  "business",
  "system",
  "comms",
  "platform",
];

export const GROUP_LABELS: Record<AdminGroup, string> = {
  ai: "AI",
  analytics: "Analytics",
  business: "Business",
  system: "System",
  comms: "Comms",
  platform: "Platform",
};
`;
}

/** Generate the category registry. Consumes shared category file list; writes one file. */
export async function generateCategoryIndex(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const categories = await extractCategories(ctx.files.category, ctx.logger);
  const content = generateContent(categories, OUTPUT_FILE);
  await writeGeneratedFile(OUTPUT_FILE, content);

  return {
    summary: `category registry (${categories.length} categories)`,
    counts: { categories: categories.length },
  };
}

/**
 * Category Index Generator Repository
 *
 * Scans all category.ts files under src/app/api/[locale]/ and generates
 * a static category-registry.ts that the admin sidebar widget can import.
 *
 * Each category.ts must export a `category: CategoryDefinition` constant.
 * The generated file exports CATEGORY_REGISTRY (array, sorted by group+order)
 * and GROUP_LABELS for sidebar super-group display.
 */

import "server-only";

import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  CategoryDefinition,
  SubcategoryDefinition,
} from "@/app/api/[locale]/system/help/category-types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsCategoryIndexT } from "./i18n";

interface CategoryIndexRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface CategoryIndexResponseType {
  success: boolean;
  message: string;
  categoriesFound: number;
  duration: number;
  outputFile?: string;
}

/** A discovered and validated category entry */
interface CategoryEntry {
  /** The exported variable name, e.g. "category" */
  exportName: string;
  /** Absolute filesystem path to category.ts */
  absPath: string;
  /** The parsed CategoryDefinition (defaultEntry is already a string alias) */
  def: CategoryDefinition;
}

export class CategoryIndexGeneratorRepository {
  static async generateCategoryIndex(
    data: CategoryIndexRequestType,
    logger: EndpointLogger,
    t: GeneratorsCategoryIndexT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<CategoryIndexResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting category index generation: ${data.outputFile}`);

      // ── 1. Discover category.ts files ──────────────────────────────────────
      void liveIndex; // category files are not tracked in LiveIndex, always scan
      const apiDir = join(process.cwd(), "src", "app", "api", "[locale]");
      const categoryFiles = findFilesRecursively(apiDir, "category.ts");
      logger.debug(`Found ${categoryFiles.length} category.ts files`);

      // ── 2. Parse each category.ts ──────────────────────────────────────────
      const categories =
        await CategoryIndexGeneratorRepository.extractCategories(
          categoryFiles,
          logger,
        );

      logger.debug(
        `Extracted ${categories.length} categories: ${categories.map((c) => c.def.key).join(", ")}`,
      );

      // ── 3. Generate file content ────────────────────────────────────────────
      const content =
        CategoryIndexGeneratorRepository.generateContent(categories);

      // ── 4. Write file ───────────────────────────────────────────────────────
      await writeGeneratedFile(data.outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated category index with ${formatCount(categories.length, "category", "categories")} in ${formatDuration(duration)}`,
          "📂",
        ),
      );

      return success({
        success: true,
        message: t("post.success.title"),
        categoriesFound: categories.length,
        duration,
        outputFile: data.dryRun ? undefined : data.outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Category index generation failed", {
        error: parseError(error),
      });
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
          duration,
        },
      });
    }
  }

  private static async extractCategories(
    categoryFiles: string[],
    logger: EndpointLogger,
  ): Promise<CategoryEntry[]> {
    const entries: CategoryEntry[] = [];

    for (const catFile of categoryFiles) {
      try {
        // Quick check: must export `category`
        const content = readFileSync(catFile, "utf-8");
        const exportMatch =
          /export const (category)\s*:\s*CategoryDefinition/.exec(content);
        if (!exportMatch) {
          logger.warn(
            `category.ts at ${basename(catFile)} does not export 'category: CategoryDefinition' — skipping`,
          );
          continue;
        }

        // Import the module to get actual values (handles constants, imports)
        const mod = (await import(catFile)) as Record<
          string,
          CategoryDefinition
        >;
        const def = mod["category"];

        if (!def?.key || !def.group || !def.icon) {
          logger.warn(
            `category.ts at ${catFile} has missing required fields (key, group, icon) — skipping`,
          );
          continue;
        }

        entries.push({
          exportName: "category",
          absPath: catFile,
          def,
        });
      } catch (error) {
        logger.warn(
          `Could not read category.ts at ${catFile}: ${parseError(error).message}`,
        );
      }
    }

    // Sort: by group alphabetically, then by order within group
    return entries.toSorted((a, b) => {
      if (a.def.group !== b.def.group) {
        return a.def.group.localeCompare(b.def.group);
      }
      return (a.def.order ?? 99) - (b.def.order ?? 99);
    });
  }

  private static generateContent(categories: CategoryEntry[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED CATEGORY REGISTRY",
      "generators/category-index",
      {
        "Categories found": categories.length,
        Groups: [...new Set(categories.map((c) => c.def.group))].join(", "),
      },
    );

    // Generate CategoryKey union type from all registered keys
    const keys = categories.map((c) => c.def.key);
    const keyUnion = keys.map((k) => `"${k}"`).join(" | ");

    // Generate SubCategoryKey union type from all unique subcategory keys
    const subKeys = new Set<string>();
    for (const c of categories) {
      if (c.def.subcategories) {
        for (const k of Object.keys(c.def.subcategories)) {
          subKeys.add(k);
        }
      }
    }
    const subKeyUnion = [...subKeys].map((k) => `"${k}"`).join(" | ");

    // Build the registry array as a TypeScript literal (no imports needed for data)
    const registryEntries = categories
      .map((c) => {
        const { key, label, group, icon, order, defaultEntry, subcategories } =
          c.def;

        const labelRecord = typeof label === "object" ? label : {};
        const labelsJson = JSON.stringify(labelRecord);
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
                const subcatLabelsJson = JSON.stringify(subcatLabelRecord);

                return `      ${JSON.stringify(k)}: { icon: "${sv.icon}", order: ${sv.order ?? 0}, label: "${subcatLabelFallback}", labels: ${subcatLabelsJson} },`;
              })
              .join("\n")
          : null;

        const subcatBlock = subcatLines
          ? `\n    subcategories: {\n${subcatLines}\n    },`
          : "";

        const defaultEntryPart = defaultEntryAlias
          ? `\n    defaultEntryAlias: "${defaultEntryAlias}",`
          : "";

        return `  {\n    key: "${key}",\n    label: "${labelFallback}",\n    labels: ${labelsJson},\n    group: "${group}",\n    icon: "${icon}",\n    order: ${order ?? 99},${defaultEntryPart}${subcatBlock}\n  },`;
      })
      .join("\n");

    // Import the serialized type only
    return `${header}

/* eslint-disable prettier/prettier */

import type { CategoryDefinitionSerialized, AdminGroup } from "@/app/api/[locale]/system/help/category-types";

export type CategoryKey = ${keyUnion};

export type SubCategoryKey = ${subKeyUnion};

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
}

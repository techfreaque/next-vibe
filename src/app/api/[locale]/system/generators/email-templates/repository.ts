/**
 * Email Template Generator Repository
 * Generates registry/generated.ts with lazy-loaded email template imports
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
  formatWarning,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type {
  EmailTemplateDefinitionAny,
  TemplateCachedMetadata,
} from "@/app/api/[locale]/messenger/registry/template";
import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsEmailTemplatesT } from "./i18n";

// Type definitions
interface EmailTemplateRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface EmailTemplateResponseType {
  success: boolean;
  message: string;
  templatesFound: number;
  duration: number;
  outputFile?: string;
  clientOutputFile?: string;
}

interface TemplateInfo {
  id: string;
  importPath: string;
  /** The export name within the module (e.g. "default", "adminContactFormTemplate") */
  exportName: string;
  metadata: TemplateCachedMetadata<string>;
}

/**
 * Email Template Generator Repository Implementation
 */
export class EmailTemplateGeneratorRepository {
  static async generateEmailTemplates(
    data: EmailTemplateRequestType,
    logger: EndpointLogger,
    t: GeneratorsEmailTemplatesT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<EmailTemplateResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting email template generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let templateFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        templateFiles = [...liveIndex.emailFiles];
      } else {
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug(`Discovering email template files in: ${startDir}`);

        // Find both email.tsx and *.email.tsx files recursively
        const emailTsxFiles = findFilesRecursively(startDir, "email.tsx");
        const emailDotTsxFiles = findFilesRecursively(
          startDir,
          ".email.tsx",
        ).filter((file) => !file.endsWith("/email.tsx"));

        templateFiles = [...emailTsxFiles, ...emailDotTsxFiles];
      }

      logger.debug(`Found ${templateFiles.length} template files`);

      if (templateFiles.length === 0) {
        logger.warn(formatWarning("No email templates found"));
        return success({
          success: true,
          message: "No email templates found",
          templatesFound: 0,
          duration: Date.now() - startTime,
        });
      }

      // Load templates and extract metadata
      const templates = await EmailTemplateGeneratorRepository.loadTemplates(
        templateFiles,
        logger,
      );

      logger.debug(`Loaded ${templates.length} valid templates`);

      // Generate server-side content (full templates with adapters)
      const serverContent =
        EmailTemplateGeneratorRepository.generateServerContent(templates);

      // Generate client-safe content (components only, no server-only imports)
      const clientContent =
        EmailTemplateGeneratorRepository.generateClientContent(templates);

      // Calculate client output file path
      const clientOutputFile = outputFile.replace(/\.ts$/, ".client.ts");

      // Write both files
      await writeGeneratedFile(outputFile, serverContent, data.dryRun);
      await writeGeneratedFile(clientOutputFile, clientContent, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated email template registry (server + client) with ${formatCount(templates.length, "template")} in ${formatDuration(duration)}`,
          "📧",
        ),
      );

      return success({
        success: true,
        message: t("success.generated"),
        templatesFound: templates.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
        clientOutputFile: data.dryRun ? undefined : clientOutputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Email template generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Check if an export value is an EmailTemplateDefinition (duck-typing).
   * Required fields: meta.id, meta.version, meta.name, meta.description,
   * meta.category, meta.path, meta.defaultSubject, schema, component, exampleProps
   */
  private static isTemplateDef(
    value: EmailTemplateDefinitionAny | null,
    exportName: string,
    file: string,
    logger: EndpointLogger,
  ): value is EmailTemplateDefinitionAny {
    if (!value || typeof value !== "object") {
      return false;
    }

    // Quick rejection: no meta at all → not a template
    if (!value.meta || typeof value.meta !== "object") {
      return false;
    }

    const meta: Partial<EmailTemplateDefinitionAny["meta"]> = value.meta;

    // Check all required fields and collect missing ones for warnings
    const missingFields: string[] = [];
    const requiredMetaFields = [
      "id",
      "version",
      "name",
      "description",
      "category",
      "path",
      "defaultSubject",
    ] as const;
    for (const field of requiredMetaFields) {
      if (!meta[field]) {
        missingFields.push(`meta.${field}`);
      }
    }
    if (!value.schema) {
      missingFields.push("schema");
    }
    if (typeof value.component !== "function") {
      missingFields.push("component");
    }
    if (!value.exampleProps || typeof value.exampleProps !== "object") {
      missingFields.push("exampleProps");
    }
    if (!value.scopedTranslation) {
      missingFields.push("scopedTranslation");
    }

    if (missingFields.length > 0) {
      logger.warn(
        formatWarning(
          `Export "${exportName}" in ${file} looks like a template but is missing: ${missingFields.join(", ")}`,
        ),
      );
      return false;
    }

    return true;
  }

  /**
   * Load templates and extract metadata.
   *
   * Enforced format: email.tsx files MUST export named consts ending in
   * "EmailTemplate" (e.g. contactFormEmailTemplate). No default export allowed.
   * Any other exports are warned and ignored.
   */
  private static async loadTemplates(
    templateFiles: string[],
    logger: EndpointLogger,
  ): Promise<TemplateInfo[]> {
    const templates: TemplateInfo[] = [];
    const seenIds = new Set<string>();

    for (const file of templateFiles) {
      try {
        const templateModule = await import(file);

        const nestedPath = file
          .replace(process.cwd(), "")
          .replace(/^\//, "")
          .replace(/^src\/app\/api\/\[locale\]\//, "")
          .replace(/\/email\.tsx$/, "")
          .replace(/\/.+\.email\.tsx$/, "");
        const importPath = `@/app/api/[locale]/${nestedPath}/email`;

        const allExports = Object.entries(
          templateModule as Record<string, EmailTemplateDefinitionAny | null>,
        );

        // Warn on default export - not allowed
        if ("default" in templateModule) {
          logger.warn(
            formatWarning(
              `${nestedPath}/email.tsx has a default export - not allowed. Use named exports ending in "EmailTemplate" instead. Default export ignored.`,
            ),
          );
        }

        // Warn on named exports that look like template definitions but don't follow the naming convention
        for (const [name, value] of allExports) {
          if (
            name !== "default" &&
            !name.endsWith("EmailTemplate") &&
            value &&
            typeof value === "object" &&
            "meta" in value &&
            value.meta &&
            typeof value.meta === "object"
          ) {
            logger.warn(
              formatWarning(
                `${nestedPath}/email.tsx exports "${name}" which looks like an EmailTemplateDefinition but does not end in "EmailTemplate" - rename it to "${name}EmailTemplate".`,
              ),
            );
          }
        }

        // Only process exports ending in "EmailTemplate"
        const templateExports = allExports.filter(([name]) =>
          name.endsWith("EmailTemplate"),
        );

        let fileTemplateCount = 0;

        for (const [exportName, value] of templateExports) {
          if (
            !EmailTemplateGeneratorRepository.isTemplateDef(
              value,
              exportName,
              file,
              logger,
            )
          ) {
            continue;
          }

          const templateDef = value;
          const id = templateDef.meta.id;

          if (seenIds.has(id)) {
            logger.warn(
              formatWarning(
                `Duplicate template id "${id}" in ${nestedPath}/email.tsx (export: ${exportName}) - skipping`,
              ),
            );
            continue;
          }
          seenIds.add(id);
          fileTemplateCount++;

          // Validate exampleProps - only string | number | boolean allowed
          const rawProps = templateDef.exampleProps ?? {};
          const validProps: Record<string, string | number | boolean> = {};
          for (const [k, v] of Object.entries(rawProps)) {
            if (
              typeof v === "string" ||
              typeof v === "number" ||
              typeof v === "boolean"
            ) {
              validProps[k] = v;
            } else {
              logger.warn(
                formatWarning(
                  `${nestedPath}/email.tsx "${exportName}" exampleProps.${k} has invalid type "${v === null ? "null" : typeof v}" - must be string | number | boolean. Field skipped.`,
                ),
              );
            }
          }

          templates.push({
            id,
            importPath,
            exportName,
            metadata: {
              id,
              version: templateDef.meta.version,
              // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- meta fields are string keys; any/unknown from EmailTemplateDefinitionAny
              name: templateDef.meta.name as string,
              // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- meta fields are string keys; any/unknown from EmailTemplateDefinitionAny
              description: templateDef.meta.description as string,
              // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- meta fields are string keys; any/unknown from EmailTemplateDefinitionAny
              category: templateDef.meta.category as string,
              path: file.replace(process.cwd(), ""),
              exampleProps: validProps,
            },
          });
        }

        if (fileTemplateCount === 0) {
          logger.warn(
            formatWarning(
              `${nestedPath}/email.tsx has no exports ending in "EmailTemplate" - no templates registered from this file.`,
            ),
          );
        } else {
          logger.debug(
            `Found ${fileTemplateCount} template(s) in ${nestedPath}/email`,
          );
        }
      } catch (error) {
        logger.warn(
          formatWarning(
            `Failed to load template: ${file}\n    ${parseError(error)}`,
          ),
        );
      }
    }

    return templates;
  }

  /**
   * Generate server-side registry content with lazy imports and metadata cache
   */
  private static generateServerContent(templates: TemplateInfo[]): string {
    // Sort templates by ID for consistent output order
    const templatesById = templates.toSorted((a, b) =>
      a.id.localeCompare(b.id),
    );

    // All loaders return EmailTemplateDefinition - no per-template type imports needed

    // Generate template loaders (with trailing commas) - sorted by ID
    const loaderEntries = templatesById
      .map((t) => {
        // Build the accessor: .default for default export, [exportName] for named
        const accessor =
          t.exportName === "default" ? ".default" : `["${t.exportName}"]`;
        // Cast to EmailTemplateDefinitionAny - TScopedTranslation is invariant so
        // concrete templates can't assign to the any-typed loader type without a cast.
        const cast = " as EmailTemplateDefinitionAny";
        const singleLine = `  "${t.id}": async () => (await import("${t.importPath}"))${accessor}${cast},`;
        // Wrap long lines (80+ chars, prettier printWidth)
        if (singleLine.length >= 80) {
          // Check if even the split version is too long
          const splitLine = `    (await import("${t.importPath}"))${accessor}${cast},`;
          if (splitLine.length > 80) {
            // eslint-disable-next-line i18next/no-literal-string
            return `  "${t.id}": async () =>\n    (\n      await import("${t.importPath}")\n    )${accessor}${cast},`;
          }
          // eslint-disable-next-line i18next/no-literal-string
          return `  "${t.id}": async () =>\n    (await import("${t.importPath}"))${accessor}${cast},`;
        }
        return singleLine;
      })
      .join("\n");

    // Generate metadata map - sorted by ID
    const metadataEntries = templatesById
      .map((t) => {
        // Format exampleProps: check line length for single line format
        const propsKeys = Object.keys(t.metadata.exampleProps || {});
        let examplePropsStr: string;
        if (propsKeys.length > 0) {
          // Try single line first
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join(", ");
          const singleLinePropFormat = `{ ${entries} }`;
          const examplePropsLineLength =
            `    exampleProps: ${singleLinePropFormat},`.length;

          if (examplePropsLineLength > 80) {
            // Multiline: each property on its own line (with trailing commas)
            const multilineEntries = Object.entries(t.metadata.exampleProps)
              .map(([k, v]) => {
                const valueStr = JSON.stringify(v);
                // Check if this single property line would be too long
                const propLine = `      ${k}: ${valueStr},`;
                if (propLine.length > 80) {
                  // Wrap the value on next line if it's a string
                  if (typeof v === "string") {
                    // eslint-disable-next-line i18next/no-literal-string
                    return `      ${k}:\n        ${valueStr},`;
                  }
                }
                return propLine;
              })
              .join("\n");
            examplePropsStr = `{\n${multilineEntries}\n    }`;
          } else {
            examplePropsStr = singleLinePropFormat;
          }
        } else {
          examplePropsStr = "{}";
        }

        // Check if description line would be too long (>80 chars)
        const descriptionLine = `    description: "${t.metadata.description}",`;
        let descriptionStr = descriptionLine;
        if (descriptionLine.length > 80) {
          // eslint-disable-next-line i18next/no-literal-string
          descriptionStr = `    description:\n      "${t.metadata.description}",`;
        }

        // eslint-disable-next-line i18next/no-literal-string
        return `  "${t.id}": {
    id: "${t.metadata.id}",
    version: "${t.metadata.version}",
    name: "${t.metadata.name}",
${descriptionStr}
    category: "${t.metadata.category}",
    path: "${t.metadata.path}",
    exampleProps: ${examplePropsStr},
  },`;
      })
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/email-templates";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Templates found": templates.length,
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import type { CountryLanguage } from "@/i18n/core/config";

import type {
  EmailTemplateDefinitionAny,
  TemplateCachedMetadata,
  TranslatedPreviewFieldConfig,
} from "./template";

/**
 * Lazy-loaded template registry with dynamic imports
 */
const templateLoaders: Record<string, () => Promise<EmailTemplateDefinitionAny>> = {
${loaderEntries}
};

/**
 * Template metadata cache for fast lookups
 * Contains only metadata (id, version, name, description, category)
 * Actual components are lazy-loaded
 */
export const templateMetadataMap: Record<
  string,
  TemplateCachedMetadata<string>
> = {
${metadataEntries}
};

/**
 * Get template by ID (lazy loads on first access)
 * Returns the template with its specific props type
 */
export async function getTemplate(
  id: string,
): Promise<EmailTemplateDefinitionAny | undefined> {
  const loader = templateLoaders[id];
  if (!loader) {
    return undefined;
  }

  return await loader();
}

/**
 * Get template metadata without loading the component
 */
export function getTemplateMetadata(
  id: string,
): TemplateCachedMetadata<string> | undefined {
  return templateMetadataMap[id];
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds(): string[] {
  return Object.keys(templateLoaders);
}

/**
 * Get all template metadata (fast, no component loading)
 */
export function getAllTemplateMetadata(): TemplateCachedMetadata<string>[] {
  return Object.values(templateMetadataMap);
}

/**
 * Get templates by category (metadata only)
 */
export function getTemplatesByCategory(
  category: string,
): TemplateCachedMetadata<string>[] {
  return getAllTemplateMetadata().filter((t) => t.category === category);
}

/**
 * Check if template exists
 */
export function hasTemplate(id: string): boolean {
  return id in templateLoaders;
}

/**
 * Translate template metadata using the template's own scopedT.
 * Returns plain strings instead of translation keys.
 */
export async function getTranslatedTemplateMetadata(
  id: string,
  locale: CountryLanguage,
): Promise<
  | (Omit<
      TemplateCachedMetadata<string>,
      "name" | "description" | "category"
    > & {
      name: string;
      description: string;
      category: string;
    })
  | undefined
> {
  const template = await getTemplate(id);
  if (!template) {
    return undefined;
  }
  const cached = templateMetadataMap[id];
  if (!cached) {
    return undefined;
  }
  const { t } = template.scopedTranslation.scopedT(locale);
  return {
    ...cached,
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
    name: t(template.meta.name as never),
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
    description: t(template.meta.description as never),
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
    category: t(template.meta.category as never),
  };
}

/**
 * Translate preview fields using the template's own scopedT.
 * Returns configs with plain label/description strings.
 */
export function translatePreviewFields(
  template: EmailTemplateDefinitionAny,
  locale: CountryLanguage,
): Record<string, TranslatedPreviewFieldConfig> | undefined {
  const fields = template.meta.previewFields;
  if (!fields) {
    return undefined;
  }
  const { t } = template.scopedTranslation.scopedT(locale);
  const result: Record<string, TranslatedPreviewFieldConfig> = {};
  for (const [key, field] of Object.entries(fields)) {
    result[key] = {
      ...field,
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
      label: t(field.label as never),
      description: field.description
        ? // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
          t(field.description as never)
        : undefined,
      options: field.options?.map((opt) => ({
        value: opt.value,
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- sealed dispatch: keys come from the same template's own translation scope
        label: t(opt.label as never),
      })),
    };
  }
  return result;
}

/**
 * Load all templates and return translated metadata for each.
 */
export async function getAllTranslatedTemplateMetadata(
  locale: CountryLanguage,
): Promise<
  Array<
    Omit<
      TemplateCachedMetadata<string>,
      "name" | "description" | "category"
    > & {
      name: string;
      description: string;
      category: string;
    }
  >
> {
  const ids = getAllTemplateIds();
  const results = await Promise.all(
    ids.map((id) => getTranslatedTemplateMetadata(id, locale)),
  );
  return results.filter((r): r is NonNullable<typeof r> => r !== undefined);
}
`;
  }

  /**
   * Generate client-safe registry content without server-only imports
   * Only includes template components and metadata for preview purposes
   */
  private static generateClientContent(templates: TemplateInfo[]): string {
    // Sort templates by ID for consistent output
    const templatesById = templates.toSorted((a, b) =>
      a.id.localeCompare(b.id),
    );

    // Generate metadata map (same as server version)
    const metadataEntries = templatesById
      .map((t) => {
        // Format exampleProps: check line length for single line format
        const propsKeys = Object.keys(t.metadata.exampleProps || {});
        let examplePropsStr: string;
        if (propsKeys.length > 0) {
          // Try single line first
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join(", ");
          const singleLinePropFormat = `{ ${entries} }`;
          const examplePropsLineLength =
            `    exampleProps: ${singleLinePropFormat},`.length;

          if (examplePropsLineLength > 80) {
            // Multiline: each property on its own line (with trailing commas)
            const multilineEntries = Object.entries(t.metadata.exampleProps)
              .map(([k, v]) => {
                const valueStr = JSON.stringify(v);
                // Check if this single property line would be too long
                const propLine = `      ${k}: ${valueStr},`;
                if (propLine.length > 80) {
                  // Wrap the value on next line if it's a string
                  if (typeof v === "string") {
                    // eslint-disable-next-line i18next/no-literal-string
                    return `      ${k}:\n        ${valueStr},`;
                  }
                }
                return propLine;
              })
              .join("\n");
            examplePropsStr = `{\n${multilineEntries}\n    }`;
          } else {
            examplePropsStr = singleLinePropFormat;
          }
        } else {
          examplePropsStr = "{}";
        }

        // Check if description line would be too long (>80 chars)
        const descriptionLine = `    description: "${t.metadata.description}",`;
        let descriptionStr = descriptionLine;
        if (descriptionLine.length > 80) {
          // eslint-disable-next-line i18next/no-literal-string
          descriptionStr = `    description:\n      "${t.metadata.description}",`;
        }

        // eslint-disable-next-line i18next/no-literal-string
        return `  "${t.id}": {
    id: "${t.metadata.id}",
    version: "${t.metadata.version}",
    name: "${t.metadata.name}",
${descriptionStr}
    category: "${t.metadata.category}",
    path: "${t.metadata.path}",
    exampleProps: ${examplePropsStr},
  },`;
      })
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT - CLIENT-SAFE";
    const generatorName = "generators/email-templates";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Templates found": templates.length,
      "Client-safe": "No server-only imports",
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

"use client";

import type { TemplateCachedMetadata } from "./template";

/**
 * Template metadata cache for fast lookups
 * Contains only metadata (id, version, name, description, category)
 */
export const templateMetadataMap: Record<
  string,
  TemplateCachedMetadata<string>
> = {
${metadataEntries}
};

/**
 * Get template metadata without loading the component
 */
export function getTemplateMetadata(
  id: string,
): TemplateCachedMetadata<string> | undefined {
  return templateMetadataMap[id];
}

/**
 * Get all template metadata (fast, no component loading)
 */
export function getAllTemplateMetadata(): TemplateCachedMetadata<string>[] {
  return Object.values(templateMetadataMap);
}

/**
 * Get templates by category (metadata only)
 */
export function getTemplatesByCategory(
  category: string,
): TemplateCachedMetadata<string>[] {
  return getAllTemplateMetadata().filter((t) => t.category === category);
}
`;
  }
}

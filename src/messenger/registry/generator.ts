/**
 * Email Template Generator Repository
 * Generates registry/generated.ts with lazy-loaded email template imports
 */

import "server-only";

import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  generateFileHeader,
  stripProjectRoot,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";
import { parseError } from "next-vibe/core/utils/parse-error";
import { formatWarning } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  EmailTemplateDefinitionAny,
  TemplateCachedMetadata,
} from "@/messenger/registry/template";

// Type definitions
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
const OUTPUT_FILE = "src/generated/email/index.ts";

/**
 * Generate the email template registry (server + client). Consumes the shared
 * email file list; writes generated.ts + generated.client.ts. Byte-identical to the
 * former tooling/generators/email-templates.
 */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const { logger } = ctx;
  const templateFiles = ctx.files.email;

  logger.debug(`Found ${templateFiles.length} template files`);

  if (templateFiles.length === 0) {
    logger.warn(formatWarning("No email templates found"));
    return { summary: "email templates (0 found)", counts: { templates: 0 } };
  }

  const templates = await EmailTemplateGenerator.loadTemplates(
    templateFiles,
    logger,
  );
  logger.debug(`Loaded ${templates.length} valid templates`);

  const serverContent = EmailTemplateGenerator.generateServerContent(templates);
  const clientContent = EmailTemplateGenerator.generateClientContent(templates);

  const clientOutputFile = OUTPUT_FILE.replace(/\/index\.ts$/, "/client.ts");

  await writeGeneratedFile(OUTPUT_FILE, serverContent);
  await writeGeneratedFile(clientOutputFile, clientContent);

  return {
    summary: `email templates (${templates.length} templates, server + client)`,
    counts: { templates: templates.length },
  };
}

class EmailTemplateGenerator {
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
  static async loadTemplates(
    templateFiles: string[],
    logger: EndpointLogger,
  ): Promise<TemplateInfo[]> {
    const templates: TemplateInfo[] = [];
    const seenIds = new Set<string>();

    for (const file of templateFiles) {
      try {
        const templateModule = await import(file);

        const nestedPath = stripProjectRoot(file)
          .replace(/^src\//, "")
          .replace(/\/email\.tsx$/, "")
          .replace(/\/.+\.email\.tsx$/, "");
        const importPath = `@/${nestedPath}/email`;

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
            !EmailTemplateGenerator.isTemplateDef(
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
              path: stripProjectRoot(file),
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
  static generateServerContent(templates: TemplateInfo[]): string {
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
        if (singleLine.length <= 80) {
          return singleLine;
        }
        if (t.exportName !== "default") {
          const exportKey = `"${t.exportName}"`;
          // Check if (await import("path"))[ fits in 80 chars (4-space indent)
          const openLine = `    (await import("${t.importPath}"))[`;
          if (openLine.length <= 80) {
            // eslint-disable-next-line i18next/no-literal-string
            return `  "${t.id}": async () =>\n    (await import("${t.importPath}"))[\n      ${exportKey}\n    ]${cast},`;
          }
          // Import path too long: wrap the await import() itself
          // eslint-disable-next-line i18next/no-literal-string
          return `  "${t.id}": async () =>\n    (\n      await import("${t.importPath}")\n    )[${exportKey}]${cast},`;
        }
        // Default export
        // eslint-disable-next-line i18next/no-literal-string
        return `  "${t.id}": async () =>\n    (\n      await import("${t.importPath}")\n    ).default${cast},`;
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

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import type {
  EmailTemplateDefinitionAny,
  TemplateCachedMetadata,
  TranslatedPreviewFieldConfig,
} from "@/messenger/registry/template";

/**
 * Lazy-loaded template registry with dynamic imports
 */
const templateLoaders: Record<
  string,
  () => Promise<EmailTemplateDefinitionAny>
> = {
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
  static generateClientContent(templates: TemplateInfo[]): string {
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

import type { TemplateCachedMetadata } from "@/messenger/registry/template";

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

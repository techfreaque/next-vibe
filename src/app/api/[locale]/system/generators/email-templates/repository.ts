/**
 * Email Template Generator Repository
 * Generates registry/generated.ts with lazy-loaded email template imports
 */

import "server-only";

import { join } from "node:path";

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

import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";

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

import type { TemplateCachedMetadata } from "@/app/api/[locale]/emails/registry/types";

interface TemplateInfo {
  id: string;
  importPath: string;
  metadata: TemplateCachedMetadata;
}

/**
 * Email Template Generator Repository Interface
 */
interface EmailTemplateGeneratorRepository {
  generateEmailTemplates(
    data: EmailTemplateRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EmailTemplateResponseType>>;
}

/**
 * Email Template Generator Repository Implementation
 */
class EmailTemplateGeneratorRepositoryImpl implements EmailTemplateGeneratorRepository {
  async generateEmailTemplates(
    data: EmailTemplateRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EmailTemplateResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting email template generation: ${outputFile}`);

      // Discover template files in all api/[locale] subdirectories
      // eslint-disable-next-line i18next/no-literal-string
      const apiPath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiPath);

      logger.debug(`Discovering email template files in: ${startDir}`);

      // Find both email.tsx and *.email.tsx files recursively
      const emailTsxFiles = findFilesRecursively(startDir, "email.tsx");
      const emailDotTsxFiles = findFilesRecursively(
        startDir,
        ".email.tsx",
      ).filter(
        (file) => !file.endsWith("/email.tsx"), // Exclude already found email.tsx
      );

      const templateFiles = [...emailTsxFiles, ...emailDotTsxFiles];

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
      const templates = await this.loadTemplates(templateFiles, logger);

      logger.debug(`Loaded ${templates.length} valid templates`);

      // Generate server-side content (full templates with adapters)
      const serverContent = this.generateServerContent(templates);

      // Generate client-safe content (components only, no server-only imports)
      const clientContent = this.generateClientContent(templates);

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
        message: "app.api.system.generators.emailTemplates.success.generated",
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
        message:
          "app.api.system.generators.emailTemplates.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Load templates and extract metadata
   */
  private async loadTemplates(
    templateFiles: string[],
    logger: EndpointLogger,
  ): Promise<TemplateInfo[]> {
    const templates: TemplateInfo[] = [];

    for (const file of templateFiles) {
      try {
        // Load template module
        const templateModule = await import(file);
        const templateDef = templateModule.default;

        if (!templateDef?.meta) {
          logger.warn(formatWarning(`Template missing metadata: ${file}`));
          continue;
        }

        // Generate absolute import path for email template
        const nestedPath = file
          .replace(process.cwd(), "")
          .replace(/^\//, "")
          .replace(/^src\/app\/api\/\[locale\]\//, "")
          .replace(/\/email\.tsx$/, "")
          .replace(/\/.+\.email\.tsx$/, "");
        const importPath = `@/app/api/[locale]/${nestedPath}/email`;

        templates.push({
          id: templateDef.meta.id,
          importPath,
          metadata: {
            id: templateDef.meta.id,
            version: templateDef.meta.version,
            name: templateDef.meta.name,
            description: templateDef.meta.description,
            category: templateDef.meta.category,
            path: file.replace(process.cwd(), ""),
            exampleProps: templateDef.exampleProps || {},
          },
        });
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
  private generateServerContent(templates: TemplateInfo[]): string {
    // Sort templates by import path for consistent import order
    const templatesByPath = templates.toSorted((a, b) =>
      a.importPath.localeCompare(b.importPath),
    );
    // Sort templates by ID for loader and metadata order
    const templatesById = templates.toSorted((a, b) =>
      a.id.localeCompare(b.id),
    );

    // Generate individual type imports for each template (sorted by path)
    const importStatements = templatesByPath
      .map((t, index) => {
        const varName = `emailTemplate${index}`;
        // eslint-disable-next-line i18next/no-literal-string
        return `import type ${varName} from "${t.importPath}";`;
      })
      .join("\n");

    // Generate union type using typeof the imported values (path order)
    const templateTypeUnion = Array.from({ length: templatesByPath.length })

      // oxlint-disable-next-line no-unused-vars
      .map((_, index) => `  | typeof emailTemplate${index}`)
      .join("\n");

    // Generate template loaders (with trailing commas) - sorted by ID
    const loaderEntries = templatesById
      .map((t) => {
        const singleLine = `  "${t.id}": async () => (await import("${t.importPath}")).default,`;
        // Wrap long lines (100+ chars)
        if (singleLine.length >= 100) {
          // eslint-disable-next-line i18next/no-literal-string
          return `  "${t.id}": async () =>\n    (await import("${t.importPath}")).default,`;
        }
        return singleLine;
      })
      .join("\n");

    // Generate metadata map - sorted by ID
    const metadataEntries = templatesById
      .map((t) => {
        // Format exampleProps: single line for small objects (no quotes on keys), multiline for large (no quotes on keys)
        const propsKeys = Object.keys(t.metadata.exampleProps || {});
        let examplePropsStr: string;
        if (propsKeys.length <= 2) {
          // Single line: { key: value }
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join(", ");
          examplePropsStr = `{ ${entries} }`;
        } else {
          // Multiline: each property on its own line (with trailing commas)
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
            .join("\n");
          examplePropsStr = `{\n${entries}\n    }`;
        }

        // eslint-disable-next-line i18next/no-literal-string
        return `  "${t.id}": {
    id: "${t.metadata.id}",
    version: "${t.metadata.version}",
    name: "${t.metadata.name}",
    description: "${t.metadata.description}",
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

${importStatements}

import type { TemplateCachedMetadata } from "./types";

/**
 * Union type of all email template definitions
 * Each template has its own specific props type
 */
type AnyEmailTemplate =
${templateTypeUnion};

/**
 * Lazy-loaded template registry with dynamic imports
 */
const templateLoaders: Record<string, () => Promise<AnyEmailTemplate>> = {
${loaderEntries}
};

/**
 * Template metadata cache for fast lookups
 * Contains only metadata (id, version, name, description, category)
 * Actual components are lazy-loaded
 */
export const templateMetadataMap: Record<string, TemplateCachedMetadata> = {
${metadataEntries}
};

/**
 * Get template by ID (lazy loads on first access)
 * Returns the template with its specific props type
 */
export async function getTemplate(id: string): Promise<AnyEmailTemplate | undefined> {
  const loader = templateLoaders[id];
  if (!loader) {
    return undefined;
  }

  return await loader();
}

/**
 * Get template metadata without loading the component
 */
export function getTemplateMetadata(id: string): TemplateCachedMetadata | undefined {
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
export function getAllTemplateMetadata(): TemplateCachedMetadata[] {
  return Object.values(templateMetadataMap);
}

/**
 * Get templates by category (metadata only)
 */
export function getTemplatesByCategory(category: string): TemplateCachedMetadata[] {
  return getAllTemplateMetadata().filter((t) => t.category === category);
}

/**
 * Check if template exists
 */
export function hasTemplate(id: string): boolean {
  return id in templateLoaders;
}
`;
  }

  /**
   * Generate client-safe registry content without server-only imports
   * Only includes template components and metadata for preview purposes
   */
  private generateClientContent(templates: TemplateInfo[]): string {
    // Sort templates by ID for consistent output
    const templatesById = templates.toSorted((a, b) =>
      a.id.localeCompare(b.id),
    );

    // Generate metadata map (same as server version)
    const metadataEntries = templatesById
      .map((t) => {
        // Format exampleProps: single line for small objects (no quotes on keys), multiline for large (no quotes on keys)
        const propsKeys = Object.keys(t.metadata.exampleProps || {});
        let examplePropsStr: string;
        if (propsKeys.length <= 2) {
          // Single line: { key: value }
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join(", ");
          examplePropsStr = `{ ${entries} }`;
        } else {
          // Multiline: each property on its own line (with trailing commas)
          const entries = Object.entries(t.metadata.exampleProps)
            .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
            .join("\n");
          examplePropsStr = `{\n${entries}\n    }`;
        }

        // eslint-disable-next-line i18next/no-literal-string
        return `  "${t.id}": {
    id: "${t.metadata.id}",
    version: "${t.metadata.version}",
    name: "${t.metadata.name}",
    description: "${t.metadata.description}",
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

import type { TemplateCachedMetadata } from "./types";

/**
 * Template metadata cache for fast lookups
 * Contains only metadata (id, version, name, description, category)
 */
export const templateMetadataMap: Record<string, TemplateCachedMetadata> = {
${metadataEntries}
};

/**
 * Get template metadata without loading the component
 */
export function getTemplateMetadata(id: string): TemplateCachedMetadata | undefined {
  return templateMetadataMap[id];
}

/**
 * Get all template metadata (fast, no component loading)
 */
export function getAllTemplateMetadata(): TemplateCachedMetadata[] {
  return Object.values(templateMetadataMap);
}

/**
 * Get templates by category (metadata only)
 */
export function getTemplatesByCategory(category: string): TemplateCachedMetadata[] {
  return getAllTemplateMetadata().filter((t) => t.category === category);
}
`;
  }
}

export const emailTemplateGeneratorRepository =
  new EmailTemplateGeneratorRepositoryImpl();

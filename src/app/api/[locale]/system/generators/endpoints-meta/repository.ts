/**
 * Endpoints Meta Generator Repository
 *
 * Generates per-locale static metadata files for the tools modal.
 * Output: src/app/api/[locale]/system/generated/endpoints-meta/{locale}.ts
 *
 * Each file exports a typed `endpointsMeta` array with pre-translated display
 * fields (title, description, category, tags) plus raw structural data
 * (method, path, allowedRoles, aliases, icon, toolName).
 *
 * These files are pure data - no TS imports of definition files - so they are
 * tiny, fast, and safe to import on any platform including the client.
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

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
  formatWarning,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type {
  ApiSection,
  CreateApiEndpointAny,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  getPreferredToolName,
  pathSegmentsToToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  jsonToTs,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsEndpointsMetaT } from "./i18n";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EndpointsMetaRequestType {
  outputDir: string;
  dryRun: boolean;
}

interface EndpointsMetaResponseType {
  success: boolean;
  message: string;
  endpointsFound: number;
  filesWritten: number;
  duration: number;
}

/**
 * The shape of each entry in the generated metadata array.
 * Kept as a plain interface (no Zod) - this lives in generated files only.
 */
interface EndpointMeta {
  /** Full tool name: path segments joined by "_" + "_" + METHOD */
  toolName: string;
  method: string;
  /** Original path segments array from the definition */
  path: string[];
  allowedRoles: string[];
  aliases: string[];
  /** Pre-translated at generation time */
  title: string;
  /** Pre-translated at generation time */
  description: string;
  icon: string;
  /** Pre-translated category label at generation time */
  category: string;
  /** Pre-translated tags at generation time */
  tags: string[];
  /** Credit cost (only present when > 0) */
  credits?: number;
  /** Whether the tool requires user confirmation before execution */
  requiresConfirmation?: boolean;
  /** Example inputs/responses from the definition */
  examples?: {
    inputs?: Record<string, CliRequestData>;
    responses?: Record<string, CliRequestData>;
  };
}

// ─── Repository ──────────────────────────────────────────────────────────────

export class EndpointsMetaGeneratorRepository {
  /** Locales we generate metadata for */
  private static readonly GENERATE_LOCALES: CountryLanguage[] = [
    "en-US",
    "de-DE",
    "pl-PL",
  ];

  /** Mapping from CountryLanguage to short file basename */
  private static readonly LOCALE_FILE_NAMES: Partial<
    Record<CountryLanguage, string>
  > = {
    "en-US": "en",
    "de-DE": "de",
    "pl-PL": "pl",
  };

  private static readonly HTTP_METHODS: Methods[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ] as Methods[];

  static async generateEndpointsMeta(
    data: EndpointsMetaRequestType,
    logger: EndpointLogger,
    t: GeneratorsEndpointsMetaT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<EndpointsMetaResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting endpoints meta generation: ${data.outputDir}`);

      // ── 1. Discover definition files ────────────────────────────────────
      let definitionFiles: string[];
      let routeFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        definitionFiles = [...liveIndex.definitionFiles];
        routeFiles = [...liveIndex.routeFiles];
      } else {
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering definition files");
        definitionFiles = findFilesRecursively(startDir, "definition.ts");
        routeFiles = findFilesRecursively(startDir, "route.ts");
      }

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // ── 2. Filter to only definitions with a matching route ──────────────
      const routeFilesSet = new Set(routeFiles);
      const definitionsWithoutRoute: string[] = [];
      const validDefinitionFiles: string[] = [];

      for (const defFile of definitionFiles) {
        const routePath = defFile.replace("/definition.ts", "/route.ts");
        if (!routeFilesSet.has(routePath)) {
          definitionsWithoutRoute.push(defFile);
        } else {
          validDefinitionFiles.push(defFile);
        }
      }

      if (definitionsWithoutRoute.length > 0) {
        const defList = definitionsWithoutRoute
          .map(
            (d) => `    • ${d.replace(process.cwd(), "").replace(/^\//, "")}`,
          )
          .join("\n");
        logger.warn(
          formatWarning(
            `Skipped ${formatCount(definitionsWithoutRoute.length, "definition")} without matching route:\n${defList}`,
          ),
        );
      }

      // ── 3. Load all definitions once ────────────────────────────────────
      const loadedEndpoints =
        await EndpointsMetaGeneratorRepository.loadDefinitions(
          validDefinitionFiles,
          logger,
        );

      logger.debug(
        `Loaded ${loadedEndpoints.length} endpoint definitions (method entries)`,
      );

      // ── 4. Generate one file per locale ─────────────────────────────────
      let filesWritten = 0;

      for (const [
        localeIndex,
        locale,
      ] of EndpointsMetaGeneratorRepository.GENERATE_LOCALES.entries()) {
        const fileName =
          EndpointsMetaGeneratorRepository.LOCALE_FILE_NAMES[locale] ?? locale;
        const outputFile = join(data.outputDir, `${fileName}.ts`);

        // Run collision detection only on the first locale pass (names are locale-independent)
        const entries = EndpointsMetaGeneratorRepository.serializeForLocale(
          loadedEndpoints,
          locale,
          localeIndex === 0 ? logger : undefined,
        );
        const content = EndpointsMetaGeneratorRepository.renderFile(
          entries,
          locale,
        );

        await writeGeneratedFile(outputFile, content, data.dryRun);
        filesWritten++;

        logger.debug(`Wrote ${entries.length} entries → ${outputFile}`);
      }

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated endpoints meta for ${EndpointsMetaGeneratorRepository.GENERATE_LOCALES.length} locales with ${formatCount(loadedEndpoints.length, "endpoint")} in ${formatDuration(duration)}`,
          "🗂️ ",
        ),
      );

      return success({
        success: true,
        message: t("success.generated"),
        endpointsFound: loadedEndpoints.length,
        filesWritten,
        duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Endpoints meta generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { duration },
      });
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────

  /**
   * Import a single definition file and safely access its default export,
   * retrying once on Bun TDZ race errors (both import and .default access).
   */
  private static async importDefinitionFile(
    defFile: string,
    logger: EndpointLogger,
  ): Promise<ApiSection | null> {
    const tryImport = async (): Promise<{ default?: ApiSection } | null> => {
      try {
        return (await import(defFile)) as { default?: ApiSection };
      } catch (error) {
        const msg = parseError(error).message;
        if (msg.includes("before initialization")) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          try {
            return (await import(defFile)) as { default?: ApiSection };
          } catch (retryError) {
            logger.warn(
              `Could not load definition: ${defFile} - ${parseError(retryError).message}`,
            );
            return null;
          }
        }
        logger.warn(`Could not load definition: ${defFile} - ${msg}`);
        return null;
      }
    };

    const mod = await tryImport();
    if (!mod) {
      return null;
    }

    // Access .default with retry - Bun plugin race can throw TDZ here too
    let defaultExport: ApiSection | undefined;
    try {
      defaultExport = mod.default;
    } catch (error) {
      const msg = parseError(error).message;
      if (msg.includes("before initialization")) {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        try {
          defaultExport = mod.default;
        } catch (retryError) {
          logger.warn(
            `Could not access default export: ${defFile} - ${parseError(retryError).message}`,
          );
          return null;
        }
      } else {
        logger.warn(`Could not access default export: ${defFile} - ${msg}`);
        return null;
      }
    }

    return defaultExport ?? null;
  }

  /**
   * Dynamically import each definition file and collect one entry per
   * (definition file × HTTP method).
   */
  private static async loadDefinitions(
    defFiles: string[],
    logger: EndpointLogger,
  ): Promise<Array<{ definition: CreateApiEndpointAny }>> {
    const results: Array<{ definition: CreateApiEndpointAny }> = [];

    for (const defFile of defFiles) {
      const defaultExport =
        await EndpointsMetaGeneratorRepository.importDefinitionFile(
          defFile,
          logger,
        );
      if (!defaultExport || typeof defaultExport !== "object") {
        continue;
      }
      for (const method of EndpointsMetaGeneratorRepository.HTTP_METHODS) {
        const definition = defaultExport[method];
        if (!definition) {
          continue;
        }
        results.push({ definition });
      }
    }

    return results;
  }

  /**
   * Serialize all loaded definitions for a single locale.
   * Translates title, description, category, and tags at generation time.
   * Runs alias collision detection and logs pretty errors for any conflicts.
   */
  private static serializeForLocale(
    loaded: Array<{ definition: CreateApiEndpointAny }>,
    locale: CountryLanguage,
    logger?: EndpointLogger,
  ): EndpointMeta[] {
    const { t: globalT } = simpleT(locale);

    const entries = loaded.map(({ definition }) => {
      const { t } = definition.scopedTranslation.scopedT(locale);

      // Translate title & description via the endpoint's own scoped i18n
      let title = definition.title;
      let description = definition.description;
      try {
        title = t(definition.title);
      } catch {
        /* missing translation - keep raw key */
      }
      try {
        description = t(definition.description);
      } catch {
        /* missing translation - keep raw key */
      }

      // Translate category via global i18n (cast to string - global keys are wider)
      let category: string = definition.category;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category = globalT(definition.category as any);
      } catch {
        /* missing translation - keep raw key */
      }

      // Translate tags via scoped i18n
      const tags = (definition.tags ?? []).map((tag: string) => {
        try {
          return t(tag);
        } catch {
          return tag;
        }
      });

      const toolName = getPreferredToolName(definition);
      const canonicalName = pathSegmentsToToolName(
        definition.path as string[],
        definition.method,
      );
      // aliases = all aliases except the first (which is the preferred/toolName)
      const rawAliases: string[] = definition.aliases
        ? [...definition.aliases]
        : [];
      const aliases = rawAliases.length > 1 ? rawAliases.slice(1) : [];

      // Merge example requests + urlPathParams into flat inputs map
      const examplesRaw = definition.examples as
        | {
            requests?: Record<string, CliRequestData>;
            urlPathParams?: Record<string, CliRequestData>;
            responses?: Record<string, CliRequestData>;
          }
        | undefined;
      let examples: EndpointMeta["examples"];
      if (examplesRaw) {
        const allKeys = new Set([
          ...Object.keys(examplesRaw.requests ?? {}),
          ...Object.keys(examplesRaw.urlPathParams ?? {}),
        ]);
        const inputs: Record<string, CliRequestData> = {};
        for (const key of allKeys) {
          inputs[key] = {
            ...(examplesRaw.requests?.[key] ?? {}),
            ...(examplesRaw.urlPathParams?.[key] ?? {}),
          };
        }
        examples = {
          ...(allKeys.size > 0 ? { inputs } : {}),
          ...(examplesRaw.responses
            ? { responses: examplesRaw.responses }
            : {}),
        };
        if (!examples.inputs && !examples.responses) {
          examples = undefined;
        }
      }

      return {
        toolName,
        canonicalName,
        method: definition.method as string,
        path: [...(definition.path as string[])],
        allowedRoles: definition.allowedRoles
          ? [...definition.allowedRoles].map(String)
          : [],
        aliases,
        title,
        description,
        icon: (definition.icon as string | undefined) ?? "",
        category,
        tags,
        ...(definition.credits && (definition.credits as number) > 0
          ? { credits: definition.credits as number }
          : {}),
        ...(definition.requiresConfirmation
          ? { requiresConfirmation: true }
          : {}),
        ...(examples ? { examples } : {}),
      };
    });

    // ── Duplicate alias detection (within a single endpoint) ─────────────
    if (logger) {
      const dupeLines: string[] = [];
      for (const entry of entries) {
        const allNames = [entry.toolName, ...entry.aliases];
        const seen = new Set<string>();
        const dupes = new Set<string>();
        for (const name of allNames) {
          if (seen.has(name)) {
            dupes.add(name);
          }
          seen.add(name);
        }
        if (dupes.size > 0) {
          dupeLines.push(
            `   ${entry.canonicalName} has duplicate aliases: ${[...dupes].map((d) => `"${d}"`).join(", ")}`,
          );
        }
      }
      if (dupeLines.length > 0) {
        logger.warn(
          `⚠️  Duplicate aliases detected (${dupeLines.length} endpoint${dupeLines.length === 1 ? "" : "s"}):\n${dupeLines.join("\n")}`,
        );
      }
    }

    // ── Alias collision detection (across endpoints) ──────────────────────
    // Every name that an endpoint claims (toolName + all aliases) must be unique.
    // Map: name → set of canonicalNames that claim it.
    const nameOwners = new Map<string, Set<string>>();
    for (const entry of entries) {
      const allNames = [entry.toolName, ...entry.aliases];
      for (const name of allNames) {
        const owners = nameOwners.get(name) ?? new Set<string>();
        owners.add(entry.canonicalName);
        nameOwners.set(name, owners);
      }
    }

    const collisions = [...nameOwners.entries()].filter(
      ([, owners]) => owners.size > 1,
    );

    if (collisions.length > 0 && logger) {
      const lines: string[] = [
        `⚠️  Alias collision across endpoints (${collisions.length} conflict${collisions.length === 1 ? "" : "s"}):`,
      ];
      for (const [name, owners] of collisions) {
        lines.push(`   "${name}" claimed by:`);
        for (const owner of owners) {
          lines.push(`     • ${owner}`);
        }
      }
      logger.warn(lines.join("\n"));
    }

    // Strip internal-only canonicalName before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return entries.map(({ canonicalName: _canonicalName, ...rest }) => rest);
  }

  /**
   * Render the TypeScript source for one locale file.
   * Pure data export - no imports of definition files.
   */
  private static renderFile(
    entries: EndpointMeta[],
    locale: CountryLanguage,
  ): string {
    // eslint-disable-next-line i18next/no-literal-string
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "generators/endpoints-meta",
      { locale, entries: entries.length },
    );

    const entriesTs = jsonToTs(entries);

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";

export interface EndpointMeta {
  toolName: string;
  method: string;
  path: string[];
  allowedRoles: string[];
  aliases: string[];
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  credits?: number;
  requiresConfirmation?: boolean;
  examples?: {
    inputs?: Record<string, CliRequestData>;
    responses?: Record<string, CliRequestData>;
  };
}

export const endpointsMeta: EndpointMeta[] = ${entriesTs};
`;
  }
}

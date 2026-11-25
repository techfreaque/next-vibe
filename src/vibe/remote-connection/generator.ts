/**
 * Remote Capabilities Generator Repository
 *
 * Generates per-locale, per-role static capability snapshot files.
 * Output: src/generated/remote-capabilities/{locale}/{role}.json
 *
 * Also generates version.ts with a digest of the snapshots so remote sync can
 * skip unchanged snapshots across builds.
 *
 * These files are pure data - no TS imports of definition files - so they are
 * fast and safe to import in any context including the sync cron.
 */

import "server-only";

// Generator output messages and error strings don't need internationalization
import { createHash } from "node:crypto";
import { join } from "node:path";

import { GENERATED_DIR, getApiDir } from "@/env/paths";

import { getPreferredToolName } from "../core/core-utils/path";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { Methods } from "../core/definition/enums";
import type {
  GeneratorContext,
  GeneratorDefinition,
  GeneratorResult,
} from "../core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  toImportUrl,
  writeGeneratedFile,
} from "../core/generators/shared/utils";
import type { CountryLanguage } from "../core/i18n/core/config";
import { parseError } from "../core/utils/parse-error";
import type { UserPermissionRoleValue } from "../identity/roles/enum";
import {
  filterUserPermissionRoles,
  PlatformMarker,
  UserPermissionRole,
} from "../identity/roles/enum";
import type { EndpointLogger } from "../logger/types";
import type { RemoteToolCapability } from "./db";

const OUTPUT_DIR = `${GENERATED_DIR}/remote-capabilities`;

class RemoteCapabilitiesGenerator {
  /** Locales we generate files for */
  private static readonly GENERATE_LOCALES: CountryLanguage[] = [
    "en-US",
    "de-DE",
    "pl-PL",
    "fr-FR",
    "it-IT",
    "es-ES",
    "sk-SK",
  ];

  /** Locale → short basename */
  private static readonly LOCALE_FILE_NAMES: Partial<
    Record<CountryLanguage, string>
  > = {
    "en-US": "en",
    "de-DE": "de",
    "pl-PL": "pl",
    "fr-FR": "fr",
    "it-IT": "it",
    "es-ES": "es",
    "sk-SK": "sk",
  };

  /** User roles we generate snapshots for */
  private static readonly GENERATE_ROLES = [
    UserPermissionRole.PUBLIC,
    UserPermissionRole.CUSTOMER,
    UserPermissionRole.ADMIN,
  ] as const;

  /** Role → file basename */
  private static readonly ROLE_FILE_NAMES: Partial<
    Record<typeof UserPermissionRoleValue, string>
  > = {
    [UserPermissionRole.PUBLIC]: "public",
    [UserPermissionRole.CUSTOMER]: "customer",
    [UserPermissionRole.ADMIN]: "admin",
  };

  private static readonly HTTP_METHODS = [
    Methods.GET,
    Methods.POST,
    Methods.PUT,
    Methods.PATCH,
    Methods.DELETE,
  ] as const;

  static async run(
    ctx: GeneratorContext,
    outputDir: string,
  ): Promise<GeneratorResult> {
    const { logger } = ctx;

    logger.debug(`Starting remote capabilities generation: ${outputDir}`);

    // ── 1. Discover definition files ────────────────────────────────────
    const startDir = getApiDir();

    const definitionFiles = findFilesRecursively(startDir, "definition.ts");
    const routeFiles = findFilesRecursively(startDir, "route.ts");

    // Only include definitions with a matching route
    const routeFilesSet = new Set(routeFiles);
    const validDefinitionFiles = definitionFiles.filter((defFile) =>
      routeFilesSet.has(defFile.replace("/definition.ts", "/route.ts")),
    );

    logger.debug(`Found ${validDefinitionFiles.length} valid definition files`);

    // ── 2. Load all definitions ─────────────────────────────────────────
    const loadedEndpoints = await RemoteCapabilitiesGenerator.loadDefinitions(
      validDefinitionFiles,
      logger,
    );

    logger.debug(`Loaded ${loadedEndpoints.length} endpoint definitions`);

    // ── 3. Generate per-locale × per-role files ──────────────────────────
    const snapshotHash = createHash("sha256");
    let filesWritten = 0;
    let maxFilteredCount = 0;

    for (const locale of RemoteCapabilitiesGenerator.GENERATE_LOCALES) {
      const localeName =
        RemoteCapabilitiesGenerator.LOCALE_FILE_NAMES[locale] ?? locale;
      // Use template string to prevent Turbopack from statically tracing paths
      const localeDir = `${outputDir}/${localeName}`;

      for (const role of RemoteCapabilitiesGenerator.GENERATE_ROLES) {
        const roleName =
          RemoteCapabilitiesGenerator.ROLE_FILE_NAMES[role] ?? role;

        // Filter endpoints accessible to this role
        const roleEndpoints = loadedEndpoints.filter(({ definition }) =>
          RemoteCapabilitiesGenerator.isAccessibleByRole(definition, role),
        );

        if (roleEndpoints.length > maxFilteredCount) {
          maxFilteredCount = roleEndpoints.length;
        }

        const capabilities = RemoteCapabilitiesGenerator.serializeForLocaleRole(
          roleEndpoints,
          locale,
        );

        const outputFile = join(localeDir, `${roleName}.json`);
        const content =
          RemoteCapabilitiesGenerator.renderCapabilitiesFile(capabilities);
        snapshotHash.update(`${localeName}/${roleName}.json\0`).update(content);
        await writeGeneratedFile(outputFile, content, false);
        filesWritten++;

        logger.debug(
          `Wrote ${capabilities.length} capabilities → ${outputFile}`,
        );
      }
    }

    // ── 4. Write version.ts ─────────────────────────────────────────────
    const version = snapshotHash.digest("hex").slice(0, 12);
    const versionFile = join(outputDir, "version.ts");
    await writeGeneratedFile(
      versionFile,
      RemoteCapabilitiesGenerator.renderVersionFile(version),
      false,
    );
    filesWritten++;

    return {
      summary: `remote capabilities (${maxFilteredCount} endpoints, ${filesWritten} files, version ${version})`,
      counts: { endpoints: maxFilteredCount, files: filesWritten },
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /**
   * Import a single definition file and safely access its default export,
   * retrying once on Bun TDZ race errors (both import and .default access).
   */
  private static async importDefinitionFile(
    defFile: string,
    logger: EndpointLogger,
  ): Promise<Record<string, CreateApiEndpointAny> | null> {
    const tryImport = async (): Promise<{
      default?: Record<string, CreateApiEndpointAny>;
    } | null> => {
      try {
        return (await import(
          /* webpackIgnore: true */ /* turbopackIgnore: true */ toImportUrl(
            defFile,
          )
        )) as {
          default?: Record<string, CreateApiEndpointAny>;
        };
      } catch (error) {
        const msg = parseError(error).message;
        if (msg.includes("before initialization")) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          try {
            return (await import(
              /* webpackIgnore: true */ /* turbopackIgnore: true */ toImportUrl(
                defFile,
              )
            )) as {
              default?: Record<string, CreateApiEndpointAny>;
            };
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
    let defaultExport: Record<string, CreateApiEndpointAny> | undefined;
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

  private static async loadDefinitions(
    defFiles: string[],
    logger: EndpointLogger,
  ): Promise<Array<{ definition: CreateApiEndpointAny }>> {
    const imported = await Promise.all(
      defFiles.map((defFile) =>
        RemoteCapabilitiesGenerator.importDefinitionFile(defFile, logger),
      ),
    );

    const results: Array<{ definition: CreateApiEndpointAny }> = [];

    for (const defaultExport of imported) {
      if (!defaultExport || typeof defaultExport !== "object") {
        continue;
      }
      for (const method of RemoteCapabilitiesGenerator.HTTP_METHODS) {
        const definition = defaultExport[method];
        if (definition) {
          results.push({ definition });
        }
      }
    }

    return results;
  }

  /**
   * Check if an endpoint is accessible by this role via AI tool / Next API platforms.
   * Remote tool execution goes through the AI platform (execute-tool route),
   * so we only include endpoints that are accessible on AI + NEXT_API —
   * i.e. not marked WEB_OFF and not marked AI_TOOL_OFF.
   */
  private static isAccessibleByRole(
    definition: CreateApiEndpointAny,
    role: typeof UserPermissionRoleValue,
  ): boolean {
    if (!definition.allowedRoles) {
      return false;
    }
    const allowedRoles = definition.allowedRoles as readonly string[];

    // Exclude web-off endpoints (remote execution goes through HTTP / Next API)
    if (allowedRoles.includes(PlatformMarker.WEB_OFF)) {
      return false;
    }

    // Exclude AI-tool-off endpoints (remote execution uses the AI platform)
    if (allowedRoles.includes(PlatformMarker.AI_TOOL_OFF)) {
      return false;
    }

    // Must include this role or a higher role
    const permissionRoles = filterUserPermissionRoles(
      allowedRoles as readonly (typeof UserPermissionRoleValue)[],
    );

    if (role === UserPermissionRole.PUBLIC) {
      return permissionRoles.includes(UserPermissionRole.PUBLIC);
    }
    if (role === UserPermissionRole.CUSTOMER) {
      return (
        permissionRoles.includes(UserPermissionRole.PUBLIC) ||
        permissionRoles.includes(UserPermissionRole.CUSTOMER)
      );
    }
    if (role === UserPermissionRole.ADMIN) {
      return permissionRoles.length > 0; // any role includes admin
    }

    return false;
  }

  /**
   * Serialize endpoints for a specific locale into RemoteToolCapability[].
   * JSON.stringify naturally strips function refs (render, execute, etc.).
   * All translatable string values in fields are resolved through t() so the
   * remote side receives pre-translated labels, descriptions, placeholders etc.
   */
  private static serializeForLocaleRole(
    loaded: Array<{ definition: CreateApiEndpointAny }>,
    locale: CountryLanguage,
  ): RemoteToolCapability[] {
    const capabilities: RemoteToolCapability[] = [];
    for (const { definition } of loaded) {
      try {
        const { t } = definition.scopedTranslation.scopedT(locale);
        const toolName = getPreferredToolName(definition);

        const title = t(definition.title);
        const titleShort = definition.titleShort
          ? t(definition.titleShort)
          : undefined;

        const description = t(definition.description ?? definition.title);

        const category = definition.category;

        // Translate tags via scoped i18n
        const tags = (definition.tags ?? []).map((tag: string) => {
          try {
            return t(tag);
          } catch {
            return tag;
          }
        });

        // Aliases (all aliases from definition)
        const aliases: string[] = definition.aliases
          ? [...definition.aliases]
          : [];

        // Serialize fields - JSON.stringify drops render/function refs,
        // then walk the result and resolve all translatable string values.
        const fields = RemoteCapabilitiesGenerator.translateFieldStrings(
          JSON.parse(
            RemoteCapabilitiesGenerator.serializeFields(definition.fields),
          ) as RemoteToolCapability["fields"],
          t,
        );

        capabilities.push({
          toolName,
          title,
          ...(titleShort ? { titleShort } : {}),
          description,
          fields,
          executionMode: "via-execute-route",
          isAsync: true,
          // instanceId is tagged by the receiving side at sync time
          instanceId: "local",
          category,
          tags: tags.length > 0 ? tags : undefined,
          aliases: aliases.length > 0 ? aliases : undefined,
          credits: definition.credits ?? 0,
        });
      } catch {
        // Skip endpoints that fail to serialize
      }
    }

    return capabilities;
  }

  /**
   * Serialize endpoint fields to JSON. JSON.stringify drops function refs
   * (render, execute, etc.).
   *
   * Zod default/prefault defs expose `defaultValue` as an enumerable getter
   * that invokes the default function on every read, and zod gives no way to
   * tell a static default from a `.default(fn)` one. Serializing it would run
   * functions such as `Intl.DateTimeFormat().resolvedOptions().timeZone` at
   * generation time and bake the generating machine's state into committed
   * output and the version hash. So the getter is never read: those defs are
   * emitted without `defaultValue`. Nothing on the receiving side reads it
   * (see extractParametersFromCapabilityFields); the owning instance applies
   * its own defaults when it executes the tool.
   */
  private static serializeFields(
    fields: CreateApiEndpointAny["fields"],
  ): string {
    return JSON.stringify(fields ?? {}, (key, value) => {
      // The root is the fields tree itself, never a zod def.
      if (
        key === "" ||
        value === null ||
        typeof value !== "object" ||
        !Object.hasOwn(value, "defaultValue") ||
        !Object.hasOwn(value, "innerType")
      ) {
        return value;
      }
      const type = Reflect.get(value, "type");
      if (type !== "default" && type !== "prefault") {
        return value;
      }
      // Copy own keys without touching the defaultValue getter.
      return Object.fromEntries(
        Object.keys(value)
          .filter((prop) => prop !== "defaultValue")
          .map((prop) => [prop, Reflect.get(value, prop)]),
      );
    });
  }

  /**
   * Walk a serialized fields object recursively and resolve all translatable
   * string properties through t(). Unknown keys are left as-is.
   *
   * Translatable keys: label, description, placeholder, helpText,
   *                    content, title, hint
   */
  private static translateFieldStrings(
    obj: RemoteToolCapability["fields"],
    t: (key: string) => string,
  ): RemoteToolCapability["fields"] {
    const TRANSLATABLE_KEYS = new Set([
      "label",
      "description",
      "placeholder",
      "helpText",
      "content",
      "title",
      "hint",
    ]);

    const walk = (
      value: RemoteToolCapability["fields"],
    ): RemoteToolCapability["fields"] => {
      const out: RemoteToolCapability["fields"] = {};
      for (const [key, val] of Object.entries(
        value as Record<string, RemoteToolCapability["fields"]>,
      )) {
        if (
          TRANSLATABLE_KEYS.has(key) &&
          typeof val === "string" &&
          val.length > 0
        ) {
          try {
            out[key] = t(val);
          } catch {
            out[key] = val; // missing translation - keep raw key
          }
        } else if (
          val !== null &&
          typeof val === "object" &&
          !Array.isArray(val)
        ) {
          out[key] = walk(val as RemoteToolCapability["fields"]);
        } else {
          out[key] = val;
        }
      }
      return out;
    };

    return walk(obj);
  }

  private static renderCapabilitiesFile(
    capabilities: RemoteToolCapability[],
  ): string {
    const raw = JSON.stringify(capabilities, null, 2);
    // Prettier collapses primitive arrays onto one line when the full line fits ≤80 chars.
    // Capture the key prefix so we can measure total line length before collapsing.
    // Prettier collapses arrays of strings/numbers/booleans/null/empty-objects when
    // the full line (indentation + key + collapsed array) fits ≤80 chars.
    // Match: "key": [\n  item,\n  item\n] where each item is a JSON scalar or {}
    const collapsed = raw.replaceAll(
      /^( *"[^"]+": )\[(\n\s+(?:"[^"]*"|true|false|null|-?\d+(?:\.\d+)?|{}),?\s*)+\n\s*\]/gm,
      (match, prefix: string) => {
        const arrayPart = match.slice((prefix as string).length);
        const inner = arrayPart.slice(1, -1).trim();
        const items = inner
          .split(/,\s*\n\s*/)
          .map((s) => s.trim())
          .filter(Boolean);
        const inlined = `[${items.join(", ")}]`;
        return (prefix as string).length + inlined.length <= 80
          ? `${prefix}${inlined}`
          : match;
      },
    );
    return `${collapsed}\n`;
  }

  private static renderVersionFile(version: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "generators/remote-capabilities",
      { version },
    );

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/**
 * Snapshot version for remote capability sync.
 * Local instances send this in every sync request so the cloud can skip
 * re-processing capability snapshots that haven't changed since last sync.
 */
export const CAPABILITIES_VERSION = ${JSON.stringify(version)};
`;
  }
}

export const generator: GeneratorDefinition = {
  key: "remote-capabilities",
  phase: "default",
  needs: {},
  cacheKey: "remote-capabilities",
  findInputs(live) {
    const translationFiles = findFilesRecursively(
      getApiDir(),
      "index.ts",
    ).filter((file) => file.includes("/i18n/"));
    if (live) {
      return [
        ...live.definitionFiles,
        ...live.routeFiles,
        ...translationFiles,
      ].toSorted();
    }
    return [
      ...findFilesRecursively(getApiDir(), "definition.ts"),
      ...findFilesRecursively(getApiDir(), "route.ts"),
      ...translationFiles,
    ].toSorted();
  },
  /**
   * version.ts is the one artefact every successful run writes. The per-locale,
   * per-role capability JSONs are deliberately absent: their paths depend on the
   * configured locales and roles, so listing them would make the existence check
   * fail permanently and the cache never hit.
   */
  output: `${OUTPUT_DIR}/version.ts`,
  async generate(ctx) {
    return RemoteCapabilitiesGenerator.run(ctx, OUTPUT_DIR);
  },
};

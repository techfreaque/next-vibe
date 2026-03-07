/**
 * Remote Capabilities Generator Repository
 *
 * Generates per-locale, per-role static capability snapshot files.
 * Output: src/app/api/[locale]/system/generated/remote-capabilities/{locale}/{role}.ts
 *
 * Also generates version.ts with the build version string (git SHA or package
 * version) — changes only on deploy, so remote sync can skip unchanged snapshots.
 *
 * These files are pure data — no TS imports of definition files — so they are
 * fast and safe to import in any context including the sync cron.
 */

import "server-only";

/* eslint-disable i18next/no-literal-string */
// Generator output messages and error strings don't need internationalization
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type {
  JsonObject,
  RemoteToolCapability,
} from "@/app/api/[locale]/user/remote-connection/db";
import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import {
  filterUserPermissionRoles,
  UserPermissionRole,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  findFilesRecursively,
  generateFileHeader,
  jsonToTs,
  writeGeneratedFile,
} from "../shared/utils";
import type { scopedTranslation } from "./i18n";

// ─── Types ───────────────────────────────────────────────────────────────────

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface RemoteCapabilitiesRequestType {
  outputDir: string;
  dryRun: boolean;
}

interface RemoteCapabilitiesResponseType {
  success: boolean;
  message: string;
  endpointsFound: number;
  filesWritten: number;
  duration: number;
  version: string;
}

/** Locales we generate files for */
const GENERATE_LOCALES: CountryLanguage[] = ["en-US", "de-DE", "pl-PL"];

/** Locale → short basename */
const LOCALE_FILE_NAMES: Partial<Record<CountryLanguage, string>> = {
  "en-US": "en",
  "de-DE": "de",
  "pl-PL": "pl",
};

/** User roles we generate snapshots for */
const GENERATE_ROLES = [
  UserPermissionRole.PUBLIC,
  UserPermissionRole.CUSTOMER,
  UserPermissionRole.ADMIN,
] as const;

/** Role → file basename */
const ROLE_FILE_NAMES: Partial<Record<typeof UserPermissionRoleValue, string>> =
  {
    [UserPermissionRole.PUBLIC]: "public",
    [UserPermissionRole.CUSTOMER]: "customer",
    [UserPermissionRole.ADMIN]: "admin",
  };

const HTTP_METHODS = [
  Methods.GET,
  Methods.POST,
  Methods.PUT,
  Methods.PATCH,
  Methods.DELETE,
] as const;

// ─── Build version ────────────────────────────────────────────────────────────

/**
 * Compute build version: git SHA if available, else package version, else timestamp.
 * This changes only on deploy — used by remote sync to skip unchanged snapshots.
 *
 * Uses execSync("git rev-parse") instead of reading .git/ files directly —
 * subprocess calls are opaque to Turbopack's static file-glob analysis.
 */
function getBuildVersion(): string {
  try {
    // execSync is opaque to Turbopack — no file-glob warnings
    const sha = execSync("git rev-parse --short=12 HEAD", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (sha) {
      return sha;
    }
  } catch {
    // Not a git repo or git not installed — fall through
  }

  try {
    const cwd = process.env["PWD"] ?? process.cwd();
    const pkgPath = join(cwd, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
        version?: string;
      };
      if (pkg.version) {
        return pkg.version;
      }
    }
  } catch {
    // Ignore
  }

  // Fallback: hash the current timestamp to something short and stable per build
  return createHash("sha256")
    .update(String(Date.now()))
    .digest("hex")
    .slice(0, 12);
}

// ─── Repository ───────────────────────────────────────────────────────────────

class RemoteCapabilitiesGeneratorRepositoryImpl {
  async generateRemoteCapabilities(
    data: RemoteCapabilitiesRequestType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<BaseResponseType<RemoteCapabilitiesResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(
        `Starting remote capabilities generation: ${data.outputDir}`,
      );

      // ── 1. Discover definition files ────────────────────────────────────
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiCorePath);

      const definitionFiles = findFilesRecursively(startDir, "definition.ts");
      const routeFiles = findFilesRecursively(startDir, "route.ts");

      // Only include definitions with a matching route
      const routeFilesSet = new Set(routeFiles);
      const validDefinitionFiles = definitionFiles.filter((defFile) =>
        routeFilesSet.has(defFile.replace("/definition.ts", "/route.ts")),
      );

      logger.debug(
        `Found ${validDefinitionFiles.length} valid definition files`,
      );

      // ── 2. Load all definitions ─────────────────────────────────────────
      const loadedEndpoints = await this.loadDefinitions(
        validDefinitionFiles,
        logger,
      );

      logger.debug(`Loaded ${loadedEndpoints.length} endpoint definitions`);

      // ── 3. Build version string ─────────────────────────────────────────
      const version = getBuildVersion();

      // ── 4. Generate per-locale × per-role files ─────────────────────────
      let filesWritten = 0;

      for (const locale of GENERATE_LOCALES) {
        const localeName = LOCALE_FILE_NAMES[locale] ?? locale;
        const localeDir = join(data.outputDir, localeName);

        for (const role of GENERATE_ROLES) {
          const roleName = ROLE_FILE_NAMES[role] ?? role;

          // Filter endpoints accessible to this role
          const roleEndpoints = loadedEndpoints.filter(({ definition }) =>
            this.isAccessibleByRole(definition, role),
          );

          const capabilities = this.serializeForLocaleRole(
            roleEndpoints,
            locale,
          );

          const outputFile = join(localeDir, `${roleName}.ts`);
          const content = this.renderCapabilitiesFile(
            capabilities,
            locale,
            role,
          );
          await writeGeneratedFile(outputFile, content, data.dryRun);
          filesWritten++;

          logger.debug(
            `Wrote ${capabilities.length} capabilities → ${outputFile}`,
          );
        }
      }

      // ── 5. Write version.ts ─────────────────────────────────────────────
      const versionFile = join(data.outputDir, "version.ts");
      await writeGeneratedFile(
        versionFile,
        this.renderVersionFile(version),
        data.dryRun,
      );
      filesWritten++;

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated remote capabilities for ${GENERATE_LOCALES.length} locales × ${GENERATE_ROLES.length} roles with ${formatCount(loadedEndpoints.length, "endpoint")} in ${formatDuration(duration)} (version: ${version})`,
          "🔌",
        ),
      );

      return success({
        success: true,
        message: t("success.generated"),
        endpointsFound: loadedEndpoints.length,
        filesWritten,
        duration,
        version,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Remote capabilities generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private async loadDefinitions(
    defFiles: string[],
    logger: EndpointLogger,
  ): Promise<Array<{ definition: CreateApiEndpointAny }>> {
    const results: Array<{ definition: CreateApiEndpointAny }> = [];

    for (const defFile of defFiles) {
      try {
        const mod = (await import(defFile)) as {
          default?: Record<string, CreateApiEndpointAny>;
        };
        const defaultExport = mod.default;
        if (!defaultExport || typeof defaultExport !== "object") {
          continue;
        }
        for (const method of HTTP_METHODS) {
          const definition = defaultExport[method];
          if (definition) {
            results.push({ definition });
          }
        }
      } catch (error) {
        logger.warn(
          `Could not load definition: ${defFile} — ${parseError(error).message}`,
        );
      }
    }

    return results;
  }

  /**
   * Check if an endpoint is accessible by this role (web platform, not web-off).
   * Filters out platform markers and checks allowed roles.
   */
  private isAccessibleByRole(
    definition: CreateApiEndpointAny,
    role: typeof UserPermissionRoleValue,
  ): boolean {
    if (!definition.allowedRoles) {
      return false;
    }
    const allowedRoles = definition.allowedRoles as readonly string[];

    // Exclude web-off endpoints (remote execution goes through HTTP)
    if (allowedRoles.includes("WEB_OFF")) {
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
  private serializeForLocaleRole(
    loaded: Array<{ definition: CreateApiEndpointAny }>,
    locale: CountryLanguage,
  ): RemoteToolCapability[] {
    const capabilities: RemoteToolCapability[] = [];

    for (const { definition } of loaded) {
      try {
        const { t } = definition.scopedTranslation.scopedT(locale);
        const toolName = getPreferredToolName(definition);

        let title = definition.title;
        let description = definition.description ?? definition.title;
        try {
          title = t(definition.title);
        } catch {
          /* missing translation — keep raw key */
        }
        try {
          description = t(definition.description ?? definition.title);
        } catch {
          /* missing translation — keep raw key */
        }

        // Serialize fields — JSON.stringify drops render/function refs,
        // then walk the result and resolve all translatable string values.
        const fields = this.translateFieldStrings(
          JSON.parse(JSON.stringify(definition.fields ?? {})) as JsonObject,
          t,
        );

        capabilities.push({
          toolName,
          title,
          description,
          fields,
          executionMode: "via-execute-route",
          isAsync: true,
          // instanceId is tagged by the receiving side at sync time
          instanceId: "local",
        });
      } catch {
        // Skip endpoints that fail to serialize
      }
    }

    return capabilities;
  }

  /**
   * Walk a serialized fields object recursively and resolve all translatable
   * string properties through t(). Unknown keys are left as-is.
   *
   * Translatable keys: label, description, placeholder, helpText,
   *                    content, title, hint
   */
  private translateFieldStrings(
    obj: JsonObject,
    t: (key: string) => string,
  ): JsonObject {
    const TRANSLATABLE_KEYS = new Set([
      "label",
      "description",
      "placeholder",
      "helpText",
      "content",
      "title",
      "hint",
    ]);

    const walk = (value: JsonObject): JsonObject => {
      const out: JsonObject = {};
      for (const [key, val] of Object.entries(value)) {
        if (
          TRANSLATABLE_KEYS.has(key) &&
          typeof val === "string" &&
          val.length > 0
        ) {
          try {
            out[key] = t(val);
          } catch {
            out[key] = val; // missing translation — keep raw key
          }
        } else if (
          val !== null &&
          typeof val === "object" &&
          !Array.isArray(val)
        ) {
          out[key] = walk(val as JsonObject);
        } else {
          out[key] = val;
        }
      }
      return out;
    };

    return walk(obj);
  }

  private renderCapabilitiesFile(
    capabilities: RemoteToolCapability[],
    locale: CountryLanguage,
    role: typeof UserPermissionRoleValue,
  ): string {
    // eslint-disable-next-line i18next/no-literal-string
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "generators/remote-capabilities",
      { locale, role, entries: capabilities.length },
    );

    const capTs = jsonToTs(capabilities);

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import type { RemoteToolCapability } from "@/app/api/[locale]/user/remote-connection/db";

export const remoteCapabilities: RemoteToolCapability[] = ${capTs};
`;
  }

  private renderVersionFile(version: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "generators/remote-capabilities",
      { version },
    );

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/**
 * Build version string for remote capability sync.
 * Local instances send this in every sync request so the cloud can skip
 * re-processing capability snapshots that haven't changed since last sync.
 */
export const CAPABILITIES_VERSION = ${JSON.stringify(version)};
`;
  }
}

export const remoteCapabilitiesGeneratorRepository =
  new RemoteCapabilitiesGeneratorRepositoryImpl();

/**
 * Env Keys Generator Repository
 *
 * Reads envModules (server-only registry) at generation time and writes
 * a plain (non-server-only) static env-keys.ts file that definition files
 * can safely import to build flat requestFields per env key.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EnvExample } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import {
  generateFileHeader,
  jsonToTs,
  writeGeneratedFile,
} from "../shared/utils";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface EnvKeysRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface EnvKeysResponseType {
  success: boolean;
  message: string;
  keysFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Serializable metadata for a single env key.
 * This type must stay free of server-only imports so the generated file
 * can be imported by definition files (which run in client context too).
 */
export type EnvFieldType =
  | "text"
  | "boolean"
  | "number"
  | "select"
  | "url"
  | "email";

export interface EnvKeyMeta {
  key: string;
  /** The module name this key belongs to (e.g. "env", "agent") */
  module: string;
  comment: string;
  example: string;
  sensitive: boolean;
  fieldType: EnvFieldType;
  options?: string[];
  onboardingRequired: boolean;
  onboardingStep?: number;
  onboardingGroup?: string;
  autoGenerate?: "hex32" | "hex64";
}

/** Hidden modules whose keys are auto-detected and not user-configurable */
const HIDDEN_MODULES = new Set(["serverSystem"]);

/** Patterns for detecting sensitive env keys by name */
const SENSITIVE_PATTERNS = [
  "_KEY",
  "_SECRET",
  "_PASS",
  "_TOKEN",
  "_SID",
  "_CREDENTIAL",
  "PASSWORD",
  "JWT_SECRET",
  "CRON_SECRET",
  "ACCESS_KEY",
  "AUTH_TOKEN",
  "DATABASE_URL",
];

function isSensitiveKey(key: string, explicitSensitive?: boolean): boolean {
  if (explicitSensitive !== undefined) {
    return explicitSensitive;
  }
  const upper = key.toUpperCase();
  return SENSITIVE_PATTERNS.some((p) => upper.includes(p));
}

class EnvKeysGeneratorRepositoryImpl {
  async generateEnvKeys(
    data: EnvKeysRequestType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<BaseResponseType<EnvKeysResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting env keys generation: ${data.outputFile}`);

      // Dynamic import so this module can be used in server context only
      const { envModules } =
        await import("@/app/api/[locale]/system/generated/env");

      const keys: EnvKeyMeta[] = [];
      const seenKeys = new Set<string>();

      for (const [moduleName, { examples }] of Object.entries(envModules)) {
        if (HIDDEN_MODULES.has(moduleName)) {
          continue;
        }

        for (const ex of examples as EnvExample[]) {
          if (seenKeys.has(ex.key)) {
            continue;
          }
          seenKeys.add(ex.key);

          keys.push({
            key: ex.key,
            module: moduleName,
            comment: ex.comment ?? "",
            example: ex.example === false ? "" : (ex.example ?? ""),
            sensitive: isSensitiveKey(ex.key, ex.sensitive),
            fieldType: ex.fieldType ?? "text",
            options: ex.options ? [...ex.options] : undefined,
            onboardingRequired: ex.onboardingRequired ?? false,
            onboardingStep: ex.onboardingStep,
            onboardingGroup: ex.onboardingGroup,
            autoGenerate: ex.autoGenerate,
          });
        }
      }

      logger.debug(`Collected ${keys.length} env keys`);

      const content = this.generateContent(keys);
      await writeGeneratedFile(data.outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated env keys with ${formatCount(keys.length, "key")} in ${formatDuration(duration)}`,
          "🔑",
        ),
      );

      return success({
        success: true,
        message: t("post.success.title"),
        keysFound: keys.length,
        duration,
        outputFile: data.dryRun ? undefined : data.outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Env keys generation failed", {
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

  private generateContent(keys: EnvKeyMeta[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED ENV KEYS METADATA",
      "generators/env-keys",
      {
        "Keys found": keys.length,
      },
    );

    const keysTs = jsonToTs(keys, 0, 0);

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

/**
 * Serializable metadata for a single env key.
 * Imported by settings definition to build flat requestFields.
 * NOT server-only — safe to import in client context.
 */
export type EnvFieldType =
  | "text"
  | "boolean"
  | "number"
  | "select"
  | "url"
  | "email";

export interface EnvKeyMeta {
  key: string;
  module: string;
  comment: string;
  example: string;
  sensitive: boolean;
  fieldType: EnvFieldType;
  options?: string[];
  onboardingRequired: boolean;
  onboardingStep?: number;
  onboardingGroup?: string;
  autoGenerate?: "hex32" | "hex64";
}

/**
 * All configured env keys with their metadata.
 * Auto-generated — do not edit manually.
 */
export const ENV_KEYS = ${keysTs} as const satisfies readonly EnvKeyMeta[];

export type EnvKeyName = (typeof ENV_KEYS)[number]["key"];

`;
  }
}

export const envKeysGeneratorRepository = new EnvKeysGeneratorRepositoryImpl();

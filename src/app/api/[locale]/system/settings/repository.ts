/**
 * System Settings Repository
 * Reads env modules for GET, writes .env file for PATCH
 */

import "server-only";

import { existsSync } from "node:fs";
import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ZodTypeAny } from "zod";

import type { EnvExample } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";
import {
  encryptEnvValue,
  isEncryptedValue,
  loadOrCreateKey,
} from "@/app/api/[locale]/system/unified-interface/shared/env/env-crypto";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { SystemSettingsGetResponseOutput } from "./definition";
import type { SystemSettingsT } from "./i18n";

export class SystemSettingsRepository {
  /** Sentinel password that triggers onboarding */
  private static readonly DEFAULT_PASSWORD_SENTINEL = "change-me-now";

  /** Patterns for detecting sensitive env keys by name */
  private static readonly SENSITIVE_PATTERNS = [
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

  private static isSensitiveKey(
    key: string,
    explicitSensitive?: boolean,
  ): boolean {
    if (explicitSensitive !== undefined) {
      return explicitSensitive;
    }
    const upper = key.toUpperCase();
    return SystemSettingsRepository.SENSITIVE_PATTERNS.some((p) =>
      upper.includes(p),
    );
  }

  private static stringifyValue(
    value: string | number | boolean | null | undefined,
  ): string {
    if (value === undefined || value === null) {
      return "";
    }
    return String(value);
  }

  private static getEnvFilePath(): string {
    return join(process.cwd(), ".env");
  }

  private static async checkWritable(): Promise<boolean> {
    // Docker detection
    if (process.env["VIBE_IS_DOCKER"] === "true") {
      return false;
    }

    const envPath = SystemSettingsRepository.getEnvFilePath();
    if (!existsSync(envPath)) {
      return false;
    }

    try {
      await access(envPath, constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  private static isDevMode(): boolean {
    const devPidPath = join(process.cwd(), ".tmp", ".vibe-dev.pid");
    return existsSync(devPidPath);
  }

  private static findExampleForKey(
    examples: EnvExample[],
    key: string,
  ): EnvExample | undefined {
    return examples.find((e) => e.key === key);
  }
  /**
   * GET — Read all env modules with metadata
   */
  static async getSettings(
    logger: EndpointLogger,
    t: SystemSettingsT,
  ): Promise<ResponseType<SystemSettingsGetResponseOutput>> {
    try {
      logger.debug("Reading system settings from env modules");

      // Dynamic import to avoid server-only issues at definition parse time
      const { envModules } =
        await import("@/app/api/[locale]/system/generated/env");

      const onboardingIssues: string[] = [];
      // Hide modules where all fields are auto-detected (not user-configurable)
      const HIDDEN_MODULES = new Set(["serverSystem"]);

      // Read raw .env to check which values are stored encrypted
      const envPath = SystemSettingsRepository.getEnvFilePath();
      const rawEnvFile = existsSync(envPath)
        ? await readFile(envPath, "utf-8")
        : "";
      const encryptedKeys = new Set<string>();
      for (const line of rawEnvFile.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.includes("=")) {
          continue;
        }
        const eqIdx = trimmed.indexOf("=");
        const k = trimmed.slice(0, eqIdx);
        const v = trimmed.slice(eqIdx + 1).replace(/^"|"$/g, "");
        if (isEncryptedValue(v)) {
          encryptedKeys.add(k);
        }
      }

      const modules = Object.entries(envModules)
        .filter(([name]) => !HIDDEN_MODULES.has(name))
        .map(([name, { env, examples }]) => {
          const envRecord = env as Record<
            string,
            string | number | boolean | null | undefined
          >;
          // Use examples as the source of all keys so optional fields (undefined in env)
          // are still visible in settings. Fall back to env entries for keys with no example.
          const examplesList = examples as EnvExample[];
          const allKeys = new Set<string>([
            ...examplesList.map((e) => e.key),
            ...Object.keys(envRecord),
          ]);
          const settings = [...allKeys].map((key) => {
            const rawValue = envRecord[key];
            const exampleDef = SystemSettingsRepository.findExampleForKey(
              examplesList,
              key,
            );
            const sensitive = SystemSettingsRepository.isSensitiveKey(
              key,
              exampleDef?.sensitive,
            );
            const isConfigured =
              rawValue !== undefined && rawValue !== null && rawValue !== "";
            const value =
              sensitive && isConfigured
                ? "****"
                : SystemSettingsRepository.stringifyValue(rawValue);

            return {
              key,
              value,
              isSensitive: sensitive,
              isEncrypted: encryptedKeys.has(key),
              isConfigured,
              comment: exampleDef?.comment ?? "",
              example:
                exampleDef?.example === false
                  ? ""
                  : (exampleDef?.example ?? ""),
              onboardingRequired: exampleDef?.onboardingRequired ?? false,
              onboardingStep: exampleDef?.onboardingStep,
              onboardingGroup: exampleDef?.onboardingGroup,
              fieldType: exampleDef?.fieldType,
              options: exampleDef?.options
                ? [...exampleDef.options]
                : undefined,
              autoGenerate: exampleDef?.autoGenerate,
            };
          });

          const configuredCount = settings.filter((s) => s.isConfigured).length;

          return {
            name,
            configuredCount,
            totalCount: settings.length,
            settings,
          };
        });

      // Check onboarding issues
      const coreModule = modules.find((m) => m.name === "env");
      if (coreModule) {
        const passwordSetting = coreModule.settings.find(
          (s) => s.key === "VIBE_ADMIN_USER_PASSWORD",
        );
        // Check raw env value (not masked) for sentinel
        const { envModules: rawModules } =
          await import("@/app/api/[locale]/system/generated/env");
        const rawEnv = rawModules["env"]?.env as
          | Record<string, string | number | boolean | null | undefined>
          | undefined;
        if (
          rawEnv?.["VIBE_ADMIN_USER_PASSWORD"] ===
          SystemSettingsRepository.DEFAULT_PASSWORD_SENTINEL
        ) {
          onboardingIssues.push(t("errors.defaultPasswordDetected"));
        }
        if (passwordSetting && !passwordSetting.isConfigured) {
          onboardingIssues.push(t("errors.passwordNotConfigured"));
        }
      }

      // Build ordered wizard steps from all settings that have onboardingStep set
      const stepMap = new Map<
        number,
        { step: number; group: string; fields: string[] }
      >();
      for (const mod of modules) {
        for (const setting of mod.settings) {
          if (setting.onboardingStep !== undefined && setting.onboardingGroup) {
            const existing = stepMap.get(setting.onboardingStep);
            if (existing) {
              existing.fields.push(setting.key);
            } else {
              stepMap.set(setting.onboardingStep, {
                step: setting.onboardingStep,
                group: setting.onboardingGroup,
                fields: [setting.key],
              });
            }
          }
        }
      }
      const wizardSteps = [...stepMap.values()].toSorted(
        (a, b) => a.step - b.step,
      );

      const writable = await SystemSettingsRepository.checkWritable();
      const devMode = SystemSettingsRepository.isDevMode();

      return success({
        modules,
        wizardSteps,
        isWritable: writable,
        isDevMode: devMode,
        needsOnboarding: onboardingIssues.length > 0,
        onboardingIssues,
      });
    } catch (error) {
      logger.error("Failed to read system settings", parseError(error));
      return fail({
        message: t("errors.readFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * PATCH — Update .env file with new values
   */
  static async updateSettings(
    data: { settings: Record<string, string> },
    logger: EndpointLogger,
    t: SystemSettingsT,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ResponseType<any>> {
    try {
      const writable = await SystemSettingsRepository.checkWritable();
      if (!writable) {
        return fail({
          message: t("errors.readOnly"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const envPath = SystemSettingsRepository.getEnvFilePath();
      logger.debug(`Writing settings to ${envPath}`);

      // Load env modules to get metadata (comments, defaults, commented flag)
      const { envModules } =
        await import("@/app/api/[locale]/system/generated/env");

      // Build lookup maps: key → example metadata, key → schema field
      const exampleMap = new Map<string, EnvExample>();
      const schemaMap = new Map<string, ZodTypeAny>();
      for (const { examples, schema } of Object.values(envModules)) {
        for (const ex of examples as EnvExample[]) {
          if (!exampleMap.has(ex.key)) {
            exampleMap.set(ex.key, ex);
          }
        }
        for (const [k, fieldSchema] of Object.entries(schema.shape)) {
          if (!schemaMap.has(k)) {
            schemaMap.set(k, fieldSchema as ZodTypeAny);
          }
        }
      }

      // Read existing .env content
      const existingContent = await readFile(envPath, "utf-8");
      const lines = existingContent.split("\n");

      const updatedKeys: string[] = [];
      const skippedKeys: string[] = [];
      const cryptoKey = loadOrCreateKey();
      const settingsToWrite = data.settings;
      const keysToUpdate = new Set(Object.keys(settingsToWrite));

      // Rebuild the file line by line.
      // For keys we're updating: strip the old comment block above them and write
      // fresh comment+value via formatEnvLine. For everything else: keep as-is.
      const outputLines: string[] = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === "") {
          outputLines.push(line);
          i++;
          continue;
        }

        // Detect a commented-out key line: `# KEY=value` or `# KEY="value"`
        // These are distinct from plain comment/description lines.
        const commentedKeyMatch = trimmed.match(/^#\s*([A-Z][A-Z0-9_]*)=/);
        if (commentedKeyMatch) {
          const key = commentedKeyMatch[1];
          if (key && keysToUpdate.has(key)) {
            keysToUpdate.delete(key);
            const rawValue = settingsToWrite[key] ?? "";
            if (
              SystemSettingsRepository.isDefaultValue(key, rawValue, schemaMap)
            ) {
              skippedKeys.push(key);
            } else {
              updatedKeys.push(key);
              outputLines.push(
                SystemSettingsRepository.formatEnvLine(
                  key,
                  rawValue,
                  exampleMap,
                  cryptoKey,
                ),
              );
            }
          } else {
            outputLines.push(line);
          }
          i++;
          continue;
        }

        // Plain comment or description line — check if it belongs to a key we're updating
        if (trimmed.startsWith("#")) {
          // Look ahead past all consecutive comment lines to find the next real line
          let j = i + 1;
          while (
            j < lines.length &&
            (lines[j].trim().startsWith("#") || lines[j].trim() === "")
          ) {
            j++;
          }
          const nextLine = j < lines.length ? lines[j].trim() : "";
          // nextLine is either a plain KEY=value or empty/EOF
          const nextKeyMatch = nextLine.match(/^([A-Z][A-Z0-9_]*)=/);
          const nextKey = nextKeyMatch ? nextKeyMatch[1] : null;

          if (nextKey && keysToUpdate.has(nextKey)) {
            // Skip this comment line — formatEnvLine() will write a fresh comment block
            i++;
            continue;
          }
          outputLines.push(line);
          i++;
          continue;
        }

        // Active key=value line
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) {
          outputLines.push(line);
          i++;
          continue;
        }

        const key = trimmed.slice(0, eqIndex);
        if (keysToUpdate.has(key)) {
          keysToUpdate.delete(key);
          const rawValue = settingsToWrite[key] ?? "";
          if (
            SystemSettingsRepository.isDefaultValue(key, rawValue, schemaMap)
          ) {
            skippedKeys.push(key);
          } else {
            updatedKeys.push(key);
            outputLines.push(
              SystemSettingsRepository.formatEnvLine(
                key,
                rawValue,
                exampleMap,
                cryptoKey,
              ),
            );
          }
        } else {
          outputLines.push(line);
        }
        i++;
      }

      // Append new keys that weren't found in existing file
      for (const key of keysToUpdate) {
        const rawValue = settingsToWrite[key] ?? "";

        // Skip if value equals the schema default
        if (SystemSettingsRepository.isDefaultValue(key, rawValue, schemaMap)) {
          skippedKeys.push(key);
          continue;
        }

        updatedKeys.push(key);
        // Add blank line separator before appending new entries
        if (
          outputLines.length > 0 &&
          outputLines[outputLines.length - 1] !== ""
        ) {
          outputLines.push("");
        }
        outputLines.push(
          SystemSettingsRepository.formatEnvLine(
            key,
            rawValue,
            exampleMap,
            cryptoKey,
          ),
        );
      }

      // Write back
      await writeFile(envPath, outputLines.join("\n"), "utf-8");

      if (skippedKeys.length > 0) {
        logger.debug(
          `Skipped ${skippedKeys.length} keys equal to defaults: ${skippedKeys.join(", ")}`,
        );
      }
      logger.info(
        `Updated ${updatedKeys.length} settings: ${updatedKeys.join(", ")}`,
      );

      return success({
        updated: updatedKeys,
        needsRestart: true,
        resultMessage: t("messages.settingsUpdated"),
      });
    } catch (error) {
      logger.error("Failed to write settings", parseError(error));
      return fail({
        message: t("errors.writeFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the Zod default value for a key if one exists.
   * Returns undefined if no default is defined.
   */
  private static getZodDefault(
    key: string,
    schemaMap: Map<string, ZodTypeAny>,
  ): string | undefined {
    const fieldSchema = schemaMap.get(key);
    if (!fieldSchema) {
      return undefined;
    }
    // Unwrap ZodOptional/ZodDefault layers to find the inner default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let schema: any = fieldSchema;
    while (schema) {
      if (schema._def?.defaultValue !== undefined) {
        const defaultVal = schema._def.defaultValue();
        return defaultVal !== undefined ? String(defaultVal) : undefined;
      }
      // Unwrap ZodOptional, ZodNullable, ZodTransform inner types
      if (schema._def?.innerType) {
        schema = schema._def.innerType;
      } else if (schema._def?.schema) {
        schema = schema._def.schema;
      } else {
        break;
      }
    }
    return undefined;
  }

  /**
   * Check if a value equals the schema default — skip writing if so.
   * This keeps .env clean and lets defaults evolve without stale overrides.
   */
  private static isDefaultValue(
    key: string,
    value: string,
    schemaMap: Map<string, ZodTypeAny>,
  ): boolean {
    const defaultVal = SystemSettingsRepository.getZodDefault(key, schemaMap);
    return defaultVal !== undefined && defaultVal === value;
  }

  /**
   * Format a key=value line with comment block above it (like .env.example).
   * Respects the `commented` flag (commented out but present in file).
   */
  private static formatEnvLine(
    key: string,
    rawValue: string,
    exampleMap: Map<string, EnvExample>,
    cryptoKey: Buffer,
  ): string {
    const ex = exampleMap.get(key);
    const parts: string[] = [];

    if (ex?.comment) {
      parts.push(`# ${ex.comment}`);
    }

    const sensitive = SystemSettingsRepository.isSensitiveKey(
      key,
      ex?.sensitive,
    );
    const encryptedValue = sensitive
      ? encryptEnvValue(rawValue, cryptoKey)
      : rawValue;
    const needsQuotes =
      isEncryptedValue(encryptedValue) ||
      encryptedValue.includes(" ") ||
      encryptedValue.includes("#") ||
      encryptedValue.includes("=");
    const valuePart = needsQuotes
      ? `${key}="${encryptedValue}"`
      : `${key}=${encryptedValue}`;

    // commented fields are written as active lines when explicitly set by user
    parts.push(valuePart);

    return parts.join("\n");
  }
}

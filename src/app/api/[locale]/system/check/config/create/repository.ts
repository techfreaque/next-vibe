/**
 * Config Create Repository
 * Handles interactive and non-interactive creation of check.config.ts
 */

import "server-only";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { ConfigRepositoryImpl } from "../repository";
import type {
  ConfigCreateRequestOutput,
  ConfigCreateResponseOutput,
} from "./definition";
import type { ConfigCreateT } from "./i18n";

export class ConfigCreateRepository {
  static async execute(
    data: ConfigCreateRequestOutput,
    logger: EndpointLogger,
    t: ConfigCreateT,
    platform: Platform,
    locale: CountryLanguage,
  ): Promise<ResponseType<ConfigCreateResponseOutput>> {
    logger.debug("[Config Create] Repository received data", {
      data,
      platform,
    });

    try {
      // Check if config already exists
      const configPath = resolve(process.cwd(), "check.config.ts");
      if (existsSync(configPath)) {
        return fail({
          message: t("errors.conflict.title"),
          messageParams: {
            path: configPath,
          },
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Interactive mode is handled by the CLI widget (widget.cli.tsx).
      // By the time this repository runs, data already contains the resolved
      // boolean values from the wizard - no prompts needed here.

      // Create check.config.ts with user-selected options
      const configResult = await ConfigRepositoryImpl.createDefaultCheckConfig(
        logger,
        locale,
      );

      if (!configResult.success) {
        return fail({
          message: t("errors.configCreation"),
          messageParams: { error: configResult.message || "Unknown error" },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Modify the created config to reflect user choices
      const createdConfigPath = configResult.data.configPath;
      const { readFileSync, writeFileSync } = await import("node:fs");
      let configContent = readFileSync(createdConfigPath, "utf-8");

      // Apply feature flags based on user input
      if (data.enableReactRules !== undefined) {
        configContent = configContent.replace(
          /react: true,/g,
          `react: ${data.enableReactRules},`,
        );
        configContent = configContent.replace(
          /reactCompiler: true,/g,
          `reactCompiler: ${data.enableReactRules},`,
        );
        configContent = configContent.replace(
          /accessibility: true,/g,
          `accessibility: ${data.enableReactRules},`,
        );
      }

      if (data.enableNextjsRules !== undefined) {
        configContent = configContent.replace(
          /nextjs: true,/g,
          `nextjs: ${data.enableNextjsRules},`,
        );
      }

      if (data.enableI18nRules !== undefined) {
        configContent = configContent.replace(
          /i18n: true,/g,
          `i18n: ${data.enableI18nRules},`,
        );
      }

      if (data.jsxCapitalization !== undefined) {
        configContent = configContent.replace(
          /jsxCapitalization: true,/g,
          `jsxCapitalization: ${data.jsxCapitalization},`,
        );
      }

      if (data.enablePedanticRules !== undefined) {
        configContent = configContent.replace(
          /pedantic: false,/g,
          `pedantic: ${data.enablePedanticRules},`,
        );
      }

      if (data.enableRestrictedSyntax !== undefined) {
        configContent = configContent.replace(
          /restrictedSyntax: true,/g,
          `restrictedSyntax: ${data.enableRestrictedSyntax},`,
        );
      }

      // Write the modified config back
      writeFileSync(createdConfigPath, configContent, "utf-8");

      let mcpConfigPath: string | undefined;
      let vscodeSettingsPath: string | undefined;

      // Create MCP config if requested
      if (data.createMcpConfig) {
        const mcpResult = await ConfigRepositoryImpl.createDefaultMcpConfig(
          logger,
          ".mcp.json",
          locale,
        );
        if (mcpResult.success) {
          mcpConfigPath = mcpResult.data.mcpConfigPath;
        } else {
          logger.warn(t("warnings.mcpConfigFailed"), {
            error: mcpResult.message,
          });
        }

        const mcpCursorResult =
          await ConfigRepositoryImpl.createDefaultMcpConfig(
            logger,
            ".cursor/mcp.json",
            locale,
          );
        if (mcpCursorResult.success) {
          mcpConfigPath = mcpCursorResult.data.mcpConfigPath;
        } else {
          logger.warn(t("warnings.mcpConfigFailed"), {
            error: mcpCursorResult.message,
          });
        }

        const mcpVscodeResult =
          await ConfigRepositoryImpl.createDefaultMcpConfig(
            logger,
            ".vscode/mcp.json",
            locale,
          );
        if (mcpVscodeResult.success) {
          mcpConfigPath = mcpVscodeResult.data.mcpConfigPath;
        } else {
          logger.warn(t("warnings.mcpConfigFailed"), {
            error: mcpVscodeResult.message,
          });
        }
      }

      // Update VSCode settings if requested
      if (data.updateVscodeSettings) {
        // Load the created config to get settings
        const configReadResult = await ConfigRepositoryImpl.ensureConfigReady(
          logger,
          locale,
          false,
        );
        if (configReadResult.ready) {
          const vscodeResult =
            await ConfigRepositoryImpl.generateVSCodeSettings(
              logger,
              configReadResult.config,
              locale,
            );

          if (vscodeResult.success) {
            vscodeSettingsPath = vscodeResult.data.settingsPath;
          } else {
            logger.warn(t("warnings.vscodeFailed"), {
              error: vscodeResult.message,
            });
          }
        }
      }

      let packageJsonPath: string | undefined;

      // Update package.json scripts if requested
      if (data.updatePackageJson) {
        const pkgPath = resolve(process.cwd(), "package.json");
        if (existsSync(pkgPath)) {
          try {
            const packageJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
            packageJson.scripts = {
              ...packageJson.scripts,
              check: "v c",
              lint: "v c",
              typecheck: "v c",
            };
            writeFileSync(pkgPath, `${JSON.stringify(packageJson, null, 2)}\n`);
            packageJsonPath = pkgPath;
          } catch (error) {
            logger.warn(t("warnings.packageJsonFailed"), {
              error: parseError(error).message,
            });
          }
        } else {
          logger.warn(t("warnings.packageJsonNotFound"));
        }
      }

      // Build success message
      const messages: string[] = [`✓ Created ${configResult.data.configPath}`];

      if (mcpConfigPath) {
        messages.push(`✓ Created ${mcpConfigPath}`);
      }

      if (vscodeSettingsPath) {
        messages.push(`✓ Updated ${vscodeSettingsPath}`);
      }

      if (packageJsonPath) {
        messages.push(`✓ Updated ${packageJsonPath}`);
      }

      return success({
        message: messages.join("\n"),
      });
    } catch (error) {
      logger.error(t("errors.unexpected"), parseError(error));
      return fail({
        message: t("errors.unexpected"),
        messageParams: { error: parseError(error).message },
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Config Create Repository
 * Handles interactive and non-interactive creation of check.config.ts
 */

import "server-only";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { confirm } from "@inquirer/prompts";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { isCliPlatform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { configRepository } from "../repository";
import type {
  ConfigCreateRequestOutput,
  ConfigCreateResponseOutput,
} from "./definition";

export class ConfigCreateRepository {
  static async execute(
    data: ConfigCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    platform?: Platform,
  ): Promise<ResponseType<ConfigCreateResponseOutput>> {
    const { t } = simpleT(locale);
    const isCLI = platform ? isCliPlatform(platform) : false;

    logger.debug("[Config Create] Repository received data", {
      data,
      interactive: data.interactive,
      interactiveType: typeof data.interactive,
      platform,
      isCLI,
    });

    try {
      // Check if config already exists
      const configPath = resolve(process.cwd(), "check.config.ts");
      if (existsSync(configPath)) {
        return fail({
          message: "app.api.system.check.config.create.errors.conflict.title",
          messageParams: {
            path: configPath,
          },
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // If interactive mode and CLI platform, ask step by step
      if (data.interactive && isCLI) {
        // oxlint-disable-next-line no-console
        console.log(`\n${"═".repeat(60)}`);
        // oxlint-disable-next-line no-console
        console.log(
          `  🔧 ${t("app.api.system.check.config.create.interactive.welcome")}`,
        );
        // oxlint-disable-next-line no-console
        console.log("═".repeat(60));
        // oxlint-disable-next-line no-console
        console.log(
          `  ${t("app.api.system.check.config.create.interactive.description")}`,
        );
        // oxlint-disable-next-line no-console
        console.log(`${"═".repeat(60)}\n`);

        // Ask each question step by step
        data.createMcpConfig = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.createMcpConfig",
          ),
          default: data.createMcpConfig,
        });

        data.updateVscodeSettings = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.updateVscodeSettings",
          ),
          default: data.updateVscodeSettings,
        });

        data.enableReactRules = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.enableReactRules",
          ),
          default: data.enableReactRules,
        });

        data.enableNextjsRules = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.enableNextjsRules",
          ),
          default: data.enableNextjsRules,
        });

        data.enableI18nRules = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.enableI18nRules",
          ),
          default: data.enableI18nRules,
        });

        data.jsxCapitalization = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.jsxCapitalization",
          ),
          default: data.jsxCapitalization,
        });

        data.enablePedanticRules = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.enablePedanticRules",
          ),
          default: data.enablePedanticRules,
        });

        data.enableRestrictedSyntax = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.enableRestrictedSyntax",
          ),
          default: data.enableRestrictedSyntax,
        });

        data.updatePackageJson = await confirm({
          message: t(
            "app.api.system.check.config.create.interactive.updatePackageJson",
          ),
          default: data.updatePackageJson,
        });
      }

      // Create check.config.ts with user-selected options
      const configResult =
        await configRepository.createDefaultCheckConfig(logger);

      if (!configResult.success) {
        return fail({
          message: "app.api.system.check.config.create.errors.configCreation",
          messageParams: { error: configResult.error || "Unknown error" },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Modify the created config to reflect user choices
      const createdConfigPath = configResult.configPath;
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
        const mcpResult = await configRepository.createDefaultMcpConfig(
          logger,
          ".mcp.json",
        );
        if (mcpResult.success) {
          mcpConfigPath = mcpResult.mcpConfigPath;
        } else {
          logger.warn(
            t("app.api.system.check.config.create.warnings.mcpConfigFailed"),
            {
              error: mcpResult.error,
            },
          );
        }

        const mcpCursorResult = await configRepository.createDefaultMcpConfig(
          logger,
          ".cursor/mcp.json",
        );
        if (mcpCursorResult.success) {
          mcpConfigPath = mcpCursorResult.mcpConfigPath;
        } else {
          logger.warn(
            t("app.api.system.check.config.create.warnings.mcpConfigFailed"),
            {
              error: mcpCursorResult.error,
            },
          );
        }

        const mcpVscodeResult = await configRepository.createDefaultMcpConfig(
          logger,
          ".vscode/mcp.json",
        );
        if (mcpVscodeResult.success) {
          mcpConfigPath = mcpVscodeResult.mcpConfigPath;
        } else {
          logger.warn(
            t("app.api.system.check.config.create.warnings.mcpConfigFailed"),
            {
              error: mcpVscodeResult.error,
            },
          );
        }
      }

      // Update VSCode settings if requested
      if (data.updateVscodeSettings) {
        // Load the created config to get settings
        const configReadResult =
          await configRepository.ensureConfigReady(logger);
        if (configReadResult.ready) {
          const vscodeResult = await configRepository.generateVSCodeSettings(
            logger,
            configReadResult.config,
          );

          if (vscodeResult.success) {
            vscodeSettingsPath = vscodeResult.settingsPath;
          } else {
            logger.warn(
              t("app.api.system.check.config.create.warnings.vscodeFailed"),
              {
                error: vscodeResult.error,
              },
            );
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
            logger.warn(
              t(
                "app.api.system.check.config.create.warnings.packageJsonFailed",
              ),
              {
                error: parseError(error).message,
              },
            );
          }
        } else {
          logger.warn(
            t(
              "app.api.system.check.config.create.warnings.packageJsonNotFound",
            ),
          );
        }
      }

      // Build success message
      const messages: string[] = [`✓ Created ${configResult.configPath}`];

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
      logger.error(
        t("app.api.system.check.config.create.errors.unexpected"),
        parseError(error),
      );
      return fail({
        message: "app.api.system.check.config.create.errors.unexpected",
        messageParams: { error: parseError(error).message },
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

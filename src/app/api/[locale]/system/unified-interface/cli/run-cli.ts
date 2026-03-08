/**
 * Shared CLI runner — used by both vibe-runtime and package entry points.
 *
 * Accepts a name, optional default endpoint, and optional scoped getEndpoint
 * function. All entry points set these then call runCli().
 */

import { Command } from "commander";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { pathToAliasMap } from "@/app/api/[locale]/system/generated/alias-map";
import { DEFAULT_PROJECT_URL } from "@/config/constants";
import { enableDebug, enableMcpSilentMode } from "@/config/debug";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  DefinitionLoader,
  type GetEndpointFn,
  type IDefinitionLoader,
} from "../shared/endpoints/definition/loader";
import {
  DefinitionsRegistry,
  type IDefinitionsRegistry,
} from "../shared/endpoints/definitions/registry";
import { createEndpointLogger } from "../shared/logger/endpoint";
import { Platform } from "../shared/types/platform";
import { scopedTranslation as cliScopedTranslation } from "./i18n";
import { type EnvironmentResult, loadEnvironment } from "./runtime/environment";
import {
  ErrorHandler,
  setupGlobalErrorHandlers,
} from "./runtime/execution-errors";
import {
  CliInputParser,
  type CliRequestData,
  type ParsedCliData,
} from "./runtime/parsing";
import {
  type CliCompatiblePlatform,
  RouteDelegationHandler,
} from "./runtime/route-executor";
import { CliTarget, type CliTargetValue } from "./types/cli-target";

export const binaryStartTime = Date.now();

/**
 * Attempt to resolve a file-system path to a canonical tool name.
 *
 * Accepts any of:
 *   src/app/api/[locale]/agent/models/openrouter/route.ts
 *   src/app/api/[locale]/agent/models/openrouter/definition.ts
 *   src/app/api/[locale]/agent/models/openrouter/repository.ts
 *   src/app/api/[locale]/agent/models/openrouter
 *
 * Returns { canonical, alias } on success, null if not a path or not found.
 * Tries GET, POST, PUT, PATCH in that order.
 */
function resolveCommandFromPath(
  input: string,
): { canonical: string; alias: string } | null {
  // Only attempt resolution if the input looks like a file path (contains /)
  if (!input.includes("/")) {
    return null;
  }

  // Strip known file suffixes
  let normalized = input
    .replace(/\/(route|definition|repository)\.ts$/, "")
    .replace(/\.ts$/, "");

  // Extract the part after [locale]/ if present
  const localeMarker = "[locale]/";
  const localeIdx = normalized.indexOf(localeMarker);
  if (localeIdx !== -1) {
    normalized = normalized.slice(localeIdx + localeMarker.length);
  } else {
    // Fallback: strip common prefix patterns like src/app/api/en/
    normalized = normalized.replace(/^.*\/api\/[^/]+\//, "");
  }

  // Convert path separators and dynamic segments to underscores
  // e.g. "agent/models/openrouter" → "agent_models_openrouter"
  // e.g. "agent/chat/threads/[threadId]" → "agent_chat_threads_threadId"
  const base = normalized
    .split("/")
    .map((seg) => seg.replaceAll(/\[|\]/g, ""))
    .join("_");

  const methods = ["GET", "POST", "PUT", "PATCH"] as const;
  for (const method of methods) {
    const canonical = `${base}_${method}`;
    if (canonical in pathToAliasMap) {
      const alias = pathToAliasMap[canonical as keyof typeof pathToAliasMap];
      return { canonical, alias };
    }
  }

  return null;
}

const environmentResult: EnvironmentResult = loadEnvironment();
export const cliPlatform = environmentResult.platform;
export const isCliPackage: boolean = environmentResult.isPackage;
export const projectRoot: string | null = environmentResult.projectRoot;

interface CliOptions {
  data?: string;
  locale: CountryLanguage;
  output?: "json" | "pretty";
  verbose?: boolean;
  debug?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
  platform?: Platform;
  local?: boolean;
  preview?: boolean;
  remote?: boolean;
}

const CLI_VERSION = "3.0.0" as const;
const DEFAULT_OUTPUT = "pretty" as const;

export interface RunCliOptions {
  /** Binary name shown in help (e.g. "vibe" or "vibe-check") */
  name: string;
  /**
   * Alias invoked when the binary is called with no arguments.
   * When omitted, bare invocation shows the help/command list.
   */
  defaultEndpoint?: string;
  /**
   * Custom endpoint resolver — pass a scoped getEndpoint for standalone packages.
   * Defaults to the global generated endpoint registry.
   */
  getEndpoint?: GetEndpointFn;
}

export function runCli({
  name,
  defaultEndpoint,
  getEndpoint,
}: RunCliOptions): void {
  const loader: IDefinitionLoader | undefined = getEndpoint
    ? new DefinitionLoader(getEndpoint)
    : undefined;

  // Scoped definitions registry for packages — lists only the package's endpoints.
  // Uses the scoped alias-map to enumerate canonical paths, then resolves each via getEndpoint.
  const defRegistry: IDefinitionsRegistry | undefined = getEndpoint
    ? new DefinitionsRegistry(async () => {
        const { pathToAliasMap: scopedAliasMap } =
          await import("@/app/api/[locale]/system/generated/alias-map");
        const canonical = new Set(Object.values(scopedAliasMap));
        const results = await Promise.all(
          [...canonical].map((path) => getEndpoint(path)),
        );
        return results.filter(
          (d): d is NonNullable<Awaited<ReturnType<GetEndpointFn>>> =>
            d !== null,
        );
      })
    : undefined;

  const cliLocale = (process.env["VIBE_CLI_LOCALE"] ??
    defaultLocale) as typeof defaultLocale;
  const { t: earlyT } = cliScopedTranslation.scopedT(cliLocale);

  const program = new Command();

  program
    .name(name)
    .description(earlyT("vibe.help.description"))
    .version(CLI_VERSION);

  program
    .argument("[command]", earlyT("vibe.help.usage"))
    .argument("[args...]", earlyT("vibe.help.commands"))
    .option("-d, --data <json>", earlyT("vibe.executeCommand"))
    .option("-l, --locale <locale>", earlyT("vibe.help.locale"), cliLocale)
    .option("-o, --output <format>", earlyT("vibe.output"), DEFAULT_OUTPUT)
    .option("-v, --verbose", earlyT("vibe.help.verbose"), false) // eslint-disable-line i18next/no-literal-string
    .option("-x, --debug", earlyT("vibe.help.verbose"), false) // eslint-disable-line i18next/no-literal-string
    .option("-i, --interactive", earlyT("vibe.help.interactive"), false)
    .option("--dry-run", earlyT("vibe.help.dryRun"), false)
    .option("--local", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
    .option("--preview", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
    .option("--remote", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
    .option(
      "--platform <platform>", // eslint-disable-line i18next/no-literal-string
      `Override detected platform. Valid values: ${Object.values(Platform).join(", ")}`, // eslint-disable-line i18next/no-literal-string
    )
    .helpOption(false)
    .allowUnknownOption()
    .action(
      async (
        rawCommand: string | undefined,
        args: string[],
        options: CliOptions,
        cmd: Record<string, string | number | boolean>,
      ) => {
        // If no command and a default endpoint is configured, route there directly
        let command = rawCommand;
        if (!command && defaultEndpoint) {
          command = defaultEndpoint;
        }

        // If command looks like a file path, resolve it to a canonical tool name
        if (command) {
          const resolved = resolveCommandFromPath(command);
          if (resolved) {
            const hint =
              resolved.alias !== resolved.canonical
                ? `  vibe ${resolved.alias}`
                : `  vibe ${resolved.canonical}`;
            // Use process.stderr so it shows even in --output json mode
            process.stderr.write(
              `[hint] Resolved path to tool "${resolved.canonical}". Next time use:\n${hint}\n`,
            );
            command = resolved.canonical;
          }
        }

        if (command === "mcp") {
          enableMcpSilentMode();
          const envProjectRoot = process.env.PROJECT_ROOT;
          if (envProjectRoot) {
            process.chdir(envProjectRoot);
          }
        }

        const cliCompatibleValues: CliCompatiblePlatform[] = [
          Platform.CLI,
          Platform.CLI_PACKAGE,
          Platform.MCP,
        ];
        const platformOverride = options.platform
          ? (cliCompatibleValues.find((v) => v === options.platform) ?? null)
          : null;
        const effectivePlatform: CliCompatiblePlatform =
          platformOverride ?? cliPlatform;

        const targetArg: CliTargetValue = options.remote
          ? CliTarget.REMOTE
          : options.local || options.preview
            ? CliTarget.LOCAL
            : CliTarget.DEV;
        let cliTarget: CliTargetValue;
        let resolvedRemoteUrl: string | undefined;

        if (targetArg === CliTarget.REMOTE) {
          cliTarget = CliTarget.REMOTE;
          resolvedRemoteUrl =
            process.env["VIBE_REMOTE_URL"] || DEFAULT_PROJECT_URL;
          resolvedRemoteUrl = resolvedRemoteUrl.replace(/\/+$/, "");
        } else if (
          targetArg === CliTarget.LOCAL ||
          process.env["IS_PREVIEW_MODE"] === "true"
        ) {
          cliTarget = CliTarget.LOCAL;
        } else {
          cliTarget = CliTarget.DEV;
        }

        const debug = options.debug || options.verbose;
        const logger = createEndpointLogger(
          debug ?? false,
          Date.now(),
          options.locale,
        );
        const { t } = cliScopedTranslation.scopedT(options.locale);
        setupGlobalErrorHandlers(logger);

        if (debug) {
          logger.debug(
            `[CLI] Executing command: ${command} ${(args || []).join(" ")} (verbose: ${debug}, interactive: ${options.interactive ?? false})`,
          );
          enableDebug();
        }

        const { cliResourceManager } = await import("./runtime/debug");
        await cliResourceManager.initialize(logger, options.locale);
        const performanceMonitor = cliResourceManager.getPerformanceMonitor();

        try {
          performanceMonitor.mark("initStart");
          performanceMonitor.mark("initEnd");

          if (
            options.interactive &&
            (!command ||
              command === "help" ||
              command === "h" ||
              command === "-i")
          ) {
            const { getCliUser } = await import("./auth/cli-user");
            const { HelpRepository } =
              await import("@/app/api/[locale]/system/help/repository");
            const userResult = await getCliUser(logger, options.locale);
            const user = userResult.success ? userResult.data : undefined;
            await HelpRepository.startInteractive(
              user,
              options.locale,
              effectivePlatform,
            );
            await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
              success: true,
            });
            return;
          }

          if (
            !command ||
            command === "-h" ||
            command === "--help" ||
            command === "-?"
          ) {
            performanceMonitor.mark("routeStart");
            const helpResult = await RouteDelegationHandler.executeRoute(
              "help",
              {
                data: undefined,
                urlPathParams: undefined,
                cliArgs: { positionalArgs: [], namedArgs: {} },
                locale: options.locale,
                platform: effectivePlatform,
                output: options.output ?? DEFAULT_OUTPUT,
                verbose: debug ?? false,
                interactive: options.interactive ?? false,
                dryRun: options.dryRun ?? false,
                cliTarget,
                remoteUrl: resolvedRemoteUrl,
              },
              logger,
              loader,
            );
            performanceMonitor.mark("routeEnd");
            performanceMonitor.mark("renderStart");
            if (helpResult.formattedOutput) {
              await new Promise<void>((resolve) => {
                process.stdout.write(`${helpResult.formattedOutput}\n`, () => {
                  resolve();
                });
              });
            }
            performanceMonitor.mark("renderEnd");
            await cliResourceManager.cleanupAndExit(
              logger,
              debug ?? false,
              helpResult,
            );
            return;
          }

          if (
            args?.includes("-h") ||
            args?.includes("--help") ||
            args?.includes("-?")
          ) {
            performanceMonitor.mark("routeStart");
            const helpResult = await RouteDelegationHandler.executeRoute(
              "help",
              {
                data: undefined,
                urlPathParams: undefined,
                cliArgs: { positionalArgs: [command], namedArgs: {} },
                locale: options.locale,
                platform: effectivePlatform,
                output: options.output ?? DEFAULT_OUTPUT,
                verbose: debug ?? false,
                interactive: options.interactive ?? false,
                dryRun: options.dryRun ?? false,
                cliTarget,
                remoteUrl: resolvedRemoteUrl,
              },
              logger,
              loader,
            );
            performanceMonitor.mark("routeEnd");
            performanceMonitor.mark("renderStart");
            if (helpResult.formattedOutput) {
              await new Promise<void>((resolve) => {
                process.stdout.write(`${helpResult.formattedOutput}\n`, () => {
                  resolve();
                });
              });
            }
            performanceMonitor.mark("renderEnd");
            await cliResourceManager.cleanupAndExit(
              logger,
              debug ?? false,
              helpResult,
            );
            return;
          }

          const cmdWithParent = cmd as { parent?: { rawArgs?: string[] } };
          const rawArgs = cmdWithParent.parent?.rawArgs;
          const parsedArgs = rawArgs
            ? CliInputParser.parseCliArguments(args || [], rawArgs, logger)
            : CliInputParser.parseCliArgumentsSimple(args || []);
          const commandIndex = rawArgs
            ? rawArgs.findIndex((a) => a === command)
            : -1;
          const rawTokens =
            rawArgs && commandIndex >= 0
              ? rawArgs.slice(commandIndex + 1)
              : args || [];

          performanceMonitor.mark("parseStart");
          let parsedData: ParsedCliData | undefined;
          if (options.data) {
            try {
              parsedData = JSON.parse(options.data.trim()) as ParsedCliData;
            } catch {
              parsedData = {};
            }
          }
          performanceMonitor.mark("parseEnd");

          // For the MCP command in a package context, bypass the route executor and
          // start the MCP server directly so it uses the scoped registries.
          if (command === "mcp" && (loader || defRegistry)) {
            performanceMonitor.mark("routeStart");
            const { mcpServeRepository } =
              await import("@/app/api/[locale]/system/unified-interface/mcp/serve/repository");
            await mcpServeRepository.startServer(
              logger,
              options.locale,
              undefined,
              defRegistry,
              loader,
            );
            performanceMonitor.mark("routeEnd");
            await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
              success: true,
            });
            return;
          }

          performanceMonitor.mark("routeStart");
          const result = await RouteDelegationHandler.executeRoute(
            command,
            {
              data: parsedData as CliRequestData | undefined,
              urlPathParams: undefined,
              cliArgs: {
                positionalArgs: parsedArgs.positionalArgs,
                namedArgs: parsedArgs.namedArgs,
                rawTokens,
              },
              locale: options.locale,
              platform: effectivePlatform,
              output: options.output ?? DEFAULT_OUTPUT,
              verbose: debug ?? false,
              interactive: options.interactive ?? false,
              dryRun: options.dryRun ?? false,
              cliTarget,
              remoteUrl: resolvedRemoteUrl,
            },
            logger,
            loader,
          );
          performanceMonitor.mark("routeEnd");

          performanceMonitor.mark("renderStart");
          if (result.formattedOutput && command !== "mcp") {
            await new Promise<void>((resolve) => {
              process.stdout.write(`${result.formattedOutput}\n`, () => {
                resolve();
              });
            });
          }
          performanceMonitor.mark("renderEnd");

          await cliResourceManager.cleanupAndExit(
            logger,
            debug ?? false,
            result,
          );
        } catch (error) {
          const handled = ErrorHandler.handleError(parseError(error), logger);
          logger.error(handled.message);
          if (debug) {
            logger.error(t("vibe.errors.executionFailed"), parseError(error));
          }
          await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
            success: false,
            error: t("vibe.errors.executionFailed"),
            errorParams: { error: handled.message },
          });
          process.exit(handled.exitCode);
        }
      },
    );

  program.parse();
}

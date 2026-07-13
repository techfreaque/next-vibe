/**
 * Shared CLI runner - used by both vibe-runtime and package entry points.
 *
 * Accepts a name, optional default endpoint, and optional scoped getEndpoint
 * function. All entry points set these then call runCli().
 */

// environment must be the FIRST import — its module-level loadEnvironment() call
// sets process.env (NODE_ENV, NEXT_PUBLIC_AGENT_*, DATABASE_URL overrides) before
// any other module that reads those values (env-client, constants, etc.) is evaluated.
import { Command } from "commander";
import {
  DefinitionLoader,
  type GetEndpointFn,
  type IDefinitionLoader,
} from "next-vibe/core/definition/loader";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { enableMcpSilentMode } from "next-vibe/logger/debug";
import { createEndpointLogger } from "next-vibe/logger/server";
import { scopedTranslation as cliScopedTranslation } from "next-vibe/platforms/cli/i18n";
import {
  type EnvironmentResult,
  loadEnvironment,
} from "next-vibe/platforms/cli/runtime/environment";
import {
  ErrorHandler,
  setupGlobalErrorHandlers,
} from "next-vibe/platforms/cli/runtime/execution-errors";
import { CliInputParser } from "next-vibe/platforms/cli/runtime/parsing";
import {
  type CliCompatiblePlatform,
  RouteDelegationHandler,
} from "next-vibe/platforms/cli/runtime/route-executor";
import {
  CliTarget,
  type CliTargetValue,
} from "next-vibe/platforms/cli/types/cli-target";
import {
  DefinitionsRegistry,
  type IDefinitionsRegistry,
} from "next-vibe/platforms/definitions-registry";

import { DEFAULT_PROJECT_URL } from "@/env/constants";
import { env } from "@/env/env";
import { pathToAliasMap } from "@/generated/endpoints/alias-map";

export const binaryStartTime = Date.now();

/**
 * Attempt to resolve a file-system path to a canonical tool name.
 *
 * Accepts any of:
 *   src/vibe/agent/models/openrouter/route.ts
 *   src/vibe/agent/models/openrouter/definition.ts
 *   src/vibe/agent/models/openrouter/repository.ts
 *   src/vibe/agent/models/openrouter
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
const cliPlatform = environmentResult.platform;
export const projectRoot: string | null = environmentResult.projectRoot;

interface CliOptions {
  data?: string;
  locale: CountryLanguage;
  output?: "json" | "pretty";
  verbose?: boolean;
  debug?: boolean;
  interactive?: boolean;
  agentControl?: boolean;
  dryRun?: boolean;
  platform?: Platform;
  hermes?: boolean;
  preview?: boolean;
  thea?: boolean;
}

const CLI_VERSION = "3.3.3" as const;
const DEFAULT_OUTPUT = "pretty" as const;

interface RunCliOptions {
  /** Binary name shown in help (e.g. "vibe" or "vibe-check") */
  name: string;
  /**
   * Alias invoked when the binary is called with no arguments.
   * When omitted, bare invocation shows the help/command list.
   */
  defaultEndpoint?: string;
  /**
   * Custom endpoint resolver - pass a scoped getEndpoint for standalone packages.
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

  // Scoped definitions registry for packages - lists only the package's endpoints.
  // Uses the scoped alias-map to enumerate canonical paths, then resolves each via getEndpoint.
  const defRegistry: IDefinitionsRegistry | undefined = getEndpoint
    ? new DefinitionsRegistry()
    : undefined;

  const cliLocale = env.VIBE_CLI_LOCALE;
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
    .option(
      "--agent-control",
      "Enable file-based IPC for AI agent control (frame capture + key injection)",
      false,
    ) // eslint-disable-line i18next/no-literal-string
    .option("--dry-run", earlyT("vibe.help.dryRun"), false)
    .option("--hermes", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
    .option("--preview", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
    .option("--thea", earlyT("vibe.help.target"), false) // eslint-disable-line i18next/no-literal-string
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
        // If no command and a default endpoint is configured, route there directly.
        // Also: if a defaultEndpoint is set and the first positional arg doesn't
        // match any known tool/alias (e.g. `vibe-check src/`), treat it as an
        // argument to the default endpoint rather than an unknown command.
        let command = rawCommand;
        if (!command && defaultEndpoint) {
          command = defaultEndpoint;
        } else if (
          command &&
          defaultEndpoint &&
          getEndpoint &&
          command !== "mcp" &&
          command !== "help" &&
          command !== "h" &&
          !(await getEndpoint(command))
        ) {
          // rawCommand is not a known tool - treat it as the first path arg
          args = [command, ...args];
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

        // --platform is a runtime-wide override of the platform reported to the
        // handler. Accept ANY valid Platform (e.g. `ai`, `mcp`) so callers can
        // inspect exactly what each surface receives. Auth still runs as the real
        // CLI user — only the reported platform changes.
        const platformOverride: Platform | null = options.platform
          ? ((Object.values(Platform) as Platform[]).find(
              (v) => v === options.platform,
            ) ?? null)
          : null;
        const effectivePlatform: Platform = platformOverride ?? cliPlatform;

        // Interactive mode (Ink terminal explorer) is CLI/MCP-only. Coerce any
        // non-CLI override back to the real CLI platform for that path.
        const interactivePlatform: CliCompatiblePlatform =
          effectivePlatform === Platform.CLI ||
          effectivePlatform === Platform.CLI_PACKAGE ||
          effectivePlatform === Platform.MCP
            ? effectivePlatform
            : cliPlatform;

        const targetArg: CliTargetValue = options.thea
          ? CliTarget.REMOTE
          : options.hermes || options.preview
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
        const logger = createEndpointLogger(debug ?? false, options.locale);
        const { t } = cliScopedTranslation.scopedT(options.locale);
        // For MCP, the server sets up its own non-exit error handlers.
        // The CLI's exit-on-error handlers would kill the process on any tool call error.
        if (command !== "mcp") {
          setupGlobalErrorHandlers(logger);
        }

        if (debug) {
          logger.debug(
            `[CLI] Executing command: ${command} ${(args || []).join(" ")} (verbose: ${debug}, interactive: ${options.interactive ?? false})`,
          );
        }

        const { cliResourceManager } =
          await import("next-vibe/platforms/cli/runtime/debug");
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
            const { getCliUser } =
              await import("next-vibe/platforms/cli/auth/cli-user");
            const { HelpRepository } =
              await import("next-vibe/help-tool/repository");
            const userResult = await getCliUser(logger, options.locale);
            const user = userResult.success ? userResult.data : undefined;
            await HelpRepository.startInteractive(
              user,
              options.locale,
              interactivePlatform,
            );
            await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
              success: true,
            });
            return;
          }

          // Wire SIGINT → AbortController so long-running child processes
          // (e.g. vibe check) are cancelled when the user presses Ctrl+C
          const cliAbortController = new AbortController();
          const sigintHandler = (): void => {
            cliAbortController.abort(new Error("SIGINT"));
          };
          process.once("SIGINT", sigintHandler);

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
                agentControl: options.agentControl ?? false,
                dryRun: options.dryRun ?? false,
                cliTarget,
                remoteUrl: resolvedRemoteUrl,
                signal: cliAbortController.signal,
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
                agentControl: options.agentControl ?? false,
                dryRun: options.dryRun ?? false,
                cliTarget,
                remoteUrl: resolvedRemoteUrl,
                signal: cliAbortController.signal,
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
          let parsedData: Record<string, WidgetData> | undefined;
          if (options.data) {
            try {
              parsedData = JSON.parse(options.data.trim()) as Record<
                string,
                WidgetData
              >;
            } catch {
              parsedData = {};
            }
          }
          performanceMonitor.mark("parseEnd");

          // For the MCP command in a package context, bypass the route executor and
          // start the MCP server directly so it uses the scoped registries.
          if (command === "mcp" && (loader || defRegistry)) {
            performanceMonitor.mark("routeStart");
            const { MCPServeRepository } =
              await import("next-vibe/platforms/mcp/serve/repository");
            const mcpPublicUser: JwtPayloadType = {
              isPublic: true,
              leadId: "00000000-0000-0000-0000-000000000000",
              roles: ["enums.userRole.public"],
            };
            await MCPServeRepository.startServer(
              logger,
              options.locale,
              mcpPublicUser,
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

          // Some commands are always interactive (no non-interactive mode)
          const ALWAYS_INTERACTIVE = new Set(["init", "set-setting"]);
          const forceInteractive =
            options.interactive || ALWAYS_INTERACTIVE.has(command ?? "");

          logger.debug("[CLI] routeStart");
          performanceMonitor.mark("routeStart");
          const result = await RouteDelegationHandler.executeRoute(
            command,
            {
              data: parsedData,
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
              interactive: forceInteractive,
              agentControl: options.agentControl ?? false,
              dryRun: options.dryRun ?? false,
              cliTarget,
              remoteUrl: resolvedRemoteUrl,
              signal: cliAbortController.signal,
            },
            logger,
            loader,
          ).finally(() => {
            process.off("SIGINT", sigintHandler);
          });
          performanceMonitor.mark("routeEnd");

          // If aborted (Ctrl+C), skip rendering and exit cleanly with no output
          if (cliAbortController.signal.aborted) {
            await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
              success: true,
            });
            return;
          }

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

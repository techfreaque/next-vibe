/**
 * Websocket-channel and remote-event emitters for the route-handlers generator.
 *
 * Split out of `generator-route-handlers.ts` because both outputs are OPTIONAL.
 * `ws-channels.ts` (the subscribe-side channel registry) and
 * `remote-event-routes.ts` (the bridge dispatch's force-load registry) only
 * exist for installs that run a websocket server and a remote-event bridge. A
 * CLI/MCP-only install generates neither, and previously had to fork the whole
 * 1143-line generator to say so — the route-handlers emitter itself is
 * identical either way.
 *
 * `run()` is the single seam: it validates the channel guards, writes both
 * files, and reports the channel count. A build without realtime never calls it.
 */

import "server-only";

import { parseError } from "../../utils/parse-error";
import type { GenericHandlerBase } from "../../route/handler";
import type { EndpointLogger } from "../../../logger/types";
import { formatWarning } from "../../../logger/formatters";

import {
  extractNestedPath,
  generateAbsoluteImportPath,
  generateFileHeader,
  getRelativeImportPath,
  stripProjectRoot,
  toImportUrl,
  writeGeneratedFile,
} from "../../generators/shared/utils";

import { VIBE_DIR } from "@/env/paths";

/**
 * Real locations of the modules the emitted files import. These paths are
 * resolved from the GENERATED file's directory, not this one — hand-written
 * "../endpoint-base" / "../../../realtime/..." were computed against this
 * generator and pointed at directories that do not exist under <generated>.
 */
const ENDPOINT_BASE_MODULE = `${VIBE_DIR}/core/definition/endpoint-base.ts`;
const WS_CHANNEL_REGISTRY_MODULE = `${VIBE_DIR}/realtime/server/ws-channel-registry.ts`;

/**
 * Outcome of the realtime generation pass. `failed` carries the aggregated
 * guard errors: an unguarded subscribable channel would authorize on role alone
 * (a leak), so the build aborts rather than emit it.
 */
export type WsChannelsGenerationResult =
  | { readonly ok: true; readonly channelCount: number }
  | { readonly ok: false; readonly failed: string };

class WsChannelsGenerator {
  /**
   * Validate channel guards, then emit `ws-channels.ts` and
   * `remote-event-routes.ts` next to the route handlers.
   */
  static async run(
    validRouteFiles: string[],
    outputFile: string,
    logger: EndpointLogger,
  ): Promise<WsChannelsGenerationResult> {
    // Enforce that every subscribable WS channel has a resource-level
    // canSubscribe guard on the emitting method. Fail-closed at build time:
    // an unguarded channel would authorize on role alone (a leak), so we
    // abort rather than generate it.
    const wsErrors =
      await WsChannelsGenerator.validateWsChannels(validRouteFiles);
    if (wsErrors.length > 0) {
      for (const err of wsErrors) {
        logger.error(formatWarning(err));
      }
      return { ok: false, failed: wsErrors.join("; ") };
    }

    // Generate ws-channels.ts alongside route-handlers — one entry per
    // endpoint method that declares at least one client-delivered event.
    const wsChannelsFile = outputFile.replace(
      /\/handlers.ts$/,
      "/ws-channels.ts",
    );
    const { content: wsContent, channelCount } =
      await WsChannelsGenerator.generateWsChannelsContent(
        validRouteFiles,
        wsChannelsFile,
      );
    await writeGeneratedFile(wsChannelsFile, wsContent, false);
    logger.debug(
      `Generated ws-channels.ts with ${channelCount} channel entries`,
    );

    // remote-event-routes.ts — the bridge dispatch's force-load registry.
    const remoteEventRoutesFile = outputFile.replace(
      /\/handlers.ts$/,
      "/remote-event-routes.ts",
    );
    const { content: reContent, routeCount: remoteEventRouteCount } =
      await WsChannelsGenerator.generateRemoteEventRoutesContent(
        validRouteFiles,
        remoteEventRoutesFile,
      );
    await writeGeneratedFile(remoteEventRoutesFile, reContent, false);
    logger.debug(
      `Generated remote-event-routes.ts with ${remoteEventRouteCount} entries`,
    );

    return { ok: true, channelCount };
  }

  /**
   * Extract methods that declare at least one CLIENT-DELIVERED event from a
   * definition file.
   *
   * An endpoint method qualifies for WS channel authorization when its `events`
   * map contains at least one event that is delivered to clients — i.e. an event
   * whose `clientDelivery` flag is NOT `false`. Server-only-event endpoints
   * (every event flagged `clientDelivery: false`, e.g. execute-tool's tool
   * dispatch wires, remote-event-bridge, sync) are authorized as system
   * channels and intentionally excluded here.
   */
  private static async extractWsMethodsFromDefinition(
    routeFile: string,
  ): Promise<Array<{ method: string; scope: string | undefined }>> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(toImportUrl(definitionPath))) as {
        default?: Record<
          string,
          {
            events?: Record<string, { clientDelivery?: false }>;
            channel?: { scope?: string };
          }
        >;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        // Bun plugin race - yield then retry
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }

      if (!defaultExport) {
        return [];
      }

      const HTTP_METHODS = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS",
      ];
      const methods: Array<{ method: string; scope: string | undefined }> = [];
      for (const method of Object.keys(defaultExport)) {
        if (!HTTP_METHODS.includes(method)) {
          continue;
        }
        const events = defaultExport[method]?.events;
        if (!events || typeof events !== "object") {
          continue;
        }
        // Qualify only when at least one event is delivered to clients.
        const hasClientEvent = Object.values(events).some(
          (event) => event?.clientDelivery !== false,
        );
        if (hasClientEvent) {
          methods.push({
            method,
            scope: defaultExport[method]?.channel?.scope,
          });
        }
      }
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Methods whose definition declares at least one `remoteEvent: true` event —
   * these routes must be loadable BY PATH when a relayed event arrives before
   * anything imported them in this process (see remote-event-bridge/registry).
   */
  private static async extractRemoteEventMethodsFromDefinition(
    routeFile: string,
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(toImportUrl(definitionPath))) as {
        default?: Record<
          string,
          { events?: Record<string, { remoteEvent?: true }> }
        >;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }
      if (!defaultExport) {
        return [];
      }
      const HTTP_METHODS = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS",
      ];
      const methods: string[] = [];
      for (const method of Object.keys(defaultExport)) {
        if (!HTTP_METHODS.includes(method)) {
          continue;
        }
        const events = defaultExport[method]?.events;
        if (!events || typeof events !== "object") {
          continue;
        }
        const hasRemoteEvent = Object.values(events).some(
          (event) => event?.remoteEvent === true,
        );
        if (hasRemoteEvent) {
          methods.push(method);
        }
      }
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Validate that every client-subscribable WS channel has a `resolveChannel`
   * on the EXACT method that emits its events.
   *
   * This is the build-time BACKSTOP to the type-level enforcement (a method with
   * client-delivered events whose definition has channel scope resource/resolved
   * cannot compile without resolveChannel). It additionally guards the stale-
   * generated-file case and the scope:"user" case (which the type forbids a
   * resolver for — and which is correct: a user-scoped channel needs no resolver,
   * so it's skipped here too).
   *
   * It also catches the wrong-method footgun: a `resolveChannel` on GET while the
   * events live on PATCH/DELETE leaves those channels unguarded. We check the
   * resolver on the channel's own method, matching the runtime (lazyResolveChannel
   * keys by method too).
   *
   * Route modules are imported here (CLI/generator context, not the prod bundle
   * init path) only for the small set of channel-bearing routes — bounded work,
   * and the only reliable way to read the runtime `tools[method].resolveChannel`.
   */
  static async validateWsChannels(routeFiles: string[]): Promise<string[]> {
    const errors: string[] = [];

    for (const routeFile of routeFiles) {
      const methods =
        await WsChannelsGenerator.extractWsMethodsFromDefinition(routeFile);
      if (methods.length === 0) {
        continue;
      }

      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

      let tools: Record<
        string,
        { resolveChannel?: GenericHandlerBase["resolveChannel"] } | undefined
      >;
      try {
        const routeModule = (await import(toImportUrl(routeFile))) as {
          tools?: Record<
            string,
            | { resolveChannel?: GenericHandlerBase["resolveChannel"] }
            | undefined
          >;
        };
        tools = routeModule.tools ?? {};
      } catch (error) {
        errors.push(
          `WS channel validation could not import ${stripProjectRoot(routeFile)}: ` +
            `${parseError(error).message}. A route that declares client-delivered ` +
            `events must be importable so its resolveChannel can be verified.`,
        );
        continue;
      }

      const rel = stripProjectRoot(routeFile);
      for (const { method, scope } of methods) {
        if (scope === undefined) {
          errors.push(
            `Missing channel declaration in ${stripProjectRoot(definitionPath)} (${method}): ` +
              `this method emits a client-delivered event but its definition has no ` +
              `\`channel\`. Add \`channel: { scope: "user" | "resource" | "resolved" }\`.`,
          );
          continue;
        }
        // user scope is fully definition-decided — no route resolver required.
        if (scope === "user") {
          continue;
        }
        const handler = tools[method];
        if (typeof handler?.resolveChannel !== "function") {
          errors.push(
            `Missing resolveChannel in ${rel} (${method}): the definition declares ` +
              `channel scope "${scope}", so this method must supply a resolveChannel ` +
              `that authorizes subscribers and decides the channel. Add it to the ` +
              `${method} handler — on ${method} (the method that emits the events), ` +
              `not another method of the same endpoint.`,
          );
        }
      }
    }

    return errors;
  }

  /**
   * Generate remote-event-routes.ts content: one entry per endpoint method
   * that declares a `remoteEvent: true` event. The bridge dispatch force-loads
   * the target route through THIS registry (definition imported eagerly for
   * the canonical path, route imported lazily) instead of guessing aliases.
   */
  static async generateRemoteEventRoutesContent(
    routeFiles: string[],
    outputFile: string,
  ): Promise<{ content: string; routeCount: number }> {
    interface RemoteEventTarget {
      defImport: string;
      routeImport: string;
      method: string;
      defAlias: string;
    }
    const targets: RemoteEventTarget[] = [];
    for (const routeFile of routeFiles) {
      const methods =
        await WsChannelsGenerator.extractRemoteEventMethodsFromDefinition(
          routeFile,
        );
      if (methods.length === 0) {
        continue;
      }
      const defImport = generateAbsoluteImportPath(routeFile, "definition");
      const routeImport = generateAbsoluteImportPath(routeFile, "route");
      const segments = extractNestedPath(routeFile);
      const aliasBase = segments
        .map((s: string) =>
          s.replaceAll(/\[|\]/g, "").replaceAll(/[^A-Za-z0-9]/g, "_"),
        )
        .join("_");
      for (const method of methods) {
        targets.push({
          defImport,
          routeImport,
          method,
          defAlias: `${aliasBase}_${method}Def`,
        });
      }
    }
    targets.sort((a, b) => a.defAlias.localeCompare(b.defAlias));
    const routeCount = targets.length;
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Remote-event routes found": routeCount,
    });
    const eagerImports = targets
      .map((target) => `    import("${target.defImport}"),`)
      .join("\n");
    const eagerDestructure = targets
      .map((target) => `    ${target.defAlias},`)
      .join("\n");
    const entries = targets
      .map(
        (target) => `    {
      endpoint: ${target.defAlias}.default.${target.method},
      method: "${target.method}",
      importRoute: () => import("${target.routeImport}"),
    },`,
      )
      .join("\n");
    // eslint-disable-next-line i18next/no-literal-string
    const content = `${header}

/* eslint-disable prettier/prettier */

import type { CreateApiEndpointAny } from "${getRelativeImportPath(ENDPOINT_BASE_MODULE, outputFile)}";
import type { RegistryRouteModule } from "${getRelativeImportPath(WS_CHANNEL_REGISTRY_MODULE, outputFile)}";

export interface RemoteEventRouteEntry {
  /** The endpoint definition: canonical path to match on, schemas to gate the envelope. */
  endpoint: CreateApiEndpointAny;
  method: string;
  /** Loading the route module gives access to its onRemoteEvent handlers. */
  importRoute: () => Promise<RegistryRouteModule>;
}

/**
 * Every endpoint that declares a remoteEvent:true event, addressable by
 * its canonical definition path — the bridge dispatch force-loads the target
 * route through this registry when a relayed event arrives before anything
 * imported the route in this process.
 *
 * Definition modules are imported eagerly (lightweight, side-effect-free) so the
 * dispatch has the endpoint's path and schemas without loading route code; route
 * modules are imported lazily, only once an event actually targets them. Mirrors
 * the ws-channels registry.
 */
export async function getRemoteEventRoutes(): Promise<RemoteEventRouteEntry[]> {
  const [
${eagerDestructure}
  ] = await Promise.all([
${eagerImports}
  ]);

  return [
${entries}
  ];
}
`;
    return { content, routeCount };
  }

  /**
   * Generate ws-channels.ts content.
   *
   * For every endpoint method that declares a client-delivered event, emits an
   * entry that:
   *   - eagerly imports the definition module (lightweight, side-effect-free)
   *     to read the endpoint object (path + allowedRoles), and
   *   - lazily wires resolveChannel from the route module (deferred until first
   *     call) to avoid pulling repositories/DB into WS channel registration.
   *
   * Mirrors the lazyResolveChannel pattern from ws-channel-registry.ts.
   */
  static async generateWsChannelsContent(
    routeFiles: string[],
    outputFile: string,
  ): Promise<{ content: string; channelCount: number }> {
    interface WsChannelTarget {
      defImport: string;
      routeImport: string;
      method: string;
      defAlias: string;
      scope: string | undefined;
    }

    const targets: WsChannelTarget[] = [];

    for (const routeFile of routeFiles) {
      const methods =
        await WsChannelsGenerator.extractWsMethodsFromDefinition(routeFile);
      if (methods.length === 0) {
        continue;
      }

      const defImport = generateAbsoluteImportPath(routeFile, "definition");
      const routeImport = generateAbsoluteImportPath(routeFile, "route");
      // Build a stable, unique alias from the path segments + method.
      const segments = extractNestedPath(routeFile);
      const aliasBase = segments
        .map((s: string) =>
          s.replaceAll(/\[|\]/g, "").replaceAll(/[^A-Za-z0-9]/g, "_"),
        )
        .join("_");

      for (const { method, scope } of methods) {
        targets.push({
          defImport,
          routeImport,
          method,
          defAlias: `${aliasBase}_${method}Def`,
          scope,
        });
      }
    }

    // Stable order for deterministic output.
    targets.sort((a, b) => a.defAlias.localeCompare(b.defAlias));

    const channelCount = targets.length;

    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Channels found": channelCount,
    });

    // Eager definition imports — collected into the Promise.all destructure.
    const eagerImports = targets
      .map((target) => `    import("${target.defImport}"),`)
      .join("\n");
    const eagerDestructure = targets
      .map((target) => `    ${target.defAlias},`)
      .join("\n");

    // Entries: endpoint from the eager def + its resolveChannel. A `user`-scope
    // channel rides the caller's own user/{id} channel — the framework's static
    // `userChannelResolver` answers `{ kind: "user" }` with no route code (the
    // route has no resolver, by design). resource/resolved scopes wire the route's
    // resolveChannel lazily (deferred import to keep DB out of registration).
    const entries = targets
      .map((target) =>
        target.scope === "user"
          ? `    {
      endpoint: ${target.defAlias}.default.${target.method},
      resolveChannel: userChannelResolver,
    },`
          : ((): string => {
              const arrowLine = `        () => import("${target.routeImport}"),`;
              const importArg =
                arrowLine.length <= 80
                  ? `        () => import("${target.routeImport}"),`
                  : `        () =>\n          import("${target.routeImport}"),`;
              return `    {
      endpoint: ${target.defAlias}.default.${target.method},
      resolveChannel: lazyResolveChannel(
${importArg}
        "${target.method}",
      ),
    },`;
            })(),
      )
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${header}

/* eslint-disable prettier/prettier */

import {
  lazyResolveChannel,
  userChannelResolver,
  type WsChannelEntry,
} from "${getRelativeImportPath(WS_CHANNEL_REGISTRY_MODULE, outputFile)}";

/**
 * Returns every endpoint that exposes a client-subscribable WebSocket channel.
 *
 * Definition modules are imported eagerly (lightweight, side-effect-free) to
 * read the endpoint object (path + allowedRoles). Route modules are imported
 * lazily via lazyResolveChannel — only when a channel match needs resource-level
 * authorization — to avoid circular init errors in the production bundle.
 */
export async function getGeneratedWsEndpoints(): Promise<WsChannelEntry[]> {
  const [
${eagerDestructure}
  ] = await Promise.all([
${eagerImports}
  ]);

  return [
${entries}
  ];
}
`;

    return { content, channelCount };
  }
}

export { WsChannelsGenerator };

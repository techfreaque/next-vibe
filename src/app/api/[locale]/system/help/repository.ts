/**
 * Help Repository
 * One class, all platforms:
 *  - Tool discovery / search / detail (AI, MCP, CLI, Web)
 *  - CLI interactive terminal explorer (--interactive flag)
 */

import "server-only";

/* eslint-disable i18next/no-literal-string */
import { confirm, select } from "@inquirer/prompts";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../user/auth/types";
import type { CliCompatiblePlatform } from "../unified-interface/cli/runtime/route-executor";
import { RouteDelegationHandler } from "../unified-interface/cli/runtime/route-executor";
import { definitionsRegistry } from "../unified-interface/shared/endpoints/definitions/registry";
import { generateSchemaForUsage } from "../unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint-base";
import { FieldUsage } from "../unified-interface/shared/types/enums";
import { Platform } from "../unified-interface/shared/types/platform";
import {
  endpointToToolName,
  getPreferredToolName,
  splitPath,
} from "../unified-interface/shared/utils/path";
import { SchemaUIHandler } from "../unified-interface/unified-ui/renderers/cli/response/schema-handler";
import { getTranslatorFromEndpoint } from "../unified-interface/unified-ui/widgets/_shared/field-helpers";
import type { HelpGetRequestOutput, HelpGetResponseOutput } from "./definition";

// ─── Types ─────────────────────────────────────────────────────────────────

type ToolItem = HelpGetResponseOutput["tools"][number];

interface CliSessionState {
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
  locale: CountryLanguage;
  platform: CliCompatiblePlatform;
  options?: { verbose?: boolean; output?: "json" | "pretty" };
}

interface DirectoryNode {
  name: string;
  path: string;
  type: "directory" | "route";
  children?: DirectoryNode[];
  route?: CreateApiEndpointAny;
  parent?: DirectoryNode;
}

interface NavigationBreadcrumb {
  name: string;
  path: string;
  node: DirectoryNode;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ALL_SEARCH_LOCALES: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
] as const;
const COMPACT_DEFAULT_PAGE_SIZE = 25;
const HUMAN_DEFAULT_PAGE_SIZE = 200;

// ─── Tool discovery helpers ─────────────────────────────────────────────────

function isCompactPlatform(platform: Platform): boolean {
  return platform === Platform.AI || platform === Platform.MCP;
}

function getParameterSchema(
  endpoint: ReturnType<typeof definitionsRegistry.getEndpointsForUser>[number],
): ToolItem["parameters"] | null {
  if (!endpoint.fields) {
    return null;
  }
  try {
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
    const combinedShape: Record<string, z.ZodTypeAny> = {};
    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }
    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }
    if (Object.keys(combinedShape).length === 0) {
      return null;
    }
    return z.toJSONSchema(z.object(combinedShape), {
      target: "draft-7",
      io: "input",
      unrepresentable: "any",
      override: (ctx) => {
        if (ctx.zodSchema._zod.def.type === "custom") {
          ctx.jsonSchema.type = "object";
        }
      },
    });
  } catch {
    return null;
  }
}

function serializeTool(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
  parameters?: ToolItem["parameters"],
): ToolItem {
  return {
    name: tool.name,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    tags: tool.tags,
    toolName: tool.toolName,
    allowedRoles: tool.allowedRoles,
    aliases: tool.aliases,
    requiresConfirmation: tool.requiresConfirmation,
    parameters,
  };
}

function serializeToolCompact(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
): ToolItem {
  return {
    name: tool.toolName,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    tags: [],
    toolName: tool.toolName,
    allowedRoles: [],
    aliases: tool.aliases,
  };
}

function buildToolSearchIndex(
  endpoint: ReturnType<typeof definitionsRegistry.getEndpointsForUser>[number],
): string {
  const parts: string[] = [];
  if (endpoint.title) {
    parts.push(String(endpoint.title));
  }
  if (endpoint.description) {
    parts.push(String(endpoint.description));
  }
  if (endpoint.category) {
    parts.push(String(endpoint.category));
  }
  for (const tag of endpoint.tags ?? []) {
    parts.push(String(tag));
  }
  for (const alias of endpoint.aliases ?? []) {
    parts.push(alias);
  }

  for (const locale of ALL_SEARCH_LOCALES) {
    try {
      const { scopedT } = endpoint.scopedTranslation;
      const { t } = scopedT(locale);
      const tryPush = (key: string): void => {
        try {
          parts.push(t(key));
        } catch {
          /* missing translation — skip */
        }
      };
      if (endpoint.description) {
        tryPush(endpoint.description);
      }
      if (endpoint.title) {
        tryPush(endpoint.title);
      }
      if (endpoint.category) {
        tryPush(endpoint.category);
      }
      for (const tag of endpoint.tags ?? []) {
        tryPush(tag);
      }
    } catch {
      /* locale not supported — skip */
    }
  }

  return parts.join(" ").toLowerCase();
}

// ─── Interactive CLI session (static class) ──────────────────────────────────

interface CliNavState {
  session: CliSessionState;
  routeTree: DirectoryNode | null;
  currentNode: DirectoryNode | null;
  breadcrumbs: NavigationBreadcrumb[];
}

class InteractiveSession {
  private static readonly NAV_PREFIX = "nav:";
  private static readonly EXEC_PREFIX = "exec:";
  private static readonly UP_ACTION = "up";
  private static readonly EXIT_ACTION = "exit";
  private static readonly SETTINGS_ACTION = "settings";
  private static readonly CURRENT_PLACEHOLDER = "{current}";

  static async start(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
    platform: CliCompatiblePlatform,
  ): Promise<ResponseType<{ started: boolean }>> {
    if (!user) {
      return fail({
        message: "app.api.system.help.interactive.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const nav: CliNavState = {
        session: {
          options: { verbose: false, output: "pretty" },
          locale,
          user,
          platform,
        },
        routeTree: null,
        currentNode: null,
        breadcrumbs: [],
      };

      InteractiveSession.setupSignalHandlers();

      const { t } = simpleT(locale);
      logger.info(`\n${"═".repeat(60)}`);
      logger.info(
        `  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.welcome")}`,
      );
      logger.info("═".repeat(60));
      logger.info(
        `  ${t("app.api.system.unifiedInterface.cli.vibe.help.description")}`,
      );
      logger.info(`${"═".repeat(60)}\n`);

      const endpoints = definitionsRegistry.getEndpointsForUser(platform, user);
      InteractiveSession.buildRouteTree(nav, endpoints);
      nav.currentNode = nav.routeTree;
      InteractiveSession.updateBreadcrumbs(nav);
      await InteractiveSession.navigationLoop(nav, logger);

      return success({ started: true });
    } catch (error) {
      logger.error("Failed to start interactive mode", parseError(error));
      return fail({
        message: "app.api.system.help.interactive.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static setupSignalHandlers(): void {
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");
    process.on("SIGINT", () => {
      process.stdout.write("\nGoodbye!\n");
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      process.exit(0);
    });
  }

  private static buildRouteTree(
    nav: CliNavState,
    routes: CreateApiEndpointAny[],
  ): void {
    const { t } = simpleT(nav.session.locale);
    nav.routeTree = {
      name: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.rootName",
      ),
      path: "/",
      type: "directory",
      children: [],
    };
    for (const route of routes) {
      InteractiveSession.addRouteToTree(nav.routeTree, route);
    }
    InteractiveSession.sortTree(nav.routeTree);
  }

  private static addRouteToTree(
    root: DirectoryNode,
    route: CreateApiEndpointAny,
  ): void {
    const pathParts = splitPath(
      `/api/[locale]/v1/${route.path.join("/")}`,
    ).slice(4);
    let currentNode = root;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      let child = currentNode.children?.find((c) => c.name === part);
      if (!child) {
        const isLast = i === pathParts.length - 1;
        child = {
          name: part,
          path: `/${pathParts.slice(0, i + 1).join("/")}`,
          type: isLast ? "route" : "directory",
          children: isLast ? undefined : [],
          parent: currentNode,
          route: isLast ? route : undefined,
        };
        if (!currentNode.children) {
          currentNode.children = [];
        }
        currentNode.children.push(child);
      }
      currentNode = child;
    }
  }

  private static sortTree(node: DirectoryNode): void {
    if (!node.children) {
      return;
    }
    node.children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    for (const child of node.children) {
      InteractiveSession.sortTree(child);
    }
  }

  private static updateBreadcrumbs(nav: CliNavState): void {
    nav.breadcrumbs = [];
    let current = nav.currentNode;
    while (current) {
      nav.breadcrumbs.unshift({
        name: current.name,
        path: current.path,
        node: current,
      });
      current = current.parent ?? null;
    }
  }

  private static countRoutes(node: DirectoryNode): number {
    if (node.type === "route") {
      return 1;
    }
    return (node.children ?? []).reduce(
      (n, c) => n + InteractiveSession.countRoutes(c),
      0,
    );
  }

  private static getAllRoutes(
    node: DirectoryNode | null,
  ): CreateApiEndpointAny[] {
    if (!node) {
      return [];
    }
    const routes: CreateApiEndpointAny[] = [];
    if (node.type === "route" && node.route) {
      routes.push(node.route);
    }
    for (const child of node.children ?? []) {
      routes.push(...InteractiveSession.getAllRoutes(child));
    }
    return routes;
  }

  private static findNodeByPath(
    node: DirectoryNode,
    path: string,
  ): DirectoryNode | null {
    if (node.path === path) {
      return node;
    }
    for (const child of node.children ?? []) {
      const found = InteractiveSession.findNodeByPath(child, path);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private static findRouteByPath(
    node: DirectoryNode,
    path: string,
  ): CreateApiEndpointAny | null {
    if (node.route) {
      const routePath = Array.isArray(node.route.path)
        ? node.route.path.join("/")
        : node.route.path;
      if (routePath === path) {
        return node.route;
      }
    }
    for (const child of node.children ?? []) {
      const found = InteractiveSession.findRouteByPath(child, path);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private static routeT(
    route: CreateApiEndpointAny,
    locale: CountryLanguage,
  ): { t: (key: string) => string } {
    return getTranslatorFromEndpoint(route)(locale);
  }

  private static async showNavigationMenu(
    nav: CliNavState,
    logger: EndpointLogger,
  ): Promise<string> {
    if (!nav.currentNode) {
      return "exit";
    }
    const { t } = simpleT(nav.session.locale);
    const breadcrumbPath = nav.breadcrumbs.map((b) => b.name).join(" > ");
    logger.info(
      `\n${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon")} ${breadcrumbPath}`,
    );

    const choices: Array<{ name: string; value: string }> = [];
    if (nav.currentNode.parent) {
      choices.push({
        name: `${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.upIcon")} ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.goUp")}`,
        value: InteractiveSession.UP_ACTION,
      });
    }

    const dirIcon = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon",
    );
    const routeIcon = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.routeIcon",
    );
    const routesText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.routes",
    );
    const noDesc = t(
      "app.api.system.unifiedInterface.cli.vibe.errors.routeNotFound",
    );

    for (const child of nav.currentNode.children ?? []) {
      if (child.type === "directory") {
        choices.push({
          name: `${dirIcon} ${child.name}/ (${InteractiveSession.countRoutes(child)} ${routesText})`,
          value: InteractiveSession.NAV_PREFIX + child.path,
        });
      } else if (child.type === "route" && child.route) {
        const { t: rt } = InteractiveSession.routeT(
          child.route,
          nav.session.locale,
        );
        const displayName = child.route.aliases?.[0] ?? child.name;
        const extraAliases =
          child.route.aliases && child.route.aliases.length > 1
            ? ` [${child.route.aliases.slice(1).join(", ")}]`
            : "";
        choices.push({
          name: `${routeIcon} ${displayName}${extraAliases} - ${child.route.description ? rt(child.route.description) : noDesc}`,
          value: InteractiveSession.EXEC_PREFIX + child.route.path,
        });
      }
    }

    if (choices.length > 0) {
      choices.push({
        name: "────────────────────────────────",
        value: "separator",
      });
    }
    choices.push({
      name: `📋 ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.viewAllRoutes")}`,
      value: "view_all",
    });
    choices.push({
      name: `${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settingsIcon")} ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settings")}`,
      value: InteractiveSession.SETTINGS_ACTION,
    });
    choices.push({
      name: `${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.exitIcon")} ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.exit")}`,
      value: InteractiveSession.EXIT_ACTION,
    });

    return select({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.navigate",
      ),
      choices,
      pageSize: 20,
    });
  }

  private static async showAllRoutesMenu(nav: CliNavState): Promise<string> {
    const { t } = simpleT(nav.session.locale);
    const allRoutes = InteractiveSession.getAllRoutes(nav.routeTree);
    const byCategory = new Map<string, CreateApiEndpointAny[]>();
    for (const route of allRoutes) {
      const cat = route.category ?? "Other";
      if (!byCategory.has(cat)) {
        byCategory.set(cat, []);
      }
      byCategory.get(cat)!.push(route);
    }

    const choices: Array<{ name: string; value: string }> = [];
    for (const cat of [...byCategory.keys()].toSorted()) {
      const routes = byCategory.get(cat)!;
      let translatedCat = cat;
      if (routes.length > 0 && cat !== "Other") {
        try {
          translatedCat = InteractiveSession.routeT(
            routes[0],
            nav.session.locale,
          ).t(cat);
        } catch {
          /* skip */
        }
      }
      choices.push({ name: `\n━━ ${translatedCat} ━━`, value: "separator" });
      for (const route of routes.toSorted((a, b) =>
        (a.aliases?.[0] ?? endpointToToolName(a)).localeCompare(
          b.aliases?.[0] ?? endpointToToolName(b),
        ),
      )) {
        const { t: rt } = InteractiveSession.routeT(route, nav.session.locale);
        const name = route.aliases?.[0] ?? endpointToToolName(route);
        const extra =
          route.aliases && route.aliases.length > 1
            ? ` [${route.aliases.slice(1).join(", ")}]`
            : "";
        choices.push({
          name: `  🔧 ${name.padEnd(20)}${extra} ${route.description ? rt(route.description) : ""}`,
          value: InteractiveSession.EXEC_PREFIX + route.path,
        });
      }
    }
    choices.push({
      name: "\n────────────────────────────────",
      value: "separator",
    });
    choices.push({
      name: `⬅️  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.backToNavigation")}`,
      value: "back",
    });
    return select({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.selectRoute",
      ),
      choices,
      pageSize: 20,
    });
  }

  private static async executeRoute(
    nav: CliNavState,
    route: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<void> {
    const { t } = simpleT(nav.session.locale);
    const routePath = Array.isArray(route.path)
      ? route.path.join("/")
      : route.path;
    const alias = route.aliases?.[0];
    logger.info(`\n${"─".repeat(60)}`);
    logger.info(
      `  🚀 ${t("app.api.system.unifiedInterface.cli.vibe.executing")}: ${alias ?? routePath}`,
    );
    logger.info("─".repeat(60));
    logger.info(
      `  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.route")}: ${routePath}`,
    );
    logger.info(
      `  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.method")}: ${route.method}`,
    );
    if (route.description) {
      const { t: rt } = InteractiveSession.routeT(route, nav.session.locale);
      logger.info(
        `  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.description")}: ${rt(route.description)}`,
      );
    }
    logger.info(`${"─".repeat(60)}\n`);

    try {
      await InteractiveSession.generateDataDrivenForm(nav, route, logger);
    } catch (error) {
      logger.error(
        t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
        ),
        parseError(error),
      );
    }

    const shouldContinue = await confirm({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executeAnother",
      ),
      default: true,
    });
    if (!shouldContinue) {
      return;
    }
  }

  private static async generateDataDrivenForm(
    nav: CliNavState,
    endpoint: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<void> {
    const selectedLocale = await InteractiveSession.collectLocaleSelection(
      nav.session.locale,
    );
    nav.session.locale = selectedLocale;
    const { t } = simpleT(selectedLocale);

    let requestData = {};
    if (
      endpoint.requestSchema &&
      !InteractiveSession.isEmptySchema(endpoint.requestSchema)
    ) {
      logger.info(
        `\n📝 ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.requestData")}`,
      );
      logger.info("─".repeat(60));
      requestData = await InteractiveSession.generateFormFromSchema(
        endpoint.requestSchema,
        t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.requestData",
        ),
        logger,
      );
    }

    let urlPathParams = {};
    if (
      endpoint.requestUrlPathParamsSchema &&
      !InteractiveSession.isEmptySchema(endpoint.requestUrlPathParamsSchema)
    ) {
      logger.info(
        `\n🔗 ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters")}`,
      );
      logger.info("─".repeat(60));
      urlPathParams = await InteractiveSession.generateFormFromSchema(
        endpoint.requestUrlPathParamsSchema,
        t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters",
        ),
        logger,
      );
    }

    if (
      Object.keys(requestData).length > 0 ||
      Object.keys(urlPathParams).length > 0
    ) {
      logger.info(`\n${"═".repeat(60)}`);
      logger.info(
        `  👀 ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.preview")}`,
      );
      logger.info("═".repeat(60));
      if (Object.keys(requestData).length > 0) {
        logger.info(
          `\n${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.requestData")}:\n${JSON.stringify(requestData, null, 2)}`,
        );
      }
      if (Object.keys(urlPathParams).length > 0) {
        logger.info(
          `\n${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters")}:\n${JSON.stringify(urlPathParams, null, 2)}`,
        );
      }
      logger.info("");
      const shouldExecute = await confirm({
        message: t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executeWithParams",
        ),
        default: true,
      });
      if (!shouldExecute) {
        return;
      }
    }

    await InteractiveSession.dispatchRoute(
      nav.session,
      endpoint,
      requestData,
      urlPathParams,
      logger,
    );
  }

  private static async generateFormFromSchema(
    schema: z.ZodTypeAny,
    title: string,
    logger: EndpointLogger,
  ): Promise<Record<string, string | number | boolean>> {
    try {
      const fields = SchemaUIHandler.parseSchema(schema);
      return (await SchemaUIHandler.generateForm({ title, fields })) as Record<
        string,
        string | number | boolean
      >;
    } catch (error) {
      logger.warn(`Failed to generate form for ${title}`, {
        errorMessage: parseError(error).message,
      });
      return {};
    }
  }

  private static isEmptySchema(schema: z.ZodTypeAny | undefined): boolean {
    if (!schema) {
      return true;
    }
    const s = schema as {
      _def?: { typeName?: string; shape?: Record<string, z.ZodTypeAny> };
    };
    const tn = s._def?.typeName;
    if (tn === "ZodUndefined" || tn === "ZodVoid") {
      return true;
    }
    if (tn === "ZodObject") {
      return Object.keys(s._def?.shape ?? {}).length === 0;
    }
    return false;
  }

  private static async collectLocaleSelection(
    current: CountryLanguage,
  ): Promise<CountryLanguage> {
    const { t } = simpleT(current);
    const options = [
      {
        name: t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
        ),
        value: "en-GLOBAL" as CountryLanguage,
      },
      { name: "German (Germany)", value: "de-DE" as CountryLanguage },
      { name: "Polish (Poland)", value: "pl-PL" as CountryLanguage },
    ];
    const defaultLocale = options.some((o) => o.value === current)
      ? current
      : undefined;
    return select({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.selectLocale",
      ),
      choices: options,
      default: defaultLocale as (typeof options)[number]["value"] | undefined,
    });
  }

  private static async dispatchRoute(
    session: CliSessionState,
    route: CreateApiEndpointAny,
    requestData: Record<string, string | number | boolean | null | undefined>,
    urlPathParams: Record<string, string | number | boolean | null | undefined>,
    logger: EndpointLogger,
  ): Promise<void> {
    const resolvedCommand = route.aliases?.[0] ?? endpointToToolName(route);
    try {
      const result = await RouteDelegationHandler.executeRoute(
        resolvedCommand,
        {
          data: requestData,
          urlPathParams:
            Object.keys(urlPathParams).length > 0 ? urlPathParams : undefined,
          cliArgs: { positionalArgs: [], namedArgs: {} },
          locale: session.locale,
          platform: session.platform,
          dryRun: undefined,
          interactive: true,
          verbose: session.options?.verbose,
          output: session.options?.output,
        },
        logger,
      );
      process.stdout.write(`${result.formattedOutput}\n`);
    } catch (error) {
      logger.error(
        simpleT(session.locale).t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
        ),
        parseError(error),
      );
    }
  }

  private static async navigationLoop(
    nav: CliNavState,
    logger: EndpointLogger,
  ): Promise<void> {
    while (true) {
      try {
        const action = await InteractiveSession.showNavigationMenu(nav, logger);
        if (action === InteractiveSession.EXIT_ACTION) {
          logger.info(
            `\n${simpleT(nav.session.locale).t("app.api.system.unifiedInterface.cli.vibe.interactive.goodbye")}\n`,
          );
          break;
        } else if (action === "separator") {
          continue;
        } else if (action === "view_all") {
          await InteractiveSession.handleViewAll(nav, logger);
        } else if (action === InteractiveSession.SETTINGS_ACTION) {
          await InteractiveSession.showSettingsMenu(nav, logger);
        } else if (action === InteractiveSession.UP_ACTION) {
          if (nav.currentNode?.parent) {
            nav.currentNode = nav.currentNode.parent;
            InteractiveSession.updateBreadcrumbs(nav);
          }
        } else if (action.startsWith(InteractiveSession.NAV_PREFIX)) {
          const targetPath = action.slice(InteractiveSession.NAV_PREFIX.length);
          const targetNode = nav.routeTree
            ? InteractiveSession.findNodeByPath(nav.routeTree, targetPath)
            : null;
          if (targetNode) {
            nav.currentNode = targetNode;
            InteractiveSession.updateBreadcrumbs(nav);
          }
        } else if (action.startsWith(InteractiveSession.EXEC_PREFIX)) {
          const routePath = action.slice(InteractiveSession.EXEC_PREFIX.length);
          const route = nav.routeTree
            ? InteractiveSession.findRouteByPath(nav.routeTree, routePath)
            : null;
          if (route) {
            await InteractiveSession.executeRoute(nav, route, logger);
          }
        }
      } catch (error) {
        logger.error(
          simpleT(nav.session.locale).t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.navigationError",
          ),
          parseError(error),
        );
      }
    }
  }

  private static async handleViewAll(
    nav: CliNavState,
    logger: EndpointLogger,
  ): Promise<void> {
    while (true) {
      const action = await InteractiveSession.showAllRoutesMenu(nav);
      if (action === "back" || action === "separator") {
        break;
      }
      if (action.startsWith(InteractiveSession.EXEC_PREFIX)) {
        const routePath = action.slice(InteractiveSession.EXEC_PREFIX.length);
        const route = nav.routeTree
          ? InteractiveSession.findRouteByPath(nav.routeTree, routePath)
          : null;
        if (route) {
          await InteractiveSession.executeRoute(nav, route, logger);
        }
        break;
      }
    }
  }

  private static async showSettingsMenu(
    nav: CliNavState,
    logger: EndpointLogger,
  ): Promise<void> {
    const session = nav.session;
    const { t } = simpleT(session.locale);
    const CURR = InteractiveSession.CURRENT_PLACEHOLDER;
    const setting = await select({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseSettingToModify",
      ),
      choices: [
        {
          name: t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.outputFormatCurrent",
          ).replace(CURR, session.options?.output ?? "pretty"),
          value: "output",
        },
        {
          name: t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.verboseModeCurrent",
          ).replace(CURR, String(session.options?.verbose ?? false)),
          value: "verbose",
        },
        {
          name: t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.localeCurrent",
          ).replace(CURR, session.locale),
          value: "locale",
        },
        {
          name: t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.backToMainMenu",
          ),
          value: "back",
        },
      ],
    });
    if (setting === "back") {
      return;
    }

    switch (setting) {
      case "output": {
        const output = await select({
          message: simpleT(session.locale).t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseOutputFormat",
          ),
          choices: [
            {
              name: simpleT(session.locale).t(
                "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.prettyFormatted",
              ),
              value: "pretty",
            },
            {
              name: simpleT(session.locale).t(
                "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.jsonRaw",
              ),
              value: "json",
            },
          ],
          default: session.options?.output,
        });
        session.options = {
          ...session.options,
          output: output as "json" | "pretty",
        };
        break;
      }
      case "verbose": {
        const verbose = await confirm({
          message: simpleT(session.locale).t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.enableVerboseOutput",
          ),
          default: session.options?.verbose,
        });
        session.options = { ...session.options, verbose };
        break;
      }
      case "locale": {
        const localeChoices = [
          {
            name: simpleT(session.locale).t(
              "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
            ),
            value: "en-GLOBAL" as CountryLanguage,
          },
          {
            name: simpleT(session.locale).t(
              "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.german",
            ),
            value: "de-DE" as CountryLanguage,
          },
          {
            name: simpleT(session.locale).t(
              "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.polish",
            ),
            value: "pl-PL" as CountryLanguage,
          },
        ];
        const defaultLocale = localeChoices.some(
          (o) => o.value === session.locale,
        )
          ? session.locale
          : undefined;
        session.locale = await select({
          message: simpleT(session.locale).t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseLocale",
          ),
          choices: localeChoices,
          default: defaultLocale as
            | (typeof localeChoices)[number]["value"]
            | undefined,
        });
        break;
      }
    }
    logger.info(
      simpleT(session.locale).t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settingUpdated",
      ),
    );
  }
}

// ─── Main Repository Class ──────────────────────────────────────────────────

export class HelpRepository {
  static async getTools(
    data: HelpGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    // Interactive mode — CLI only, not exposed via MCP/AI/Web
    if (
      Platform.CLI === platform ||
      Platform.CLI_PACKAGE === platform
      // TODO handle and make it work - we should not add this prop to not polute the schema for other platforms. this needs custom platform tool defs which we need anyways at one point
      // &&
      // data.interactive
    ) {
      const result = await InteractiveSession.start(
        user,
        locale,
        logger,
        platform,
      );
      if (!result.success) {
        return result as ResponseType<HelpGetResponseOutput>;
      }
      return success({
        tools: [] satisfies ToolItem[],
        totalCount: 0,
        matchedCount: 0,
        hint: "Interactive session completed.",
      });
    }

    const isCompact = isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
    const currentPage = data.page ?? 1;

    const allTools = definitionsRegistry.getSerializedToolsForUser(
      Platform.AI,
      user,
      locale,
    );
    const totalCount = allTools.length;

    const categoryMap = new Map<string, number>();
    for (const tool of allTools) {
      const cat = tool.category || "Other";
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
    }
    const categories = [...categoryMap.entries()]
      .toSorted((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Detail mode — single tool with full parameter schema
    if (data.toolName) {
      const needle = data.toolName.toLowerCase().trim();
      const matchedTool = allTools.find(
        (t) =>
          t.toolName.toLowerCase() === needle ||
          t.name.toLowerCase() === needle ||
          t.aliases?.some((a) => a.toLowerCase() === needle),
      );
      if (!matchedTool) {
        return success({
          tools: [] satisfies ToolItem[],
          totalCount,
          matchedCount: 0,
          categories,
          hint: `Tool "${data.toolName}" not found. Use query to search by keyword.`,
        });
      }
      const allEndpoints = definitionsRegistry.getEndpointsForUser(
        Platform.AI,
        user,
      );
      const endpoint = allEndpoints.find((e) => {
        const preferred = getPreferredToolName(e);
        const internal = endpointToToolName(e);
        return (
          preferred.toLowerCase() === needle ||
          internal.toLowerCase() === needle ||
          e.aliases?.some((a) => a.toLowerCase() === needle)
        );
      });
      const parameters = endpoint
        ? (getParameterSchema(endpoint) ?? undefined)
        : undefined;
      return success({
        tools: [serializeTool(matchedTool, parameters)],
        totalCount,
        matchedCount: 1,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();

    // AI/MCP overview — no params → categories + hint only
    if (isCompact && !query && !category) {
      return success({
        tools: [] satisfies ToolItem[],
        totalCount,
        matchedCount: 0,
        categories,
        hint: `Use query to search, category to filter, or toolName for full schema. Run via CLI: vibe <alias> [--field=value ...]. Page size: ${COMPACT_DEFAULT_PAGE_SIZE} (use page param to navigate).`,
      });
    }

    let filtered = allTools;

    if (query) {
      const allEndpoints = definitionsRegistry.getEndpointsForUser(
        Platform.AI,
        user,
      );
      const searchIndexMap = new Map<string, string>();
      for (const ep of allEndpoints) {
        searchIndexMap.set(endpointToToolName(ep), buildToolSearchIndex(ep));
      }
      filtered = filtered.filter((tool) => {
        if (
          tool.name.toLowerCase().includes(query) ||
          tool.toolName.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.aliases?.some((a) => a.toLowerCase().includes(query)) ||
          tool.tags.some((t) => t.toLowerCase().includes(query))
        ) {
          return true;
        }
        return searchIndexMap.get(tool.toolName)?.includes(query) ?? false;
      });
    }

    if (category) {
      filtered = filtered.filter((t) =>
        t.category?.toLowerCase().includes(category),
      );
    }

    const matchedCount = filtered.length;
    const totalPages = Math.ceil(matchedCount / effectivePageSize);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const offset = (safePage - 1) * effectivePageSize;
    const pageSlice = filtered.slice(offset, offset + effectivePageSize);

    if (isCompact) {
      return success({
        tools: pageSlice.map(serializeToolCompact),
        totalCount,
        matchedCount,
        categories: matchedCount > effectivePageSize ? categories : undefined,
        hint:
          matchedCount > effectivePageSize
            ? `Page ${safePage}/${totalPages} (${effectivePageSize}/page, ${matchedCount} total). Use page param to navigate.`
            : undefined,
        currentPage: safePage,
        effectivePageSize,
        totalPages,
      });
    }

    return success({
      tools: pageSlice.map((t) => serializeTool(t)),
      totalCount,
      matchedCount,
      categories,
      hint:
        totalPages > 1
          ? `Page ${safePage}/${totalPages} — ${matchedCount} tools match.`
          : undefined,
      currentPage: safePage,
      effectivePageSize,
      totalPages,
    });
  }
}

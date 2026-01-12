/**
 * Interactive Mode Repository
 * Contains all business logic for interactive file explorer mode
 */

import "server-only";

import { confirm, select } from "@inquirer/prompts";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  UserPermissionRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  CliCompatiblePlatform,
  RouteExecutionContext,
} from "../../unified-interface/cli/runtime/route-executor";
import { routeDelegationHandler } from "../../unified-interface/cli/runtime/route-executor";
import { schemaUIHandler } from "../../unified-interface/cli/widgets/renderers/schema-handler";
import { definitionsRegistry } from "../../unified-interface/shared/endpoints/definitions/registry";
import type { CreateApiEndpointAny } from "../../unified-interface/shared/types/endpoint";
import { Platform } from "../../unified-interface/shared/types/platform";
import {
  endpointToToolName,
  splitPath,
} from "../../unified-interface/shared/utils/path";

/**
 * Interactive session state
 */
interface InteractiveSession {
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
  locale: CountryLanguage;
  platform: CliCompatiblePlatform;
  options?: {
    verbose?: boolean;
    output?: "json" | "table" | "pretty";
  };
}

/**
 * Directory node for file explorer navigation
 */
interface DirectoryNode {
  name: string;
  path: string;
  type: "directory" | "route";
  children?: DirectoryNode[];
  route?: CreateApiEndpointAny;
  parent?: DirectoryNode;
}

/**
 * Navigation breadcrumb
 */
interface NavigationBreadcrumb {
  name: string;
  path: string;
  node: DirectoryNode;
}

export interface InteractiveRepository {
  startInteractiveMode(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
    platform: CliCompatiblePlatform,
  ): Promise<ResponseType<{ started: boolean }>>;
}

class InteractiveRepositoryImpl implements InteractiveRepository {
  private session!: InteractiveSession;
  private routeTree: DirectoryNode | null = null;
  private currentNode: DirectoryNode | null = null;
  private breadcrumbs: NavigationBreadcrumb[] = [];
  private logger!: EndpointLogger;

  // Constants for action prefixes
  private static readonly NAV_PREFIX = "nav:";
  private static readonly EXEC_PREFIX = "exec:";
  private static readonly UP_ACTION = "up";
  private static readonly EXIT_ACTION = "exit";
  private static readonly SETTINGS_ACTION = "settings";
  private static readonly CURRENT_PLACEHOLDER = "{current}";

  async startInteractiveMode(
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
      this.initializeDefaultSession(locale, user, platform);
      this.setupSignalHandlers();

      const { t } = simpleT(this.getSession().locale);

      // Show welcome message with better formatting
      logger.info(`\n${"═".repeat(60)}`);
      logger.info(
        `  ${t("app.api.system.unifiedInterface.cli.vibe.interactive.welcome")}`,
      );
      logger.info("═".repeat(60));
      logger.info(
        `  ${t("app.api.system.unifiedInterface.cli.vibe.help.description")}`,
      );
      logger.info(`${"═".repeat(60)}\n`);

      // Build route tree for file explorer navigation
      // Use centralized endpoint adapter to get all platform-accessible endpoints
      // (filtered by user permissions from JWT)
      const discoveredEndpoints = definitionsRegistry.getEndpointsForUser(
        platform,
        user,
        logger,
      );

      this.buildRouteTree(discoveredEndpoints);

      // Start at root
      this.currentNode = this.routeTree;
      this.updateBreadcrumbs();

      // Main navigation loop
      await this.navigationLoop(logger);

      return success({ started: true });
    } catch (error) {
      logger.error("Failed to start interactive mode", parseError(error));
      return fail({
        message: "app.api.system.help.interactive.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private getSession(): InteractiveSession {
    if (!this.session) {
      // This should never happen in normal flow
      // Initialize with defaults as fallback
      this.session = {
        options: {
          verbose: false,
          output: "pretty",
        },
        locale: "en-GLOBAL",
        platform: Platform.CLI,
        user: {
          id: "system",
          leadId: "system",
          isPublic: false,
          roles: [UserPermissionRole.ADMIN],
        },
      };
    }
    return this.session;
  }

  private setupSignalHandlers(): void {
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");

    process.on("SIGINT", () => {
      process.stdout.write("\n");
      process.stdout.write("Goodbye!\n");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      process.exit(0);
    });
  }

  private initializeDefaultSession(
    locale: CountryLanguage,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    platform: CliCompatiblePlatform,
  ): void {
    this.session = {
      options: {
        verbose: false,
        output: "pretty",
      },
      locale,
      user,
      platform,
    };
  }

  private buildRouteTree(routes: CreateApiEndpointAny[]): void {
    const { t } = simpleT(this.getSession().locale);

    this.routeTree = {
      name: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.rootName",
      ),
      path: "/",
      type: "directory",
      children: [],
    };

    for (const route of routes) {
      this.addRouteToTree(route);
    }

    this.sortTree(this.routeTree);
  }

  private addRouteToTree(route: CreateApiEndpointAny): void {
    if (!this.routeTree) {
      return;
    }

    const routePath = route.path.join("/");
    const pathParts = splitPath(`/api/[locale]/v1/${routePath}`).slice(4);

    let currentNode = this.routeTree;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      let childNode = currentNode.children?.find(
        (child) => child.name === part,
      );

      if (!childNode) {
        const isLastPart = i === pathParts.length - 1;
        childNode = {
          name: part,
          path: `/${pathParts.slice(0, i + 1).join("/")}`,
          type: isLastPart ? "route" : "directory",
          children: isLastPart ? undefined : [],
          parent: currentNode,
          route: isLastPart ? route : undefined,
        };

        if (!currentNode.children) {
          currentNode.children = [];
        }
        currentNode.children.push(childNode);
      }

      currentNode = childNode;
    }
  }

  private sortTree(node: DirectoryNode): void {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      node.children.forEach((child) => this.sortTree(child));
    }
  }

  private updateBreadcrumbs(): void {
    this.breadcrumbs = [];
    let current = this.currentNode;

    while (current) {
      this.breadcrumbs.unshift({
        name: current.name,
        path: current.path,
        node: current,
      });
      current = current.parent || null;
    }
  }

  private async showNavigationMenu(logger: EndpointLogger): Promise<string> {
    if (!this.currentNode) {
      return "exit";
    }

    const { t } = simpleT(this.getSession().locale);

    const breadcrumbPath = this.breadcrumbs.map((b) => b.name).join(" > ");
    logger.info(
      `\n${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon")} ${breadcrumbPath}`,
    );

    const choices: Array<{ name: string; value: string }> = [];

    if (this.currentNode.parent) {
      const upIcon = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.upIcon",
      );
      const goUpText = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.goUp",
      );
      const upName = `${upIcon} ${goUpText}`;
      choices.push({
        name: upName,
        value: InteractiveRepositoryImpl.UP_ACTION,
      });
    }

    if (this.currentNode.children) {
      const directoryIcon = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon",
      );
      const routeIcon = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.routeIcon",
      );
      const routesText = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.routes",
      );
      const noDescriptionText = t(
        "app.api.system.unifiedInterface.cli.vibe.errors.routeNotFound",
      );

      for (const child of this.currentNode.children) {
        if (child.type === "directory") {
          const routeCount = this.countRoutesInDirectory(child);
          const directoryName = `${directoryIcon} ${child.name}/ (${routeCount} ${routesText})`;
          choices.push({
            name: directoryName,
            value: InteractiveRepositoryImpl.NAV_PREFIX + child.path,
          });
        } else if (child.type === "route" && child.route) {
          const route = child.route;
          const { t: routeT } = this.getTranslatorForRoute(route);
          const description = route.description
            ? routeT(route.description)
            : noDescriptionText;

          // Use first alias if available, otherwise use the route name
          const displayName =
            route.aliases && route.aliases.length > 0
              ? route.aliases[0]
              : child.name;

          // Show additional aliases if available
          const additionalAliases =
            route.aliases && route.aliases.length > 1
              ? ` [${route.aliases.slice(1).join(", ")}]`
              : "";

          const routeName = `${routeIcon} ${displayName}${additionalAliases} - ${description}`;
          choices.push({
            name: routeName,
            value: InteractiveRepositoryImpl.EXEC_PREFIX + route.path,
          });
        }
      }
    }

    if (choices.length > 0) {
      choices.push({
        name: "────────────────────────────────",
        value: "separator",
      });
    }

    // Add "View All Routes" option
    choices.push({
      name: `📋 ${t("app.api.system.unifiedInterface.cli.vibe.interactive.navigation.viewAllRoutes")}`,
      value: "view_all",
    });

    const settingsIcon = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settingsIcon",
    );
    const settingsText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settings",
    );
    const exitIcon = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.exitIcon",
    );
    const exitText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.exit",
    );
    const navigateMessage = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.navigate",
    );

    choices.push(
      {
        name: `${settingsIcon} ${settingsText}`,
        value: InteractiveRepositoryImpl.SETTINGS_ACTION,
      },
      {
        name: `${exitIcon} ${exitText}`,
        value: InteractiveRepositoryImpl.EXIT_ACTION,
      },
    );

    const action = await select({
      message: navigateMessage,
      choices,
      pageSize: 20,
    });

    return action;
  }

  /**
   * Get translator for a specific route
   */
  private getTranslatorForRoute(route: CreateApiEndpointAny): {
    t: (key: string) => string;
  } {
    const {
      getTranslatorFromEndpoint,
    } = require("../../unified-interface/shared/widgets/utils/field-helpers");
    return getTranslatorFromEndpoint(route)(this.getSession().locale);
  }

  /**
   * Show all routes in a flat list
   */
  private async showAllRoutesMenu(): Promise<string> {
    const { t } = simpleT(this.getSession().locale);
    const allRoutes = this.getAllRoutes(this.routeTree);

    // Group by category
    const routesByCategory = new Map<string, CreateApiEndpointAny[]>();
    for (const route of allRoutes) {
      const category = route.category || "Other";
      if (!routesByCategory.has(category)) {
        routesByCategory.set(category, []);
      }
      routesByCategory.get(category)?.push(route);
    }

    // Sort categories and routes
    const sortedCategories = [...routesByCategory.keys()].toSorted();

    const choices: Array<{ name: string; value: string }> = [];

    for (const category of sortedCategories) {
      const routes = routesByCategory.get(category) || [];

      // Translate category using the first route's translator
      let translatedCategory = category;
      if (routes.length > 0 && category && category !== "Other") {
        const { t: categoryT } = this.getTranslatorForRoute(routes[0]);
        translatedCategory = categoryT(category);
      }

      // Add category header
      choices.push({
        name: `\n━━ ${translatedCategory} ━━`,
        value: "separator",
      });

      // Sort routes by display name
      const sortedRoutes = routes.toSorted((a, b) => {
        const nameA =
          a.aliases && a.aliases.length > 0
            ? a.aliases[0]
            : endpointToToolName(a);
        const nameB =
          b.aliases && b.aliases.length > 0
            ? b.aliases[0]
            : endpointToToolName(b);
        return nameA.localeCompare(nameB);
      });

      for (const route of sortedRoutes) {
        const { t: routeT } = this.getTranslatorForRoute(route);
        const displayName =
          route.aliases && route.aliases.length > 0
            ? route.aliases[0]
            : endpointToToolName(route);

        const description = route.description ? routeT(route.description) : "";

        const additionalAliases =
          route.aliases && route.aliases.length > 1
            ? ` [${route.aliases.slice(1).join(", ")}]`
            : "";

        choices.push({
          name: `  🔧 ${displayName.padEnd(20)}${additionalAliases} ${description}`,
          value: InteractiveRepositoryImpl.EXEC_PREFIX + route.path,
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

    const action = await select({
      message: t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.selectRoute",
      ),
      choices,
      pageSize: 20,
    });

    return action;
  }

  /**
   * Get all routes from the tree
   */
  private getAllRoutes(node: DirectoryNode | null): CreateApiEndpointAny[] {
    if (!node) {
      return [];
    }

    const routes: CreateApiEndpointAny[] = [];

    if (node.type === "route" && node.route) {
      routes.push(node.route);
    }

    if (node.children) {
      for (const child of node.children) {
        routes.push(...this.getAllRoutes(child));
      }
    }

    return routes;
  }

  private countRoutesInDirectory(node: DirectoryNode): number {
    let count = 0;
    if (node.type === "route") {
      return 1;
    }
    if (node.children) {
      for (const child of node.children) {
        count += this.countRoutesInDirectory(child);
      }
    }
    return count;
  }

  private navigateUp(): void {
    if (this.currentNode?.parent) {
      this.currentNode = this.currentNode.parent;
      this.updateBreadcrumbs();
    }
  }

  private navigateToPath(targetPath: string): void {
    if (!this.routeTree) {
      return;
    }

    const targetNode = this.findNodeByPath(this.routeTree, targetPath);
    if (targetNode) {
      this.currentNode = targetNode;
      this.updateBreadcrumbs();
    }
  }

  private findNodeByPath(
    node: DirectoryNode,
    path: string,
  ): DirectoryNode | null {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByPath(child, path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private async executeRouteByPath(
    routePath: string,
    logger: EndpointLogger,
  ): Promise<void> {
    if (!this.routeTree) {
      return;
    }

    const route = this.findRouteByPath(this.routeTree, routePath);
    if (route) {
      await this.executeRouteWithDataDrivenUI(route, logger);
    }
  }

  private findRouteByPath(
    node: DirectoryNode,
    path: string,
  ): CreateApiEndpointAny | null {
    if (node.route) {
      const pathArray = node.route.path;
      const routePath = Array.isArray(pathArray)
        ? pathArray.join("/")
        : pathArray;
      if (routePath === path) {
        return node.route;
      }
    }
    if (node.children) {
      for (const child of node.children) {
        const found = this.findRouteByPath(child, path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private async executeRouteWithDataDrivenUI(
    route: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<void> {
    const { t } = simpleT(this.getSession().locale);

    const executingText = t(
      "app.api.system.unifiedInterface.cli.vibe.executing",
    );
    const routeText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.route",
    );
    const methodText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.method",
    );
    const descriptionText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.description",
    );

    const pathArray = route.path;
    const routePath = Array.isArray(pathArray)
      ? pathArray.join("/")
      : pathArray;
    const alias =
      route.aliases && route.aliases.length > 0 ? route.aliases[0] : undefined;

    // Better visual formatting for route execution
    logger.info(`\n${"─".repeat(60)}`);
    logger.info(`  🚀 ${executingText}: ${alias || routePath}`);
    logger.info("─".repeat(60));
    logger.info(`  ${routeText}: ${routePath}`);
    logger.info(`  ${methodText}: ${route.method}`);
    if (route.description) {
      const { t: routeT } = this.getTranslatorForRoute(route);
      const translatedDescription = routeT(route.description);
      logger.info(`  ${descriptionText}: ${translatedDescription}`);
    }
    logger.info(`${"─".repeat(60)}\n`);

    try {
      const endpoint = await this.getCreateApiEndpoint(route, logger);

      if (!endpoint) {
        const noDefinitionText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.noDefinition",
        );
        logger.warn(noDefinitionText);
        await this.executeRouteBasic(route, logger);
        return;
      }

      await this.generateDataDrivenForm(route, logger);
    } catch (error) {
      const executionFailedText = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      logger.error(executionFailedText, parseError(error));
    }

    const executeAnotherText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executeAnother",
    );
    const shouldContinue = await confirm({
      message: executeAnotherText,
      default: true,
    });

    if (!shouldContinue) {
      return;
    }
  }

  private async collectLocaleSelection(): Promise<CountryLanguage> {
    const { t } = simpleT(this.getSession().locale);

    const selectLocaleText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.selectLocale",
    );

    const englishGlobalText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
    );

    const localeOptions = [
      { name: englishGlobalText, value: "en-GLOBAL" },
      { name: "German (Germany)", value: "de-DE" },
      { name: "Polish (Poland)", value: "pl-PL" },
    ] satisfies Array<{ name: string; value: CountryLanguage }>;

    const sessionLocale = this.getSession().locale;
    // Only use as default if it's one of the available options
    const defaultLocale = localeOptions.some(
      (opt) => opt.value === sessionLocale,
    )
      ? sessionLocale
      : undefined;
    const locale = await select({
      message: selectLocaleText,
      choices: localeOptions,
      default: defaultLocale as
        | (typeof localeOptions)[number]["value"]
        | undefined,
    });

    return locale as CountryLanguage;
  }

  private async generateDataDrivenForm(
    endpoint: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<void> {
    const routePath = endpoint.path.join("/");
    const alias =
      endpoint.aliases && endpoint.aliases.length > 0
        ? endpoint.aliases[0]
        : undefined;
    const title = endpoint.title || alias || routePath;

    logger.info(title);
    if (endpoint.description) {
      logger.info(endpoint.description);
    }

    const selectedLocale = await this.collectLocaleSelection();
    this.getSession().locale = selectedLocale;

    const { t: tSelected } = simpleT(selectedLocale);

    let requestData = {};
    if (endpoint.requestSchema && !this.isEmptySchema(endpoint.requestSchema)) {
      const requestDataText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.requestData",
      );
      logger.info(`\n📝 ${requestDataText}`);
      logger.info("─".repeat(60));
      requestData = await this.generateFormFromSchema(
        endpoint.requestSchema,
        requestDataText,
        logger,
      );
    }

    let urlPathParams = {};
    if (
      endpoint.requestUrlPathParamsSchema &&
      !this.isEmptySchema(endpoint.requestUrlPathParamsSchema)
    ) {
      const urlParametersText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters",
      );
      logger.info(`\n🔗 ${urlParametersText}`);
      logger.info("─".repeat(60));
      urlPathParams = await this.generateFormFromSchema(
        endpoint.requestUrlPathParamsSchema,
        urlParametersText,
        logger,
      );
    }

    if (
      Object.keys(requestData).length > 0 ||
      Object.keys(urlPathParams).length > 0
    ) {
      const previewText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.preview",
      );
      const requestDataText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.requestData",
      );
      const urlParametersText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters",
      );
      const executeWithParamsText = tSelected(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executeWithParams",
      );

      logger.info(`\n${"═".repeat(60)}`);
      logger.info(`  👀 ${previewText}`);
      logger.info("═".repeat(60));
      if (Object.keys(requestData).length > 0) {
        logger.info(`\n${requestDataText}:`);
        logger.info(JSON.stringify(requestData, null, 2));
      }
      if (Object.keys(urlPathParams).length > 0) {
        logger.info(`\n${urlParametersText}:`);
        logger.info(JSON.stringify(urlPathParams, null, 2));
      }
      logger.info("");

      const shouldExecute = await confirm({
        message: executeWithParamsText,
        default: true,
      });

      if (!shouldExecute) {
        return;
      }
    }

    await this.executeRouteWithData(
      endpoint,
      requestData,
      urlPathParams,
      logger,
    );
  }

  private async generateFormFromSchema(
    schema: z.ZodTypeAny,
    title: string,
    logger: EndpointLogger,
  ): Promise<Record<string, string | number | boolean>> {
    try {
      const fields = schemaUIHandler.parseSchema(schema);
      const config = {
        title,
        fields,
      };

      const result = await schemaUIHandler.generateForm(config);
      return result as Record<string, string | number | boolean>;
    } catch (error) {
      logger.warn(`Failed to generate form for ${title}`, {
        errorMessage: parseError(error).message,
      });
      return {};
    }
  }

  private isEmptySchema(schema: z.ZodTypeAny | undefined): boolean {
    if (!schema) {
      return true;
    }

    const schemaWithDef = schema as {
      _def?: { typeName?: string; shape?: Record<string, z.ZodTypeAny> };
    };
    const typeName = schemaWithDef._def?.typeName;
    if (typeName === "ZodUndefined" || typeName === "ZodVoid") {
      return true;
    }

    if (typeName === "ZodObject") {
      const shape = schemaWithDef._def?.shape || {};
      return Object.keys(shape).length === 0;
    }

    return false;
  }

  private async getCreateApiEndpoint(
    route: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny | null> {
    const { definitionLoader } =
      await import("../../unified-interface/shared/endpoints/definition/loader");

    const routePath = route.path.join("/");
    const alias =
      route.aliases && route.aliases.length > 0 ? route.aliases[0] : undefined;
    const resolvedCommand = alias || routePath;
    const result = await definitionLoader.load({
      identifier: resolvedCommand,
      platform: this.session.platform,
      user: this.session.user,
      logger: logger,
    });

    if (!result.success) {
      logger.warn(`Failed to load endpoint definition for ${routePath}`, {
        error: result.message,
      });
      return null;
    }

    return result.data;
  }

  private async executeRouteWithData(
    route: CreateApiEndpointAny,
    requestData: Record<string, string | number | boolean>,
    urlPathParams: Record<string, string | number | boolean>,
    logger: EndpointLogger,
  ): Promise<void> {
    const session = this.getSession();
    // resolvedCommand can be either the alias or the full toolName
    const toolName = endpointToToolName(route);
    const resolvedCommand = (route.aliases && route.aliases[0]) || toolName;
    const context: RouteExecutionContext = {
      toolName: resolvedCommand,
      data: requestData,
      urlPathParams: urlPathParams,
      user: session.user,
      locale: session.locale,
      timestamp: Date.now(),
      options: session.options,
      logger: logger,
      platform: session.platform,
    };

    try {
      const result = await routeDelegationHandler.executeRoute(
        resolvedCommand,
        context,
        logger,
        session.locale,
      );

      const endpointDefinition = await this.getCreateApiEndpoint(route, logger);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        session.options?.output || "pretty",
        endpointDefinition,
        session.locale,
        session.options?.verbose || false,
        logger,
        context,
      );

      logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(session.locale);
      const executionFailedText = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      logger.error(executionFailedText, parseError(error));
    }
  }

  private async executeRouteBasic(
    route: CreateApiEndpointAny,
    logger: EndpointLogger,
  ): Promise<void> {
    const session = this.getSession();
    // resolvedCommand can be either the alias or the full toolName
    const toolName = endpointToToolName(route);
    const resolvedCommand = (route.aliases && route.aliases[0]) || toolName;
    const context: RouteExecutionContext = {
      toolName: resolvedCommand,
      data: {},
      user: session.user,
      locale: session.locale,
      timestamp: Date.now(),
      options: session.options,
      logger: logger,
      platform: session.platform,
    };

    try {
      const result = await routeDelegationHandler.executeRoute(
        resolvedCommand,
        context,
        logger,
        session.locale,
      );

      const endpointDefinition = await this.getCreateApiEndpoint(route, logger);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        session.options?.output || "pretty",
        endpointDefinition,
        session.locale,
        session.options?.verbose || false,
        logger,
        context,
      );

      logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(session.locale);
      const executionFailedText = t(
        "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      logger.error(executionFailedText, parseError(error));
    }
  }

  private async navigationLoop(logger: EndpointLogger): Promise<void> {
    while (true) {
      try {
        const action = await this.showNavigationMenu(logger);

        if (action === InteractiveRepositoryImpl.EXIT_ACTION) {
          const { t } = simpleT(this.getSession().locale);
          const goodbyeText = t(
            "app.api.system.unifiedInterface.cli.vibe.interactive.goodbye",
          );
          logger.info(`\n${goodbyeText}\n`);
          break;
        } else if (action === "separator") {
          continue;
        } else if (action === "view_all") {
          await this.handleViewAllRoutes(logger);
        } else if (action === InteractiveRepositoryImpl.SETTINGS_ACTION) {
          await this.showSettingsMenu(logger);
        } else if (action === InteractiveRepositoryImpl.UP_ACTION) {
          this.navigateUp();
        } else if (action.startsWith(InteractiveRepositoryImpl.NAV_PREFIX)) {
          const targetPath = action.replace(
            InteractiveRepositoryImpl.NAV_PREFIX,
            "",
          );
          this.navigateToPath(targetPath);
        } else if (action.startsWith(InteractiveRepositoryImpl.EXEC_PREFIX)) {
          const routePath = action.replace(
            InteractiveRepositoryImpl.EXEC_PREFIX,
            "",
          );
          await this.executeRouteByPath(routePath, logger);
        }
      } catch (error) {
        const { t } = simpleT(this.getSession().locale);
        const navigationErrorText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.navigationError",
        );
        logger.error(navigationErrorText, parseError(error));
      }
    }
  }

  /**
   * Handle "View All Routes" menu flow
   */
  private async handleViewAllRoutes(logger: EndpointLogger): Promise<void> {
    while (true) {
      const action = await this.showAllRoutesMenu();

      if (action === "back" || action === "separator") {
        break;
      } else if (action.startsWith(InteractiveRepositoryImpl.EXEC_PREFIX)) {
        const routePath = action.replace(
          InteractiveRepositoryImpl.EXEC_PREFIX,
          "",
        );
        await this.executeRouteByPath(routePath, logger);
        break;
      }
    }
  }

  private async showSettingsMenu(logger: EndpointLogger): Promise<void> {
    const session = this.getSession();
    const { t } = simpleT(session.locale);

    const chooseSettingText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseSettingToModify",
    );
    const outputFormatText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.outputFormatCurrent",
    );
    const verboseModeText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.verboseModeCurrent",
    );
    const localeText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.localeCurrent",
    );
    const backToMainMenuText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.backToMainMenu",
    );

    const setting = await select({
      message: chooseSettingText,
      choices: [
        {
          name: outputFormatText.replace(
            InteractiveRepositoryImpl.CURRENT_PLACEHOLDER,
            session.options?.output || "",
          ),
          value: "output",
        },
        {
          name: verboseModeText.replace(
            InteractiveRepositoryImpl.CURRENT_PLACEHOLDER,
            String(session.options?.verbose || false),
          ),
          value: "verbose",
        },
        {
          name: localeText.replace(
            InteractiveRepositoryImpl.CURRENT_PLACEHOLDER,
            session.locale || "",
          ),
          value: "locale",
        },
        { name: backToMainMenuText, value: "back" },
      ],
    });

    if (setting === "back") {
      return;
    }

    await this.updateSetting(setting, logger);
  }

  private async updateSetting(
    setting: string,
    logger: EndpointLogger,
  ): Promise<void> {
    const session = this.getSession();

    switch (setting) {
      case "output": {
        const { t } = simpleT(session.locale);
        const chooseOutputFormatText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseOutputFormat",
        );
        const prettyFormattedText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.prettyFormatted",
        );
        const jsonRawText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.jsonRaw",
        );

        const output = await select({
          message: chooseOutputFormatText,
          choices: [
            { name: prettyFormattedText, value: "pretty" },
            { name: jsonRawText, value: "json" },
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
        const { t } = simpleT(session.locale);
        const enableVerboseOutputText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.enableVerboseOutput",
        );

        const verbose = await confirm({
          message: enableVerboseOutputText,
          default: session.options?.verbose,
        });
        session.options = {
          ...session.options,
          verbose: verbose,
        };
        break;
      }

      case "locale": {
        const { t } = simpleT(session.locale);
        const chooseLocaleText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.chooseLocale",
        );
        const englishGlobalText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
        );
        const germanText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.german",
        );
        const polishText = t(
          "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.polish",
        );

        const localeChoices = [
          { name: englishGlobalText, value: "en-GLOBAL" },
          { name: germanText, value: "de-DE" },
          { name: polishText, value: "pl-PL" },
        ] satisfies Array<{ name: string; value: CountryLanguage }>;
        // Only use as default if it's one of the available options
        const defaultLocale = localeChoices.some(
          (opt) => opt.value === session.locale,
        )
          ? session.locale
          : undefined;
        const locale = await select({
          message: chooseLocaleText,
          choices: localeChoices,
          default: defaultLocale as
            | (typeof localeChoices)[number]["value"]
            | undefined,
        });
        session.locale = locale as CountryLanguage;
        break;
      }
    }

    const { t } = simpleT(session.locale);
    const settingUpdatedText = t(
      "app.api.system.unifiedInterface.cli.vibe.interactive.navigation.settingUpdated",
    );
    logger.info(settingUpdatedText);
  }
}

export const interactiveRepository: InteractiveRepository =
  new InteractiveRepositoryImpl();

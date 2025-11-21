/**
 * Interactive Mode Repository
 * Contains all business logic for interactive file explorer mode
 */

import "server-only";

import { confirm, select } from "@inquirer/prompts";
import {
  fail,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { endpoints } from "../../generated/endpoints";
import type {
  DiscoveredRoute,
  RouteExecutionContext,
} from "../../unified-interface/cli/route-executor";
import { routeDelegationHandler } from "../../unified-interface/cli/route-executor";
import { Platform } from "../../unified-interface/shared/types/platform";
import { splitPath } from "../../unified-interface/shared/utils/path";
import { schemaUIHandler } from "../../unified-interface/cli/widgets/schema-ui-handler";

/**
 * Interactive session state
 */
interface InteractiveSession {
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
  locale: CountryLanguage;
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
  route?: DiscoveredRoute;
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
  ): Promise<ResponseType<{ started: boolean }>> {
    if (!user) {
      return fail({
        message: "app.api.v1.core.system.help.interactive.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      this.logger = logger;
      this.initializeDefaultSession(locale, user);
      this.setupSignalHandlers();

      const { t } = simpleT(this.getSession().locale);

      // Show welcome message
      this.logger.info(
        t("app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.welcome"),
      );
      this.logger.info(
        t("app.api.v1.core.system.unifiedInterface.cli.vibe.help.description"),
      );
      this.logger.info("");

      // Build route tree for file explorer navigation
      // Convert nested endpoints object to array of DiscoveredRoute
      const routesArray: DiscoveredRoute[] = [];

      // Helper function to recursively extract routes from nested structure
      const extractRoutes = (obj: any, pathParts: string[] = []): void => {
        for (const [key, value] of Object.entries(obj)) {
          if (!value || typeof value !== 'object') continue;

          // Check if this is an API section (has HTTP methods)
          const methods = Object.keys(value).filter(k =>
            ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(k)
          );

          if (methods.length > 0) {
            // This is an endpoint - extract route info
            const fullPath = [...pathParts, key].join('/');
            for (const method of methods) {
              const endpoint = value[method];
              if (endpoint && endpoint.path) {
                const pathArray = Array.isArray(endpoint.path) ? endpoint.path : [endpoint.path];
                const routePath = pathArray.join('/');

                routesArray.push({
                  alias: endpoint.aliases?.[0] || fullPath,
                  path: `/api/[locale]/${routePath}`,
                  method: method,
                  routePath: fullPath,
                  description: typeof endpoint.description === 'string' ? endpoint.description : undefined,
                });
              }
            }
          } else {
            // Continue traversing nested structure
            extractRoutes(value, [...pathParts, key]);
          }
        }
      };

      extractRoutes(endpoints);

      this.buildRouteTree(routesArray);

      // Start at root
      this.currentNode = this.routeTree;
      this.updateBreadcrumbs();

      // Main navigation loop
      await this.navigationLoop();

      return success({ started: true });
    } catch (error) {
      logger.error("Failed to start interactive mode", parseError(error));
      return fail({
        message: "app.api.v1.core.system.help.interactive.errors.server.title",
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
        user: { id: "system", leadId: "system", isPublic: false },
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
  ): void {
    this.session = {
      options: {
        verbose: false,
        output: "pretty",
      },
      locale,
      user,
    };
  }

  private buildRouteTree(routes: DiscoveredRoute[]): void {
    const { t } = simpleT(this.getSession().locale);

    this.routeTree = {
      name: t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.rootName",
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

  private addRouteToTree(route: DiscoveredRoute): void {
    if (!this.routeTree) {
      return;
    }

    if (!route.path || typeof route.path !== "string") {
      return;
    }

    const pathParts = splitPath(route.path).slice(4);

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

  private async showNavigationMenu(): Promise<string> {
    if (!this.currentNode) {
      return "exit";
    }

    const { t } = simpleT(this.getSession().locale);

    const breadcrumbPath = this.breadcrumbs.map((b) => b.name).join(" > ");
    this.logger.info(
      `${t("app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon")} ${breadcrumbPath}`,
    );

    const choices: Array<{ name: string; value: string }> = [];

    if (this.currentNode.parent) {
      const upIcon = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.upIcon",
      );
      const goUpText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.goUp",
      );
      const upName = `${upIcon} (${goUpText})`;
      choices.push({
        name: upName,
        value: InteractiveRepositoryImpl.UP_ACTION,
      });
    }

    if (this.currentNode.children) {
      const directoryIcon = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.directoryIcon",
      );
      const routeIcon = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.routeIcon",
      );
      const routesText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.routes",
      );
      const noDescriptionText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.routeNotFound",
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
          const description = child.route.description || noDescriptionText;
          const routeName = `${routeIcon} ${child.name} - ${description}`;
          choices.push({
            name: routeName,
            value: InteractiveRepositoryImpl.EXEC_PREFIX + child.route.path,
          });
        }
      }
    }

    if (choices.length) {
      choices.push({ name: "─────────────────────", value: "separator" });
    }

    const settingsIcon = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.settingsIcon",
    );
    const settingsText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.settings",
    );
    const exitIcon = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.exitIcon",
    );
    const exitText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.exit",
    );
    const navigateMessage = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.navigate",
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
      pageSize: 15,
    });

    return action;
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

  private async executeRouteByPath(routePath: string): Promise<void> {
    if (!this.routeTree) {
      return;
    }

    const route = this.findRouteByPath(this.routeTree, routePath);
    if (route) {
      await this.executeRouteWithDataDrivenUI(route);
    }
  }

  private findRouteByPath(
    node: DirectoryNode,
    path: string,
  ): DiscoveredRoute | null {
    if (node.route && node.route.path === path) {
      return node.route;
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
    route: DiscoveredRoute,
  ): Promise<void> {
    const { t } = simpleT(this.getSession().locale);

    const executingText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.executing",
    );
    const routeText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.route",
    );
    const methodText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.method",
    );
    const descriptionText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.description",
    );

    this.logger.info(`${executingText}: ${route.alias || route.path}`);
    this.logger.info(`${routeText}: ${route.path}`);
    this.logger.info(`${methodText}: ${route.method}`);
    if (route.description) {
      this.logger.info(`${descriptionText}: ${route.description}`);
    }

    try {
      const endpoint = await this.getCreateApiEndpoint(route);

      if (!endpoint) {
        const noDefinitionText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.noDefinition",
        );
        this.logger.warn(noDefinitionText);
        await this.executeRouteBasic(route);
        return;
      }

      await this.generateDataDrivenForm(route, endpoint);
    } catch (error) {
      const executionFailedText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, parseError(error));
    }

    const executeAnotherText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.executeAnother",
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
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.selectLocale",
    );

    const englishGlobalText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
    );

    const localeOptions = [
      { name: englishGlobalText, value: "en-GLOBAL" },
      { name: "German (Germany)", value: "de-DE" },
      { name: "Polish (Poland)", value: "pl-PL" },
    ] satisfies Array<{ name: string; value: CountryLanguage }>;

    const locale = await select({
      message: selectLocaleText,
      choices: localeOptions,
      default: this.getSession().locale,
    });

    return locale as CountryLanguage;
  }

  private async generateDataDrivenForm(
    route: DiscoveredRoute,
    endpoint: {
      title?: string;
      description?: string;
      requestSchema?: z.ZodTypeAny;
      requestUrlPathParamsSchema?: z.ZodTypeAny;
    },
  ): Promise<void> {
    const title = endpoint.title || route.alias || route.path;

    this.logger.info(title);
    if (endpoint.description) {
      this.logger.info(endpoint.description);
    }

    const selectedLocale = await this.collectLocaleSelection();
    this.getSession().locale = selectedLocale;

    const { t: tSelected } = simpleT(selectedLocale);

    let requestData = {};
    if (endpoint.requestSchema && !this.isEmptySchema(endpoint.requestSchema)) {
      const requestDataText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.requestData",
      );
      this.logger.info(requestDataText);
      requestData = await this.generateFormFromSchema(
        endpoint.requestSchema,
        requestDataText,
      );
    }

    let urlPathParams = {};
    if (
      endpoint.requestUrlPathParamsSchema &&
      !this.isEmptySchema(endpoint.requestUrlPathParamsSchema)
    ) {
      const urlParametersText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters",
      );
      this.logger.info(urlParametersText);
      urlPathParams = await this.generateFormFromSchema(
        endpoint.requestUrlPathParamsSchema,
        urlParametersText,
      );
    }

    if (
      Object.keys(requestData).length ||
      Object.keys(urlPathParams).length
    ) {
      const previewText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.preview",
      );
      const requestDataText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.requestData",
      );
      const urlParametersText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.urlParameters",
      );
      const executeWithParamsText = tSelected(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.executeWithParams",
      );

      this.logger.info(previewText);
      if (Object.keys(requestData).length) {
        this.logger.info(
          `${requestDataText}: ${JSON.stringify(requestData, null, 2)}`,
        );
      }
      if (Object.keys(urlPathParams).length) {
        this.logger.info(
          `${urlParametersText}: ${JSON.stringify(urlPathParams, null, 2)}`,
        );
      }

      const shouldExecute = await confirm({
        message: executeWithParamsText,
        default: true,
      });

      if (!shouldExecute) {
        return;
      }
    }

    await this.executeRouteWithData(route, requestData, urlPathParams);
  }

  private async generateFormFromSchema(
    schema: z.ZodTypeAny,
    title: string,
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
      this.logger.warn(`Failed to generate form for ${title}`, {
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

  private async getCreateApiEndpoint(route: DiscoveredRoute): Promise<{
    title?: string;
    description?: string;
    requestSchema?: z.ZodTypeAny;
    requestUrlPathParamsSchema?: z.ZodTypeAny;
  } | null> {
    const { loadEndpointDefinition } = await import(
      "../../unified-interface/shared/registry/definition-loader"
    );

    const result = await loadEndpointDefinition(
      {
        routePath: route.routePath,
        method: route.method,
      },
      this.logger,
    );

    if (result.error) {
      this.logger.warn(
        `Failed to load endpoint definition for ${route.routePath}`,
        {
          error: result.error,
        },
      );
      return null;
    }

    const definition = result.definition;
    if (!definition || typeof definition !== "object") {
      return null;
    }

    return {
      title:
        "title" in definition && typeof definition.title === "string"
          ? definition.title
          : undefined,
      description:
        "description" in definition &&
        typeof definition.description === "string"
          ? definition.description
          : undefined,
      requestSchema:
        "requestSchema" in definition &&
        definition.requestSchema instanceof z.ZodType
          ? definition.requestSchema
          : undefined,
      requestUrlPathParamsSchema:
        "requestUrlPathParamsSchema" in definition &&
        definition.requestUrlPathParamsSchema instanceof z.ZodType
          ? definition.requestUrlPathParamsSchema
          : undefined,
    };
  }

  private async executeRouteWithData(
    route: DiscoveredRoute,
    requestData: Record<string, string | number | boolean>,
    urlPathParams: Record<string, string | number | boolean>,
  ): Promise<void> {
    const session = this.getSession();
    const context: RouteExecutionContext = {
      toolName: route.alias,
      data: requestData,
      urlPathParams: urlPathParams,
      user: session.user,
      locale: session.locale,
      options: session.options,
      logger: this.logger,
      platform: Platform.CLI,
    };

    try {
      const { t } = simpleT(session.locale);
      const result = await routeDelegationHandler.executeRoute(
        route,
        context,
        this.logger,
        session.locale,
        t,
      );

      const endpointDefinition = await this.getCreateApiEndpoint(route);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        session.options?.output || "pretty",
        endpointDefinition,
        session.locale,
        session.options?.verbose || false,
        this.logger,
      );

      this.logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(session.locale);
      const executionFailedText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, parseError(error));
    }
  }

  private async executeRouteBasic(route: DiscoveredRoute): Promise<void> {
    const session = this.getSession();
    const context: RouteExecutionContext = {
      toolName: route.alias,
      data: {},
      user: session.user,
      locale: session.locale,
      options: session.options,
      logger: this.logger,
      platform: Platform.CLI,
    };

    try {
      const { t } = simpleT(session.locale);
      const result = await routeDelegationHandler.executeRoute(
        route,
        context,
        this.logger,
        session.locale,
        t,
      );

      const endpointDefinition = await this.getCreateApiEndpoint(route);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        session.options?.output || "pretty",
        endpointDefinition,
        session.locale,
        session.options?.verbose || false,
        this.logger,
      );

      this.logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(session.locale);
      const executionFailedText = t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, parseError(error));
    }
  }

  private async navigationLoop(): Promise<void> {
    while (true) {
      try {
        const action = await this.showNavigationMenu();

        if (action === InteractiveRepositoryImpl.EXIT_ACTION) {
          const { t } = simpleT(this.getSession().locale);
          const goodbyeText = t(
            "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.goodbye",
          );
          this.logger.info(goodbyeText);
          break;
        } else if (action === "separator") {
          continue;
        } else if (action === InteractiveRepositoryImpl.SETTINGS_ACTION) {
          await this.showSettingsMenu();
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
          await this.executeRouteByPath(routePath);
        }
      } catch (error) {
        const { t } = simpleT(this.getSession().locale);
        const navigationErrorText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.navigationError",
        );
        this.logger.error(navigationErrorText, parseError(error));
      }
    }
  }

  private async showSettingsMenu(): Promise<void> {
    const session = this.getSession();
    const { t } = simpleT(session.locale);

    const chooseSettingText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.chooseSettingToModify",
    );
    const outputFormatText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.outputFormatCurrent",
    );
    const verboseModeText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.verboseModeCurrent",
    );
    const localeText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.localeCurrent",
    );
    const backToMainMenuText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.backToMainMenu",
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

    await this.updateSetting(setting);
  }

  private async updateSetting(setting: string): Promise<void> {
    const session = this.getSession();

    switch (setting) {
      case "output": {
        const { t } = simpleT(session.locale);
        const chooseOutputFormatText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.chooseOutputFormat",
        );
        const prettyFormattedText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.prettyFormatted",
        );
        const jsonRawText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.jsonRaw",
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
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.enableVerboseOutput",
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
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.chooseLocale",
        );
        const englishGlobalText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.englishGlobal",
        );
        const germanText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.german",
        );
        const polishText = t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.polish",
        );

        const locale = await select({
          message: chooseLocaleText,
          choices: [
            { name: englishGlobalText, value: "en-GLOBAL" },
            { name: germanText, value: "de-DE" },
            { name: polishText, value: "pl-PL" },
          ] satisfies Array<{ name: string; value: CountryLanguage }>,
          default: session.locale,
        });
        session.locale = locale as CountryLanguage;
        break;
      }
    }

    const { t } = simpleT(session.locale);
    const settingUpdatedText = t(
      "app.api.v1.core.system.unifiedInterface.cli.vibe.interactive.navigation.settingUpdated",
    );
    this.logger.info(settingUpdatedText);
  }
}

export const interactiveRepository: InteractiveRepository =
  new InteractiveRepositoryImpl();

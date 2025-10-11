/**
 * Interactive Mode Handler
 * Provides file explorer-like navigation and form-based interface that respects data-driven UI
 */

import inquirer from "inquirer";
import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../../../../../user/auth/definition";
import type {
  DiscoveredRoute,
  RouteExecutionContext,
} from "../../../utils/route-delegation-handler";
import { routeDelegationHandler } from "../../../utils/route-delegation-handler";
import type { EndpointLogger } from "../../endpoint-handler/logger";
import { schemaUIHandler } from "./schema-ui-handler";

// Type for endpoint fields
interface EndpointField {
  type: string;
  usage: string[];
  config?: Record<string, string | number | boolean>;
}

/**
 * Interactive session state
 */
interface InteractiveSession {
  user?: JwtPayloadType;
  locale?: CountryLanguage;
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

/**
 * Interactive mode handler class with file explorer navigation
 */
export class InteractiveModeHandler {
  private session: InteractiveSession = {};
  private routeTree: DirectoryNode | null = null;
  private currentNode: DirectoryNode | null = null;
  private breadcrumbs: NavigationBreadcrumb[] = [];
  private logger!: EndpointLogger;

  // Constants for action prefixes
  // eslint-disable-next-line i18next/no-literal-string
  private static readonly NAV_PREFIX = "nav:";
  // eslint-disable-next-line i18next/no-literal-string
  private static readonly EXEC_PREFIX = "exec:";

  private static readonly UP_ACTION = "up";

  private static readonly EXIT_ACTION = "exit";

  private static readonly SETTINGS_ACTION = "settings";

  // Constants for template placeholders
  // eslint-disable-next-line i18next/no-literal-string
  private static readonly CURRENT_PLACEHOLDER = "{current}";

  /**
   * Set up signal handlers for graceful exit
   */
  private setupSignalHandlers(): void {
    // Remove default listeners first
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");

    process.on("SIGINT", () => {
      // eslint-disable-next-line no-console
      console.log(""); // Use console.log for immediate output in signal handler
      // eslint-disable-next-line no-console, i18next/no-literal-string
      console.log("Goodbye!");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      process.exit(0);
    });
  }

  /**
   * Initialize session with default values for better UX
   */
  private initializeDefaultSession(): void {
    this.session = {
      options: {
        verbose: false,
        output: "pretty",
      },
      locale: "en-GLOBAL",
    };
  }

  /**
   * Start interactive mode with file explorer navigation
   */
  async startInteractiveMode(
    routes: DiscoveredRoute[],
    logger: EndpointLogger,
  ): Promise<void> {
    // Store logger for use throughout the class
    this.logger = logger;

    // Initialize with default session first (needed for locale)
    this.initializeDefaultSession();

    // Set up Ctrl+C handling
    this.setupSignalHandlers();

    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    // Show welcome message
    this.logger.info(t("app.api.v1.core.system.cli.vibe.interactive.welcome"));
    this.logger.info(t("app.api.v1.core.system.cli.vibe.help.description"));
    this.logger.info(""); // Empty line for better spacing

    // Build route tree for file explorer navigation
    this.buildRouteTree(routes);

    // Start at root
    this.currentNode = this.routeTree;
    this.updateBreadcrumbs();

    // Main navigation loop
    await this.navigationLoop();
  }

  /**
   * Build route tree from discovered routes for file explorer navigation
   */
  private buildRouteTree(routes: DiscoveredRoute[]): void {
    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    this.routeTree = {
      name: t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.rootName",
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

  /**
   * Add a route to the tree structure
   */
  private addRouteToTree(route: DiscoveredRoute): void {
    if (!this.routeTree) {
      return;
    }

    // Parse route path: /api/[locale]/v1/core/system/unified-ui/cli/setup -> ["core", "system", "cli", "setup"]
    // Safety check for route.path
    if (!route.path || typeof route.path !== "string") {
      return;
    }

    const pathParts = route.path.split("/").filter(Boolean).slice(4); // Remove /api/[locale]/v1 prefix

    let currentNode = this.routeTree;

    // Navigate/create directory structure
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

  /**
   * Sort tree nodes alphabetically
   */
  private sortTree(node: DirectoryNode): void {
    if (node.children) {
      node.children.sort((a, b) => {
        // Directories first, then routes
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      node.children.forEach((child) => this.sortTree(child));
    }
  }

  /**
   * Update breadcrumbs for current navigation
   */
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

  /**
   * Show navigation menu with file explorer interface
   */
  private async showNavigationMenu(): Promise<string> {
    if (!this.currentNode) {
      return "exit";
    }

    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    // Display breadcrumbs
    const breadcrumbPath = this.breadcrumbs.map((b) => b.name).join(" > ");
    this.logger.info(
      `${t("app.api.v1.core.system.cli.vibe.interactive.navigation.directoryIcon")} ${breadcrumbPath}`,
    );

    const choices: Array<{ name: string; value: string }> = [];

    // Add "up" option if not at root
    if (this.currentNode.parent) {
      const upIcon = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.upIcon",
      );
      const goUpText = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.goUp",
      );
      // eslint-disable-next-line i18next/no-literal-string
      const upName = `${upIcon} (${goUpText})`;
      choices.push({
        name: upName,
        value: InteractiveModeHandler.UP_ACTION,
      });
    }

    // Add directories and routes in current location
    if (this.currentNode.children) {
      const directoryIcon = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.directoryIcon",
      );
      const routeIcon = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.routeIcon",
      );
      const routesText = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.routes",
      );
      const noDescriptionText = t(
        "app.api.v1.core.system.cli.vibe.errors.routeNotFound",
      );

      for (const child of this.currentNode.children) {
        if (child.type === "directory") {
          const routeCount = this.countRoutesInDirectory(child);
          // eslint-disable-next-line i18next/no-literal-string
          const directoryName = `${directoryIcon} ${child.name}/ (${
            routeCount
          } ${routesText})`;
          choices.push({
            name: directoryName,
            value: InteractiveModeHandler.NAV_PREFIX + child.path,
          });
        } else if (child.type === "route" && child.route) {
          const description = child.route.description || noDescriptionText;
          const routeName = `${routeIcon} ${child.name} - ${description}`;
          choices.push({
            name: routeName,
            value: InteractiveModeHandler.EXEC_PREFIX + child.route.path,
          });
        }
      }
    }

    // Add separator if there are routes/directories
    if (choices.length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      choices.push({ name: "─────────────────────", value: "separator" });
    }

    // Add global actions
    const settingsIcon = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.settingsIcon",
    );
    const settingsText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.settings",
    );
    const exitIcon = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.exitIcon",
    );
    const exitText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.exit",
    );
    const navigateMessage = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.navigate",
    );

    choices.push(
      {
        name: `${settingsIcon} ${settingsText}`,
        value: InteractiveModeHandler.SETTINGS_ACTION,
      },
      {
        name: `${exitIcon} ${exitText}`,
        value: InteractiveModeHandler.EXIT_ACTION,
      },
    );

    const choice = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: navigateMessage,
        choices,
        pageSize: 15,
      },
    ]);

    return choice.action as string;
  }

  /**
   * Count routes in a directory recursively
   */
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

  /**
   * Navigate up one level
   */
  private navigateUp(): void {
    if (this.currentNode?.parent) {
      this.currentNode = this.currentNode.parent;
      this.updateBreadcrumbs();
    }
  }

  /**
   * Navigate to a specific path
   */
  private navigateToPath(targetPath: string): void {
    if (!this.routeTree) {
      return;
    }

    const findNodeByPath = (
      node: DirectoryNode,
      path: string,
    ): DirectoryNode | null => {
      if (node.path === path) {
        return node;
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findNodeByPath(child, path);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const targetNode = findNodeByPath(this.routeTree, targetPath);
    if (targetNode) {
      this.currentNode = targetNode;
      this.updateBreadcrumbs();
    }
  }

  /**
   * Execute a route by its path
   */
  private async executeRouteByPath(routePath: string): Promise<void> {
    if (!this.routeTree) {
      return;
    }

    const findRouteByPath = (
      node: DirectoryNode,
      path: string,
    ): DiscoveredRoute | null => {
      if (node.route && node.route.path === path) {
        return node.route;
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findRouteByPath(child, path);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const route = findRouteByPath(this.routeTree, routePath);
    if (route) {
      await this.executeRouteWithDataDrivenUI(route);
    }
  }

  /**
   * Execute route with data-driven UI form interface
   */
  private async executeRouteWithDataDrivenUI(
    route: DiscoveredRoute,
  ): Promise<void> {
    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    const executingText = t("app.api.v1.core.system.cli.vibe.vibe.executing");
    const routeText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.route",
    );
    const methodText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.method",
    );
    const descriptionText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.description",
    );

    this.logger.info(`${executingText}: ${route.alias || route.path}`);
    this.logger.info(`${routeText}: ${route.path}`);
    this.logger.info(`${methodText}: ${route.method}`);
    if (route.description) {
      this.logger.info(`${descriptionText}: ${route.description}`);
    }

    try {
      // Get endpoint definition for data-driven UI
      const endpoint = await this.getEndpointDefinition(route);

      if (!endpoint) {
        const noDefinitionText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.noDefinition",
        );
        this.logger.warn(noDefinitionText);
        await this.executeRouteBasic(route);
        return;
      }

      // Generate form-like interface from endpoint definition
      await this.generateDataDrivenForm(route, endpoint);
    } catch (error) {
      const executionFailedText = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, error as Error);
    }

    // Ask if user wants to continue
    const executeAnotherText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.executeAnother",
    );
    const continueChoice = await inquirer.prompt([
      {
        type: "confirm",
        name: "continue",
        message: executeAnotherText,
        default: true,
      },
    ]);

    if (!continueChoice.continue) {
      return;
    }
  }

  /**
   * Collect locale selection for route execution
   */
  private async collectLocaleSelection(): Promise<CountryLanguage> {
    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    const selectLocaleText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.selectLocale",
    );

    // Available locale combinations based on the actual language config
    const englishGlobalText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.englishGlobal",
    );

    const localeOptions = [
      { name: englishGlobalText, value: "en-GLOBAL" },
      // eslint-disable-next-line i18next/no-literal-string
      { name: "German (Germany)", value: "de-DE" },
      // eslint-disable-next-line i18next/no-literal-string
      { name: "Polish (Poland)", value: "pl-PL" },
    ] satisfies Array<{ name: string; value: CountryLanguage }>;

    const localeChoice = await inquirer.prompt([
      {
        type: "list",
        name: "locale",
        message: selectLocaleText,
        choices: localeOptions,
        default: this.session.locale || "en-GLOBAL",
      },
    ]);

    return localeChoice.locale as CountryLanguage;
  }

  /**
   * Generate data-driven form interface from endpoint definition
   */
  private async generateDataDrivenForm(
    route: DiscoveredRoute,
    endpoint: {
      title?: string;
      description?: string;
      requestSchema?: z.ZodTypeAny;
      requestUrlParamsSchema?: z.ZodTypeAny;
    },
  ): Promise<void> {
    const title = endpoint.title || route.alias || route.path;

    this.logger.info(title);
    if (endpoint.description) {
      this.logger.info(endpoint.description);
    }

    // Always collect locale first (all routes need locale)
    const selectedLocale = await this.collectLocaleSelection();

    // Update session locale for this route execution
    this.session.locale = selectedLocale;

    // Get new translation context with selected locale
    const { t: tSelected } = simpleT(selectedLocale);

    // Collect request data if schema exists
    let requestData = {};
    if (endpoint.requestSchema && !this.isEmptySchema(endpoint.requestSchema)) {
      const requestDataText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.requestData",
      );
      this.logger.info(requestDataText);
      requestData = await this.generateFormFromSchema(
        endpoint.requestSchema,
        requestDataText,
      );
    }

    // Collect URL parameters if schema exists
    let urlParams = {};
    if (
      endpoint.requestUrlParamsSchema &&
      !this.isEmptySchema(endpoint.requestUrlParamsSchema)
    ) {
      const urlParametersText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.urlParameters",
      );
      this.logger.info(urlParametersText);
      urlParams = await this.generateFormFromSchema(
        endpoint.requestUrlParamsSchema,
        urlParametersText,
      );
    }

    // Show preview before execution
    if (
      Object.keys(requestData).length > 0 ||
      Object.keys(urlParams).length > 0
    ) {
      const previewText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.preview",
      );
      const requestDataText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.requestData",
      );
      const urlParametersText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.urlParameters",
      );
      const executeWithParamsText = tSelected(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.executeWithParams",
      );

      this.logger.info(previewText);
      if (Object.keys(requestData).length > 0) {
        this.logger.info(
          `${requestDataText}: ${JSON.stringify(requestData, null, 2)}`,
        );
      }
      if (Object.keys(urlParams).length > 0) {
        this.logger.info(
          `${urlParametersText}: ${JSON.stringify(urlParams, null, 2)}`,
        );
      }

      const confirmExecution = await inquirer.prompt([
        {
          type: "confirm",
          name: "execute",
          message: executeWithParamsText,
          default: true,
        },
      ]);

      if (!confirmExecution.execute) {
        return;
      }
    }

    // Execute the route
    await this.executeRouteWithData(route, requestData, urlParams);
  }

  /**
   * Generate form from Zod schema with enhanced UI
   */
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

      // schemaUIHandler.generateForm returns any, but we know it returns form data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await schemaUIHandler.generateForm(config);
      return result as Record<string, string | number | boolean>;
    } catch (error) {
      this.logger.warn(`Failed to generate form for ${title}`, {
        errorMessage: (error as Error).message,
      });
      return {};
    }
  }

  /**
   * Check if schema is empty (undefined, void, or empty object)
   */
  private isEmptySchema(schema: z.ZodTypeAny | undefined): boolean {
    if (!schema) {
      return true;
    }

    // Check for Zod undefined/void schemas
    const schemaWithDef = schema as {
      _def?: { typeName?: string; shape?: Record<string, z.ZodTypeAny> };
    };
    const typeName = schemaWithDef._def?.typeName;
    if (typeName === "ZodUndefined" || typeName === "ZodVoid") {
      return true;
    }

    // Check for empty object schemas
    if (typeName === "ZodObject") {
      const shape = schemaWithDef._def?.shape || {};
      return Object.keys(shape).length === 0;
    }

    return false;
  }

  /**
   * Get endpoint definition from route (reused from route-delegation-handler)
   */
  private async getEndpointDefinition(route: DiscoveredRoute): Promise<{
    title?: string;
    description?: string;
    requestSchema?: z.ZodTypeAny;
    requestUrlParamsSchema?: z.ZodTypeAny;
    responseSchema?: z.ZodTypeAny;
    fields?: Record<string, EndpointField>;
  } | null> {
    try {
      // Import the route module dynamically
      const routeModule = (await import(route.routePath)) as {
        tools?: {
          definitions?: Record<
            string,
            {
              title?: string;
              description?: string;
              requestSchema?: z.ZodTypeAny;
              requestUrlParamsSchema?: z.ZodTypeAny;
              responseSchema?: z.ZodTypeAny;
              fields?: Record<string, EndpointField>;
            }
          >;
        };
      };

      // Get the definitions from the tools export (new structure)
      if (routeModule.tools?.definitions) {
        const definitions = routeModule.tools.definitions;
        return definitions[route.method] || definitions.POST || definitions.GET;
      }

      // Fallback: try to import definition file directly
      const definitionPath = route.routePath.replace(
        "/route.ts",
        "/definition.ts",
      );
      try {
        const definitionModule = (await import(definitionPath)) as {
          default?: Record<
            string,
            {
              title?: string;
              description?: string;
              requestSchema?: z.ZodTypeAny;
              requestUrlParamsSchema?: z.ZodTypeAny;
              responseSchema?: z.ZodTypeAny;
              fields?: Record<string, EndpointField>;
            }
          >;
        };
        const definitions = definitionModule.default;
        if (definitions?.[route.method]) {
          return definitions[route.method];
        }
      } catch {
        // Definition file not found or doesn't export expected structure
      }

      return null;
    } catch (error) {
      this.logger.warn(
        `Failed to load endpoint definition for ${route.routePath}`,
        {
          errorMessage: (error as Error).message,
        },
      );
      return null;
    }
  }

  /**
   * Execute route with collected data
   */
  private async executeRouteWithData(
    route: DiscoveredRoute,
    requestData: Record<string, string | number | boolean>,
    urlParams: Record<string, string | number | boolean>,
  ): Promise<void> {
    const context: RouteExecutionContext = {
      command: route.alias,
      data: requestData,
      urlParams: urlParams,
      user: this.session.user,
      locale: this.session.locale,
      options: this.session.options,
    };

    try {
      const { t } = simpleT(this.session.locale || "en-GLOBAL");
      const result = await routeDelegationHandler.executeRoute(
        route,
        context,
        this.logger,
        this.session.locale || "en-GLOBAL",
        t,
      );

      // Get endpoint definition for enhanced rendering
      const endpointDefinition = await this.getEndpointDefinition(route);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        this.session.options?.output || "pretty",
        endpointDefinition,
        this.session.locale || "en-GLOBAL",
        this.session.options?.verbose || false,
        this.logger,
      );

      this.logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(this.session.locale || "en-GLOBAL");
      const executionFailedText = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, error as Error);
    }
  }

  /**
   * Execute route with basic input collection (fallback)
   */
  private async executeRouteBasic(route: DiscoveredRoute): Promise<void> {
    const context: RouteExecutionContext = {
      command: route.alias,
      user: this.session.user,
      locale: this.session.locale,
      options: this.session.options,
    };

    try {
      const { t } = simpleT(this.session.locale || "en-GLOBAL");
      const result = await routeDelegationHandler.executeRoute(
        route,
        context,
        this.logger,
        this.session.locale || "en-GLOBAL",
        t,
      );

      // Get endpoint definition for enhanced rendering
      const endpointDefinition = await this.getEndpointDefinition(route);

      const formattedResult = routeDelegationHandler.formatResult(
        result,
        this.session.options?.output || "pretty",
        endpointDefinition,
        this.session.locale || "en-GLOBAL",
        this.session.options?.verbose || false,
        this.logger,
      );

      this.logger.info(formattedResult);
    } catch (error) {
      const { t } = simpleT(this.session.locale || "en-GLOBAL");
      const executionFailedText = t(
        "app.api.v1.core.system.cli.vibe.interactive.navigation.executionFailed",
      );
      this.logger.error(executionFailedText, error as Error);
    }
  }

  /**
   * Main navigation loop with file explorer interface
   */
  private async navigationLoop(): Promise<void> {
    while (true) {
      try {
        const action = await this.showNavigationMenu();

        if (action === InteractiveModeHandler.EXIT_ACTION) {
          const { t } = simpleT(this.session.locale || "en-GLOBAL");
          const goodbyeText = t(
            "app.api.v1.core.system.cli.vibe.interactive.goodbye",
          );
          this.logger.info(goodbyeText);
          break;
        } else if (action === "separator") {
          // Ignore separator selection, just continue
          continue;
        } else if (action === InteractiveModeHandler.SETTINGS_ACTION) {
          await this.showSettingsMenu();
        } else if (action === InteractiveModeHandler.UP_ACTION) {
          this.navigateUp();
        } else if (action.startsWith(InteractiveModeHandler.NAV_PREFIX)) {
          const targetPath = action.replace(
            InteractiveModeHandler.NAV_PREFIX,
            "",
          );
          this.navigateToPath(targetPath);
        } else if (action.startsWith(InteractiveModeHandler.EXEC_PREFIX)) {
          const routePath = action.replace(
            InteractiveModeHandler.EXEC_PREFIX,
            "",
          );
          await this.executeRouteByPath(routePath);
        }
      } catch (error) {
        const { t } = simpleT(this.session.locale || "en-GLOBAL");
        const navigationErrorText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.navigationError",
        );
        this.logger.error(navigationErrorText, error as Error);
      }
    }
  }

  /**
   * Show settings menu
   */
  private async showSettingsMenu(): Promise<void> {
    const { t } = simpleT(this.session.locale || "en-GLOBAL");

    const chooseSettingText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.chooseSettingToModify",
    );
    const outputFormatText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.outputFormatCurrent",
    );
    const verboseModeText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.verboseModeCurrent",
    );
    const localeText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.localeCurrent",
    );
    const backToMainMenuText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.backToMainMenu",
    );

    const settingsChoice = await inquirer.prompt([
      {
        type: "list",
        name: "setting",
        message: chooseSettingText,
        choices: [
          {
            name: outputFormatText.replace(
              InteractiveModeHandler.CURRENT_PLACEHOLDER,
              this.session.options?.output || "",
            ),
            value: "output",
          },
          {
            name: verboseModeText.replace(
              InteractiveModeHandler.CURRENT_PLACEHOLDER,
              String(this.session.options?.verbose || false),
            ),
            value: "verbose",
          },
          {
            name: localeText.replace(
              InteractiveModeHandler.CURRENT_PLACEHOLDER,
              this.session.locale || "",
            ),
            value: "locale",
          },
          { name: backToMainMenuText, value: "back" },
        ],
      },
    ]);

    if (settingsChoice.setting === "back") {
      return;
    }

    await this.updateSetting(settingsChoice.setting as string);
  }

  /**
   * Update session setting
   */
  private async updateSetting(setting: string): Promise<void> {
    switch (setting) {
      case "output": {
        const { t } = simpleT(this.session.locale || "en-GLOBAL");
        const chooseOutputFormatText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.chooseOutputFormat",
        );
        const prettyFormattedText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.prettyFormatted",
        );
        const jsonRawText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.jsonRaw",
        );

        const outputChoice = await inquirer.prompt([
          {
            type: "list",
            name: "output",
            message: chooseOutputFormatText,
            choices: [
              { name: prettyFormattedText, value: "pretty" },
              { name: jsonRawText, value: "json" },
            ],
            default: this.session.options?.output,
          },
        ]);
        this.session.options = {
          ...this.session.options,
          output: outputChoice.output as "json" | "pretty",
        };
        break;
      }

      case "verbose": {
        const { t } = simpleT(this.session.locale || "en-GLOBAL");
        const enableVerboseOutputText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.enableVerboseOutput",
        );

        const verboseChoice = await inquirer.prompt([
          {
            type: "confirm",
            name: "verbose",
            message: enableVerboseOutputText,
            default: this.session.options?.verbose,
          },
        ]);
        this.session.options = {
          ...this.session.options,
          verbose: verboseChoice.verbose as boolean,
        };
        break;
      }

      case "locale": {
        const { t } = simpleT(this.session.locale || "en-GLOBAL");
        const chooseLocaleText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.chooseLocale",
        );
        const englishGlobalText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.englishGlobal",
        );
        const germanText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.german",
        );
        const polishText = t(
          "app.api.v1.core.system.cli.vibe.interactive.navigation.polish",
        );

        const localeChoice = await inquirer.prompt([
          {
            type: "list",
            name: "locale",
            message: chooseLocaleText,
            choices: [
              { name: englishGlobalText, value: "en-GLOBAL" },
              { name: germanText, value: "de-DE" },
              { name: polishText, value: "pl-PL" },
            ] satisfies Array<{ name: string; value: CountryLanguage }>,
            default: this.session.locale,
          },
        ]);
        this.session.locale = localeChoice.locale as CountryLanguage;
        break;
      }
    }

    const { t } = simpleT(this.session.locale || "en-GLOBAL");
    const settingUpdatedText = t(
      "app.api.v1.core.system.cli.vibe.interactive.navigation.settingUpdated",
    );
    this.logger.info(settingUpdatedText);
  }
}

export const interactiveModeHandler = new InteractiveModeHandler();

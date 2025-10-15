/**
 * Unified Help System
 * Generates help content from endpoint definitions for both CLI and programmatic use
 */

import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DiscoveredRoute } from "../../../utils/route-delegation-handler";

// CLI flag constants
const CLI_FLAGS = {
  DATA: "--data",
  USER_TYPE: "--user-type",
  LOCALE: "--locale",
  OUTPUT: "--output",
  VERBOSE: "--verbose",
  DRY_RUN: "--dry-run",
  PREFIX: "--",
  OPTIONS: "[options]",
} as const;

// CLI example commands (technical documentation, not user-facing)
const CLI_EXAMPLES = {
  INTERACTIVE: "vibe                          # Start interactive mode",
  LIST: "vibe list                     # List all available commands",
  DB_PING: "vibe db:ping                  # Execute database ping",
  USER_CREATE: 'vibe user:create --data \'{"email": "test@example.com"}\'',
  HELP_DB: "vibe help db                  # Show help for database commands",
  CHECK: "vibe check src/app/api        # Run vibe check on folder",
} as const;

// CLI flag strings (technical identifiers)
const CLI_FLAG_STRINGS = {
  DATA: "-d, --data <json>",
  USER_TYPE: "-u, --user-type <type>",
  LOCALE: "-l, --locale <locale>",
  OUTPUT: "-o, --output <format>",
  VERBOSE: "-v, --verbose",
  DRY_RUN: "--dry-run",
} as const;

/**
 * Endpoint definition structure (simplified for help generation)
 */
interface EndpointDefinition {
  requestSchema?: z.ZodTypeAny;
  requestUrlParamsSchema?: z.ZodTypeAny;
}

/**
 * Zod type with internal _def property (for schema introspection)
 */
interface ZodWithDef {
  _def?: {
    typeName?: string;
    innerType?: ZodWithDef;
    defaultValue?: () => CountryLanguage;
    values?: string[] | Record<string, string>;
    description?: string;
  };
  shape?: Record<string, ZodWithDef>;
}

/**
 * Help content structure
 */
export interface HelpContent {
  title: string;
  description: string;
  usage: string;
  commands?: CommandHelp[];
  examples?: string[];
  options?: OptionHelp[];
}

/**
 * Command help information
 */
export interface CommandHelp {
  name: string;
  alias?: string;
  description: string;
  usage: string;
  parameters?: ParameterHelp[];
  examples?: string[];
}

/**
 * Parameter help information
 */
export interface ParameterHelp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: CountryLanguage;
  choices?: string[];
}

/**
 * Option help information
 */
export interface OptionHelp {
  flag: string;
  description: string;
  type?: string;
  defaultValue?: CountryLanguage;
}

/**
 * Help generation options
 */
export interface HelpOptions {
  format?: "text" | "json" | "markdown";
  includeExamples?: boolean;
  includeParameters?: boolean;
  category?: string;
  verbose?: boolean;
}

/**
 * Unified help handler class
 */
export class HelpHandler {
  /**
   * Generate comprehensive help content
   */
  async generateHelp(
    routes: DiscoveredRoute[],
    options: HelpOptions = {},
  ): Promise<HelpContent> {
    const { t } = simpleT("en-GLOBAL");

    const filteredRoutes = options.category
      ? routes.filter(
          (route) => this.getRouteCategory(route.path) === options.category,
        )
      : routes;

    const helpContent: HelpContent = {
      title: t("app.api.v1.core.system.cli.vibe.help.title"),
      description: t("app.api.v1.core.system.cli.vibe.help.description"),
      usage: t("app.api.v1.core.system.cli.vibe.help.usage"),
      commands: await this.generateCommandHelp(filteredRoutes, options),
      examples: this.generateExamples(),
      options: this.generateGlobalOptions(),
    };

    return helpContent;
  }

  /**
   * Generate help for specific command
   */
  async generateCommandHelp(
    routes: DiscoveredRoute[],
    options: HelpOptions = {},
  ): Promise<CommandHelp[]> {
    const commands: CommandHelp[] = [];

    for (const route of routes) {
      try {
        const commandHelp = await this.generateSingleCommandHelp(
          route,
          options,
        );
        commands.push(commandHelp);
      } catch {
        // Silently skip routes that fail to generate help
      }
    }

    return commands.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Generate help for a single command
   */
  private async generateSingleCommandHelp(
    route: DiscoveredRoute,
    options: HelpOptions,
  ): Promise<CommandHelp> {
    const { t } = simpleT("en-GLOBAL");
    const endpoint = await this.getEndpointDefinition(route);

    const commandHelp: CommandHelp = {
      name: route.alias,
      description:
        route.description ||
        t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.noDescription",
        ),
      usage: this.generateUsageString(route, endpoint),
    };

    if (options.includeParameters && endpoint) {
      commandHelp.parameters = this.generateParameterHelp(endpoint);
    }

    if (options.includeExamples) {
      commandHelp.examples = this.generateCommandExamples(route, endpoint);
    }

    return commandHelp;
  }

  /**
   * Generate parameter help from endpoint schema
   */
  private generateParameterHelp(endpoint: EndpointDefinition): ParameterHelp[] {
    const parameters: ParameterHelp[] = [];

    // Generate help for request data parameters
    if (endpoint.requestSchema) {
      const requestParams = this.extractParametersFromSchema(
        endpoint.requestSchema,
        "data",
      );
      parameters.push(...requestParams);
    }

    // Generate help for URL parameters
    if (endpoint.requestUrlParamsSchema) {
      const urlParams = this.extractParametersFromSchema(
        endpoint.requestUrlParamsSchema,
        "url",
      );
      parameters.push(...urlParams);
    }

    return parameters;
  }

  /**
   * Extract parameters from Zod schema
   */
  private extractParametersFromSchema(
    schema: z.ZodTypeAny,
    prefix: string,
  ): ParameterHelp[] {
    const parameters: ParameterHelp[] = [];

    try {
      const zodWithDef = schema as ZodWithDef;
      if (zodWithDef.shape) {
        for (const [key, fieldSchema] of Object.entries(zodWithDef.shape)) {
          const param = this.extractParameterFromField(
            key,
            fieldSchema,
            prefix,
          );
          parameters.push(param);
        }
      }
    } catch {
      // Silently skip schema parameter extraction errors
    }

    return parameters;
  }

  /**
   * Extract parameter information from schema field
   */
  private extractParameterFromField(
    name: string,
    schema: ZodWithDef,
    prefix: string,
  ): ParameterHelp {
    let required = true;
    let defaultValue: CountryLanguage | undefined = undefined;
    let baseSchema = schema;

    // Unwrap optional and default schemas
    if (schema._def && schema._def.typeName === "ZodOptional") {
      required = false;
      baseSchema = schema._def.innerType || schema;
    }

    if (schema._def && schema._def.typeName === "ZodDefault") {
      if (schema._def.defaultValue) {
        defaultValue = schema._def.defaultValue();
      }
      baseSchema = schema._def.innerType || schema;
      required = false;
    }

    const type = this.getSchemaType(baseSchema);
    const choices = this.getSchemaChoices(baseSchema);
    const description = this.getSchemaDescription(baseSchema);

    return {
      name: prefix === "url" ? `${CLI_FLAGS.PREFIX}${name}` : name,
      type,
      required,
      description,
      defaultValue,
      choices,
    };
  }

  /**
   * Get schema type string
   */
  private getSchemaType(schema: ZodWithDef): string {
    if (!schema._def?.typeName) {
      return "unknown";
    }

    const typeName = schema._def.typeName;
    switch (typeName) {
      case "ZodString":
        return "string";
      case "ZodNumber":
        return "number";
      case "ZodBoolean":
        return "boolean";
      case "ZodArray":
        return "array";
      case "ZodObject":
        return "object";
      case "ZodEnum":
        return "enum";
      case "ZodNativeEnum":
        return "enum";
      case "ZodDate":
        return "date";
      default:
        return "unknown";
    }
  }

  /**
   * Get schema choices for enums
   */
  private getSchemaChoices(schema: ZodWithDef): string[] | undefined {
    if (!schema._def?.typeName) {
      return undefined;
    }

    const typeName = schema._def.typeName;
    if (typeName === "ZodEnum" && Array.isArray(schema._def.values)) {
      return schema._def.values;
    }

    if (typeName === "ZodNativeEnum" && schema._def.values) {
      const values = schema._def.values;
      if (typeof values === "object" && values !== null) {
        return Object.values(values).filter(
          (v): v is string => typeof v === "string",
        );
      }
    }

    return undefined;
  }

  /**
   * Get schema description
   */
  private getSchemaDescription(schema: ZodWithDef): string | undefined {
    return schema._def?.description;
  }

  /**
   * Generate usage string for command
   */
  private generateUsageString(
    route: DiscoveredRoute,
    endpoint: EndpointDefinition | null,
  ): string {
    let usage = `vibe ${route.alias}`;

    if (endpoint) {
      // Add data flag if request schema exists
      if (endpoint.requestSchema) {
        // eslint-disable-next-line i18next/no-literal-string
        usage += ` [${CLI_FLAGS.DATA} <json>]`;
      }

      // Add URL parameter flags
      const zodWithDef = endpoint.requestUrlParamsSchema as
        | ZodWithDef
        | undefined;
      if (zodWithDef?.shape) {
        const urlParams = Object.keys(zodWithDef.shape);
        for (const param of urlParams) {
          // eslint-disable-next-line i18next/no-literal-string
          usage += ` [${CLI_FLAGS.PREFIX}${param} <value>]`;
        }
      }
    }

    usage += ` ${CLI_FLAGS.OPTIONS}`;
    return usage;
  }

  /**
   * Generate command examples
   */
  private generateCommandExamples(
    route: DiscoveredRoute,
    endpoint: EndpointDefinition | null,
  ): string[] {
    const examples: string[] = [];

    // Basic example
    examples.push(`vibe ${route.alias}`);

    // Example with data if applicable
    if (endpoint?.requestSchema) {
      // eslint-disable-next-line i18next/no-literal-string
      examples.push(`vibe ${route.alias} ${CLI_FLAGS.DATA} '{"key": "value"}'`);
    }

    // Example with verbose output
    examples.push(
      `vibe ${route.alias} ${CLI_FLAGS.VERBOSE} ${CLI_FLAGS.OUTPUT} json`,
    );

    return examples;
  }

  /**
   * Generate global CLI options
   */
  private generateGlobalOptions(): OptionHelp[] {
    const { t } = simpleT("en-GLOBAL");

    return [
      {
        flag: CLI_FLAG_STRINGS.DATA,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagDataDesc",
        ),
        type: "string",
      },
      {
        flag: CLI_FLAG_STRINGS.USER_TYPE,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagUserTypeDesc",
        ),
        type: "string",
        defaultValue: undefined,
      },
      {
        flag: CLI_FLAG_STRINGS.LOCALE,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagLocaleDesc",
        ),
        type: "string",
        defaultValue: "en-GLOBAL" as CountryLanguage,
      },
      {
        flag: CLI_FLAG_STRINGS.OUTPUT,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagOutputDesc",
        ),
        type: "string",
        defaultValue: undefined,
      },
      {
        flag: CLI_FLAG_STRINGS.VERBOSE,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagVerboseDesc",
        ),
        type: "boolean",
        defaultValue: undefined,
      },
      {
        flag: CLI_FLAG_STRINGS.DRY_RUN,
        description: t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.flagDryRunDesc",
        ),
        type: "boolean",
        defaultValue: undefined,
      },
    ];
  }

  /**
   * Generate general examples
   */
  private generateExamples(): string[] {
    return [
      CLI_EXAMPLES.INTERACTIVE,
      CLI_EXAMPLES.LIST,
      CLI_EXAMPLES.DB_PING,
      CLI_EXAMPLES.USER_CREATE,
      CLI_EXAMPLES.HELP_DB,
      CLI_EXAMPLES.CHECK,
    ];
  }

  /**
   * Format help content as text
   */
  formatAsText(help: HelpContent): string {
    const { t } = simpleT("en-GLOBAL");
    let output = "";

    // eslint-disable-next-line i18next/no-literal-string
    output += `${help.title}\n`;
    // eslint-disable-next-line i18next/no-literal-string
    output += `${help.description}\n\n`;

    // eslint-disable-next-line i18next/no-literal-string
    output += `${t("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.usageLabel")}: ${help.usage}\n\n`;

    // Commands
    if (help.commands && help.commands.length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `${t("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.availableCommandsLabel")}:\n`;
      for (const command of help.commands) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `  ${command.name.padEnd(20)} ${command.description}\n`;
      }
      output += "\n";
    }

    // Options
    if (help.options && help.options.length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `${t("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.globalOptionsLabel")}:\n`;
      for (const option of help.options) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `  ${option.flag.padEnd(25)} ${option.description}\n`;
      }
      output += "\n";
    }

    // Examples
    if (help.examples && help.examples.length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `${t("app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.helpHandler.examplesLabel")}:\n`;
      for (const example of help.examples) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `  ${example}\n`;
      }
      output += "\n";
    }

    return output;
  }

  /**
   * Format help content as JSON
   */
  formatAsJson(help: HelpContent): string {
    return JSON.stringify(help, null, 2);
  }

  /**
   * Get endpoint definition from route
   */
  private async getEndpointDefinition(
    route: DiscoveredRoute,
  ): Promise<EndpointDefinition | null> {
    interface RouteModule {
      tools?: {
        definitions?: Record<string, EndpointDefinition>;
      };
    }

    try {
      const moduleImport = (await import(route.routePath)) as RouteModule;
      const routeModule = moduleImport;

      if (routeModule.tools?.definitions) {
        const definitions = routeModule.tools.definitions;
        const definition =
          definitions[route.method] ||
          definitions.POST ||
          definitions.GET ||
          null;
        if (definition) {
          return definition;
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get route category
   */
  private getRouteCategory(path: string): string {
    // Safety check for path parameter
    if (!path || typeof path !== "string") {
      return "other";
    }

    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3) {
      return parts.slice(1, 3).join(".");
    }
    return "other";
  }
}

export const helpHandler = new HelpHandler();

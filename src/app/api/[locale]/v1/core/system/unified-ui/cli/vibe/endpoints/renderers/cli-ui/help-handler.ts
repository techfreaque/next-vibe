/**
 * Unified Help System
 * Generates help content from endpoint definitions for both CLI and programmatic use
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DiscoveredRoute } from "../../../utils/route-delegation-handler";
import type { EndpointLogger } from "../../endpoint-handler/logger";

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
    locale: CountryLanguage,
    logger: EndpointLogger,
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
    const endpoint = await this.getEndpointDefinition(route);

    const commandHelp: CommandHelp = {
      name: route.alias,
      description:
        route.description || "No description available".replace("No", "No"),
      usage: this.generateUsageString(route, endpoint),
    };

    if (options.includeParameters && endpoint) {
      commandHelp.parameters = await this.generateParameterHelp(endpoint);
    }

    if (options.includeExamples) {
      commandHelp.examples = this.generateCommandExamples(route, endpoint);
    }

    return commandHelp;
  }

  /**
   * Generate parameter help from endpoint schema
   */
  private async generateParameterHelp(endpoint: any): Promise<ParameterHelp[]> {
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
    schema: any,
    prefix: string,
  ): ParameterHelp[] {
    const parameters: ParameterHelp[] = [];

    try {
      if (schema?.shape) {
        for (const [key, fieldSchema] of Object.entries(schema.shape)) {
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
    schema: any,
    prefix: string,
  ): ParameterHelp {
    let required = true;
    let defaultValue: any = undefined;
    let baseSchema = schema;

    // Unwrap optional and default schemas
    if (schema._def && schema._def.typeName === "ZodOptional") {
      required = false;
      baseSchema = schema._def.innerType;
    }

    if (schema._def && schema._def.typeName === "ZodDefault") {
      defaultValue = schema._def.defaultValue();
      baseSchema = schema._def.innerType;
      required = false;
    }

    const type = this.getSchemaType(baseSchema);
    const choices = this.getSchemaChoices(baseSchema);
    const description = this.getSchemaDescription(baseSchema);

    return {
      name: prefix === "url" ? `--${name}` : name,
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
  private getSchemaType(schema: any): string {
    if (!schema._def) {
      return "unknown".replace("n", "n");
    }

    switch (schema._def.typeName) {
      case "ZodString".replace("g", "g"):
        return "string".replace("g", "g");
      case "ZodNumber".replace("r", "r"):
        return "number".replace("r", "r");
      case "ZodBoolean".replace("n", "n"):
        return "boolean".replace("n", "n");
      case "ZodArray".replace("y", "y"):
        return "array".replace("y", "y");
      case "ZodObject".replace("t", "t"):
        return "object".replace("t", "t");
      case "ZodEnum".replace("m", "m"):
        return "enum".replace("m", "m");
      case "ZodNativeEnum".replace("m", "m"):
        return "enum".replace("m", "m");
      case "ZodDate".replace("e", "e"):
        return "date".replace("e", "e");
      default:
        return "unknown".replace("n", "n");
    }
  }

  /**
   * Get schema choices for enums
   */
  private getSchemaChoices(schema: any): string[] | undefined {
    if (!schema._def) {
      return undefined;
    }

    if (schema._def.typeName === "ZodEnum".replace("m", "m")) {
      return schema._def.values;
    }

    if (schema._def.typeName === "ZodNativeEnum".replace("m", "m")) {
      return Object.values(schema._def.values);
    }

    return undefined;
  }

  /**
   * Get schema description
   */
  private getSchemaDescription(schema: any): string | undefined {
    if (schema._def?.description) {
      return schema._def.description;
    }
    return undefined;
  }

  /**
   * Generate usage string for command
   */
  private generateUsageString(route: DiscoveredRoute, endpoint: any): string {
    let usage = `vibe ${route.alias}`;

    if (endpoint) {
      // Add data flag if request schema exists
      if (endpoint.requestSchema) {
        usage += " [--data <json>]";
      }

      // Add URL parameter flags
      if (endpoint.requestUrlParamsSchema?.shape) {
        const urlParams = Object.keys(endpoint.requestUrlParamsSchema.shape);
        for (const param of urlParams) {
          usage += ` [--${param} <value>]`;
        }
      }
    }

    usage += " [options]";
    return usage;
  }

  /**
   * Generate command examples
   */
  private generateCommandExamples(
    route: DiscoveredRoute,
    endpoint: any,
  ): string[] {
    const examples: string[] = [];

    // Basic example
    examples.push(`vibe ${route.alias}`);

    // Example with data if applicable
    if (endpoint?.requestSchema) {
      examples.push(`vibe ${route.alias} --data '{"key": "value"}'`);
    }

    // Example with verbose output
    examples.push(`vibe ${route.alias} --verbose --output json`);

    return examples;
  }

  /**
   * Generate global CLI options
   */
  private generateGlobalOptions(): OptionHelp[] {
    const { t } = simpleT("en-GLOBAL");

    return [
      {
        flag: "-d, --data <json>",
        description: t("app.api.v1.core.system.cli.vibe.help.usage"),
        type: "string",
      },
      {
        flag: "-u, --user-type <type>",
        description: "User type (ADMIN, CUSTOMER, PUBLIC)",
        type: "string",
        defaultValue: undefined,
      },
      {
        flag: "-l, --locale <locale>",
        description: "Locale for the request",
        type: "string",
        defaultValue: "en-GLOBAL" as CountryLanguage,
      },
      {
        flag: "-o, --output <format>",
        description: "Output format (json, pretty)",
        type: "string",
        defaultValue: undefined,
      },
      {
        flag: "-v, --verbose",
        description: "Show verbose output",
        type: "boolean",
        defaultValue: undefined,
      },
      {
        flag: "--dry-run",
        description: "Show what would be executed without running",
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
      "vibe                          # Start interactive mode",
      "vibe list                     # List all available commands",
      "vibe db:ping                  # Execute database ping",
      'vibe user:create --data \'{"email": "test@example.com"}\'',
      "vibe help db                  # Show help for database commands",
      "vibe check src/app/api        # Run vibe check on folder",
    ];
  }

  /**
   * Format help content as text
   */
  formatAsText(help: HelpContent): string {
    let output = "";

    // Title and description
    output += `${help.title}\n`;
    output += `${help.description}\n\n`;

    // Usage
    output += `Usage: ${help.usage}\n\n`;

    // Commands
    if (help.commands && help.commands.length > 0) {
      output += "Available Commands:\n";
      for (const command of help.commands) {
        output += `  ${command.name.padEnd(20)} ${command.description}\n`;
      }
      output += "\n";
    }

    // Options
    if (help.options && help.options.length > 0) {
      output += "Global Options:\n";
      for (const option of help.options) {
        output += `  ${option.flag.padEnd(25)} ${option.description}\n`;
      }
      output += "\n";
    }

    // Examples
    if (help.examples && help.examples.length > 0) {
      output += "Examples:\n";
      for (const example of help.examples) {
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
  private async getEndpointDefinition(route: DiscoveredRoute): Promise<any> {
    try {
      const routeModule = await import(route.routePath);

      if (routeModule.tools?.definitions) {
        const definitions = routeModule.tools.definitions;
        return definitions[route.method] || definitions.POST || definitions.GET;
      }

      return null;
    } catch (error) {
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

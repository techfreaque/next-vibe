/**
 * CLI Options Repository
 * Consolidated CLI option management functionality
 * Migrated from cli/utils/options.ts
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  CliOptionsRequestOutput,
  CliOptionsResponseOutput,
} from "../../unified-ui/cli/options/definition";

// ===== OPTION TYPES =====

/**
 * Represents a CLI option with its metadata
 */
export interface OptionDefinition {
  /** The name of the option (e.g., 'debug') */
  name: string;
  /** Short alias for the option (e.g., 'd' for --debug) */
  alias?: string;
  /** Default value for the option */
  default?: boolean | string | number | string[];
  /** Description of what the option does */
  description: string;
  /** Type of the option value */
  type: "boolean" | "string" | "number" | "array";
  /** Whether the option is required */
  required?: boolean;
  /** Category for organizing options in help display */
  category?: string;
  /** Examples of how to use the option */
  examples?: string[];
}

/**
 * Option definitions mapping for a specific type
 */
type OptionDefinitionsMap<T> = {
  [K in keyof T]: OptionDefinition;
};

// ===== REPOSITORY INTERFACE =====

/**
 * CLI Options Repository Interface
 */
export interface CliOptionsRepository {
  processOptions(
    data: CliOptionsRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<CliOptionsResponseOutput>>;

  validateOption(name: string, value: unknown): Promise<ResponseType<boolean>>;
  generateHelp(category?: string): Promise<ResponseType<string>>;
}

/**
 * CLI Options Repository Implementation
 */
export class CliOptionsRepositoryImpl implements CliOptionsRepository {
  private optionDefinitions: Map<string, OptionDefinition> = new Map();

  constructor() {
    this.loadDefaultOptions();
  }

  /**
   * Process CLI options based on operation
   */
  async processOptions(
    data: CliOptionsRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<CliOptionsResponseOutput>> {
    const { t } = simpleT(locale);

    // Validate user permissions
    if (!user?.id) {
      return createErrorResponse(
        "app.api.v1.core.system.unifiedUi.cli.setup.install.post.errors.unauthorized.title",
        ErrorResponseTypes.UNAUTHORIZED,
        {
          error: t(
            "app.api.v1.core.system.unifiedUi.cli.setup.install.post.errors.unauthorized.description",
          ),
        },
      );
    }

    try {
      const response = {
        success: true,
        options: [] as string[],
        validation: { isValid: true, errors: [] as string[] },
      };

      switch (data.operation) {
        case "list":
          response.options = Object.keys(this.listOptions(data.category));
          break;
        case "validate":
          if (data.optionName && data.optionValue !== undefined) {
            const validation = this.validateOptionValue(
              data.optionName,
              data.optionValue,
            );
            response.validation = {
              isValid: validation.valid,
              errors: validation.errors,
            };
          } else {
            response.validation = {
              isValid: false,
              errors: [
                t(
                  "app.api.v1.core.system.unifiedUi.cli.setup.install.post.errors.validation.title",
                ),
              ],
            };
          }
          break;
        case "define":
          // Define new option (implementation would go here)
          response.options = [
            t(
              "app.api.v1.core.system.unifiedUi.cli.setup.install.post.success.title",
            ),
          ];
          break;
        case "parse":
          // Parse option values (implementation would go here)
          response.options = [
            t(
              "app.api.v1.core.system.unifiedUi.cli.setup.install.post.success.title",
            ),
          ];
          break;
        default:
          return createErrorResponse(
            "app.api.v1.core.system.generators.endpoints.post.errors.server.title",
            ErrorResponseTypes.INTERNAL_ERROR,
            {
              error: t(
                "app.api.v1.core.system.generators.endpoints.post.errors.server.description",
              ),
            },
          );
      }

      return createSuccessResponse(response);
    } catch (error) {
      return createErrorResponse(
        "app.error.errorTypes.internal_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Validate a single option
   */
  async validateOption(
    name: string,
    value: unknown,
  ): Promise<ResponseType<boolean>> {
    try {
      const validation = this.validateOptionValue(name, value);
      return createSuccessResponse(validation.valid);
    } catch (error) {
      return createErrorResponse(
        "app.error.errorTypes.validation_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Generate help text
   */
  async generateHelp(category?: string): Promise<ResponseType<string>> {
    try {
      const help = this.generateOptionsHelp(category);
      return createSuccessResponse(help);
    } catch (error) {
      return createErrorResponse(
        "app.error.errorTypes.internal_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  // ===== PRIVATE METHODS =====

  /**
   * Load default CLI options
   */
  private loadDefaultOptions(): void {
    const defaultOptions: OptionDefinition[] = [
      {
        name: "verbose",
        alias: "v",
        type: "boolean",
        default: false,
        description: "Enable verbose output",
        category: "General",
        examples: ["--verbose", "-v"],
      },
      {
        name: "dry-run",
        alias: "n",
        type: "boolean",
        default: false,
        description: "Show what would be done without executing",
        category: "General",
        examples: ["--dry-run", "-n"],
      },
      {
        name: "output",
        alias: "o",
        type: "string",
        default: "json",
        description: "Output format (json, table, pretty)",
        category: "Output",
        examples: ["--output=json", "-o table"],
      },
      {
        name: "interactive",
        alias: "i",
        type: "boolean",
        default: false,
        description: "Enable interactive mode",
        category: "General",
        examples: ["--interactive", "-i"],
      },
    ];

    for (const option of defaultOptions) {
      this.optionDefinitions.set(option.name, option);
    }
  }

  /**
   * List options by category
   */
  private listOptions(category?: string): Record<string, unknown> {
    const options: Record<string, unknown> = {};

    for (const [name, definition] of this.optionDefinitions) {
      if (!category || definition.category === category) {
        options[name] = {
          name: definition.name,
          alias: definition.alias,
          type: definition.type,
          default: definition.default,
          description: definition.description,
          category: definition.category,
          required: definition.required,
          examples: definition.examples,
        };
      }
    }

    return options;
  }

  /**
   * Validate option value
   */
  private validateOptionValue(
    name: string,
    value: unknown,
  ): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const definition = this.optionDefinitions.get(name);

    if (!definition) {
      errors.push(`Unknown option: ${name}`);
      return { valid: false, errors };
    }

    // Type validation
    switch (definition.type) {
      case "boolean":
        if (
          typeof value !== "boolean" &&
          value !== "true" &&
          value !== "false"
        ) {
          errors.push(`Option ${name} must be a boolean value`);
        }
        break;
      case "string":
        if (typeof value !== "string") {
          errors.push(`Option ${name} must be a string value`);
        }
        break;
      case "number":
        if (typeof value !== "number" && isNaN(Number(value))) {
          errors.push(`Option ${name} must be a number value`);
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          errors.push(`Option ${name} must be an array value`);
        }
        break;
    }

    // Required validation
    if (definition.required && (value === undefined || value === null)) {
      errors.push(`Option ${name} is required`);
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate help text for options
   */
  private generateOptionsHelp(categoryFilter?: string): string {
    let helpText = "";

    // Group options by category
    const categories: { [categoryName: string]: OptionDefinition[] } = {};

    for (const [, option] of this.optionDefinitions) {
      const category = option.category || "General";

      if (categoryFilter && category !== categoryFilter) {
        continue;
      }

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push(option);
    }

    // Generate help text for each category
    for (const category in categories) {
      helpText += `\n${category} Options:\n`;

      for (const option of categories[category]) {
        const aliasText = option.alias ? `, -${option.alias}` : "";
        const defaultText =
          option.default !== undefined
            ? ` [default: ${String(option.default)}]`
            : "";
        const requiredText = option.required ? " [required]" : "";

        helpText += `  --${option.name}${aliasText}\t${option.description}${defaultText}${requiredText}\n`;
      }
    }

    return helpText;
  }

  /**
   * Utility function to create standardized option definitions
   */
  defineOptions<T>(options: OptionDefinitionsMap<T>): OptionDefinitionsMap<T> {
    return options;
  }

  /**
   * Apply default values to options object and map CLI option names to property names
   */
  applyOptionDefaults<T>(
    options: Partial<T>,
    definitions: OptionDefinitionsMap<T>,
  ): T {
    const result = { ...options } as T;

    for (const key in definitions) {
      const definition = definitions[key];
      const cliOptionName = definition.name;

      // Check if the CLI option name exists in the options (kebab-case)
      if (
        cliOptionName in options &&
        options[cliOptionName as keyof T] !== undefined
      ) {
        // Map the CLI option name to the property name (camelCase) with type conversion
        const value = options[cliOptionName as keyof T];

        // Convert string values to proper types for boolean options
        if (definition.type === "boolean" && typeof value === "string") {
          result[key] = (value.toLowerCase() === "true") as T[Extract<
            keyof T,
            string
          >];
        } else {
          result[key] = value as T[Extract<keyof T, string>];
        }
      } else if (
        definitions[key].default !== undefined &&
        options[key] === undefined
      ) {
        // Apply default value if the option is not set
        result[key] = definitions[key].default as T[Extract<keyof T, string>];
      }
    }

    return result;
  }
}

export const cliOptionsRepository = new CliOptionsRepositoryImpl();

// Export utility functions for backward compatibility
export const defineOptions =
  cliOptionsRepository.defineOptions.bind(cliOptionsRepository);
export const applyOptionDefaults =
  cliOptionsRepository.applyOptionDefaults.bind(cliOptionsRepository);

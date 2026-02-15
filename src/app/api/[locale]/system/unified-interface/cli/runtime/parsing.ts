/**
 * CLI Input Parsing & Handling
 * Static class for parsing CLI arguments and handling input data processing
 */

import { parseError } from "next-vibe/shared/utils";
import type { z } from "zod";

import { isEmptySchema } from "../../../../shared/utils/validation";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { SchemaUIHandler } from "../../unified-ui/renderers/cli/response/schema-handler";
import { hasChildren } from "../../unified-ui/widgets/_shared/type-guards";

/**
 * CLI Input Parser - Static class for all input parsing and handling
 */
export class CliInputParser {
  /**
   * Convert kebab-case to camelCase
   * Example: "force-update" -> "forceUpdate"
   */
  private static kebabToCamelCase(str: string): string {
    return str.replaceAll(/-([a-z])/g, (match) => match[1].toUpperCase());
  }

  /**
   * Set a nested value in an object using dot notation
   * Converts kebab-case keys to camelCase for API compatibility
   * Example: setNestedValue(obj, "user.name", "John") -> { user: { name: "John" } }
   */
  private static setNestedValue(
    obj: CliObject,
    path: string,
    value: string | number | boolean,
  ): void {
    // Convert kebab-case path segments to camelCase for API compatibility
    const keys = path.split(".").map((s) => this.kebabToCamelCase(s));

    if (keys.length === 1) {
      // Simple key, no nesting
      obj[keys[0]] = value;
      return;
    }

    // Navigate to the nested object, creating objects as needed
    let current: CliObject = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const existing = current[key];

      if (
        !existing ||
        typeof existing !== "object" ||
        Array.isArray(existing)
      ) {
        // Create a new object if it doesn't exist or is not an object
        const newObj: CliObject = {};
        current[key] = newObj;
        current = newObj;
      } else {
        // Navigate into existing object
        current = existing as CliObject;
      }
    }

    // Set the final value
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;
  }

  /**
   * Try to parse a string as a number if it looks like one
   */
  private static tryParseNumber(value: string): string | number {
    // Don't try to parse empty strings or strings with only whitespace
    if (!value?.trim()) {
      return value;
    }

    // Don't try to parse if it contains non-numeric characters (except for decimal point and minus sign)
    if (!/^-?\d*\.?\d*$/.test(value)) {
      return value;
    }

    // Try to parse as integer first
    if (/^-?\d+$/.test(value)) {
      const intValue = parseInt(value, 10);
      // Make sure the parsed value equals the original string to avoid precision issues
      if (String(intValue) === value) {
        return intValue;
      }
    }

    // Try to parse as float
    if (/^-?\d*\.\d+$/.test(value)) {
      const floatValue = parseFloat(value);
      // Make sure the parsed value equals the original string to avoid precision issues
      if (String(floatValue) === value) {
        return floatValue;
      }
    }

    return value;
  }

  /**
   * Convert CLI argument value to appropriate type
   */
  private static convertCliValue(value: string): string | number | boolean {
    // Handle boolean values first
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }

    // Try to parse as number
    const numberValue = this.tryParseNumber(value);
    if (typeof numberValue === "number") {
      return numberValue;
    }

    // Return as string if not a number
    return value;
  }

  /**
   * Simple CLI argument parser for when rawArgs is not available
   * Supports nested object notation: --group.name=value
   */
  static parseCliArgumentsSimple(args: string[]): {
    positionalArgs: string[];
    namedArgs: CliObject;
  } {
    const positionalArgs: string[] = [];
    const namedArgs: CliObject = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      // Skip undefined, null, or empty arguments
      if (!arg || typeof arg !== "string") {
        continue;
      }

      if (arg.startsWith("--")) {
        // Handle --key=value or --key (boolean flag)
        const sliced = arg.slice(2);
        const [key, ...valueParts] = sliced.split("=");
        let value: string | number | boolean;

        if (valueParts.length > 0) {
          // --key=value format - use the explicit value
          value = this.convertCliValue(valueParts.join("="));
        } else {
          // --key format without value - always boolean, never consume next argument
          value = true;
        }

        // Support nested object notation (e.g., --group.name=value)
        this.setNestedValue(namedArgs, key, value);
      } else if (arg.startsWith("-")) {
        // Handle -k (single dash) - always boolean, never consume next argument
        const key = arg.slice(1);
        this.setNestedValue(namedArgs, key, true);
      } else {
        // Positional argument
        positionalArgs.push(arg);
      }
    }

    return { positionalArgs, namedArgs };
  }

  /**
   * Parse CLI arguments into structured data
   * Supports nested object notation: --group.name=value
   */
  static parseCliArguments(
    args: string[],
    rawArgs: string[],
    logger: EndpointLogger,
  ): {
    positionalArgs: string[];
    namedArgs: CliObject;
  } {
    const positionalArgs: string[] = [];
    const namedArgs: CliObject = {};

    // Safety checks for input parameters
    if (!Array.isArray(args)) {
      logger.error("parseCliArguments: args is not an array", undefined, {
        argsType: typeof args,
      });
      return { positionalArgs, namedArgs };
    }
    if (!Array.isArray(rawArgs)) {
      logger.error("parseCliArguments: rawArgs is not an array", undefined, {
        rawArgsType: typeof rawArgs,
      });
      return { positionalArgs, namedArgs };
    }

    // Find the command position in rawArgs to extract everything after it
    const commandIndex = rawArgs.findIndex((arg) => arg && args.includes(arg));
    const relevantArgs =
      commandIndex >= 0 ? rawArgs.slice(commandIndex + 1) : [];

    for (let i = 0; i < relevantArgs.length; i++) {
      const arg = relevantArgs[i];

      // Skip undefined, null, or empty arguments
      if (!arg || typeof arg !== "string") {
        continue;
      }

      if (arg.startsWith("--")) {
        // Handle --key=value or --key (boolean flag)
        try {
          const sliced = arg.slice(2);
          if (typeof sliced !== "string") {
            logger.error("parseCliArguments: sliced is not a string");
            continue;
          }
          const [key, ...valueParts] = sliced.split("=");
          let value: string | number | boolean;

          if (valueParts.length > 0) {
            // --key=value format - use the explicit value
            value = this.convertCliValue(valueParts.join("="));
          } else {
            // --key format without value - always boolean, never consume next argument
            value = true;
          }

          // Support nested object notation (e.g., --group.name=value)
          this.setNestedValue(namedArgs, key, value);
        } catch (parseError) {
          logger.error(
            "parseCliArguments: Error parsing double hyphen arg",
            parseError as Error,
          );
          continue;
        }
      } else if (arg.startsWith("-")) {
        // Handle -k (single dash) - always boolean, never consume next argument
        const key = arg.slice(1);
        this.setNestedValue(namedArgs, key, true);
      } else {
        // Positional argument
        positionalArgs.push(arg);
      }
    }

    return { positionalArgs, namedArgs };
  }

  /**
   * Merge data objects, with later sources taking precedence
   */
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  private static mergeData<TData extends Record<string, unknown>>(
    ...sources: Array<TData | null | undefined>
  ): Partial<TData> {
    return sources.reduce<Partial<TData>>((acc, source) => {
      if (source && typeof source === "object") {
        return { ...acc, ...source };
      }
      return acc;
    }, {});
  }

  /**
   * Build options data object with only explicitly set values
   */
  private static buildOptionsData(
    interactive: boolean,
    dryRun: boolean,
  ): Partial<CliRequestData> {
    const optionsData: Partial<CliRequestData> = {};
    if (interactive) {
      optionsData.interactive = true;
    }
    // Always set dryRun to allow false values to override schema defaults
    optionsData.dryRun = dryRun;
    return optionsData;
  }

  /**
   * Get missing required fields from schema
   */
  private static getMissingRequiredFields<TData>(
    data: TData,
    schema: z.ZodTypeAny | null | undefined,
    logger: EndpointLogger,
  ): string[] {
    if (!schema) {
      return [];
    }

    try {
      const result = schema.safeParse(data);

      if (!result.success) {
        // Extract only "required" errors (invalid_type with received: "undefined")
        return result.error.issues
          .filter(
            (issue) =>
              issue.code === "invalid_type" &&
              "received" in issue &&
              issue.received === "undefined",
          )
          .map((issue) => [...issue.path].join("."));
      }

      return [];
    } catch (error) {
      logger.warn("[CliInputParser] Failed to check required fields", {
        error: parseError(error).message,
      });
      return [];
    }
  }

  /**
   * Build a mapping of single-letter shortcuts to full field names
   */
  private static buildSingleLetterShortcuts(
    endpointDefinition: CreateApiEndpointAny | null,
  ): Map<string, string> {
    const shortcuts = new Map<string, string>();

    if (!endpointDefinition) {
      return shortcuts;
    }

    const fields = endpointDefinition.fields;
    if (!fields || !hasChildren(fields)) {
      return shortcuts;
    }

    const fieldNames = Object.keys(fields.children);

    // Build first-letter to field-names mapping
    const firstLetterMap = new Map<string, string[]>();
    for (const fieldName of fieldNames) {
      const firstLetter = fieldName[0]?.toLowerCase();
      if (firstLetter) {
        const existing = firstLetterMap.get(firstLetter) ?? [];
        existing.push(fieldName);
        firstLetterMap.set(firstLetter, existing);
      }
    }

    // Only add shortcuts for unique first letters
    for (const [letter, names] of firstLetterMap) {
      if (names.length === 1) {
        shortcuts.set(letter, names[0]);
      }
    }

    return shortcuts;
  }

  /**
   * Expand single-letter shortcuts to full field names
   */
  private static expandNamedArgs(
    namedArgs: CliObject,
    shortcuts: Map<string, string>,
  ): CliObject {
    const expanded: CliObject = {};

    for (const [key, value] of Object.entries(namedArgs)) {
      const expandedKey =
        key.length === 1 ? (shortcuts.get(key.toLowerCase()) ?? key) : key;
      expanded[expandedKey] = value;
    }

    return expanded;
  }

  /**
   * Convert CLI string values to appropriate types
   */
  private static normalizeCliValue(
    value:
      | string
      | number
      | boolean
      | null
      | undefined
      | CliRequestData
      | CliRequestData[],
  ):
    | string
    | number
    | boolean
    | null
    | undefined
    | CliRequestData
    | CliRequestData[] {
    if (typeof value !== "string") {
      return value;
    }

    const lower = value.toLowerCase();
    if (lower === "true") {
      return true;
    }
    if (lower === "false") {
      return false;
    }
    return value;
  }

  /**
   * Build data object from CLI arguments
   */
  private static buildDataFromCliArgs(
    endpoint: CreateApiEndpointAny | null,
    positionalArgs: string[],
    namedArgs: CliObject,
  ): CliRequestData | null {
    if (positionalArgs.length === 0 && Object.keys(namedArgs).length === 0) {
      return null;
    }

    const data: CliRequestData = {};

    // Handle firstCliArgKey mapping
    const firstCliArgKey = endpoint?.cli?.firstCliArgKey;

    if (firstCliArgKey && positionalArgs.length > 0) {
      data[firstCliArgKey] =
        positionalArgs.length === 1 ? positionalArgs[0] : positionalArgs;
    }

    // Build single-letter shortcuts for this endpoint
    const shortcuts = this.buildSingleLetterShortcuts(endpoint);

    // Expand single-letter keys and process named arguments
    const expandedNamedArgs = this.expandNamedArgs(namedArgs, shortcuts);

    // Skip these CLI-level options (already in context.options)
    const CLI_LEVEL_OPTIONS = new Set([
      "interactive",
      "dryRun",
      "dry-run",
      "verbose",
      "debug",
      "output",
      "locale",
      "userType",
      "user-type",
    ]);

    for (const [key, value] of Object.entries(expandedNamedArgs)) {
      if (CLI_LEVEL_OPTIONS.has(key)) {
        continue;
      }

      // Convert kebab-case to camelCase
      // eslint-disable-next-line no-unused-vars
      const camelCaseKey = key.replaceAll(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
      );

      // Convert string boolean values to actual booleans
      data[camelCaseKey] = this.normalizeCliValue(value);
    }

    return Object.keys(data).length > 0 ? data : null;
  }

  /**
   * Collect input data using schema-driven UI
   */
  static async collectCliRequestData(
    endpoint: CreateApiEndpointAny | null,
    params: {
      data?: CliRequestData;
      urlPathParams?: CliUrlParams;
      positionalArgs: string[];
      namedArgs: CliObject;
      interactive: boolean;
      dryRun: boolean;
    },
    logger: EndpointLogger,
  ): Promise<CollectedCliRequestData> {
    const inputData: CollectedCliRequestData = {};
    const contextData = params.data;
    const urlPathParams = params.urlPathParams;
    const interactive = params.interactive;
    const dryRun = params.dryRun;

    // Always try to build data from CLI arguments first
    const cliData = CliInputParser.buildDataFromCliArgs(
      endpoint,
      params.positionalArgs,
      params.namedArgs,
    );

    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(
      `[CLI INPUT PARSER] Data collection (hasContextData: ${!!contextData}, hasCliData: ${cliData ? Object.keys(cliData).length > 0 : false}, interactive: ${interactive})`,
    );

    if (contextData || (cliData && Object.keys(cliData).length > 0)) {
      // Merge context options (interactive, dryRun) into data only if explicitly set
      // Don't merge if they're CLI defaults to allow schema defaults to apply
      const optionsData = CliInputParser.buildOptionsData(interactive, dryRun);

      // eslint-disable-next-line i18next/no-literal-string
      logger.debug(
        `[CLI INPUT PARSER] Building options data (interactive: ${optionsData.interactive}, dryRun: ${optionsData.dryRun})`,
      );

      const mergedData = CliInputParser.mergeData(
        optionsData,
        contextData || {},
        cliData || {},
      );

      // eslint-disable-next-line i18next/no-literal-string
      logger.debug(
        `[CLI INPUT PARSER] Final merged data (keys: ${Object.keys(mergedData).join(", ")})`,
      );

      inputData.data = mergedData;

      // Check if all required fields are satisfied using registry
      const missingRequired = CliInputParser.getMissingRequiredFields(
        inputData.data,
        endpoint?.requestSchema,
        logger,
      );

      if (
        missingRequired.length > 0 &&
        interactive &&
        !contextData &&
        endpoint
      ) {
        // Some required fields missing AND no data was provided, use interactive mode
        logger.info("📝 Request Data:");
        logger.warn(
          `⚠️  Missing required fields: ${missingRequired.join(", ")}`,
        );
        const formData = await CliInputParser.generateFormFromEndpoint(
          endpoint,
          "request",
        );

        // Merge with existing data and options
        inputData.data = CliInputParser.mergeData(
          optionsData,
          inputData.data || {},
          formData,
        );
      }
    } else if (endpoint?.requestSchema && interactive !== false) {
      // No data provided and interactive mode allowed
      logger.info("📝 Request Data:");
      const formData = await CliInputParser.generateFormFromEndpoint(
        endpoint,
        "request",
      );

      inputData.data = CliInputParser.mergeData(
        CliInputParser.buildOptionsData(interactive, dryRun),
        formData,
      );
    } else {
      // No CLI data - let schema defaults apply (don't force CLI defaults)
      inputData.data = {};
    }

    // Collect URL parameters if needed
    if (endpoint?.requestUrlPathParamsSchema && !urlPathParams) {
      // Check if schema is empty
      if (!isEmptySchema(endpoint.requestUrlPathParamsSchema)) {
        logger.info("🔗 URL Parameters:");
        const formData = await CliInputParser.generateFormFromEndpoint(
          endpoint,
          "urlPathParams",
        );
        // Extract only scalar values for URL params (strings, numbers, booleans)
        const urlParams: CliUrlParams = {};
        for (const [key, value] of Object.entries(formData)) {
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            value === null ||
            value === undefined
          ) {
            urlParams[key] = value;
          }
        }
        inputData.urlPathParams = urlParams;
      }
    } else if (urlPathParams) {
      inputData.urlPathParams = urlPathParams;
    }

    return inputData;
  }

  /**
   * Generate form from endpoint using schema UI handler
   */
  private static async generateFormFromEndpoint(
    endpoint: CreateApiEndpointAny,
    formType: "request" | "urlPathParams" = "request",
  ): Promise<CliRequestData> {
    const schema =
      formType === "request"
        ? endpoint.requestSchema
        : endpoint.requestUrlPathParamsSchema;

    if (!schema) {
      return {};
    }

    const fields = SchemaUIHandler.parseSchema(schema);
    const config = {
      title: `${endpoint.method} ${endpoint.path.join("/")}`,
      description: endpoint.description || endpoint.title,
      fields,
    };

    const result = await SchemaUIHandler.generateForm(config);
    return result;
  }
}

/**
 * Collected CLI request data with optional URL parameters
 */
interface CollectedCliRequestData {
  data?: CliRequestData;
  urlPathParams?: CliUrlParams;
}

/**
 * CLI URL path parameters
 */
export interface CliUrlParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Type for nested CLI objects
 */
export interface CliObject {
  [key: string]: CliValue;
}

/**
 * Type for CLI argument values - supports primitives and nested objects
 */
type CliValue = string | number | boolean | CliObject;

/**
 * Type for parsed CLI data - supports nested objects
 */
export type ParsedCliData = Record<string, CliValue | null>;

/**
 * CLI request data type
 */
export interface CliRequestData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | string[]
    | number[]
    | boolean[]
    | CliRequestData
    | CliRequestData[];
}

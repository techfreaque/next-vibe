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
   * Check whether an argument token looks like a flag (starts with - or --)
   */
  private static isFlag(arg: string): boolean {
    return arg.startsWith("-");
  }

  /**
   * Peek at the next token: if it exists and doesn't look like a flag,
   * consume it as the value for a named arg and return it.
   * Returns undefined if no value token is available.
   */
  private static peekValue(
    tokens: string[],
    index: number,
  ): { value: string; nextIndex: number } | undefined {
    const next = tokens[index];
    if (next && typeof next === "string" && !this.isFlag(next)) {
      return { value: next, nextIndex: index + 1 };
    }
    return undefined;
  }

  /**
   * Core token-loop shared by both simple and rawArgs parsers.
   * Handles:
   *   --key=value          explicit inline value
   *   --key value          consumes one following non-flag token as value
   *                        (unless the key is a known boolean field)
   *   --key                boolean true (no following non-flag token)
   *   -k                   single-dash short flags — always boolean, no lookahead
   *   positional           collected into positionalArgs
   *
   * Multi-value arrays use positional args + firstCliArgKey (collects all positionals).
   */
  private static parseTokens(
    tokens: string[],
    booleanFields: Set<string> = new Set(),
  ): {
    positionalArgs: string[];
    namedArgs: CliObject;
  } {
    const positionalArgs: string[] = [];
    const namedArgs: CliObject = {};
    let i = 0;

    while (i < tokens.length) {
      const arg = tokens[i];

      if (!arg || typeof arg !== "string") {
        i++;
        continue;
      }

      if (arg.startsWith("--")) {
        const sliced = arg.slice(2);
        const eqIndex = sliced.indexOf("=");

        if (eqIndex !== -1) {
          // --key=value — explicit value, no lookahead
          const key = this.kebabToCamelCase(sliced.slice(0, eqIndex));
          const value = this.convertCliValue(sliced.slice(eqIndex + 1));
          namedArgs[key] = value;
          i++;
        } else {
          // --key — lookahead only when not a known boolean field
          const key = this.kebabToCamelCase(sliced);
          const isBoolean = booleanFields.has(key) || booleanFields.has(sliced);
          if (!isBoolean) {
            const peeked = this.peekValue(tokens, i + 1);
            if (peeked) {
              namedArgs[key] = this.convertCliValue(peeked.value);
              i = peeked.nextIndex;
              continue;
            }
          }
          namedArgs[key] = true;
          i++;
        }
      } else if (arg.startsWith("-") && arg.length > 1) {
        // -k — single-dash short flags are always boolean, no lookahead
        const key = this.kebabToCamelCase(arg.slice(1));
        namedArgs[key] = true;
        i++;
      } else {
        // Positional argument
        positionalArgs.push(arg);
        i++;
      }
    }

    return { positionalArgs, namedArgs };
  }

  /**
   * Simple CLI argument parser for when rawArgs is not available.
   * Supports nested object notation: --group.name=value
   * Supports space-separated values: --key value
   */
  static parseCliArgumentsSimple(
    args: string[],
    endpoint?: CreateApiEndpointAny | null,
  ): {
    positionalArgs: string[];
    namedArgs: CliObject;
  } {
    return this.parseTokens(
      args,
      this.buildBooleanFieldNames(endpoint ?? null),
    );
  }

  /**
   * Parse CLI arguments into structured data.
   * Supports nested object notation: --group.name=value
   * Supports space-separated values: --key value
   */
  static parseCliArguments(
    args: string[],
    rawArgs: string[],
    logger: EndpointLogger,
    endpoint?: CreateApiEndpointAny | null,
  ): {
    positionalArgs: string[];
    namedArgs: CliObject;
  } {
    // Safety checks for input parameters
    if (!Array.isArray(args)) {
      logger.error("parseCliArguments: args is not an array", undefined, {
        argsType: typeof args,
      });
      return { positionalArgs: [], namedArgs: {} };
    }
    if (!Array.isArray(rawArgs)) {
      logger.error("parseCliArguments: rawArgs is not an array", undefined, {
        rawArgsType: typeof rawArgs,
      });
      return { positionalArgs: [], namedArgs: {} };
    }

    // Find the command token (first non-flag positional) within rawArgs.
    // Skip flag-like entries so unknown flags (e.g. --fix) in args[] don't
    // accidentally match before the actual command name.
    const commandIndex = rawArgs.findIndex(
      (arg) => arg && !arg.startsWith("-") && args.includes(arg),
    );
    const relevantArgs =
      commandIndex >= 0 ? rawArgs.slice(commandIndex + 1) : [];

    return this.parseTokens(
      relevantArgs,
      this.buildBooleanFieldNames(endpoint ?? null),
    );
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
    if (dryRun) {
      optionsData.dryRun = true;
    }
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
   * Resolve the core type string of a Zod field, unwrapping optional/default/nullable wrappers.
   * Works with both Zod v3 (_def.typeName) and Zod v4 (.type / .def.type).
   */
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod schema introspection requires opaque field type to support both v3 (_def.typeName) and v4 (.type/.def.type) APIs
  private static resolveZodType(field: unknown): string | undefined {
    if (!field || typeof field !== "object") {
      return undefined;
    }
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internals are opaque; must use Record<string, unknown> to safely access dynamic properties
    const f = field as Record<string, unknown>;

    // Zod v4: .type is the direct type string on the field itself
    if (typeof f.type === "string" && f.type !== "object") {
      if (
        f.type === "optional" ||
        f.type === "default" ||
        f.type === "nullable"
      ) {
        // Unwrap to inner — check .def.innerType for v4
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internals are opaque; must use Record<string, unknown> to safely access dynamic properties
        const def = f.def as Record<string, unknown> | undefined;
        return this.resolveZodType(def?.innerType);
      }
      return f.type;
    }

    // Zod v4: .def.type
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internals are opaque; must use Record<string, unknown> to safely access dynamic properties
    const def = f.def as Record<string, unknown> | undefined;
    if (def && typeof def.type === "string") {
      if (
        def.type === "optional" ||
        def.type === "default" ||
        def.type === "nullable"
      ) {
        return this.resolveZodType(def.innerType);
      }
      return def.type;
    }

    // Zod v3: ._def.typeName
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internals are opaque; must use Record<string, unknown> to safely access dynamic properties
    const _def = f._def as Record<string, unknown> | undefined;
    if (_def && typeof _def.typeName === "string") {
      const typeName = _def.typeName as string;
      if (
        typeName === "ZodDefault" ||
        typeName === "ZodOptional" ||
        typeName === "ZodNullable"
      ) {
        return this.resolveZodType(_def.innerType);
      }
      return typeName === "ZodBoolean" ? "boolean" : typeName;
    }

    return undefined;
  }

  /**
   * Collect the set of field names that are purely boolean in the endpoint schema.
   * These flags must never consume the next token as their value.
   * Works with both Zod v3 and Zod v4.
   */
  private static buildBooleanFieldNames(
    endpointDefinition: CreateApiEndpointAny | null,
  ): Set<string> {
    const booleans = new Set<string>();
    if (!endpointDefinition) {
      return booleans;
    }

    const schema = endpointDefinition.requestSchema;
    if (!schema) {
      return booleans;
    }

    try {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internals are opaque; must use Record<string, unknown> to safely access .shape property
      const shape = (schema as { shape?: Record<string, unknown> }).shape;
      if (shape && typeof shape === "object") {
        for (const [key, fieldSchema] of Object.entries(shape)) {
          if (this.resolveZodType(fieldSchema) === "boolean") {
            booleans.add(key);
            booleans.add(this.kebabToCamelCase(key));
          }
        }
      }
    } catch {
      // Best-effort — ignore errors
    }

    return booleans;
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
   * Convert CLI string values to appropriate types.
   * Arrays are passed through with each element normalized.
   */
  private static normalizeCliValue(
    value: CliValue | null | undefined,
  ): CliValue | null | undefined {
    if (Array.isArray(value)) {
      return value.map((v) => this.normalizeCliValue(v) as CliValue);
    }
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

    // Build single-letter shortcuts for this endpoint
    const shortcuts = this.buildSingleLetterShortcuts(endpoint);

    // Expand single-letter keys and process named arguments first
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
    ]);

    for (const [key, value] of Object.entries(expandedNamedArgs)) {
      if (CLI_LEVEL_OPTIONS.has(key)) {
        continue;
      }

      // kebab-case → camelCase (assignValues already did this, but expandNamedArgs may not)
      const camelCaseKey = this.kebabToCamelCase(key);

      // Convert string boolean values to actual booleans (arrays pass through).
      // Cast is safe — Zod strips incompatible shapes at final parse.
      data[camelCaseKey] = this.normalizeCliValue(
        value,
      ) as CliRequestData[string];
    }

    // Handle firstCliArgKey: merge positional args with any named value already set
    const firstCliArgKey = endpoint?.cli?.firstCliArgKey;
    if (firstCliArgKey && positionalArgs.length > 0) {
      const existing = data[firstCliArgKey];
      const existingArr: string[] = Array.isArray(existing)
        ? (existing as string[])
        : existing && typeof existing === "string"
          ? [existing]
          : [];
      const merged = [...existingArr, ...positionalArgs];
      data[firstCliArgKey] = merged.length === 1 ? merged[0] : merged;
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
      /** Raw tokens after the command — used to re-parse with endpoint boolean field knowledge */
      rawTokens?: string[];
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

    // Re-parse tokens with endpoint boolean field awareness when raw tokens are available.
    // The initial parse in vibe-runtime.ts didn't know the endpoint yet, so boolean flags
    // may have incorrectly consumed the next token as their value. Re-parsing fixes that.
    let positionalArgs = params.positionalArgs;
    let namedArgs = params.namedArgs;
    if (params.rawTokens && endpoint) {
      const reparsed = CliInputParser.parseCliArgumentsSimple(
        params.rawTokens,
        endpoint,
      );
      positionalArgs = reparsed.positionalArgs;
      namedArgs = reparsed.namedArgs;
    }

    // Always try to build data from CLI arguments first
    const cliData = CliInputParser.buildDataFromCliArgs(
      endpoint,
      positionalArgs,
      namedArgs,
    );

    if (contextData || (cliData && Object.keys(cliData).length > 0)) {
      // Merge context options (interactive, dryRun) into data only if explicitly set
      // Don't merge if they're CLI defaults to allow schema defaults to apply
      const optionsData = CliInputParser.buildOptionsData(interactive, dryRun);

      const mergedData = CliInputParser.mergeData(
        optionsData,
        contextData || {},
        cliData || {},
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
        // Parse the full merged input through the URL params schema — it will
        // strip unknown keys and apply defaults, giving us exactly what belongs
        // in urlPathParams without any manual key inspection.
        const merged = { ...(contextData ?? {}), ...(cliData ?? {}) };
        const parsed = endpoint.requestUrlPathParamsSchema.safeParse(merged);

        if (
          parsed.success &&
          Object.keys(parsed.data as CliRequestData).length > 0
        ) {
          inputData.urlPathParams = parsed.data as CliUrlParams;
        } else {
          // Fall back to interactive prompt when data doesn't satisfy the schema
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
 * Type for CLI argument values - supports primitives, arrays, and nested objects
 */
type CliValue = string | number | boolean | CliObject | CliValue[];

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

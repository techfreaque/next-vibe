/**
 * CLI Input Parsing & Handling
 * Static class for parsing CLI arguments and handling input data processing
 */

import { resolveInputPath } from "./input-path";
import { isEmptySchema } from "../../../core/core-utils/validation";
import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { FieldDataType } from "../../../core/definition/enums";
import type { WidgetData } from "../../../core/utils/json";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import { hasChildren } from "../../../unified-ui/_shared/type-guards";
import { SchemaUIHandler } from "../../../unified-ui/renderers/cli/response/schema-handler";
import { readFileSync } from "node:fs";
import type { z } from "zod";

/**
 * CLI Input Parser - Static class for all input parsing and handling
 */
/**
 * The opaque zod schema internals the CLI probes to learn a field's type.
 * Named rather than `object`/`unknown` so the reads below need no assertion.
 */
interface ZodIntrospectable {
  readonly [key: string]: WidgetData;
}

/** Narrow a property to a string, or undefined. No assertion. */
function readZodString(
  obj: ZodIntrospectable,
  key: string,
): string | undefined {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
}

/** Narrow a property to a nested schema object, or undefined. No assertion. */
function readZodObject(
  obj: ZodIntrospectable,
  key: string,
): ZodIntrospectable | undefined {
  const value = obj[key];
  return typeof value === "object" && value !== null
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

export class CliInputParser {
  /**
   * Convert kebab-case to camelCase
   * Example: "force-update" -> "forceUpdate"
   */
  private static kebabToCamelCase(str: string): string {
    return str.replaceAll(/-([a-z])/g, (match) =>
      (match[1] ?? "").toUpperCase(),
    );
  }

  /**
   * Set a nested value in an object using dot notation
   * Converts kebab-case keys to camelCase for API compatibility
   * Example: setNestedValue(obj, "user.name", "John") -> { user: { name: "John" } }
   */
  private static setNestedValue(
    obj: Record<string, WidgetData>,
    path: string,
    value: string | number | boolean,
  ): void {
    // Convert kebab-case path segments to camelCase for API compatibility
    const keys = path.split(".").map((s) => this.kebabToCamelCase(s));

    const firstKey = keys[0];
    if (firstKey === undefined) {
      return;
    }
    if (keys.length === 1) {
      // Simple key, no nesting
      obj[firstKey] = value;
      return;
    }

    // Navigate to the nested object, creating objects as needed
    let current: Record<string, WidgetData> = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key === undefined) {
        continue;
      }
      const existing = current[key];

      if (
        !existing ||
        typeof existing !== "object" ||
        Array.isArray(existing) ||
        existing instanceof Date
      ) {
        // Create a new object if it doesn't exist or is not an object
        const newObj: Record<string, WidgetData> = {};
        current[key] = newObj;
        current = newObj;
      } else {
        // Navigate into existing object
        current = existing;
      }
    }

    // Set the final value
    const finalKey = keys[keys.length - 1];
    if (finalKey !== undefined) {
      current[finalKey] = value;
    }
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
  private static convertCliValue(
    value: string,
    key: string,
    stringFields: Set<string>,
  ): string | number | boolean {
    if (stringFields.has(key)) {
      return value;
    }

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
   *   -k                   single-dash short flags - always boolean, no lookahead
   *   positional           collected into positionalArgs
   *   --                   everything after it is positional, whatever it looks like (a command line to pass on)
   *
   * Multi-value arrays use positional args + firstCliArgKey (collects all positionals).
   */
  private static parseTokens(
    tokens: string[],
    booleanFields: Set<string> = new Set(),
    endpointFields: Set<string> = new Set(),
    stringFields: Set<string> = new Set(),
  ): {
    positionalArgs: string[];
    namedArgs: Record<string, WidgetData>;
  } {
    const positionalArgs: string[] = [];
    const namedArgs: Record<string, WidgetData> = {};
    const fileValueKeys = new Set<string>();
    let i = 0;

    while (i < tokens.length) {
      const arg = tokens[i];

      if (!arg || typeof arg !== "string") {
        i++;
        continue;
      }

      if (arg === "--") {
        positionalArgs.push(...tokens.slice(i + 1));
        break;
      }

      if (arg.startsWith("--")) {
        const sliced = arg.slice(2);
        const eqIndex = sliced.indexOf("=");
        const flagName = eqIndex === -1 ? sliced : sliced.slice(0, eqIndex);
        // --text-file and --textFile both name the file variant of `text`.
        const fileKeyMatch = /^(.+?)(?:-file|File)$/.exec(flagName);
        const fileFieldKey = fileKeyMatch?.[1];
        const fileFieldCamel = fileFieldKey
          ? this.kebabToCamelCase(fileFieldKey)
          : undefined;
        const literalFileField = fileFieldCamel
          ? `${fileFieldCamel}File`
          : undefined;

        if (
          fileFieldKey &&
          fileFieldCamel &&
          endpointFields.has(fileFieldCamel) &&
          !endpointFields.has(literalFileField ?? "")
        ) {
          const key = fileFieldCamel;
          if (Object.hasOwn(namedArgs, key) || fileValueKeys.has(key)) {
            // oxlint-disable-next-line restricted/no-throw -- reported by the CLI action handler's catch
            throw new Error(
              `Cannot provide both --${fileFieldKey} and --${fileFieldKey}-file`,
            );
          }

          let filePath: string;
          let nextIndex: number;
          if (eqIndex !== -1) {
            filePath = sliced.slice(eqIndex + 1);
            nextIndex = i + 1;
          } else {
            const peeked = this.peekValue(tokens, i + 1);
            if (!peeked) {
              // oxlint-disable-next-line restricted/no-throw -- reported by the CLI action handler's catch
              throw new Error(`Missing file path for --${sliced}`);
            }
            filePath = peeked.value;
            nextIndex = peeked.nextIndex;
          }

          const resolvedPath = resolveInputPath(filePath);
          try {
            namedArgs[key] = readFileSync(resolvedPath, "utf8").replace(
              /^\uFEFF/,
              "",
            );
          } catch {
            // oxlint-disable-next-line restricted/no-throw -- reported by the CLI action handler's catch
            throw new Error(
              `Cannot read --${flagName} "${filePath}" (looked for ${resolvedPath})`,
            );
          }
          fileValueKeys.add(key);
          i = nextIndex;
          continue;
        }

        if (eqIndex !== -1) {
          // --key=value - explicit value, no lookahead
          const key = this.kebabToCamelCase(sliced.slice(0, eqIndex));
          if (fileValueKeys.has(key)) {
            // oxlint-disable-next-line restricted/no-throw -- reported by the CLI action handler's catch
            throw new Error(`Cannot provide both --${key} and --${key}-file`);
          }
          const value = this.convertCliValue(
            sliced.slice(eqIndex + 1),
            key,
            stringFields,
          );
          namedArgs[key] = value;
          i++;
        } else {
          // --key - lookahead only when not a known boolean field
          const key = this.kebabToCamelCase(sliced);
          if (fileValueKeys.has(key)) {
            // oxlint-disable-next-line restricted/no-throw -- reported by the CLI action handler's catch
            throw new Error(`Cannot provide both --${key} and --${key}-file`);
          }
          const isBoolean = booleanFields.has(key) || booleanFields.has(sliced);
          if (!isBoolean) {
            const peeked = this.peekValue(tokens, i + 1);
            if (peeked) {
              namedArgs[key] = this.convertCliValue(
                peeked.value,
                key,
                stringFields,
              );
              i = peeked.nextIndex;
              continue;
            }
          }
          namedArgs[key] = true;
          i++;
        }
      } else if (arg.startsWith("-") && arg.length > 1) {
        // -k - single-dash short flags are always boolean, no lookahead
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
    namedArgs: Record<string, WidgetData>;
  } {
    return this.parseTokens(
      args,
      this.buildBooleanFieldNames(endpoint ?? null),
      this.buildEndpointFieldNames(endpoint ?? null),
      this.buildFieldNamesOfType(endpoint ?? null, "string"),
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
    namedArgs: Record<string, WidgetData>;
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
    // Normalize path separators for cross-platform compatibility (Windows vs Unix)
    const normalizedArgs = args.map((a) => a.replaceAll("\\", "/"));
    const commandIndex = rawArgs.findIndex(
      (arg) =>
        arg &&
        !arg.startsWith("-") &&
        normalizedArgs.includes(arg.replaceAll("\\", "/")),
    );
    const relevantArgs =
      commandIndex >= 0 ? rawArgs.slice(commandIndex + 1) : [];

    return this.parseTokens(
      relevantArgs,
      this.buildBooleanFieldNames(endpoint ?? null),
      this.buildEndpointFieldNames(endpoint ?? null),
      this.buildFieldNamesOfType(endpoint ?? null, "string"),
    );
  }

  /**
   * Merge data objects, with later sources taking precedence
   */
  // oxlint-disable-next-line restricted/no-unknown
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
  ): Partial<Record<string, WidgetData>> {
    const optionsData: Partial<Record<string, WidgetData>> = {};
    if (interactive) {
      optionsData.interactive = true;
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
  // eslint-disable-next-line restricted/no-unknown -- Zod schema introspection requires opaque field type to support both v3 (_def.typeName) and v4 (.type/.def.type) APIs
  private static resolveZodType(field: unknown): string | undefined {
    if (!field || typeof field !== "object") {
      return undefined;
    }
    // Property reads go through the typed helpers above so the opaque zod
    // internals need no `as` assertion (banned by this repo's rules).
    const probe: ZodIntrospectable = Object.fromEntries(Object.entries(field));

    // Zod v4: .type is the direct type string on the field itself
    const directType = readZodString(probe, "type");
    if (directType !== undefined && directType !== "object") {
      if (
        directType === "optional" ||
        directType === "default" ||
        directType === "nullable"
      ) {
        // Unwrap to inner - check .def.innerType for v4
        const def = readZodObject(probe, "def");
        return def
          ? this.resolveZodType(readZodObject(def, "innerType"))
          : undefined;
      }
      return directType;
    }

    // Zod v4: .def.type
    const def = readZodObject(probe, "def");
    if (def) {
      const defType = readZodString(def, "type");
      if (defType !== undefined) {
        if (
          defType === "optional" ||
          defType === "default" ||
          defType === "nullable"
        ) {
          return this.resolveZodType(readZodObject(def, "innerType"));
        }
        return defType;
      }
    }

    // Zod v3: ._def.typeName
    // oxlint-disable-next-line no-underscore-dangle -- `_def` is zod's internal schema descriptor
    const legacyDef = readZodObject(probe, "_def");
    if (legacyDef) {
      const typeName = readZodString(legacyDef, "typeName");
      if (typeName !== undefined) {
        if (
          typeName === "ZodDefault" ||
          typeName === "ZodOptional" ||
          typeName === "ZodNullable"
        ) {
          return this.resolveZodType(readZodObject(legacyDef, "innerType"));
        }
        if (typeName === "ZodString") {
          return "string";
        }
        return typeName === "ZodBoolean" ? "boolean" : typeName;
      }
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
    return this.buildFieldNamesOfType(endpointDefinition, "boolean");
  }

  /**
   * Collect the field names whose (unwrapped) zod type is `type`.
   * Works with both Zod v3 and Zod v4.
   */
  private static buildFieldNamesOfType(
    endpointDefinition: CreateApiEndpointAny | null,
    type: "boolean" | "string",
  ): Set<string> {
    const names = new Set<string>();
    if (!endpointDefinition) {
      return names;
    }

    const schema = endpointDefinition.requestSchema;
    if (!schema) {
      return names;
    }

    try {
      // eslint-disable-next-line restricted/no-unknown -- zod internals are opaque
      const shapeValue: unknown = Reflect.get(schema, "shape");
      const shape =
        typeof shapeValue === "object" && shapeValue !== null
          ? shapeValue
          : undefined;
      if (shape) {
        for (const [key, fieldSchema] of Object.entries(shape)) {
          if (this.resolveZodType(fieldSchema) === type) {
            names.add(key);
            names.add(this.kebabToCamelCase(key));
          }
        }
      }
    } catch {
      // Best-effort - ignore errors
    }

    return names;
  }

  private static buildEndpointFieldNames(
    endpointDefinition: CreateApiEndpointAny | null,
  ): Set<string> {
    const fields = endpointDefinition?.fields;
    if (!fields || !hasChildren(fields)) {
      return new Set();
    }
    return new Set(
      Object.keys(fields.children).flatMap((name) => [
        name,
        this.kebabToCamelCase(name),
      ]),
    );
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
      const only = names[0];
      if (names.length === 1 && only !== undefined) {
        shortcuts.set(letter, only);
      }
    }

    return shortcuts;
  }

  /**
   * Expand single-letter shortcuts to full field names
   */
  private static expandNamedArgs(
    namedArgs: Record<string, WidgetData>,
    shortcuts: Map<string, string>,
  ): Record<string, WidgetData> {
    const expanded: Record<string, WidgetData> = {};

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
  private static normalizeCliValue(value: WidgetData): WidgetData {
    if (Array.isArray(value)) {
      return value.map((v) => this.normalizeCliValue(v));
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
    namedArgs: Record<string, WidgetData>,
  ): Record<string, WidgetData> | null {
    if (positionalArgs.length === 0 && Object.keys(namedArgs).length === 0) {
      return null;
    }

    const data: Record<string, WidgetData> = {};

    // Build single-letter shortcuts for this endpoint
    const shortcuts = this.buildSingleLetterShortcuts(endpoint);

    // Expand single-letter keys and process named arguments first
    const expandedNamedArgs = this.expandNamedArgs(namedArgs, shortcuts);

    // Skip these CLI-level options (already in context.options)
    const CLI_LEVEL_OPTIONS = new Set([
      "interactive",
      "verbose",
      "debug",
      "output",
      "locale",
      "preview",
    ]);

    for (const [key, value] of Object.entries(expandedNamedArgs)) {
      if (CLI_LEVEL_OPTIONS.has(key)) {
        continue;
      }

      // Convert string boolean values to actual booleans (arrays pass through).
      // Cast is safe - Zod strips incompatible shapes at final parse.
      const normalizedValue = this.normalizeCliValue(value);

      // Use setNestedValue to expand dot-notation keys (e.g. response.output → { response: { output } })
      if (key.includes(".")) {
        // `data` is already Record<string, WidgetData>; normalizeCliValue
        // returns exactly the primitive union setNestedValue accepts, so the
        // upstream assertions here were redundant.
        if (
          typeof normalizedValue === "string" ||
          typeof normalizedValue === "number" ||
          typeof normalizedValue === "boolean"
        ) {
          this.setNestedValue(data, key, normalizedValue);
        }
      } else {
        const camelCaseKey = this.kebabToCamelCase(key);
        data[camelCaseKey] = normalizedValue;
      }
    }

    // Handle firstCliArgKey: merge positional args with any named value already set
    const firstCliArgKey = endpoint?.cli?.firstCliArgKey;
    if (firstCliArgKey && positionalArgs.length > 0) {
      const existing = data[firstCliArgKey];
      const existingArr: string[] = Array.isArray(existing)
        ? existing.filter((v): v is string => typeof v === "string")
        : existing && typeof existing === "string"
          ? [existing]
          : [];
      const merged = [...existingArr, ...positionalArgs];
      // A single positional stays an array when the field itself is
      // array-valued (e.g. a multi-select picker) - otherwise "one stage"
      // would arrive as a bare string and fail the array schema.
      const fields = endpoint?.fields;
      const target =
        fields && hasChildren(fields)
          ? fields.children[firstCliArgKey]
          : undefined;
      const isArrayField =
        target !== undefined &&
        "fieldType" in target &&
        (target.fieldType === FieldDataType.TEXT_ARRAY ||
          target.fieldType === FieldDataType.MULTISELECT ||
          target.fieldType === FieldDataType.TAGS ||
          (target.fieldType === FieldDataType.ENTITY_PICKER &&
            "multiple" in target &&
            target.multiple === true));
      data[firstCliArgKey] =
        merged.length === 1 && !isArrayField ? merged[0] : merged;
    }

    return Object.keys(data).length > 0 ? data : null;
  }

  /**
   * Collect input data using schema-driven UI
   */
  static async collectCliRequestData(
    endpoint: CreateApiEndpointAny | null,
    params: {
      data?: Record<string, WidgetData>;
      urlPathParams?: CliUrlParams;
      positionalArgs: string[];
      namedArgs: Record<string, WidgetData>;
      /** Raw tokens after the command - used to re-parse with endpoint boolean field knowledge */
      rawTokens?: string[];
      interactive: boolean;
    },
    logger: EndpointLogger,
  ): Promise<CollectedCliRequestData> {
    const inputData: CollectedCliRequestData = {};
    const contextData = params.data;
    const urlPathParams = params.urlPathParams;
    const interactive = params.interactive;

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
      // Merge context options (interactive) into data only if explicitly set
      // Don't merge if they're CLI defaults to allow schema defaults to apply
      const optionsData = CliInputParser.buildOptionsData(interactive);

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
        CliInputParser.buildOptionsData(interactive),
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
        // Parse the full merged input through the URL params schema - it will
        // strip unknown keys and apply defaults, giving us exactly what belongs
        // in urlPathParams without any manual key inspection.
        const merged = { ...(contextData ?? {}), ...(cliData ?? {}) };
        const parsed = endpoint.requestUrlPathParamsSchema.safeParse(merged);

        // safeParse returns the schema's own output type; narrowing it with
        // a runtime object check gives the same guarantee the upstream
        // assertions asserted, without asserting past the checker.
        const parsedData: CliUrlParams | undefined =
          parsed.success &&
          typeof parsed.data === "object" &&
          parsed.data !== null
            ? Object.fromEntries(Object.entries(parsed.data))
            : undefined;
        if (parsedData && Object.keys(parsedData).length > 0) {
          inputData.urlPathParams = parsedData;
        } else if (interactive) {
          // Fall back to interactive prompt when data doesn't satisfy the schema.
          // Skip when interactive:false — the Ink UI will collect URL params via
          // form fields / EntityPickerField instead of raw prompts.
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
  ): Promise<Record<string, WidgetData>> {
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
  data?: Record<string, WidgetData>;
  urlPathParams?: CliUrlParams;
}

/**
 * CLI URL path parameters
 */
interface CliUrlParams {
  [key: string]: string | number | boolean | null | undefined;
}

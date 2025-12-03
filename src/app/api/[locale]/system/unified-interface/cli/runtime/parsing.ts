/**
 * CLI Argument Parsing Logic
 * Handles parsing and type conversion of command-line arguments
 */

import type { EndpointLogger } from "../../shared/logger/endpoint";

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
 * Set a nested value in an object using dot notation
 * Example: setNestedValue(obj, "user.name", "John") -> { user: { name: "John" } }
 */
function setNestedValue(
  obj: CliObject,
  path: string,
  value: string | number | boolean,
): void {
  const keys = path.split(".");

  if (keys.length === 1) {
    // Simple key, no nesting
    obj[path] = value;
    return;
  }

  // Navigate to the nested object, creating objects as needed
  let current: CliObject = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const existing = current[key];

    if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
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
function tryParseNumber(value: string): string | number {
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
function convertCliValue(value: string): string | number | boolean {
  // Handle boolean values first
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  // Try to parse as number
  const numberValue = tryParseNumber(value);
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
export function parseCliArgumentsSimple(args: string[]): {
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
      // Handle --key=value or --key value
      const sliced = arg.slice(2);
      const [key, ...valueParts] = sliced.split("=");
      let value: string | number | boolean;

      if (valueParts.length) {
        // --key=value format
        value = valueParts.join("=");
      } else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        // --key value format
        value = args[i + 1];
        i++; // Skip the next argument as it's the value
      } else {
        // Boolean flag
        value = true;
      }

      // Try to parse simple boolean values
      if (typeof value === "string") {
        value = convertCliValue(value);
      }

      // Support nested object notation (e.g., --group.name=value)
      setNestedValue(namedArgs, key, value);
    } else if (arg.startsWith("-")) {
      // Handle -k value (single dash)
      const key = arg.slice(1);
      if (
        i + 1 < args.length &&
        args[i + 1] &&
        !args[i + 1].startsWith("-")
      ) {
        const value = convertCliValue(args[i + 1]);
        setNestedValue(namedArgs, key, value);
        i++;
      } else {
        setNestedValue(namedArgs, key, true);
      }
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
export function parseCliArguments(
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
  const relevantArgs = commandIndex >= 0 ? rawArgs.slice(commandIndex + 1) : [];

  for (let i = 0; i < relevantArgs.length; i++) {
    const arg = relevantArgs[i];

    // Skip undefined, null, or empty arguments
    if (!arg || typeof arg !== "string") {
      continue;
    }

    if (arg.startsWith("--")) {
      // Handle --key=value or --key value
      try {
        const sliced = arg.slice(2);
        if (typeof sliced !== "string") {
          logger.error("parseCliArguments: sliced is not a string");
          continue;
        }
        const [key, ...valueParts] = sliced.split("=");
        let value: string | number | boolean;

        if (valueParts.length) {
          // --key=value format
          value = valueParts.join("=");
        } else if (
          i + 1 < relevantArgs.length &&
          !relevantArgs[i + 1].startsWith("-")
        ) {
          // --key value format
          value = relevantArgs[i + 1];
          i++; // Skip the next argument as it's the value
        } else {
          // Boolean flag
          value = true;
        }

        // Try to parse simple boolean values only
        if (typeof value === "string") {
          value = convertCliValue(value);
          // Don't parse JSON here - let the main handler do it
        }

        // Support nested object notation (e.g., --group.name=value)
        setNestedValue(namedArgs, key, value);
      } catch (parseError) {
        logger.error(
          "parseCliArguments: Error parsing double hyphen arg",
          parseError as Error,
        );
        continue;
      }
    } else if (arg.startsWith("-")) {
      // Handle -k value (single dash)
      const key = arg.slice(1);
      if (
        i + 1 < relevantArgs.length &&
        relevantArgs[i + 1] &&
        !relevantArgs[i + 1].startsWith("-")
      ) {
        const value = convertCliValue(relevantArgs[i + 1]);
        setNestedValue(namedArgs, key, value);
        i++;
      } else {
        setNestedValue(namedArgs, key, true);
      }
    } else {
      // Positional argument
      positionalArgs.push(arg);
    }
  }

  return { positionalArgs, namedArgs };
}

/**
 * Schema-Driven UI Handler
 * Generates CLI interfaces from Zod schemas in endpoint definitions
 * Integrates with existing CLI handler system
 */

import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { z } from "zod";

/**
 * Zod shape type for object schemas
 */
interface ZodShape {
  [key: string]: z.ZodTypeAny;
}

/**
 * Zod check constraint
 */
interface ZodCheck {
  kind: string;
  value?: number;
  message?: string;
}

/**
 * Zod with internal _def property
 */
interface ZodInternal {
  _def: {
    innerType?: z.ZodTypeAny;
    defaultValue?: () => FormFieldValue;
    description?: string;
    checks?: ZodCheck[];
  };
}

/**
 * Type guard to check if a Zod schema has internal _def property
 */
function hasZodDef(schema: z.ZodTypeAny): schema is z.ZodTypeAny & ZodInternal {
  return "_def" in schema && typeof schema._def === "object";
}

/**
 * Valid form field value types
 */
export type FormFieldValue =
  | string
  | number
  | boolean
  | string[]
  | undefined
  | null;

/**
 * Schema field metadata for CLI rendering
 */
export interface SchemaFieldMetadata {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: FormFieldValue;
  choices?: string[];
  validation?: z.ZodTypeAny;
}

/**
 * CLI form configuration
 */
export interface CLIFormConfig {
  title?: string;
  description?: string;
  fields: SchemaFieldMetadata[];
}

/**
 * Schema-driven UI handler class
 * Static class for parsing Zod schemas and generating CLI forms
 */
export class SchemaUIHandler {
  /**
   * Parse Zod schema into CLI field metadata
   */
  static parseSchema(schema: z.ZodTypeAny, prefix = ""): SchemaFieldMetadata[] {
    const fields: SchemaFieldMetadata[] = [];

    if (schema instanceof z.ZodObject) {
      const shape: ZodShape = schema.shape;

      for (const key of Object.keys(shape)) {
        const fieldSchema = shape[key];
        if (fieldSchema && fieldSchema instanceof z.ZodType) {
          const fieldName = prefix ? `${prefix}.${key}` : key;
          const fieldMeta = SchemaUIHandler.parseFieldSchema(
            fieldName,
            fieldSchema,
          );
          fields.push(fieldMeta);
        }
      }
    } else if (
      schema instanceof z.ZodUndefined ||
      schema instanceof z.ZodVoid
    ) {
      // No fields for undefined schemas
      return [];
    } else {
      // Handle single field schemas
      const fieldMeta = SchemaUIHandler.parseFieldSchema(
        prefix || "value",
        schema,
      );
      fields.push(fieldMeta);
    }

    return fields;
  }

  /**
   * Parse individual field schema
   */
  private static parseFieldSchema(
    name: string,
    schema: z.ZodTypeAny,
  ): SchemaFieldMetadata {
    let required = true;
    let defaultValue: FormFieldValue = undefined;
    let currentSchema = schema;

    // Unwrap optional schemas
    while (currentSchema instanceof z.ZodOptional && hasZodDef(currentSchema)) {
      required = false;
      const innerType = currentSchema._def.innerType;
      if (innerType && innerType instanceof z.ZodType) {
        currentSchema = innerType;
      } else {
        break;
      }
    }

    // Extract default value and unwrap default schemas
    if (currentSchema instanceof z.ZodDefault && hasZodDef(currentSchema)) {
      const defaultFn = currentSchema._def.defaultValue;
      if (typeof defaultFn === "function") {
        const value = defaultFn();
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.every((v) => typeof v === "string"))
        ) {
          defaultValue = value;
        }
      }
      const innerType = currentSchema._def.innerType;
      if (innerType) {
        currentSchema = innerType;
      }
      required = false;
    }

    const fieldType = SchemaUIHandler.getFieldType(currentSchema);
    const choices = SchemaUIHandler.getFieldChoices(currentSchema);

    // For number fields, use coercion schema for validation
    let validationSchema: z.ZodTypeAny = currentSchema;
    if (currentSchema instanceof z.ZodNumber) {
      let numberSchema = z.coerce.number();
      // Copy constraints from original schema if possible
      if (hasZodDef(currentSchema)) {
        const checks = (currentSchema._def as ZodInternal["_def"]).checks;
        if (Array.isArray(checks)) {
          for (const check of checks) {
            if (check && typeof check === "object" && "kind" in check) {
              const checkKind = check.kind;
              const checkValue = check.value;
              if (checkKind === "min" && typeof checkValue === "number") {
                numberSchema = numberSchema.min(checkValue);
              } else if (
                checkKind === "max" &&
                typeof checkValue === "number"
              ) {
                numberSchema = numberSchema.max(checkValue);
              }
            }
          }
        }
      }
      validationSchema = numberSchema;
    }

    return {
      name,
      type: fieldType,
      required,
      defaultValue,
      choices,
      validation: validationSchema,
      description: SchemaUIHandler.getFieldDescription(currentSchema),
    };
  }

  /**
   * Get field type for CLI rendering
   */
  private static getFieldType(schema: z.ZodTypeAny): string {
    if (schema instanceof z.ZodString) {
      return "input";
    }
    if (schema instanceof z.ZodNumber) {
      return "number";
    }
    if (schema instanceof z.ZodBoolean) {
      return "confirm";
    }
    if (schema instanceof z.ZodEnum) {
      return "list";
    }
    if (schema instanceof z.ZodArray) {
      return "checkbox";
    } // Multi-select for arrays
    if (schema instanceof z.ZodObject) {
      return "object";
    }
    if (schema instanceof z.ZodDate) {
      return "input";
    } // Date as string input

    return "input"; // Default to text input
  }

  /**
   * Get field choices for enum/select fields
   */
  private static getFieldChoices(schema: z.ZodTypeAny): string[] | undefined {
    if (schema instanceof z.ZodEnum) {
      const options = schema.options;
      if (Array.isArray(options)) {
        return options.filter((opt): opt is string => typeof opt === "string");
      }
    }

    return undefined;
  }

  /**
   * Get field description from schema
   */
  private static getFieldDescription(schema: z.ZodTypeAny): string | undefined {
    // Try to get description from schema._def.description
    if (hasZodDef(schema) && "description" in schema._def) {
      const desc = schema._def.description;
      if (typeof desc === "string") {
        return desc;
      }
    }

    return undefined;
  }

  /**
   * Generate CLI form from schema
   */
  static async generateForm(
    config: CLIFormConfig,
  ): Promise<Record<string, FormFieldValue>> {
    if (config.title) {
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write(`\n📋 ${config.title}\n`);
    }

    if (config.description) {
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write(`   ${config.description}\n\n`);
    }

    if (config.fields.length === 0) {
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write("   No input required.\n\n");
      return {};
    }

    interface InquirerAnswer {
      [key: string]: FormFieldValue;
    }

    const answers: InquirerAnswer = {};

    for (const field of config.fields) {
      const message = SchemaUIHandler.formatFieldMessage(field);
      let value: FormFieldValue;

      // Use appropriate prompt function based on field type
      if (field.type === "confirm") {
        value = await confirm({
          message,
          default: field.defaultValue as boolean | undefined,
        });
      } else if (field.type === "list" && field.choices) {
        value = await select({
          message,
          choices: field.choices.map((choice) => ({
            name: choice,
            value: choice,
          })),
          default: field.defaultValue ? String(field.defaultValue) : undefined,
        });
      } else if (field.type === "checkbox" && field.choices) {
        value = await checkbox({
          message,
          choices: field.choices.map((choice) => ({
            name: choice,
            value: choice,
          })),
        });
      } else if (field.type === "number") {
        const inputValue = await input({
          message,
          default: field.defaultValue?.toString(),
          validate: field.validation
            ? (inputStr): string | boolean => {
                // First check if it's a valid number format
                const trimmed = inputStr.trim();
                if (trimmed === "" && !field.required) {
                  return true; // Allow empty for optional fields
                }
                const num = parseFloat(trimmed);
                if (isNaN(num)) {
                  return "Please enter a valid number";
                }
                // Validate the parsed NUMBER against the schema
                const validationResult = SchemaUIHandler.validateField(
                  num,
                  field.validation!,
                );
                return validationResult;
              }
            : (inputStr): string | boolean => {
                const trimmed = inputStr.trim();
                if (trimmed === "" && !field.required) {
                  return true;
                }
                const num = parseFloat(trimmed);
                if (isNaN(num)) {
                  return "Please enter a valid number";
                }
                return true;
              },
        });
        const num = parseFloat(inputValue);
        value = isNaN(num) ? undefined : num;
      } else {
        // Default to input for string fields
        value = await input({
          message,
          default: field.defaultValue?.toString(),
          validate: field.validation
            ? (inputStr): string | boolean =>
                SchemaUIHandler.validateField(inputStr, field.validation!)
            : undefined,
        });
      }

      if (value !== undefined) {
        answers[field.name] = value;
      }
    }

    return SchemaUIHandler.processAnswers(answers, config.fields);
  }

  /**
   * Format field message for CLI prompt
   */
  private static formatFieldMessage(field: SchemaFieldMetadata): string {
    let message = field.name;

    if (field.description) {
      // eslint-disable-next-line i18next/no-literal-string
      message += ` (${field.description})`;
    }

    if (field.required) {
      message += " *";
    }

    return message;
  }

  /**
   * Validate field input against Zod schema
   */
  private static validateField(
    input: FormFieldValue,
    schema: z.ZodTypeAny,
  ): boolean | string {
    try {
      schema.parse(input);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues;
        if (Array.isArray(issues) && issues.length > 0) {
          const firstIssue = issues[0];
          if (firstIssue && typeof firstIssue.message === "string") {
            return firstIssue.message;
          }
        }
        // eslint-disable-next-line i18next/no-literal-string
        return "Invalid input";
      }
      // eslint-disable-next-line i18next/no-literal-string
      return "Validation failed";
    }
  }

  /**
   * Process form answers and convert types
   */
  private static processAnswers(
    answers: Record<string, FormFieldValue>,
    fields: SchemaFieldMetadata[],
  ): Record<string, FormFieldValue> {
    const processed: Record<string, FormFieldValue> = {};

    for (const field of fields) {
      const value = answers[field.name];

      if (value !== undefined && value !== null && value !== "") {
        processed[field.name] = SchemaUIHandler.convertFieldValue(value, field);
      } else if (field.required) {
        // This shouldn't happen due to validation, but handle it by returning empty object
        // Since this is internal utility code, we'll let the caller handle validation

        processed[field.name] = undefined;
      }
    }

    return processed;
  }

  /**
   * Convert field value to appropriate type based on Zod schema
   */
  private static convertFieldValue(
    value: FormFieldValue,
    field: SchemaFieldMetadata,
  ): FormFieldValue {
    // Use the validation schema to determine the actual type
    if (field.validation) {
      let schema = field.validation;

      // Unwrap optional and default schemas to get to the core type
      while (
        schema instanceof z.ZodOptional ||
        schema instanceof z.ZodDefault
      ) {
        if (hasZodDef(schema)) {
          const innerType = schema._def.innerType;
          if (innerType) {
            schema = innerType;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // Check if schema is a ZodNumber
      if (schema instanceof z.ZodNumber) {
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
      }

      // Check if schema is a ZodBoolean
      if (schema instanceof z.ZodBoolean) {
        return Boolean(value);
      }

      // Check if schema is a ZodArray
      if (schema instanceof z.ZodArray && Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
      }
    }

    // Fallback to field type
    if (field.type === "number") {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    }

    if (field.type === "confirm") {
      return Boolean(value);
    }

    if (field.type === "checkbox" && Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }

    // Handle string fields
    if (typeof value === "string") {
      return value;
    }

    // Handle boolean values
    if (typeof value === "boolean") {
      return value;
    }

    // Handle null/undefined
    if (value === null) {
      return null;
    }

    if (value === undefined) {
      return undefined;
    }

    // Fallback for any other type
    return undefined;
  }
}

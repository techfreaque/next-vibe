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
 * Zod with internal _def property
 */
interface ZodInternal {
  _def: {
    innerType?: z.ZodTypeAny;
    defaultValue?: () => FormFieldValue;
    description?: string;
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
 */
export class SchemaUIHandler {
  /**
   * Parse Zod schema into CLI field metadata
   */
  parseSchema(schema: z.ZodTypeAny, prefix = ""): SchemaFieldMetadata[] {
    const fields: SchemaFieldMetadata[] = [];

    if (schema instanceof z.ZodObject) {
      const shape: ZodShape = schema.shape;

      for (const key of Object.keys(shape)) {
        const fieldSchema = shape[key];
        if (fieldSchema && fieldSchema instanceof z.ZodType) {
          const fieldName = prefix ? `${prefix}.${key}` : key;
          const fieldMeta = this.parseFieldSchema(fieldName, fieldSchema);
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
      const fieldMeta = this.parseFieldSchema(prefix || "value", schema);
      fields.push(fieldMeta);
    }

    return fields;
  }

  /**
   * Parse individual field schema
   */
  private parseFieldSchema(
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

    const fieldType = this.getFieldType(currentSchema);
    const choices = this.getFieldChoices(currentSchema);

    return {
      name,
      type: fieldType,
      required,
      defaultValue,
      choices,
      validation: schema,
      description: this.getFieldDescription(currentSchema),
    };
  }

  /**
   * Get field type for CLI rendering
   */
  private getFieldType(schema: z.ZodTypeAny): string {
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
  private getFieldChoices(schema: z.ZodTypeAny): string[] | undefined {
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
  private getFieldDescription(schema: z.ZodTypeAny): string | undefined {
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
  async generateForm(
    config: CLIFormConfig,
  ): Promise<Record<string, FormFieldValue>> {
    if (config.title) {
      // eslint-disable-next-line no-console, i18next/no-literal-string
      console.log(`\n📋 ${config.title}`);
    }

    if (config.description) {
      // eslint-disable-next-line no-console, i18next/no-literal-string
      console.log(`   ${config.description}\n`);
    }

    if (config.fields.length === 0) {
      // eslint-disable-next-line no-console, i18next/no-literal-string
      console.log("   No input required.\n");
      return {};
    }

    interface InquirerAnswer {
      [key: string]: FormFieldValue;
    }

    const answers: InquirerAnswer = {};

    for (const field of config.fields) {
      const message = this.formatFieldMessage(field);
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
          default: field.defaultValue as string | undefined,
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
                const num = parseFloat(inputStr);
                if (isNaN(num)) {
                  return String(num);
                }
                return this.validateField(num, field.validation!);
              }
            : undefined,
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
                this.validateField(inputStr, field.validation!)
            : undefined,
        });
      }

      if (value !== undefined) {
        answers[field.name] = value;
      }
    }

    return this.processAnswers(answers, config.fields);
  }

  /**
   * Format field message for CLI prompt
   */
  private formatFieldMessage(field: SchemaFieldMetadata): string {
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
  private validateField(
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
  private processAnswers(
    answers: Record<string, FormFieldValue>,
    fields: SchemaFieldMetadata[],
  ): Record<string, FormFieldValue> {
    const processed: Record<string, FormFieldValue> = {};

    for (const field of fields) {
      const value = answers[field.name];

      if (value !== undefined && value !== null && value !== "") {
        processed[field.name] = this.convertFieldValue(value, field);
      } else if (field.required) {
        // This shouldn't happen due to validation, but handle it by returning empty object
        // Since this is internal utility code, we'll let the caller handle validation

        processed[field.name] = undefined;
      }
    }

    return processed;
  }

  /**
   * Convert field value to appropriate type
   */
  private convertFieldValue(
    value: FormFieldValue,
    field: SchemaFieldMetadata,
  ): FormFieldValue {
    // Handle number fields
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

    // Handle boolean fields
    if (field.type === "confirm") {
      return Boolean(value);
    }

    // Handle checkbox (multi-select) fields - returns string[]
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

export const schemaUIHandler = new SchemaUIHandler();

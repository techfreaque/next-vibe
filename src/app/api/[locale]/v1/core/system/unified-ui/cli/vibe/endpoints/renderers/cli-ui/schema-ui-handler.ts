/**
 * Schema-Driven UI Handler
 * Generates CLI interfaces from Zod schemas in endpoint definitions
 * Integrates with existing CLI handler system
 */

import inquirer from "inquirer";
import { z } from "zod";

/**
 * Schema field metadata for CLI rendering
 */
export interface SchemaFieldMetadata {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: any;
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
      const shape = schema.shape;

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        const fieldMeta = this.parseFieldSchema(
          fieldName,
          fieldSchema as z.ZodTypeAny,
        );
        fields.push(fieldMeta);
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
    let baseSchema = schema;
    let required = true;
    let defaultValue: any = undefined;

    // Unwrap optional and default schemas
    if (schema instanceof z.ZodOptional) {
      required = false;
      baseSchema = schema._def.innerType;
    }

    if (schema instanceof z.ZodDefault) {
      defaultValue = schema._def.defaultValue();
      baseSchema = schema._def.innerType;
      required = false; // Default values make fields optional
    }

    // Determine field type and configuration
    const fieldType = this.getFieldType(baseSchema);
    const choices = this.getFieldChoices(baseSchema);

    return {
      name,
      type: fieldType,
      required,
      defaultValue,
      choices,
      validation: schema,
      description: this.getFieldDescription(baseSchema),
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
      return schema.options;
    }

    if (schema instanceof z.ZodEnum) {
      return Object.values(schema.enum);
    }

    return undefined;
  }

  /**
   * Get field description from schema
   */
  private getFieldDescription(schema: z.ZodTypeAny): string | undefined {
    // Try to get description from schema._def.description
    if ("description" in schema._def && schema._def.description) {
      return schema._def.description;
    }

    return undefined;
  }

  /**
   * Generate CLI form from schema
   */
  async generateForm(config: CLIFormConfig): Promise<any> {
    if (config.title) {
      console.log(`\n📋 ${config.title}`);
    }

    if (config.description) {
      console.log(`   ${config.description}\n`);
    }

    if (config.fields.length === 0) {
      console.log("   No input required.\n");
      return {};
    }

    const questions = config.fields.map((field) =>
      this.createInquirerQuestion(field),
    );
    const answers = await inquirer.prompt(questions);

    return this.processAnswers(answers, config.fields);
  }

  /**
   * Create inquirer question from field metadata
   */
  private createInquirerQuestion(field: SchemaFieldMetadata): any {
    const question: any = {
      type: field.type,
      name: field.name,
      message: this.formatFieldMessage(field),
    };

    if (field.defaultValue !== undefined) {
      question.default = field.defaultValue;
    }

    if (field.choices) {
      question.choices = field.choices;
    }

    if (field.validation) {
      question.validate = (input: any) =>
        this.validateField(input, field.validation!);
    }

    // Handle special field types
    if (field.type === "number") {
      question.filter = (input: string) => {
        const num = parseFloat(input);
        return isNaN(num) ? input : num;
      };
    }

    return question;
  }

  /**
   * Format field message for CLI prompt
   */
  private formatFieldMessage(field: SchemaFieldMetadata): string {
    let message = field.name;

    if (field.description) {
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
  private validateField(input: any, schema: z.ZodTypeAny): boolean | string {
    try {
      schema.parse(input);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || "Invalid input";
      }
      return "Validation failed";
    }
  }

  /**
   * Process form answers and convert types
   */
  private processAnswers(answers: any, fields: SchemaFieldMetadata[]): any {
    const processed: any = {};

    for (const field of fields) {
      const value = answers[field.name];

      if (value !== undefined && value !== null && value !== "") {
        processed[field.name] = this.convertFieldValue(value, field);
      } else if (field.required) {
        // This shouldn't happen due to validation, but handle it
        throw new Error(`Required field ${field.name} is missing`);
      }
    }

    return processed;
  }

  /**
   * Convert field value to appropriate type
   */
  private convertFieldValue(value: any, field: SchemaFieldMetadata): any {
    if (field.type === "number") {
      return typeof value === "number" ? value : parseFloat(value);
    }

    if (field.type === "confirm") {
      return Boolean(value);
    }

    return value;
  }
}

export const schemaUIHandler = new SchemaUIHandler();

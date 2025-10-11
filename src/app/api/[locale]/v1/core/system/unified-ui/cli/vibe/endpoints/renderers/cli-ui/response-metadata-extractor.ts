/**
 * Response Metadata Extractor
 * Extracts response field metadata from endpoint definitions for CLI rendering
 */

import { z } from "zod";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { UnifiedField } from "../../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import type {
  ResponseContainerMetadata,
  ResponseFieldMetadata,
} from "./widgets/types";

/**
 * Widget configuration interface
 */
interface WidgetConfig {
  type?: string;
  title?: string;
  description?: string;
  layout?: {
    type: string;
    columns?: number;
  };
  columns?: Array<{
    key: string;
    label: string;
    type: string;
    width?: string;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  format?: string;
  unit?: string;
  precision?: number;
  options?: string[];
  choices?: string[];
}

/**
 * Field definition interface
 */
interface FieldDefinition {
  widget?: WidgetConfig;
  usage?: {
    response?: boolean;
    request?: boolean;
  };
  schema?: z.ZodTypeAny;
}

/**
 * Fields container interface
 */
interface FieldsContainer {
  widget?: WidgetConfig;
  fields?: Record<string, FieldDefinition>;
}

/**
 * Real endpoint structure from createEndpoint
 */
export interface RealEndpointDefinition {
  title?: string;
  description?: string;
  responseSchema?: z.ZodTypeAny;
  fields?: any; // The actual fields object from createEndpoint
  examples?: {
    responses?: Record<string, Record<string, unknown>>;
  };
}

/**
 * Response Metadata Extractor class
 */
export class ResponseMetadataExtractor {
  /**
   * Extract response metadata from endpoint definition
   */
  extractResponseMetadata(
    definition: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    >,
    responseData?: any,
  ): ResponseContainerMetadata | null {
    try {
      // Try to extract from fields definition first
      if (definition.fields) {
        return this.extractFromFieldsDefinition(
          definition.fields,
          responseData,
        );
      }

      // Fallback to schema analysis
      if (definition.responseSchema) {
        return this.extractFromSchema(definition.responseSchema, responseData);
      }

      return null;
    } catch (error) {
      console.warn("Failed to extract response metadata:", error);
      return null;
    }
  }

  /**
   * Extract metadata from fields definition (new endpoint format)
   */
  private extractFromFieldsDefinition(
    fieldsDefinition: any,
    responseData?: any,
  ): ResponseContainerMetadata | null {
    if (!fieldsDefinition || typeof fieldsDefinition !== "object") {
      return null;
    }

    // Handle the real createEndpoint structure
    if (fieldsDefinition.children && fieldsDefinition.ui) {
      return this.extractFromCreateEndpointStructure(
        fieldsDefinition,
        responseData,
      );
    }

    // Legacy: Check if this is a field object with usage and schema
    if (fieldsDefinition.usage && fieldsDefinition.schema) {
      // This is a single field
      const field = this.extractFieldFromDefinition(
        "root",
        fieldsDefinition,
        responseData,
      );
      return {
        type: WidgetType.CONTAINER,
        fields: field ? [field] : [],
      };
    }

    // Check if this has a widget configuration and nested fields
    if (fieldsDefinition.widget || fieldsDefinition.type) {
      return this.extractContainerFromDefinition(
        fieldsDefinition,
        responseData,
      );
    }

    // Check if this is an object with field definitions
    const fields: ResponseFieldMetadata[] = [];
    for (const [fieldName, fieldDef] of Object.entries(fieldsDefinition)) {
      if (typeof fieldDef === "object" && fieldDef !== null) {
        const field = this.extractFieldFromDefinition(
          fieldName,
          fieldDef,
          responseData,
        );
        if (field) {
          fields.push(field);
        }
      }
    }

    return {
      type: WidgetType.CONTAINER,
      fields,
    };
  }

  /**
   * Extract metadata from the real createEndpoint structure
   */
  private extractFromCreateEndpointStructure(
    fieldsDefinition: any,
    responseData?: any,
  ): ResponseContainerMetadata | null {
    const ui = fieldsDefinition.ui;
    const children = fieldsDefinition.children;

    // Get container widget type from ui.type
    const containerType = this.mapUiTypeToWidgetType(ui.type);

    // Extract response fields from children
    const fields: ResponseFieldMetadata[] = [];

    for (const [fieldName, fieldDef] of Object.entries(children)) {
      const field = fieldDef;

      // Only include response fields
      if (field.usage?.response) {
        const responseField = this.extractFieldFromCreateEndpointField(
          fieldName,
          field,
          responseData,
        );
        if (responseField) {
          fields.push(responseField);
        }
      }
    }

    return {
      type: containerType,
      title: ui.title,
      description: ui.description,
      layout: ui.layout,
      fields,
    };
  }

  /**
   * Extract field metadata from createEndpoint field structure
   */
  private extractFieldFromCreateEndpointField(
    fieldName: string,
    field: any,
    responseData?: any,
  ): ResponseFieldMetadata | null {
    const ui = field.ui;
    if (!ui) {
      return null;
    }

    // Handle array fields specially
    if (field.type === "array") {
      // For array fields, the value should be an array from response data
      const value = responseData ? responseData[fieldName] : undefined;

      // Map ui.type to WidgetType and FieldDataType
      const widgetType = this.mapUiTypeToWidgetType(ui.type);
      const fieldType = FieldDataType.TAGS; // Arrays are typically rendered as tags/lists

      const arrayField: ResponseFieldMetadata = {
        name: fieldName,
        type: fieldType,
        widgetType,
        value,
        label: ui.title || ui.label || ui.content,
        description: ui.description,
        required: false,
      };

      // Add grouping properties for grouped lists
      if (widgetType === WidgetType.GROUPED_LIST) {
        arrayField.groupBy = ui.groupBy;
        arrayField.sortBy = ui.sortBy;
        arrayField.showGroupSummary = ui.showGroupSummary;
        arrayField.maxItemsPerGroup = ui.maxItemsPerGroup;
      }

      return arrayField;
    }

    // Handle regular fields
    // Map ui.type to WidgetType and FieldDataType
    const widgetType = this.mapUiTypeToWidgetType(ui.type);
    const fieldType = this.mapUiTypeToFieldDataType(ui.type);

    // Get value from response data
    const value = responseData ? responseData[fieldName] : undefined;

    // Handle data table columns
    let columns;
    if (ui.columns) {
      columns = ui.columns.map((col: any) => ({
        key: col.key,
        label: col.label,
        type: this.mapStringToFieldDataType(col.type),
        width: col.width,
        sortable: col.sortable,
        filterable: col.filterable,
      }));
    }

    return {
      name: fieldName,
      type: fieldType,
      widgetType,
      value,
      label: ui.title || ui.label || ui.content,
      description: ui.description,
      required: false, // TODO: Extract from schema if needed
      columns,
    };
  }

  /**
   * Extract container metadata from definition
   */
  private extractContainerFromDefinition(
    definition: any,
    responseData?: any,
  ): ResponseContainerMetadata {
    const widget = definition.widget || {};
    const type = widget.type || WidgetType.CONTAINER;
    const title = widget.title;
    const description = widget.description;
    const layout = widget.layout;

    // Extract fields from nested structure
    const fields: ResponseFieldMetadata[] = [];
    const children: ResponseContainerMetadata[] = [];

    // Look for fields in the definition
    if (definition.fields) {
      for (const [fieldName, fieldDef] of Object.entries(definition.fields)) {
        if (typeof fieldDef === "object" && fieldDef !== null) {
          const field = this.extractFieldFromDefinition(
            fieldName,
            fieldDef,
            responseData,
          );
          if (field) {
            fields.push(field);
          }
        }
      }
    }

    // Handle special widget types
    if (type === WidgetType.DATA_TABLE) {
      // For data tables, look for array fields and column definitions
      const arrayField = fields.find(
        (field) => responseData && Array.isArray(responseData[field.name]),
      );

      if (arrayField && widget.columns) {
        arrayField.columns = widget.columns.map((col: any) => ({
          key: col.key,
          label: col.label,
          type: this.mapFieldDataType(col.type),
          width: col.width,
          sortable: col.sortable,
          filterable: col.filterable,
        }));
      }
    }

    if (type === WidgetType.GROUPED_LIST) {
      // For grouped lists, look for array fields and transfer grouping properties
      const arrayField = fields.find(
        (field) => responseData && Array.isArray(responseData[field.name]),
      );

      if (arrayField) {
        arrayField.groupBy = widget.groupBy;
        arrayField.sortBy = widget.sortBy;
        arrayField.showGroupSummary = widget.showGroupSummary;
        arrayField.maxItemsPerGroup = widget.maxItemsPerGroup;
      }
    }

    return {
      type,
      title,
      description,
      layout,
      fields,
      children,
    };
  }

  /**
   * Extract field metadata from definition
   */
  private extractFieldFromDefinition(
    fieldName: string,
    definition: any,
    responseData?: any,
  ): ResponseFieldMetadata | null {
    if (!definition) {
      return null;
    }

    // Check if this field is used in response
    const usage = definition.usage;
    if (usage && !usage.response) {
      return null; // This field is not part of the response
    }

    const widget = definition.widget || {};
    const schema = definition.schema;

    // Determine field type
    const fieldType = this.determineFieldType(widget, schema);
    const widgetType = widget.type || WidgetType.TEXT;

    // Get value from response data
    const value = responseData ? responseData[fieldName] : undefined;

    return {
      name: fieldName,
      type: fieldType,
      widgetType,
      value,
      label: widget.title || widget.label,
      description: widget.description,
      required: this.isFieldRequired(schema),
      schema,
      format: widget.format,
      unit: widget.unit,
      precision: widget.precision,
      choices: widget.options || widget.choices,
      columns: widget.columns,
    };
  }

  /**
   * Extract metadata from Zod schema (fallback)
   */
  private extractFromSchema(
    schema: z.ZodTypeAny,
    responseData?: any,
  ): ResponseContainerMetadata | null {
    const fields = this.extractFieldsFromSchema(schema, responseData);

    return {
      type: WidgetType.CONTAINER,
      fields,
    };
  }

  /**
   * Extract fields from Zod schema
   */
  private extractFieldsFromSchema(
    schema: z.ZodTypeAny,
    responseData?: any,
    prefix = "",
  ): ResponseFieldMetadata[] {
    const fields: ResponseFieldMetadata[] = [];

    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        const field = this.extractFieldFromSchema(
          fieldName,
          fieldSchema as z.ZodTypeAny,
          responseData,
        );
        if (field) {
          fields.push(field);
        }
      }
    }

    return fields;
  }

  /**
   * Extract single field from Zod schema
   */
  private extractFieldFromSchema(
    fieldName: string,
    schema: z.ZodTypeAny,
    responseData?: any,
  ): ResponseFieldMetadata | null {
    const fieldType = this.mapZodTypeToFieldType(schema);
    const value = responseData ? responseData[fieldName] : undefined;

    return {
      name: fieldName,
      type: fieldType,
      widgetType: WidgetType.TEXT,
      value,
      required: this.isFieldRequired(schema),
      schema,
    };
  }

  /**
   * Determine field type from widget and schema
   */
  private determineFieldType(
    widget: any,
    schema?: z.ZodTypeAny,
  ): FieldDataType {
    // Check widget fieldType first
    if (widget.fieldType) {
      return this.mapFieldDataType(widget.fieldType);
    }

    // Check widget type
    if (widget.type) {
      return this.mapWidgetTypeToFieldType(widget.type);
    }

    // Fallback to schema analysis
    if (schema) {
      return this.mapZodTypeToFieldType(schema);
    }

    return FieldDataType.TEXT;
  }

  /**
   * Map field data type string to enum
   */
  private mapFieldDataType(type: string): FieldDataType {
    return FieldDataType[type.toUpperCase()] || FieldDataType.TEXT;
  }

  /**
   * Map widget type to field data type
   */
  private mapWidgetTypeToFieldType(widgetType: string): FieldDataType {
    const mapping: Record<string, FieldDataType> = {
      [WidgetType.BADGE]: FieldDataType.BADGE,
      [WidgetType.TEXT]: FieldDataType.TEXT,
      [WidgetType.PROGRESS]: FieldDataType.PROGRESS,
      [WidgetType.METRIC_CARD]: FieldDataType.NUMBER,
    };

    return mapping[widgetType] || FieldDataType.TEXT;
  }

  /**
   * Map Zod type to field data type
   */
  private mapZodTypeToFieldType(schema: z.ZodTypeAny): FieldDataType {
    // Unwrap optional and default schemas
    let baseSchema = schema;
    if (schema instanceof z.ZodOptional) {
      baseSchema = schema._def.innerType;
    }
    if (schema instanceof z.ZodDefault) {
      baseSchema = schema._def.innerType;
    }

    if (baseSchema instanceof z.ZodString) {
      return FieldDataType.TEXT;
    }
    if (baseSchema instanceof z.ZodNumber) {
      return FieldDataType.NUMBER;
    }
    if (baseSchema instanceof z.ZodBoolean) {
      return FieldDataType.BOOLEAN;
    }
    if (baseSchema instanceof z.ZodDate) {
      return FieldDataType.DATE;
    }
    if (baseSchema instanceof z.ZodEnum || baseSchema instanceof z.ZodEnum) {
      return FieldDataType.SELECT;
    }
    if (baseSchema instanceof z.ZodArray) {
      return FieldDataType.TAGS;
    }

    return FieldDataType.TEXT;
  }

  /**
   * Check if field is required
   */
  private isFieldRequired(schema?: z.ZodTypeAny): boolean {
    if (!schema) {
      return false;
    }

    return (
      !(schema instanceof z.ZodOptional) && !(schema instanceof z.ZodDefault)
    );
  }

  /**
   * Map UI type string to WidgetType enum
   */
  private mapUiTypeToWidgetType(uiType: string): WidgetType {
    const mapping: Record<string, WidgetType> = {
      container: WidgetType.CONTAINER,
      data_table: WidgetType.DATA_TABLE,
      data_cards: WidgetType.DATA_CARDS,
      grouped_list: WidgetType.GROUPED_LIST,
      text: WidgetType.TEXT,
      badge: WidgetType.BADGE,
      metric_card: WidgetType.METRIC_CARD,
      stats_grid: WidgetType.STATS_GRID,
      section: WidgetType.SECTION,
      progress: WidgetType.PROGRESS,
    };

    return mapping[uiType] || WidgetType.TEXT;
  }

  /**
   * Map UI type string to FieldDataType enum
   */
  private mapUiTypeToFieldDataType(uiType: string): FieldDataType {
    const mapping: Record<string, FieldDataType> = {
      text: FieldDataType.TEXT,
      data_table: FieldDataType.TAGS, // Use TAGS for arrays to trigger table rendering
      badge: FieldDataType.BADGE,
      progress: FieldDataType.PROGRESS,
      metric_card: FieldDataType.NUMBER,
    };

    return mapping[uiType] || FieldDataType.TEXT;
  }

  /**
   * Map string type to FieldDataType enum
   */
  private mapStringToFieldDataType(type: string): FieldDataType {
    const mapping: Record<string, FieldDataType> = {
      text: FieldDataType.TEXT,
      number: FieldDataType.NUMBER,
      boolean: FieldDataType.BOOLEAN,
      date: FieldDataType.DATE,
      email: FieldDataType.EMAIL,
      url: FieldDataType.URL,
      badge: FieldDataType.BADGE,
      status: FieldDataType.STATUS,
      progress: FieldDataType.PROGRESS,
      currency: FieldDataType.CURRENCY,
      percentage: FieldDataType.PERCENTAGE,
      tags: FieldDataType.TAGS,
    };

    return mapping[type.toLowerCase()] || FieldDataType.TEXT;
  }
}

export const responseMetadataExtractor = new ResponseMetadataExtractor();

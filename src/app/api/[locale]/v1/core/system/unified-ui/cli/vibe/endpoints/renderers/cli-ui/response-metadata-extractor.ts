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
import type { UserRoleDB } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  ExtractOutput,
  FieldUsageConfig,
  ObjectField,
  UnifiedField,
} from "../../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import type { WidgetConfig } from "../../endpoint-types/types";
import type {
  RenderableValue,
  ResponseContainerMetadata,
  ResponseFieldMetadata,
} from "./widgets/types";

/**
 * Convert unknown/any Zod output to RenderableValue safely
 */
function toRenderableValue(
  value: ExtractOutput<z.ZodTypeAny>,
): RenderableValue {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toRenderableValue(item));
  }
  if (typeof value === "object") {
    const result: { [key: string]: RenderableValue } = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = toRenderableValue(val);
    }
    return result;
  }
  return undefined;
}

/**
 * Type guard to check if value is a record with string keys
 * Properly typed to infer record structure
 */
function isRecord(
  value: ExtractOutput<z.ZodTypeAny>,
): value is Record<string, ExtractOutput<z.ZodTypeAny>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if an object has a response property that is true
 */
function hasResponseTrue(value: ExtractOutput<z.ZodTypeAny>): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("response" in value)) {
    return false;
  }
  if (!isRecord(value)) {
    return false;
  }
  const responseValue = value.response;
  return responseValue === true;
}

/**
 * Type guard to check if a field is an ObjectField with children
 */
function isObjectField<TSchema extends z.ZodTypeAny>(
  field: UnifiedField<TSchema>,
): field is ObjectField<
  Record<string, UnifiedField<z.ZodTypeAny>>,
  FieldUsageConfig
> {
  return (
    typeof field === "object" &&
    field !== null &&
    "type" in field &&
    field.type === "object" &&
    "children" in field &&
    typeof field.children === "object"
  );
}

/**
 * Response Metadata Extractor class
 */
export class ResponseMetadataExtractor {
  /**
   * Extract response metadata from endpoint definition
   */
  extractResponseMetadata<
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleDB)[number][],
      UnifiedField<z.ZodTypeAny>
    >,
  >(
    definition: TEndpoint,
    responseData?: ExtractOutput<TEndpoint["responseSchema"]>,
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
    } catch {
      // Silent failure - return null if extraction fails
      return null;
    }
  }

  /**
   * Extract metadata from fields definition (new endpoint format)
   */
  private extractFromFieldsDefinition(
    fieldsDefinition: UnifiedField<z.ZodTypeAny>,
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseContainerMetadata | null {
    if (!fieldsDefinition || typeof fieldsDefinition !== "object") {
      return null;
    }

    // Handle the real createEndpoint structure
    if ("children" in fieldsDefinition && "ui" in fieldsDefinition) {
      // Type narrowing: if it has children and ui, it's an ObjectField
      if (isObjectField(fieldsDefinition)) {
        return this.extractFromCreateEndpointStructure(
          fieldsDefinition,
          responseData,
        );
      }
    }

    // Legacy: Check if this is a field object with usage and schema
    if ("usage" in fieldsDefinition && "schema" in fieldsDefinition) {
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

    // Handle ObjectField with children
    if (isObjectField(fieldsDefinition)) {
      return this.extractContainerFromDefinition(
        fieldsDefinition,
        responseData,
      );
    }

    return null;
  }

  /**
   * Extract metadata from the real createEndpoint structure
   */
  private extractFromCreateEndpointStructure<
    TChildren extends Record<string, UnifiedField<z.ZodTypeAny>>,
  >(
    fieldsDefinition: ObjectField<TChildren, FieldUsageConfig>,
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseContainerMetadata | null {
    const ui = fieldsDefinition.ui;
    const children = fieldsDefinition.children;

    // Get container widget type from ui.type
    const containerType = this.mapUiTypeToWidgetType(
      typeof ui.type === "string" ? ui.type : "container",
    );

    // Extract response fields from children
    const fields: ResponseFieldMetadata[] = [];

    for (const [fieldName, fieldDef] of Object.entries(children)) {
      // Only include response fields
      if ("usage" in fieldDef) {
        const usage = fieldDef.usage;
        let hasResponse = false;
        if (typeof usage === "object" && usage !== null) {
          if ("response" in usage) {
            hasResponse = usage.response === true;
          } else {
            // Check each method's usage for response field
            const usageValues = Object.values(usage);
            hasResponse = usageValues.some((methodUsage) =>
              hasResponseTrue(methodUsage),
            );
          }
        }

        if (hasResponse) {
          const responseField = this.extractFieldFromCreateEndpointField(
            fieldName,
            fieldDef,
            responseData,
          );
          if (responseField) {
            fields.push(responseField);
          }
        }
      }
    }

    const title =
      "title" in ui && typeof ui.title === "string" ? ui.title : undefined;
    const description =
      "description" in ui && typeof ui.description === "string"
        ? ui.description
        : undefined;
    const layout =
      "layout" in ui && typeof ui.layout === "object" ? ui.layout : undefined;

    return {
      type: containerType,
      title,
      description,
      layout,
      fields,
    };
  }

  /**
   * Extract field metadata from createEndpoint field structure
   */
  private extractFieldFromCreateEndpointField(
    fieldName: string,
    field: UnifiedField<z.ZodTypeAny>,
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseFieldMetadata | null {
    const ui = field.ui;
    if (!ui || typeof ui !== "object") {
      return null;
    }

    // Handle array fields specially
    if (field.type === "array") {
      // For array fields, the value should be an array from response data
      let value: ExtractOutput<z.ZodTypeAny> = undefined;
      if (isRecord(responseData) && fieldName in responseData) {
        value = responseData[fieldName];
      }

      // Map ui.type to WidgetType and FieldDataType
      const uiType =
        "type" in ui && typeof ui.type === "string" ? ui.type : "text";
      const widgetType = this.mapUiTypeToWidgetType(uiType);
      const fieldType = FieldDataType.TAGS; // Arrays are typically rendered as tags/lists

      const label =
        "title" in ui && typeof ui.title === "string"
          ? ui.title
          : "label" in ui && typeof ui.label === "string"
            ? ui.label
            : "content" in ui && typeof ui.content === "string"
              ? ui.content
              : undefined;
      const description =
        "description" in ui && typeof ui.description === "string"
          ? ui.description
          : undefined;

      const arrayField: ResponseFieldMetadata = {
        name: fieldName,
        type: fieldType,
        widgetType,
        value: toRenderableValue(value),
        label,
        description,
        required: false,
      };

      // Add grouping properties for grouped lists
      if (widgetType === WidgetType.GROUPED_LIST) {
        if ("groupBy" in ui && typeof ui.groupBy === "string") {
          arrayField.groupBy = ui.groupBy;
        }
        if ("sortBy" in ui && typeof ui.sortBy === "string") {
          arrayField.sortBy = ui.sortBy;
        }
        if (
          "showGroupSummary" in ui &&
          typeof ui.showGroupSummary === "boolean"
        ) {
          arrayField.showGroupSummary = ui.showGroupSummary;
        }
        if (
          "maxItemsPerGroup" in ui &&
          typeof ui.maxItemsPerGroup === "number"
        ) {
          arrayField.maxItemsPerGroup = ui.maxItemsPerGroup;
        }
      }

      return arrayField;
    }

    // Handle regular fields
    // Map ui.type to WidgetType and FieldDataType
    const regularUiType =
      "type" in ui && typeof ui.type === "string" ? ui.type : "text";
    const widgetType = this.mapUiTypeToWidgetType(regularUiType);
    const fieldType = this.mapUiTypeToFieldDataType(regularUiType);

    // Get value from response data
    let regularValue: ExtractOutput<z.ZodTypeAny> = undefined;
    if (isRecord(responseData) && fieldName in responseData) {
      regularValue = responseData[fieldName];
    }

    // Handle data table columns
    let columns: ResponseFieldMetadata["columns"] | undefined;
    if ("columns" in ui && Array.isArray(ui.columns)) {
      interface ColumnType {
        key: string;
        label: string;
        type: string;
        width?: string;
        sortable?: boolean;
        filterable?: boolean;
      }

      const filteredColumns: ColumnType[] = [];
      for (const col of ui.columns) {
        if (
          typeof col === "object" &&
          col !== null &&
          "key" in col &&
          typeof col.key === "string" &&
          "label" in col &&
          typeof col.label === "string" &&
          "type" in col &&
          typeof col.type === "string"
        ) {
          filteredColumns.push({
            key: col.key,
            label: col.label,
            type: col.type,
            width:
              "width" in col && typeof col.width === "string"
                ? col.width
                : undefined,
            sortable:
              "sortable" in col && typeof col.sortable === "boolean"
                ? col.sortable
                : undefined,
            filterable:
              "filterable" in col && typeof col.filterable === "boolean"
                ? col.filterable
                : undefined,
          });
        }
      }

      columns = filteredColumns.map((col) => ({
        key: col.key,
        label: col.label,
        type: this.mapStringToFieldDataType(col.type),
        width: typeof col.width === "string" ? col.width : undefined,
        sortable: typeof col.sortable === "boolean" ? col.sortable : undefined,
        filterable:
          typeof col.filterable === "boolean" ? col.filterable : undefined,
      }));
    }

    const regularLabel =
      "title" in ui && typeof ui.title === "string"
        ? ui.title
        : "label" in ui && typeof ui.label === "string"
          ? ui.label
          : "content" in ui && typeof ui.content === "string"
            ? ui.content
            : undefined;
    const regularDescription =
      "description" in ui && typeof ui.description === "string"
        ? ui.description
        : undefined;

    return {
      name: fieldName,
      type: fieldType,
      widgetType,
      value: toRenderableValue(regularValue),
      label: regularLabel,
      description: regularDescription,
      required: false,
      columns,
    };
  }

  /**
   * Extract container metadata from definition (legacy support)
   */
  private extractContainerFromDefinition(
    definition: ObjectField<
      Record<string, UnifiedField<z.ZodTypeAny>>,
      FieldUsageConfig
    >,
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseContainerMetadata {
    // Extract UI config if present
    const hasUi = "ui" in definition && typeof definition.ui === "object";
    const ui = hasUi ? definition.ui : null;

    // Extract type from UI config
    const typeValue =
      ui && "type" in ui && typeof ui.type === "string" ? ui.type : undefined;
    const type = typeValue
      ? this.mapUiTypeToWidgetType(typeValue)
      : WidgetType.CONTAINER;

    // Extract other properties from UI config
    const title =
      ui && "title" in ui && typeof ui.title === "string"
        ? ui.title
        : undefined;
    const description =
      ui && "description" in ui && typeof ui.description === "string"
        ? ui.description
        : undefined;
    const layout =
      ui &&
      "layout" in ui &&
      typeof ui.layout === "object" &&
      ui.layout !== null &&
      ("columns" in ui.layout || "spacing" in ui.layout)
        ? (ui.layout as { columns?: number; spacing?: string } | undefined)
        : undefined;

    // Extract fields from nested structure
    const fields: ResponseFieldMetadata[] = [];

    // Look for fields in ObjectField children
    if (isObjectField(definition)) {
      // Type narrowing: isObjectField type guard narrows to ObjectField
      for (const [fieldName, fieldDef] of Object.entries(definition.children)) {
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

    // Handle special widget types
    if (type === WidgetType.DATA_TABLE) {
      // For data tables, look for array fields and column definitions
      const arrayField = fields.find((field) => {
        if (!isRecord(responseData)) {
          return false;
        }
        if (!(field.name in responseData)) {
          return false;
        }
        const value = responseData[field.name];
        return Array.isArray(value);
      });

      if (arrayField && ui && "columns" in ui && Array.isArray(ui.columns)) {
        interface ColumnType {
          key: string;
          label: string;
          type: string;
          width?: string;
          sortable?: boolean;
          filterable?: boolean;
        }

        const filteredColumns: ColumnType[] = [];
        for (const col of ui.columns) {
          if (
            typeof col === "object" &&
            col !== null &&
            "key" in col &&
            typeof col.key === "string" &&
            "label" in col &&
            typeof col.label === "string" &&
            "type" in col &&
            typeof col.type === "string"
          ) {
            filteredColumns.push({
              key: col.key,
              label: col.label,
              type: col.type,
              width:
                "width" in col && typeof col.width === "string"
                  ? col.width
                  : undefined,
              sortable:
                "sortable" in col && typeof col.sortable === "boolean"
                  ? col.sortable
                  : undefined,
              filterable:
                "filterable" in col && typeof col.filterable === "boolean"
                  ? col.filterable
                  : undefined,
            });
          }
        }

        arrayField.columns = filteredColumns.map((col) => ({
          key: col.key,
          label: col.label,
          type: this.mapStringToFieldDataType(col.type),
          width: typeof col.width === "string" ? col.width : undefined,
          sortable:
            typeof col.sortable === "boolean" ? col.sortable : undefined,
          filterable:
            typeof col.filterable === "boolean" ? col.filterable : undefined,
        }));
      }
    }

    if (type === WidgetType.GROUPED_LIST) {
      // For grouped lists, look for array fields and transfer grouping properties
      const arrayField = fields.find((field) => {
        if (!isRecord(responseData)) {
          return false;
        }
        if (!(field.name in responseData)) {
          return false;
        }
        const value = responseData[field.name];
        return Array.isArray(value);
      });

      if (arrayField && ui) {
        if ("groupBy" in ui && typeof ui.groupBy === "string") {
          arrayField.groupBy = ui.groupBy;
        }
        if ("sortBy" in ui && typeof ui.sortBy === "string") {
          arrayField.sortBy = ui.sortBy;
        }
        if (
          "showGroupSummary" in ui &&
          typeof ui.showGroupSummary === "boolean"
        ) {
          arrayField.showGroupSummary = ui.showGroupSummary;
        }
        if (
          "maxItemsPerGroup" in ui &&
          typeof ui.maxItemsPerGroup === "number"
        ) {
          arrayField.maxItemsPerGroup = ui.maxItemsPerGroup;
        }
      }
    }

    return {
      type,
      title,
      description,
      layout,
      fields,
    };
  }

  /**
   * Extract field metadata from definition
   */
  private extractFieldFromDefinition(
    fieldName: string,
    definition: UnifiedField<z.ZodTypeAny>,
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseFieldMetadata | null {
    if (!definition) {
      return null;
    }

    // Check if this field is used in response
    if ("usage" in definition) {
      const usage = definition.usage;
      let hasResponse = false;
      if (typeof usage === "object" && usage !== null) {
        if ("response" in usage) {
          hasResponse = usage.response === true;
        } else {
          // Check each method's usage for response field
          const usageValues = Object.values(usage);
          hasResponse = usageValues.some((methodUsage) =>
            hasResponseTrue(methodUsage),
          );
        }
      }

      if (!hasResponse) {
        return null; // This field is not part of the response
      }
    }

    // Extract UI configuration with proper typing
    const hasUi = "ui" in definition && typeof definition.ui === "object";
    const ui = hasUi ? definition.ui : null;

    const schema =
      "schema" in definition && definition.schema instanceof z.ZodType
        ? definition.schema
        : undefined;

    // Determine field type - pass ui (can be null)
    const fieldType = this.determineFieldType(ui, schema);

    // Extract widget type from ui
    const widgetType =
      ui && "type" in ui && typeof ui.type === "string"
        ? this.mapUiTypeToWidgetType(ui.type)
        : WidgetType.TEXT;

    // Get value from response data
    let value: ExtractOutput<z.ZodTypeAny> = undefined;
    if (isRecord(responseData) && fieldName in responseData) {
      value = responseData[fieldName];
    }

    // Extract label from ui
    const label =
      ui && "title" in ui && typeof ui.title === "string"
        ? ui.title
        : ui && "label" in ui && typeof ui.label === "string"
          ? ui.label
          : undefined;

    // Extract description from ui
    const description =
      ui && "description" in ui && typeof ui.description === "string"
        ? ui.description
        : undefined;

    // Extract format from ui
    const format =
      ui && "format" in ui && typeof ui.format === "string"
        ? ui.format
        : undefined;

    // Extract unit from ui
    const unit =
      ui && "unit" in ui && typeof ui.unit === "string" ? ui.unit : undefined;

    // Extract precision from ui
    const precision =
      ui && "precision" in ui && typeof ui.precision === "number"
        ? ui.precision
        : undefined;

    // Extract choices from ui
    const choices =
      ui && "options" in ui && Array.isArray(ui.options)
        ? ui.options
        : ui && "choices" in ui && Array.isArray(ui.choices)
          ? ui.choices
          : undefined;

    // Extract columns from ui - not mapping here as this is legacy path
    // Proper column mapping is done in extractFromCreateEndpointStructure
    const columns = undefined;

    return {
      name: fieldName,
      type: fieldType,
      widgetType,
      value: toRenderableValue(value),
      label,
      description,
      required: this.isFieldRequired(schema),
      schema,
      format,
      unit,
      precision,
      choices,
      columns,
    };
  }

  /**
   * Extract metadata from Zod schema (fallback)
   */
  private extractFromSchema(
    schema: z.ZodTypeAny,
    responseData?: ExtractOutput<z.ZodTypeAny>,
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
    responseData?: ExtractOutput<z.ZodTypeAny>,
    prefix = "",
  ): ResponseFieldMetadata[] {
    const fields: ResponseFieldMetadata[] = [];

    if (schema instanceof z.ZodObject) {
      const shape = schema.shape as Record<string, z.ZodTypeAny>;

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        const field = this.extractFieldFromSchema(
          fieldName,
          fieldSchema,
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
    responseData?: ExtractOutput<z.ZodTypeAny>,
  ): ResponseFieldMetadata | null {
    const fieldType = this.mapZodTypeToFieldType(schema);

    let value: ExtractOutput<z.ZodTypeAny> = undefined;
    if (isRecord(responseData) && fieldName in responseData) {
      value = responseData[fieldName];
    }

    return {
      name: fieldName,
      type: fieldType,
      widgetType: WidgetType.TEXT,
      value: toRenderableValue(value),
      required: this.isFieldRequired(schema),
      schema,
    };
  }

  /**
   * Determine field type from widget and schema
   */
  private determineFieldType(
    widget: WidgetConfig | null,
    schema?: z.ZodTypeAny,
  ): FieldDataType {
    // Check widget fieldType first
    if (
      widget &&
      "fieldType" in widget &&
      typeof widget.fieldType === "string"
    ) {
      return this.mapFieldDataType(widget.fieldType);
    }

    // Check widget type
    if (widget && "type" in widget && typeof widget.type === "string") {
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
    const upperType = type.toUpperCase() as keyof typeof FieldDataType;
    return upperType in FieldDataType
      ? FieldDataType[upperType]
      : FieldDataType.TEXT;
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
    // Check if optional/default and unwrap
    if (schema instanceof z.ZodOptional) {
      const innerType = schema._def.innerType;
      if (innerType instanceof z.ZodString) {
        return FieldDataType.TEXT;
      }
      if (innerType instanceof z.ZodNumber) {
        return FieldDataType.NUMBER;
      }
      if (innerType instanceof z.ZodBoolean) {
        return FieldDataType.BOOLEAN;
      }
      if (innerType instanceof z.ZodDate) {
        return FieldDataType.DATE;
      }
      if (innerType instanceof z.ZodEnum) {
        return FieldDataType.SELECT;
      }
      if (innerType instanceof z.ZodArray) {
        return FieldDataType.TAGS;
      }
      return FieldDataType.TEXT;
    }

    if (schema instanceof z.ZodDefault) {
      const innerType = schema._def.innerType;
      if (innerType instanceof z.ZodString) {
        return FieldDataType.TEXT;
      }
      if (innerType instanceof z.ZodNumber) {
        return FieldDataType.NUMBER;
      }
      if (innerType instanceof z.ZodBoolean) {
        return FieldDataType.BOOLEAN;
      }
      if (innerType instanceof z.ZodDate) {
        return FieldDataType.DATE;
      }
      if (innerType instanceof z.ZodEnum) {
        return FieldDataType.SELECT;
      }
      if (innerType instanceof z.ZodArray) {
        return FieldDataType.TAGS;
      }
      return FieldDataType.TEXT;
    }

    // Direct type checks
    if (schema instanceof z.ZodString) {
      return FieldDataType.TEXT;
    }
    if (schema instanceof z.ZodNumber) {
      return FieldDataType.NUMBER;
    }
    if (schema instanceof z.ZodBoolean) {
      return FieldDataType.BOOLEAN;
    }
    if (schema instanceof z.ZodDate) {
      return FieldDataType.DATE;
    }
    if (schema instanceof z.ZodEnum) {
      return FieldDataType.SELECT;
    }
    if (schema instanceof z.ZodArray) {
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

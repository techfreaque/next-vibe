/**
 * TRPC Integration Validation Definition
 * API endpoint definition for TRPC integration validation operations
 * Following migration guide: Repository-only logic with proper definition structure
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import {
  TRPCValidationOperationType,
  TRPCValidationOperationTypeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * TRPC Integration Validation Endpoint Definition
 */
export const { POST } = createEndpoint({
  scopedTranslation,
  title: "title",
  description: "description",
  category: "endpointCategories.devTools",
  subCategory: "endpointCategories.devToolsGenerators",
  tags: ["tags.trpc", "tags.validation"],
  icon: "code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["trpc-validate", "validate-trpc"],
  method: Methods.POST,
  path: ["system", "generators", "generate-trpc-router", "validation"],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 1,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST ===
      operations: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.operation.label",
        description: "fields.operation.description",
        placeholder: "fields.operation.placeholder",
        options: TRPCValidationOperationTypeOptions,
        columns: 12,
        schema: z
          .array(z.string())
          .min(1)
          .describe("TRPC validation operations to execute"),
      }),
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.filePath.label",
        description: "fields.filePath.description",
        placeholder: "fields.filePath.placeholder",
        columns: 12,
        schema: z
          .string()
          .optional()
          .describe("Specific route file path to validate"),
      }),
      options: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "fields.options.label",
        description: "fields.options.description",
        placeholder: "fields.options.placeholder",
        columns: 12,
        schema: z
          .object({
            apiDir: z
              .string()
              .optional()
              .describe("API directory path to validate"),
            fix: z
              .boolean()
              .optional()
              .describe("Automatically fix issues where possible"),
            verbose: z.boolean().optional().describe("Enable verbose output"),
            generateReport: z
              .boolean()
              .optional()
              .describe("Generate detailed validation report"),
          })
          .optional(),
      }),
      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success.label",
        schema: z
          .boolean()
          .describe("Whether the TRPC validation was successful"),
      }),
      operation: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.operation.label",
        schema: z
          .string()
          .describe("The validation operation that was executed"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.result.label",
        schema: z
          .object({
            success: z.boolean(),
            errors: z.array(z.string()),
            warnings: z.array(z.string()),
            routeFiles: z
              .array(
                z.object({
                  filePath: z.string(),
                  hasDefinition: z.boolean(),
                  hasEnhancedHandler: z.boolean(),
                  hasTRPCExport: z.boolean(),
                  hasNextExport: z.boolean(),
                  errors: z.array(z.string()),
                  warnings: z.array(z.string()),
                }),
              )
              .optional(),
            report: z.string().optional(),
            totalFiles: z.coerce.number().optional(),
            validFiles: z.coerce.number().optional(),
            filesWithIssues: z.coerce.number().optional(),
          })
          .describe("Detailed TRPC validation result"),
      }),
    },
  }),
  examples: {
    requests: {
      validateAll: {
        operations: [TRPCValidationOperationType.VALIDATE_INTEGRATION],
        filePath: undefined,
        options: {
          apiDir: "src/app/api",
          verbose: true,
        },
      },
    },
    responses: {
      validateAll: {
        success: true,
        operation: TRPCValidationOperationType.VALIDATE_INTEGRATION,
        result: {
          success: true,
          errors: [],
          warnings: [],
          totalFiles: 10,
          validFiles: 10,
          filesWithIssues: 0,
        },
      },
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
  },
});

/**
 * Export types for repository to use - derived from endpoint definition
 */
export type TRPCValidationRequestInput = typeof POST.types.RequestInput;
export type TRPCValidationRequestOutput = typeof POST.types.RequestOutput;
export type TRPCValidationResponseInput = typeof POST.types.ResponseInput;
export type TRPCValidationResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

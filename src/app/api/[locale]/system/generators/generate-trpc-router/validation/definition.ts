/**
 * TRPC Integration Validation Definition
 * API endpoint definition for TRPC integration validation operations
 * Following migration guide: Repository-only logic with proper definition structure
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import {
  objectField,
  requestDataField,
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

/**
 * TRPC Validation Operation Types
 */
export const {
  enum: TRPCValidationOperationType,
  options: TRPCValidationOperationTypeOptions,
} = createEnumOptions({
  VALIDATE_INTEGRATION:
    "app.api.system.generators.generateTrpcRouter.validation.operations.validateIntegration",
  VALIDATE_ROUTE_FILE:
    "app.api.system.generators.generateTrpcRouter.validation.operations.validateRouteFile",
  GENERATE_REPORT:
    "app.api.system.generators.generateTrpcRouter.validation.operations.generateReport",
  FIX_ROUTES:
    "app.api.system.generators.generateTrpcRouter.validation.operations.fixRoutes",
  CHECK_ROUTER_EXISTS:
    "app.api.system.generators.generateTrpcRouter.validation.operations.checkRouterExists",
});

/**
 * Validation Severity Types
 */
export const { enum: ValidationSeverity, options: ValidationSeverityOptions } =
  createEnumOptions({
    ERROR:
      "app.api.system.generators.generateTrpcRouter.validation.severity.error",
    WARNING:
      "app.api.system.generators.generateTrpcRouter.validation.severity.warning",
    INFO: "app.api.system.generators.generateTrpcRouter.validation.severity.info",
  });

/**
 * TRPC Integration Validation Endpoint Definition
 */
export const { POST } = createEndpoint({
  title: "app.api.system.generators.generateTrpcRouter.validation.title",
  description:
    "app.api.system.generators.generateTrpcRouter.validation.description",
  category: "app.api.system.generators.generateTrpcRouter.validation.category",
  tags: [
    "app.api.system.generators.generateTrpcRouter.validation.tags.trpc",
    "app.api.system.generators.generateTrpcRouter.validation.tags.validation",
  ],
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
  fields: objectField(
    {
      type: WidgetType.FORM_GROUP,
      layoutType: LayoutType.GRID,
      columns: 1,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      operations: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.system.generators.generateTrpcRouter.validation.fields.operation.label",
          description:
            "app.api.system.generators.generateTrpcRouter.validation.fields.operation.description",
          placeholder:
            "app.api.system.generators.generateTrpcRouter.validation.fields.operation.placeholder",
          options: TRPCValidationOperationTypeOptions,
          columns: 12,
        },
        z
          .array(z.string())
          .min(1)
          .describe("TRPC validation operations to execute"),
      ),
      filePath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.system.generators.generateTrpcRouter.validation.fields.filePath.label",
          description:
            "app.api.system.generators.generateTrpcRouter.validation.fields.filePath.description",
          placeholder:
            "app.api.system.generators.generateTrpcRouter.validation.fields.filePath.placeholder",
          columns: 12,
        },
        z.string().optional().describe("Specific route file path to validate"),
      ),
      options: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.system.generators.generateTrpcRouter.validation.fields.options.label",
          description:
            "app.api.system.generators.generateTrpcRouter.validation.fields.options.description",
          placeholder:
            "app.api.system.generators.generateTrpcRouter.validation.fields.options.placeholder",
          columns: 12,
        },
        z
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
      ),
      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.generateTrpcRouter.validation.response.success.label",
        },
        z.boolean().describe("Whether the TRPC validation was successful"),
      ),
      operation: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.generateTrpcRouter.validation.response.operation.label",
        },
        z.string().describe("The validation operation that was executed"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.generateTrpcRouter.validation.response.result.label",
        },
        z
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
      ),
    },
  ),
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
    title:
      "app.api.system.generators.generateTrpcRouter.validation.success.title",
    description:
      "app.api.system.generators.generateTrpcRouter.validation.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.validation.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unauthorized.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.forbidden.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.notFound.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.server.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unknown.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unsavedChanges.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.conflict.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.generators.generateTrpcRouter.validation.errors.network.title",
      description:
        "app.api.system.generators.generateTrpcRouter.validation.errors.network.description",
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

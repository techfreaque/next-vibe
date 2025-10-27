/**
 * TRPC Integration Validation Definition
 * API endpoint definition for TRPC integration validation operations
 * Following migration guide: Repository-only logic with proper definition structure
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

import { UserRole } from "../../../../user/user-roles/enum";

/**
 * TRPC Validation Operation Types
 */
export const {
  enum: TRPCValidationOperationType,
  options: TRPCValidationOperationTypeOptions,
} = createEnumOptions({
  VALIDATE_INTEGRATION:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.operations.validateIntegration",
  VALIDATE_ROUTE_FILE:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.operations.validateRouteFile",
  GENERATE_REPORT:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.operations.generateReport",
  FIX_ROUTES:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.operations.fixRoutes",
  CHECK_ROUTER_EXISTS:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.operations.checkRouterExists",
});

/**
 * Validation Severity Types
 */
export const { enum: ValidationSeverity, options: ValidationSeverityOptions } =
  createEnumOptions({
    ERROR:
      "app.api.v1.core.system.generators.generateTrpcRouter.validation.severity.error",
    WARNING:
      "app.api.v1.core.system.generators.generateTrpcRouter.validation.severity.warning",
    INFO: "app.api.v1.core.system.generators.generateTrpcRouter.validation.severity.info",
  });

/**
 * TRPC Integration Validation Endpoint Definition
 */
export const { POST } = createEndpoint({
  title:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.title",
  description:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.description",
  category:
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.category",
  tags: [
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.tags.trpc",
    "app.api.v1.core.system.generators.generateTrpcRouter.validation.tags.validation",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["trpc-validate", "validate-trpc"],
  method: Methods.POST,
  path: [
    "v1",
    "core",
    "system",
    "generators",
    "generate-trpc-router",
    "validation",
  ],
  examples: {
    requests: {
      validateIntegration: {
        operation: TRPCValidationOperationType.VALIDATE_INTEGRATION,
        options: {
          apiDir: "src/app/api",
          fix: false,
          verbose: true,
        },
      },
      validateRouteFile: {
        operation: TRPCValidationOperationType.VALIDATE_ROUTE_FILE,
        filePath: "src/app/api/v1/core/user/list/route.ts",
        options: {
          fix: true,
          verbose: false,
        },
      },
    },
    response: {
      success: {
        success: true,
        operation: "VALIDATE_INTEGRATION",
        result: {
          success: true,
          errors: [],
          warnings: ["Route uses old apiHandler"],
          routeFiles: [
            {
              filePath: "src/app/api/v1/core/user/list/route.ts",
              hasDefinition: true,
              hasEnhancedHandler: false,
              hasTRPCExport: false,
              hasNextExport: true,
              errors: [],
              warnings: ["Route still uses old apiHandler"],
            },
          ],
        },
      },
    },
    urlPathParams: undefined,
  },
  fields: objectField(
    {
      type: WidgetType.FORM_GROUP,
      layout: { type: LayoutType.GRID, columns: 1 },
    },
    { request: "data" },
    {
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.operation.label",
          description:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.operation.description",
          placeholder:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.operation.placeholder",
          options: TRPCValidationOperationTypeOptions,
          layout: { columns: 12 },
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
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.filePath.label",
          description:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.filePath.description",
          placeholder:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.filePath.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional().describe("Specific route file path to validate"),
      ),
      options: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.options.label",
          description:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.options.description",
          placeholder:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.fields.options.placeholder",
          layout: { columns: 12 },
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
    },
  ),
  responseSchema: objectField(
    {
      type: WidgetType.CONTAINER,
      layout: { type: LayoutType.GRID, columns: 1 },
    },
    { response: true },
    {
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.response.success.label",
        },
        z.boolean().describe("Whether the TRPC validation was successful"),
      ),
      operation: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.response.operation.label",
        },
        z.string().describe("The validation operation that was executed"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateTrpcRouter.validation.response.result.label",
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
            totalFiles: z.number().optional(),
            validFiles: z.number().optional(),
            filesWithIssues: z.number().optional(),
          })
          .describe("Detailed TRPC validation result"),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.validation.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.notFound.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.server.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unknown.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.conflict.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.network.title" as const,
      description:
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.network.description" as const,
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

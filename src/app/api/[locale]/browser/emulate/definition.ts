/**
 * Emulate Tool - Definition
 * Emulates various features on the selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "emulate"],
  title: "emulate.title",
  description: "emulate.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "settings",
  tags: [
    "emulate.tags.browserAutomation",
    "emulate.tags.performanceAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "emulate.form.label",
    description: "emulate.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      networkConditions: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "emulate.form.fields.networkConditions.label",
        description: "emulate.form.fields.networkConditions.description",
        placeholder: "emulate.form.fields.networkConditions.placeholder",
        columns: 6,
        options: [
          {
            value: "No emulation",
            label: "emulate.form.fields.networkConditions.options.noEmulation",
          },
          {
            value: "Offline",
            label: "emulate.form.fields.networkConditions.options.offline",
          },
          {
            value: "Slow 3G",
            label: "emulate.form.fields.networkConditions.options.slow3g",
          },
          {
            value: "Fast 3G",
            label: "emulate.form.fields.networkConditions.options.fast3g",
          },
          {
            value: "Slow 4G",
            label: "emulate.form.fields.networkConditions.options.slow4g",
          },
          {
            value: "Fast 4G",
            label: "emulate.form.fields.networkConditions.options.fast4g",
          },
        ],
        schema: z
          .enum([
            "No emulation",
            "Offline",
            "Slow 3G",
            "Fast 3G",
            "Slow 4G",
            "Fast 4G",
          ])
          .optional()
          .describe(
            'Throttle network. Set to "No emulation" to disable. If omitted, conditions remain unchanged.',
          ),
      }),
      cpuThrottlingRate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "emulate.form.fields.cpuThrottlingRate.label",
        description: "emulate.form.fields.cpuThrottlingRate.description",
        placeholder: "emulate.form.fields.cpuThrottlingRate.placeholder",
        columns: 6,
        schema: z
          .number()
          .min(1)
          .max(20)
          .optional()
          .describe(
            "Represents the CPU slowdown factor. Set the rate to 1 to disable throttling. If omitted, throttling remains unchanged.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "emulate.response.success",
        schema: z
          .boolean()
          .describe("Whether the emulation operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "emulate.response.result",
        schema: z
          .object({
            applied: z
              .boolean()
              .describe("Whether emulation settings were applied"),
            network: z
              .string()
              .optional()
              .describe("Applied network condition"),
            cpuThrottling: z
              .number()
              .optional()
              .describe("Applied CPU throttling rate"),
          })
          .optional()
          .describe("Result of the emulation operation"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "emulate.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "emulate.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { networkConditions: "Fast 3G", cpuThrottlingRate: 2 },
    },
    responses: {
      default: {
        success: true,
        result: {
          applied: true,
          network: "Fast 3G",
          cpuThrottling: 2,
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "emulate.errors.validation.title",
      description: "emulate.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "emulate.errors.network.title",
      description: "emulate.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "emulate.errors.unauthorized.title",
      description: "emulate.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "emulate.errors.forbidden.title",
      description: "emulate.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "emulate.errors.notFound.title",
      description: "emulate.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "emulate.errors.serverError.title",
      description: "emulate.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "emulate.errors.unknown.title",
      description: "emulate.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "emulate.errors.unsavedChanges.title",
      description: "emulate.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "emulate.errors.conflict.title",
      description: "emulate.errors.conflict.description",
    },
  },
  successTypes: {
    title: "emulate.success.title",
    description: "emulate.success.description",
  },
});

export type EmulateRequestInput = typeof POST.types.RequestInput;
export type EmulateRequestOutput = typeof POST.types.RequestOutput;
export type EmulateResponseInput = typeof POST.types.ResponseInput;
export type EmulateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

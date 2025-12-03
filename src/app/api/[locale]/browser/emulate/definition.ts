/**
 * Emulate Tool - Definition
 * Emulates various features on the selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "emulate"],
  title: "app.api.browser.emulate.title",
  description: "app.api.browser.emulate.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.performanceAutomation",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.emulate.form.label",
      description: "app.api.browser.emulate.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      networkConditions: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.browser.emulate.form.fields.networkConditions.label",
          description:
            "app.api.browser.emulate.form.fields.networkConditions.description",
          placeholder:
            "app.api.browser.emulate.form.fields.networkConditions.placeholder",
          columns: 6,
          options: [
            {
              value: "No emulation",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.noEmulation",
            },
            {
              value: "Offline",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.offline",
            },
            {
              value: "Slow 3G",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.slow3g",
            },
            {
              value: "Fast 3G",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.fast3g",
            },
            {
              value: "Slow 4G",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.slow4g",
            },
            {
              value: "Fast 4G",
              label:
                "app.api.browser.emulate.form.fields.networkConditions.options.fast4g",
            },
          ],
        },
        z
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
      ),
      cpuThrottlingRate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.emulate.form.fields.cpuThrottlingRate.label",
          description:
            "app.api.browser.emulate.form.fields.cpuThrottlingRate.description",
          placeholder:
            "app.api.browser.emulate.form.fields.cpuThrottlingRate.placeholder",
          columns: 6,
        },
        z
          .number()
          .min(1)
          .max(20)
          .optional()
          .describe(
            "Represents the CPU slowdown factor. Set the rate to 1 to disable throttling. If omitted, throttling remains unchanged.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.emulate.response.success",
        },
        z.boolean().describe("Whether the emulation operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.emulate.response.result",
        },
        z
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
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.emulate.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.emulate.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
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
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.emulate.errors.validation.title",
      description: "app.api.browser.emulate.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.emulate.errors.network.title",
      description: "app.api.browser.emulate.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.emulate.errors.unauthorized.title",
      description: "app.api.browser.emulate.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.emulate.errors.forbidden.title",
      description: "app.api.browser.emulate.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.emulate.errors.notFound.title",
      description: "app.api.browser.emulate.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.emulate.errors.serverError.title",
      description: "app.api.browser.emulate.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.emulate.errors.unknown.title",
      description: "app.api.browser.emulate.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.emulate.errors.unsavedChanges.title",
      description: "app.api.browser.emulate.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.emulate.errors.conflict.title",
      description: "app.api.browser.emulate.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.emulate.success.title",
    description: "app.api.browser.emulate.success.description",
  },
});

export type EmulateRequestInput = typeof POST.types.RequestInput;
export type EmulateRequestOutput = typeof POST.types.RequestOutput;
export type EmulateResponseInput = typeof POST.types.ResponseInput;
export type EmulateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

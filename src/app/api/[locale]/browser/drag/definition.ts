/**
 * Drag Tool - Definition
 * Drag an element onto another element
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
  path: ["browser", "drag"],
  title: "app.api.browser.drag.title",
  description: "app.api.browser.drag.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.inputAutomation",
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
      title: "app.api.browser.drag.form.label",
      description: "app.api.browser.drag.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      from_uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.drag.form.fields.from_uid.label",
          description: "app.api.browser.drag.form.fields.from_uid.description",
          placeholder: "app.api.browser.drag.form.fields.from_uid.placeholder",
          columns: 6,
        },
        z.string().describe("The uid of the element to drag"),
      ),
      to_uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.drag.form.fields.to_uid.label",
          description: "app.api.browser.drag.form.fields.to_uid.description",
          placeholder: "app.api.browser.drag.form.fields.to_uid.placeholder",
          columns: 6,
        },
        z.string().describe("The uid of the element to drop into"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.drag.response.success",
        },
        z.boolean().describe("Whether the drag operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.drag.response.result",
        },
        z
          .object({
            dragged: z
              .boolean()
              .describe("Whether the drag operation was performed"),
            from: z.string().describe("The source element uid"),
            to: z.string().describe("The target element uid"),
          })
          .optional()
          .describe("Result of the drag operation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.drag.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.drag.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      dragDrop: {
        from_uid: "draggable-123",
        to_uid: "dropzone-456",
      },
    },
    responses: {
      dragDrop: {
        success: true,
        result: { dragged: true, from: "draggable-123", to: "dropzone-456" },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.drag.errors.validation.title",
      description: "app.api.browser.drag.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.drag.errors.network.title",
      description: "app.api.browser.drag.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.drag.errors.unauthorized.title",
      description: "app.api.browser.drag.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.drag.errors.forbidden.title",
      description: "app.api.browser.drag.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.drag.errors.notFound.title",
      description: "app.api.browser.drag.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.drag.errors.serverError.title",
      description: "app.api.browser.drag.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.drag.errors.unknown.title",
      description: "app.api.browser.drag.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.drag.errors.unsavedChanges.title",
      description: "app.api.browser.drag.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.drag.errors.conflict.title",
      description: "app.api.browser.drag.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.drag.success.title",
    description: "app.api.browser.drag.success.description",
  },
});

export type DragRequestInput = typeof POST.types.RequestInput;
export type DragRequestOutput = typeof POST.types.RequestOutput;
export type DragResponseInput = typeof POST.types.ResponseInput;
export type DragResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

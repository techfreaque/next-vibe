/**
 * FillForm Tool - Definition
 * Fill out multiple form elements at once
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestDataArrayField,
  requestDataField,
  responseArrayOptionalField,
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
  path: ["browser", "fill-form"],
  title: "app.api.browser.fill-form.title",
  description: "app.api.browser.fill-form.description",
  category: "app.api.browser.category",
  icon: "pen-tool",
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
      title: "app.api.browser.fill-form.form.label",
      description: "app.api.browser.fill-form.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      elements: requestDataArrayField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.fill-form.form.fields.elements.label",
          description:
            "app.api.browser.fill-form.form.fields.elements.description",
          placeholder:
            "app.api.browser.fill-form.form.fields.elements.placeholder",
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 2,
          },
          { request: "data" },
          {
            uid: requestDataField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.browser.fill-form.form.fields.elements.uid.label",
                description:
                  "app.api.browser.fill-form.form.fields.elements.uid.description",
                columns: 6,
              },
              z.string().describe("The uid of the element to fill out"),
            ),
            value: requestDataField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.browser.fill-form.form.fields.elements.value.label",
                description:
                  "app.api.browser.fill-form.form.fields.elements.value.description",
                columns: 6,
              },
              z.string().describe("Value for the element"),
            ),
          },
        ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.fill-form.response.success",
        },
        z.boolean().describe("Whether the form fill operation succeeded"),
      ),
      result: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.browser.fill-form.response.result.title",
          description: "app.api.browser.fill-form.response.result.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          filled: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.browser.fill-form.response.result.filled",
            },
            z.boolean().describe("Whether all form elements were filled"),
          ),
          filledCount: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.browser.fill-form.response.result.filledCount",
            },
            z.coerce.number().describe("Number of elements filled"),
          ),
          elements: responseArrayOptionalField(
            {
              type: WidgetType.DATA_TABLE,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 2,
              },
              { response: true },
              {
                uid: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.fill-form.response.result.elements.uid",
                  },
                  z.string(),
                ),
                filled: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.fill-form.response.result.elements.filled",
                  },
                  z.boolean(),
                ),
              },
            ),
          ),
        },
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.fill-form.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.fill-form.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { elements: [{ uid: "field-1", value: "value1" }] },
    },
    responses: {
      default: {
        success: true,
        result: {
          filled: true,
          filledCount: 1,
          elements: [{ uid: "field-1", filled: true }],
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.fill-form.errors.validation.title",
      description: "app.api.browser.fill-form.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.fill-form.errors.network.title",
      description: "app.api.browser.fill-form.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.fill-form.errors.unauthorized.title",
      description: "app.api.browser.fill-form.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.fill-form.errors.forbidden.title",
      description: "app.api.browser.fill-form.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.fill-form.errors.notFound.title",
      description: "app.api.browser.fill-form.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.fill-form.errors.serverError.title",
      description: "app.api.browser.fill-form.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.fill-form.errors.unknown.title",
      description: "app.api.browser.fill-form.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.fill-form.errors.unsavedChanges.title",
      description:
        "app.api.browser.fill-form.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.fill-form.errors.conflict.title",
      description: "app.api.browser.fill-form.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.fill-form.success.title",
    description: "app.api.browser.fill-form.success.description",
  },
});

export type FillFormRequestInput = typeof POST.types.RequestInput;
export type FillFormRequestOutput = typeof POST.types.RequestOutput;
export type FillFormResponseInput = typeof POST.types.ResponseInput;
export type FillFormResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

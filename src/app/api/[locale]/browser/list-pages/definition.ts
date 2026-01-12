/**
 * ListPages Tool - Definition
 * Get a list of pages open in the browser
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "list-pages"],
  title: "app.api.browser.list-pages.title",
  description: "app.api.browser.list-pages.description",
  category: "app.api.browser.category",
  icon: "layers",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.navigationAutomation",
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
      title: "app.api.browser.list-pages.form.label",
      description: "app.api.browser.list-pages.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-pages.response.success",
        },
        z.boolean().describe("Whether the pages listing operation succeeded"),
      ),
      result: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.browser.list-pages.response.result.title",
          description: "app.api.browser.list-pages.response.result.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          pages: responseArrayField(
            {
              type: WidgetType.DATA_TABLE,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                idx: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-pages.response.result.pages.idx",
                  },
                  z.coerce.number().describe("Page index"),
                ),
                title: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-pages.response.result.pages.title",
                  },
                  z.string().describe("Page title"),
                ),
                url: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-pages.response.result.pages.url",
                  },
                  z.string().describe("Page URL"),
                ),
                active: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-pages.response.result.pages.active",
                  },
                  z.boolean().describe("Whether this is the active page"),
                ),
              },
            ),
          ),
          totalCount: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.browser.list-pages.response.result.totalCount",
            },
            z.coerce.number().describe("Total number of open pages"),
          ),
        },
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-pages.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-pages.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        success: true,
        result: {
          pages: [
            {
              idx: 0,
              title: "Example Page",
              url: "https://example.com",
              active: true,
            },
          ],
          totalCount: 1,
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.list-pages.errors.validation.title",
      description: "app.api.browser.list-pages.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.list-pages.errors.network.title",
      description: "app.api.browser.list-pages.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.list-pages.errors.unauthorized.title",
      description: "app.api.browser.list-pages.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.list-pages.errors.forbidden.title",
      description: "app.api.browser.list-pages.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.list-pages.errors.notFound.title",
      description: "app.api.browser.list-pages.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.list-pages.errors.serverError.title",
      description: "app.api.browser.list-pages.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.list-pages.errors.unknown.title",
      description: "app.api.browser.list-pages.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.list-pages.errors.unsavedChanges.title",
      description:
        "app.api.browser.list-pages.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.list-pages.errors.conflict.title",
      description: "app.api.browser.list-pages.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.list-pages.success.title",
    description: "app.api.browser.list-pages.success.description",
  },
});

export type ListPagesRequestInput = typeof POST.types.RequestInput;
export type ListPagesRequestOutput = typeof POST.types.RequestOutput;
export type ListPagesResponseInput = typeof POST.types.ResponseInput;
export type ListPagesResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

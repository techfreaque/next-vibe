/**
 * Browser API Endpoint Definitions
 * Defines the API endpoints for Chrome DevTools MCP tool execution
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { BrowserTool, BrowserToolOptions, BrowserToolStatus } from "./enum";

/**
 * Browser tool execution endpoint
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "browser"],
  title: "app.api.v1.core.browser.title",
  description: "app.api.v1.core.browser.description",
  category: "app.api.v1.core.browser.category",
  tags: [
    "app.api.v1.core.browser.tags.browserAutomation",
    "app.api.v1.core.browser.tags.chromeDevTools",
    "app.api.v1.core.browser.tags.mcpTools",
    "app.api.v1.core.browser.tags.webDebugging",
    "app.api.v1.core.browser.tags.performanceAnalysis",
  ],
  aliases: ["chrome"],

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
      title: "app.api.v1.core.browser.form.label",
      description: "app.api.v1.core.browser.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      tool: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.browser.form.fields.tool.label",
          description: "app.api.v1.core.browser.form.fields.tool.description",
          placeholder: "app.api.v1.core.browser.form.fields.tool.placeholder",
          options: BrowserToolOptions,
          columns: 12,
        },
        z.enum(BrowserTool),
      ),
      arguments: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.browser.form.fields.arguments.label",
          description:
            "app.api.v1.core.browser.form.fields.arguments.description",
          placeholder:
            "app.api.v1.core.browser.form.fields.arguments.placeholder",
          columns: 12,
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.response.success",
        },
        z.boolean(),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.response.result",
        },
        z.unknown().optional(),
      ),
      status: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.v1.core.browser.response.status",
        },
        responseField(
          {
            type: WidgetType.BADGE,
            text: "app.api.v1.core.browser.response.statusItem",
          },
          z.string(),
        ),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.response.executionId",
        },
        z.string().optional(),
      ),
    },
  ),
  examples: {
    requests: {
      navigate: {
        tool: BrowserTool.NAVIGATE_PAGE,
        arguments: JSON.stringify({ url: "https://example.com" }, null, 2),
      },
      screenshot: {
        tool: BrowserTool.TAKE_SCREENSHOT,
        arguments: JSON.stringify({ format: "png", fullPage: true }, null, 2),
      },
      click: {
        tool: BrowserTool.CLICK,
        arguments: JSON.stringify(
          { selector: "button[type='submit']" },
          null,
          2,
        ),
      },
      performance: {
        tool: BrowserTool.PERFORMANCE_START_TRACE,
        arguments: JSON.stringify(
          { categories: ["devtools.timeline"] },
          null,
          2,
        ),
      },
      script: {
        tool: BrowserTool.EVALUATE_SCRIPT,
        arguments: JSON.stringify({ expression: "document.title" }, null, 2),
      },
    },
    responses: {
      navigate: {
        success: true,
        result: { url: "https://example.com", title: "Example Domain" },
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_123",
      },
      screenshot: {
        success: true,
        result: {
          screenshot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        },
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_456",
      },
      click: {
        success: true,
        result: { clicked: true },
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_789",
      },
      performance: {
        success: true,
        result: { traceId: "trace_123", started: true },
        status: [BrowserToolStatus.RUNNING],
        executionId: "exec_101",
      },
      script: {
        success: true,
        result: { value: "Example Domain" },
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_202",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.browser.errors.validation.title",
      description: "app.api.v1.core.browser.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.browser.errors.network.title",
      description: "app.api.v1.core.browser.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.browser.errors.unauthorized.title",
      description: "app.api.v1.core.browser.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.browser.errors.forbidden.title",
      description: "app.api.v1.core.browser.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.browser.errors.notFound.title",
      description: "app.api.v1.core.browser.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.browser.errors.serverError.title",
      description: "app.api.v1.core.browser.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.browser.errors.unknown.title",
      description: "app.api.v1.core.browser.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.browser.errors.unsavedChanges.title",
      description: "app.api.v1.core.browser.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.browser.errors.conflict.title",
      description: "app.api.v1.core.browser.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.browser.success.title",
    description: "app.api.v1.core.browser.success.description",
  },
});

export type BrowserRequestInput = typeof POST.types.RequestInput;
export type BrowserRequestOutput = typeof POST.types.RequestOutput;
export type BrowserResponseInput = typeof POST.types.ResponseInput;
export type BrowserResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

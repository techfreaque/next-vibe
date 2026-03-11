/**
 * Browser API Endpoint Definitions
 * Defines the API endpoints for Chrome DevTools MCP tool execution
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { BrowserTool, BrowserToolOptions, BrowserToolStatus } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Browser tool execution endpoint
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.browserAutomation",
  icon: "monitor",
  tags: [
    "tags.browserAutomation",
    "tags.chromeDevTools",
    "tags.mcpTools",
    "tags.webDebugging",
    "tags.performanceAnalysis",
  ],
  aliases: ["chrome"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.label",
    description: "form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      tool: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.tool.label",
        description: "form.fields.tool.description",
        placeholder: "form.fields.tool.placeholder",
        options: BrowserToolOptions,
        columns: 12,
        schema: z.enum(BrowserTool),
      }),
      arguments: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.arguments.label",
        description: "form.fields.arguments.description",
        placeholder: "form.fields.arguments.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success",
        schema: z.boolean(),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.result",
        schema: z
          .array(
            z.object({
              type: z.string().describe("Content type (text or image)"),
              text: z.string().optional().describe("Text content"),
              data: z.string().optional().describe("Base64 encoded data"),
              mimeType: z.string().optional().describe("MIME type for data"),
            }),
          )
          .optional()
          .describe("MCP content blocks returned by the tool"),
      }),
      status: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.status",
        child: responseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "response.statusItem",
          schema: z.string(),
        }),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.executionId",
        schema: z.string().optional(),
      }),
    },
  }),
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
        result: [
          {
            type: "text",
            text: "# navigate_page response\nNavigated to https://example.com",
          },
        ],
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_123",
      },
      screenshot: {
        success: true,
        result: [
          {
            type: "text",
            text: "# take_screenshot response\nTook a screenshot of the current page's viewport.",
          },
          { type: "image", data: "iVBORw0KGgoAAAANSUhEUgAA..." },
        ],
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_456",
      },
      click: {
        success: true,
        result: [
          {
            type: "text",
            text: "# click response\nClicked element button[type='submit']",
          },
        ],
        status: [BrowserToolStatus.COMPLETED],
        executionId: "exec_789",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
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
      title: "errors.serverError.title",
      description: "errors.serverError.description",
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
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

export type BrowserRequestInput = typeof POST.types.RequestInput;
export type BrowserRequestOutput = typeof POST.types.RequestOutput;
export type BrowserResponseInput = typeof POST.types.ResponseInput;
export type BrowserResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

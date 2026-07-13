/**
 * EvaluateScript Tool - Definition
 * Evaluate a JavaScript function inside the currently selected page
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestDataArrayOptionalField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { browserInstanceIdField } from "../shared/instance-id-field";
import { BROWSER_EVAL_ALIAS } from "./constants";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "evaluate-script"],
  aliases: [BROWSER_EVAL_ALIAS] as const,
  title: "evaluate-script.title",
  titleShort: "evaluate-script.titleShort",
  description: "evaluate-script.description",
  dynamicTitle: ({ request }) => {
    const fn = request?.function;
    if (typeof fn === "string" && fn.trim()) {
      const snippet = fn.length > 50 ? `${fn.slice(0, 50)}\u2026` : fn;
      return {
        message: "evaluate-script.dynamicTitle" as const,
        messageParams: { snippet },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "DevTools",
  icon: "code",
  tags: [
    "evaluate-script.tags.browserAutomation",
    "evaluate-script.tags.scriptExecution",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      function: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "evaluate-script.form.fields.function.label",
        description: "evaluate-script.form.fields.function.description",
        placeholder: "evaluate-script.form.fields.function.placeholder",
        columns: 12,
        schema: z
          .string()
          .describe(
            "A JavaScript function declaration to be executed by the tool in the currently selected page",
          ),
      }),
      args: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "evaluate-script.form.fields.args.label",
          description: "evaluate-script.form.fields.args.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 1,
          usage: { request: "data" },
          children: {
            uid: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "evaluate-script.form.fields.args.uid.label",
              description: "evaluate-script.form.fields.args.uid.description",
              columns: 12,
              schema: z
                .string()
                .describe(
                  "The uid of an element on the page from the page content snapshot",
                ),
            }),
          },
        }),
      ),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the script evaluation operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
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
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { function: "() => { return document.title; }", args: null },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# evaluate_script response\nScript executed successfully. Result: Example Page Title",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "evaluate-script.errors.validation.title",
      description: "evaluate-script.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "evaluate-script.errors.network.title",
      description: "evaluate-script.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "evaluate-script.errors.unauthorized.title",
      description: "evaluate-script.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "evaluate-script.errors.forbidden.title",
      description: "evaluate-script.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "evaluate-script.errors.notFound.title",
      description: "evaluate-script.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "evaluate-script.errors.serverError.title",
      description: "evaluate-script.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "evaluate-script.errors.unknown.title",
      description: "evaluate-script.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "evaluate-script.errors.unsavedChanges.title",
      description: "evaluate-script.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "evaluate-script.errors.conflict.title",
      description: "evaluate-script.errors.conflict.description",
    },
  },
  successTypes: {
    title: "evaluate-script.success.title",
    description: "evaluate-script.success.description",
  },
});

export type EvaluateScriptRequestInput = typeof POST.types.RequestInput;
export type EvaluateScriptRequestOutput = typeof POST.types.RequestOutput;
export type EvaluateScriptResponseInput = typeof POST.types.ResponseInput;
export type EvaluateScriptResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

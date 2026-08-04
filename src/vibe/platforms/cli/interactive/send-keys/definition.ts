/**
 * Interactive Send Keys Definition
 * Inject keystrokes into a running vibe interactive session.
 */

import { z } from "zod";

import { createEndpoint } from "../../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../../../core/definition/enums";
import { UserRole } from "../../../../identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "../../../../unified-ui/_shared/utils-i18n";
import { scopedTranslation } from "../i18n";
import { INTERACTIVE_SEND_KEYS_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  title: "sendKeys.title",
  titleShort: "sendKeys.titleShort",
  description: "sendKeys.description",
  icon: "keyboard",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["sendKeys.title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: [INTERACTIVE_SEND_KEYS_ALIAS] as const,
  method: Methods.POST,
  path: ["vibe", "platforms", "cli", "interactive", "send-keys"],
  cli: {
    firstCliArgKey: "keys",
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "sendKeys.title",
    description: "sendKeys.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      keys: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sendKeys.form.fields.keys.label",
        description: "sendKeys.form.fields.keys.description",
        columns: 8,
        schema: z
          .string()
          .describe(
            "Key to send: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space, type:text for typing, or literal chars. One per line for multiple.",
          ),
      }),
      pid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "sendKeys.form.fields.pid.label",
        description: "sendKeys.form.fields.pid.description",
        columns: 2,
        schema: z
          .union([z.number(), z.string().transform(Number)])
          .optional()
          .describe(
            "PID of the interactive session. Auto-detected when omitted.",
          ),
      }),
      waitMs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "sendKeys.form.fields.waitMs.label",
        description: "sendKeys.form.fields.waitMs.description",
        columns: 2,
        schema: z
          .union([z.number(), z.string().transform(Number)])
          .optional()
          .describe(
            "Milliseconds to wait after injecting keys before reading the frame. Default 500. Use higher values for streaming responses.",
          ),
      }),

      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sendKeys.response.fields.content",
        schema: z
          .string()
          .describe("Terminal frame content after keystroke injection"),
      }),
      logs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sendKeys.response.fields.logs",
        schema: z.string().describe("Error log output from the session"),
      }),
      sessionPid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sendKeys.response.fields.pid",
        schema: z.number().describe("PID of the active interactive session"),
      }),
    },
  }),

  examples: {
    requests: {
      default: { keys: "Tab" },
      typeText: { keys: "type:hello world" },
      withWait: { keys: "Enter", waitMs: 2000 },
      withPid: { keys: "Tab", pid: 12345 },
    },
    responses: {
      default: {
        content: "POST AI Stream Chat\n[focused field changed]",
        logs: "",
        sessionPid: 12345,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sendKeys.errors.validation.title",
      description: "sendKeys.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sendKeys.errors.unauthorized.title",
      description: "sendKeys.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sendKeys.errors.server.title",
      description: "sendKeys.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sendKeys.errors.network.title",
      description: "sendKeys.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sendKeys.errors.forbidden.title",
      description: "sendKeys.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sendKeys.errors.notFound.title",
      description: "sendKeys.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sendKeys.errors.unknown.title",
      description: "sendKeys.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sendKeys.errors.conflict.title",
      description: "sendKeys.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sendKeys.errors.conflict.title",
      description: "sendKeys.errors.conflict.description",
    },
  },

  successTypes: {
    title: "sendKeys.success.title",
    description: "sendKeys.success.description",
  },
});

export type SendKeysRequestInput = typeof POST.types.RequestInput;
export type SendKeysRequestOutput = typeof POST.types.RequestOutput;
export type SendKeysResponseInput = typeof POST.types.ResponseInput;
export type SendKeysResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

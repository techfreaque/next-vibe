/**
 * Interactive Capture Definition
 * Read the current rendered frame from a running vibe interactive session.
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
import { scopedTranslation } from "next-vibe/platforms/cli/interactive/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { INTERACTIVE_CAPTURE_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  title: "capture.title",
  titleShort: "capture.titleShort",
  description: "capture.description",
  icon: "camera",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["capture.title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: [INTERACTIVE_CAPTURE_ALIAS] as const,
  method: Methods.POST,
  path: ["system", "platforms", "cli", "interactive", "capture"],
  cli: {
    firstCliArgKey: "pid",
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "capture.title",
    description: "capture.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      pid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "capture.form.fields.pid.label",
        description: "capture.form.fields.pid.description",
        columns: 6,
        schema: z
          .union([z.number(), z.string().transform(Number)])
          .optional()
          .describe(
            "PID of the interactive session. Auto-detected from .vibe-interactive.pid when omitted.",
          ),
      }),

      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "capture.response.fields.content",
        schema: z.string().describe("Current rendered terminal frame content"),
      }),
      logs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "capture.response.fields.logs",
        schema: z
          .string()
          .describe("Accumulated stderr/error log output from the session"),
      }),
      sessionPid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "capture.response.fields.pid",
        schema: z.number().describe("PID of the active interactive session"),
      }),
    },
  }),

  examples: {
    requests: {
      default: {},
      withPid: { pid: 12345 },
    },
    responses: {
      default: {
        content:
          "POST AI Stream Chat\nStream AI-powered chat responses...\n\n[textarea] Enter your message",
        logs: "",
        sessionPid: 12345,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "capture.errors.validation.title",
      description: "capture.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "capture.errors.unauthorized.title",
      description: "capture.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "capture.errors.server.title",
      description: "capture.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "capture.errors.network.title",
      description: "capture.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "capture.errors.forbidden.title",
      description: "capture.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "capture.errors.notFound.title",
      description: "capture.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "capture.errors.unknown.title",
      description: "capture.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "capture.errors.conflict.title",
      description: "capture.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "capture.errors.conflict.title",
      description: "capture.errors.conflict.description",
    },
  },

  successTypes: {
    title: "capture.success.title",
    description: "capture.success.description",
  },
});

export type CaptureRequestInput = typeof POST.types.RequestInput;
export type CaptureRequestOutput = typeof POST.types.RequestOutput;
export type CaptureResponseInput = typeof POST.types.ResponseInput;
export type CaptureResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;

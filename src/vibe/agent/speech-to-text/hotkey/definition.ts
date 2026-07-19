/**
 * Speech-to-Text Hotkey Endpoint Definition
 * CLI-based hotkey-triggered speech-to-text with auto-insertion
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
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { HotkeyAction, HotkeyActionOptions } from "./enum";

/**
 * POST /speech-to-text/hotkey - Start/stop/toggle STT recording
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "speech-to-text", "hotkey"],
  title: "hotkey.post.title" as const,
  titleShort: "hotkey.post.titleShort" as const,
  description: "hotkey.post.description" as const,
  icon: "mic",
  category: "ai",
  subCategory: "Generation",
  tags: [
    "hotkey.tags.speech" as const,
    "hotkey.tags.hotkey" as const,
    "hotkey.tags.cli" as const,
  ],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,

  // CLI Configuration
  aliases: ["stt"] as const,
  cli: {
    firstCliArgKey: "action",
  },

  // Credit cost
  credits: 2, // Same as regular STT

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "hotkey.post.form.title" as const,
    description: "hotkey.post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "hotkey.post.action.label" as const,
        description: "hotkey.post.action.description" as const,
        columns: 12,
        options: HotkeyActionOptions,
        schema: z.enum(HotkeyAction).optional(),
      }),

      insertPrefix: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "hotkey.post.insertPrefix.label" as const,
        description: "hotkey.post.insertPrefix.description" as const,
        columns: 6,
        placeholder: "hotkey.post.insertPrefix.placeholder" as const,
        schema: z.string().default(""),
      }),

      insertSuffix: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "hotkey.post.insertSuffix.label" as const,
        description: "hotkey.post.insertSuffix.description" as const,
        columns: 6,
        placeholder: "hotkey.post.insertSuffix.placeholder" as const,
        schema: z.string().default(" "),
      }),

      // === RESPONSE FIELDS ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "hotkey.post.response.title" as const,
        description: "hotkey.post.response.description" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "hotkey.post.response.success" as const,
            schema: z.boolean(),
          }),

          status: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "hotkey.post.response.status" as const,
            schema: z.string(),
          }),

          message: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "hotkey.post.response.message" as const,
            schema: z.string(),
          }),

          text: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "hotkey.post.response.text" as const,
            schema: z.string().optional(),
          }),

          recordingDuration: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "hotkey.post.response.recordingDuration" as const,
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "hotkey.post.errors.unauthorized.title" as const,
      description: "hotkey.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "hotkey.post.errors.validation.title" as const,
      description: "hotkey.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "hotkey.post.errors.server.title" as const,
      description: "hotkey.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "hotkey.post.errors.conflict.title" as const,
      description: "hotkey.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "hotkey.post.errors.forbidden.title" as const,
      description: "hotkey.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "hotkey.post.errors.network.title" as const,
      description: "hotkey.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "hotkey.post.errors.notFound.title" as const,
      description: "hotkey.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "hotkey.post.errors.unsaved.title" as const,
      description: "hotkey.post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "hotkey.post.errors.unknown.title" as const,
      description: "hotkey.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "hotkey.post.success.title" as const,
    description: "hotkey.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        action: HotkeyAction.START,
        insertPrefix: "",
        insertSuffix: " ",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          status: "recording",
          message: "Recording started",
        },
      },
    },
  },
});

// Extract types
export type SttHotkeyPostRequestInput = typeof POST.types.RequestInput;
export type SttHotkeyPostRequestOutput = typeof POST.types.RequestOutput;
export type SttHotkeyPostResponseInput = typeof POST.types.ResponseInput;
export type SttHotkeyPostResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;

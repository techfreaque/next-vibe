/**
 * Speech-to-Text Hotkey Endpoint Definition
 * CLI-based hotkey-triggered speech-to-text with auto-insertion
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { HotkeyAction, HotkeyActionOptions } from "./enum";

/**
 * POST /speech-to-text/hotkey - Start/stop/toggle STT recording
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "speech-to-text", "hotkey"],
  title: "app.api.agent.speechToText.hotkey.post.title" as const,
  description: "app.api.agent.speechToText.hotkey.post.description" as const,
  icon: "mic",
  category: "app.api.agent.category" as const,
  tags: [
    "app.api.agent.chat.tags.speech" as const,
    "app.api.agent.chat.tags.hotkey" as const,
    "app.api.agent.chat.tags.cli" as const,
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.speechToText.hotkey.post.form.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      action: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.speechToText.hotkey.post.action.label" as const,
        description:
          "app.api.agent.speechToText.hotkey.post.action.description" as const,
        columns: 12,
        options: HotkeyActionOptions,
        schema: z.enum(HotkeyAction).optional(),
      }),

      // provider: requestField(
      //   {
      //     type: WidgetType.FORM_FIELD,
      //     fieldType: FieldDataType.SELECT,
      //     label:
      //       "app.api.agent.speechToText.hotkey.post.provider.label" as const,
      //     description:
      //       "app.api.agent.speechToText.hotkey.post.provider.description" as const,
      //     columns: 6,
      //     options: SttProviderOptions,
      //   },
      //   z.enum(SttProvider).default(SttProvider.OPENAI),
      // ),

      insertPrefix: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.speechToText.hotkey.post.insertPrefix.label" as const,
        description:
          "app.api.agent.speechToText.hotkey.post.insertPrefix.description" as const,
        columns: 6,
        placeholder:
          "app.api.agent.speechToText.hotkey.post.insertPrefix.placeholder" as const,
        schema: z.string().default(""),
      }),

      insertSuffix: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.speechToText.hotkey.post.insertSuffix.label" as const,
        description:
          "app.api.agent.speechToText.hotkey.post.insertSuffix.description" as const,
        columns: 6,
        placeholder:
          "app.api.agent.speechToText.hotkey.post.insertSuffix.placeholder" as const,
        schema: z.string().default(" "),
      }),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.speechToText.hotkey.post.response.title" as const,
          description:
            "app.api.agent.speechToText.hotkey.post.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.speechToText.hotkey.post.response.success" as const,
            schema: z.boolean(),
          }),

          status: responseField({
            type: WidgetType.BADGE,
            text: "app.api.agent.speechToText.hotkey.post.response.status" as const,
            schema: z.string(),
          }),

          message: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.speechToText.hotkey.post.response.message" as const,
            schema: z.string(),
          }),

          text: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.speechToText.hotkey.post.response.text" as const,
            schema: z.string().optional(),
          }),

          recordingDuration: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.speechToText.hotkey.post.response.recordingDuration" as const,
            schema: z.coerce.number().optional(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.validation.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.server.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.conflict.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.network.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.notFound.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.unsaved.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.speechToText.hotkey.post.errors.unknown.title" as const,
      description:
        "app.api.agent.speechToText.hotkey.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.speechToText.hotkey.post.success.title" as const,
    description:
      "app.api.agent.speechToText.hotkey.post.success.description" as const,
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

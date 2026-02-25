/**
 * Speech-to-Text Hotkey Endpoint Definition
 * CLI-based hotkey-triggered speech-to-text with auto-insertion
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";
import { HotkeyAction, HotkeyActionOptions } from "./enum";

/**
 * POST /speech-to-text/hotkey - Start/stop/toggle STT recording
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "speech-to-text", "hotkey"],
  title: "speechToText.hotkey.post.title" as const,
  description: "speechToText.hotkey.post.description" as const,
  icon: "mic",
  category: "app.endpointCategories.ai",
  tags: [
    "chat.tags.speech" as const,
    "chat.tags.hotkey" as const,
    "chat.tags.cli" as const,
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "speechToText.hotkey.post.form.title" as const,
    description: "speechToText.hotkey.post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      action: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "speechToText.hotkey.post.action.label" as const,
        description: "speechToText.hotkey.post.action.description" as const,
        columns: 12,
        options: HotkeyActionOptions,
        schema: z.enum(HotkeyAction).optional(),
      }),

      // provider: scopedRequestField(scopedTranslation, {
      //   type: WidgetType.FORM_FIELD,
      //   fieldType: FieldDataType.SELECT,
      //   label:
      //     "speechToText.hotkey.post.provider.label" as const,
      //   description:
      //     "speechToText.hotkey.post.provider.description" as const,
      //   columns: 6,
      //   options: SttProviderOptions,
      //   schema: z.enum(SttProvider).default(SttProvider.OPENAI),
      // }),

      insertPrefix: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "speechToText.hotkey.post.insertPrefix.label" as const,
        description:
          "speechToText.hotkey.post.insertPrefix.description" as const,
        columns: 6,
        placeholder:
          "speechToText.hotkey.post.insertPrefix.placeholder" as const,
        schema: z.string().default(""),
      }),

      insertSuffix: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "speechToText.hotkey.post.insertSuffix.label" as const,
        description:
          "speechToText.hotkey.post.insertSuffix.description" as const,
        columns: 6,
        placeholder:
          "speechToText.hotkey.post.insertSuffix.placeholder" as const,
        schema: z.string().default(" "),
      }),

      // === RESPONSE FIELDS ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "speechToText.hotkey.post.response.title" as const,
        description: "speechToText.hotkey.post.response.description" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "speechToText.hotkey.post.response.success" as const,
            schema: z.boolean(),
          }),

          status: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "speechToText.hotkey.post.response.status" as const,
            schema: z.string(),
          }),

          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "speechToText.hotkey.post.response.message" as const,
            schema: z.string(),
          }),

          text: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "speechToText.hotkey.post.response.text" as const,
            schema: z.string().optional(),
          }),

          recordingDuration: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "speechToText.hotkey.post.response.recordingDuration" as const,
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "speechToText.hotkey.post.errors.unauthorized.title" as const,
      description:
        "speechToText.hotkey.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "speechToText.hotkey.post.errors.validation.title" as const,
      description:
        "speechToText.hotkey.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "speechToText.hotkey.post.errors.server.title" as const,
      description:
        "speechToText.hotkey.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "speechToText.hotkey.post.errors.conflict.title" as const,
      description:
        "speechToText.hotkey.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "speechToText.hotkey.post.errors.forbidden.title" as const,
      description:
        "speechToText.hotkey.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "speechToText.hotkey.post.errors.network.title" as const,
      description:
        "speechToText.hotkey.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "speechToText.hotkey.post.errors.notFound.title" as const,
      description:
        "speechToText.hotkey.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "speechToText.hotkey.post.errors.unsaved.title" as const,
      description:
        "speechToText.hotkey.post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "speechToText.hotkey.post.errors.unknown.title" as const,
      description:
        "speechToText.hotkey.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "speechToText.hotkey.post.success.title" as const,
    description: "speechToText.hotkey.post.success.description" as const,
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

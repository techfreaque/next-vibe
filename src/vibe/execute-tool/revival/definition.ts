import { ChatModelId } from "../../agent/ai-stream/models";
import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { WidgetDataSchema } from "../../core/utils/json";
import { UserRole } from "../../identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

export const REVIVAL_ALIAS = "resume-stream";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "execute-tool", "revival"],
  aliases: [REVIVAL_ALIAS],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.AI_TOOL_OFF,
  ],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "play",
  category: "ai",
  subCategory: "Inference",
  tags: [],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "data", response: true },
    children: {
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().uuid(),
      }),

      favoriteId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      modelId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.modelId.title",
        description: "post.fields.modelId.description",
        columns: 6,
        schema: z.enum(ChatModelId).optional(),
      }),

      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      callbackMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      wakeUpToolMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),

      wakeUpResult: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.record(z.string(), WidgetDataSchema).optional(),
      }),

      wakeUpStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      wakeUpTaskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      resumeTaskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      leafMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),

      subAgentDepth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.number().int().min(0).optional().default(0),
      }),

      resumed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),

      lastAiMessageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().uuid().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        modelId: ChatModelId.CLAUDE_HAIKU_4_5,
        subAgentDepth: 0,
      },
    },
    responses: {
      default: {
        resumed: true,
        lastAiMessageId: "770e8400-e29b-41d4-a716-446655440002",
      },
    },
  },
});

export const endpoints = { POST };

export type RevivalRequestInput = typeof POST.types.RequestInput;
export type RevivalRequestOutput = typeof POST.types.RequestOutput;
export type RevivalResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;

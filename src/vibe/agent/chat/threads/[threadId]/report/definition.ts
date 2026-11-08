/**
 * Thread Report API Definition
 * POST /agent/chat/threads/[threadId]/report
 *
 * Report a public-feed post or a shared thread for moderation. Open to guests.
 *  - One report per reporter (user, else lead) per thread
 *  - Rate-limited per lead and per IP
 *  - Auto-hides the thread (UNDER_REVIEW) at the report threshold, pending
 *    admin review in the moderation queue (mirrors skill reports)
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ThreadReportReason, ThreadReportReasonDB } from "../../../enum";
import { THREAD_REPORT_ALIAS } from "../../../moderation/constants";
import { scopedTranslation } from "./i18n";

const ThreadReportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ThreadReportContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "chat", "threads", "[threadId]", "report"],
  aliases: [THREAD_REPORT_ALIAS],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "alert-triangle",
  category: "ai",
  subCategory: "threadsManagement",
  tags: ["tags.moderation" as const],

  fields: customWidgetObject({
    render: ThreadReportContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () => (await import("../definition")).default.GET,
        labelField: "title",
        label: "post.title" as const,
        description: "post.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.reason.label" as const,
        description: "post.reason.description" as const,
        options: [
          {
            value: ThreadReportReason.SPAM,
            label: "post.reasons.spam" as const,
          },
          {
            value: ThreadReportReason.ILLEGAL,
            label: "post.reasons.illegal" as const,
          },
          {
            value: ThreadReportReason.ABUSE,
            label: "post.reasons.abuse" as const,
          },
          {
            value: ThreadReportReason.CSAM_FLAG,
            label: "post.reasons.csamFlag" as const,
          },
          {
            value: ThreadReportReason.OTHER,
            label: "post.reasons.other" as const,
          },
        ],
        columns: 12,
        schema: z.enum(ThreadReportReasonDB),
      }),

      note: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.note.label" as const,
        description: "post.note.description" as const,
        placeholder: "post.note.placeholder" as const,
        columns: 12,
        schema: z.string().max(500).optional(),
      }),

      messageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.messageId.label" as const,
        description: "post.messageId.description" as const,
        hidden: true,
        columns: 12,
        schema: z.uuid().optional(),
      }),

      reported: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.reported.content" as const,
        schema: z.boolean(),
      }),

      reportCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.reportCount.content" as const,
        schema: z.number().int().nonnegative(),
      }),

      hidden: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.hidden.content" as const,
        schema: z.boolean(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.button.submit" as const,
        loadingText: "post.button.loading" as const,
        icon: "alert-triangle",
        variant: "destructive",
        className: "ml-auto",
        usage: { request: "data&urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: { reason: ThreadReportReason.SPAM, note: "Repeated ads" },
    },
    responses: {
      default: { reported: true, reportCount: 1, hidden: false },
    },
  },
});

export const endpoints = { POST };

export type ThreadReportPostResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;

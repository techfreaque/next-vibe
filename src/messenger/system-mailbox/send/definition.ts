/**
 * Platform Mailbox - Send
 * One transactional email from the platform mailbox, filed in Sent.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { systemMailboxErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const SystemMailSendContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemMailSendContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "system-mailbox", "send"],
  aliases: ["system-mail-send"] as const,
  title: "send.title",
  titleShort: "send.titleShort",
  description: "send.description",
  category: "messenger",
  subCategory: "Providers",
  icon: "send",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SystemMailSendContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "send.fields.to.label",
        description: "send.fields.to.description",
        placeholder: "send.fields.to.placeholder",
        columns: 12,
        schema: z.string().min(3).max(320),
      }),
      subject: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "send.fields.subject.label",
        description: "send.fields.subject.description",
        placeholder: "send.fields.subject.placeholder",
        columns: 12,
        schema: z.string().min(1).max(300),
      }),
      body: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "send.fields.body.label",
        description: "send.fields.body.description",
        placeholder: "send.fields.body.placeholder",
        columns: 12,
        schema: z.string().min(1).max(100000),
      }),
      html: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "send.fields.html.label",
        description: "send.fields.html.description",
        placeholder: "send.fields.html.placeholder",
        columns: 12,
        schema: z.string().max(200000).optional(),
      }),

      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.messageId",
        schema: z.string(),
      }),
      from: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.from",
        schema: z.string(),
      }),
      toAddress: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.to",
        schema: z.string(),
      }),
      storedInSent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.storedInSent",
        schema: z.boolean(),
      }),
      sentFolder: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.sentFolder",
        schema: z.string().nullable(),
      }),
      sentLastHour: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.sentLastHour",
        schema: z.coerce.number(),
      }),
      rateLimitPerHour: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "send.response.rateLimitPerHour",
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: systemMailboxErrorTypes,

  successTypes: {
    title: "send.success.title",
    description: "send.success.description",
  },

  examples: {
    requests: {
      default: {
        to: "founder@example.com",
        subject: "Deploy finished",
        body: "Build 1234 is live.",
      },
    },
    responses: {
      default: {
        messageId: "<m1abc.x9y8z7@example.com>",
        from: "ops@example.com",
        toAddress: "founder@example.com",
        storedInSent: true,
        sentFolder: "Sent",
        sentLastHour: 1,
        rateLimitPerHour: 20,
      },
    },
  },
});

export type SystemMailSendRequestOutput = typeof POST.types.RequestOutput;
export type SystemMailSendResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;

/**
 * Platform Mailbox - Read one message
 * Full body of one INBOX message by UID. Never marks it as read.
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

const SystemMailMessageContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemMailMessageContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "system-mailbox", "message"],
  aliases: ["system-mail-read"] as const,
  title: "message.title",
  titleShort: "message.titleShort",
  description: "message.description",
  category: "messenger",
  subCategory: "Providers",
  icon: "mail-open",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SystemMailMessageContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      messageUid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "message.fields.uid.label",
        description: "message.fields.uid.description",
        placeholder: "message.fields.uid.placeholder",
        columns: 12,
        schema: z.coerce.number().int().min(1),
      }),

      uid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.uid",
        schema: z.coerce.number(),
      }),
      from: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.from",
        schema: z.string(),
      }),
      to: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.to",
        schema: z.string(),
      }),
      subject: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.subject",
        schema: z.string(),
      }),
      date: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.date",
        schema: z.string(),
      }),
      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.messageId",
        schema: z.string(),
      }),
      unread: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.unread",
        schema: z.boolean(),
      }),
      bodyText: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "message.response.bodyText",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: systemMailboxErrorTypes,

  successTypes: {
    title: "message.success.title",
    description: "message.success.description",
  },

  examples: {
    requests: { default: { messageUid: 42 } },
    responses: {
      default: {
        uid: 42,
        from: "Someone <someone@example.com>",
        to: "ops@example.com",
        subject: "Re: Deploy finished",
        date: "2026-11-07T08:00:00.000Z",
        messageId: "<abc@example.com>",
        unread: true,
        bodyText: "Thanks, looks good.\n",
      },
    },
  },
});

export type SystemMailMessageRequestOutput = typeof GET.types.RequestOutput;
export type SystemMailMessageResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;

/**
 * Platform Mailbox - Inbox
 * Recent INBOX messages of the platform mailbox (newest first).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { systemMailboxErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const SystemMailInboxContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemMailInboxContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "system-mailbox", "inbox"],
  aliases: ["system-mail-inbox"] as const,
  title: "inbox.title",
  titleShort: "inbox.titleShort",
  description: "inbox.description",
  category: "messenger",
  subCategory: "Providers",
  icon: "inbox",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SystemMailInboxContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "inbox.fields.limit.label",
        description: "inbox.fields.limit.description",
        placeholder: "inbox.fields.limit.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(50).default(20),
      }),
      unreadOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "inbox.fields.unreadOnly.label",
        description: "inbox.fields.unreadOnly.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      address: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "inbox.response.address",
        schema: z.string(),
      }),
      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "inbox.response.messages.title",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            uid: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.uid",
              schema: z.coerce.number(),
            }),
            from: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.from",
              schema: z.string(),
            }),
            subject: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.subject",
              schema: z.string(),
            }),
            date: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.date",
              schema: z.string(),
            }),
            snippet: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.snippet",
              schema: z.string(),
            }),
            unread: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "inbox.response.messages.unread",
              schema: z.boolean(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: systemMailboxErrorTypes,

  successTypes: {
    title: "inbox.success.title",
    description: "inbox.success.description",
  },

  examples: {
    requests: { default: { limit: 20, unreadOnly: false } },
    responses: {
      default: {
        address: "ops@example.com",
        messages: [
          {
            uid: 42,
            from: "Someone <someone@example.com>",
            subject: "Re: Deploy finished",
            date: "2026-11-07T08:00:00.000Z",
            snippet: "Thanks, looks good.",
            unread: true,
          },
        ],
      },
    },
  },
});

export type SystemMailInboxRequestOutput = typeof GET.types.RequestOutput;
export type SystemMailInboxResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;

/**
 * IMAP Client API Endpoints Definition
 * Main definition file for IMAP client endpoints - aggregates all IMAP operations
 */

import { z } from "zod";

import {
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

// IMAP Message Response Schema for shared use across endpoints - using objectField pattern for UI generation
export const imapMessageResponseField = objectField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.v1.core.emails.imapClient.messages.sync.title",
    description: "app.api.v1.core.emails.imapClient.messages.sync.description",
    layout: { type: LayoutType.GRID, columns: 12 },
  },
  { response: true },
  {
    id: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.id.tag",
      },
      z.uuid(),
    ),
    subject: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string(),
    ),
    senderEmail: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.email(),
    ),
    senderName: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable(),
    ),
    recipientEmail: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.email(),
    ),
    recipientName: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable(),
    ),
    sentAt: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable(),
    ),
    receivedAt: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable(),
    ),
    isRead: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean(),
    ),
    isFlagged: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean(),
    ),
    hasAttachments: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean(),
    ),
    folderName: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string(),
    ),
    accountId: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.tags.accounts",
      },
      z.uuid(),
    ),
    size: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.number().optional(),
    ),
    imapMessageId: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    imapUid: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.number().optional(),
    ),
    imapFolderId: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.uuid().optional(),
    ),
  },
);

// Legacy schema export for backward compatibility
export const imapMessageResponseSchema = z.object({
  id: z.uuid(),
  subject: z.string(),
  senderEmail: z.email(),
  senderName: z.string().nullable(),
  recipientEmail: z.email(),
  recipientName: z.string().nullable(),
  sentAt: z.string().nullable(),
  receivedAt: z.string().nullable(),
  isRead: z.boolean(),
  isFlagged: z.boolean(),
  hasAttachments: z.boolean(),
  folderName: z.string(),
  accountId: z.uuid(),
  size: z.number().optional(),
  imapMessageId: z.string().optional(),
  imapUid: z.number().optional(),
  imapFolderId: z.uuid().optional(),
});

// Export the message response types
export type ImapMessageResponseType = z.output<typeof imapMessageResponseField>;

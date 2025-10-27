/**
 * IMAP Client API Endpoints Definition
 * Main definition file for IMAP client endpoints - aggregates all IMAP operations
 */

import { z } from "zod";

import {
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

// IMAP Message Response Schema using objectField pattern
export const imapMessageResponseSchema = objectField(
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
    bodyText: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    bodyHtml: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    headers: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.record(z.string(), z.string()).optional(),
    ),
    isDeleted: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean().optional(),
    ),
    isDraft: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean().optional(),
    ),
    isAnswered: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.boolean().optional(),
    ),
    inReplyTo: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable().optional(),
    ),
    references: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable().optional(),
    ),
    threadId: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    messageSize: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.number().optional(),
    ),
    attachmentCount: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.number().optional(),
    ),
    lastSyncAt: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    syncStatus: responseField(
      {
        type: WidgetType.BADGE,
        text: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    syncError: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().nullable().optional(),
    ),
    createdAt: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
    updatedAt: responseField(
      {
        type: WidgetType.TEXT,
        content: "app.api.v1.core.emails.imapClient.messages.tag",
      },
      z.string().optional(),
    ),
  },
);

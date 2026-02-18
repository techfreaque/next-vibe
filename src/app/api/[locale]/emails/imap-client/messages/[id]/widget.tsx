/**
 * Custom Widget for IMAP Message Detail
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";
import type { ImapMessageByIdResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapMessageByIdResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start gap-2 py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground min-w-[130px] flex-shrink-0 pt-0.5">
        {label}
      </Span>
      <Span className="text-sm font-medium break-all">{value}</Span>
    </Div>
  );
}

export function ImapMessageDetailContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const email = field.value?.message;
  const t = useWidgetTranslation();
  const isLoading = field.value === null || field.value === undefined;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.messages.id.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : email === null || email === undefined ? (
        <Div className="p-8 text-center text-muted-foreground">
          {t("app.api.emails.imapClient.messages.id.notFound")}
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-4">
          {/* Subject + flags */}
          <Div className="flex items-start gap-3 flex-wrap">
            <Div className="flex-1 min-w-0">
              <Span className="font-bold text-lg block">{email.subject}</Span>
              <Div className="flex items-center gap-2 mt-1 flex-wrap">
                {!email.isRead && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {t("app.api.emails.imapClient.messages.id.unread")}
                  </Span>
                )}
                {email.isFlagged && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    {t("app.api.emails.imapClient.messages.id.flagged")}
                  </Span>
                )}
                {email.hasAttachments && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {t("app.api.emails.imapClient.messages.id.hasAttachments")}
                  </Span>
                )}
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {email.folderName}
                </Span>
              </Div>
            </Div>
          </Div>

          {/* Parties */}
          <Div className="rounded-lg border p-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("app.api.emails.imapClient.messages.id.parties")}
            </Span>
            <MetaRow
              label={t("app.api.emails.imapClient.messages.id.from")}
              value={
                <>
                  {email.senderEmail}
                  {email.senderName !== null &&
                    email.senderName !== undefined && (
                      <Span className="text-muted-foreground ml-1">
                        ({email.senderName})
                      </Span>
                    )}
                </>
              }
            />
            <MetaRow
              label={t("app.api.emails.imapClient.messages.id.to")}
              value={
                <>
                  {email.recipientEmail}
                  {email.recipientName !== null &&
                    email.recipientName !== undefined && (
                      <Span className="text-muted-foreground ml-1">
                        ({email.recipientName})
                      </Span>
                    )}
                </>
              }
            />
          </Div>

          {/* Timestamps */}
          <Div className="rounded-lg border p-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("app.api.emails.imapClient.messages.id.timestamps")}
            </Span>
            <MetaRow
              label={t("app.api.emails.imapClient.messages.id.sentAt")}
              value={
                email.sentAt !== null && email.sentAt !== undefined
                  ? email.sentAt
                  : "—"
              }
            />
            <MetaRow
              label={t("app.api.emails.imapClient.messages.id.receivedAt")}
              value={email.receivedAt}
            />
          </Div>

          {/* Body */}
          {email.bodyText !== null && email.bodyText !== undefined && (
            <Div className="rounded-lg border p-3">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("app.api.emails.imapClient.messages.id.body")}
              </Span>
              <Div className="text-sm whitespace-pre-wrap">
                {email.bodyText}
              </Div>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

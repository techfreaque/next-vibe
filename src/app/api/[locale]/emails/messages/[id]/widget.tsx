/**
 * Custom Widget for Email Message Detail
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import { EmailStatus } from "../enum";
import type definition from "./definition";
import type { EmailGetResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: EmailGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  [EmailStatus.SENT]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [EmailStatus.DELIVERED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [EmailStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [EmailStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [EmailStatus.BOUNCED]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [EmailStatus.OPENED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [EmailStatus.CLICKED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start gap-2 py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground min-w-[120px] flex-shrink-0 pt-0.5">
        {label}
      </Span>
      <Span className="text-sm font-medium break-all">{value}</Span>
    </Div>
  );
}

export function EmailDetailContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const email = field.value?.email;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const isLoading = field.value === null || field.value === undefined;

  const handleViewLead = (): void => {
    if (!email?.leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${email.leadId}/edit`);
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.messages.id.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : email === null || email === undefined ? (
        <Div className="p-8 text-center text-muted-foreground">
          {t("app.api.emails.messages.id.widget.notFound")}
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-4">
          {/* Subject + Status */}
          <Div className="flex items-start gap-3 flex-wrap">
            <Div className="flex-1 min-w-0">
              <Span className="font-bold text-lg block">{email.subject}</Span>
              <Div className="flex items-center gap-2 mt-1 flex-wrap">
                <Span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_COLORS[email.status] ??
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                  )}
                >
                  {t(email.status)}
                </Span>
                {email.type && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {t(email.type)}
                  </Span>
                )}
              </Div>
            </Div>
          </Div>

          {/* Parties */}
          <Div className="rounded-lg border p-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("app.api.emails.messages.id.widget.parties")}
            </Span>
            <MetaRow
              label={t("app.api.emails.messages.id.widget.to")}
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
            <MetaRow
              label={t("app.api.emails.messages.id.widget.from")}
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
          </Div>

          {/* Timestamps */}
          <Div className="rounded-lg border p-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("app.api.emails.messages.id.widget.timestamps")}
            </Span>
            <MetaRow
              label={t("app.api.emails.messages.id.widget.sentAt")}
              value={
                email.sentAt !== null && email.sentAt !== undefined
                  ? formatSimpleDate(email.sentAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("app.api.emails.messages.id.widget.deliveredAt")}
              value={
                email.deliveredAt !== null && email.deliveredAt !== undefined
                  ? formatSimpleDate(email.deliveredAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("app.api.emails.messages.id.widget.openedAt")}
              value={
                email.openedAt !== null && email.openedAt !== undefined
                  ? formatSimpleDate(email.openedAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("app.api.emails.messages.id.widget.clickedAt")}
              value={
                email.clickedAt !== null && email.clickedAt !== undefined
                  ? formatSimpleDate(email.clickedAt, locale as never)
                  : "—"
              }
            />
          </Div>

          {/* Technical details */}
          <Div className="rounded-lg border p-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("app.api.emails.messages.id.widget.technical")}
            </Span>
            {email.templateName !== null &&
              email.templateName !== undefined && (
                <MetaRow
                  label={t("app.api.emails.messages.id.widget.template")}
                  value={email.templateName}
                />
              )}
            {email.emailProvider !== null &&
              email.emailProvider !== undefined && (
                <MetaRow
                  label={t("app.api.emails.messages.id.widget.provider")}
                  value={email.emailProvider}
                />
              )}
            {email.externalId !== null && email.externalId !== undefined && (
              <MetaRow
                label={t("app.api.emails.messages.id.widget.externalId")}
                value={email.externalId}
              />
            )}
            <MetaRow
              label={t("app.api.emails.messages.id.widget.retryCount")}
              value={String(email.retryCount)}
            />
            {email.error !== null && email.error !== undefined && (
              <MetaRow
                label={t("app.api.emails.messages.id.widget.error")}
                value={<Div style={{ color: "#ef4444" }}>{email.error}</Div>}
              />
            )}
          </Div>

          {/* Associations */}
          {((email.leadId !== null && email.leadId !== undefined) ||
            (email.userId !== null && email.userId !== undefined)) && (
            <Div className="rounded-lg border p-3">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("app.api.emails.messages.id.widget.associations")}
              </Span>
              {email.leadId !== null && email.leadId !== undefined && (
                <Div className="flex items-center gap-2">
                  <Span className="text-xs text-muted-foreground min-w-[120px]">
                    {t("app.api.emails.messages.id.widget.lead")}
                  </Span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-sm"
                    onClick={handleViewLead}
                  >
                    {email.leadId}
                  </Button>
                </Div>
              )}
              {email.userId !== null && email.userId !== undefined && (
                <MetaRow
                  label={t("app.api.emails.messages.id.widget.user")}
                  value={email.userId}
                />
              )}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

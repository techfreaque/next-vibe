/**
 * Custom Widget for Email Message Detail
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import { MessageStatus } from "../enum";
import type definition from "./definition";
import type { EmailGetResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: EmailGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

const STATUS_COLORS: Record<string, string> = {
  [MessageStatus.SENT]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [MessageStatus.DELIVERED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [MessageStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [MessageStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [MessageStatus.BOUNCED]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [MessageStatus.OPENED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [MessageStatus.CLICKED]:
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
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const isLoading = field.value === null || field.value === undefined;

  const handleViewLead = (): void => {
    if (!email?.leadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef =
        await import("@/app/api/[locale]/leads/lead/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: email.leadId! } });
    })();
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">{t("title")}</Span>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : email === null || email === undefined ? (
        <Div className="p-8 text-center text-muted-foreground">
          {t("widget.notFound")}
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
              {t("widget.parties")}
            </Span>
            <MetaRow
              label={t("widget.to")}
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
              label={t("widget.from")}
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
              {t("widget.timestamps")}
            </Span>
            <MetaRow
              label={t("widget.sentAt")}
              value={
                email.sentAt !== null && email.sentAt !== undefined
                  ? formatSimpleDate(email.sentAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("widget.deliveredAt")}
              value={
                email.deliveredAt !== null && email.deliveredAt !== undefined
                  ? formatSimpleDate(email.deliveredAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("widget.openedAt")}
              value={
                email.openedAt !== null && email.openedAt !== undefined
                  ? formatSimpleDate(email.openedAt, locale as never)
                  : "—"
              }
            />
            <MetaRow
              label={t("widget.clickedAt")}
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
              {t("widget.technical")}
            </Span>
            {email.templateName !== null &&
              email.templateName !== undefined && (
                <MetaRow
                  label={t("widget.template")}
                  value={email.templateName}
                />
              )}
            <MetaRow
              label={t("widget.retryCount")}
              value={String(email.retryCount)}
            />
            {email.error !== null && email.error !== undefined && (
              <MetaRow
                label={t("widget.error")}
                value={<Div style={{ color: "#ef4444" }}>{email.error}</Div>}
              />
            )}
          </Div>

          {/* Associations */}
          {((email.leadId !== null && email.leadId !== undefined) ||
            (email.userId !== null && email.userId !== undefined)) && (
            <Div className="rounded-lg border p-3">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("widget.associations")}
              </Span>
              {email.leadId !== null && email.leadId !== undefined && (
                <Div className="flex items-center gap-2">
                  <Span className="text-xs text-muted-foreground min-w-[120px]">
                    {t("widget.lead")}
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
                <MetaRow label={t("widget.user")} value={email.userId} />
              )}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

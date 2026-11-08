/**
 * Notifications list widget - unread first, click to open the result.
 * One widget for every surface: Div/Span/Link resolve per platform.
 */

"use client";

import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Bell } from "next-vibe/ui/components/icons/Bell";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { PaginationWidget } from "next-vibe/unified-ui/widgets/containers/pagination/widget";

import readDefinitions from "../read/definition";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function NotificationsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();

  const items = value?.notifications ?? [];
  const unreadCount = value?.unreadCount ?? 0;
  const paginationInfo = value?.paginationInfo;

  const markRead = (body: { id?: string; all?: boolean }): void => {
    void apiClient.mutate(
      readDefinitions.POST,
      logger,
      user,
      body,
      undefined,
      locale,
    );
  };

  return (
    <WidgetShell className="gap-4">
      <Div className="flex items-center justify-between gap-3">
        <Span className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} ${t("list.get.unread")}`
            : t("list.get.emptyTitle")}
        </Span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              markRead({ all: true });
            }}
          >
            {t("list.get.markAllRead")}
          </Button>
        )}
      </Div>

      {items.length > 0 ? (
        <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm">
          {items.map((item) => {
            const row = (
              <Div
                className={cn(
                  "flex items-start gap-3 px-4 py-3.5 sm:px-5",
                  !item.read && "bg-primary/5",
                )}
              >
                <Span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    item.read ? "bg-transparent" : "bg-primary",
                  )}
                />
                <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Span
                    className={cn(
                      "text-sm",
                      item.read ? "font-normal" : "font-semibold",
                    )}
                  >
                    {item.title}
                  </Span>
                  {item.body && (
                    <Span className="text-xs text-muted-foreground">
                      {item.body}
                    </Span>
                  )}
                  <Span className="text-xs text-muted-foreground">
                    {formatSimpleDate(item.createdAt, locale)}
                  </Span>
                </Div>
              </Div>
            );
            return item.link ? (
              <Link
                key={item.id}
                href={`/${locale}${item.link}`}
                onClick={() => {
                  if (!item.read) {
                    markRead({ id: item.id });
                  }
                }}
              >
                {row}
              </Link>
            ) : (
              <Div key={item.id}>{row}</Div>
            );
          })}
        </Div>
      ) : (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <Span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Span>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {t("list.get.emptyTitle")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("list.get.emptyHint")}
            </Span>
          </Div>
        </Div>
      )}

      {paginationInfo && items.length > 0 && (
        <PaginationWidget
          field={withValue(
            field.children.paginationInfo,
            paginationInfo,
            value,
          )}
          fieldName={"paginationInfo"}
        />
      )}
    </WidgetShell>
  );
}

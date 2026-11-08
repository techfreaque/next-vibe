"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Bell } from "next-vibe/ui/components/icons/Bell";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import { P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import type { JSX } from "react";

import { useNotificationBell } from "@/notifications/hooks";
import { NotificationType } from "@/notifications/enum";
import { scopedTranslation } from "@/notifications/i18n";

function TypeIcon({ type }: { type: string }): JSX.Element {
  switch (type) {
    case NotificationType.TASK_COMPLETE:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case NotificationType.TASK_FAILED:
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case NotificationType.EARNING:
    case NotificationType.CREDIT_LOW:
      return <Coins className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

export function Notifications({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const bell = useNotificationBell(user, logger, locale);

  if (user.isPublic) {
    return null;
  }

  const hasUnread = bell.unreadCount > 0;

  return (
    <TooltipProvider>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            void bell.loadItems();
          }
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={t("bell.label")}
                className="relative h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg group"
              >
                <Bell
                  className={`h-5 w-5 transition-colors duration-200 ${
                    hasUnread
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                />
                {hasUnread && (
                  <Badge
                    variant="notification"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center font-medium border-2 border-white dark:border-gray-800"
                  >
                    {Math.min(99, bell.unreadCount)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <P>{t("bell.label")}</P>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="end"
          className="w-80 bg-white dark:bg-gray-900 shadow-md border rounded-md"
        >
          <Div className="flex items-center justify-between px-3 py-2">
            <Span className="text-sm font-semibold">{t("bell.label")}</Span>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void bell.markAllRead();
                }}
              >
                {t("bell.markAllRead")}
              </Button>
            )}
          </Div>
          <DropdownMenuSeparator />
          {bell.items.length === 0 ? (
            <Div className="px-3 py-6 text-center">
              <P className="text-sm text-gray-500 dark:text-gray-400">
                {bell.isLoading ? t("bell.loading") : t("bell.empty")}
              </P>
            </Div>
          ) : (
            bell.items.map((item) => {
              const content = (
                <DropdownMenuItem
                  className="flex items-start gap-2 cursor-pointer"
                  onClick={() => {
                    if (!item.read) {
                      void bell.markRead(item.id);
                    }
                  }}
                >
                  <Div className="mt-0.5">
                    <TypeIcon type={item.type} />
                  </Div>
                  <Div className="min-w-0 flex-1">
                    <Span
                      className={
                        item.read ? "text-sm" : "text-sm font-semibold"
                      }
                    >
                      {item.title}
                    </Span>
                    {item.body && (
                      <P className="text-xs text-gray-500 dark:text-gray-400">
                        {item.body}
                      </P>
                    )}
                  </Div>
                  {!item.read && (
                    <Span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
              );
              return item.link ? (
                <Link
                  key={item.id}
                  href={`/${locale}${item.link}`}
                  className="w-full"
                >
                  {content}
                </Link>
              ) : (
                <Div key={item.id}>{content}</Div>
              );
            })
          )}
          <DropdownMenuSeparator />
          <Link href={`/${locale}/tools/notifications`} className="w-full">
            <DropdownMenuItem className="justify-center text-sm cursor-pointer">
              {t("bell.viewAll")}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

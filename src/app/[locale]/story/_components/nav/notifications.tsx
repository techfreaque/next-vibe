import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Link } from "next-vibe-ui/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import type { ScopedKey } from "../i18n";
import { scopedTranslation } from "../i18n";

export function Notifications({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const unreadNotifications: {
    title: ScopedKey;
    description: ScopedKey;
    level: "info" | "success" | "warning" | "error";
    href: string;
  }[] = [
    {
      title: "nav.welcomeNotification.title",
      description: "nav.welcomeNotification.description",
      level: "info",
      href: "/",
    },
  ]; // TODO: create notifications repository in api folder
  const unreadNotificationCount = unreadNotifications?.length;
  return (
    <TooltipProvider>
      <DropdownMenu>
        <NotificationButton notificationCount={unreadNotificationCount} t={t} />
        <DropdownMenuContent
          align="end"
          className="w-72 bg-white dark:bg-gray-900 shadow-md border rounded-md"
        >
          {unreadNotifications.map((childItem, index) => (
            <Link
              key={index}
              href={`/${locale}${childItem.href}`}
              className="w-full font-medium"
            >
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                {childItem.level === "info" ? (
                  <Info className="h-4 w-4 text-blue-500" />
                ) : childItem.level === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : childItem.level === "warning" ? (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                ) : childItem.level === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Bell className="h-4 w-4 text-gray-500" />
                )}
                <Div>
                  {t(childItem.title)}
                  <P className="text-xs text-gray-500 dark:text-gray-400">
                    {t(childItem.description)}
                  </P>
                </Div>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

function NotificationButton({
  notificationCount,
  t,
}: {
  notificationCount: number | undefined;
  t: (key: ScopedKey) => TranslatedKeyType;
}): JSX.Element {
  const hasNotifications = notificationCount && notificationCount > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg group"
          >
            <Bell
              className={`h-5 w-5 transition-colors duration-200 ${
                hasNotifications
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}
            />
            {hasNotifications && (
              <Badge
                variant="notification"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center font-medium border-2 border-white dark:border-gray-800"
              >
                {Math.min(99, notificationCount)}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <P>{t("nav.notifications")}</P>
      </TooltipContent>
    </Tooltip>
  );
}

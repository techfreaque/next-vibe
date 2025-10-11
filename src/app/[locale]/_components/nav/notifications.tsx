import { AlertCircle, Bell, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

export function Notifications({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user, // TODO: Use user for personalized notifications
  locale,
}: {
  user: StandardUserType;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const unreadNotifications: {
    title: TranslationKey;
    description: TranslationKey;
    level: "info" | "success" | "warning" | "error";
    href: string;
  }[] = [
    {
      title: "common.api.notifications.welcome.title",
      description: "common.api.notifications.welcome.description",
      level: "info",
      href: "/app/onboarding",
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
                <div>
                  {t(childItem.title)}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t(childItem.description)}
                  </p>
                </div>
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
  t: TFunction;
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
                {notificationCount > 99
                  ? // eslint-disable-next-line i18next/no-literal-string
                    "99+"
                  : String(notificationCount)}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("nav.notifications")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

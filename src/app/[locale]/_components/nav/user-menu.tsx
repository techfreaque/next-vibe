"use client";

import { HelpCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import type { JSX } from "react";

import { useLogout } from "@/app/api/[locale]/v1/core/user/private/logout/hooks";
import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserMenuProps {
  user: StandardUserType;
  locale: CountryLanguage;
  isOnboardingComplete: boolean;
}

export function UserMenu({
  user,
  locale,
  isOnboardingComplete,
}: UserMenuProps): JSX.Element {
  const { t } = simpleT(locale);
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.imageUrl || undefined}
              alt={getUserDisplayName(user)}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName(user)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={
              isOnboardingComplete
                ? `/${locale}/app/dashboard`
                : `/${locale}/app/onboarding`
            }
          >
            {isOnboardingComplete ? (
              <>
                <User className="mr-2 h-4 w-4" />
                <span>{t("nav.user.dashboard")}</span>
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4 text-orange-500" />
                <span className="text-orange-600 dark:text-orange-400">
                  {t("nav.user.completeOnboarding")}
                </span>
              </>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/help`}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>{t("app.components.nav.help")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("app.components.nav.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const getUserDisplayName = (user: StandardUserType): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.email;
};

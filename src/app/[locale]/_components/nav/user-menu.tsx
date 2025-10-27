"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Div,
  P,
  Span,
} from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { HelpCircle, LogOut, User } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/definition";
import { useLogout } from "@/app/api/[locale]/v1/core/user/private/logout/hooks";
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
  const logger = createEndpointLogger(false, Date.now(), locale);
  const logout = useLogout(logger);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={getUserDisplayName(user)} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <Div className="flex flex-col space-y-1">
            <P className="text-sm font-medium leading-none">
              {getUserDisplayName(user)}
            </P>
            <P className="text-xs leading-none text-muted-foreground">
              {user.email}
            </P>
          </Div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={
              isOnboardingComplete ? `/${locale}/app/dashboard` : `/${locale}/`
            }
          >
            {isOnboardingComplete ? (
              <>
                <User className="mr-2 h-4 w-4" />
                <Span>{t("app.nav.user.dashboard")}</Span>
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4 text-orange-500" />
                <Span className="text-orange-600 dark:text-orange-400">
                  {t("app.nav.user.completeOnboarding")}
                </Span>
              </>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/help`}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <Span>{t("app.nav.help")}</Span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <Span>{t("app.nav.logout")}</Span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const getUserDisplayName = (user: StandardUserType): string => {
  return user.privateName || user.email;
};

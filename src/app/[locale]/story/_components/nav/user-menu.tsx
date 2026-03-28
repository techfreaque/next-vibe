"use client";

import { Avatar, AvatarFallback } from "next-vibe-ui/ui/avatar";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { HelpCircle } from "next-vibe-ui/ui/icons/HelpCircle";
import { LogOut } from "next-vibe-ui/ui/icons/LogOut";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { User } from "next-vibe-ui/ui/icons/User";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useLogout } from "@/app/api/[locale]/user/private/logout/hooks";
import type { StandardUserType } from "@/app/api/[locale]/user/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

interface UserMenuProps {
  user: JwtPayloadType;
  userProfile: StandardUserType | undefined;
  locale: CountryLanguage;
  hasSubscription: boolean;
}

export function UserMenu({
  user,
  userProfile,
  locale,
}: UserMenuProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const logout = useLogout(logger, user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {userProfile && (
          <DropdownMenuLabel className="font-normal">
            <Div className="flex flex-col gap-1">
              <P className="text-sm font-medium leading-none">
                {userProfile.privateName || userProfile.email}
              </P>
              <P className="text-xs leading-none text-muted-foreground">
                {userProfile.email}
              </P>
            </Div>
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${locale}/threads`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <Span>{t("nav.goToApp")}</Span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${locale}/subscription`}>
            <Settings className="mr-2 h-4 w-4" />
            <Span>{t("nav.pricing")}</Span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${locale}/help`}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <Span>{t("nav.help")}</Span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <Span>{t("nav.logout")}</Span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

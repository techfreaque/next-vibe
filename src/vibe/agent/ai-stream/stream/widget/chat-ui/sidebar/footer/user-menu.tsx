"use client";

import { scopedTranslation } from "next-vibe/agent/chat/threads/widget/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Button } from "next-vibe/ui/ui/button";
import { LogOut } from "next-vibe/ui/ui/icons/LogOut";
import { User } from "next-vibe/ui/ui/icons/User";
import { Link } from "next-vibe/ui/ui/link";
import type { JSX } from "react";

import { useLogout } from "@/user/private/logout/hooks";

import { TOUR_DATA_ATTRS } from "../../welcome-tour/tour-config";

interface UserMenuProps {
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function UserMenu({ user, locale, logger }: UserMenuProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logout = useLogout(logger, user);
  return !user || user.isPublic ? (
    <Link href={`/${locale}/user/login`}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        data-tour={TOUR_DATA_ATTRS.SIDEBAR_LOGIN}
      >
        <User className="h-3.5 w-3.5 mr-2" />
        {t("components.sidebar.login")}
      </Button>
    </Link>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={logout}
    >
      <LogOut className="h-3.5 w-3.5 mr-2" />
      {t("components.sidebar.logout")}
    </Button>
  );
}

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { LogOut, User } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useLogout } from "@/app/api/[locale]/user/private/logout/hooks";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../../../i18n";

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

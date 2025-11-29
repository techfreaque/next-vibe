"use client";

import { Button } from "next-vibe-ui/ui/button";
import { LogOut, User } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { useLogout } from "@/app/api/[locale]/v1/core/user/private/logout/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserMenuProps {
  user: JwtPayloadType | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function UserMenu({ user, locale, logger }: UserMenuProps): JSX.Element {
  const { t } = simpleT(locale);
  const logout = useLogout(logger);
  return !user || user.isPublic ? (
    <Link href={`/${locale}/user/login`}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start h-8 px-2"
      >
        <User className="h-3.5 w-3.5 mr-2" />
        {t("app.chat.components.sidebar.login")}
      </Button>
    </Link>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start h-8 px-2"
      onClick={logout}
    >
      <LogOut className="h-3.5 w-3.5 mr-2" />
      {t("app.chat.components.sidebar.logout")}
    </Button>
  );
}

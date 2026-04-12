import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

interface AuthButtonsProps {
  locale: CountryLanguage;
}

export function AuthButtons({ locale }: AuthButtonsProps): JSX.Element {
  if (envClient.NEXT_PUBLIC_LOCAL_MODE) {
    return <></>;
  }

  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex items-center gap-2">
      {/* Login - hidden on mobile, shown md+ */}
      <Button variant="ghost" asChild className="hidden md:inline-flex">
        <Link href={`/${locale}/user/login`}>{t("nav.user.login")}</Link>
      </Button>
      {/* Signup - always visible, compact on mobile */}
      <Button asChild size="sm">
        <Link href={`/${locale}/user/signup`}>{t("nav.user.signup")}</Link>
      </Button>
    </Div>
  );
}

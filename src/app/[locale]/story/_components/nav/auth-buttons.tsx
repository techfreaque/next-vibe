import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AuthButtonsProps {
  locale: CountryLanguage;
}

export function AuthButtons({ locale }: AuthButtonsProps): JSX.Element {
  if (envClient.NEXT_PUBLIC_LOCAL_MODE) {
    return <></>;
  }

  const { t } = simpleT(locale);

  return (
    <Div className="flex items-center gap-2">
      {/* Login — hidden on mobile, shown md+ */}
      <Button variant="ghost" asChild className="hidden md:inline-flex">
        <Link href={`/${locale}/user/login`}>
          {t("app.story._components.nav.user.login")}
        </Link>
      </Button>
      {/* Signup — always visible, compact on mobile */}
      <Button
        asChild
        size="sm"
        className="bg-blue-600 bg-linear-to-br from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 md:text-sm md:h-10 md:px-4 md:py-2"
      >
        <Link href={`/${locale}/user/signup`}>
          {t("app.story._components.nav.user.signup")}
        </Link>
      </Button>
    </Div>
  );
}

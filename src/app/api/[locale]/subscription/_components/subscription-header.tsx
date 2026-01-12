import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface SubscriptionHeaderProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
}

export function SubscriptionHeader({
  locale,
  isAuthenticated,
}: SubscriptionHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Div className="flex justify-between items-center mb-6 gap-4">
      <Link
        href={`/${locale}`}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("app.subscription.subscription.backToChat")}
      </Link>

      {/* Auth Buttons for Public Users */}
      {!isAuthenticated && (
        <Div className="flex gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href={`/${locale}/user/login`}>
              {t("app.story._components.nav.user.login")}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 bg-linear-to-br from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
          >
            <Link href={`/${locale}/user/signup`}>
              {t("app.story._components.nav.user.signup")}
            </Link>
          </Button>
        </Div>
      )}
    </Div>
  );
}

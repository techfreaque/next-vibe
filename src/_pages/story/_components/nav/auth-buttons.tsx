import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { VibeMode } from "next-vibe/env/env-util";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import type { JSX } from "react";

import { scopedTranslation } from "../i18n";

interface AuthButtonsProps {
  locale: CountryLanguage;
}

export function AuthButtons({ locale }: AuthButtonsProps): JSX.Element {
  if (envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.AGENT) {
    return <></>;
  }

  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex items-center gap-2">
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="hidden h-9 sm:inline-flex"
      >
        <Link href={`/${locale}/user/login`}>{t("nav.user.login")}</Link>
      </Button>
      {/* Chatting needs no account - the primary action is the product itself */}
      <Button asChild size="sm" className="h-10 px-3.5 sm:h-9">
        <Link href={`/${locale}/threads`}>{t("nav.startChatting")}</Link>
      </Button>
    </Div>
  );
}

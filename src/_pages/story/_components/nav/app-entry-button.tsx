import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { scopedTranslation } from "../i18n";

interface AppEntryButtonProps {
  locale: CountryLanguage;
}

/**
 * One-click path into the chat app for returning/logged-in users.
 * Primary action in the marketing navbar - distinct from the account
 * avatar menu, which handles profile/settings/logout. Routes straight
 * to the threads app, no marketing detour. Icon-only below sm so the
 * mobile bar never overflows; labelled from sm up.
 */
export function AppEntryButton({ locale }: AppEntryButtonProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Button
      asChild
      size="sm"
      className="h-9 px-2.5 sm:px-3"
      aria-label={t("nav.goToApp")}
    >
      <Link href={`/${locale}/threads`}>
        <MessageSquare className="h-4 w-4" />
        <Span className="hidden sm:inline">{t("nav.goToApp")}</Span>
      </Link>
    </Button>
  );
}

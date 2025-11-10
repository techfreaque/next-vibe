"use client";

import { Printer } from 'next-vibe-ui/ui/icons';
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { ReactElement } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface PrivacyPolicyClientInteractionProps {
  locale: CountryLanguage;
}

const handlePrint = (): void => {
  window.print();
};

/**
 * Client component for handling user interactions on the Privacy Policy page.
 * This is separated from the main content rendering to minimize client-side JavaScript.
 */
export function PrivacyPolicyClientInteraction({
  locale,
}: PrivacyPolicyClientInteractionProps): ReactElement {
  const { t } = simpleT(locale);

  return (
    <Div className="flex justify-end mb-8">
      <Button
        variant="ghost"
        size="unset"
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors"
        aria-label={t("app.story.privacyPolicy.printAriaLabel")}
      >
        <Printer className="h-4 w-4" />
        <Span>{t("app.story.privacyPolicy.printButton")}</Span>
      </Button>
    </Div>
  );
}

"use client";

import { Printer } from "lucide-react";
import type { ReactElement } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface TermsClientInteractionProps {
  locale: CountryLanguage;
}

/**
 * Client component for handling user interactions on the Terms of Service page.
 * This is separated from the main content rendering to minimize client-side JavaScript.
 */
export function TermsClientInteraction({
  locale,
}: TermsClientInteractionProps): ReactElement {
  const { t } = simpleT(locale);

  // This component is kept minimal since there's limited interactivity
  // needed for the Terms of Service page.
  // You could add interactive elements here such as:
  // - Section collapsing/expanding
  // - Print functionality
  // - Copy link to section
  // - etc.

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors"
        aria-label={t("app.story.termsOfService.printAriaLabel")}
      >
        <Printer className="h-4 w-4" />
        {t("app.story.termsOfService.printButton")}
      </button>
    </div>
  );
}

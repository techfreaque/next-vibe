"use client";

import { Printer } from "lucide-react";
import type { ReactElement } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ImprintClientInteractionProps {
  locale: CountryLanguage;
}

/**
 * Client component for handling user interactions on the Imprint page.
 * This is separated from the main content rendering to minimize client-side JavaScript.
 */
export function ImprintClientInteraction({
  locale,
}: ImprintClientInteractionProps): ReactElement {
  const { t } = simpleT(locale);

  // This component is kept minimal since there's limited interactivity
  // needed for the Imprint page.
  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-md text-blue-700 dark:text-blue-300 transition-colors"
        aria-label={t("app.site.imprint.printAriaLabel")}
      >
        <Printer className="h-4 w-4" />
        <span>{t("app.site.imprint.printButton")}</span>
      </button>
    </div>
  );
}

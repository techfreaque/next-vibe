"use client";

import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { type CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function SupportButton({
  supportEmail,
  locale,
}: {
  supportEmail: string;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <P>
      {t("config.group.contact.description")}{" "}
      <button
        onClick={() => {
          window.location.href = `mailto:${supportEmail}`;
        }}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
      >
        {supportEmail}
      </button>
      .
    </P>
  );
}

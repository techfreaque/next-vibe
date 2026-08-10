"use client";

import { type CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { P } from "next-vibe/ui/components/typography";
import { assignUrl } from "next-vibe/ui/lib/location";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

export function SupportButton({
  supportEmail,
  locale,
}: {
  supportEmail: string;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = configScopedTranslation.scopedT(locale);
  return (
    <P>
      {t("group.contact.description")}{" "}
      <Button
        variant="ghost"
        size="unset"
        onClick={() => {
          assignUrl(`mailto:${supportEmail}`);
        }}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
      >
        {supportEmail}
      </Button>
      .
    </P>
  );
}

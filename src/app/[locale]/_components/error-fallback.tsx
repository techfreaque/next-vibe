"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { useTranslation } from "@/i18n/core/client";
import { configScopedTranslation } from "@/config/i18n";

export default function ErrorFallback(): React.JSX.Element {
  const { locale } = useTranslation();
  const { t } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <H2 className="text-2xl font-bold mb-4">{t("error.title")}</H2>
      <P className="mb-6">{t("error.message")}</P>
      <Button onClick={() => window.location.reload()} className="px-4 py-2">
        {t("error.tryAgain")}
      </Button>
    </Div>
  );
}

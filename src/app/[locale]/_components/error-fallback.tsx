"use client";

import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";

import { useTranslation } from "@/i18n/core/client";

export default function ErrorFallback(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <H2 className="text-2xl font-bold mb-4">{t("app.common.error.title")}</H2>
      <P className="mb-6">{t("app.common.error.message")}</P>
      <Button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t("app.common.error.tryAgain")}
      </Button>
    </Div>
  );
}

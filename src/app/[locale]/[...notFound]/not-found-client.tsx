"use client";

import { Button, Span } from "next-vibe-ui/ui";
import { ChevronLeft } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function NotFoundBackButton({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Button variant="outline" asChild className="group">
      <Span>
        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t("app.pages.notFound.goBack")}
      </Span>
    </Button>
  );
}

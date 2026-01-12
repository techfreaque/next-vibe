"use client";

import { Button } from "next-vibe-ui/ui/button";
import { ChevronLeft } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
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
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("app.pages.notFound.goBack")}
      </Span>
    </Button>
  );
}

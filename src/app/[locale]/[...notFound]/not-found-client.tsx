"use client";

import { MoveLeft } from "lucide-react";
import { Button } from "next-vibe-ui/ui";
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
      <span>
        <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t("pages.notFound.goBack")}
      </span>
    </Button>
  );
}

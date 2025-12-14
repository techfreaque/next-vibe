"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import type { CountryLanguage } from "@/i18n/core/config";

interface ChatBrandingProps {
  locale: CountryLanguage;
}

/**
 * Logo/branding display for the chat interface.
 * Only shown in linear and debug views when there are messages.
 * Uses zero-height container to overlay the logo without affecting layout.
 */
export function ChatBranding({ locale }: ChatBrandingProps): JSX.Element {
  return (
    <Div className="w-full h-0">
      <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15">
        <Div className="flex bg-background/20 backdrop-blur rounded-lg p-2 shadow-sm border border-border/20 w-fit z-10">
          <Logo locale={locale} disabled size="h-10" />
        </Div>
      </Div>
    </Div>
  );
}

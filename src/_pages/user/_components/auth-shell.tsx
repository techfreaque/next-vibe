"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { Link } from "next-vibe/ui/components/link";
import { Main } from "next-vibe/ui/components/main";
import type { JSX, ReactNode } from "react";

import { Logo } from "@/_pages/_components/logo";
import { scopedTranslation } from "@/_pages/user/(auth)/i18n";

/**
 * Focused auth shell: back link, centred logo, one card, quiet legal footer.
 * The pages render only their card.
 */
export function AuthShell({ children }: { children?: ReactNode }): JSX.Element {
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  const legalLinks = [
    { href: `/${locale}/story/terms-of-service`, label: t("terms") },
    { href: `/${locale}/story/privacy-policy`, label: t("privacy") },
    { href: `/${locale}/story/imprint`, label: t("imprint") },
  ];

  return (
    <Main className="flex min-h-screen flex-col bg-background">
      <Div className="flex h-14 items-center px-4 sm:px-6">
        <Link
          href={`/${locale}/threads`}
          className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </Div>

      <Div className="flex flex-1 flex-col items-center px-4 pb-10 pt-2 sm:pt-8">
        <Div className="mb-6 flex justify-center sm:mb-8">
          <Logo locale={locale} size="h-9" />
        </Div>
        <Div className="w-full max-w-md">{children}</Div>
      </Div>

      <Div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pb-8 text-xs text-muted-foreground">
        {legalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="no-underline transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </Div>
    </Main>
  );
}

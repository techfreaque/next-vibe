"use client";

import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

// Lazy-load the skills content to avoid circular dependency TDZ in SSR.
// skills/definition.ts has a heavy import tree that creates cycles when
// imported at module top-level from a page component.
const SkillsContent = lazy(() => import("./skills-content"));

interface SkillsPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function SkillsPageClient({
  locale,
  user,
}: SkillsPageClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="bg-background">
      <Div className="container max-w-4xl mx-auto py-6 px-4">
        <Link
          href={`/${locale}/threads/private/new`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("backToChat")}
        </Link>

        <Div className="flex items-center gap-3 mb-2">
          <Zap className="h-6 w-6 text-primary" />
          <H1 className="text-2xl font-bold">{t("title")}</H1>
        </Div>
        <P className="text-muted-foreground mb-6">{t("description")}</P>

        <Div className="rounded-xl border bg-card overflow-hidden">
          <Suspense fallback={null}>
            <SkillsContent locale={locale} user={user} />
          </Suspense>
        </Div>
      </Div>
    </Div>
  );
}

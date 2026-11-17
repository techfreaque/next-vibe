"use client";

import type { SkillListResponseOutput } from "next-vibe/agent/skills/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Link } from "next-vibe/ui/components/link";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

import { scopedTranslation } from "./i18n";

// Lazy-load the skills content to avoid circular dependency TDZ in SSR.
// skills/definition.ts has a heavy import tree that creates cycles when
// imported at module top-level from a page component.
const SkillsContent = lazy(() => import("./skills-content"));

interface SkillsPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  initialData: SkillListResponseOutput | undefined;
}

/** Shown while the skills chunk loads - never a blank card. */
function SkillsSkeleton(): JSX.Element {
  return (
    <Div className="flex flex-col gap-3 p-4" aria-busy="true">
      <Skeleton className="h-9 w-full" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </Div>
        </Div>
      ))}
    </Div>
  );
}

/**
 * Server-rendered stand-in while the skills chunk loads: a plain list of
 * skill landing-page links, so the first HTML (and crawlers) already carry
 * every built-in skill.
 */
function SkillsLinkList({
  locale,
  initialData,
}: {
  locale: CountryLanguage;
  initialData: SkillListResponseOutput;
}): JSX.Element {
  // One link per skill: variant rows ("<skill>__<variant>") share a page.
  const seen = new Set<string>();
  const skills = initialData.sections
    .flatMap((section) => section.skills)
    .map((skill) => ({ ...skill, baseId: skill.skillId.split("__")[0] ?? "" }))
    .filter((skill) => {
      if (skill.baseId === "" || seen.has(skill.baseId)) {
        return false;
      }
      seen.add(skill.baseId);
      return true;
    });
  return (
    <Div className="flex flex-col divide-y divide-border" aria-busy="true">
      {skills.map((skill) => (
        <Link
          key={skill.baseId}
          href={`/${locale}/skill/${skill.baseId}`}
          className="flex flex-col gap-0.5 p-4 hover:bg-muted/50"
        >
          <Span className="font-medium text-foreground">{skill.name}</Span>
          {skill.tagline ? (
            <Span className="text-sm text-muted-foreground">
              {skill.tagline}
            </Span>
          ) : null}
        </Link>
      ))}
    </Div>
  );
}

export function SkillsPageClient({
  locale,
  user,
  platform,
  initialData,
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

        {/* overflow-clip (not hidden) keeps the sticky header inside working */}
        <Div className="rounded-xl border bg-card overflow-clip">
          <Suspense
            fallback={
              initialData === undefined ? (
                <SkillsSkeleton />
              ) : (
                <SkillsLinkList locale={locale} initialData={initialData} />
              )
            }
          >
            <SkillsContent
              locale={locale}
              user={user}
              platform={platform}
              initialData={initialData}
            />
          </Suspense>
        </Div>
      </Div>
    </Div>
  );
}

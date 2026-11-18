/**
 * Public Skill Landing Page
 * URL: /[locale]/skill/[skillId]   (variant URLs: /skill/<skill>__<variant>)
 *
 * Server-rendered landing: hero with real sample answers, the model that runs
 * the skill, example prompts that open the chat, related skills. Everything a
 * crawler needs is in the initial HTML. Data + metadata live in ./loader.ts;
 * this file stays thin so the client bundle never sees server code.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { coreClientEnv } from "next-vibe/core/env-client";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import type { JSX } from "react";

import { Logo } from "../../_components/logo";
import { ThemeToggle } from "../../_components/theme-toggle";
import { TanstackPage as SiteLayoutPage } from "../../story/layout";
import { selectSkillPageDesign } from "./design-selection";
import { scopedTranslation } from "./i18n";
import type { SkillLandingPageData, SkillPageProps } from "./loader";
import { loadSkillLandingPage, loadSkillPageMetadata } from "./loader";
import { SkillLandingPage } from "./page-client";

export type { SkillLandingPageData } from "./loader";

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  return loadSkillPageMetadata({ params });
}

export async function tanstackLoader({
  params,
  searchParams,
}: SkillPageProps): Promise<SkillLandingPageData | null> {
  return loadSkillLandingPage({ params, searchParams });
}

export function TanstackPage(data: SkillLandingPageData): JSX.Element {
  const preview = selectSkillPageDesign(
    coreClientEnv.NODE_ENV,
    data.design ?? undefined,
  );
  const { t } = scopedTranslation.scopedT(data.locale);
  return (
    <SiteLayoutPage
      {...data.layout}
      header={
        preview && data.skillData ? (
          <Nav className="border-b border-border bg-background text-foreground">
            <Div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <Logo locale={data.locale} />
              <Div className="flex items-center gap-3">
                <Link
                  className="inline-flex min-h-11 items-center text-sm font-medium text-foreground no-underline hover:underline"
                  href={`/${data.locale}/skills`}
                >
                  {t("related.allSkills")}
                </Link>
                <ThemeToggle locale={data.locale} />
              </Div>
            </Div>
          </Nav>
        ) : undefined
      }
      hideNewsletter={data.leadMagnetConfig !== null}
    >
      <SkillLandingPage {...data} />
    </SiteLayoutPage>
  );
}

export default async function SkillPage({
  params,
  searchParams,
}: SkillPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  if (!data) {
    return <Div />;
  }
  return <TanstackPage {...data} />;
}

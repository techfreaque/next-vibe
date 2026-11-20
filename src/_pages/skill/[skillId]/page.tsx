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
import type { JSX } from "react";

import { TanstackPage as SiteLayoutPage } from "../../story/layout";
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
}: SkillPageProps): Promise<SkillLandingPageData> {
  return loadSkillLandingPage({ params, searchParams });
}

export function TanstackPage(data: SkillLandingPageData): JSX.Element {
  return (
    <SiteLayoutPage
      {...data.layout}
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
  return <TanstackPage {...data} />;
}

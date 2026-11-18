/**
 * AI Skills Page
 * Standalone page for browsing AI skills.
 * Same content as the popover, but as a full page with back navigation.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { SkillListResponseOutput } from "next-vibe/agent/skills/definition";
import { SkillSourceFilter } from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillTranslations } from "next-vibe/agent/skills/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Summary } from "next-vibe/ui/components/summary";
import { H2, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildBreadcrumbList,
  buildItemList,
} from "../_components/structured-data";
import { scopedTranslation } from "./i18n";
import { SkillsPageClient } from "./page-client";

interface SkillsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({
  params,
}: SkillsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "skills",
    title: t("meta.title", { appName }),
    description: t("meta.description"),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface SkillsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  /** Built-in skills resolved server-side so the list paints on first load. */
  initialData: SkillListResponseOutput | undefined;
  builtIn: SkillDirectoryEntry[];
  community: SkillDirectoryEntry[];
}

interface SkillDirectoryEntry {
  id: string;
  name: string;
  tagline: string;
}

export async function tanstackLoader({
  params,
}: SkillsPageProps): Promise<SkillsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Dynamic import: the skills repository's import tree cycles when pulled
  // in at page module top-level (same reason skills-content is lazy).
  const { SkillsRepository } =
    await import("next-vibe/agent/skills/repository");
  const [skills, community] = await Promise.all([
    SkillsRepository.getSkills(
      { sourceFilter: SkillSourceFilter.BUILT_IN },
      user,
      logger,
      locale,
      Platform.NEXT_PAGE,
    ),
    SkillsRepository.listPublishedCommunitySkillPages(logger, locale),
  ]);

  return {
    locale,
    user,
    platform: Platform.NEXT_PAGE,
    initialData: skills.success ? skills.data : undefined,
    builtIn: SkillsRepository.listPublicDefaultSkillPages(locale),
    community: community.success
      ? community.data
          .map(({ id, name, tagline }) => ({ id, name, tagline }))
          .toSorted((a, b) => a.name.localeCompare(b.name, locale))
      : [],
  };
}

export function TanstackPage(data: SkillsPageData): JSX.Element {
  const { locale } = data;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: skillT } = skillTranslations.scopedT(locale);
  const groups = [
    { label: skillT("enums.source.builtIn"), entries: data.builtIn },
    { label: skillT("enums.source.community"), entries: data.community },
  ]
    .filter(({ entries }) => entries.length > 0)
    .map(({ label, entries }) => ({
      label,
      entries: entries.map(({ id, name, tagline }) => ({
        path: `/skill/${encodeURIComponent(id)}`,
        name,
        tagline,
      })),
    }));
  return (
    <>
      <JsonLd
        id="skills-structured-data"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbList(locale, [
              { name: t("title"), path: "/skills" },
            ]),
            buildItemList(
              locale,
              groups.flatMap(({ entries }) => entries),
            ),
          ],
        }}
      />
      <SkillsPageClient
        {...data}
        directory={
          <Details
            id="skill-directory"
            className="mb-4 rounded-xl border bg-card"
          >
            <Summary className="cursor-pointer p-4 font-semibold">
              {skillT("get.section.browseAll")}
            </Summary>
            {groups.map(({ label, entries }) => (
              <Div className="border-t p-4" key={label}>
                <H2 className="mb-2 border-none p-0 text-lg">{label}</H2>
                <Ul className="m-0 grid list-none gap-x-4 gap-y-1 p-0 sm:grid-cols-2">
                  {entries.map(({ path, name, tagline }) => (
                    <Li key={path} className="m-0">
                      <Link
                        href={`/${locale}${path}`}
                        className="block rounded-lg p-2 hover:bg-muted"
                      >
                        {name}
                        {tagline && (
                          <P className="m-0 text-sm text-muted-foreground">
                            {tagline}
                          </P>
                        )}
                      </Link>
                    </Li>
                  ))}
                </Ul>
              </Div>
            ))}
          </Details>
        }
      />
    </>
  );
}

export default async function SkillsPage({
  params,
}: SkillsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

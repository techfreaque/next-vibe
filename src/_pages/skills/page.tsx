/**
 * AI Skills Page
 * Standalone page for browsing AI skills.
 * Same content as the popover, but as a full page with back navigation.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { SkillListResponseOutput } from "next-vibe/agent/skills/definition";
import {
  SkillCategory,
  SkillCategoryDB,
  type SkillCategoryValue,
  SkillSourceFilter,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillTranslations } from "next-vibe/agent/skills/labels/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Li } from "next-vibe/ui/components/li";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { configScopedTranslation } from "@/env/i18n";

import {
  buildBreadcrumbList,
  buildItemList,
} from "../_components/structured-data";
import { buildBreadcrumbTrail } from "../story/_shared/breadcrumbs";
import { GuideCardGrid } from "../story/blog/guide-links";
import type { BlogPostSlug } from "../story/blog/posts-meta";
import { TOPIC_HUB_PATHS } from "../story/blog/topics";
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
  category: typeof SkillCategoryValue;
}

/** Directory order: everyday helpers first, edgy characters last. */
const CATEGORY_ORDER: readonly (typeof SkillCategoryValue)[] = [
  SkillCategory.COMPANION,
  SkillCategory.ASSISTANT,
  SkillCategory.CODING,
  SkillCategory.WRITING,
  SkillCategory.CREATIVE,
  SkillCategory.ANALYSIS,
  SkillCategory.EDUCATION,
  SkillCategory.ROLEPLAY,
  SkillCategory.CONTROVERSIAL,
  ...SkillCategoryDB,
].filter((category, index, all) => all.indexOf(category) === index);

/** Guides that match what people do with skills: characters and writing. */
const SKILL_GUIDES: readonly BlogPostSlug[] = [
  "ai-roleplay-without-filter",
  "character-ai-alternatives",
  "uncensored-ai-writer",
  "skill-sharing-economy",
  "best-uncensored-llm",
  "venice-ai-alternatives",
];

/** "enums.category.coding" -> "coding", for stable in-page anchors. */
function categorySlug(category: typeof SkillCategoryValue): string {
  return category.split(".").pop() ?? category;
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
          .map(({ id, name, tagline, category }) => ({
            id,
            name,
            tagline,
            category,
          }))
          .toSorted((a, b) => a.name.localeCompare(b.name, locale))
      : [],
  };
}

interface DirectoryGroup {
  anchor: string;
  label: string;
  intro?: string;
  entries: { path: string; name: string; tagline: string }[];
}

function toEntry({
  id,
  name,
  tagline,
}: SkillDirectoryEntry): DirectoryGroup["entries"][number] {
  return { path: `/skill/${encodeURIComponent(id)}`, name, tagline };
}

function SkillGroup({
  group,
  locale,
}: {
  group: DirectoryGroup;
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Section id={group.anchor} className="scroll-mt-20">
      <H2 className="mb-3 border-none p-0 text-xl font-semibold tracking-tight">
        {group.label}
      </H2>
      {group.intro && (
        <P className="mt-0 mb-3 text-sm text-muted-foreground">{group.intro}</P>
      )}
      <Ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {group.entries.map(({ path, name, tagline }) => (
          <Li key={path} className="m-0">
            <Link
              href={`/${locale}${path}`}
              className="flex h-full flex-col rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <Span className="font-semibold">{name}</Span>
              {tagline && (
                <Span className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {tagline}
                </Span>
              )}
            </Link>
          </Li>
        ))}
      </Ul>
    </Section>
  );
}

export function TanstackPage(data: SkillsPageData): JSX.Element {
  const { locale } = data;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: skillT } = skillTranslations.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const crumbs = [{ name: t("breadcrumb"), path: "/skills" }];

  const groups: DirectoryGroup[] = CATEGORY_ORDER.map((category) => ({
    anchor: categorySlug(category),
    label: skillT(category),
    entries: data.builtIn
      .filter((entry) => entry.category === category)
      .map(toEntry),
  })).filter(({ entries }) => entries.length > 0);
  if (data.community.length > 0) {
    groups.push({
      anchor: "community",
      label: t("community.title"),
      intro: t("community.intro", { appName }),
      entries: data.community.map(toEntry),
    });
  }

  const faq = (["what", "model", "cost", "build"] as const).map((key) => ({
    question: t(`faq.${key}.q`),
    answer: t(`faq.${key}.a`),
  }));
  const more = [
    {
      href: `/${locale}/story/build-a-skill`,
      title: t("more.build.title"),
      body: t("more.build.body"),
    },
    {
      href: `/${locale}/models`,
      title: t("more.models.title"),
      body: t("more.models.body"),
    },
    {
      href: `/${locale}${TOPIC_HUB_PATHS.uncensored}`,
      title: t("more.uncensored.title"),
      body: t("more.uncensored.body"),
    },
  ];

  return (
    <>
      <JsonLd
        id="skills-structured-data"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbList(locale, crumbs),
            buildItemList(
              locale,
              groups.flatMap(({ entries }) => entries),
            ),
          ],
        }}
      />
      <JsonLd id="skills-faq" data={buildFaqStructuredData(faq)} />
      <SkillsPageClient
        {...data}
        breadcrumbs={buildBreadcrumbTrail(locale, crumbs)}
        directory={
          <Div id="skill-directory" className="mb-10 flex flex-col gap-8">
            <Nav>
              <P className="mt-0 mb-2 text-sm text-muted-foreground">
                {t("jumpTo")}
              </P>
              <Ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {groups.map((group) => (
                  <Li key={group.anchor} className="m-0">
                    <ExternalLink
                      href={`#${group.anchor}`}
                      className="inline-flex min-h-9 items-center rounded-full border bg-card px-3 text-sm hover:border-primary/40"
                    >
                      {group.label}
                      <Span className="ml-1.5 text-muted-foreground">
                        {group.entries.length}
                      </Span>
                    </ExternalLink>
                  </Li>
                ))}
              </Ul>
            </Nav>
            {groups.map((group) => (
              <SkillGroup key={group.anchor} group={group} locale={locale} />
            ))}
          </Div>
        }
        after={
          <Div className="mt-12 flex flex-col gap-12">
            <Section>
              <H2 className="mb-4 border-none p-0 text-xl font-semibold tracking-tight">
                {t("more.title")}
              </H2>
              <Div className="grid gap-4 sm:grid-cols-3">
                {more.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <H3 className="m-0 text-base font-semibold">
                      {item.title}
                    </H3>
                    <P className="mt-2 mb-0 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </P>
                    <Span className="mt-auto pt-3 text-primary">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Span>
                  </Link>
                ))}
              </Div>
            </Section>
            <Section>
              <H2 className="mb-4 border-none p-0 text-xl font-semibold tracking-tight">
                {t("faq.title")}
              </H2>
              <Div className="grid gap-6 sm:grid-cols-2">
                {faq.map((item) => (
                  <Div key={item.question}>
                    <H3 className="m-0 text-base font-semibold">
                      {item.question}
                    </H3>
                    <P className="mt-2 mb-0 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </P>
                  </Div>
                ))}
              </Div>
            </Section>
            <Section>
              <H2 className="mb-4 border-none p-0 text-xl font-semibold tracking-tight">
                {t("guides.title")}
              </H2>
              <GuideCardGrid locale={locale} slugs={SKILL_GUIDES} />
            </Section>
          </Div>
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

import type { Metadata } from "next";
import { roleplaySkillSkill } from "next-vibe/agent/skills/default-skills/roleplay-character/skill";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Theater } from "next-vibe/ui/components/icons/Theater";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleScroll,
  ArticleSection,
} from "../../_shared/article";
import { CardLink, Cta } from "../../_shared/marketing";
import {
  allPlansText,
  formatCompareDate,
  LINK_CLASS,
  planText,
} from "../../compare/_shared/compare-data";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import {
  PLATFORMS,
  type PlatformSource,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareTranslation } from "../../compare/i18n";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;
const SLUG = "janitor-ai-alternatives";
const CHECKED = "2026-11-24";

const alternatives = [
  "characterAi",
  "sillyTavern",
  "chub",
  "crushOn",
  "spicy",
  "venice",
  "nanoGpt",
  "horde",
  "kindroid",
  "nomi",
] as const;
type Alternative = (typeof alternatives)[number];

const janitorSources: readonly PlatformSource[] = [
  { kind: "home", url: "https://jani.com/" },
  { kind: "terms", url: "https://jani.com/term" },
  { kind: "pricing", url: "https://janitorai.com/news/announcements/29" },
  {
    kind: "appStore",
    url: "https://apps.apple.com/us/app/janitor-interactive-stories/id6692609366",
  },
  {
    kind: "help",
    url: "https://help.janitorai.com/en/article/faq-subscription-janitorai-1o8ccf2/",
  },
  {
    kind: "docs",
    url: "https://help.janitorai.com/en/article/tldr-quickstart-proxy-instructions-1x0fptu/",
  },
];
const sources: Record<Alternative, readonly PlatformSource[]> = {
  characterAi: [
    { kind: "pricing", url: "https://character.ai/subscribe" },
    { kind: "blog", url: "https://blog.character.ai/new-styles-new-plan/" },
    {
      kind: "guidelines",
      url: "https://support.character.ai/hc/en-us/articles/15063955587611-What-about-NSFW",
    },
  ],
  sillyTavern: [{ kind: "docs", url: "https://docs.sillytavern.app/" }],
  chub: [
    {
      kind: "pricing",
      url: "https://docs.chub.ai/docs/the-basics/api-connections",
    },
    {
      kind: "features",
      url: "https://docs.chub.ai/docs/advanced-setups/lorebooks",
    },
  ],
  crushOn: [{ kind: "pricing", url: "https://chat.crushon.ai/" }],
  spicy: [
    {
      kind: "pricing",
      url: "https://docs.spicychat.ai/september-2026-pricing-update-faq",
    },
    {
      kind: "features",
      url: "https://docs.spicychat.ai/product-guides/premium-features",
    },
  ],
  venice: [{ kind: "pricing", url: "https://venice.ai/pricing" }],
  nanoGpt: [{ kind: "pricing", url: "https://nano-gpt.com/pricing" }],
  horde: [
    { kind: "home", url: "https://lite.koboldai.net/" },
    { kind: "docs", url: "https://aihorde.net/" },
  ],
  kindroid: [
    {
      kind: "pricing",
      url: "https://apps.apple.com/us/app/kindroid-your-personal-ai/id6451038161",
    },
    { kind: "help", url: "https://kindroid.ai/v2/docs/subscriptions/" },
  ],
  nomi: [
    { kind: "help", url: "https://wiki.nomi.ai/Does_Nomi_offer_refunds%3F" },
    {
      kind: "appStore",
      url: "https://apps.apple.com/us/app/nomi-ai-companion-with-a-soul/id6450270929",
    },
  ],
};

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}
interface PageData {
  locale: CountryLanguage;
  us: UsParams;
}

export async function tanstackLoader({ params }: Props): Promise<PageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  return { locale, us: usParams(await loadUsFacts(locale)) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("title"),
    description: t("description"),
    imageAlt: t("title"),
    category: t("category"),
    keywords: [t("keywords")],
  });
}

function Sources({
  name,
  items,
  locale,
}: {
  name: string;
  items: readonly PlatformSource[];
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = compareTranslation.scopedT(locale);
  return (
    <Div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {items.map((source) => (
        <ExternalLink
          key={source.url}
          href={source.url}
          className={LINK_CLASS}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t(`common.sourceKinds.${source.kind}`, { name })}
        </ExternalLink>
      ))}
    </Div>
  );
}

export function TanstackPage({ locale, us }: PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("back") };
  const stats = { ...us, date: formatCompareDate(CHECKED, locale) };
  const extraNames = {
    chub: "Chub AI",
    spicy: "SpicyChat",
    horde: "KoboldAI Lite / AI Horde",
  };
  const entries = alternatives.map((key) => {
    const name =
      key === "chub" || key === "spicy" || key === "horde"
        ? extraNames[key]
        : PLATFORMS[key].name;
    let price: string;
    switch (key) {
      case "chub":
        price = planText(
          { name: "Mars", price: 20, period: "month" },
          locale,
          compareT,
        );
        break;
      case "spicy":
        price = planText(
          { name: "Get A Taste", price: 5.95, period: "month" },
          locale,
          compareT,
        );
        break;
      case "horde":
      case "sillyTavern":
        price = t(`offers.${key}.price`);
        break;
      case "kindroid":
        price = PLATFORMS.kindroid.plans
          .map((plan) =>
            planText(
              { ...plan, name: PLATFORMS.kindroid.name },
              locale,
              compareT,
            ),
          )
          .join(", ");
        break;
      default:
        price = allPlansText(PLATFORMS[key], locale, compareT);
    }
    return {
      key,
      name,
      price,
      free: t(`free.${key}`),
      fit: t(`offers.${key}.fit`),
      body: t(`offers.${key}.body`),
    };
  });
  const rows = [
    {
      key: "us",
      name: us.appName,
      fit: t("us.fit"),
      free: t("free.us", stats),
      price: t("us.price", stats),
    },
    ...entries,
    {
      key: "janitor",
      name: "Janitor AI",
      fit: t("janitor.fit"),
      free: t("free.janitor"),
      price: allPlansText(PLATFORMS.janitorAi, locale, compareT),
    },
  ];
  const faq = (["free", "memory", "move"] as const).map((key) => ({
    question: t(`faq.${key}.q`),
    answer: t(`faq.${key}.a`, stats),
  }));
  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("category")}
        readTime={t("readTime")}
        post={{ slug: SLUG, locale }}
        title={t("title")}
        subtitle={t("subtitle", stats)}
      />
      <ArticleBody>
        <ArticleLead>{t("lead")}</ArticleLead>
        <ArticleSection
          id="janitor"
          title={t("janitor.title")}
          intro={t("janitor.intro")}
        >
          <ArticleP>{t("janitor.plans")}</ArticleP>
          <Sources name="Janitor AI" items={janitorSources} locale={locale} />
        </ArticleSection>
        <ArticleSection id="why" title={t("why.title")}>
          <ArticleP>
            {t("why.outage")}{" "}
            <ExternalLink
              href="https://www.reddit.com/r/JanitorAI_Refuges/comments/1y0iy3u/sooo_does_anyone_know_any_janitorai_alternatives/"
              className={LINK_CLASS}
            >
              r/JanitorAI_Refuges
            </ExternalLink>{" "}
            <ExternalLink
              href="https://janitorai.com/news/announcements/domain-update"
              className={LINK_CLASS}
            >
              {t("why.update")}
            </ExternalLink>
          </ArticleP>
          <ArticleP>
            {t("why.voice")}{" "}
            <ExternalLink
              href="https://www.reddit.com/r/JanitorAI_Official/comments/1r00ys8/janitor_ai_is_really_bad_now/"
              className={LINK_CLASS}
            >
              r/JanitorAI_Official
            </ExternalLink>
          </ArticleP>
        </ArticleSection>
        <ArticleSection
          id="table"
          title={t("table.title")}
          intro={
            <>
              {t("table.intro")}
              <Span className="mt-2 block text-sm sm:hidden">
                {t("table.scroll")}
              </Span>
            </>
          }
        >
          <ArticleScroll>
            <Table className="min-w-[38rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>{compareT("common.table.platform")}</TableHead>
                  <TableHead>{t("table.fit")}</TableHead>
                  <TableHead>{compareT("common.table.free")}</TableHead>
                  <TableHead>{t("table.price")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.key}
                    data-platform={row.key}
                    className={
                      row.key === "us" ? "bg-primary/[0.04]" : undefined
                    }
                  >
                    <TableCell className="font-semibold">{row.name}</TableCell>
                    <TableCell>{row.fit}</TableCell>
                    <TableCell>{row.free}</TableCell>
                    <TableCell>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ArticleScroll>
        </ArticleSection>
        <ArticleSection
          id="us"
          title={t("us.title", stats)}
          intro={t("us.models", stats)}
        >
          <ArticleP>{t("us.skills")}</ArticleP>
          {us.ownModel ? <ArticleP>{t("us.example", stats)}</ArticleP> : null}
          <ArticleP>{t("us.limit", stats)}</ArticleP>
          <CardLink
            href={`/${locale}/skill/${roleplaySkillSkill.id}`}
            label={t("us.link")}
          />
        </ArticleSection>
        <ArticleSection id="alternatives" title={t("list")}>
          {entries.map(({ key, name, fit, body }) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t("heading", { name, fit })}</ArticleH3>
              <ArticleP>{body}</ArticleP>
              <Sources locale={locale} name={name} items={sources[key]} />
            </Div>
          ))}
        </ArticleSection>
        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd id="faq-structured-data" data={buildFaqStructuredData(faq)} />
          {faq.map(({ question, answer }) => (
            <Div key={question} className="flex flex-col gap-2">
              <ArticleH3>{question}</ArticleH3>
              <ArticleP>{answer}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/character-ai-alternatives`}
              label={t("related.character")}
            />
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={t("related.hub")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["janitorAi", "characterAi", "venice", "nanoGpt"]}
            />
          </Div>
        </ArticleSection>
        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          actions={
            <Cta
              href={`/${locale}/skill/${roleplaySkillSkill.id}`}
              label={t("cta.start")}
              icon={Theater}
            />
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function JanitorAiAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader({ params })} />;
}

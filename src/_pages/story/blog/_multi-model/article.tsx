import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import { CardLink, Cta } from "../../_shared/marketing";
import {
  formatCompareDate,
  formatUsd,
  LINK_CLASS,
  type TableRowData,
  usRow,
} from "../../compare/_shared/compare-data";
import {
  CompareInlineLinks,
  CompareTable,
  SourceList,
} from "../../compare/_shared/compare-ui";
import { versusPath } from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import { getBlogPostCard } from "../posts-cards";
import type { RelatedModelLink } from "../related-models-data";
import { relatedGuides } from "../topics";
import { scopedTranslation } from "./i18n";
import {
  ALTERNATIVES,
  CHECKED_DATE,
  DISCUSSIONS,
  PLATFORMS,
  POST_SLUGS,
  type Subject,
  USD_PRICES,
} from "./platforms";

export interface MultiModelPageData {
  locale: CountryLanguage;
  us: UsParams;
  relatedModels: RelatedModelLink[];
}

const FAQ_KEYS = ["best", "free", "billing", "privacy", "switching"] as const;
const SUBJECT_DETAILS = ["free", "paid", "price", "pro", "con"] as const;
const DISCUSSION_KEYS = ["first", "second"] as const;
const OTHER_GUIDES = [
  "openrouter-alternatives",
  "venice-ai-alternatives",
  "chatgpt-alternative-without-filters",
  "nofiltergpt-alternatives",
  "freedomgpt-alternatives",
  "gab-ai-alternatives",
  "character-ai-alternatives",
  "janitor-ai-alternatives",
  "nanogpt-alternatives",
  "claude-alternatives",
] as const;

export function MultiModelArticle({
  locale,
  us,
  relatedModels,
  subject,
}: MultiModelPageData & { subject: Subject }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const slug = POST_SLUGS[subject];
  const post = { slug, locale };
  const back = { href: `/${locale}/story/blog`, label: t("common.back") };
  const alternatives = ALTERNATIVES[subject];
  const stats = {
    ...us,
    date: formatCompareDate(CHECKED_DATE, locale),
    poeStart: formatUsd(USD_PRICES.poeStart, locale),
    typingStandard: formatUsd(USD_PRICES.typingStandard, locale),
    typingExtended: formatUsd(USD_PRICES.typingExtended, locale),
    typingPremium: formatUsd(USD_PRICES.typingPremium, locale),
    typingList: formatUsd(USD_PRICES.typingList, locale),
    venicePro: formatUsd(USD_PRICES.venicePro, locale),
    nanoPro: formatUsd(USD_PRICES.nanoPro, locale),
    plus: formatUsd(USD_PRICES.plus, locale),
    routerMinimum: formatUsd(USD_PRICES.routerMinimum, locale),
    routerFee: new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(0.055),
  };
  const rows: TableRowData[] = [
    usRow(locale, compareT, us),
    ...[subject, ...alternatives].map((key): TableRowData => {
      const platform = PLATFORMS[key];
      return {
        key,
        name: platform.name,
        href: platform.versus
          ? `/${locale}${versusPath(platform.versus)}`
          : null,
        external: null,
        isUs: false,
        cells: {
          kind: t(`kinds.${platform.kind}`),
          free: t(`platforms.${key}.free`, stats),
          paid: t(`platforms.${key}.paid`, stats),
          filter: t(`platforms.${key}.filter`, stats),
          privacy: t(`platforms.${key}.privacy`, stats),
          api: t(`platforms.${key}.api`),
          media: t(`platforms.${key}.media`),
          open: t(`platforms.${key}.open`),
        },
      };
    }),
  ];
  const faq = FAQ_KEYS.map((key) => ({
    key,
    question: t(`posts.${subject}.faq.${key}.q`),
    answer: t(`posts.${subject}.faq.${key}.a`, stats),
  }));
  const related = relatedGuides(slug).related;
  const guides = OTHER_GUIDES.filter(
    (guide) => !related.includes(guide),
  ).flatMap((guide) => {
    const card = getBlogPostCard(guide, locale);
    return card ? [card] : [];
  });

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        post={post}
        category={t("common.category")}
        readTime={t("common.readTime")}
        title={t(`posts.${subject}.title`)}
        subtitle={t(`posts.${subject}.subtitle`, stats)}
      />

      <ArticleBody>
        <ArticleLead>{t(`posts.${subject}.lead`)}</ArticleLead>

        <ArticleSection
          id={subject}
          title={t(`posts.${subject}.overview`)}
          intro={t(`platforms.${subject}.models`)}
        >
          <ArticleList
            items={SUBJECT_DETAILS.map((key) =>
              t(`platforms.${subject}.${key}`, stats),
            )}
          />
          <SourceList
            name={PLATFORMS[subject].name}
            sources={PLATFORMS[subject].sources}
            locale={locale}
          />
        </ArticleSection>

        <ArticleSection id="switching" title={t("common.switching")}>
          {DISCUSSION_KEYS.map((key, index) => (
            <Div key={key} className="flex flex-col gap-1">
              <ArticleP>{t(`posts.${subject}.switch.${key}`)}</ArticleP>
              <Span className="text-sm">
                <ExternalLink
                  href={DISCUSSIONS[subject][index]}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={LINK_CLASS}
                >
                  {t(`posts.${subject}.switch.${key}Link`)}
                </ExternalLink>
              </Span>
            </Div>
          ))}
        </ArticleSection>

        <ArticleSection id="criteria" title={t("common.criteria")}>
          <ArticleList
            items={[
              t(`posts.${subject}.criteria.cost`),
              t(`posts.${subject}.criteria.workflow`),
              t("common.privacy"),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="comparison"
          title={t("common.table")}
          intro={t("common.checked", stats)}
        >
          <CompareTable locale={locale} rows={rows} />
        </ArticleSection>

        <ArticleSection
          id="unbottled"
          title={t("us.title", stats)}
          intro={t("us.intro", stats)}
        >
          <ArticleList
            items={[t("us.price", stats), t("us.privacy"), t("us.api", stats)]}
          />
          <ArticleP>{t(`posts.${subject}.tradeoff`, stats)}</ArticleP>
          <CardLink
            href={`/${locale}/models`}
            label={t("common.modelCatalog")}
          />
        </ArticleSection>

        <ArticleSection id="alternatives" title={t("common.alternatives")}>
          {alternatives.map((key, index) => {
            const platform = PLATFORMS[key];
            return (
              <Div
                key={key}
                data-platform={key}
                className="flex flex-col gap-3"
              >
                <ArticleH3>
                  {index + 1}. {platform.name}
                </ArticleH3>
                <ArticleP>{t(`platforms.${key}.models`)}</ArticleP>
                <ArticleList
                  items={[
                    <Span key="price">
                      <Span className="font-semibold text-foreground">
                        {t("common.price")}
                      </Span>{" "}
                      {t(`platforms.${key}.free`, stats)}{" "}
                      {t(`platforms.${key}.paid`, stats)}.{" "}
                      {t(`platforms.${key}.price`, stats)}
                    </Span>,
                    ...(["pro", "con", "fit"] as const).map((detail) => (
                      <Span key={detail}>
                        <Span className="font-semibold text-foreground">
                          {t(`common.${detail}`)}
                        </Span>{" "}
                        {t(`platforms.${key}.${detail}`, stats)}
                      </Span>
                    )),
                  ]}
                />
                {platform.versus && (
                  <CardLink
                    href={`/${locale}${versusPath(platform.versus)}`}
                    label={compareT("links.versus", {
                      appName: us.appName,
                      name: platform.name,
                    })}
                  />
                )}
                <SourceList
                  name={platform.name}
                  sources={platform.sources}
                  locale={locale}
                />
              </Div>
            );
          })}
        </ArticleSection>

        <ArticleSection id="faq" title={t("common.faq")}>
          <JsonLd id="faq-structured-data" data={buildFaqStructuredData(faq)} />
          {faq.map(({ key, question, answer }) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{question}</ArticleH3>
              <ArticleP>{answer}</ArticleP>
            </Div>
          ))}
        </ArticleSection>

        <ArticleSection id="further-reading" title={t("common.guides")}>
          <Div className="flex flex-col">
            <CompareInlineLinks locale={locale} versus={[]} />
            {guides.map((guide) => (
              <CardLink
                key={guide.slug}
                href={`/${locale}${guide.path}`}
                label={guide.title}
              />
            ))}
          </Div>
        </ArticleSection>

        <ArticleEnd
          post={post}
          relatedModels={relatedModels}
          back={back}
          title={t("us.cta")}
          subtitle={t("us.ctaSubtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/threads/incognito/new`}
                label={t("us.start")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/story/uncensored-ai`}
                label={t("us.models")}
                icon={Scale}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

/**
 * Server-rendered content sections for the public model pages: best for,
 * similar models, FAQ (with its FAQPage JSON-LD) and related blog posts.
 * Plain markup, no state or effects, so it adds no client logic; all text is
 * computed in the page loader (model-seo.ts) and passed in as data.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX } from "react";

import {
  buildFaqStructuredData,
  type FaqItem,
} from "@/_pages/_components/faq-structured-data";

import { PageSection } from "../../story/_shared/marketing";
import { scopedTranslation } from "../i18n";
import { formatNumber, modelHref } from "./model-format";
import type { BestForContent, RelatedModel } from "./model-seo";
import { mediaUnitText } from "./model-seo";

export interface BlogLink {
  /** Locale-less path, e.g. "/story/blog/<slug>". */
  path: string;
  title: string;
  excerpt: string;
}

/** Everything the sections render, computed server-side in the page loader. */
export interface ModelSeoContent {
  bestFor: BestForContent | null;
  related: RelatedModel[];
  faq: FaqItem[];
  blog: BlogLink[];
}

type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function BestForSection({
  model,
  content,
  t,
}: {
  model: string;
  content: BestForContent;
  t: ModelsT;
}): JSX.Element {
  return (
    <PageSection title={t("bestFor.heading", { model })} narrow>
      <Div data-testid="model-best-for" className="flex flex-col gap-8">
        {content.line !== null && (
          <P className="m-0 text-lg leading-relaxed text-pretty text-foreground">
            {content.line}
          </P>
        )}
        <Div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {content.good.length > 0 && (
            <Div className="flex flex-col gap-3">
              <H3 className="m-0 text-base font-semibold">
                {t("bestFor.good")}
              </H3>
              <Ul className="m-0 flex list-none flex-col gap-2 p-0">
                {content.good.map((item) => (
                  <Li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <Span>{item}</Span>
                  </Li>
                ))}
              </Ul>
            </Div>
          )}
          {content.skip.length > 0 && (
            <Div className="flex flex-col gap-3">
              <H3 className="m-0 text-base font-semibold">
                {t("bestFor.skip")}
              </H3>
              <Ul className="m-0 flex list-none flex-col gap-2 p-0">
                {content.skip.map((item) => (
                  <Li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                    <Span>{item}</Span>
                  </Li>
                ))}
              </Ul>
            </Div>
          )}
        </Div>
      </Div>
    </PageSection>
  );
}

function relatedPrice(
  model: RelatedModel,
  locale: CountryLanguage,
  t: ModelsT,
): string | null {
  if (model.credits === null) {
    return null;
  }
  const credits = formatNumber(model.credits, locale);
  if (model.mediaPrice !== null) {
    return t("related.perUse", {
      credits,
      unit: mediaUnitText(model.mediaPrice, t),
    });
  }
  return t("related.perMessage", { credits });
}

function RelatedSection({
  related,
  locale,
  t,
}: {
  related: RelatedModel[];
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element {
  return (
    <PageSection
      title={t("related.heading")}
      intro={t("related.intro")}
      tone="muted"
    >
      <Ul
        className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={t("related.heading")}
      >
        {related.map((model) => {
          const price = relatedPrice(model, locale, t);
          return (
            <Li key={model.slug} className="flex">
              <Link
                href={modelHref(locale, model.slug)}
                className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/40"
              >
                <Span className="flex min-w-0 flex-col gap-0.5">
                  <Span className="font-semibold text-foreground [overflow-wrap:anywhere]">
                    {model.name}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {t(`related.reasons.${model.reason}`, {
                      lab: model.labName,
                    })}
                    {price !== null && ` · ${price}`}
                  </Span>
                </Span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Li>
          );
        })}
      </Ul>
    </PageSection>
  );
}

function FaqSection({
  model,
  faq,
  t,
}: {
  model: string;
  faq: FaqItem[];
  t: ModelsT;
}): JSX.Element {
  return (
    <PageSection title={t("faq.heading", { model })} narrow>
      <JsonLd
        id="model-faq-structured-data"
        data={buildFaqStructuredData(faq)}
      />
      <Div
        data-testid="model-faq"
        className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
      >
        {faq.map((item) => (
          <Div
            key={item.question}
            className="flex flex-col gap-2 px-4 py-5 md:px-6"
          >
            <H3 className="m-0 text-base font-semibold text-foreground">
              {item.question}
            </H3>
            <P className="m-0 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </P>
          </Div>
        ))}
      </Div>
    </PageSection>
  );
}

function BlogSection({
  blog,
  locale,
  t,
}: {
  blog: BlogLink[];
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element {
  return (
    <PageSection title={t("readMore.heading")} tone="muted">
      <Ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
        {blog.map((post) => (
          <Li key={post.path} className="flex">
            <Link
              href={`/${locale}${post.path}`}
              className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
            >
              <Span className="font-semibold text-foreground">
                {post.title}
              </Span>
              <Span className="text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </Span>
            </Link>
          </Li>
        ))}
      </Ul>
    </PageSection>
  );
}

export function ModelSeoSections({
  locale,
  model,
  content,
}: {
  locale: CountryLanguage;
  /** Display name of the model the page is about. */
  model: string;
  content: ModelSeoContent;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <>
      {content.bestFor !== null && (
        <BestForSection model={model} content={content.bestFor} t={t} />
      )}
      {content.related.length > 0 && (
        <RelatedSection related={content.related} locale={locale} t={t} />
      )}
      {content.faq.length > 0 && (
        <FaqSection model={model} faq={content.faq} t={t} />
      )}
      {content.blog.length > 0 && (
        <BlogSection blog={content.blog} locale={locale} t={t} />
      )}
    </>
  );
}

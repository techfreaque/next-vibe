import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { CHAT_MESSAGE_PRICE_REFERENCE } from "next-vibe/agent/models/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  canonicalComparisonPath,
  isUncensoredVariantOf,
  listModelFacts,
  type ModelRef,
} from "@/_pages/models/_shared/model-facts";
import {
  chatHref,
  formatNumber,
  modelHref,
} from "@/_pages/models/_shared/model-format";
import { MODELS_OG_IMAGE } from "@/_pages/models/constants";
import { configScopedTranslation } from "@/env/i18n";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { CardLink, Cta, PageHero, PageSection } from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface ChatChoice extends ModelRef {
  contextWindow: number;
  creditsPerMessage: number;
  comparison: { name: string; path: string } | null;
}

interface PageData {
  locale: CountryLanguage;
  models: ChatChoice[];
}

export async function tanstackLoader({ params }: Props): Promise<PageData> {
  const { locale } = await params;
  const available = listModelFacts(await getEnvAvailability()).filter(
    (model) => !model.isLegacy,
  );
  const models = available
    .filter((model) => model.uncensoredMethod === "abliterated")
    .toSorted(
      (a, b) =>
        a.creditsPerMessage - b.creditsPerMessage ||
        a.name.localeCompare(b.name),
    )
    .map((model) => {
      const base = available.find(
        (candidate) =>
          candidate.outputs.join() === model.outputs.join() &&
          isUncensoredVariantOf(model, candidate),
      );
      return {
        id: model.id,
        slug: model.slug,
        name: model.name.trim(),
        contextWindow: model.contextWindow,
        creditsPerMessage: model.creditsPerMessage,
        comparison: base
          ? {
              name: base.name.trim(),
              path: canonicalComparisonPath(base, model),
            }
          : null,
      };
    });
  return { locale, models };
}

export async function generateMetadata({
  params,
}: Props): Promise<ReturnType<typeof metadataGenerator>> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/abliterated-ai-chat",
    title: t("metaTitle", { appName: configT("appName") }),
    description: t("description"),
    category: t("title"),
    image: MODELS_OG_IMAGE,
    imageAlt: t("title"),
    keywords: [t("title")],
  });
}

export function TanstackPage({ locale, models }: PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const faq = [
    { question: t("faq.meaning.q"), answer: t("faq.meaning.a") },
    {
      question: t("faq.access.q"),
      answer: t("faq.access.a", {
        credits: formatNumber(FREE_CREDIT_ALLOWANCE.guest, locale),
      }),
    },
    { question: t("faq.refusals.q"), answer: t("faq.refusals.a") },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("intro")} />
      <PageSection
        title={t("models")}
        intro={
          models.length > 0
            ? t("estimate", {
                input: formatNumber(
                  CHAT_MESSAGE_PRICE_REFERENCE.inputTokens,
                  locale,
                ),
                output: formatNumber(
                  CHAT_MESSAGE_PRICE_REFERENCE.outputTokens,
                  locale,
                ),
              })
            : t("empty")
        }
      >
        {models.length > 0 && (
          <Div className="grid gap-3">
            {models.map((model) => (
              <Div
                key={model.id}
                className="grid min-w-0 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <Div className="min-w-0">
                  <H3 className="text-lg font-semibold">
                    <Link
                      href={modelHref(locale, model.slug)}
                      className="hover:underline"
                    >
                      {model.name}
                    </Link>
                  </H3>
                  <Div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <P>
                      {t("context", {
                        tokens: formatNumber(model.contextWindow, locale),
                      })}
                    </P>
                    <P>
                      {t("price", {
                        credits: formatNumber(model.creditsPerMessage, locale),
                      })}
                    </P>
                  </Div>
                  {model.comparison && (
                    <Link
                      href={`/${locale}${model.comparison.path}`}
                      className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {t("compareBase", { model: model.comparison.name })}
                    </Link>
                  )}
                </Div>
                <Cta
                  href={chatHref(locale, model)}
                  label={t("chat", { model: model.name })}
                  variant="secondary"
                  className="h-auto min-h-12 max-w-full whitespace-normal py-2 text-center"
                />
              </Div>
            ))}
          </Div>
        )}
      </PageSection>
      {models.length > 1 && (
        <PageSection
          title={t("trial.title")}
          intro={t("trial.start")}
          tone="muted"
          narrow
        >
          <Div className="grid gap-4">
            <P className="rounded-xl border border-border bg-card p-5 text-foreground">
              {t("trial.prompt")}
            </P>
            <P className="text-muted-foreground">{t("trial.compare")}</P>
          </Div>
        </PageSection>
      )}
      <PageSection title={t("questions")} narrow>
        <JsonLd id="abliterated-chat-faq" data={buildFaqStructuredData(faq)} />
        <Div className="flex flex-col gap-6">
          {faq.map(({ question, answer }) => (
            <Div key={question}>
              <H3 className="font-semibold">{question}</H3>
              <P className="mt-2 text-muted-foreground">{answer}</P>
            </Div>
          ))}
        </Div>
      </PageSection>
      <PageSection title={t("guides")} tone="muted" narrow>
        <Div className="flex flex-col items-start">
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("methodGuide")}
          />
          <CardLink
            href={`/${locale}/story/uncensored-ai`}
            label={t("allModels")}
          />
        </Div>
      </PageSection>
    </>
  );
}

export default async function AbliteratedAiChatPage(
  props: Props,
): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}

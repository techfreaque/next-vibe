import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Bug } from "next-vibe/ui/components/icons/Bug";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleCode,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import {
  Callout,
  Cta,
  FeatureCard,
  FeatureGrid,
  Step,
  StepList,
} from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/blog/e2e-tests-found-real-bugs",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface E2ETestsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<E2ETestsPageData> {
  const { locale } = await params;
  return { locale };
}

/** Facts from the E2E commit (e07e1dc7be). */
const SUITE_COUNT = 50;
const COVERED_ENDPOINTS = "47/56";

const SPEC_EXAMPLE = `describe("E2E: contact form", () => {
  const e2e = useE2E("contact");

  e2e.it("sends a message", async ({ open, uniqueEmail }) => {
    const form = await open(contactEndpoints.POST, {
      path: "/story/framework",
    });
    await form.fill({
      name: "E2E",
      email: uniqueEmail("contact"),
      subject: ContactSubject.BUG_REPORT,
      message: "...",
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
  });
});`;

const SECURITY_KEYS = [
  "openRedirect",
  "ssrf",
  "ssrCache",
  "systemPrompt",
  "publicFeed",
  "loginOptions",
  "resetPassword",
  "privateFiles",
] as const;

const STEP_KEYS = ["step1", "step2", "step3", "step4", "step5"] as const;

export function TanstackPage({ locale }: E2ETestsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  const layers = [
    {
      key: "unit",
      label: t("why.unit.label"),
      title: t("why.unit.title"),
      body: t("why.unit.body"),
    },
    {
      key: "api",
      label: t("why.api.label"),
      title: t("why.api.title"),
      body: t("why.api.body"),
    },
    {
      key: "e2e",
      label: t("why.e2e.label"),
      title: t("why.e2e.title"),
      body: t("why.e2e.body"),
    },
  ];

  const stats = [
    { value: String(SUITE_COUNT), label: t("numbers.suites") },
    { value: COVERED_ENDPOINTS, label: t("numbers.covered") },
    { value: String(SECURITY_KEYS.length), label: t("numbers.security") },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("e2e-tests-found-real-bugs", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p1")}</ArticleP>
        </Div>

        <ArticleSection title={t("why.title")} intro={t("why.intro")}>
          <Div className="grid gap-3 sm:grid-cols-3">
            {layers.map((layer) => (
              <Div
                key={layer.key}
                className={
                  layer.key === "e2e"
                    ? "rounded-xl border border-primary/40 bg-primary/5 p-5"
                    : "rounded-xl border border-border bg-card p-5"
                }
              >
                <Span
                  className={
                    layer.key === "e2e"
                      ? "text-xs font-semibold uppercase tracking-[0.12em] text-primary"
                      : "text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  }
                >
                  {layer.label}
                </Span>
                <P className="mt-2 font-semibold leading-snug">{layer.title}</P>
                <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {layer.body}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection title={t("how.title")} intro={t("how.intro")}>
          <StepList>
            {STEP_KEYS.map((key, index) => (
              <Step
                key={key}
                number={index + 1}
                title={t(`how.${key}.title`)}
                description={t(`how.${key}.body`)}
              />
            ))}
          </StepList>
          <Div className="mt-4 flex flex-col gap-2">
            <ArticleCode
              code={SPEC_EXAMPLE}
              language="typescript"
              filename="contact.e2e.test.ts"
            />
            <P className="text-sm text-muted-foreground">
              {t("how.codeCaption")}
            </P>
          </Div>
        </ArticleSection>

        <ArticleSection title={t("numbers.title")}>
          <Div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {stats.map((stat) => (
              <Div key={stat.label} className="bg-card px-5 py-5">
                <Div className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </Div>
                <Div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </Div>
              </Div>
            ))}
          </Div>
          <P className="text-sm leading-relaxed text-muted-foreground">
            {t("numbers.note")}
          </P>
        </ArticleSection>

        <ArticleSection title={t("security.title")} intro={t("security.intro")}>
          <FeatureGrid columns={2} className="md:gap-4">
            {SECURITY_KEYS.map((key) => (
              <FeatureCard
                key={key}
                icon={ShieldOff}
                title={t(`security.${key}.title`)}
                className="p-5"
              >
                {t(`security.${key}.body`)}
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ArticleSection>

        <ArticleSection title={t("broken.title")} intro={t("broken.intro")}>
          <ArticleList
            items={[
              t("broken.items.attachments"),
              t("broken.items.permissions"),
              t("broken.items.embed"),
              t("broken.items.invoices"),
              t("broken.items.models"),
              t("broken.items.music"),
              t("broken.items.fixtures"),
              t("broken.items.pglite"),
              t("broken.items.pagination"),
            ]}
          />
          <Callout icon={Bug} tone="neutral">
            {t("broken.footer")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("closing.title")}>
          <ArticleP>{t("closing.p1")}</ArticleP>
          <ArticleP>{t("closing.p2")}</ArticleP>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={GITHUB_REPO_URL}
                label={t("cta.github")}
                icon={Github}
                external
              />
              <Cta
                href={`/${locale}/story/framework`}
                label={t("cta.framework")}
                icon={Globe}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function E2ETestsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

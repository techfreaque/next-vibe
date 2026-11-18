import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Database } from "next-vibe/ui/components/icons/Database";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Network } from "next-vibe/ui/components/icons/Network";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Radio } from "next-vibe/ui/components/icons/Radio";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Smartphone } from "next-vibe/ui/components/icons/Smartphone";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { API_KEY_ENV, buildPublicApiBaseUrl } from "@/api-keys/coding-tools";
import { API_KEYS_PAGE_PATH } from "@/api-keys/constants";
import { GITHUB_REPO_URL } from "@/env/constants";

import { CodeTabs } from "../../docs/api/_components/code-tabs";
import { Endpoint, renderRich } from "../../docs/api/_components/doc-blocks";
import {
  Callout,
  CardLink,
  Cta,
  CtaRow,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

const CONTACT_SOURCE = `${GITHUB_REPO_URL}/tree/main/src/contact`;

// Excerpts from src/contact/definition.ts and src/contact/route.ts.
const CONTACT_DEFINITION = `const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  aliases: [CONTACT_FORM_ALIAS],
  requiresConfirmation: true,
  // … metadata and allowed roles
  fields: customWidgetObject({
    render: ContactFormWidget,
    usage: { request: "data", response: true },
    children: {
      message: requestField(scopedTranslation, {
        schema: z.string().min(10),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
      }),
      // … remaining inputs and response
    },
  }),
  // … examples, success and error types
});`;

const CONTACT_ROUTE = `export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    // … email templates
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(
        data, user, locale, logger, t,
      ),
  },
});`;

const QUICKSTART = `git clone ${GITHUB_REPO_URL}
cd next-vibe
bun install
bun run dev`;

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface FrameworkPageData {
  locale: CountryLanguage;
  apiBaseUrl: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FrameworkPageData> {
  const { locale } = await params;
  return {
    locale,
    apiBaseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<ReturnType<typeof metadataGenerator>> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/framework",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
}

export function TanstackPage({
  locale,
  apiBaseUrl,
}: FrameworkPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const apiDocs = `/${locale}/docs/api`;
  const apiKeys = `/${locale}/${API_KEYS_PAGE_PATH}`;
  const codeLabels = {
    copyLabel: t("code.copy"),
    copiedLabel: t("code.copied"),
    wrapLabel: t("code.wrap"),
  };

  const surfaces = [
    { icon: Globe, title: t("example.web.title"), body: t("example.web.body") },
    {
      icon: Terminal,
      title: t("example.cli.title"),
      body: t("example.cli.body"),
    },
    { icon: Plug, title: t("example.mcp.title"), body: t("example.mcp.body") },
    {
      icon: Smartphone,
      title: t("example.native.title"),
      body: t("example.native.body"),
    },
    { icon: Bot, title: t("example.ai.title"), body: t("example.ai.body") },
  ];

  const architecture = [
    {
      icon: Layers,
      title: t("architecture.platform.title"),
      body: t("architecture.platform.body"),
    },
    {
      icon: Database,
      title: t("architecture.data.title"),
      body: t("architecture.data.body"),
    },
    {
      icon: Radio,
      title: t("architecture.realtime.title"),
      body: t("architecture.realtime.body"),
    },
    {
      icon: Network,
      title: t("architecture.remote.title"),
      body: t("architecture.remote.body"),
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        title={t("hero.title")}
        subtitle={renderRich(t("hero.subtitle"))}
        actions={
          <>
            <Cta
              href="#quickstart"
              label={t("hero.quickstart")}
              icon={ArrowDown}
              arrow={false}
            />
            <Cta
              href={apiDocs}
              label={t("api.docs")}
              variant="secondary"
              icon={BookOpen}
            />
          </>
        }
      />

      <PageSection
        title={t("example.title")}
        intro={renderRich(t("example.intro"))}
      >
        <Div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
          <Div className="min-w-0">
            <CodeTabs
              {...codeLabels}
              tabs={[
                {
                  label: "definition.ts",
                  language: "typescript",
                  code: CONTACT_DEFINITION,
                },
                {
                  label: "route.ts",
                  language: "typescript",
                  code: CONTACT_ROUTE,
                },
              ]}
            />
            <Div className="mt-2 flex flex-wrap gap-x-5">
              <CardLink
                href={CONTACT_SOURCE}
                label={t("example.source")}
                external
              />
              <CardLink href={`/${locale}/help`} label={t("example.form")} />
            </Div>
          </Div>
          <Div className="min-w-0 divide-y divide-border rounded-xl border border-border bg-card px-4 shadow-xs sm:px-5">
            {surfaces.map(({ icon: Icon, title, body }) => (
              <Div
                key={title}
                className="flex items-start gap-3 py-3.5 sm:gap-4 sm:py-4"
              >
                <Div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Div>
                <Div className="min-w-0">
                  <H3 className="text-sm font-semibold tracking-tight">
                    {title}
                  </H3>
                  <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {renderRich(body)}
                  </P>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      </PageSection>

      <PageSection
        id="quickstart"
        tone="muted"
        title={t("quickstart.title")}
        intro={t("quickstart.intro")}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
          <CodeTabs
            {...codeLabels}
            tabs={[
              { label: t("code.terminal"), language: "bash", code: QUICKSTART },
            ]}
          />
          <Div className="flex min-w-0 flex-col gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            <P>{renderRich(t("quickstart.start"))}</P>
            <P>{renderRich(t("quickstart.pglite"))}</P>
          </Div>
        </Div>
        <CtaRow className="mt-6">
          <Cta
            href={GITHUB_REPO_URL}
            label={t("quickstart.github")}
            icon={Github}
            variant="secondary"
            external
          />
          <Cta
            href={`/${locale}/story/self-host`}
            label={t("quickstart.selfHost")}
            icon={Server}
            variant="secondary"
          />
        </CtaRow>
      </PageSection>

      <PageSection id="api" title={t("api.title")} intro={t("api.intro")}>
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
          <Div className="flex min-w-0 flex-col gap-4">
            <Div className="flex flex-wrap gap-2">
              <Endpoint method="POST" path="/v1/chat/completions" />
              <Endpoint method="POST" path="/v1/responses" />
              <Endpoint method="POST" path="/v1/messages" />
            </Div>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {renderRich(t("api.models"))}
            </P>
          </Div>
          <CodeTabs
            {...codeLabels}
            title={t("api.request")}
            tabs={[
              {
                label: "curl",
                language: "bash",
                code: `curl ${apiBaseUrl}/models \\\n  -H "Authorization: Bearer $${API_KEY_ENV}"`,
              },
            ]}
          />
        </Div>
        <CtaRow className="mt-6">
          <Cta href={apiDocs} label={t("api.docs")} icon={BookOpen} />
          <Cta
            href={apiKeys}
            label={t("api.keys")}
            icon={Key}
            variant="secondary"
          />
        </CtaRow>
      </PageSection>

      <PageSection tone="muted" title={t("architecture.title")}>
        <FeatureGrid columns={2}>
          {architecture.map(({ icon, title, body }) => (
            <FeatureCard key={title} icon={icon} title={title}>
              {renderRich(body)}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <Callout tone="neutral" className="mt-6">
          <H3 className="mb-1 text-base font-semibold tracking-tight">
            {t("architecture.maturity.title")}
          </H3>
          <P className="text-muted-foreground">
            {t("architecture.maturity.body")}
          </P>
        </Callout>
      </PageSection>
    </Div>
  );
}

export default async function FrameworkPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

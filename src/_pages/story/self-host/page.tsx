import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { ExternalLink } from "next-vibe/ui/components/link";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  Callout,
  Cta,
  PageHero,
  PageSection,
  Step,
  StepList,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface SelfHostPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<SelfHostPageData> {
  const { locale } = await params;
  return { locale };
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/self-host",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

const CLOUD_URL = "https://unbottled.ai";
const BOOTSTRAP = "src/vibe/platforms/cli/bootstrap-vibe-runtime.mjs";
const INSTALL = `git clone ${GITHUB_REPO_URL} && cd next-vibe && node ${BOOTSTRAP} setup`;
const SECRET = `node -p "require('node:crypto').randomBytes(32).toString('hex')"`;
const DEV = "vibe dev";
const LIST_CONNECTIONS = "vibe remote-connections";
const CONNECT = [
  `vibe remote-connect --remote-url=${CLOUD_URL} --email="you@example.com" --password="YOUR_CLOUD_PASSWORD" --is-inference-provider=true`,
  "--syncScope.memories=false --syncScope.documents=false --syncScope.skills=false --syncScope.favorites=false --syncScope.threads=false",
].join(" ");
const LOCAL_DB = 'DATABASE_URL="file:./data.db"';
const PROVIDER = 'OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"';
const COMPOSE =
  "docker compose -f docker-compose.prod.yml -f docker-compose.standalone.yml";
const DOCKER_START = `${COMPOSE} up -d --build`;
const UPDATE_SOURCE = `git pull --ff-only && bun install && ${DEV}`;
const UPDATE_DOCKER = `git pull --ff-only &&\n${DOCKER_START}`;
const DOCKER_ENV = `NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_VIBE_MODE="dev"
POSTGRES_PASSWORD="YOUR_DATABASE_PASSWORD"
CHAT_STORAGE_PATH="/app/uploads/chat"
PG_DATA_HOST_DIR="./docker-db-data"
UPLOADS_HOST_DIR="./docker-uploads"`;

function Snippet({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet code={code} language={language} />
    </Div>
  );
}

export function TanstackPage({ locale }: SelfHostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <Button
              asChild
              size="lg"
              className="h-12 w-full gap-2 px-6 text-base sm:w-auto"
            >
              <ExternalLink href="#account">
                <ArrowDown className="h-4 w-4" />
                {t("account.title")}
              </ExternalLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full bg-card px-6 text-base sm:w-auto"
            >
              <ExternalLink href="#standalone">
                {t("standalone.title")}
              </ExternalLink>
            </Button>
          </>
        }
      />

      <PageSection
        id="account"
        title={t("account.title")}
        intro={t("account.intro")}
        narrow
      >
        <StepList>
          <Step
            number={1}
            title={t("account.start.title")}
            description={t("account.start.body")}
          >
            <Div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary underline underline-offset-4">
              <ExternalLink href="#install">{t("install.title")}</ExternalLink>
              <ExternalLink href={`${CLOUD_URL}/${locale}/user/signup`}>
                {t("account.start.signup")}
              </ExternalLink>
            </Div>
          </Step>
          <Step
            number={2}
            title={t("account.connect.title")}
            description={t("account.connect.body")}
          >
            <Callout icon={Lock} tone="neutral">
              {t("account.privacy")}
            </Callout>
          </Step>
          <Step
            number={3}
            title={t("account.verify.title")}
            description={t("account.verify.body")}
          />
        </StepList>
        <Div className="mt-10 flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <H3 className="text-lg font-semibold">{t("account.cli.title")}</H3>
          <P className="text-sm leading-relaxed text-muted-foreground">
            {t("account.cli.body")}
          </P>
          <Snippet code={CONNECT} />
          <P className="text-sm leading-relaxed text-muted-foreground">
            {t("account.cli.diagnostics")}
          </P>
          <Snippet code={LIST_CONNECTIONS} />
        </Div>
      </PageSection>

      <PageSection
        id="standalone"
        title={t("standalone.title")}
        intro={t("standalone.intro")}
        tone="muted"
        narrow
      >
        <StepList>
          <Step
            number={1}
            title={t("standalone.start.title")}
            description={t("standalone.start.body")}
          >
            <ExternalLink
              href="#install"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("install.title")}
            </ExternalLink>
          </Step>
          <Step
            number={2}
            title={t("standalone.provider.title")}
            description={t("standalone.provider.body")}
          >
            <ExternalLink
              href="https://openrouter.ai/keys"
              className="mb-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("standalone.provider.key")}
            </ExternalLink>
            <Snippet code={PROVIDER} language="ini" />
          </Step>
          <Step
            number={3}
            title={t("standalone.verify.title")}
            description={t("standalone.verify.body")}
          />
        </StepList>
      </PageSection>

      <PageSection
        id="install"
        title={t("install.title")}
        intro={t("install.requirements")}
        narrow
      >
        <StepList>
          <Step
            number={1}
            title={t("install.checkout.title")}
            description={t("install.checkout.body")}
          >
            <Snippet code={INSTALL} />
            <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("install.checkout.windows")}
            </P>
          </Step>
          <Step
            number={2}
            title={t("install.config.title")}
            description={t("install.config.body")}
          >
            <Snippet code={LOCAL_DB} language="ini" />
            <P className="my-3 text-sm leading-relaxed text-muted-foreground">
              {t("install.config.secrets")}
            </P>
            <Snippet code={SECRET} />
          </Step>
          <Step
            number={3}
            title={t("install.run.title")}
            description={t("install.run.body")}
          >
            <Snippet code={DEV} />
          </Step>
        </StepList>
      </PageSection>

      <PageSection
        id="docker"
        title={t("docker.title")}
        intro={t("docker.intro")}
        tone="muted"
        narrow
      >
        <StepList>
          <Step
            number={1}
            title={t("docker.config.title")}
            description={t("docker.config.body")}
          >
            <Snippet code={`git clone ${GITHUB_REPO_URL} && cd next-vibe`} />
            <P className="my-3 text-sm leading-relaxed text-muted-foreground">
              {t("docker.config.env")}
            </P>
            <Snippet code={DOCKER_ENV} language="ini" />
          </Step>
          <Step
            number={2}
            title={t("docker.run.title")}
            description={t("docker.run.body")}
          >
            <Snippet code={DOCKER_START} />
          </Step>
        </StepList>
      </PageSection>

      <PageSection
        id="update"
        title={t("update.title")}
        intro={t("update.intro")}
        narrow
      >
        <Div className="flex flex-col gap-6">
          <Div className="flex min-w-0 flex-col gap-3">
            <H3 className="text-lg font-semibold">
              {t("update.source.title")}
            </H3>
            <P className="text-sm leading-relaxed text-muted-foreground">
              {t("update.source.body")}
            </P>
            <Snippet code={UPDATE_SOURCE} />
          </Div>
          <Div className="flex min-w-0 flex-col gap-3">
            <H3 className="text-lg font-semibold">{t("docker.title")}</H3>
            <P className="text-sm leading-relaxed text-muted-foreground">
              {t("update.docker")}
            </P>
            <Snippet code={UPDATE_DOCKER} />
          </Div>
        </Div>
      </PageSection>

      <PageSection
        id="troubleshooting"
        title={t("troubleshoot.title")}
        tone="muted"
        narrow
      >
        <Div className="flex flex-col gap-6">
          <Div className="flex min-w-0 flex-col gap-3">
            <H3 className="text-lg font-semibold">
              {t("troubleshoot.path.title")}
            </H3>
            <P className="text-sm leading-relaxed text-muted-foreground">
              {t("troubleshoot.path.body")}
            </P>
            <Snippet code={`node ${BOOTSTRAP} dev`} />
          </Div>
          <Div>
            <H3 className="text-lg font-semibold">
              {t("troubleshoot.connect.title")}
            </H3>
            <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("troubleshoot.connect.body")}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold">
              {t("troubleshoot.models.title")}
            </H3>
            <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("troubleshoot.models.body")}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold">
              {t("troubleshoot.credits.title")}
            </H3>
            <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("troubleshoot.credits.body")}
            </P>
          </Div>
          <Div className="flex min-w-0 flex-col gap-3">
            <H3 className="text-lg font-semibold">
              {t("troubleshoot.docker.title")}
            </H3>
            <P className="text-sm leading-relaxed text-muted-foreground">
              {t("troubleshoot.docker.body")}
            </P>
            <Snippet code={`${COMPOSE} logs --tail=100 app`} />
          </Div>
          <Div className="mt-2 self-start">
            <Cta
              href={`${GITHUB_REPO_URL}/issues`}
              label={t("troubleshoot.issue")}
              icon={Github}
              variant="secondary"
              external
            />
          </Div>
        </Div>
      </PageSection>
    </Div>
  );
}

export default async function SelfHostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

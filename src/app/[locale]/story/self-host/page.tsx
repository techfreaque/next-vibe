import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowDown } from "next-vibe-ui/ui/icons/ArrowDown";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Link } from "next-vibe-ui/ui/link";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { ContactFormSection } from "../_components/contact-form-section";

import { scopedTranslation } from "./i18n";

export interface SelfHostPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<SelfHostPageData> {
  const { locale } = await params;
  return { locale };
}

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

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

const CLONE_MD = `\`\`\`bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
bun install
\`\`\``;

const DEV_MD = `\`\`\`bash
vibe dev
\`\`\``;

const OPTION_A_MD = `\`\`\`bash
# Claude Code - no API key needed
# Requires Claude subscription + Claude Code CLI
claude login   # sign in once
# Then select any claude-code-* model in the model picker
\`\`\``;

const OPTION_B_MD = `\`\`\`bash
# OpenRouter - 200+ models, pay per use
# Paste your key in Settings → API Keys
# Get yours at openrouter.ai/keys
\`\`\``;

const VPS_DOCKER_MD = `\`\`\`bash
bash scripts/install-docker.sh
vibe build && vibe start
# Point Caddy / nginx at port 3000
\`\`\``;

const K8S_MD = `\`\`\`bash
# Edit k8s/secret.yaml with your env vars
kubectl apply -k k8s/
\`\`\``;

const INCLUDES = [
  "models",
  "memory",
  "search",
  "thea",
  "admin",
  "ssh",
  "sync",
  "free",
] as const;

export function TanstackPage({ locale }: SelfHostPageData): JSX.Element {
  return <SelfHostPageContent locale={locale} />;
}

function SelfHostPageContent({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const modelCount = getAvailableModelCount(agentEnvAvailability, false);

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen">
      {/* Hero */}
      <Div className="relative overflow-hidden border-b border-border/40">
        <Div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 70%)",
          }}
        />
        <Container size="lg" className="relative py-20 md:py-28 text-center">
          <Span className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium uppercase tracking-wider">
            {t("hero.badge")}
          </Span>
          <H1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            {t("hero.title")}{" "}
            <Span className="text-transparent bg-clip-text bg-linear-to-br from-emerald-400 to-teal-400">
              {t("hero.titleHighlight")}
            </Span>
          </H1>
          <P className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle", { appName })}
          </P>
          <Div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 font-semibold"
              asChild
            >
              <Link href="#quickstart">
                <ArrowDown className="mr-2 h-4 w-4" />
                {t("hero.ctaQuickstart")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              asChild
            >
              <Link href="https://github.com/techfreaque/next-vibe">
                <GitBranch className="mr-2 h-4 w-4" />
                {t("hero.ctaGithub")}
              </Link>
            </Button>
          </Div>
        </Container>
      </Div>

      {/* What's included */}
      <Container size="lg" className="py-16 md:py-20">
        <H2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {t("includes.title")}
        </H2>
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {INCLUDES.map((key) => (
            <Div key={key} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <P className="text-sm text-muted-foreground">
                {t(`includes.items.${key}`, { appName, modelCount })}
              </P>
            </Div>
          ))}
        </Div>
      </Container>

      {/* Quickstart */}
      <Div id="quickstart" className="border-t border-border/40">
        <Container size="lg" className="py-16 md:py-20">
          <Div className="max-w-2xl mx-auto">
            <H2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("quickstart.title")}
            </H2>
            <P className="text-muted-foreground mb-10">
              {t("quickstart.subtitle")}
            </P>

            {/* Step 1 - Clone */}
            <Div className="mb-8">
              <H3 className="text-lg font-semibold mb-1">
                1. {t("quickstart.step1.title")}
              </H3>
              <P className="text-sm text-muted-foreground mb-3">
                {t("quickstart.step1.description")}
              </P>
              <Div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown content={CLONE_MD} />
              </Div>
            </Div>

            {/* Step 2 - vibe dev */}
            <Div className="mb-8">
              <H3 className="text-lg font-semibold mb-1">
                2. {t("quickstart.step2.title")}
              </H3>
              <P className="text-sm text-muted-foreground mb-3">
                {t("quickstart.step2.description")}
              </P>
              <Div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown content={DEV_MD} />
              </Div>
            </Div>

            {/* Step 3 - Login and wizard */}
            <Div className="mb-8">
              <H3 className="text-lg font-semibold mb-1">
                3. {t("quickstart.step3.title")}
              </H3>
              <P className="text-sm text-muted-foreground">
                {t("quickstart.step3.description")}
              </P>
            </Div>

            {/* Step 4 - Pick provider */}
            <Div className="mb-2">
              <H3 className="text-lg font-semibold mb-4">
                4. {t("quickstart.step4.title")}
              </H3>
              <Div className="grid gap-4 sm:grid-cols-2">
                <Div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <P className="text-xs font-semibold text-emerald-400 mb-2">
                    {t("quickstart.step4.optionA.label")}
                  </P>
                  <P className="text-xs text-muted-foreground mb-3">
                    {t("quickstart.step4.optionA.description")}
                  </P>
                  <Div className="prose prose-xs dark:prose-invert max-w-none">
                    <Markdown content={OPTION_A_MD} />
                  </Div>
                </Div>
                <Div className="rounded-lg border border-border p-4">
                  <P className="text-xs font-semibold mb-2">
                    {t("quickstart.step4.optionB.label")}
                  </P>
                  <P className="text-xs text-muted-foreground mb-3">
                    {t("quickstart.step4.optionB.description")}
                  </P>
                  <Div className="prose prose-xs dark:prose-invert max-w-none">
                    <Markdown content={OPTION_B_MD} />
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        </Container>
      </Div>

      {/* VPS + Kubernetes */}
      <Div className="border-t border-border/40">
        <Container size="lg" className="py-16 md:py-20">
          <Div className="max-w-2xl mx-auto">
            <H2 className="text-xl font-bold mb-2">{t("vps.title")}</H2>
            <P className="text-sm text-muted-foreground mb-6">
              {t("vps.description")}
            </P>
            <Div className="grid gap-6 sm:grid-cols-2">
              <Div>
                <H3 className="text-sm font-semibold mb-3">
                  {t("vps.docker")}
                </H3>
                <Div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown content={VPS_DOCKER_MD} />
                </Div>
              </Div>
              <Div>
                <H3 className="text-sm font-semibold mb-3">
                  {t("vps.kubernetes")}
                </H3>
                <P className="text-xs text-muted-foreground mb-3">
                  {t("vps.kubernetesDescription")}
                </P>
                <Div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown content={K8S_MD} />
                </Div>
              </Div>
            </Div>
          </Div>
        </Container>
      </Div>

      {/* Local sync */}
      <Div className="border-t border-border/40">
        <Container size="lg" className="py-16 md:py-20">
          <Div className="max-w-2xl mx-auto">
            <H2 className="text-xl font-bold mb-2">{t("localSync.title")}</H2>
            <P className="text-sm text-muted-foreground">
              {t("localSync.description")}
            </P>
          </Div>
        </Container>
      </Div>

      {/* Enterprise / contact */}
      <Div className="border-t border-border/40 bg-muted/10">
        <Container size="lg" className="py-16 md:py-20">
          <Div className="max-w-4xl mx-auto">
            <Div className="text-center mb-10">
              <H2 className="text-2xl md:text-3xl font-bold mb-3">
                {t("enterprise.title")}
              </H2>
              <P className="text-muted-foreground max-w-xl mx-auto">
                {t("enterprise.description")}
              </P>
            </Div>
            <ContactFormSection locale={locale} user={publicUser} />
          </Div>
        </Container>
      </Div>
    </Div>
  );
}

export default async function SelfHostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

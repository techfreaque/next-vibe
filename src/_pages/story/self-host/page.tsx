/**
 * /story/self-host - run unbottled.ai on your own machine.
 *
 * One install is the whole suite (AI, agents, accounting/ERP, CRM, payments,
 * framework); the suite section links /story/business and /story/framework.
 * Primary path: connect the instance to an unbottled.ai account (every
 * model, no provider keys). Setup is git clone, bun i, vibe dev; the
 * first-run wizard at /setup does the rest (admin login, Connect AI,
 * optional extras). Fully server-rendered; only copy buttons and the
 * platform tabs of the prerequisites hydrate.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { Code as CodeIcon } from "next-vibe/ui/components/icons/Code";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Rocket } from "next-vibe/ui/components/icons/Rocket";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Sliders } from "next-vibe/ui/components/icons/Sliders";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { ContactFormSection } from "../_components/contact-form-section";
import { PersonalShowcase } from "../_components/personal-showcase";
import {
  CardLink,
  Cta,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
} from "../_shared/marketing";
import { Prereqs } from "../_shared/quickstart/prereqs";
import { QUICKSTART_COMMANDS } from "../_shared/quickstart/quickstart";
import { TerminalCard } from "../_shared/quickstart/terminal";
import { scopedTranslation } from "./i18n";

export interface SelfHostPageData {
  locale: CountryLanguage;
  modelCount: number;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<SelfHostPageData> {
  const { locale } = await params;
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  return {
    locale,
    modelCount,
    platform: Platform.NEXT_PAGE,
  };
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

const OPENROUTER_KEYS_URL = "https://openrouter.ai/keys";

/** The default local URL `vibe dev` serves on. */
const LOCAL_URL = "localhost:3000";

const SERVER_COMMANDS = [
  { key: "start", command: "vibe build && vibe start" },
  { key: "update", command: "vibe rebuild" },
] as const;

const INSTANCE_POINTS = ["chats", "files", "tools", "admin"] as const;
const ACCOUNT_SIDE_POINTS = ["models", "keys"] as const;
const BROWSER_STEPS = ["open", "admin", "ai", "extras"] as const;
const LOCAL_FACTS = ["docker", "postgres", "config"] as const;
const ACCOUNT_POINTS = ["models", "local", "sync", "paid"] as const;
const KEY_PROVIDERS = ["openrouter", "venice", "nanogpt"] as const;

/** What one install brings; the business modules link deeper below the grid. */
const SUITE = [
  { key: "ai", icon: MessageSquare },
  { key: "agents", icon: Bot },
  { key: "books", icon: BookOpen },
  { key: "customers", icon: Users },
  { key: "payments", icon: CreditCard },
  { key: "build", icon: CodeIcon },
] as const;

/** Small uppercase label above a card title. */
function CardLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </Span>
  );
}

function IconTile({
  icon: Icon,
  muted = false,
}: {
  icon: IconComponent;
  muted?: boolean;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        muted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
      )}
    >
      <Icon className="h-5 w-5" />
    </Span>
  );
}

function CheckList({ items }: { items: readonly string[] }): JSX.Element {
  return (
    <Div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <Div key={item} className="flex gap-2.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <P className="text-sm leading-relaxed text-foreground/90">{item}</P>
        </Div>
      ))}
    </Div>
  );
}

/** Hero visual: what runs where once the instance is connected. */
function ConnectionDiagram({
  instance,
  account,
  link,
}: {
  instance: { label: string; title: string; points: string[] };
  account: { label: string; title: string; points: string[] };
  link: string;
}): JSX.Element {
  return (
    <Div className="mt-12 grid items-stretch gap-0 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <Div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <Div className="flex items-center gap-3">
          <IconTile icon={Server} />
          <Div className="min-w-0">
            <CardLabel>{instance.label}</CardLabel>
            <H3 className="text-lg font-semibold leading-tight tracking-tight">
              {instance.title}
            </H3>
          </Div>
        </Div>
        <CheckList items={instance.points} />
      </Div>

      <Div className="flex items-center justify-center">
        <Div className="flex flex-col items-center md:flex-row">
          <Span className="h-5 w-px bg-primary/50 md:h-px md:w-5" />
          <Span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold whitespace-nowrap text-primary">
            <Link2 className="h-3.5 w-3.5" />
            {link}
          </Span>
          <Span className="h-5 w-px bg-primary/50 md:h-px md:w-5" />
        </Div>
      </Div>

      <Div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-primary/40 bg-card p-6 shadow-xs ring-1 ring-primary/15">
        <Div className="flex items-center gap-3">
          <IconTile icon={Cloud} />
          <Div className="min-w-0">
            <CardLabel>{account.label}</CardLabel>
            <H3 className="text-lg font-semibold leading-tight tracking-tight">
              {account.title}
            </H3>
          </Div>
        </Div>
        <CheckList items={account.points} />
      </Div>
    </Div>
  );
}

function ColumnHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: IconComponent;
  eyebrow: string;
  title: string;
}): JSX.Element {
  return (
    <Div className="mb-4 flex items-center gap-3">
      <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </Span>
      <Div className="min-w-0">
        <CardLabel>{eyebrow}</CardLabel>
        <H3 className="text-xl font-semibold leading-tight tracking-tight">
          {title}
        </H3>
      </Div>
    </Div>
  );
}

function Note({ children }: { children: ReactNode }): JSX.Element {
  return (
    <P className="text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
      {children}
    </P>
  );
}

function OptionCard({
  icon,
  title,
  body,
  children,
  footer,
}: {
  icon: IconComponent;
  title: string;
  body: string;
  children?: ReactNode;
  footer?: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
      <Div className="flex items-center gap-3">
        <IconTile icon={icon} muted />
        <H3 className="text-lg font-semibold leading-snug tracking-tight">
          {title}
        </H3>
      </Div>
      <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {body}
      </P>
      {children !== undefined && <Div className="mt-4">{children}</Div>}
      {footer !== undefined && <Div className="mt-auto pt-4">{footer}</Div>}
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  platform,
}: SelfHostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const vars = { appName, modelCount, url: LOCAL_URL };

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.badge")}
        eyebrowIcon={Server}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleHighlight")}</Span>
          </>
        }
        subtitle={t("hero.subtitle", vars)}
        actions={
          <>
            <Cta
              href="#start"
              label={t("hero.ctaStart")}
              icon={ArrowDown}
              arrow={false}
            />
            <Cta
              href={GITHUB_REPO_URL}
              label={t("hero.ctaGithub")}
              icon={Github}
              variant="secondary"
              external
            />
          </>
        }
      >
        <ConnectionDiagram
          link={t("diagram.link", vars)}
          instance={{
            label: t("diagram.instance.label"),
            title: t("diagram.instance.title"),
            points: INSTANCE_POINTS.map((key) =>
              t(`diagram.instance.points.${key}`, vars),
            ),
          }}
          account={{
            label: t("diagram.account.label", vars),
            title: t("diagram.account.title", vars),
            points: ACCOUNT_SIDE_POINTS.map((key) =>
              t(`diagram.account.points.${key}`, vars),
            ),
          }}
        />
      </PageHero>

      <PageSection
        id="suite"
        label={t("suite.eyebrow")}
        title={t("suite.title")}
        intro={t("suite.intro")}
      >
        <FeatureGrid columns={3}>
          {SUITE.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`suite.cards.${key}.title`)}
              className={cn(
                key === "books" && "border-primary/40 ring-1 ring-primary/15",
              )}
            >
              {t(`suite.cards.${key}.body`, vars)}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <Div className="mt-4">
          <CardLink
            href={`/${locale}/story/business`}
            label={t("suite.link")}
          />
        </Div>
      </PageSection>

      <PageSection
        id="start"
        tone="muted"
        label={t("start.eyebrow")}
        title={t("start.title")}
        intro={t("start.intro")}
      >
        <Div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <Div className="flex min-w-0 flex-col gap-4">
            <ColumnHeading
              icon={Terminal}
              eyebrow={t("start.terminal.eyebrow")}
              title={t("start.terminal.title")}
            />
            <TerminalCard
              title={t("start.terminal.title")}
              rows={QUICKSTART_COMMANDS.map(({ key, command }) => ({
                comment: t(`start.terminal.rows.${key}`),
                command,
              }))}
              copyLabel={t("start.terminal.copy")}
              copiedLabel={t("start.terminal.copied")}
              copyAllLabel={t("start.terminal.copyAll")}
              copyAll={false}
            />
            <Div className="flex flex-wrap gap-2">
              {LOCAL_FACTS.map((key) => (
                <Span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-xs"
                >
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {t(`start.terminal.facts.${key}`)}
                </Span>
              ))}
            </Div>
            <Details className="group mt-2 rounded-xl border border-border bg-card shadow-xs">
              <Summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <Span className="flex min-w-0 items-center gap-2">
                  <Terminal className="h-4 w-4 shrink-0 text-primary" />
                  {t("start.prereqs.summary")}
                </Span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </Summary>
              <Div className="flex flex-col gap-3 border-t border-border p-4">
                <Note>{t("start.prereqs.body")}</Note>
                <Prereqs locale={locale} />
                <Note>{t("start.prereqs.newTerminal")}</Note>
              </Div>
            </Details>
          </Div>

          <Div className="min-w-0 lg:sticky lg:top-24">
            <ColumnHeading
              icon={Monitor}
              eyebrow={t("start.browser.eyebrow")}
              title={t("start.browser.title")}
            />
            <Div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
              <Div className="flex flex-col">
                {BROWSER_STEPS.map((key, index) => {
                  const isAi = key === "ai";
                  return (
                    <Div
                      key={key}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3"
                    >
                      <Div className="flex flex-col items-center">
                        <Span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
                            isAi
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </Span>
                        {index < BROWSER_STEPS.length - 1 && (
                          <Span className="my-1 w-px flex-1 bg-border" />
                        )}
                      </Div>
                      <Div
                        className={cn(
                          "min-w-0",
                          index < BROWSER_STEPS.length - 1 && "pb-5",
                        )}
                      >
                        <P className="flex flex-wrap items-center gap-2 pt-1 font-semibold leading-snug text-foreground">
                          {t(`start.browser.steps.${key}.title`, vars)}
                          {isAi && (
                            <Span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                              {t("start.browser.recommended")}
                            </Span>
                          )}
                        </P>
                        <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {t(`start.browser.steps.${key}.body`, vars)}
                        </P>
                      </Div>
                    </Div>
                  );
                })}
              </Div>
              <Div className="mt-5 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-sm font-medium text-foreground">
                <Rocket className="h-4 w-4 shrink-0 text-primary" />
                {t("start.browser.done")}
              </Div>
            </Div>
          </Div>
        </Div>
      </PageSection>

      <PageSection
        id="ai"
        label={t("ai.eyebrow")}
        title={t("ai.title")}
        intro={t("ai.intro", vars)}
      >
        <Div className="grid gap-6 lg:grid-cols-3">
          <Div className="flex min-w-0 flex-col rounded-2xl border border-primary/40 bg-card p-6 shadow-xs ring-1 ring-primary/15 md:p-8 lg:col-span-2">
            <Div className="flex items-center justify-between gap-3">
              <IconTile icon={Cloud} />
              <Span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {t("ai.account.badge")}
              </Span>
            </Div>
            <H3 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
              {t("ai.account.title", vars)}
            </H3>
            <P className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("ai.account.body", vars)}
            </P>
            <Div className="mt-6 grid gap-4 sm:grid-cols-2">
              {ACCOUNT_POINTS.map((key) => (
                <Div key={key} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <Div className="min-w-0">
                    <P className="text-sm font-semibold text-foreground">
                      {t(`ai.account.points.${key}.title`, vars)}
                    </P>
                    <P className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {t(`ai.account.points.${key}.body`, vars)}
                    </P>
                  </Div>
                </Div>
              ))}
            </Div>
            <Div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
              <Cta
                href={`/${locale}/user/signup`}
                label={t("ai.account.cta", vars)}
              />
              <Cta
                href={`/${locale}/subscription/overview`}
                label={t("ai.account.pricing")}
                variant="secondary"
              />
            </Div>
          </Div>

          <Div className="flex min-w-0 flex-col gap-6">
            <OptionCard
              icon={Bot}
              title={t("ai.claude.title")}
              body={t("ai.claude.body")}
            />
            <OptionCard
              icon={Key}
              title={t("ai.keys.title")}
              body={t("ai.keys.body", vars)}
              footer={
                <CardLink
                  href={OPENROUTER_KEYS_URL}
                  label={t("ai.keys.cta")}
                  external
                />
              }
            >
              <Div className="flex flex-wrap gap-1.5">
                {KEY_PROVIDERS.map((key) => (
                  <Span
                    key={key}
                    className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground"
                  >
                    {t(`ai.keys.providers.${key}`)}
                  </Span>
                ))}
              </Div>
            </OptionCard>
          </Div>
        </Div>
      </PageSection>

      <PersonalShowcase locale={locale} onStoryPage />

      <PageSection
        tone="muted"
        label={t("own.eyebrow")}
        title={t("own.title")}
        intro={t("own.subtitle")}
      >
        <FeatureGrid columns={3}>
          <FeatureCard icon={Sliders} title={t("own.cards.filter.title")}>
            {t("own.cards.filter.body")}
          </FeatureCard>
          <FeatureCard icon={Terminal} title={t("own.cards.api.title")}>
            {t("own.cards.api.body")}
          </FeatureCard>
          <FeatureCard icon={Github} title={t("own.cards.code.title")}>
            {t("own.cards.code.body", vars)}
          </FeatureCard>
        </FeatureGrid>
      </PageSection>

      <PageSection
        id="server"
        label={t("server.eyebrow")}
        title={t("server.title")}
        intro={t("server.intro")}
      >
        <Div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <TerminalCard
            title={t("server.terminalTitle")}
            rows={SERVER_COMMANDS.map(({ key, command }) => ({
              comment: t(`server.rows.${key}`),
              command,
            }))}
            copyAll={false}
            copyLabel={t("start.terminal.copy")}
            copiedLabel={t("start.terminal.copied")}
            copyAllLabel={t("start.terminal.copyAll")}
          />
          <Div className="flex min-w-0 flex-col gap-4">
            <Div className="flex gap-3">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <P className="text-sm leading-relaxed text-foreground/90 md:text-base">
                {t("server.points.proxy")}
              </P>
            </Div>
            <Div className="flex gap-3">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <P className="text-sm leading-relaxed text-foreground/90 md:text-base">
                {t("server.points.env")}
              </P>
            </Div>
            <Div className="flex gap-3">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <P className="text-sm leading-relaxed text-foreground/90 md:text-base">
                {t("server.points.connect", vars)}
              </P>
            </Div>
            <Div className="flex gap-3">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <P className="text-sm leading-relaxed text-foreground/90 md:text-base">
                {t("server.points.db")}
              </P>
            </Div>
          </Div>
        </Div>
      </PageSection>

      <Div className="border-y border-border bg-muted/50">
        <Div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <P className="text-base text-foreground">
            <Span className="font-semibold">{t("developers.title")}</Span>{" "}
            <Span className="text-muted-foreground">
              {t("developers.body")}
            </Span>
          </P>
          <Div className="shrink-0 whitespace-nowrap">
            <CardLink
              href={`/${locale}/story/framework`}
              label={t("developers.cta")}
            />
          </Div>
        </Div>
      </Div>

      <PageSection
        title={t("help.title")}
        intro={t("help.description")}
        centeredHeader
      >
        <Div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-xs md:p-8">
          <ContactFormSection
            locale={locale}
            user={publicUser}
            platform={platform}
            embedded
          />
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

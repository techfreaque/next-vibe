/**
 * /story/business - the self-hosted business suite: double-entry accounting,
 * sales/purchasing/POS documents that post to the ledger, inventory, CRM,
 * newsletter, messaging and payments, all as AI-callable tools.
 *
 * Claims map to real endpoints (chart-of-accounts/**, finance/**, payment/{invoice,bill,
 * estimate,credit-note}/**, purchasing/**, pos/**, inventory/**, tax/**,
 * companies/**). Tool counts come from the generated endpoint index, so they
 * never drift. Never links admin tool pages; screenshots only. Fully server-rendered.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import {
  type CountryLanguage,
  LanguagesArr,
} from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Check } from "next-vibe/ui/components/icons/Check";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Inbox } from "next-vibe/ui/components/icons/Inbox";
import { Megaphone } from "next-vibe/ui/components/icons/Megaphone";
import { Package } from "next-vibe/ui/components/icons/Package";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Server } from "next-vibe/ui/components/icons/Server";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Image } from "next-vibe/ui/components/image";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { CodeTabs } from "../../docs/api/_components/code-tabs";
import { ContactFormSection } from "../_components/contact-form-section";
import {
  Cta,
  CtaRow,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
} from "../_shared/marketing";
import { scopedTranslation as quickstartScopedTranslation } from "../_shared/quickstart/i18n";
import { QUICKSTART_COMMANDS } from "../_shared/quickstart/quickstart";
import { TerminalCard } from "../_shared/quickstart/terminal";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Endpoint path prefixes per area, matched against the generated index. */
const TOOL_AREAS = {
  business: [
    "chart-of-accounts",
    "companies",
    "finance",
    "inventory",
    "pos",
    "products",
    "purchasing",
    "tax",
    "payment/invoice",
    "payment/bill",
    "payment/estimate",
    "payment/credit-note",
    "payment/company-settings",
    "payment/dashboard",
  ],
  crm: ["leads"],
  newsletter: ["newsletter"],
  messaging: ["messenger"],
  payments: [
    "subscription",
    "payment/checkout",
    "payment/refund",
    "payment/portal",
    "payment/processor",
  ],
  team: ["companies"],
} as const;

type ToolArea = keyof typeof TOOL_AREAS;

export interface BusinessPageData {
  locale: CountryLanguage;
  modelCount: number;
  toolCounts: Record<ToolArea, number>;
  platform: Platform;
  structuredData: JsonLdNode;
}

function matchesArea(
  path: readonly string[],
  prefixes: readonly string[],
): boolean {
  const joined = path.join("/");
  return prefixes.some(
    (prefix) => joined === prefix || joined.startsWith(`${prefix}/`),
  );
}

export async function tanstackLoader({
  params,
}: Props): Promise<BusinessPageData> {
  const { locale } = await params;
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const count = (area: ToolArea): number =>
    endpointsMeta.filter((meta) => matchesArea(meta.path, TOOL_AREAS[area]))
      .length;
  return {
    locale,
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    toolCounts: {
      business: count("business"),
      crm: count("crm"),
      newsletter: count("newsletter"),
      messaging: count("messaging"),
      payments: count("payments"),
      team: count("team"),
    },
    platform: Platform.NEXT_PAGE,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: configT("appName"),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Linux, macOS, Windows",
      description: t("meta.description"),
      url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/story/business`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/business",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/business/trial-balance-${shotLanguage(locale)}-dark.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

const LEDGER_POINTS = [
  { key: "balanced", icon: Scale },
  { key: "final", icon: Check },
  { key: "periods", icon: BookOpen },
  { key: "templates", icon: Building },
] as const;

const REPORTS = [
  "balanceSheet",
  "profitLoss",
  "trialBalance",
  "aging",
  "payablesAging",
  "vat",
] as const;

/** Shown with the reports, not counted as one. */
const EXPORTS = ["journalExport", "taxFilings"] as const;

const FLOWS = [
  {
    key: "sales",
    icon: Receipt,
    steps: [
      "flows.sales.steps.estimate",
      "flows.sales.steps.invoice",
      "flows.sales.steps.payment",
    ],
  },
  {
    key: "purchasing",
    icon: ShoppingCart,
    steps: [
      "flows.purchasing.steps.order",
      "flows.purchasing.steps.receipt",
      "flows.purchasing.steps.bill",
      "flows.purchasing.steps.payment",
    ],
  },
  {
    key: "pos",
    icon: Wallet,
    steps: [
      "flows.pos.steps.session",
      "flows.pos.steps.order",
      "flows.pos.steps.payment",
    ],
  },
] as const;

const SUITE: ReadonlyArray<{
  key: "crm" | "newsletter" | "messaging" | "payments" | "team" | "ai";
  icon: IconComponent;
  area: ToolArea | null;
}> = [
  { key: "crm", icon: Users, area: "crm" },
  { key: "newsletter", icon: Megaphone, area: "newsletter" },
  { key: "messaging", icon: Inbox, area: "messaging" },
  { key: "payments", icon: CreditCard, area: "payments" },
  { key: "team", icon: Building, area: "team" },
  { key: "ai", icon: Bot, area: null },
];

const AI_POINTS = [
  { key: "chat", icon: Sparkles },
  { key: "cli", icon: Terminal },
  { key: "mcp", icon: Plug },
  { key: "permissions", icon: Users },
] as const;

const COMPARE_ROWS = [
  "data",
  "seats",
  "ai",
  "code",
  "missing",
  "exit",
  "filings",
  "hosting",
] as const;

/** Rows where the hosted tools win: shown without the "ours" accent. */
const SAAS_WINS: ReadonlySet<string> = new Set(["hosting"]);

const AI_TOOL = "coa-receivables-aging";

/** Chart of accounts templates seeded in src/chart-of-accounts/seeds.ts (DE, AT, SK, XX). */
const CHART_TEMPLATES = 4;

const AI_CLI = `# Who owes you, bucketed by days overdue
vibe ${AI_TOOL} \\
  --companyId=$COMPANY \\
  --asOfDate=2026-12-31

# Same flags for every ledger report
vibe coa-trial-balance \\
  --companyId=$COMPANY \\
  --asOfDate=2026-12-31`;

const AI_MCP = `{
  "method": "tools/call",
  "params": {
    "name": "execute-tool",
    "arguments": {
      "toolName": "${AI_TOOL}",
      "input": {
        "companyId": "<your company id>",
        "asOfDate": "2026-12-31"
      }
    }
  }
}`;

/** Light and dark captures of the real admin, framed like a browser window. */
/** Admin captures exist in these UI languages; others fall back to English. */
const SHOT_LANGUAGES: ReadonlySet<string> = new Set(["en", "de"]);

function shotLanguage(locale: CountryLanguage): string {
  const language = locale.split("-")[0] ?? "en";
  return SHOT_LANGUAGES.has(language) ? language : "en";
}

function ScreenFrame({
  name,
  lang,
  alt,
  width,
  height,
  className,
}: {
  name: string;
  lang: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}): JSX.Element {
  const imgClass = "h-auto w-full";
  return (
    <Div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-primary/5",
        className,
      )}
    >
      <Div className="flex h-8 items-center gap-1.5 border-b border-border bg-muted/60 px-3">
        <Span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <Span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <Span className="size-2.5 rounded-full bg-muted-foreground/30" />
      </Div>
      <Image
        src={`/images/business/${name}-${lang}-light.jpg`}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className={cn(imgClass, "block dark:hidden")}
      />
      <Image
        src={`/images/business/${name}-${lang}-dark.jpg`}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className={cn(imgClass, "hidden dark:block")}
      />
    </Div>
  );
}

function StepChip({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="inline-flex min-h-8 items-center rounded-md border border-border bg-background px-2.5 text-sm font-medium text-foreground">
      {children}
    </Span>
  );
}

function FlowArrow(): JSX.Element {
  return (
    <ArrowRight
      aria-hidden
      className="ml-3 size-4 shrink-0 rotate-90 text-muted-foreground/70 sm:ml-0 sm:rotate-0"
    />
  );
}

export function TanstackPage({
  locale,
  modelCount,
  toolCounts,
  platform,
  structuredData,
}: BusinessPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: quickstartT } = quickstartScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const copy = {
    copyLabel: t("code.copy"),
    copiedLabel: t("code.copied"),
    wrapLabel: t("code.wrap"),
  };

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd id="business-software" data={structuredData} />

      <PageHero
        eyebrow={t("hero.badge")}
        eyebrowIcon={BookOpen}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleHighlight")}</Span>
          </>
        }
        subtitle={t("hero.subtitle")}
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
        <ScreenFrame
          name="trial-balance"
          lang={shotLanguage(locale)}
          alt={t("hero.shotAlt", { appName })}
          width={1600}
          height={1187}
          className="mt-12 md:mt-16"
        />
        <StatGrid
          className="mt-6 md:mt-8"
          items={[
            {
              value:
                toolCounts.business +
                toolCounts.crm +
                toolCounts.newsletter +
                toolCounts.messaging,
              label: t("hero.stats.actions"),
            },
            { value: REPORTS.length, label: t("hero.stats.reports") },
            { value: CHART_TEMPLATES, label: t("hero.stats.charts") },
            { value: LanguagesArr.length, label: t("hero.stats.languages") },
          ]}
        />
      </PageHero>

      {/* ── The books ── */}
      <PageSection
        id="ledger"
        label={t("ledger.eyebrow")}
        title={t("ledger.title")}
        intro={t("ledger.intro")}
      >
        <Div className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {LEDGER_POINTS.map(({ key, icon: Icon }) => (
            <Div key={key} className="min-w-0">
              <Span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </Span>
              <H3 className="mt-3 text-base font-semibold tracking-tight">
                {t(`ledger.points.${key}.title`)}
              </H3>
              <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`ledger.points.${key}.body`)}
              </P>
            </Div>
          ))}
        </Div>
        <ScreenFrame
          name="bills"
          lang={shotLanguage(locale)}
          alt={t("ledger.shotAlt")}
          width={1600}
          height={504}
          className="mt-10"
        />
        <Div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-xs md:p-5">
          <P className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("ledger.reportsLabel")}
          </P>
          <Div className="mt-3 flex flex-wrap gap-2">
            {[...REPORTS, ...EXPORTS].map((key) => (
              <Span
                key={key}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2.5 text-sm font-medium text-foreground"
              >
                <Check className="size-3.5 text-primary" />
                {t(`ledger.reports.${key}`)}
              </Span>
            ))}
          </Div>
        </Div>
      </PageSection>

      {/* ── Documents that post themselves ── */}
      <PageSection
        id="flows"
        tone="muted"
        label={t("flows.eyebrow")}
        title={t("flows.title")}
        intro={t("flows.intro")}
      >
        <Div className="flex flex-col gap-4">
          {FLOWS.map(({ key, icon: Icon, steps }) => (
            <Div
              key={key}
              className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-xs md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-6 md:p-6"
            >
              <Div className="flex items-center gap-3">
                <Span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Span>
                <H3 className="text-lg font-semibold tracking-tight">
                  {t(`flows.${key}.title`)}
                </H3>
              </Div>
              <Div className="min-w-0">
                <Div className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                  {steps.map((step) => (
                    <Span
                      key={step}
                      className="inline-flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2"
                    >
                      <StepChip>{t(step)}</StepChip>
                      <FlowArrow />
                    </Span>
                  ))}
                  <Span className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-sm font-semibold text-primary-foreground">
                    <BookOpen className="size-3.5" />
                    {t("flows.posted")}
                  </Span>
                </Div>
                <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`flows.${key}.note`)}
                </P>
              </Div>
            </Div>
          ))}
          <Div className="grid gap-4 rounded-xl border border-dashed border-border bg-card/60 p-5 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-6 md:p-6">
            <Div className="flex items-center gap-3">
              <Span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Package className="size-4" />
              </Span>
              <H3 className="text-lg font-semibold tracking-tight">
                {t("flows.inventory.title")}
              </H3>
            </Div>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("flows.inventory.body")}
            </P>
          </Div>
        </Div>
      </PageSection>

      {/* ── Around the books ── */}
      <PageSection
        id="suite"
        label={t("suite.eyebrow")}
        title={t("suite.title")}
        intro={t("suite.intro")}
      >
        <FeatureGrid columns={3}>
          {SUITE.map(({ key, icon, area }) => (
            <FeatureCard
              key={key}
              icon={icon}
              label={
                area === null
                  ? t("suite.aiLabel")
                  : t("suite.toolCount", { count: toolCounts[area] })
              }
              title={t(`suite.cards.${key}.title`)}
            >
              {t(`suite.cards.${key}.body`, { modelCount, appName })}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* ── AI ── */}
      <PageSection
        id="ai"
        tone="muted"
        label={t("ai.eyebrow")}
        title={t("ai.title")}
        intro={t("ai.intro")}
      >
        <Div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <Div className="min-w-0">
            <Div className="h-full rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
              <Span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("ai.demo.label")}
              </Span>
              <Div className="mt-3 flex justify-end">
                <P className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                  {t("ai.demo.question")}
                </P>
              </Div>
              <Div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm">
                <Check className="size-4 shrink-0 text-primary" />
                <Span className="font-medium text-foreground">
                  {t("ai.demo.tool")}
                </Span>
                <Span className="truncate font-mono text-xs text-muted-foreground">
                  {AI_TOOL}
                </Span>
              </Div>
              <P className="mt-3 max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
                {t("ai.demo.answer")}
              </P>
            </Div>
          </Div>
          <Div className="min-w-0">
            <CodeTabs
              {...copy}
              wrapByDefault={false}
              tabs={[
                { label: t("ai.tabs.cli"), language: "bash", code: AI_CLI },
                { label: t("ai.tabs.mcp"), language: "json", code: AI_MCP },
              ]}
            />
          </Div>
        </Div>
        <Div className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {AI_POINTS.map(({ key, icon: Icon }) => (
            <Div key={key} className="flex items-start gap-3">
              <Span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" />
              </Span>
              <P className="min-w-0 text-sm leading-relaxed text-foreground/90">
                {t(`ai.points.${key}`)}
              </P>
            </Div>
          ))}
        </Div>
      </PageSection>

      {/* ── Compare ── */}
      <PageSection
        id="compare"
        label={t("compare.eyebrow")}
        title={t("compare.title")}
        intro={t("compare.intro")}
      >
        <Div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <Div className="hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-border bg-muted/50 md:grid">
            <Span className="px-5 py-3" />
            <Span className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("compare.colSaas")}
            </Span>
            <Span className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {t("compare.colUs", { appName })}
            </Span>
          </Div>
          {COMPARE_ROWS.map((key) => {
            const saasWins = SAAS_WINS.has(key);
            return (
              <Div
                key={key}
                className="grid grid-cols-2 border-b border-border last:border-b-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <Span className="col-span-2 px-4 pt-4 text-sm font-semibold text-foreground md:col-span-1 md:px-5 md:py-4">
                  {t(`compare.rows.${key}.label`)}
                </Span>
                <Div className="min-w-0 px-4 pt-2 pb-4 md:px-5 md:py-4">
                  <Span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:hidden">
                    {t("compare.colSaasShort")}
                  </Span>
                  <Span className="text-sm leading-relaxed text-muted-foreground">
                    {t(`compare.rows.${key}.saas`)}
                  </Span>
                </Div>
                <Div
                  className={cn(
                    "min-w-0 px-4 pt-2 pb-4 md:px-5 md:py-4",
                    !saasWins && "bg-primary/[0.04]",
                  )}
                >
                  <Span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-primary md:hidden">
                    {t("compare.colUsShort")}
                  </Span>
                  <Span
                    className={cn(
                      "inline-flex items-start gap-1.5 text-sm leading-relaxed",
                      saasWins
                        ? "text-muted-foreground"
                        : "font-medium text-foreground",
                    )}
                  >
                    {!saasWins && (
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    )}
                    {t(`compare.rows.${key}.us`)}
                  </Span>
                </Div>
              </Div>
            );
          })}
        </Div>
      </PageSection>

      {/* ── Setup ── */}
      <PageSection
        id="start"
        tone="muted"
        label={t("start.eyebrow")}
        title={t("start.title")}
        intro={t("start.intro")}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <TerminalCard
            title={t("start.terminalTitle")}
            rows={QUICKSTART_COMMANDS.map(({ key, command }) => ({
              comment: quickstartT(`terminal.${key}`),
              command,
            }))}
            copyLabel={quickstartT("terminal.copy")}
            copiedLabel={quickstartT("terminal.copied")}
            copyAllLabel={quickstartT("terminal.copyAll")}
          />
          <CtaRow className="lg:flex-col lg:items-start">
            <Cta
              href={`/${locale}/story/self-host`}
              label={t("start.guide")}
              icon={Server}
            />
            <Cta
              href={`/${locale}/story/framework`}
              label={t("start.developers")}
              variant="secondary"
            />
          </CtaRow>
        </Div>
      </PageSection>

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

export default async function BusinessPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

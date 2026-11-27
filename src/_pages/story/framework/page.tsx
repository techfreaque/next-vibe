/**
 * The developer page (nav: Developers). The framework first (one
 * definition, every surface), then running it (quickstart terminal + browser
 * steps, MCP config written by `bun i`), then the hosted API (quickstart, pricing,
 * uncensored models). Every code sample is built from the same sources as /docs/api,
 * so it matches the real /v1 shape. Fully server-rendered.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
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
import { Check } from "next-vibe/ui/components/icons/Check";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Flame } from "next-vibe/ui/components/icons/Flame";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Inbox } from "next-vibe/ui/components/icons/Inbox";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Megaphone } from "next-vibe/ui/components/icons/Megaphone";
import { Package } from "next-vibe/ui/components/icons/Package";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { Smartphone } from "next-vibe/ui/components/icons/Smartphone";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { X } from "next-vibe/ui/components/icons/X";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { listModelFacts } from "@/_pages/models/_shared/model-facts";
import {
  isApiCallable,
  modelHref,
  uncensoredKind,
} from "@/_pages/models/_shared/model-format";
import { API_UNLOCK_PATH, getApiAccessPrices } from "@/api-keys/access";
import {
  buildCodingToolSnippets,
  buildPublicApiBaseUrl,
  CODING_TOOL_IDS,
} from "@/api-keys/coding-tools";
import {
  API_DOCS_PATH,
  API_KEY_MAX_ACTIVE,
  API_KEYS_PAGE_PATH,
} from "@/api-keys/constants";
import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { CodeTabs } from "../../docs/api/_components/code-tabs";
import {
  QuickStep,
  renderRich,
  ResponseExample,
  UrlRow,
} from "../../docs/api/_components/doc-blocks";
import { buildDocsSnippets, DOCS_EXAMPLE_MODEL } from "../../docs/api/snippets";
import { ContactFormSection } from "../_components/contact-form-section";
import {
  CardLink,
  Cta,
  CtaRow,
  PageHero,
  PageSection,
  StatGrid,
} from "../_shared/marketing";
import { scopedTranslation as quickstartScopedTranslation } from "../_shared/quickstart/i18n";
import { QUICKSTART_COMMANDS } from "../_shared/quickstart/quickstart";
import { TerminalCard } from "../_shared/quickstart/terminal";
import {
  CONTACT_DEFINITION,
  CONTACT_REPOSITORY,
  CONTACT_ROUTE,
  CONTACT_SOURCE_PATH,
  FEATURE_TREE,
  SURFACE_ADD,
  SURFACE_AI,
  SURFACE_CLI,
  SURFACE_CRON,
  SURFACE_MCP,
  SURFACE_MCP_CALL,
} from "../_shared/surface-snippets";
import { TOPIC_HUB_PATHS } from "../blog/topics";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface UncensoredModelChip {
  id: string;
  slug: string;
}

export interface FrameworkPageData {
  locale: CountryLanguage;
  modelCount: number;
  /** Typed endpoints in the repo, from the generated endpoint index. */
  endpointCount: number;
  apiBaseUrl: string;
  /** API-callable abliterated / fine-tuned uncensored models, featured first. */
  abliterated: UncensoredModelChip[];
  /** The model trained on its own (banned-texts) corpus, when live. */
  worldview: (UncensoredModelChip & { name: string }) | null;
  /** Endpoint count per MODULES entry (same order), from the generated index. */
  moduleCounts: number[];
  platform: Platform;
}

/** Business modules built on the same pattern, by endpoint path prefix. */
const MODULES = [
  {
    key: "accounting",
    icon: BookOpen,
    folder: "src/chart-of-accounts",
    prefixes: ["chart-of-accounts"],
  },
  {
    key: "documents",
    icon: Receipt,
    folder: "src/payment/invoice",
    prefixes: [
      "payment/invoice",
      "payment/bill",
      "payment/estimate",
      "payment/credit-note",
    ],
  },
  {
    key: "purchasing",
    icon: ShoppingCart,
    folder: "src/purchasing",
    prefixes: ["purchasing"],
  },
  { key: "pos", icon: Wallet, folder: "src/pos", prefixes: ["pos"] },
  {
    key: "inventory",
    icon: Package,
    folder: "src/inventory",
    prefixes: ["inventory"],
  },
  { key: "crm", icon: Users, folder: "src/leads", prefixes: ["leads"] },
  {
    key: "newsletter",
    icon: Megaphone,
    folder: "src/newsletter",
    prefixes: ["newsletter"],
  },
  {
    key: "messaging",
    icon: Inbox,
    folder: "src/messenger",
    prefixes: ["messenger"],
  },
] as const;

/** Real aliases from the business modules, shown under the grid. */
const MODULE_COMMANDS = `vibe payment-invoice-list --help
vibe pos-dashboard`;

function countModuleEndpoints(
  paths: ReadonlyArray<readonly string[]>,
  prefixes: readonly string[],
): number {
  return paths.filter((path) => {
    const joined = path.join("/");
    return prefixes.some(
      (prefix) => joined === prefix || joined.startsWith(`${prefix}/`),
    );
  }).length;
}

/** The hosted API lives on unbottled.ai, also when this page runs on a self-hosted copy. */
const HOSTED_API_ORIGIN = "https://unbottled.ai";

/** Abliterated model ids shown before "+N more". */
const ABLITERATED_SHOWN = 6;

/**
 * Well-known builds first (the names our messaging uses), the rest of the
 * live catalog after them. Ids missing from the catalog are skipped.
 */
const FEATURED_ABLITERATED: readonly string[] = [
  ChatModelId.GLM_5_3_UNCENSORED,
  ChatModelId.KIMI_K3_1_PRO_UNCENSORED,
  ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
  ChatModelId.GLM_5_3_FLASH_UNCENSORED,
  ChatModelId.GEMMA_4_UNCENSORED,
];

function featuredRank(id: string): number {
  const index = FEATURED_ABLITERATED.indexOf(id);
  return index === -1 ? FEATURED_ABLITERATED.length : index;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FrameworkPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const uncensored = listModelFacts(availability)
    .filter((model) => isApiCallable(model))
    .flatMap((model) => {
      const kind = uncensoredKind(model);
      return kind === null ? [] : [{ model, kind }];
    })
    .toSorted(
      (a, b) =>
        featuredRank(a.model.id) - featuredRank(b.model.id) ||
        a.model.creditsPerMessage - b.model.creditsPerMessage ||
        a.model.name.localeCompare(b.model.name),
    );
  const worldview = uncensored.find(({ kind }) => kind === "ownWorldview");
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
  return {
    locale,
    modelCount: getAvailableChatModelCount(false, availability),
    endpointCount: endpointsMeta.length,
    apiBaseUrl: buildPublicApiBaseUrl(HOSTED_API_ORIGIN, locale),
    abliterated: uncensored
      .filter(({ kind }) => kind !== "ownWorldview")
      .map(({ model }) => ({ id: model.id, slug: model.slug })),
    moduleCounts: MODULES.map(({ prefixes }) =>
      countModuleEndpoints(
        endpointsMeta.map((meta) => meta.path),
        prefixes,
      ),
    ),
    worldview:
      worldview === undefined
        ? null
        : {
            id: worldview.model.id,
            slug: worldview.model.slug,
            name: worldview.model.name.trim(),
          },
    platform: Platform.NEXT_PAGE,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

const PATHS = [
  { key: "framework", icon: Layers, href: "#framework" },
  { key: "selfHost", icon: Server, href: "#self-host" },
  { key: "api", icon: Key, href: "#quickstart" },
] as const;

const SURFACES = [
  { key: "web", icon: Globe },
  { key: "cli", icon: Terminal },
  { key: "mcp", icon: Plug },
  { key: "ai", icon: Bot },
  { key: "native", icon: Smartphone },
  { key: "cron", icon: Clock },
] as const;

/** Further surfaces every endpoint gets, beyond the 6 shown in detail. */
const MORE_SURFACES = [
  "webApi",
  "websocket",
  "adminPanel",
  "vibeFrame",
] as const;

const MATURITY = ["stable", "beta", "churn"] as const;

const MCP_POINTS = ["stdio", "roles", "connect", "help"] as const;

/** Browser steps after `vibe dev`, shared with the self-host page. */
const SELF_HOST_STEPS = ["open", "admin", "account", "provider"] as const;

const PRICING_FACTS = [
  { key: "credit", icon: Coins },
  { key: "rate", icon: Zap },
  { key: "keys", icon: Key },
  { key: "preflight", icon: Shield },
] as const;

const FAQ_KEYS = [
  "free",
  "sdks",
  "uncensored",
  "media",
  "limits",
  "selfHost",
] as const;

/** Coding tools named on the page (generic entries left out). */
const NAMED_CODING_TOOLS = CODING_TOOL_IDS.filter(
  (id) => id !== "openaiCompatible" && id !== "curl",
);

/** Small uppercase label used above card titles. */
function CardLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </Span>
  );
}

/** Icon tile + content row, used in lists inside cards. */
function IconRow({
  icon: Icon,
  tone = "primary",
  children,
}: {
  icon: IconComponent;
  tone?: "primary" | "muted" | "destructive";
  children: ReactNode;
}): JSX.Element {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <Div className="flex items-start gap-3">
      <Span
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ${toneClass}`}
      >
        <Icon className="size-3.5" />
      </Span>
      <Div className="min-w-0 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
        {children}
      </Div>
    </Div>
  );
}

/** Model id chip linking to its model page. */
function ModelChip({
  locale,
  model,
}: {
  locale: CountryLanguage;
  model: UncensoredModelChip;
}): JSX.Element {
  return (
    <Link
      href={modelHref(locale, model.slug)}
      className="inline-flex min-h-8 items-center rounded-md border border-border bg-background px-2 font-mono text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {model.id}
    </Link>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  endpointCount,
  apiBaseUrl,
  abliterated,
  worldview,
  moduleCounts,
  platform,
}: FrameworkPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: quickstartT } = quickstartScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const snippets = buildDocsSnippets(apiBaseUrl);
  const toolSnippets = buildCodingToolSnippets({ baseUrl: apiBaseUrl });
  const prices = getApiAccessPrices(locale);
  const keysHref = `/${locale}/${API_KEYS_PAGE_PATH}`;
  const docsHref = `/${locale}/${API_DOCS_PATH}`;
  const copy = {
    copyLabel: t("code.copy"),
    copiedLabel: t("code.copied"),
    wrapLabel: t("code.wrap"),
  };
  const shownAbliterated = abliterated.slice(0, ABLITERATED_SHOWN);
  const hiddenAbliterated = abliterated.length - shownAbliterated.length;

  const faq = FAQ_KEYS.map((key) => ({
    question: t(`faq.${key}.q`),
    answer: t(`faq.${key}.a`, { subPrice: prices.subPrice, appName }),
  }));
  /** Structured data gets plain text: the backticks only mark inline code. */
  const faqStructured = faq.map(({ question, answer }) => ({
    question,
    answer: answer.replaceAll("`", ""),
  }));

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd
        id="developers-faq"
        data={buildFaqStructuredData(faqStructured)}
      />

      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={Code}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleAccent")}</Span>
          </>
        }
        subtitle={t("hero.subtitle", { appName })}
        actions={
          <>
            <Cta
              href="#framework"
              label={t("hero.ctaFramework")}
              icon={ArrowDown}
              arrow={false}
            />
            <Cta
              href="#quickstart"
              label={t("hero.ctaKeys")}
              icon={Key}
              variant="secondary"
            />
          </>
        }
      >
        <StatGrid
          items={[
            {
              value: `${Math.floor(endpointCount / 50) * 50}+`,
              label: t("hero.stats.endpoints"),
            },
            {
              value: SURFACES.length + MORE_SURFACES.length,
              label: t("hero.stats.surfaces"),
            },
            { value: LanguagesArr.length, label: t("hero.stats.languages") },
            { value: modelCount, label: t("hero.stats.models") },
          ]}
        />
        <Div className="mt-4 grid gap-3 sm:grid-cols-3 md:gap-4">
          {PATHS.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 md:p-5"
            >
              <Div className="flex items-center gap-2.5">
                <Span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Span>
                <CardLabel>{t(`paths.${key}.label`)}</CardLabel>
              </Div>
              <Span className="mt-3 block text-base font-semibold leading-snug tracking-tight text-foreground">
                {t(`paths.${key}.title`, { modelCount })}
              </Span>
              <Span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {t(`paths.${key}.body`)}
              </Span>
              <Span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {t(`paths.${key}.link`)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Span>
            </Link>
          ))}
        </Div>
      </PageHero>

      {/* ── Framework ── */}
      <PageSection
        id="framework"
        label={t("framework.eyebrow")}
        title={t("framework.title")}
        intro={renderRich(t("framework.intro", { appName }))}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
          <Div className="min-w-0">
            <CodeTabs
              {...copy}
              wrapByDefault={false}
              tabs={[
                {
                  label: "definition.ts",
                  language: "typescript",
                  code: CONTACT_DEFINITION,
                },
                {
                  label: "repository.ts",
                  language: "typescript",
                  code: CONTACT_REPOSITORY,
                },
                {
                  label: "route.ts",
                  language: "typescript",
                  code: CONTACT_ROUTE,
                },
                {
                  label: "src/contact/",
                  language: "text",
                  code: FEATURE_TREE,
                },
              ]}
            />
            <CodeTabs
              {...copy}
              className="mt-4"
              title={t("framework.call.title")}
              wrapByDefault={false}
              tabs={[
                {
                  label: t("framework.call.cli"),
                  language: "bash",
                  code: SURFACE_CLI,
                },
                {
                  label: t("framework.call.mcp"),
                  language: "json",
                  code: SURFACE_MCP_CALL,
                },
                {
                  label: t("framework.call.ai"),
                  language: "text",
                  code: SURFACE_AI,
                },
                {
                  label: t("framework.call.cron"),
                  language: "typescript",
                  code: SURFACE_CRON,
                },
              ]}
            />
            <Div className="mt-2 flex flex-wrap gap-x-6">
              <CardLink
                href={`${GITHUB_REPO_URL}/tree/dev/${CONTACT_SOURCE_PATH}`}
                label={t("framework.source")}
                external
              />
              <CardLink href="#contact" label={t("framework.live")} />
              <CardLink
                href={`${GITHUB_REPO_URL}/blob/dev/docs/README.md`}
                label={t("framework.docs")}
                external
              />
            </Div>
            <Div className="mt-6 flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/5 p-4 md:p-5">
              <Div className="flex gap-3 text-sm font-medium leading-relaxed text-foreground md:text-base">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
                <Span className="min-w-0">
                  {renderRich(t("framework.deleteLine"))}
                </Span>
              </Div>
              <CodeTabs
                {...copy}
                title={t("framework.tabAdd")}
                wrapByDefault={false}
                tabs={[{ label: "bash", language: "bash", code: SURFACE_ADD }]}
              />
            </Div>
          </Div>
          {/* Below lg the payoff (what it becomes) comes before the code */}
          <Div className="order-first min-w-0 divide-y divide-border rounded-xl border border-border bg-card px-4 shadow-xs sm:px-5 lg:sticky lg:top-24 lg:order-none">
            <P className="py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("framework.becomes")}
            </P>
            {SURFACES.map(({ key, icon: Icon }) => (
              <Div key={key} className="flex items-start gap-3 py-3.5">
                <Div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Div>
                <Div className="min-w-0">
                  <H3 className="text-sm font-semibold tracking-tight">
                    {t(`framework.surfaces.${key}.title`)}
                  </H3>
                  <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {renderRich(t(`framework.surfaces.${key}.body`))}
                  </P>
                </Div>
              </Div>
            ))}
            <Div className="py-4">
              <P className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("framework.more", { count: MORE_SURFACES.length })}
              </P>
              <Div className="mt-2.5 flex flex-wrap gap-1.5">
                {MORE_SURFACES.map((key) => (
                  <Span
                    key={key}
                    className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-foreground/80"
                  >
                    {t(`framework.moreSurfaces.${key}`)}
                  </Span>
                ))}
              </Div>
            </Div>
          </Div>
        </Div>
        <Div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
          {MATURITY.map((key) => (
            <Div
              key={key}
              className="rounded-xl border border-border bg-card p-4 shadow-xs md:p-5"
            >
              <H3 className="text-sm font-semibold tracking-tight md:text-base">
                {t(`framework.maturity.${key}.title`)}
              </H3>
              <P className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`framework.maturity.${key}.body`, { appName })}
              </P>
            </Div>
          ))}
        </Div>
      </PageSection>

      {/* ── Whole products on the same pattern ── */}
      <PageSection
        id="modules"
        className="pt-0 md:pt-4"
        label={t("modules.eyebrow")}
        title={t("modules.title")}
        intro={t("modules.intro")}
      >
        <Div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
          {MODULES.map(({ key, icon: Icon, folder }, index) => (
            <ExternalLink
              key={key}
              href={`${GITHUB_REPO_URL}/tree/dev/${folder}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-col rounded-xl border border-border bg-card p-3.5 shadow-xs transition-colors hover:border-primary/40 sm:p-4 md:p-5"
            >
              <Div className="flex flex-wrap items-center justify-between gap-2">
                <Span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Span>
                <Span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {t("modules.endpoints", { count: moduleCounts[index] ?? 0 })}
                </Span>
              </Div>
              <H3 className="mt-3 text-sm font-semibold leading-snug tracking-tight md:text-base">
                {t(`modules.items.${key}`)}
              </H3>
              <Span className="mt-1 hidden truncate font-mono text-xs text-muted-foreground group-hover:text-primary sm:block">
                {folder}
              </Span>
            </ExternalLink>
          ))}
        </Div>
        <CodeTabs
          {...copy}
          className="mt-4"
          title={t("modules.tryLine")}
          wrapByDefault={false}
          tabs={[{ label: "bash", language: "bash", code: MODULE_COMMANDS }]}
        />
        <Div className="mt-2 flex flex-wrap gap-x-6">
          <CardLink
            href={`/${locale}/story/business`}
            label={t("modules.business")}
          />
          <CardLink
            href={`${GITHUB_REPO_URL}/tree/dev/src`}
            label={t("modules.source")}
            external
          />
        </Div>
      </PageSection>

      {/* ── Self-host ── */}
      <PageSection
        tone="muted"
        id="self-host"
        label={t("selfHost.eyebrow")}
        title={t("selfHost.title")}
        intro={renderRich(t("selfHost.intro", { appName }))}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <TerminalCard
            title={t("selfHost.terminal")}
            rows={QUICKSTART_COMMANDS.map(({ key, command }) => ({
              comment: quickstartT(`terminal.${key}`),
              command,
            }))}
            copyLabel={quickstartT("terminal.copy")}
            copiedLabel={quickstartT("terminal.copied")}
            copyAllLabel={quickstartT("terminal.copyAll")}
          />
          <Div className="flex min-w-0 flex-col gap-4">
            <Div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <CardLabel>{quickstartT("browser.title")}</CardLabel>
              <Div className="mt-3 flex flex-col gap-3">
                {SELF_HOST_STEPS.map((key, index) => (
                  <Div key={key} className="flex items-start gap-3">
                    <Span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </Span>
                    <Div className="min-w-0 text-sm leading-relaxed md:text-[15px]">
                      <Span className="block font-medium text-foreground">
                        {quickstartT(`browser.${key}.title`)}
                      </Span>
                      <Span className="block text-muted-foreground">
                        {quickstartT(`browser.${key}.body`)}
                      </Span>
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>
            <P className="text-sm leading-relaxed text-muted-foreground">
              {renderRich(t("selfHost.db"))}
            </P>
            <CtaRow>
              <Cta
                href={`/${locale}/story/self-host`}
                label={t("selfHost.guide")}
                icon={Server}
              />
              <Cta
                href={GITHUB_REPO_URL}
                label={t("selfHost.github")}
                icon={Github}
                variant="secondary"
                external
              />
            </CtaRow>
          </Div>
        </Div>
      </PageSection>

      {/* ── MCP and CLI ── */}
      <PageSection
        id="mcp"
        label={t("mcp.eyebrow")}
        title={t("mcp.title")}
        intro={renderRich(t("mcp.intro"))}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
          <Div className="flex min-w-0 flex-col gap-3.5 rounded-xl border border-border bg-card p-5 shadow-xs">
            {MCP_POINTS.map((key) => (
              <IconRow key={key} icon={Check}>
                {renderRich(t(`mcp.points.${key}`, { appName }))}
              </IconRow>
            ))}
          </Div>
          <Div className="flex min-w-0 flex-col gap-2">
            <CodeTabs
              wrapByDefault={false}
              tabs={[
                { label: ".mcp.json", language: "json", code: SURFACE_MCP },
              ]}
              {...copy}
            />
            <P className="text-sm leading-relaxed text-muted-foreground">
              {renderRich(t("mcp.configNote"))}
            </P>
          </Div>
        </Div>
      </PageSection>

      {/* ── Quickstart ── */}
      <PageSection
        tone="muted"
        id="quickstart"
        label={t("quickstart.eyebrow")}
        title={t("quickstart.title")}
        intro={renderRich(t("quickstart.intro"))}
      >
        <Div className="max-w-4xl">
          <QuickStep
            n={1}
            title={t("quickstart.step1.title")}
            description={t("quickstart.step1.description", {
              subPrice: prices.subPrice,
            })}
          >
            <CtaRow>
              <Cta
                href={`/${locale}/${API_UNLOCK_PATH}`}
                label={t("quickstart.step1.ctaPlans")}
              />
              <Cta
                href={keysHref}
                label={t("quickstart.step1.ctaKeys")}
                icon={Key}
                variant="secondary"
              />
            </CtaRow>
          </QuickStep>
          <QuickStep
            n={2}
            title={t("quickstart.step2.title")}
            description={t("quickstart.step2.description")}
          >
            <Div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <UrlRow
                label={t("quickstart.step2.baseUrl")}
                value={toolSnippets.baseUrl}
                note={t("quickstart.step2.baseUrlNote")}
                {...copy}
              />
              <UrlRow
                label={t("quickstart.step2.anthropicBaseUrl")}
                value={toolSnippets.anthropicBaseUrl}
                note={t("quickstart.step2.anthropicNote")}
                {...copy}
              />
            </Div>
          </QuickStep>
          <QuickStep
            n={3}
            title={t("quickstart.step3.title")}
            description={t("quickstart.step3.description", {
              model: DOCS_EXAMPLE_MODEL,
            })}
            last
          >
            <Div className="flex min-w-0 flex-col gap-3">
              <CodeTabs
                wrapByDefault={false}
                tabs={[
                  { label: "curl", language: "bash", code: snippets.chat },
                  {
                    label: "Python",
                    language: "python",
                    code: snippets.python,
                  },
                  {
                    label: "JavaScript",
                    language: "typescript",
                    code: snippets.node,
                  },
                  {
                    label: t("code.anthropic"),
                    language: "bash",
                    code: snippets.messages,
                  },
                ]}
                {...copy}
              />
              <ResponseExample
                summary={t("quickstart.step3.response")}
                title="200"
                tabs={[
                  {
                    label: "json",
                    language: "json",
                    code: snippets.chatResponse,
                  },
                ]}
                {...copy}
              />
            </Div>
          </QuickStep>
        </Div>

        <Div className="mt-10 flex max-w-4xl flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between md:p-5">
          <Div className="min-w-0">
            <Span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Terminal className="size-4 text-primary" />
              {t("quickstart.agents.title")}
            </Span>
            <Div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Span className="mr-1 text-sm text-muted-foreground">
                {t("quickstart.agents.body")}
              </Span>
              {NAMED_CODING_TOOLS.map((id) => (
                <Span
                  key={id}
                  className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground/80"
                >
                  {toolSnippets.tools[id].name}
                </Span>
              ))}
            </Div>
          </Div>
          <Div className="flex shrink-0 flex-wrap gap-x-5 whitespace-nowrap sm:flex-col sm:items-end sm:gap-x-0">
            <CardLink
              href={`${docsHref}#coding-tools`}
              label={t("quickstart.agents.link")}
            />
            <CardLink href={docsHref} label={t("quickstart.reference")} />
          </Div>
        </Div>
      </PageSection>

      {/* ── Pricing and unlock ── */}
      <PageSection
        id="pricing"
        label={t("pricing.eyebrow")}
        title={t("pricing.title")}
        intro={renderRich(t("pricing.intro"))}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <Div className="flex min-w-0 flex-col gap-4">
            <Div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <CardLabel>{t("pricing.unlockTitle")}</CardLabel>
              <Div className="mt-3 flex flex-col gap-2.5">
                <IconRow icon={Check}>
                  {t("pricing.unlockPlan", { subPrice: prices.subPrice })}
                </IconRow>
                <IconRow icon={Check}>{t("pricing.unlockGrant")}</IconRow>
              </Div>
              <Div className="mt-5 border-t border-border pt-4">
                <CardLabel>{t("pricing.neverTitle")}</CardLabel>
                <Div className="mt-3">
                  <IconRow icon={X} tone="destructive">
                    {renderRich(t("pricing.never"))}
                  </IconRow>
                </Div>
              </Div>
            </Div>
            <Div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <CardLabel>{t("pricing.billTitle")}</CardLabel>
              <P className="mt-3 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
                {renderRich(t("pricing.bill"))}
              </P>
              <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("pricing.topup", { packPrice: prices.packPrice })}
              </P>
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              {PRICING_FACTS.map(({ key, icon: Icon }) => (
                <Div
                  key={key}
                  className="flex min-w-0 items-start gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground/90"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <Span className="min-w-0">
                    {t(`pricing.facts.${key}`, {
                      maxKeys: API_KEY_MAX_ACTIVE,
                    })}
                  </Span>
                </Div>
              ))}
            </Div>
          </Div>
          <Div className="flex min-w-0 flex-col gap-3">
            <CodeTabs
              title={t("pricing.modelsTitle")}
              wrapByDefault={false}
              tabs={[
                { label: "curl", language: "bash", code: snippets.models },
              ]}
              {...copy}
            />
            <ResponseExample
              summary={t("pricing.modelsResponse")}
              title="200"
              open
              tabs={[
                {
                  label: "json",
                  language: "json",
                  code: snippets.modelsResponse,
                },
              ]}
              {...copy}
            />
          </Div>
        </Div>
      </PageSection>

      {/* ── Uncensored models ── */}
      <PageSection
        tone="muted"
        id="uncensored"
        label={t("uncensored.eyebrow")}
        title={t("uncensored.title")}
        intro={renderRich(t("uncensored.intro"))}
      >
        <Div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <Div className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
            <Div className="flex items-center gap-2.5">
              <Span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldOff className="size-4" />
              </Span>
              <CardLabel>{t("uncensored.abliterated.label")}</CardLabel>
            </Div>
            <H3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
              {t("uncensored.abliterated.title")}
            </H3>
            <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {t("uncensored.abliterated.body")}
            </P>
            <Div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
              {shownAbliterated.map((model) => (
                <ModelChip key={model.id} locale={locale} model={model} />
              ))}
              {hiddenAbliterated > 0 && (
                <Link
                  href={`/${locale}${TOPIC_HUB_PATHS.uncensored}`}
                  className="inline-flex min-h-8 items-center px-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {t("uncensored.more", { count: hiddenAbliterated })}
                </Link>
              )}
            </Div>
          </Div>
          {worldview !== null && (
            <Div className="flex min-w-0 flex-col rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-xs md:p-6">
              <Div className="flex items-center gap-2.5">
                <Span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <Flame className="size-4" />
                </Span>
                <CardLabel>{t("uncensored.worldview.label")}</CardLabel>
              </Div>
              <H3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                {t("uncensored.worldview.title")}
              </H3>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                {t("uncensored.worldview.body", { model: worldview.name })}
              </P>
              <Div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                <ModelChip locale={locale} model={worldview} />
              </Div>
            </Div>
          )}
        </Div>
        <Div className="mt-6 flex gap-3 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed text-foreground md:p-5 md:text-base">
          <Lock className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <Div className="min-w-0 [overflow-wrap:anywhere]">
            {renderRich(t("uncensored.consent"))}
          </Div>
        </Div>
        <Div className="mt-4 flex flex-wrap gap-x-6">
          <CardLink
            href={`/${locale}${TOPIC_HUB_PATHS.uncensored}`}
            label={t("uncensored.allModels")}
          />
          <CardLink
            href={`/${locale}/models`}
            label={t("uncensored.catalog")}
          />
        </Div>
      </PageSection>

      {/* ── FAQ ── */}
      <PageSection id="faq" title={t("faq.title")} narrow>
        <Div className="flex flex-col divide-y divide-border border-y border-border">
          {faq.map(({ question, answer }) => (
            <Div key={question} className="py-5">
              <H3 className="text-base font-semibold tracking-tight md:text-lg">
                {question}
              </H3>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {renderRich(answer)}
              </P>
            </Div>
          ))}
        </Div>
      </PageSection>

      {/* ── Contact: the endpoint from the framework section, live ── */}
      <PageSection
        id="contact"
        tone="muted"
        label={t("contact.eyebrow")}
        title={t("contact.title")}
        intro={renderRich(t("contact.description"))}
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

export default async function FrameworkPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

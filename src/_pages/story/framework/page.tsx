import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Database } from "next-vibe/ui/components/icons/Database";
import { FileCode } from "next-vibe/ui/components/icons/FileCode";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Navigation } from "next-vibe/ui/components/icons/Navigation";
import { Server } from "next-vibe/ui/components/icons/Server";
import { ShoppingBag } from "next-vibe/ui/components/icons/ShoppingBag";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { X } from "next-vibe/ui/components/icons/X";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  ENDPOINT_PLATFORMS,
  GITHUB_REPO_URL,
  PLATFORM_COUNT,
} from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { Architecture } from "../_components/architecture";
import { ContactFormSection } from "../_components/contact-form-section";
import { NextVibeShowcase } from "../_components/nextvibe-showcase";
import {
  Callout,
  Cta,
  CtaRow,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
  Step,
  StepList,
} from "../_shared/marketing";
import {
  SURFACE_ADD,
  SURFACE_AI,
  SURFACE_CLI,
  SURFACE_CRON,
  SURFACE_DEFINITION,
  SURFACE_MCP,
  SURFACE_ROUTE,
} from "../_shared/surface-snippets";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface FrameworkPageData {
  locale: CountryLanguage;
  endpointCount: number;
  modelCount: number;
  definitionCode: string;
  routeCode: string;
  widgetCode: string;
  cloneCode: string;
  startCode: string;
  aiCode: string;
  platform: Platform;
}

function getCodeSnippets(locale: CountryLanguage): {
  definitionCode: string;
  routeCode: string;
  widgetCode: string;
  cloneCode: string;
  startCode: string;
  aiCode: string;
} {
  const isDE = locale.startsWith("de");
  const isPL = locale.startsWith("pl");

  // Localized natural-language strings used inside code examples
  const exampleDecision = isDE
    ? "Alles auf TypeScript umschreiben"
    : isPL
      ? "Przepisz wszystko na TypeScript"
      : "Rewrite everything in TypeScript";

  const devLabel = isDE
    ? "# development"
    : isPL
      ? "# development"
      : "# development";

  const prodLabel = isDE
    ? "# production - erster Start"
    : isPL
      ? "# production - pierwsze uruchomienie"
      : "# production - first start";

  const rebuildLabel = isDE
    ? "# production - nach Änderungen"
    : isPL
      ? "# production - po zmianach"
      : "# production - after changes";

  const aiChatComment = isDE
    ? "# In unbottled.ai-Chat oder Claude Code:"
    : isPL
      ? "# W czacie unbottled.ai lub Claude Code:"
      : "# In unbottled.ai chat or Claude Code:";

  const aiPrompt = isDE
    ? '"Bau mir ein Feature, das Entscheidungen meinem Chef erklärt"'
    : isPL
      ? '"Zbuduj mi feature, który tłumaczy decyzje mojemu szefowi"'
      : '"Build me a feature that explains decisions to my boss"';

  const aiRunsComment = isDE
    ? "# KI schreibt alle Dateien und führt vibe check automatisch aus"
    : isPL
      ? "# AI pisze wszystkie pliki i automatycznie uruchamia vibe check"
      : "# AI writes all files and runs vibe check automatically";

  // prettier-ignore
  const definitionCode = [
    "```typescript",
    "const { POST } = createEndpoint({",
    "  scopedTranslation,",
    "  method: Methods.POST,",
    '  path: ["explain", "to-my-boss"],',
    '  title: "post.title" as const,',
    '  description: "post.description" as const,',
    '  icon: "sparkles",',
    '  category: "endpointCategories.ai",',
    "  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,",
    "  fields: customWidgetObject({",
    "    render: ExplainContainer,",
    "    usage: { request: \"data\", response: true } as const,",
    "    children: {",
    "      decision: requestField(scopedTranslation, {",
    "        type: WidgetType.FORM_FIELD,",
    "        fieldType: FieldDataType.TEXTAREA,",
    '        label: "post.decision.label" as const,',
    "        columns: 12,",
    "        schema: z.string().min(10),",
    "      }),",
    "      justification: responseField(scopedTranslation, {",
    "        type: WidgetType.TEXT,",
    '        content: "post.justification.content" as const,',
    "        schema: z.string(),",
    "      }),",
    "    },",
    "  }),",
    "  errorTypes: {",
    `    [EndpointErrorTypes.UNAUTHORIZED]:      { title: "post.errors.unauthorized.title" as const,      description: "post.errors.unauthorized.description" as const },`,
    `    [EndpointErrorTypes.SERVER_ERROR]:      { title: "post.errors.serverError.title" as const,       description: "post.errors.serverError.description" as const },`,
    "    // ... other error types",
    "  },",
    '  successTypes: { title: "post.success.title" as const, description: "post.success.description" as const },',
    `  examples: { requests: { default: { decision: "${exampleDecision}" } }, responses: { default: { justification: "..." } } },`,
    "});",
    "",
    "export type ExplainResponseOutput = typeof POST.types.ResponseOutput;",
    "const definitions = { POST } as const;",
    "export default definitions;",
    "```",
  ].join("\n");

  // prettier-ignore
  const routeCode = [
    "```typescript",
    'import "server-only";',
    "",
    "export class ExplainRepository {",
    "  static async explainToMyBoss(",
    "    data: ExplainRequestOutput,",
    "    user: JwtPayloadType,",
    "    logger: EndpointLogger,",
    "    t: ExplainT,",
    "  ): Promise<ResponseType<ExplainResponseOutput>> {",
    "    if (!user.id) {",
    "      return fail({ message: t(\"post.errors.unauthorized.title\"), errorType: ErrorResponseTypes.UNAUTHORIZED });",
    "    }",
    "    try {",
    "      const [saved] = await db",
    "        .insert(explainResults)",
    "        .values({ userId: user.id, decision: data.decision })",
    "        .returning();",
    "      logger.info(\"Saved decision\", { userId: user.id, id: saved.id });",
    "      return success({ justification: saved.justification ?? \"\" });",
    "    } catch (error) {",
    "      logger.error(\"Failed to save decision\", parseError(error));",
    "      return fail({ message: t(\"post.errors.serverError.title\"), errorType: ErrorResponseTypes.INTERNAL_ERROR });",
    "    }",
    "  }",
    "}",
    "```",
  ].join("\n");

  // prettier-ignore
  const widgetCode = [
    "```tsx",
    '"use client";',
    "",
    "interface CustomWidgetProps {",
    "  field: {",
    "    value: ExplainResponseOutput | null | undefined;",
    `  } & (typeof definition.POST)["fields"];`,
    "}",
    "",
    "export function ExplainContainer({ field }: CustomWidgetProps): JSX.Element {",
    "  const children = field.children;",
    "  const emptyField = useMemo(() => ({}), []);",
    "",
    "  return (",
    '    <Div className="flex flex-col gap-4 p-4">',
    "      <TextareaFieldWidget fieldName=\"decision\" field={children.decision} />",
    "      <SubmitButtonWidget<typeof definition.POST>",
    "        field={{",
    '          text: "Explain to my boss",',
    '          loadingText: "Explaining...",',
    '          icon: "sparkles",',
    '          variant: "primary",',
    "        }}",
    "      />",
    "      <FormAlertWidget field={emptyField} />",
    "      <AlertWidget",
    '        fieldName="justification"',
    "        field={withValue(children.justification, field.value?.justification, null)}",
    "      />",
    "    </Div>",
    "  );",
    "}",
    "```",
  ].join("\n");

  // prettier-ignore
  const cloneCode = [
    "```bash",
    "git clone https://github.com/YOUR_USERNAME/next-vibe",
    "cd next-vibe && bun install",
    "```",
  ].join("\n");

  // prettier-ignore
  const startCode = [
    "```bash",
    devLabel,
    "vibe dev",
    "",
    prodLabel,
    "vibe build && vibe start",
    "",
    rebuildLabel,
    "vibe rebuild",
    "```",
  ].join("\n");

  // prettier-ignore
  const aiCode = [
    "```bash",
    aiChatComment,
    aiPrompt,
    aiRunsComment,
    "```",
  ].join("\n");

  return {
    definitionCode,
    routeCode,
    widgetCode,
    cloneCode,
    startCode,
    aiCode,
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<FrameworkPageData> {
  const { locale } = await params;
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
  const snippets = getCodeSnippets(locale);
  return {
    locale,
    endpointCount: endpointsMeta.length,
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    ...snippets,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

type BannedPatternKey =
  | "any"
  | "unknown"
  | "object"
  | "asX"
  | "throwStatements"
  | "hardcodedStrings";

const BANNED_KEYS: BannedPatternKey[] = [
  "any",
  "unknown",
  "object",
  "asX",
  "throwStatements",
  "hardcodedStrings",
];

/** Split a ```lang fenced snippet into language + raw code. */
function unfence(markdown: string): { language: string; code: string } {
  const lines = markdown.split("\n");
  const language = (lines[0] ?? "").replace("```", "") || "text";
  return { language, code: lines.slice(1, -1).join("\n") };
}

function RawCode({
  code,
  filename,
  language = "typescript",
}: {
  code: string;
  filename: string;
  language?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet
        code={code}
        language={language}
        filename={filename}
        variant="file"
      />
    </Div>
  );
}

function CodeFile({
  markdown,
  filename,
}: {
  markdown: string;
  filename: string;
}): JSX.Element {
  const { language, code } = unfence(markdown);
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet
        code={code}
        language={language}
        filename={filename}
        variant="file"
      />
    </Div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function TanstackPage({
  locale,
  endpointCount,
  modelCount,
  definitionCode,
  routeCode,
  widgetCode,
  cloneCode,
  startCode,
  aiCode,
  platform,
}: FrameworkPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const docsUrl = `${GITHUB_REPO_URL}/blob/main/docs/README.md`;

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  const examples = [
    { key: "headunit", icon: Navigation },
    { key: "shop", icon: ShoppingBag },
    { key: "booking", icon: Calendar },
    { key: "aiPlatform", icon: Sparkles },
  ] as const;

  const surfaceCards = [
    {
      key: "cli",
      icon: Terminal,
      code: SURFACE_CLI,
      filename: "terminal",
      language: "bash",
    },
    {
      key: "mcp",
      icon: Server,
      code: SURFACE_MCP,
      filename: ".mcp.json",
      language: "typescript",
    },
    {
      key: "ai",
      icon: Bot,
      code: SURFACE_AI,
      filename: "tool-call",
      language: "typescript",
    },
    {
      key: "cron",
      icon: Clock,
      code: SURFACE_CRON,
      filename: "task.ts",
      language: "typescript",
    },
  ] as const;

  const files = [
    {
      icon: FileCode,
      title: t("pattern.definitionTitle"),
      body: t("pattern.definitionBody"),
      code: definitionCode,
      filename: "definition.ts",
    },
    {
      icon: Database,
      title: t("pattern.routeTitle"),
      body: t("pattern.routeBody"),
      code: routeCode,
      filename: "repository.ts",
    },
    {
      icon: Layers,
      title: t("pattern.widgetTitle"),
      body: t("pattern.widgetBody"),
      code: widgetCode,
      filename: "widget.tsx",
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={Code}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleAccent")}</Span>
          </>
        }
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <Cta
              href={GITHUB_REPO_URL}
              label={t("hero.ctaGithub")}
              icon={Github}
              external
            />
            <Cta
              href={docsUrl}
              label={t("hero.ctaDocs")}
              variant="secondary"
              arrow
              external
            />
          </>
        }
      >
        <StatGrid
          items={[
            { value: `${endpointCount}+`, label: t("hero.stat1Label") },
            { value: t("hero.stat2Value"), label: t("hero.stat2Label") },
            { value: PLATFORM_COUNT, label: t("hero.stat3Label") },
            { value: t("hero.stat4Value"), label: t("hero.stat4Label") },
          ]}
        />
      </PageHero>

      {/* Problem */}
      <PageSection
        label={t("problem.eyebrow")}
        title={t("problem.title")}
        intro={t("problem.subtitle")}
      >
        <Div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {ENDPOINT_PLATFORMS.map((key) => (
            <Div
              key={key}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground"
            >
              <X className="h-3.5 w-3.5 shrink-0 text-destructive" />
              <Span className="truncate line-through decoration-destructive/40">
                {t(`surfaces.items.${key}.label`)}
              </Span>
            </Div>
          ))}
        </Div>
        <Callout icon={CheckCircle} className="mt-6 font-medium">
          {t("problem.callout")}
        </Callout>
      </PageSection>

      <NextVibeShowcase locale={locale} />

      {/* Pattern */}
      <PageSection
        tone="muted"
        label={t("pattern.eyebrow")}
        title={t("pattern.title")}
        intro={t("pattern.subtitle")}
      >
        <Div className="flex flex-col gap-12 md:gap-16">
          {files.map((file) => (
            <Div
              key={file.filename}
              className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
            >
              <Div>
                <Div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <file.icon className="h-5 w-5" />
                </Div>
                <H3 className="text-lg font-semibold tracking-tight">
                  {file.title}
                </H3>
                <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {file.body}
                </P>
              </Div>
              <CodeFile markdown={file.code} filename={file.filename} />
            </Div>
          ))}
        </Div>
        <Callout icon={Trash2} tone="warning" className="mt-12 font-medium">
          {t("pattern.deleteLine")}
        </Callout>
      </PageSection>

      {/* One definition, every surface - real endpoint */}
      <PageSection
        label={t("oneDef.eyebrow")}
        title={t("oneDef.title")}
        intro={t("oneDef.subtitle")}
      >
        <Div className="flex flex-col gap-12 md:gap-16">
          <Div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
            <Div>
              <H3 className="text-lg font-semibold tracking-tight">
                {t("oneDef.defTitle")}
              </H3>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("oneDef.defBody")}
              </P>
            </Div>
            <RawCode code={SURFACE_DEFINITION} filename="definition.ts" />
          </Div>
          <Div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
            <Div>
              <H3 className="text-lg font-semibold tracking-tight">
                {t("oneDef.routeTitle")}
              </H3>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("oneDef.routeBody")}
              </P>
            </Div>
            <RawCode code={SURFACE_ROUTE} filename="route.ts" />
          </Div>
          <Div>
            <H3 className="mb-6 text-xl font-semibold tracking-tight">
              {t("oneDef.surfacesTitle")}
            </H3>
            <Div className="grid gap-6 md:grid-cols-2">
              {surfaceCards.map((card) => (
                <FeatureCard
                  key={card.key}
                  icon={card.icon}
                  title={t(`oneDef.${card.key}.title`)}
                >
                  {t(`oneDef.${card.key}.body`)}
                  <Div className="mt-4">
                    <RawCode
                      code={card.code}
                      filename={card.filename}
                      language={card.language}
                    />
                  </Div>
                </FeatureCard>
              ))}
            </Div>
            <Callout icon={Layers} className="mt-6 font-medium">
              {t("oneDef.more")}
            </Callout>
          </Div>
          <Div className="max-w-3xl">
            <H3 className="text-xl font-semibold tracking-tight">
              {t("oneDef.addTitle")}
            </H3>
            <P className="mt-2 mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("oneDef.addBody")}
            </P>
            <RawCode code={SURFACE_ADD} filename="terminal" language="bash" />
          </Div>
        </Div>
      </PageSection>

      {/* Surfaces - interactive platform explorer */}
      <Architecture locale={locale} />

      {/* Built with next-vibe - example products */}
      <PageSection
        label={t("examples.eyebrow")}
        title={t("examples.title")}
        intro={t("examples.subtitle", { appName })}
      >
        <FeatureGrid columns={4}>
          {examples.map(({ key, icon: Icon }) => (
            <FeatureCard
              key={key}
              icon={Icon}
              label={t(`examples.items.${key}.label`)}
              title={t(`examples.items.${key}.title`, { appName })}
            >
              {t(`examples.items.${key}.body`, { appName, modelCount })}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* TypeScript rules */}
      <PageSection
        tone="muted"
        label={t("typescript.eyebrow")}
        title={t("typescript.title")}
        intro={t("typescript.subtitle")}
      >
        <FeatureGrid columns={3}>
          {BANNED_KEYS.map((key) => (
            <Div
              key={key}
              className="rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <Span className="inline-block rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 font-mono text-sm font-semibold text-destructive">
                {t(`typescript.patterns.${key}.name`)}
              </Span>
              <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`typescript.patterns.${key}.description`)}
              </P>
            </Div>
          ))}
        </FeatureGrid>
        <Callout icon={CheckCircle} tone="success" className="mt-6">
          {t("typescript.vibeCheck")}
        </Callout>
      </PageSection>

      {/* Quickstart */}
      <PageSection
        id="quickstart"
        label={t("quickstart.eyebrow")}
        title={t("quickstart.title")}
        intro={t("quickstart.subtitle", { appName })}
      >
        <Div className="max-w-3xl">
          <StepList>
            <Step
              number={1}
              title={t("quickstart.step1.label")}
              description={t("quickstart.step1.description")}
            >
              <CodeFile markdown={cloneCode} filename="terminal" />
            </Step>
            <Step
              number={2}
              title={t("quickstart.step2.label")}
              description={t("quickstart.step2.description")}
            >
              <CodeFile markdown={startCode} filename="terminal" />
            </Step>
            <Step
              number={3}
              title={t("quickstart.step3.label")}
              description={t("quickstart.step3.description")}
            />
            <Step
              number={4}
              title={t("quickstart.step4.label")}
              description={t("quickstart.step4.description", { appName })}
            >
              <CodeFile markdown={aiCode} filename="prompt" />
            </Step>
          </StepList>
          <CtaRow className="mt-10">
            <Cta
              href={docsUrl}
              label={t("quickstart.docsLink")}
              variant="secondary"
              icon={BookOpen}
              external
            />
            <Cta
              href={GITHUB_REPO_URL}
              label={t("quickstart.githubLink")}
              variant="secondary"
              icon={Github}
              external
            />
          </CtaRow>
        </Div>
      </PageSection>

      {/* Enterprise / contact */}
      <PageSection
        tone="muted"
        label={t("enterprise.eyebrow")}
        title={t("enterprise.title")}
        intro={t("enterprise.description")}
        centeredHeader
      >
        <Div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-xs md:p-10">
          <ContactFormSection
            locale={locale}
            user={publicUser}
            platform={platform}
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

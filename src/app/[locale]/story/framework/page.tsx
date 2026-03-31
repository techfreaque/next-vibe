import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Link } from "next-vibe-ui/ui/link";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import {
  BlockQuote,
  H1,
  H2,
  H3,
  Lead,
  Muted,
  P,
} from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import {
  ENDPOINT_PLATFORMS,
  GITHUB_REPO_URL,
  PLATFORM_COUNT,
} from "@/config/constants";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { ContactFormSection } from "../_components/contact-form-section";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface FrameworkPageData {
  locale: CountryLanguage;
  endpointCount: number;
  definitionCode: string;
  routeCode: string;
  widgetCode: string;
  cloneCode: string;
  startCode: string;
  aiCode: string;
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
  const { endpointsMeta } =
    await import("@/app/api/[locale]/system/generated/endpoints-meta/en");
  const snippets = getCodeSnippets(locale);
  return {
    locale,
    endpointCount: endpointsMeta.length,
    ...snippets,
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

// ─── Platform grid data ───────────────────────────────────────────────────────

const SURFACE_COLORS = [
  "border-l-violet-500",
  "border-l-cyan-500",
  "border-l-emerald-500",
  "border-l-orange-500",
  "border-l-pink-500",
  "border-l-blue-500",
  "border-l-amber-500",
  "border-l-teal-500",
  "border-l-indigo-500",
  "border-l-red-500",
  "border-l-purple-500",
  "border-l-lime-500",
  "border-l-sky-500",
] as const;

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

// ─── Page ────────────────────────────────────────────────────────────────────

export function TanstackPage({
  locale,
  endpointCount,
  definitionCode,
  routeCode,
  widgetCode,
  cloneCode,
  startCode,
  aiCode,
}: FrameworkPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <Div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-background to-cyan-950/20">
        <Div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
          <Div className="max-w-3xl">
            <Span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-4">
              {t("hero.eyebrow")}
            </Span>
            <H1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-2">
              {t("hero.title")}
              <Span className="block text-cyan-400">
                {t("hero.titleAccent")}
              </Span>
            </H1>
            <Lead className="mt-6 text-muted-foreground max-w-2xl">
              {t("hero.subtitle")}
            </Lead>
            <Div className="flex flex-wrap gap-3 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Link href={GITHUB_REPO_URL} target="_blank">
                  <GitBranch className="mr-2 h-4 w-4" />
                  {t("hero.ctaGithub")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  href={`${GITHUB_REPO_URL}/blob/main/docs/README.md`}
                  target="_blank"
                >
                  {t("hero.ctaDocs")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Div>
          </Div>

          {/* Stats */}
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl">
            {(
              [
                { value: `${endpointCount}+`, label: t("hero.stat1Label") },
                { value: t("hero.stat2Value"), label: t("hero.stat2Label") },
                { value: String(PLATFORM_COUNT), label: t("hero.stat3Label") },
                { value: t("hero.stat4Value"), label: t("hero.stat4Label") },
              ] as const
            ).map((stat) => (
              <Div key={stat.label}>
                <Div className="text-3xl font-black text-cyan-400">
                  {stat.value}
                </Div>
                <Muted className="text-sm mt-1">{stat.label}</Muted>
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* ─── Problem ──────────────────────────────────────────────────── */}
      <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <Div className="max-w-3xl">
          <Span className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-3 block">
            {t("problem.eyebrow")}
          </Span>
          <H2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("problem.title")}
          </H2>
          <P className="text-muted-foreground text-lg mb-8">
            {t("problem.subtitle")}
          </P>
          <Div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {ENDPOINT_PLATFORMS.map((key) => (
              <Div
                key={key}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground line-through decoration-red-500/60"
              >
                <Span className="text-red-500 font-mono text-xs">✕</Span>
                {t(`surfaces.items.${key}.label`)}
              </Div>
            ))}
          </Div>
          <BlockQuote className="border-l-cyan-500 bg-cyan-950/20 not-italic font-semibold text-foreground">
            {t("problem.callout")}
          </BlockQuote>
        </Div>
      </Div>

      <Separator />

      {/* ─── The Pattern ──────────────────────────────────────────────── */}
      <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <Span className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3 block">
          {t("pattern.eyebrow")}
        </Span>
        <H2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {t("pattern.title")}
        </H2>
        <P className="text-muted-foreground text-lg mb-12 max-w-2xl">
          {t("pattern.subtitle")}
        </P>

        <Div className="space-y-10 max-w-3xl">
          {/* definition.ts */}
          <Div className="space-y-3">
            <Div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" />
              <H3 className="font-bold text-sm">
                {t("pattern.definitionTitle")}
              </H3>
            </Div>
            <P className="text-sm text-muted-foreground">
              {t("pattern.definitionBody")}
            </P>
            <Markdown content={definitionCode} />
          </Div>

          {/* route.ts */}
          <Div className="space-y-3">
            <Div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-violet-400" />
              <H3 className="font-bold text-sm">{t("pattern.routeTitle")}</H3>
            </Div>
            <P className="text-sm text-muted-foreground">
              {t("pattern.routeBody")}
            </P>
            <Markdown content={routeCode} />
          </Div>

          {/* widget.tsx */}
          <Div className="space-y-3">
            <Div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" />
              <H3 className="font-bold text-sm">{t("pattern.widgetTitle")}</H3>
            </Div>
            <P className="text-sm text-muted-foreground">
              {t("pattern.widgetBody")}
            </P>
            <Markdown content={widgetCode} />
          </Div>
        </Div>

        <BlockQuote className="mt-12 border-l-red-500 bg-red-950/10 not-italic font-medium text-foreground max-w-xl">
          {t("pattern.deleteLine")}
        </BlockQuote>
      </Div>

      <Separator />

      {/* ─── Surfaces ─────────────────────────────────────────────────── */}
      <Div className="bg-muted/5">
        <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
          <Span className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3 block">
            {t("surfaces.eyebrow")}
          </Span>
          <H2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {t("surfaces.title")}
          </H2>
          <P className="text-muted-foreground text-lg mb-12 max-w-2xl">
            {t("surfaces.subtitle")}
          </P>

          <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ENDPOINT_PLATFORMS.map((key, i) => (
              <Card
                key={key}
                className={`border-l-4 ${SURFACE_COLORS[i % SURFACE_COLORS.length]} bg-card/50`}
              >
                <CardContent className="pt-4 pb-4">
                  <Div className="font-semibold text-sm mb-1">
                    {t(`surfaces.items.${key}.label`)}
                  </Div>
                  <Muted className="text-xs leading-relaxed">
                    {t(`surfaces.items.${key}.description`)}
                  </Muted>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>
      </Div>

      <Separator />

      {/* ─── TypeScript rules ─────────────────────────────────────────── */}
      <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <Span className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-3 block">
          {t("typescript.eyebrow")}
        </Span>
        <H2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {t("typescript.title")}
        </H2>
        <P className="text-muted-foreground text-lg mb-12 max-w-2xl">
          {t("typescript.subtitle")}
        </P>

        <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {BANNED_KEYS.map((key) => (
            <Div
              key={key}
              className="rounded-lg border border-border/60 bg-muted/30 p-4"
            >
              <Div className="flex items-center gap-2 mb-2">
                <Span className="font-mono text-xs font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded">
                  {t(`typescript.patterns.${key}.name`)}
                </Span>
              </Div>
              <Muted className="text-xs leading-relaxed">
                {t(`typescript.patterns.${key}.description`)}
              </Muted>
            </Div>
          ))}
        </Div>

        <Div className="flex items-start gap-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 max-w-2xl">
          <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
          <Muted className="text-sm">{t("typescript.vibeCheck")}</Muted>
        </Div>
      </Div>

      <Separator />

      {/* ─── Quickstart ───────────────────────────────────────────────── */}
      <Div className="bg-muted/5">
        <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
          <Span className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3 block">
            {t("quickstart.eyebrow")}
          </Span>
          <H2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {t("quickstart.title")}
          </H2>
          <P className="text-muted-foreground text-lg mb-12">
            {t("quickstart.subtitle")}
          </P>

          <Div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {(
              [
                {
                  num: 1,
                  label: t("quickstart.step1.label"),
                  desc: t("quickstart.step1.description"),
                  code: cloneCode,
                },
                {
                  num: 2,
                  label: t("quickstart.step2.label"),
                  desc: t("quickstart.step2.description"),
                  code: startCode,
                },
                {
                  num: 3,
                  label: t("quickstart.step3.label"),
                  desc: t("quickstart.step3.description"),
                  code: null,
                },
                {
                  num: 4,
                  label: t("quickstart.step4.label"),
                  desc: t("quickstart.step4.description"),
                  code: aiCode,
                },
              ] as const
            ).map((step) => (
              <Div key={step.num} className="space-y-3">
                <Div className="flex items-center gap-3">
                  <Span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </Span>
                  <Span className="font-semibold text-sm">{step.label}</Span>
                </Div>
                <Muted className="text-xs leading-relaxed pl-10">
                  {step.desc}
                </Muted>
                {step.code !== null && <Markdown content={step.code} />}
              </Div>
            ))}
          </Div>

          <Div className="flex flex-wrap gap-3 mt-10">
            <Button asChild variant="outline" size="sm">
              <Link
                href={`${GITHUB_REPO_URL}/blob/main/docs/README.md`}
                target="_blank"
              >
                {t("quickstart.docsLink")}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={GITHUB_REPO_URL} target="_blank">
                <GitBranch className="mr-1 h-3 w-3" />
                {t("quickstart.githubLink")}
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>

      {/* ─── Enterprise CTA ───────────────────────────────────────────── */}
      <Div className="border-t border-border/40 bg-muted/10">
        <Div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
          <Div className="max-w-4xl mx-auto">
            <Div className="text-center mb-10">
              <Span className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3 block">
                {t("enterprise.eyebrow")}
              </Span>
              <H2 className="text-3xl md:text-4xl font-bold mb-3">
                {t("enterprise.title")}
              </H2>
              <P className="text-muted-foreground max-w-xl mx-auto">
                {t("enterprise.description")}
              </P>
            </Div>
            <ContactFormSection locale={locale} user={publicUser} />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export default async function FrameworkPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

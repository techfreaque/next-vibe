"use client";

/**
 * Skill landing page view. Pure render of loader data: every word a crawler
 * needs (samples, prompts, model, related skills) is in the server HTML.
 * Interactive bits live in ./landing-actions.tsx.
 *
 * Layout: hero (identity + one CTA | chat card with real answers) → prompts →
 * under the hood (model, versions, vs ChatGPT) → creator → related → CTA band.
 */

import { formatSkillId } from "next-vibe/agent/chat/slugify";
import { resolveMediaSrc } from "next-vibe/agent/chat/storage/media-src";
import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import { SkillOwnershipType } from "next-vibe/agent/skills/enum";
import type { FavoriteCreateRequestOutput } from "next-vibe/agent/skills/favorites/create/definition";
import { scopedTranslation as importTranslation } from "next-vibe/agent/skills/import/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/components/icons/ExternalLink";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { Film } from "next-vibe/ui/components/icons/Film";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Mic } from "next-vibe/ui/components/icons/Mic";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Share2 } from "next-vibe/ui/components/icons/Share2";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Sliders } from "next-vibe/ui/components/icons/Sliders";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Star } from "next-vibe/ui/components/icons/Star";
import { User } from "next-vibe/ui/components/icons/User";
import { Volume2 } from "next-vibe/ui/components/icons/Volume2";
import { Image } from "next-vibe/ui/components/image";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX, ReactNode } from "react";

import {
  CONTAINER,
  Cta,
  CtaRow,
  SectionLabel,
} from "../../story/_shared/marketing";
import { scopedTranslation, type SkillLandingPageT } from "./i18n";
import {
  AddToSkillsAction,
  FINAL_CTA_ID,
  HERO_CTA_ID,
  LeadCaptureIsland,
  SampleComposer,
  ShareEarnAction,
  StickyTryBar,
} from "./landing-actions";
import type { SkillMessagePrice } from "./message-price";
import type { SkillSample } from "./samples";

// ─── types (exported for page.tsx) ───────────────────────────────────────────

/** How the chat model treats content: drives the "vs ChatGPT" copy. */
export type ModelKind = "trained" | "abliterated" | "open" | "mainstream";

/** Per-variant model info, computed server-side. */
export interface ResolvedVariantInfo {
  id: string;
  displayName: string | null;
  description: string | null;
  strength: string | null;
  weakness: string | null;
  isDefault: boolean;
  chatModelName: string | null;
  chatProviderName: string | null;
  modelKind: ModelKind;
  chatMessagePrice: SkillMessagePrice | null;
  voiceModelName: string | null;
  imageGenModelName: string | null;
  imageGenCreditCost: number | null;
  musicGenModelName: string | null;
  videoGenModelName: string | null;
  hasStt: boolean;
  hasImageVision: boolean;
}

export interface ResolvedSkillModels {
  variants: ResolvedVariantInfo[];
}

export interface LeadMagnetConfigData {
  headline: string | null;
  buttonText: string | null;
}

export interface RelatedSkill {
  /** Id as used in /skill/<id> (slug for community skills). */
  id: string;
  name: string;
  tagline: string | null;
  icon: IconKey | null;
}

export interface FreeCredits {
  guest: number;
  signedIn: number;
  max: number;
}

export interface SkillLandingPageProps {
  locale: CountryLanguage;
  skillId: string;
  baseSkillId: string;
  user: JwtPayloadType;
  platform: Platform;
  signupUrl: string;
  loginUrl: string;
  refCode: string | null;
  appName: string;
  modelCount: number;
  freeCredits: FreeCredits;
  /** Direct referral share, e.g. 10 (from the referral config). */
  referralPercent: number;
  resolvedModels: ResolvedSkillModels;
  activeVariantId: string | null;
  leadMagnetConfig: LeadMagnetConfigData | null;
  skillData: SkillGetResponseOutput | null;
  samples: SkillSample[];
  examplePrompts: string[];
  categoryLabel: string | null;
  relatedSkills: RelatedSkill[];
  creatorSkills: RelatedSkill[];
  removed: boolean;
  structuredData: JsonLdNode | null;
}

// ─── links ───────────────────────────────────────────────────────────────────

/** Chat deep link: opens a new chat with exactly this skill (and prompt). */
function chatUrl(
  locale: CountryLanguage,
  user: JwtPayloadType,
  skillId: string,
  refCode: string | null,
  prompt?: string,
): string {
  const folder = user.isPublic ? "incognito" : "private";
  const query = [`skill=${encodeURIComponent(skillId)}`];
  if (prompt) {
    query.push(`q=${encodeURIComponent(prompt)}`);
  }
  if (refCode) {
    query.push(`ref=${encodeURIComponent(refCode)}`);
  }
  return `/${locale}/threads/${folder}/new?${query.join("&")}`;
}

// ─── small pieces ────────────────────────────────────────────────────────────

function SkillAvatar({
  skill,
  size,
}: {
  skill: SkillGetResponseOutput;
  size: "sm" | "lg";
}): JSX.Element {
  const box =
    size === "lg"
      ? "h-16 w-16 rounded-2xl md:h-20 md:w-20"
      : "h-8 w-8 rounded-lg";
  const glyph = size === "lg" ? "h-8 w-8 md:h-10 md:w-10" : "h-4 w-4";
  const avatarUrl = skill.importedFrom?.avatarUrl ?? null;
  return (
    <Span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border border-primary/20 bg-linear-to-br from-primary/15 to-primary/5 text-primary",
        box,
      )}
    >
      {avatarUrl ? (
        <Image
          src={resolveMediaSrc(avatarUrl)}
          alt={skill.name ?? ""}
          width={size === "lg" ? 80 : 32}
          height={size === "lg" ? 80 : 32}
          className="h-full w-full object-cover"
        />
      ) : skill.icon ? (
        <Icon icon={skill.icon} className={glyph} />
      ) : (
        <Sparkles className={glyph} />
      )}
    </Span>
  );
}

function messagePriceLabel(
  price: SkillMessagePrice,
  t: SkillLandingPageT,
): string {
  if (price.credits === 0) {
    return t("model.free");
  }
  return t(price.basis ? "model.estimatedPrice" : "model.fixedPrice", {
    cost: price.creditLabel,
  });
}

function MetaChip({
  icon: ChipIcon,
  children,
  tone = "neutral",
  title,
}: {
  icon: IconComponent;
  children: ReactNode;
  tone?: "neutral" | "primary";
  /** Detail on hover, e.g. the model behind a capability. */
  title?: string;
}): JSX.Element {
  return (
    <Span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium",
        tone === "neutral" && "border-border bg-card text-muted-foreground",
        tone === "primary" && "border-primary/30 bg-primary/10 text-primary",
      )}
    >
      <ChipIcon className="h-3.5 w-3.5" />
      {children}
    </Span>
  );
}

/** Names this long read badly inside a sentence ("Ask X your first question"). */
function isLongName(name: string): boolean {
  return name.length > 20;
}

/** Copy pulled from skill data, ended like a sentence. */
function asSentence(text: string): string {
  const trimmed = text.trim();
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Model output as plain text, with the two inline marks models use most:
 * `code` and *emphasis*. Paragraph breaks are kept.
 */
function AnswerText({ text }: { text: string }): JSX.Element {
  const parts = text.split(/(`[^`]+`|\*[^*\n]+\*)/g);
  return (
    <Span className="whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <Span
            key={i}
            className="rounded bg-background/70 px-1 py-0.5 font-mono text-[0.85em]"
          >
            {part.slice(1, -1)}
          </Span>
        ) : part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <Span key={i} className="italic">
            {part.slice(1, -1)}
          </Span>
        ) : (
          part
        ),
      )}
    </Span>
  );
}

function PromptLink({
  href,
  prompt,
  cta,
}: {
  href: string;
  prompt: string;
  cta: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="group flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
    >
      <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
      <Span className="min-w-0 flex-1 leading-snug">{prompt}</Span>
      <Span className="sr-only">{cta}</Span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

// ─── hero chat card ──────────────────────────────────────────────────────────

function ChatCard({
  skill,
  samples,
  prompts,
  modelName,
  tryUrl,
  promptUrl,
  t,
}: {
  skill: SkillGetResponseOutput;
  samples: SkillSample[];
  prompts: string[];
  modelName: string | null;
  tryUrl: string;
  promptUrl: (prompt: string) => string;
  t: SkillLandingPageT;
}): JSX.Element {
  const name = skill.name ?? "";
  return (
    <Div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-primary/[0.04]">
      {/* header */}
      <Div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <SkillAvatar skill={skill} size="sm" />
        <Div className="min-w-0 flex-1">
          <Span className="block truncate text-sm font-semibold">{name}</Span>
          {modelName && (
            <Span className="block truncate text-xs text-muted-foreground">
              {modelName}
            </Span>
          )}
        </Div>
        {samples.length > 0 && (
          <Span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-success">
            <Span className="h-1.5 w-1.5 rounded-full bg-success" />
            {/* one short word on phones: the model name keeps the room */}
            <Span className="sm:hidden">{t("chat.realShort")}</Span>
            <Span className="hidden sm:inline">{t("chat.realAnswers")}</Span>
          </Span>
        )}
      </Div>

      {/* body */}
      {samples.length > 0 ? (
        <Div className="relative">
          <Div className="flex flex-col gap-5 px-4 py-5 md:px-5">
            {samples.map((sample, i) => (
              <Div key={i} className="flex flex-col gap-2.5">
                <Div className="flex justify-end">
                  <P className="m-0 max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-snug text-primary-foreground">
                    <Span className="sr-only">{t("chat.you")}: </Span>
                    {sample.prompt}
                  </P>
                </Div>
                <Div className="flex items-start gap-2.5">
                  <Span className="mt-0.5 hidden sm:inline-flex">
                    <SkillAvatar skill={skill} size="sm" />
                  </Span>
                  <Div className="min-w-0 max-w-full sm:max-w-[88%]">
                    <Div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
                      <AnswerText text={sample.answer} />
                    </Div>
                    <Link
                      href={promptUrl(sample.prompt)}
                      className="mt-1 inline-flex min-h-8 items-center gap-1 rounded-md px-1 py-1.5 text-sm font-medium text-primary no-underline hover:underline underline-offset-4"
                    >
                      {t("chat.askThis")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      ) : (
        <Div className="flex flex-col gap-3 px-4 py-5 md:px-5">
          <Div>
            <Span className="block text-sm font-semibold">
              {t("chat.startWith")}
            </Span>
            <Span className="block text-xs text-muted-foreground">
              {t("chat.startWithHint")}
            </Span>
          </Div>
          {prompts.map((prompt) => (
            <PromptLink
              key={prompt}
              href={promptUrl(prompt)}
              prompt={prompt}
              cta={t("prompts.start")}
            />
          ))}
        </Div>
      )}

      {/* real composer: type a question, send opens the chat with it */}
      <Div className="mt-auto border-t border-border bg-muted/40 px-4 py-3">
        <SampleComposer
          chatUrl={tryUrl}
          placeholder={t("chat.inputPlaceholderGeneric")}
          sendLabel={t("chat.send")}
        />
        {samples.length > 0 && modelName && (
          <Span className="mt-2 block text-xs text-muted-foreground">
            {t("chat.footnote", { model: modelName })}
          </Span>
        )}
      </Div>
    </Div>
  );
}

// ─── hero ────────────────────────────────────────────────────────────────────

function ImportedCredit({
  locale,
  importedFrom,
}: {
  locale: CountryLanguage;
  importedFrom: NonNullable<SkillGetResponseOutput["importedFrom"]>;
}): JSX.Element {
  const { t } = importTranslation.scopedT(locale);
  const platform = t(importedFrom.platform);
  return (
    <Link
      href={importedFrom.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground no-underline hover:text-foreground"
    >
      {importedFrom.creatorName
        ? t("post.result.credit", {
            creator: importedFrom.creatorName,
            platform,
          })
        : t("post.result.creditUnknown", { platform })}
      <ExternalLinkIcon className="h-3 w-3" />
    </Link>
  );
}

function favoriteDataFor(
  skillId: string,
  skill: SkillGetResponseOutput,
  variantId: string | null,
): FavoriteCreateRequestOutput {
  const v =
    skill.variants.find((x) => x.id === variantId) ??
    skill.variants.find((x) => x.isDefault) ??
    skill.variants[0];
  return {
    skillId: v ? formatSkillId(skillId, v.id) : skillId,
    icon: skill.icon ?? undefined,
    modelSelection: v?.modelSelection,
    voiceModelSelection: v?.voiceModelSelection,
    sttModelSelection: v?.sttModelSelection,
    imageVisionModelSelection: v?.imageVisionModelSelection,
    videoVisionModelSelection: v?.videoVisionModelSelection,
    audioVisionModelSelection: v?.audioVisionModelSelection,
    imageGenModelSelection: v?.imageGenModelSelection,
    musicGenModelSelection: v?.musicGenModelSelection,
    videoGenModelSelection: v?.videoGenModelSelection,
  };
}

// ─── sections ────────────────────────────────────────────────────────────────

function KindCard({
  variant,
  hedgeHref,
  t,
}: {
  variant: ResolvedVariantInfo;
  /** Persona skills whose default model hedges: link to their uncensored version. */
  hedgeHref: string | null;
  t: SkillLandingPageT;
}): JSX.Element {
  const model = variant.chatModelName ?? "";
  // Community versions rarely describe themselves: fall back to the model kind.
  const strength =
    variant.strength ?? t(`model.kindDefaults.${variant.modelKind}.strength`);
  const weakness =
    variant.weakness ?? t(`model.kindDefaults.${variant.modelKind}.weakness`);
  const uncensored =
    variant.modelKind === "trained" || variant.modelKind === "abliterated";
  // tool: made by a separate image/music/video model the chat can call
  const media: Array<{
    icon: IconComponent;
    label: string;
    detail?: string;
    tool?: boolean;
  }> = [];
  if (variant.voiceModelName) {
    media.push({
      icon: Volume2,
      label: t("model.media.voice"),
      detail: variant.voiceModelName,
    });
  }
  if (variant.imageGenModelName) {
    media.push({
      icon: ImageIcon,
      tool: true,
      label: t("model.media.imageGen"),
      detail: variant.imageGenModelName,
    });
  }
  if (variant.musicGenModelName) {
    media.push({
      icon: Music,
      tool: true,
      label: t("model.media.musicGen"),
      detail: variant.musicGenModelName,
    });
  }
  if (variant.videoGenModelName) {
    media.push({
      icon: Film,
      tool: true,
      label: t("model.media.videoGen"),
      detail: variant.videoGenModelName,
    });
  }
  if (variant.hasStt) {
    media.push({ icon: Mic, label: t("model.media.stt") });
  }
  if (variant.hasImageVision) {
    media.push({ icon: Eye, label: t("model.media.vision") });
  }

  return (
    <Div className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
      <Div className="flex flex-wrap items-center gap-2">
        <MetaChip icon={uncensored ? ShieldOff : Cpu} tone="primary">
          {t(`model.kind.${variant.modelKind}.badge`)}
        </MetaChip>
      </Div>
      <Div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <Div className="min-w-0">
          <Span className="block text-2xl font-semibold tracking-tight md:text-3xl">
            {model}
          </Span>
          {variant.chatProviderName && (
            <Span className="mt-1 block text-sm text-muted-foreground">
              {t("model.by", { provider: variant.chatProviderName })}
            </Span>
          )}
        </Div>
        {variant.chatMessagePrice && (
          <Div className="sm:text-right">
            <Span className="block text-xl font-semibold tabular-nums">
              {messagePriceLabel(variant.chatMessagePrice, t)}
            </Span>
            {variant.chatMessagePrice.credits > 0 && (
              <Span className="block text-xs text-muted-foreground">
                {t("model.perMessage")}
              </Span>
            )}
          </Div>
        )}
      </Div>
      <H3 className="mt-6 text-lg font-semibold tracking-tight">
        {t(`model.kind.${variant.modelKind}.title`)}
      </H3>
      <P className="mt-2 text-sm leading-relaxed text-foreground/75 md:text-base dark:text-muted-foreground">
        {t(`model.kind.${variant.modelKind}.body`, { model })}
      </P>
      {(strength || weakness) && (
        <Div className="mt-5 grid gap-2 text-sm">
          {strength && (
            <Div className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <Span>
                <Span className="font-medium">{t("model.strength")}: </Span>
                <Span className="text-foreground/75 dark:text-muted-foreground">
                  {asSentence(strength)}
                </Span>
              </Span>
            </Div>
          )}
          {weakness && (
            <Div className="flex gap-2">
              <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <Span>
                <Span className="font-medium">{t("model.weakness")}: </Span>
                <Span className="text-foreground/75 dark:text-muted-foreground">
                  {hedgeHref ? (
                    <>
                      {t("model.hedge.before")}{" "}
                      <Link
                        href={hedgeHref}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {t("model.hedge.link")}
                      </Link>
                      {t("model.hedge.after")}
                    </>
                  ) : (
                    asSentence(weakness)
                  )}
                </Span>
              </Span>
            </Div>
          )}
        </Div>
      )}
      {media.some((m) => !m.tool) && (
        <Div className="mt-5 flex flex-wrap gap-2">
          {media
            .filter((m) => !m.tool)
            .map((m) => (
              <MetaChip key={m.label} icon={m.icon} title={m.detail}>
                {m.label}
              </MetaChip>
            ))}
        </Div>
      )}
      {media.some((m) => m.tool) && (
        <Div className="mt-2 flex flex-wrap items-center gap-2">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("model.toolsLabel")}
          </Span>
          {media
            .filter((m) => m.tool)
            .map((m) => (
              <MetaChip key={m.label} icon={m.icon} title={m.detail}>
                {m.label}
              </MetaChip>
            ))}
        </Div>
      )}
      {uncensored && (
        <Div className="mt-6 flex gap-2.5 rounded-xl border border-border bg-muted/60 p-3.5 text-sm leading-relaxed">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <Span>{t("model.ageNote")}</Span>
        </Div>
      )}
      {variant.chatMessagePrice?.basis &&
        variant.chatMessagePrice.credits > 0 && (
          <Span className="mt-5 block text-xs text-muted-foreground">
            {t(
              variant.chatMessagePrice.basis.includesImage
                ? "model.perMessageWithImageHint"
                : "model.perMessageHint",
              {
                input: variant.chatMessagePrice.basis.input,
                output: variant.chatMessagePrice.basis.output,
              },
            )}
          </Span>
        )}
    </Div>
  );
}

/** Default versions whose trade-off gets a link to the uncensored version. */
/** Persona skills whose default version runs a model that hedges on politics. */
const HEDGE_SKILLS: ReadonlySet<string> = new Set(["thea", "hermes"]);

/** Skills with their own "why not ChatGPT" line; others use the model kind. */
const COMPARE_SKILL_KEYS = {
  "4chan": "chan4",
  uncensored: "uncensored",
  thea: "thea",
  hermes: "hermes",
  "uncensored-writer": "uncensoredWriter",
  tay: "tay",
  "roleplay-skill": "roleplay",
  "free-speech-activist": "freeSpeech",
  coder: "coder",
  "unbiased-historian": "historian",
  hacker: "hacker",
} as const;

function isCompareSkill(id: string): id is keyof typeof COMPARE_SKILL_KEYS {
  return id in COMPARE_SKILL_KEYS;
}

function CompareList({
  t,
  baseSkillId,
  modelKind,
  modelCount,
  referralPercent,
  ownActions,
}: {
  t: SkillLandingPageT;
  baseSkillId: string;
  modelKind: ModelKind;
  modelCount: number;
  referralPercent: number;
  /** Share & earn / add to my skills, shown under "Make it yours". */
  ownActions: ReactNode;
}): JSX.Element {
  const lead = isCompareSkill(baseSkillId)
    ? {
        title: t(`compare.skill.${COMPARE_SKILL_KEYS[baseSkillId]}.title`),
        body: t(`compare.skill.${COMPARE_SKILL_KEYS[baseSkillId]}.body`),
      }
    : {
        title: t(`compare.kind.${modelKind}.title`),
        body: t(`compare.kind.${modelKind}.body`),
      };
  const items: Array<{
    icon: IconComponent;
    title: string;
    body: string;
    actions?: ReactNode;
  }> = [
    { icon: Sparkles, title: lead.title, body: lead.body },
    {
      icon: Sliders,
      title: t("compare.filter.title"),
      body: t("compare.filter.body"),
    },
    {
      icon: Layers,
      title: t("compare.models.title", { count: modelCount }),
      body: t("compare.models.body"),
    },
    {
      icon: Share2,
      title: t("compare.own.title"),
      body: t("compare.own.body", { percent: referralPercent }),
      actions: ownActions,
    },
  ];
  return (
    <Div className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
      <SectionLabel>{t("compare.label")}</SectionLabel>
      <H3 className="text-lg font-semibold tracking-tight">
        {t("compare.title")}
      </H3>
      <Div className="mt-6 flex flex-col gap-6">
        {items.map((item) => (
          <Div key={item.title} className="flex gap-4">
            <Span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </Span>
            <Div className="min-w-0">
              <Span className="block font-semibold">{item.title}</Span>
              <Span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </Span>
              {item.actions !== undefined && (
                <Div className="mt-2 -ml-3 flex flex-wrap items-center gap-1">
                  {item.actions}
                </Div>
              )}
            </Div>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

/**
 * Versions worth listing: a version on the same model at the same price as
 * one already listed adds nothing for a visitor, so it is dropped (the one
 * being viewed and the default always stay).
 */
function distinctVariants(
  variants: ResolvedVariantInfo[],
  activeId: string | null,
): ResolvedVariantInfo[] {
  const ordered = [
    ...variants.filter((v) => v.id === activeId || v.isDefault),
    ...variants.filter((v) => v.id !== activeId && !v.isDefault),
  ];
  const seen = new Set<string>();
  const kept = new Set<string>();
  for (const v of ordered) {
    const key = `${v.chatModelName ?? ""}|${v.chatMessagePrice?.credits ?? ""}`;
    if (v.id === activeId || v.isDefault || !seen.has(key)) {
      kept.add(v.id);
    }
    seen.add(key);
  }
  // The version being viewed always leads the list.
  return [
    ...variants.filter((v) => v.id === activeId),
    ...variants.filter((v) => v.id !== activeId && kept.has(v.id)),
  ];
}

function VariantList({
  variants,
  activeId,
  baseSkillId,
  locale,
  tryHref,
  t,
}: {
  variants: ResolvedVariantInfo[];
  activeId: string | null;
  baseSkillId: string;
  locale: CountryLanguage;
  tryHref: (skillId: string) => string;
  t: SkillLandingPageT;
}): JSX.Element {
  return (
    <Div className="mt-10">
      <H3 className="text-lg font-semibold tracking-tight">
        {t("model.variants.title", { count: variants.length })}
      </H3>
      <P className="mt-1 text-sm text-muted-foreground">
        {t("model.variants.intro")}
      </P>
      <Div className="mt-5 grid gap-3 md:grid-cols-2">
        {variants.map((v) => {
          const variantSkillId = formatSkillId(baseSkillId, v.id);
          const isActive = v.id === activeId;
          return (
            <Div
              key={v.id}
              className={cn(
                "flex min-w-0 flex-col rounded-xl border bg-card p-4 shadow-xs",
                isActive
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-border",
              )}
            >
              <Div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/${locale}/skill/${variantSkillId}`}
                  className="font-semibold text-foreground no-underline hover:underline underline-offset-4"
                >
                  {v.displayName ?? v.id}
                </Link>
                {!isActive &&
                  v.isDefault &&
                  (v.displayName ?? v.id).toLowerCase() !==
                    t("model.variants.default").toLowerCase() &&
                  (v.displayName ?? v.id).toLowerCase() !== "default" && (
                    <Span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {t("model.variants.default")}
                    </Span>
                  )}
                {isActive && (
                  <Span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {t("model.variants.current")}
                  </Span>
                )}
              </Div>
              <Span className="mt-1 block text-sm text-muted-foreground">
                {[
                  v.chatModelName,
                  v.chatMessagePrice
                    ? messagePriceLabel(v.chatMessagePrice, t)
                    : null,
                ]
                  .filter((x): x is string => !!x)
                  .join(" · ")}
              </Span>
              {v.description && (
                <Span className="mt-2 block text-sm leading-relaxed">
                  {v.description}
                </Span>
              )}
              {!isActive && (
                <Link
                  href={tryHref(variantSkillId)}
                  className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-2 text-sm font-medium text-primary no-underline hover:underline underline-offset-4"
                >
                  {t("model.variants.try")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

function RelatedGrid({
  title,
  skills,
  locale,
}: {
  title: string;
  skills: RelatedSkill[];
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Div>
      <H3 className="mb-4 text-lg font-semibold tracking-tight">{title}</H3>
      {/* phones: one compact column, capped at 4 (the "All skills" link sits above) */}
      <Div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {skills.map((s, index) => (
          <Link
            key={s.id}
            href={`/${locale}/skill/${s.id}`}
            className={cn(
              "group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 sm:p-4",
              index >= 4 && "hidden sm:flex",
            )}
          >
            <Span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
              {s.icon ? (
                <Icon icon={s.icon} className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </Span>
            <Span className="min-w-0 flex-1">
              <Span className="line-clamp-2 block text-sm font-semibold sm:truncate">
                {s.name}
              </Span>
              {s.tagline && (
                <Span className="block truncate text-xs text-muted-foreground">
                  {s.tagline}
                </Span>
              )}
            </Span>
            <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
          </Link>
        ))}
      </Div>
    </Div>
  );
}

const CREATOR_SOCIALS = [
  { key: "twitterUrl", label: "X" },
  { key: "youtubeUrl", label: "YouTube" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "githubUrl", label: "GitHub" },
  { key: "discordUrl", label: "Discord" },
  { key: "websiteUrl", label: "Website" },
] as const;

function CreatorCard({
  creator,
  locale,
  t,
  children,
}: {
  creator: NonNullable<SkillGetResponseOutput["creatorProfile"]>;
  locale: CountryLanguage;
  t: SkillLandingPageT;
  children?: ReactNode;
}): JSX.Element {
  const socials = CREATOR_SOCIALS.flatMap(({ key, label }) => {
    const url = creator[key];
    return url ? [{ url, label }] : [];
  });
  return (
    <Div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {creator.creatorHeaderImageUrl && (
        <Image
          src={creator.creatorHeaderImageUrl}
          alt=""
          width={1200}
          height={240}
          className="h-28 w-full object-cover md:h-36"
        />
      )}
      <Div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:p-8">
        <Div className="flex min-w-0 flex-1 gap-4">
          <Span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.publicName}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
          </Span>
          <Div className="min-w-0">
            <SectionLabel className="mb-1">{t("creator.label")}</SectionLabel>
            <Span className="block text-lg font-semibold">
              {t("creator.madeBy", { name: creator.publicName })}
            </Span>
            {creator.bio && (
              <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {creator.bio}
              </P>
            )}
            <Div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href={`/${locale}/creator/${creator.creatorSlug}`}
                className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-primary no-underline hover:underline underline-offset-4"
              >
                {t("creator.viewProfile")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-border px-3 text-xs text-muted-foreground no-underline hover:text-foreground"
                >
                  {s.label}
                  <ExternalLinkIcon className="h-3 w-3" />
                </Link>
              ))}
            </Div>
          </Div>
        </Div>
        {children !== undefined && (
          <Div className="w-full rounded-xl border border-border bg-muted/40 p-4 md:max-w-sm">
            {children}
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ─── removed state ───────────────────────────────────────────────────────────

/**
 * Closing CTA band: same look as the story pages' CtaBand, tighter on phones
 * (no dead space under the login link), and tagged for the sticky bar.
 */
function ClosingBand({
  title,
  subtitle,
  actions,
  children,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  actions: ReactNode;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Section className="pt-14 pb-10 md:py-24">
      <Div className={CONTAINER}>
        <Div
          id={FINAL_CTA_ID}
          className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/[0.07] to-card px-6 pt-10 pb-6 text-center md:px-12 md:py-16"
        >
          <H2 className="mx-auto max-w-2xl border-none pb-0 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </H2>
          <P className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {subtitle}
          </P>
          <CtaRow centered className="mt-8">
            {actions}
          </CtaRow>
          {children}
        </Div>
      </Div>
    </Section>
  );
}

function RemovedSkillNotice({
  locale,
  relatedSkills,
}: {
  locale: CountryLanguage;
  relatedSkills: RelatedSkill[];
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-background text-foreground">
      <Div className={cn(CONTAINER, "py-16 md:py-24")}>
        <Div className="mx-auto max-w-md text-center">
          <Span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
            <Sparkles className="h-7 w-7" />
          </Span>
          <H1 className="text-3xl font-semibold tracking-tight">
            {t("removed.title")}
          </H1>
          <P className="mt-3 text-muted-foreground">{t("removed.body")}</P>
          <Div className="mt-6 flex justify-center">
            <Cta href={`/${locale}/skills`} label={t("removed.cta")} />
          </Div>
        </Div>
        {relatedSkills.length > 0 && (
          <Div className="mt-16">
            <RelatedGrid
              title={t("related.similar")}
              skills={relatedSkills}
              locale={locale}
            />
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export function SkillLandingPage(props: SkillLandingPageProps): JSX.Element {
  const {
    locale,
    skillId,
    baseSkillId,
    user,
    platform,
    signupUrl,
    loginUrl,
    refCode,
    modelCount,
    freeCredits,
    referralPercent,
    resolvedModels,
    activeVariantId,
    leadMagnetConfig,
    skillData,
    samples,
    examplePrompts,
    categoryLabel,
    relatedSkills,
    creatorSkills,
    removed,
    structuredData,
  } = props;
  const { t } = scopedTranslation.scopedT(locale);

  if (removed || !skillData) {
    return <RemovedSkillNotice locale={locale} relatedSkills={relatedSkills} />;
  }

  const name = skillData.name ?? "";
  // Built-in skills get a landing line that says what the skill does for the
  // visitor; others use their own description.
  const oneLiner = isCompareSkill(baseSkillId)
    ? t(`pitch.${COMPARE_SKILL_KEYS[baseSkillId]}`)
    : (skillData.description ?? skillData.tagline ?? "");
  const creator = skillData.creatorProfile;
  const isCommunity = skillData.skillOwnership !== SkillOwnershipType.SYSTEM;
  const variants = resolvedModels.variants;
  const active =
    variants.find((v) => v.id === activeVariantId) ?? variants[0] ?? null;
  const tryUrl = chatUrl(locale, user, skillId, refCode);
  const promptUrl = (prompt: string): string =>
    chatUrl(locale, user, skillId, refCode, prompt);
  const variantTryUrl = (id: string): string =>
    chatUrl(locale, user, id, refCode);
  const favCount = skillData.favoritesCount;
  const listedVariants = distinctVariants(variants, active?.id ?? null);
  const longName = isLongName(name);
  // Thea/Hermes promise honesty, but their default model hedges on politics:
  // the trade-off line points to their own uncensored version.
  const hedgeHref =
    active &&
    HEDGE_SKILLS.has(baseSkillId) &&
    active.isDefault &&
    variants.some((v) => v.id === "uncensored")
      ? chatUrl(locale, user, formatSkillId(baseSkillId, "uncensored"), refCode)
      : null;
  // One CTA label everywhere (hero, closing band, phone bar).
  const tryLabel = longName
    ? t("hero.tryGeneric")
    : t("sticky.tryNamed", { name });
  // What the guest allowance buys on this skill's model ("about 4 messages").
  const messagePrice = active?.chatMessagePrice;
  const messagePriceText = messagePrice
    ? messagePriceLabel(messagePrice, t)
    : null;
  const freeMessages =
    messagePrice && messagePrice.credits > 0
      ? Math.floor(freeCredits.guest / messagePrice.credits) || null
      : null;
  // The creator's own signup form, shown quietly inside the creator card.
  const leadForm = leadMagnetConfig ? (
    <LeadCaptureIsland
      locale={locale}
      user={user}
      platform={platform}
      skillId={skillId}
      headline={leadMagnetConfig.headline}
      buttonText={leadMagnetConfig.buttonText}
    />
  ) : undefined;
  // Share & earn / add live inside "Make it yours": one CTA in the hero.
  const secondaryActions = (
    <>
      <ShareEarnAction
        locale={locale}
        user={user}
        platform={platform}
        skillId={skillId}
        skillName={name}
      />
      {!user.isPublic && (
        <AddToSkillsAction
          locale={locale}
          user={user}
          data={favoriteDataFor(skillId, skillData, activeVariantId)}
        />
      )}
    </>
  );
  const hasSamples = samples.length > 0;

  return (
    <Div className="bg-background text-foreground">
      {structuredData && (
        <JsonLd id="skill-structured-data" data={structuredData} />
      )}

      {/* ── HERO ── */}
      <Div className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/[0.07] via-background to-background">
        <Div
          className={cn(
            CONTAINER,
            "grid items-start gap-6 pt-4 pb-14 md:pt-10 md:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14",
          )}
        >
          {/* identity + CTA */}
          <Div className="min-w-0 lg:self-start lg:pt-2">
            <Div className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground md:mb-6">
              <Link
                href={`/${locale}/skills`}
                className="inline-flex min-h-9 items-center no-underline hover:text-foreground"
              >
                {t("breadcrumb.skills")}
              </Link>
              {categoryLabel && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Span>{categoryLabel}</Span>
                </>
              )}
            </Div>

            <Div className="flex items-center gap-4">
              <SkillAvatar skill={skillData} size="lg" />
              <Div className="min-w-0">
                <Span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {isCommunity ? t("hero.community") : t("hero.builtIn")}
                </Span>
                <H1
                  className={cn(
                    "line-clamp-2 font-semibold tracking-tight text-balance [overflow-wrap:anywhere]",
                    // the base H1 sets lg:text-5xl, so every size names lg too
                    name.length > 28
                      ? "text-2xl md:text-3xl lg:text-3xl"
                      : name.length > 16
                        ? "text-3xl md:text-4xl lg:text-4xl"
                        : "text-4xl md:text-5xl lg:text-5xl",
                  )}
                >
                  {name}
                </H1>
              </Div>
            </Div>

            {oneLiner && (
              <P className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
                {oneLiner}
              </P>
            )}

            <Div className="mt-5 flex flex-wrap items-center gap-2">
              {active?.chatModelName && (
                <MetaChip
                  icon={
                    active.modelKind === "trained" ||
                    active.modelKind === "abliterated"
                      ? ShieldOff
                      : Cpu
                  }
                  tone="primary"
                >
                  <Span className="sr-only">
                    {t("hero.runsOn", { model: "" })}
                  </Span>
                  {active.chatModelName}
                </MetaChip>
              )}
              {messagePrice && messagePriceText && (
                <MetaChip icon={DollarSign}>
                  {messagePrice.credits === 0 ? (
                    messagePriceText
                  ) : (
                    <>
                      <Span className="sm:hidden">
                        {t("hero.costPerMessageShort", {
                          price: messagePriceText,
                        })}
                      </Span>
                      <Span className="hidden sm:inline">
                        {t("hero.costPerMessage", {
                          price: messagePriceText,
                        })}
                      </Span>
                    </>
                  )}
                </MetaChip>
              )}
              {favCount > 0 && (
                <MetaChip icon={Star}>
                  {t("hero.favorites", { count: favCount })}
                </MetaChip>
              )}
            </Div>

            {(creator || skillData.importedFrom) && (
              <Div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {creator && (
                  <Link
                    href={`/${locale}/creator/${creator.creatorSlug}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground no-underline hover:text-foreground"
                  >
                    <Span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                      {creator.avatarUrl ? (
                        <Image
                          src={creator.avatarUrl}
                          alt={creator.publicName}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                    </Span>
                    {t("hero.byCreator", { name: creator.publicName })}
                  </Link>
                )}
                {skillData.importedFrom && (
                  <ImportedCredit
                    locale={locale}
                    importedFrom={skillData.importedFrom}
                  />
                )}
              </Div>
            )}

            {/* the one CTA */}
            <Div id={HERO_CTA_ID} className="mt-6 flex flex-col gap-3 md:mt-8">
              <Button
                asChild
                size="lg"
                className="h-13 w-full gap-2 px-8 text-base font-semibold shadow-md shadow-primary/20 sm:w-auto"
              >
                <Link href={tryUrl}>
                  {tryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Span className="flex items-start justify-center gap-2 text-sm leading-snug text-muted-foreground sm:justify-start">
                {user.isPublic ? (
                  <>
                    <Gift className="mt-px h-4 w-4 shrink-0 text-primary" />
                    {freeMessages !== null
                      ? t("hero.guestNoteEstimate", {
                          credits: freeCredits.guest,
                          messages: freeMessages,
                        })
                      : t("hero.guestNote", { credits: freeCredits.guest })}
                  </>
                ) : longName ? (
                  t("hero.userNoteGeneric")
                ) : (
                  t("hero.userNote", { name })
                )}
              </Span>
            </Div>

            {/* desktop: fill the column beside the tall sample card with a
                real next step, not padding */}
            <Div className="mt-10 hidden flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 text-sm lg:flex">
              {active?.chatModelName && (
                <Div className="flex gap-2.5">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <Span>
                    {t("hero.trust.real", { model: active.chatModelName })}
                  </Span>
                </Div>
              )}
              <Div className="flex gap-2.5">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <Span>{t("hero.trust.switch", { count: modelCount })}</Span>
              </Div>
              {(active?.modelKind === "trained" ||
                active?.modelKind === "abliterated") && (
                <Div className="flex gap-2.5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <Span>{t("model.ageNote")}</Span>
                </Div>
              )}
            </Div>
          </Div>

          {/* chat card */}
          <ChatCard
            skill={skillData}
            samples={samples}
            prompts={examplePrompts}
            modelName={active?.chatModelName ?? null}
            tryUrl={tryUrl}
            promptUrl={promptUrl}
            t={t}
          />
        </Div>
      </Div>

      {/* ── PROMPTS (only when the hero showed samples) ── */}
      {hasSamples && examplePrompts.length > 0 && (
        <Section className="py-14 md:py-20">
          <Div className={CONTAINER}>
            <Div className="mb-8 max-w-2xl">
              <SectionLabel>{t("prompts.label")}</SectionLabel>
              <H2 className="border-none pb-0 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                {longName
                  ? t("prompts.titleGeneric")
                  : t("prompts.title", { name })}
              </H2>
              <P className="mt-3 text-base text-muted-foreground md:text-lg">
                {t("prompts.intro")}
              </P>
            </Div>
            <Div className="grid gap-3 sm:grid-cols-2">
              {examplePrompts.map((prompt) => (
                <PromptLink
                  key={prompt}
                  href={promptUrl(prompt)}
                  prompt={prompt}
                  cta={t("prompts.start")}
                />
              ))}
            </Div>
          </Div>
        </Section>
      )}

      {/* ── UNDER THE HOOD ── */}
      {active && (
        <Section className="border-y border-border bg-muted/40 py-14 md:py-20">
          <Div className={CONTAINER}>
            <Div className="mb-8 max-w-2xl">
              <SectionLabel>{t("model.label")}</SectionLabel>
              <H2 className="border-none pb-0 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                {longName
                  ? t("model.titleGeneric")
                  : t("model.title", { name })}
              </H2>
            </Div>
            <Div className="grid items-start gap-4 md:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <KindCard variant={active} hedgeHref={hedgeHref} t={t} />
              <CompareList
                t={t}
                baseSkillId={baseSkillId}
                modelKind={active.modelKind}
                modelCount={modelCount}
                referralPercent={referralPercent}
                ownActions={secondaryActions}
              />
            </Div>
            {listedVariants.length > 1 && (
              <VariantList
                variants={listedVariants}
                activeId={active.id}
                baseSkillId={baseSkillId}
                locale={locale}
                tryHref={variantTryUrl}
                t={t}
              />
            )}
          </Div>
        </Section>
      )}

      {/* ── CREATOR + THEIR LEAD FORM ── */}
      {(creator || leadMagnetConfig) && (
        <Section className="pt-14 md:pt-20">
          <Div className={CONTAINER}>
            {creator ? (
              <CreatorCard creator={creator} locale={locale} t={t}>
                {leadForm}
              </CreatorCard>
            ) : (
              <Div className="mx-auto max-w-md rounded-2xl border border-border bg-muted/40 p-6">
                {leadForm}
              </Div>
            )}
          </Div>
        </Section>
      )}

      {/* ── RELATED ── */}
      {(creatorSkills.length > 0 || relatedSkills.length > 0) && (
        <Section className="pt-14 md:pt-20">
          <Div className={cn(CONTAINER, "flex flex-col gap-8")}>
            <Div className="-mb-5 flex flex-wrap items-center justify-between gap-3">
              <SectionLabel className="mb-0">{t("related.label")}</SectionLabel>
              <Link
                href={`/${locale}/skills`}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline underline-offset-4"
              >
                {t("related.allSkills")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Div>
            {creator && creatorSkills.length > 0 && (
              <RelatedGrid
                title={t("related.moreFrom", { name: creator.publicName })}
                skills={creatorSkills}
                locale={locale}
              />
            )}
            {relatedSkills.length > 0 && (
              <RelatedGrid
                title={t("related.similar")}
                skills={relatedSkills}
                locale={locale}
              />
            )}
          </Div>
        </Section>
      )}

      {/* ── CLOSING CTA ── */}
      <ClosingBand
        title={
          baseSkillId === "4chan"
            ? t("bottom.titleChan4")
            : longName
              ? t("bottom.titleGeneric")
              : t("bottom.title", { name })
        }
        subtitle={
          user.isPublic
            ? t("bottom.guestSubtitle", {
                guest: freeCredits.guest,
                signedIn: freeCredits.signedIn,
                max: freeCredits.max,
              })
            : longName
              ? t("bottom.userSubtitleGeneric")
              : t("bottom.userSubtitle", { name })
        }
        actions={
          <>
            <Cta href={tryUrl} label={tryLabel} />
            {user.isPublic && (
              <Cta
                href={signupUrl}
                label={t("bottom.signup")}
                variant="secondary"
                arrow={false}
              />
            )}
          </>
        }
      >
        {user.isPublic && (
          <Link
            href={loginUrl}
            className="mt-5 inline-flex min-h-11 items-center text-sm text-muted-foreground no-underline hover:text-foreground"
          >
            {t("bottom.login")}
          </Link>
        )}
      </ClosingBand>

      {/* phones: keep the CTA one tap away once the hero is gone */}
      <StickyTryBar href={tryUrl} label={tryLabel} />
    </Div>
  );
}

/**
 * Building blocks of the skill landing page. Every block reads
 * real skill data only: identity, description, versions with their model and
 * billed price, creator, suggested first messages and related skills.
 */

import { resolveMediaSrc } from "next-vibe/agent/chat/storage/media-src";
import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as importTranslation } from "next-vibe/agent/skills/import/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/components/icons/ExternalLink";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Image } from "next-vibe/ui/components/image";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";

import { formatCreditsAsMoney } from "@/products/credit-money";

import { TierBadge } from "../../models/_shared/model-ui";
import type { SkillLandingPageT } from "./i18n";
import type { SkillMessagePrice } from "./message-price";
import type { RelatedSkill, ResolvedVariantInfo } from "./page-client";

/** Everything the page needs, derived once from the loader data. */
export interface LandingView {
  locale: CountryLanguage;
  t: SkillLandingPageT;
  skill: SkillGetResponseOutput;
  /** Name exactly as the creator wrote it (H1). */
  name: string;
  /** Name without emoji, for buttons, headings and sentences. */
  plainName: string;
  tagline: string | null;
  /** First paragraph of the description. */
  summary: string;
  /** Remaining paragraphs, if any. */
  more: string | null;
  categoryLabel: string | null;
  variants: ResolvedVariantInfo[];
  active: ResolvedVariantInfo | null;
  prompts: string[];
  isGuest: boolean;
  refCode: string | null;
  /** Skill id as in the URL (may carry the variant). */
  skillId: string;
  /** New-thread route the chat opens in. */
  destination: string;
  chatHref: (skillId: string, prompt?: string) => string;
  variantPageHref: (variant: ResolvedVariantInfo) => string;
  relatedSkills: RelatedSkill[];
  creatorSkills: RelatedSkill[];
}

export const rowLink =
  "group flex min-h-11 min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:border-primary/40";

export function SkillAvatar({
  skill,
  size,
  className,
}: {
  skill: SkillGetResponseOutput;
  size: "sm" | "md" | "lg" | "xl";
  className?: string;
}): JSX.Element {
  const url = skill.importedFrom?.avatarUrl;
  const iconSize = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
    xl: "h-10 w-10",
  }[size];
  return (
    <Span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border border-border bg-primary/10 text-primary",
        size === "sm" && "size-10 rounded-lg",
        size === "md" && "size-14 rounded-xl",
        size === "lg" && "size-20 rounded-2xl",
        size === "xl" && "size-28 rounded-2xl",
        className,
      )}
    >
      {url ? (
        <Image
          src={resolveMediaSrc(url)}
          alt=""
          width={224}
          height={224}
          className="size-full object-cover"
        />
      ) : skill.icon ? (
        <Icon icon={skill.icon} className={iconSize} />
      ) : (
        <Sparkles className={iconSize} />
      )}
    </Span>
  );
}

/** "6.5 credits per message" / "About 3.54 credits per message". */
export function priceLabel(
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

/** "6.5 credits" / "~3.54 credits", for places already labelled per message. */
export function shortPriceLabel(
  price: SkillMessagePrice,
  t: SkillLandingPageT,
): string {
  if (price.credits === 0) {
    return t("model.free");
  }
  return t(price.basis ? "model.creditsAbout" : "model.credits", {
    cost: price.creditLabel,
  });
}

export function PriceText({
  price,
  view,
  short = false,
  className,
}: {
  price: SkillMessagePrice;
  view: LandingView;
  /** Omit "per message" when the label already says it. */
  short?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}
    >
      <Span className="font-semibold text-foreground">
        {short ? shortPriceLabel(price, view.t) : priceLabel(price, view.t)}
      </Span>
      <Span className="whitespace-nowrap text-muted-foreground">
        {formatCreditsAsMoney(price.credits, view.locale)}
      </Span>
    </Span>
  );
}

export function priceBasis(
  price: SkillMessagePrice | null,
  t: SkillLandingPageT,
): string | null {
  if (!price?.basis) {
    return null;
  }
  return t(
    price.basis.includesImage
      ? "model.perMessageWithImageHint"
      : "model.perMessageHint",
    { input: price.basis.input, output: price.basis.output },
  );
}

/**
 * What the content tier means for this skill, in one or two sentences:
 * named after the skill and its model, and specific to how the model is
 * uncensored when it is.
 */
export function tierHint(view: LandingView): string | null {
  const { active, t, plainName } = view;
  if (!active?.chatModelContent) {
    return null;
  }
  const params = {
    name: plainName,
    model: active.chatModelName ?? t("chatModel"),
  };
  switch (active.chatModelContent) {
    case ContentLevel.MAINSTREAM:
      return t("tier.mainstream", params);
    case ContentLevel.OPEN:
      return t("tier.open", params);
    case ContentLevel.UNCENSORED:
      switch (active.chatModelUncensoredMethod) {
        case "ownWorldview":
          return t("tier.ownWorldview", params);
        case "abliterated":
          return t("tier.abliterated", params);
        case "fineTuned":
          return t("tier.fineTuned", params);
        default:
          return t("tier.uncensored", params);
      }
  }
}

export function ModelTier({
  content,
  locale,
}: {
  content: typeof ContentLevelValue | null;
  locale: CountryLanguage;
}): JSX.Element | null {
  return content ? <TierBadge content={content} locale={locale} /> : null;
}

export function ImportedCredit({
  locale,
  importedFrom,
}: {
  locale: CountryLanguage;
  importedFrom: NonNullable<SkillGetResponseOutput["importedFrom"]>;
}): JSX.Element {
  const { t } = importTranslation.scopedT(locale);
  const platform = t(importedFrom.platform);
  // Card imports have no page to link back to: plain credit line.
  if (!importedFrom.sourceUrl) {
    return (
      <Span>
        {importedFrom.creatorName
          ? t("post.result.cardCredit", { creator: importedFrom.creatorName })
          : t("post.result.cardCreditUnknown")}
      </Span>
    );
  }
  return (
    <Link
      href={importedFrom.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
    >
      {importedFrom.creatorName
        ? t("post.result.credit", {
            creator: importedFrom.creatorName,
            platform,
          })
        : t("post.result.creditUnknown", { platform })}
      <ExternalLinkIcon className="size-3" />
    </Link>
  );
}

/** One line: "By X · Originally by Y on Z". Nothing for built-in skills. */
export function Attribution({
  view,
  className,
}: {
  view: LandingView;
  className?: string;
}): JSX.Element | null {
  const { skill, t, locale } = view;
  const creator = skill.creatorProfile;
  if (!creator && !skill.importedFrom) {
    return null;
  }
  return (
    <Div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {creator && (
        <Link
          className="font-medium text-foreground hover:underline"
          href={`/${locale}/creator/${creator.creatorSlug}`}
        >
          {t(skill.importedFrom ? "publishedBy" : "madeBy", {
            name: creator.publicName,
          })}
        </Link>
      )}
      {skill.importedFrom && (
        <ImportedCredit importedFrom={skill.importedFrom} locale={locale} />
      )}
    </Div>
  );
}

export function Description({
  view,
  part,
  className,
}: {
  view: LandingView;
  /** First paragraph, the remaining ones, or everything. */
  part: "summary" | "more" | "all";
  className?: string;
}): JSX.Element | null {
  const text =
    part === "summary"
      ? view.summary
      : part === "more"
        ? (view.more ?? "")
        : [view.summary, view.more].filter(Boolean).join("\n\n");
  if (!text) {
    return null;
  }
  return (
    <P
      className={cn(
        "m-0 whitespace-pre-line leading-relaxed text-pretty text-muted-foreground",
        className,
      )}
    >
      {text}
    </P>
  );
}

export function RelatedList({
  title,
  skills,
  view,
  columns = 3,
  headingClassName,
}: {
  title: string;
  skills: RelatedSkill[];
  view: LandingView;
  columns?: 1 | 2 | 3;
  headingClassName?: string;
}): JSX.Element | null {
  if (!skills.length) {
    return null;
  }
  const { locale, refCode } = view;
  return (
    <Div className="flex flex-col gap-4">
      <H2
        className={cn(
          "m-0 border-none pb-0 text-xl font-semibold tracking-tight text-balance",
          headingClassName,
        )}
      >
        {title}
      </H2>
      <Div
        className={cn(
          "grid gap-3",
          columns >= 2 && "sm:grid-cols-2",
          columns === 3 && "lg:grid-cols-3",
        )}
      >
        {skills.map((skill) => (
          <Link
            key={skill.id}
            href={`/${locale}/skill/${encodeURIComponent(skill.id)}${refCode ? `?ref=${encodeURIComponent(refCode)}` : ""}`}
            className={rowLink}
          >
            <Span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              {skill.icon ? (
                <Icon icon={skill.icon} className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </Span>
            <Span className="min-w-0 flex-1">
              <Span className="block">{skill.name}</Span>
              {skill.tagline && (
                <Span className="block text-sm font-normal text-muted-foreground">
                  {skill.tagline}
                </Span>
              )}
            </Span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </Div>
    </Div>
  );
}

/** "Good at" / "Keep in mind" of the active version as a short checklist. */
export function ExpectList({
  view,
  className,
}: {
  view: LandingView;
  className?: string;
}): JSX.Element | null {
  const { active, t } = view;
  if (!active?.strength && !active?.weakness) {
    return null;
  }
  return (
    <Div className={cn("flex flex-col gap-2 text-sm", className)}>
      {active.strength && (
        <Div className="flex gap-2.5">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
          <Span>
            <Span className="text-muted-foreground">
              {`${t("facts.goodAt")}: `}
            </Span>
            <Span className="font-medium text-foreground">
              {active.strength}
            </Span>
          </Span>
        </Div>
      )}
      {active.weakness && (
        <Div className="flex gap-2.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <Span>
            <Span className="text-muted-foreground">
              {`${t("facts.keepInMind")}: `}
            </Span>
            <Span className="font-medium text-foreground">
              {active.weakness}
            </Span>
          </Span>
        </Div>
      )}
    </Div>
  );
}

/** Similar skills plus, for community skills, more from the same creator. */
export function RelatedSections({
  view,
  columns,
  headingClassName,
}: {
  view: LandingView;
  columns: 1 | 2 | 3;
  headingClassName?: string;
}): JSX.Element | null {
  const creator = view.skill.creatorProfile;
  if (!view.relatedSkills.length && !(creator && view.creatorSkills.length)) {
    return null;
  }
  return (
    <>
      <RelatedList
        title={view.t("related.similar")}
        skills={view.relatedSkills}
        view={view}
        columns={columns}
        headingClassName={headingClassName}
      />
      {creator && (
        <RelatedList
          title={view.t("related.moreFrom", { name: creator.publicName })}
          skills={view.creatorSkills}
          view={view}
          columns={columns}
          headingClassName={headingClassName}
        />
      )}
    </>
  );
}

/**
 * Lifecycle emails - one component for every journey step.
 *
 * Rendered in the regular branded transactional template (EmailTemplate: logo
 * header, footer, sender identification) like every other platform mail.
 * Body: greeting, a short intro, an optional list (prompts, what changed), one
 * paragraph, ONE primary call to action (secondaryCta is there for steps that
 * need a second), sign-off, optional P.S.; the opt-out line depends on the
 * mail type (see footerKind).
 *
 * Every number comes from config at render time: free-credit tiers
 * (products/constants), prices (getPricingParams, per locale/currency), model
 * counts (live model catalog), models added since the user's last chat (model
 * changelog filtered to models still offered), referral rate (referral/config).
 * Copy is translated at send time in the recipient's locale.
 */

import "server-only";

import { render } from "@react-email/render";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatModelCountsByContentLevel,
  getCurrentChatModelIds,
} from "next-vibe/agent/models/all-models";
import type { ModelChangelogContent } from "next-vibe/agent/models/model-changelog/types";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { JSX } from "react";
import React from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { FEEDBACK_REWARD_CREDITS } from "@/credits/constants";
import { configScopedTranslation } from "@/env/i18n";
import { MODEL_CHANGELOG_EVENTS } from "@/generated/model-changelog";
import { HumanCTAButton } from "@/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/messenger/providers/email/smtp-client/components/human_text.email";
import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import type { TrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { getPricingParams } from "@/products/repository-client";
import { REFERRAL_CONFIG } from "@/referral/config";

import type { LifecycleTemplateValue } from "./enum";
import { LifecycleTemplate } from "./enum";
import type { LifecycleT } from "./i18n";
import { scopedTranslation } from "./i18n";
import { NEW_MODELS_LISTED, WHATS_NEW_AFTER_DAYS } from "./journeys";

/** Where each CTA points (path after /{locale}). */
const PATH = {
  chat: "/threads",
  skills: "/skills",
  buy: "/subscription/buy",
  account: "/subscription/overview",
  signup: "/user/signup",
} as const;

const DAY_MS = 86_400_000;

/** Live model counts. Passed in as props so the preview tool can render them too. */
export interface LifecycleModelCounts {
  modelCount: number;
  mainstreamCount: number;
  openCount: number;
  uncensoredCount: number;
}

export async function loadModelCounts(): Promise<LifecycleModelCounts> {
  const availability = await getEnvAvailability();
  const byLevel = getAvailableChatModelCountsByContentLevel(
    false,
    availability,
  );
  return {
    modelCount: getAvailableChatModelCount(false, availability),
    mainstreamCount: byLevel.mainstream,
    openCount: byLevel.open,
    uncensoredCount: byLevel.uncensored,
  };
}

/** A chat model added after the user's last visit and still offered today. */
export interface NewChatModel {
  name: string;
  content: ModelChangelogContent;
}

/** Ids of the chat models users can pick right now (legacy excluded). */
export async function loadCurrentChatModelIds(): Promise<Set<string>> {
  return getCurrentChatModelIds(false, await getEnvAvailability());
}

/**
 * Chat models that landed after `since` (calendar day, UTC) and are still
 * offered, newest first, one entry per model. `currentIds` null = no
 * availability filter (email previews).
 */
export function newChatModelsSince(
  since: Date,
  currentIds: ReadonlySet<string> | null,
): NewChatModel[] {
  const sinceDay = since.toISOString().slice(0, 10);
  const seen = new Set<string>();
  const out: NewChatModel[] = [];
  for (const event of MODEL_CHANGELOG_EVENTS) {
    if (
      event.type !== "added" ||
      event.modelType !== "text" ||
      event.date <= sinceDay ||
      seen.has(event.modelId) ||
      (currentIds !== null && !currentIds.has(event.modelId))
    ) {
      continue;
    }
    seen.add(event.modelId);
    out.push({ name: event.name, content: event.content });
  }
  return out;
}

/** "December 1" / "1. Dezember" / "1er décembre": day + month in the reader's language (UTC). */
export function formatDayMonth(date: Date, locale: CountryLanguage): string {
  const language = getLanguageFromLocale(locale);
  if (date.getUTCDate() === 1 && (language === "fr" || language === "it")) {
    // French and Italian write the first day of a month as an ordinal.
    const month = new Intl.DateTimeFormat(language, {
      month: "long",
      timeZone: "UTC",
    }).format(date);
    return language === "fr" ? `1er ${month}` : `1° ${month}`;
  }
  return new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

/** First day of next month (UTC), the free-credit refill date, in the reader's language. */
export function formatFreeCreditResetDate(
  now: Date,
  locale: CountryLanguage,
): string {
  return formatDayMonth(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
    locale,
  );
}

/** Per-recipient facts the copy needs beyond the global params. */
export interface LifecycleCopyContext {
  /** Models added since the last chat (WHATS_NEW / WIN_BACK). */
  newModels: readonly NewChatModel[];
  /** Localized free-credit refill date (OUT_OF_CREDITS). */
  resetDate: string;
  /** May get a plain plans link (marketing consent or confirmed newsletter). */
  marketingOk: boolean;
  /** Localized end of the payment grace period (PAYMENT_FAILED). */
  graceDate: string;
}

type CopyParams = Record<string, string | number>;

function copyParams(
  locale: CountryLanguage,
  counts: LifecycleModelCounts,
): CopyParams {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return {
    ...getPricingParams(locale),
    freeCreditsGuest: FREE_CREDIT_ALLOWANCE.guest,
    freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
    freeCreditsNewsletterBonus: FREE_CREDIT_ALLOWANCE.newsletterBonus,
    freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
    referralPercent: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
    feedbackCredits: FEEDBACK_REWARD_CREDITS,
    appName: configT("appName"),
    ...counts,
  };
}

interface CopyItem {
  title: string;
  body: string;
}

interface CopyCta {
  text: string;
  /** App path after /{locale}, or an absolute mailto: link. */
  path: string;
}

/** Full link for a CTA: app paths get the locale prefix, mailto stays as is. */
function ctaHref(path: string, locale: CountryLanguage, baseUrl = ""): string {
  return path.startsWith("mailto:") ? path : `${baseUrl}/${locale}${path}`;
}

export interface LifecycleCopy {
  subject: string;
  preview: string;
  intro: string;
  items: CopyItem[];
  body: string;
  cta: CopyCta;
  secondaryCta: CopyCta | null;
  ps: string | null;
}

function tierLabel(t: LifecycleT, content: ModelChangelogContent): string {
  switch (content) {
    case "mainstream":
      return t("emails.tier.mainstream");
    case "open":
      return t("emails.tier.open");
    case "uncensored":
      return t("emails.tier.uncensored");
  }
}

/** List up to NEW_MODELS_LISTED; never leave "plus 1 more", list that one too. */
function listedModelCount(total: number): number {
  return total <= NEW_MODELS_LISTED + 1 ? total : NEW_MODELS_LISTED;
}

function newModelItems(
  t: LifecycleT,
  models: readonly NewChatModel[],
): CopyItem[] {
  return models.slice(0, listedModelCount(models.length)).map((model) => ({
    title: model.name,
    body: tierLabel(t, model.content),
  }));
}

/** "new model" / "new models" in the reader's plural form (pl has few/many). */
function newModelsPhrase(
  t: LifecycleT,
  locale: CountryLanguage,
  count: number,
): string {
  switch (new Intl.PluralRules(getLanguageFromLocale(locale)).select(count)) {
    case "one":
      return t("emails.newModels.one");
    case "few":
      return t("emails.newModels.few");
    case "many":
      return t("emails.newModels.many");
    default:
      return t("emails.newModels.other");
  }
}

/**
 * "P.S. Since your last visit we added 38 new models, including A, B and C."
 * Lists every model when there are at most NEW_MODELS_LISTED. Null when nothing new.
 */
function newsPs(
  t: LifecycleT,
  locale: CountryLanguage,
  block: "winBack" | "lapsedWinback",
  models: readonly NewChatModel[],
  p: CopyParams,
): string | null {
  if (models.length === 0) {
    return null;
  }
  const names = new Intl.ListFormat(getLanguageFromLocale(locale), {
    type: "conjunction",
  }).format(models.slice(0, NEW_MODELS_LISTED).map((m) => m.name));
  const params = { ...p, modelList: names };
  const more = models.length > NEW_MODELS_LISTED;
  if (block === "winBack") {
    return more
      ? t("emails.winBack.newsPs", params)
      : t("emails.winBack.newsPsAll", params);
  }
  return more
    ? t("emails.lapsedWinback.newsPs", params)
    : t("emails.lapsedWinback.newsPsAll", params);
}

function buildCopy(
  t: LifecycleT,
  locale: CountryLanguage,
  template: typeof LifecycleTemplateValue,
  base: CopyParams,
  ctx: LifecycleCopyContext,
): LifecycleCopy {
  const p: CopyParams = {
    ...base,
    resetDate: ctx.resetDate,
    graceDate: ctx.graceDate,
    newModelCount: ctx.newModels.length,
    newModelName: ctx.newModels[0]?.name ?? "",
    newModelsPhrase: newModelsPhrase(t, locale, ctx.newModels.length),
  };
  // Feedback asks: the CTA opens a reply to support (replies earn feedback
  // credits by hand, exactly as the email footer promises).
  const feedbackCta = (text: string): CopyCta => ({
    text,
    path: `mailto:${contactClientRepository.getSupportEmail(locale)}`,
  });
  switch (template) {
    case LifecycleTemplate.FIRST_CHAT_PROMPTS:
      return {
        subject: t("emails.firstChatPrompts.subject", p),
        preview: t("emails.firstChatPrompts.preview", p),
        intro: t("emails.firstChatPrompts.intro", p),
        items: [
          {
            title: t("emails.firstChatPrompts.uncensoredTitle", p),
            body: t("emails.firstChatPrompts.uncensoredPrompt", p),
          },
          {
            title: t("emails.firstChatPrompts.mainstreamTitle", p),
            body: t("emails.firstChatPrompts.mainstreamPrompt", p),
          },
          {
            title: t("emails.firstChatPrompts.mediaTitle", p),
            body: t("emails.firstChatPrompts.mediaPrompt", p),
          },
        ],
        body: t("emails.firstChatPrompts.body", p),
        cta: { text: t("emails.firstChatPrompts.cta", p), path: PATH.chat },
        secondaryCta: null,
        ps: t("emails.firstChatPrompts.ps", p),
      };
    case LifecycleTemplate.FIRST_CHAT_SKILLS:
      return {
        subject: t("emails.firstChatSkills.subject", p),
        preview: t("emails.firstChatSkills.preview", p),
        intro: t("emails.firstChatSkills.intro", p),
        items: [
          {
            title: t("emails.firstChatSkills.characterTitle", p),
            body: t("emails.firstChatSkills.characterBody", p),
          },
          {
            title: t("emails.firstChatSkills.specialistTitle", p),
            body: t("emails.firstChatSkills.specialistBody", p),
          },
        ],
        body: t("emails.firstChatSkills.body", p),
        cta: { text: t("emails.firstChatSkills.cta", p), path: PATH.skills },
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.OUT_OF_CREDITS:
      // Account notice, not a sales email: when credits come back, and the
      // credits page that already shows every option. Plans only as a plain
      // link, and only for people who opted into marketing.
      return {
        subject: t("emails.outOfCredits.subject", p),
        preview: t("emails.outOfCredits.preview", p),
        intro: t("emails.outOfCredits.intro", p),
        items: [],
        body: "",
        cta: { text: t("emails.outOfCredits.cta", p), path: PATH.account },
        secondaryCta: ctx.marketingOk
          ? { text: t("emails.outOfCredits.plansLink", p), path: PATH.buy }
          : null,
        ps: null,
      };
    case LifecycleTemplate.PAYMENT_FAILED:
      return {
        subject: t("emails.paymentFailed.subject", p),
        preview: t("emails.paymentFailed.preview", p),
        intro: t("emails.paymentFailed.intro", p),
        items: [],
        body: t("emails.paymentFailed.body", p),
        cta: { text: t("emails.paymentFailed.cta", p), path: PATH.account },
        secondaryCta: null,
        ps: t("emails.paymentFailed.ps", p),
      };
    case LifecycleTemplate.CUSTOMER_LIKES:
      return {
        subject: t("emails.customerLikes.subject", p),
        preview: t("emails.customerLikes.preview", p),
        intro: t("emails.customerLikes.intro", p),
        items: [
          {
            title: t("emails.customerLikes.likeTitle", p),
            body: t("emails.customerLikes.likeBody", p),
          },
          {
            title: t("emails.customerLikes.missingTitle", p),
            body: t("emails.customerLikes.missingBody", p),
          },
        ],
        body: t("emails.customerLikes.body", p),
        cta: feedbackCta(t("emails.customerLikes.cta", p)),
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.CUSTOMER_BUILD_NEXT:
      return {
        subject: t("emails.customerBuildNext.subject", p),
        preview: t("emails.customerBuildNext.preview", p),
        intro: t("emails.customerBuildNext.intro", p),
        items: [],
        body: t("emails.customerBuildNext.body", p),
        cta: feedbackCta(t("emails.customerBuildNext.cta", p)),
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.LAPSED_WINBACK:
      return {
        subject: t("emails.lapsedWinback.subject", p),
        preview: t("emails.lapsedWinback.preview", p),
        intro: t("emails.lapsedWinback.intro", p),
        items: [],
        body: t("emails.lapsedWinback.body", p),
        cta: feedbackCta(t("emails.lapsedWinback.cta", p)),
        secondaryCta: null,
        ps: newsPs(t, locale, "lapsedWinback", ctx.newModels, p),
      };
    case LifecycleTemplate.WHATS_NEW:
      if (ctx.newModels.length === 0) {
        return {
          subject: t("emails.whatsNewQuiet.subject", p),
          preview: t("emails.whatsNewQuiet.preview", p),
          intro: t("emails.whatsNewQuiet.intro", p),
          items: [
            {
              title: t("emails.whatsNewQuiet.compareTitle", p),
              body: t("emails.whatsNewQuiet.compareBody", p),
            },
          ],
          body: t("emails.whatsNewQuiet.body", p),
          cta: { text: t("emails.whatsNewQuiet.cta", p), path: PATH.chat },
          secondaryCta: null,
          ps: null,
        };
      }
      return {
        subject:
          ctx.newModels.length === 1
            ? t("emails.whatsNew.subjectOne", p)
            : t("emails.whatsNew.subject", p),
        preview: t("emails.whatsNew.preview", p),
        intro:
          ctx.newModels.length === 1
            ? t("emails.whatsNew.introOne", p)
            : ctx.newModels.length > listedModelCount(ctx.newModels.length)
              ? t("emails.whatsNew.intro", p)
              : t("emails.whatsNew.introAll", p),
        items: newModelItems(t, ctx.newModels),
        body:
          ctx.newModels.length > listedModelCount(ctx.newModels.length)
            ? t("emails.whatsNew.bodyMore", {
                ...p,
                moreCount:
                  ctx.newModels.length - listedModelCount(ctx.newModels.length),
              })
            : t("emails.whatsNew.body", p),
        cta: { text: t("emails.whatsNew.cta", p), path: PATH.chat },
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.WIN_BACK:
      return {
        subject: t("emails.winBack.subject", p),
        preview: t("emails.winBack.preview", p),
        intro: t("emails.winBack.intro", p),
        items: [],
        body: t("emails.winBack.body", p),
        cta: feedbackCta(t("emails.winBack.cta", p)),
        secondaryCta: null,
        ps: newsPs(t, locale, "winBack", ctx.newModels, p),
      };
    case LifecycleTemplate.INVITE_SIGNUP:
      return {
        subject: t("emails.inviteSignup.subject", p),
        preview: t("emails.inviteSignup.preview", p),
        intro: t("emails.inviteSignup.intro", p),
        items: [
          {
            title: t("emails.inviteSignup.guestTitle", p),
            body: t("emails.inviteSignup.guestBody", p),
          },
          {
            title: t("emails.inviteSignup.accountTitle", p),
            body: t("emails.inviteSignup.accountBody", p),
          },
          {
            title: t("emails.inviteSignup.newsletterTitle", p),
            body: t("emails.inviteSignup.newsletterBody", p),
          },
        ],
        body: t("emails.inviteSignup.body", p),
        cta: { text: t("emails.inviteSignup.cta", p), path: PATH.signup },
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.INVITE_REMINDER:
      return {
        subject: t("emails.inviteReminder.subject", p),
        preview: t("emails.inviteReminder.preview", p),
        intro: t("emails.inviteReminder.intro", p),
        items: [],
        body: t("emails.inviteReminder.body", p),
        cta: { text: t("emails.inviteReminder.cta", p), path: PATH.signup },
        secondaryCta: null,
        ps: t("emails.inviteReminder.ps", p),
      };
  }
}

export function getLifecycleCopy(
  template: typeof LifecycleTemplateValue,
  locale: CountryLanguage,
  counts: LifecycleModelCounts,
  ctx: LifecycleCopyContext,
): LifecycleCopy {
  const { t } = scopedTranslation.scopedT(locale);
  return buildCopy(t, locale, template, copyParams(locale, counts), ctx);
}

/** Context for a send: models added since the last chat, refill date. */
export function buildCopyContext(opts: {
  locale: CountryLanguage;
  now: Date;
  lastActiveAt: Date | null;
  currentIds: ReadonlySet<string> | null;
  marketingOk: boolean;
  graceEndsAt?: Date | null;
}): LifecycleCopyContext {
  const since =
    opts.lastActiveAt ??
    new Date(opts.now.getTime() - WHATS_NEW_AFTER_DAYS * DAY_MS);
  return {
    newModels: newChatModelsSince(since, opts.currentIds),
    resetDate: formatFreeCreditResetDate(opts.now, opts.locale),
    marketingOk: opts.marketingOk,
    graceDate: opts.graceEndsAt
      ? formatDayMonth(opts.graceEndsAt, opts.locale)
      : "",
  };
}

export function buildUnsubscribeUrl(
  baseUrl: string,
  locale: CountryLanguage,
  email: string,
  leadId: string | null,
): string {
  const query = leadId ? `?id=${encodeURIComponent(leadId)}` : "";
  return `${baseUrl}/${locale}/story/newsletter/unsubscribe/${encodeURIComponent(email)}${query}`;
}

const itemTitleStyle = {
  fontSize: "16px",
  color: "#111827",
  fontWeight: "bold" as const,
  margin: "0 0 4px 0",
};
const itemBodyStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0",
  lineHeight: "1.6",
};
/** Inherit the signature block's look; one line per element, no gap. */
const signatureLineStyle = {
  margin: "0",
  fontSize: "inherit",
  lineHeight: "inherit",
  color: "inherit",
};
const itemStyle = {
  borderLeft: "3px solid #e5e7eb",
  padding: "2px 0 2px 14px",
  margin: "0 0 16px 0",
};

export interface LifecycleEmailProps {
  template: typeof LifecycleTemplateValue;
  locale: CountryLanguage;
  recipientEmail: string;
  leadId: string | null;
  name: string | null;
  counts: LifecycleModelCounts;
  context: LifecycleCopyContext;
  tracking: TrackingContext;
}

/** The whole email body. Shared by the sender and the email preview registry (email.tsx). */
type FooterKind = "account" | "marketing" | "billing";

/**
 * Footer per mail type: account mails (help, check-ins) say why the user gets
 * them and offer "stop these emails"; marketing mails keep the newsletter
 * unsubscribe line; billing notices carry no opt-out (they are not optional).
 */
function footerKind(template: typeof LifecycleTemplateValue): FooterKind {
  switch (template) {
    case LifecycleTemplate.PAYMENT_FAILED:
      return "billing";
    case LifecycleTemplate.FIRST_CHAT_PROMPTS:
    case LifecycleTemplate.FIRST_CHAT_SKILLS:
    case LifecycleTemplate.OUT_OF_CREDITS:
    case LifecycleTemplate.CUSTOMER_LIKES:
    case LifecycleTemplate.CUSTOMER_BUILD_NEXT:
      return "account";
    case LifecycleTemplate.WHATS_NEW:
    case LifecycleTemplate.WIN_BACK:
    case LifecycleTemplate.LAPSED_WINBACK:
    case LifecycleTemplate.INVITE_SIGNUP:
    case LifecycleTemplate.INVITE_REMINDER:
      return "marketing";
  }
}

export function LifecycleEmail({
  template,
  locale,
  recipientEmail,
  leadId,
  name,
  counts,
  context,
  tracking,
}: LifecycleEmailProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const copy = getLifecycleCopy(template, locale, counts, context);
  const unsubscribeUrl = buildUnsubscribeUrl(
    tracking.baseUrl,
    locale,
    recipientEmail,
    leadId,
  );
  const footer = footerKind(template);
  return (
    <EmailTemplate
      title={copy.subject}
      previewText={copy.preview}
      locale={locale}
      recipientEmail={recipientEmail}
      tracking={tracking}
      optOut={{
        unsubscribeUrl: footer === "billing" ? null : unsubscribeUrl,
        text:
          footer === "billing"
            ? t("emails.footerBilling")
            : footer === "account"
              ? t("emails.footerAccount")
              : undefined,
        linkText:
          footer === "account" ? t("emails.footerAccountLink") : undefined,
      }}
    >
      <HumanText variant="greeting">
        {name ? t("emails.greetingNamed", { name }) : t("emails.greeting")}
      </HumanText>
      <HumanText variant="body">{copy.intro}</HumanText>
      {copy.items.map((item) => (
        <Section key={item.title} style={itemStyle}>
          <Text style={itemTitleStyle}>{item.title}</Text>
          <Text style={itemBodyStyle}>{item.body}</Text>
        </Section>
      ))}
      {copy.body && <HumanText variant="body">{copy.body}</HumanText>}
      <HumanCTAButton
        href={ctaHref(copy.cta.path, locale)}
        text={copy.cta.text}
        variant="brand"
        tracking={tracking}
      />
      {copy.secondaryCta && (
        <HumanCTAButton
          href={ctaHref(copy.secondaryCta.path, locale)}
          text={copy.secondaryCta.text}
          variant="secondary"
          align="center"
          tracking={tracking}
        />
      )}
      <HumanText variant="signature">
        <Text style={signatureLineStyle}>{t("emails.signoff")}</Text>
      </HumanText>
      {copy.ps && <HumanText variant="ps">{copy.ps}</HumanText>}
    </EmailTemplate>
  );
}

export interface RenderLifecycleEmailInput {
  template: typeof LifecycleTemplateValue;
  locale: CountryLanguage;
  email: string;
  leadId: string | null;
  userId: string | null;
  name: string | null;
  baseUrl: string;
  /** Latest chat activity: models added after it are listed. */
  lastActiveAt: Date | null;
  /** Marketing consent or confirmed newsletter: may get a plain plans link. */
  marketingOk: boolean;
  /** PAYMENT_FAILED: end of the grace period. */
  graceEndsAt?: Date | null;
  now: Date;
  /** Optional: reuse counts across a run. Loaded live when absent. */
  counts?: LifecycleModelCounts;
}

export interface RenderedLifecycleEmail {
  subject: string;
  html: string;
  text: string;
  /** null for billing notices: no opt-out link or List-Unsubscribe header. */
  unsubscribeUrl: string | null;
  ctaUrl: string;
  senderName: string;
}

export async function renderLifecycleEmail(
  input: RenderLifecycleEmailInput,
): Promise<RenderedLifecycleEmail> {
  const { t } = scopedTranslation.scopedT(input.locale);
  const counts = input.counts ?? (await loadModelCounts());
  const context = buildCopyContext({
    locale: input.locale,
    now: input.now,
    lastActiveAt: input.lastActiveAt,
    currentIds: await loadCurrentChatModelIds(),
    marketingOk: input.marketingOk,
    graceEndsAt: input.graceEndsAt ?? null,
  });
  const copy = getLifecycleCopy(input.template, input.locale, counts, context);
  const tracking = createTrackingContext(
    input.locale,
    input.leadId ?? undefined,
    input.userId ?? undefined,
    undefined,
    input.baseUrl,
  );
  const unsubscribeUrl = buildUnsubscribeUrl(
    input.baseUrl,
    input.locale,
    input.email,
    input.leadId,
  );
  const ctaUrl = ctaHref(copy.cta.path, input.locale, input.baseUrl);

  const html = await render(
    <LifecycleEmail
      template={input.template}
      locale={input.locale}
      recipientEmail={input.email}
      leadId={input.leadId}
      name={input.name}
      counts={counts}
      context={context}
      tracking={tracking}
    />,
  );

  const greeting = input.name
    ? t("emails.greetingNamed", { name: input.name })
    : t("emails.greeting");
  const text = [
    greeting,
    copy.intro,
    ...copy.items.map((item) => `${item.title}\n${item.body}`),
    ...(copy.body ? [copy.body] : []),
    t("emails.ctaLine", { text: copy.cta.text, url: ctaUrl }),
    ...(copy.secondaryCta
      ? [
          t("emails.ctaLine", {
            text: copy.secondaryCta.text,
            url: ctaHref(copy.secondaryCta.path, input.locale, input.baseUrl),
          }),
        ]
      : []),
    t("emails.signoff"),
    ...(copy.ps ? [copy.ps] : []),
    footerKind(input.template) === "billing"
      ? t("emails.footerBilling")
      : footerKind(input.template) === "account"
        ? `${t("emails.footerAccount")} ${t("emails.footerAccountLink")}: ${unsubscribeUrl}`
        : `${t("emails.unsubscribeText")} ${unsubscribeUrl}`,
  ].join("\n\n");

  return {
    subject: copy.subject,
    html,
    text,
    unsubscribeUrl:
      footerKind(input.template) === "billing" ? null : unsubscribeUrl,
    ctaUrl,
    senderName: t("emails.senderName"),
  };
}

/**
 * Server half of the skill landing page: metadata + loader data.
 * Kept out of page.tsx so the client bundle (which strips only the exported
 * loader/metadata functions there) never pulls repositories in.
 */

import "server-only";

import type { Metadata } from "next";
import {
  DEFAULT_CHAT_MODEL_ID,
  DEFAULT_CHAT_MODEL_SELECTION,
} from "next-vibe/agent/ai-stream/constants";
import {
  chatModelDefinitions,
  getBestChatModel,
  getChatModelForUser,
} from "next-vibe/agent/ai-stream/models";
import {
  formatSkillId,
  isSkillVariantId,
  parseSkillId,
} from "next-vibe/agent/chat/slugify";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import { DEFAULT_SKILLS } from "next-vibe/agent/skills/config";
import { SkillCategory, SkillOwnershipType } from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { hreflangFor } from "next-vibe/core/i18n/core/seo-locales";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { Environment } from "next-vibe/env/env-util";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";
import { notFound } from "next-vibe/ui/lib/not-found";
import { permanentRedirect } from "next-vibe/ui/lib/redirect";
import { cache } from "react";

import {
  buildBreadcrumbList,
  organizationId,
  pageUrl,
  websiteId,
} from "@/_pages/_components/structured-data";
import { configScopedTranslation } from "@/env/i18n";
import { linkDeepLinkAttribution } from "@/referral/deep-link-attribution";

import { toModelSlug } from "../../models/_shared/model-facts";
import {
  type SiteLayoutData,
  tanstackLoader as siteLayoutLoader,
} from "../../story/layout";
import { scopedTranslation } from "./i18n";
import { getSkillMessagePrice } from "./message-price";
import type {
  LeadMagnetConfigData,
  RelatedSkill,
  ResolvedSkillModels,
  ResolvedVariantInfo,
} from "./page-client";
export interface SkillPageProps {
  params: Promise<{ locale: CountryLanguage; skillId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REF_RE = /^[\w-]{1,64}$/;

const MAX_RELATED = 6;
const MAX_PROMPTS = 4;

/** Ensure copy pulled from skill data ends like a sentence. */
function asSentence(text: string): string {
  const trimmed = text.trim();
  return !trimmed || /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

async function getVisitor(
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<JwtPayloadType | null> {
  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );
  return userResponse.success ? userResponse.data : null;
}

async function indexableSkillPageId(
  baseSkillId: string,
  skill: SkillGetResponseOutput,
  logger: EndpointLogger,
): Promise<string | null> {
  if (skill.skillOwnership === SkillOwnershipType.SYSTEM) {
    return SkillsRepository.listPublicDefaultSkillIds().includes(baseSkillId)
      ? baseSkillId
      : null;
  }
  return SkillsRepository.resolvePublishedCommunitySkillPageId(
    baseSkillId,
    logger,
  );
}

interface LandingSkill {
  user: JwtPayloadType;
  skill: SkillGetResponseOutput;
  baseSkillId: string;
  variantId: string | null;
  indexableId: string | null;
}

// Share the visitor-scoped lookup between Next metadata and the page render.
const resolveLandingSkill = cache(async function resolveLandingSkill(
  skillId: string,
  locale: CountryLanguage,
): Promise<LandingSkill> {
  const { skillId: baseSkillId, variantId } = parseSkillId(skillId);
  if (!baseSkillId || (variantId === null && isSkillVariantId(skillId))) {
    notFound();
  }
  const logger = createEndpointLogger(false, locale);
  const user = await getVisitor(locale, logger);
  if (!user) {
    logger.error("Failed to get identity on skill page");
    return Promise.reject(new Error("Failed to get identity on skill page"));
  }
  const result = await SkillsRepository.getSkillById(
    { id: baseSkillId },
    user,
    logger,
    locale,
  );
  if (
    !result.success &&
    result.errorType === ErrorResponseTypes.INTERNAL_ERROR
  ) {
    return Promise.reject(new Error("Failed to load skill landing page"));
  }
  if (
    !result.success ||
    !result.data.name?.trim() ||
    (variantId !== null &&
      !result.data.variants?.some((v) => v.id === variantId))
  ) {
    notFound();
  }
  const skill = result.data;
  return {
    user,
    skill,
    baseSkillId,
    variantId,
    indexableId: await indexableSkillPageId(baseSkillId, skill, logger),
  };
});

export async function loadSkillPageMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { locale, skillId } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const { skill, baseSkillId, variantId, indexableId } =
    await resolveLandingSkill(skillId, locale);
  const { name, tagline, description } = skill;
  const displayName = name ?? "";

  const summary = asSentence(description || tagline || displayName);
  const taglineSentence = asSentence(tagline ?? "");
  const combined = `${summary} ${taglineSentence}`.trim();
  const metaDescription =
    summary.length < 120 &&
    taglineSentence &&
    !summary.toLowerCase().includes(taglineSentence.toLowerCase()) &&
    combined.length <= 160
      ? combined
      : summary;
  return metadataGenerator(locale, {
    path: `skill/${encodeURIComponent(indexableId ?? baseSkillId)}`,
    title: tagline
      ? t("meta.title", { appName, name: displayName, tagline })
      : t("meta.titlePlain", { appName, name: displayName }),
    category: t("meta.category"),
    description: metaDescription || t("hero.tryGeneric"),
    image: `${configT("websiteUrl").replace(/\/+$/, "")}/og-image.jpg`,
    imageAlt: appName,
    keywords: [t("meta.keywords", { appName, name: displayName })],
    generateAlternates: indexableId !== null && variantId === null,
    ...(indexableId === null
      ? {
          additionalMetadata: {
            alternates: null,
            robots: {
              index: false,
              follow: true,
              googleBot: { index: false, follow: true },
            },
          },
        }
      : {}),
  });
}

export interface SkillLandingPageData {
  locale: CountryLanguage;
  /** Skill id exactly as in the page URL (may carry `__variant`). */
  skillId: string;
  /** Base skill id without the variant suffix. */
  baseSkillId: string;
  user: JwtPayloadType;
  platform: Platform;
  /** Referral code carried into chat links (URL ?ref= or creator). */
  refCode: string | null;
  resolvedModels: ResolvedSkillModels;
  /** Variant the page is about: URL variant, else the skill default. */
  activeVariantId: string | null;
  leadMagnetConfig: LeadMagnetConfigData | null;
  skillData: SkillGetResponseOutput;
  examplePrompts: string[];
  categoryLabel: string | null;
  relatedSkills: RelatedSkill[];
  creatorSkills: RelatedSkill[];
  /** BreadcrumbList + WebPage JSON-LD. */
  structuredData: JsonLdNode | null;
  layout: Omit<SiteLayoutData, "children">;
}

/**
 * Hand-picked neighbours that may top a thin "similar skills" row up to 3
 * (a companion page may show roleplay skills, never controversial ones).
 */
const NEAR_SKILLS: Partial<Record<string, readonly string[]>> = {
  [SkillCategory.COMPANION]: [
    "roleplay-skill",
    "storyteller",
    "character-creator",
  ],
  [SkillCategory.ROLEPLAY]: ["character-creator", "storyteller", "thea"],
  [SkillCategory.CODING]: ["data-analyst", "researcher"],
  [SkillCategory.EDUCATION]: ["researcher", "scientist"],
  [SkillCategory.ASSISTANT]: ["researcher", "teacher"],
  [SkillCategory.WRITING]: ["writer", "editor", "storyteller"],
};

/** Too niche to suggest as "similar" (a German exam trainer). */
const NEVER_RELATED: readonly string[] = ["heilpraktiker-pruefung"];

/**
 * Built-in skills a guest can open that are actually similar: same category
 * first, then skills whose default version runs on the same chat model.
 * Unrelated skills are never used as padding; fewer cards is better.
 */
function builtInRelated(
  locale: CountryLanguage,
  excludeId: string,
  match: {
    category: string | null;
    chatModelId: string | null;
    user: JwtPayloadType;
    availability: Awaited<ReturnType<typeof getEnvAvailability>>;
  },
): RelatedSkill[] {
  const { t } = skillsScopedTranslation.scopedT(locale);
  const scored = DEFAULT_SKILLS.flatMap((s) => {
    const roles = s.userRole ?? [UserPermissionRole.PUBLIC];
    if (
      s.id === excludeId ||
      !roles.includes(UserPermissionRole.PUBLIC) ||
      s.category === SkillCategory.BACKGROUND ||
      NEVER_RELATED.includes(s.id)
    ) {
      return [];
    }
    const sameCategory =
      match.category !== null && s.category === match.category;
    let sameModel = false;
    // The platform default model runs half the catalogue: not a signal.
    if (match.chatModelId && match.chatModelId !== DEFAULT_CHAT_MODEL_ID) {
      const v = s.variants.find((x) => x.isDefault) ?? s.variants[0];
      const model = v
        ? getBestChatModel(
            v.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
            match.user,
            match.availability,
          )
        : null;
      sameModel = model?.id === match.chatModelId;
    }
    const nearCategory =
      match.category !== null &&
      (NEAR_SKILLS[match.category] ?? []).includes(s.id);
    const score =
      (sameCategory ? 3 : 0) + (nearCategory ? 1 : 0) + (sameModel ? 1 : 0);
    return score > 0 ? [{ s, score }] : [];
  });
  const ranked = scored.toSorted((a, b) => b.score - a.score);
  // Close matches fill the row; weak (near-category) ones only top it up to 3.
  const strong = ranked.filter((r) => r.score > 1);
  const picked = [
    ...strong,
    ...ranked
      .filter((r) => r.score <= 1)
      .slice(0, Math.max(0, 3 - strong.length)),
  ];
  return picked.slice(0, MAX_RELATED).map(({ s }) => ({
    id: s.id,
    name: t(s.name),
    tagline: t(s.tagline),
    icon: s.icon,
  }));
}

async function creatorRelated(
  skillInternalId: string,
  logger: EndpointLogger,
): Promise<RelatedSkill[]> {
  try {
    const { db } = await import("next-vibe/database");
    const { customSkills } = await import("next-vibe/agent/skills/db");
    const { SkillStatus } = await import("next-vibe/agent/skills/enum");
    const { and, eq, inArray, isNull, ne, notLike, or } =
      await import("drizzle-orm");
    const owner = db
      .select({ userId: customSkills.userId })
      .from(customSkills)
      .where(eq(customSkills.id, skillInternalId));
    const rows = await db
      .select({
        id: customSkills.id,
        slug: customSkills.slug,
        name: customSkills.name,
        tagline: customSkills.tagline,
        icon: customSkills.icon,
      })
      .from(customSkills)
      .where(
        and(
          inArray(customSkills.userId, owner),
          eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
          eq(customSkills.status, SkillStatus.PUBLISHED),
          eq(customSkills.isDeleted, false),
          ne(customSkills.id, skillInternalId),
          // Atlas seeds UI preview skills and the lead test suites create
          // short-lived public fixtures. Neither belongs in recommendations.
          coreEnv.NODE_ENV === Environment.DEVELOPMENT
            ? and(
                notLike(customSkills.name, "[TEST SKILL] %"),
                or(
                  isNull(customSkills.slug),
                  notLike(customSkills.slug, "e2e-lead-%"),
                ),
              )
            : undefined,
        ),
      )
      .limit(MAX_RELATED);
    return rows.map((r) => ({
      id: r.slug || r.id,
      name: r.name,
      tagline: r.tagline,
      icon: r.icon,
    }));
  } catch (error) {
    logger.warn("Skill page: loading creator's other skills failed", {
      error: parseError(error),
      page: "skill",
      skillInternalId,
    });
    return [];
  }
}

async function loadLeadMagnetConfig(
  baseSkillId: string,
  logger: EndpointLogger,
): Promise<LeadMagnetConfigData | null> {
  // creatorProfile is only populated for USER-owned skills, so look up the
  // owner directly to handle PUBLIC-owned community skills too.
  try {
    const { db } = await import("next-vibe/database");
    const { leadMagnetConfigs } = await import("@/lead-magnet/db");
    const { customSkills } = await import("next-vibe/agent/skills/db");
    const { eq, or } = await import("drizzle-orm");
    const [skillRow] = await db
      .select({ userId: customSkills.userId })
      .from(customSkills)
      .where(
        UUID_RE.test(baseSkillId)
          ? or(
              eq(customSkills.id, baseSkillId),
              eq(customSkills.slug, baseSkillId),
            )
          : eq(customSkills.slug, baseSkillId),
      )
      .limit(1);
    if (!skillRow) {
      return null;
    }
    const [cfg] = await db
      .select({
        headline: leadMagnetConfigs.headline,
        buttonText: leadMagnetConfigs.buttonText,
        isActive: leadMagnetConfigs.isActive,
      })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, skillRow.userId))
      .limit(1);
    return cfg?.isActive
      ? { headline: cfg.headline, buttonText: cfg.buttonText }
      : null;
  } catch (error) {
    logger.warn("Skill page: loading lead magnet config failed", {
      error: parseError(error),
      page: "skill",
      skillId: baseSkillId,
    });
    return null;
  }
}

export async function loadSkillLandingPage({
  params,
  searchParams,
}: SkillPageProps): Promise<SkillLandingPageData> {
  const { locale, skillId } = await params;
  const search = searchParams ? await searchParams : {};
  const logger = createEndpointLogger(false, locale);

  const { user, skill, baseSkillId, variantId, indexableId } =
    await resolveLandingSkill(skillId, locale);
  const canonicalSkillId = formatSkillId(indexableId ?? baseSkillId, variantId);
  if (canonicalSkillId !== skillId) {
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(search)) {
      if (typeof value === "string") {
        query.append(name, value);
      } else if (value) {
        for (const item of value) {
          query.append(name, item);
        }
      }
    }
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    permanentRedirect(
      `/${locale}/skill/${encodeURIComponent(canonicalSkillId)}${suffix}`,
    );
  }

  const [layout, availability] = await Promise.all([
    siteLayoutLoader({ params: Promise.resolve({ locale }) }),
    getEnvAvailability(),
  ]);
  const { ref: urlRef } = search;
  const refFromUrl =
    typeof urlRef === "string" && REF_RE.test(urlRef) ? urlRef : null;
  if (refFromUrl && user.leadId) {
    // Fire and forget: the helper logs its own failures.
    void linkDeepLinkAttribution({
      leadId: user.leadId,
      refCode: refFromUrl,
      skillId,
      locale,
      logger,
    });
  }

  // The system prompt never reaches the public page: loader data is
  // serialized into the HTML, and the landing page does not show it.
  const skillData = { ...skill, systemPrompt: null };

  // Per-variant model info, resolved server-side (keeps model registries
  // out of the client bundle).
  const variants: ResolvedVariantInfo[] = [];
  const chatModelIdByVariant = new Map<string, string>();
  for (const v of skillData.variants ?? []) {
    const selectedChatModel = getBestChatModel(
      v.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
      user,
      availability,
    );
    const chatModel = selectedChatModel
      ? getChatModelForUser(selectedChatModel.id, user, availability)
      : null;
    if (chatModel) {
      chatModelIdByVariant.set(v.id, chatModel.id);
    }
    variants.push({
      id: v.id,
      displayName: v.displayName ?? null,
      description: v.description ?? null,
      isDefault: v.isDefault ?? false,
      strength: v.strength ?? null,
      weakness: v.weakness ?? null,
      chatModelSlug:
        chatModel && chatModel.adminOnly !== true
          ? toModelSlug(chatModel.id)
          : null,
      chatModelContent: chatModel?.content ?? null,
      chatModelUncensoredMethod: chatModel
        ? (chatModelDefinitions[chatModel.id].uncensoredMethod ?? null)
        : null,
      // Registry names can carry stray whitespace ("Qwen3 235B ").
      chatModelName: chatModel?.name.trim() ?? null,
      chatMessagePrice: chatModel
        ? getSkillMessagePrice(chatModel, locale)
        : null,
    });
  }
  const activeVariant =
    (variantId ? variants.find((v) => v.id === variantId) : undefined) ??
    variants.find((v) => v.isDefault) ??
    variants[0] ??
    null;

  // Referral: URL ?ref= wins, else the creator's own code.
  const creator = skillData.creatorProfile;
  const refCode = refFromUrl ?? creator?.referralCode ?? null;
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const { t } = scopedTranslation.scopedT(locale);
  const isCommunity = skillData.skillOwnership !== SkillOwnershipType.SYSTEM;
  const defaultSkill = !isCommunity
    ? DEFAULT_SKILLS.find((candidate) => candidate.id === baseSkillId)
    : undefined;
  // Only publish the skill’s own conversation starters. Never generate replies for this page.
  const examplePrompts = (defaultSkill?.suggestedPrompts ?? [])
    .slice(0, MAX_PROMPTS)
    .map((key) => skillsT(key));

  const [leadMagnetConfig, creatorSkills] = await Promise.all([
    isCommunity && !creator?.leadMagnetActive
      ? loadLeadMagnetConfig(baseSkillId, logger)
      : Promise.resolve(null),
    creator && skillData.internalId
      ? creatorRelated(skillData.internalId, logger)
      : Promise.resolve([]),
  ]);

  return {
    locale,
    skillId,
    baseSkillId,
    user,
    platform: Platform.NEXT_PAGE,
    layout,
    refCode,
    resolvedModels: {
      variants: activeVariant
        ? [
            activeVariant,
            ...variants.filter((variant) => variant.id !== activeVariant.id),
          ]
        : variants,
    },
    activeVariantId: activeVariant?.id ?? null,
    leadMagnetConfig: creator?.leadMagnetActive
      ? {
          headline: creator.leadMagnetHeadline,
          buttonText: creator.leadMagnetButtonText,
        }
      : leadMagnetConfig,
    skillData,
    examplePrompts,
    categoryLabel: skillsT(skillData.category),
    relatedSkills: builtInRelated(locale, baseSkillId, {
      category: skillData.category,
      chatModelId: activeVariant
        ? (chatModelIdByVariant.get(activeVariant.id) ?? null)
        : null,
      user,
      availability,
    }),
    creatorSkills,
    structuredData:
      indexableId !== null && skillData.name
        ? buildStructuredData(locale, indexableId, skillData.name, {
            description: skillData.description ?? skillData.tagline ?? "",
            skillsLabel: t("breadcrumb.skills"),
          })
        : null,
  };
}

function buildStructuredData(
  locale: CountryLanguage,
  skillId: string,
  name: string,
  info: {
    description: string;
    skillsLabel: string;
  },
): JsonLdNode {
  const path = `/skill/${encodeURIComponent(skillId)}`;
  const url = pageUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbList(locale, [
        { name: info.skillsLabel, path: "/skills" },
        { name, path },
      ]),
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name,
        description: info.description,
        inLanguage: hreflangFor(locale),
        isPartOf: { "@id": websiteId(locale) },
        // A skill is a persona + prompt that runs on the platform, not an
        // installable app. CreativeWork, not SoftwareApplication: Google's
        // Software App rich result demands ratings we do not have.
        mainEntity: {
          "@type": "CreativeWork",
          "@id": `${url}#skill`,
          name,
          description: info.description,
          inLanguage: hreflangFor(locale),
          publisher: { "@id": organizationId(locale) },
        },
      },
    ],
  };
}

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
  ChatModelId,
  type ChatModelOption,
  getBestChatModel,
  getChatModelForUser,
} from "next-vibe/agent/ai-stream/models";
import {
  formatSkillId,
  isSkillVariantId,
  parseSkillId,
} from "next-vibe/agent/chat/slugify";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getBestImageGenModel } from "next-vibe/agent/image-generation/models";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { modelProviders } from "next-vibe/agent/models/models";
import { getBestMusicGenModel } from "next-vibe/agent/music-generation/models";
import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import { DEFAULT_SKILLS } from "next-vibe/agent/skills/config";
import {
  ContentLevel,
  SkillCategory,
  SkillOwnershipType,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { getBestTtsModel } from "next-vibe/agent/text-to-speech/models";
import { getBestVideoGenModel } from "next-vibe/agent/video-generation/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { hreflangFor } from "next-vibe/core/i18n/core/seo-locales";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
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

import {
  buildBreadcrumbList,
  pageUrl,
} from "@/_pages/_components/structured-data";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { REFERRAL_CONFIG } from "@/referral/config";
import { linkDeepLinkAttribution } from "@/referral/deep-link-attribution";

import {
  type SiteLayoutData,
  tanstackLoader as siteLayoutLoader,
} from "../../story/layout";
import { scopedTranslation } from "./i18n";
import { getSkillMessagePrice } from "./message-price";
import type {
  FreeCredits,
  LeadMagnetConfigData,
  ModelKind,
  RelatedSkill,
  ResolvedSkillModels,
  ResolvedVariantInfo,
} from "./page-client";
import {
  getCuratedPromptKeys,
  getSkillSamples,
  type SkillSample,
} from "./samples";

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

async function resolveLandingSkill(
  skillId: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<{
  user: JwtPayloadType;
  skill: SkillGetResponseOutput;
  baseSkillId: string;
  variantId: string | null;
  indexableId: string | null;
}> {
  const { skillId: baseSkillId, variantId } = parseSkillId(skillId);
  if (!baseSkillId || (variantId === null && isSkillVariantId(skillId))) {
    notFound();
  }

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
      !result.data.variants?.some((variant) => variant.id === variantId))
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
}

export async function loadSkillPageMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { locale, skillId } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const logger = createEndpointLogger(false, locale);
  const { skill, baseSkillId, variantId, indexableId } =
    await resolveLandingSkill(skillId, locale, logger);
  const { tagline, description } = skill;
  const name = skill.name ?? "";

  const summary = asSentence(description || tagline || name);
  const metaDescription = getSkillSamples(baseSkillId, locale)
    ? t("meta.description", {
        appName,
        name,
        summary,
        modelCount: getAvailableChatModelCount(
          false,
          await getEnvAvailability(),
        ),
      })
    : summary || t("hero.tryGeneric");

  return metadataGenerator(locale, {
    path: `skill/${encodeURIComponent(indexableId ?? baseSkillId)}`,
    title: tagline
      ? t("meta.title", { appName, name, tagline })
      : t("meta.titlePlain", { appName, name }),
    category: t("meta.category"),
    description: metaDescription,
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName, name }),
    keywords: [t("meta.keywords", { appName, name })],
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
  signupUrl: string;
  loginUrl: string;
  /** Referral code carried into chat + signup links (URL ?ref= or creator). */
  refCode: string | null;
  appName: string;
  modelCount: number;
  freeCredits: FreeCredits;
  referralPercent: number;
  resolvedModels: ResolvedSkillModels;
  /** Variant the page is about: URL variant, else the skill default. */
  activeVariantId: string | null;
  leadMagnetConfig: LeadMagnetConfigData | null;
  skillData: SkillGetResponseOutput;
  samples: SkillSample[];
  examplePrompts: string[];
  categoryLabel: string | null;
  relatedSkills: RelatedSkill[];
  creatorSkills: RelatedSkill[];
  /** BreadcrumbList + WebPage JSON-LD. */
  structuredData: JsonLdNode | null;
  layout: Omit<SiteLayoutData, "children">;
}

function modelKindOf(model: ChatModelOption): ModelKind {
  if (model.content === ContentLevel.UNCENSORED) {
    // Uncensored LM is trained on different material; the rest are mainstream
    // models with the refusal behaviour removed (abliterated / jailbroken).
    return model.id === ChatModelId.UNCENSORED_LM_V1_2
      ? "trained"
      : "abliterated";
  }
  if (model.content === ContentLevel.OPEN) {
    return "open";
  }
  return "mainstream";
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
  creatorUserId: string,
  excludeId: string,
  logger: EndpointLogger,
): Promise<RelatedSkill[]> {
  try {
    const { db } = await import("next-vibe/database");
    const { customSkills } = await import("next-vibe/agent/skills/db");
    const { SkillStatus } = await import("next-vibe/agent/skills/enum");
    const { and, eq, ne } = await import("drizzle-orm");
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
          eq(customSkills.userId, creatorUserId),
          eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
          eq(customSkills.status, SkillStatus.PUBLISHED),
          eq(customSkills.isDeleted, false),
          ne(customSkills.slug, excludeId),
          UUID_RE.test(excludeId) ? ne(customSkills.id, excludeId) : undefined,
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
      ...parseError(error),
      page: "skill",
      creatorUserId,
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
      ...parseError(error),
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
    await resolveLandingSkill(skillId, locale, logger);
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

  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const [layout, availability] = await Promise.all([
    siteLayoutLoader({ params: Promise.resolve({ locale }) }),
    getEnvAvailability(),
  ]);
  const modelCount = getAvailableChatModelCount(false, availability);
  const freeCredits: FreeCredits = {
    guest: FREE_CREDIT_ALLOWANCE.guest,
    signedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
    max: FREE_CREDIT_MAX_TOTAL,
  };

  const urlRef = search["ref"];
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

  const base: Omit<
    SkillLandingPageData,
    | "skillData"
    | "resolvedModels"
    | "samples"
    | "examplePrompts"
    | "relatedSkills"
    | "creatorSkills"
    | "categoryLabel"
    | "leadMagnetConfig"
    | "activeVariantId"
    | "signupUrl"
    | "refCode"
    | "structuredData"
  > = {
    locale,
    skillId,
    baseSkillId,
    user,
    platform: Platform.NEXT_PAGE,
    loginUrl: `/${locale}/user/login`,
    appName,
    modelCount,
    freeCredits,
    referralPercent: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
    layout,
  };

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
    const provider = chatModel
      ? (modelProviders[chatModel.provider] ?? null)
      : null;
    const imageGenModel = v.imageGenModelSelection
      ? getBestImageGenModel(v.imageGenModelSelection, user, availability)
      : null;
    variants.push({
      id: v.id,
      displayName: v.displayName ?? null,
      description: v.description ?? null,
      strength: v.strength ?? null,
      weakness: v.weakness ?? null,
      isDefault: v.isDefault ?? false,
      // Registry names can carry stray whitespace ("Qwen3 235B ").
      chatModelName: chatModel?.name.trim() ?? null,
      chatProviderName: provider?.name ?? null,
      modelKind: chatModel ? modelKindOf(chatModel) : "mainstream",
      chatMessagePrice: chatModel
        ? getSkillMessagePrice(chatModel, locale)
        : null,
      voiceModelName: v.voiceModelSelection
        ? (getBestTtsModel(v.voiceModelSelection, user, availability)?.name ??
          null)
        : null,
      imageGenModelName: imageGenModel?.name ?? null,
      imageGenCreditCost: imageGenModel?.creditCostPerImage ?? null,
      musicGenModelName: v.musicGenModelSelection
        ? (getBestMusicGenModel(v.musicGenModelSelection, user, availability)
            ?.name ?? null)
        : null,
      videoGenModelName: v.videoGenModelSelection
        ? (getBestVideoGenModel(v.videoGenModelSelection, user, availability)
            ?.name ?? null)
        : null,
      hasStt: !!v.sttModelSelection,
      hasImageVision: !!v.imageVisionModelSelection,
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
  const signupUrl = `/${locale}/user/signup?${
    refCode ? `ref=${encodeURIComponent(refCode)}&` : ""
  }skillId=${encodeURIComponent(skillId)}`;

  // Example prompts: curated override (keeps the public page clean), else the
  // skill's own suggested prompts, else generic persona openers.
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const { t } = scopedTranslation.scopedT(locale);
  const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === baseSkillId);
  const curatedKeys = getCuratedPromptKeys(baseSkillId);
  const examplePrompts = (
    curatedKeys
      ? curatedKeys.map((k) => t(k))
      : defaultSkill && defaultSkill.suggestedPrompts.length > 0
        ? defaultSkill.suggestedPrompts.map((k) => skillsT(k))
        : [
            t("prompts.generic.0"),
            t("prompts.generic.1"),
            t("prompts.generic.2"),
            t("prompts.generic.3"),
          ]
  ).slice(0, MAX_PROMPTS);

  // Samples only when the page shows the variant they were generated on.
  const samplesForSkill = getSkillSamples(baseSkillId, locale);
  const samples =
    samplesForSkill && activeVariant?.isDefault !== false
      ? samplesForSkill
      : [];

  const isCommunity = skillData.skillOwnership !== SkillOwnershipType.SYSTEM;
  const [leadMagnetConfig, creatorSkills] = await Promise.all([
    isCommunity && !creator?.leadMagnetActive
      ? loadLeadMagnetConfig(baseSkillId, logger)
      : Promise.resolve(null),
    creator
      ? creatorRelated(creator.userId, baseSkillId, logger)
      : Promise.resolve([]),
  ]);

  return {
    ...base,
    signupUrl,
    refCode,
    resolvedModels: { variants },
    activeVariantId: activeVariant?.id ?? null,
    leadMagnetConfig: creator?.leadMagnetActive
      ? {
          headline: creator.leadMagnetHeadline,
          buttonText: creator.leadMagnetButtonText,
        }
      : leadMagnetConfig,
    skillData,
    samples,
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
            modelName: activeVariant?.chatModelName ?? null,
            appName,
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
    modelName: string | null;
    appName: string;
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
        isPartOf: { "@type": "WebSite", name: info.appName },
        about: {
          "@type": "SoftwareApplication",
          name,
          applicationCategory: "ChatApplication",
          operatingSystem: "Web",
          description: info.description,
          ...(info.modelName ? { softwareRequirements: info.modelName } : {}),
        },
      },
    ],
  };
}

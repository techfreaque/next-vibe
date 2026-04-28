/**
 * Public Skill Landing Page
 * Proper public shareable landing page for a skill.
 * URL: /[locale]/skill/[skillId]
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import { getBestChatModel } from "@/app/api/[locale]/agent/ai-stream/models";
import { SkillsRepository } from "@/app/api/[locale]/agent/chat/skills/repository";
import { getBestImageGenModel } from "@/app/api/[locale]/agent/image-generation/models";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import { getBestTtsModel } from "@/app/api/[locale]/agent/text-to-speech/models";
import { getBestVideoGenModel } from "@/app/api/[locale]/agent/video-generation/models";
import { Div } from "next-vibe-ui/ui/div";
import { scopedTranslation } from "./i18n";
import type { SkillGetResponseOutput } from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import {
  SkillLandingPage,
  type LeadMagnetConfigData,
  type ResolvedSkillModels,
} from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; skillId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, skillId } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );
  const user = userResponse.success ? userResponse.data : null;

  let name = "";
  let tagline = "";
  let modelCount = 0;
  if (user) {
    const skillResult = await SkillsRepository.getSkillById(
      { id: skillId },
      user,
      logger,
      locale,
    );
    if (skillResult.success) {
      name = skillResult.data.name ?? "";
      tagline = skillResult.data.tagline ?? "";
      modelCount = skillResult.data.variants?.length ?? 0;
    }
  }

  return metadataGenerator(locale, {
    path: `skill/${skillId}`,
    title: t("meta.title", { appName, name }),
    category: t("meta.category"),
    description: t("meta.description", { appName, name, tagline, modelCount }),
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName, name }),
    keywords: [t("meta.keywords", { appName, name })],
  });
}

export interface SkillLandingPageData {
  locale: CountryLanguage;
  skillId: string;
  user: JwtPayloadType;
  signupUrl: string;
  appName: string;
  resolvedModels: ResolvedSkillModels;
  leadMagnetConfig: LeadMagnetConfigData | null;
  skillData: SkillGetResponseOutput | null;
}

// Reference token counts for "~X credits/msg" estimate (short message)
const REF_INPUT_TOKENS = 200;
const REF_OUTPUT_TOKENS = 400;

export async function tanstackLoader({
  params,
}: Props): Promise<SkillLandingPageData | null> {
  const { locale, skillId } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );
  const user = userResponse.success ? userResponse.data : null;
  if (!user) {
    logger.error("Failed to get identity on skills page");
    return null;
  }
  const skillUser: JwtPayloadType = user;

  const skillResult = await SkillsRepository.getSkillById(
    { id: skillId },
    skillUser,
    logger,
    locale,
  );
  const initialSkillData = skillResult.success ? skillResult.data : null;

  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  // Resolve per-variant model info server-side - avoids SSR circular dep in client bundle.
  const resolvedVariants: ResolvedSkillModels["variants"] = [];
  for (const v of initialSkillData?.variants ?? []) {
    const chatSel = v.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
    const chatModel = getBestChatModel(chatSel, skillUser);
    const provider = chatModel
      ? (modelProviders[chatModel.provider] ?? null)
      : null;

    let chatCreditCost: string | null = null;
    if (chatModel) {
      const cost =
        typeof chatModel.creditCost === "function"
          ? chatModel.creditCost(
              chatModel,
              REF_INPUT_TOKENS,
              REF_OUTPUT_TOKENS,
              0,
              0,
            )
          : ((chatModel.creditCost as number | undefined) ?? 0);
      if (cost > 0) {
        chatCreditCost = `~${Math.round(cost * 10) / 10} credits/msg`;
      }
    }

    const voiceSel = v.voiceModelSelection ?? null;
    const voiceName = voiceSel
      ? (getBestTtsModel(voiceSel, skillUser)?.name ?? null)
      : null;

    const imageGenSel = v.imageGenModelSelection ?? null;
    const imageGenModel = imageGenSel
      ? getBestImageGenModel(imageGenSel, skillUser)
      : null;
    const imageGenName = imageGenModel?.name ?? null;
    const imageGenCreditCost =
      imageGenModel?.creditCostPerImage !== undefined
        ? `${imageGenModel.creditCostPerImage} credits/img`
        : null;

    const musicGenSel = v.musicGenModelSelection ?? null;
    const musicGenName = musicGenSel
      ? (getBestMusicGenModel(musicGenSel, skillUser)?.name ?? null)
      : null;

    const videoGenSel = v.videoGenModelSelection ?? null;
    const videoGenName = videoGenSel
      ? (getBestVideoGenModel(videoGenSel, skillUser)?.name ?? null)
      : null;

    resolvedVariants.push({
      id: v.id,
      displayName: v.displayName ?? null,
      chatModelName: chatModel?.name ?? null,
      chatProviderName: provider?.name ?? null,
      chatProviderIcon: provider?.icon ?? null,
      chatCreditCost,
      voiceModelName: voiceName,
      imageGenModelName: imageGenName,
      imageGenCreditCost,
      musicGenModelName: musicGenName,
      videoGenModelName: videoGenName,
      hasStt: !!v.sttModelSelection,
      hasImageVision: !!v.imageVisionModelSelection,
      hasVideoVision: !!v.videoVisionModelSelection,
      hasAudioVision: !!v.audioVisionModelSelection,
      toolCount: 0,
    });
  }

  const skillToolCount = (initialSkillData?.availableTools ?? []).length;
  for (const rv of resolvedVariants) {
    rv.toolCount = skillToolCount;
  }

  const defaultVariant =
    initialSkillData?.variants.find((v) => v.isDefault) ??
    initialSkillData?.variants[0] ??
    null;

  const voiceSel =
    defaultVariant?.voiceModelSelection ??
    initialSkillData?.voiceModelSelection ??
    null;
  const voiceName = voiceSel
    ? (getBestTtsModel(voiceSel, skillUser)?.name ?? null)
    : null;

  const imageGenSel =
    defaultVariant?.imageGenModelSelection ??
    initialSkillData?.imageGenModelSelection ??
    null;
  const imageGenName = imageGenSel
    ? (getBestImageGenModel(imageGenSel, skillUser)?.name ?? null)
    : null;

  const musicGenSel =
    defaultVariant?.musicGenModelSelection ??
    initialSkillData?.musicGenModelSelection ??
    null;
  const musicGenName = musicGenSel
    ? (getBestMusicGenModel(musicGenSel, skillUser)?.name ?? null)
    : null;

  const videoGenSel =
    defaultVariant?.videoGenModelSelection ??
    initialSkillData?.videoGenModelSelection ??
    null;
  const videoGenName = videoGenSel
    ? (getBestVideoGenModel(videoGenSel, skillUser)?.name ?? null)
    : null;

  const hasStt = !!(
    defaultVariant?.sttModelSelection ?? initialSkillData?.sttModelSelection
  );

  const resolvedModels: ResolvedSkillModels = {
    variants: resolvedVariants,
    voiceName,
    imageGenName,
    musicGenName,
    videoGenName,
    hasStt,
  };

  const creator = initialSkillData?.creatorProfile ?? null;
  const signupUrl = `/${locale}/user/signup${
    creator?.referralCode
      ? `?ref=${creator.referralCode}&skillId=${skillId}`
      : `?skillId=${skillId}`
  }`;

  // Fetch creator's lead magnet config for the capture form
  // NOTE: creatorProfile is only populated for USER-owned skills, so we do a
  // direct DB lookup for the skill's userId to handle PUBLIC-owned skills too.
  let leadMagnetConfig: LeadMagnetConfigData | null = null;
  {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { leadMagnetConfigs } =
      await import("@/app/api/[locale]/lead-magnet/db");
    const { customSkills } =
      await import("@/app/api/[locale]/agent/chat/skills/db");
    const { eq } = await import("drizzle-orm");
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const [skillRow] = uuidRegex.test(skillId)
      ? await db
          .select({ userId: customSkills.userId })
          .from(customSkills)
          .where(eq(customSkills.id, skillId))
          .limit(1)
      : [];
    if (skillRow) {
      const configRows = await db
        .select({
          headline: leadMagnetConfigs.headline,
          buttonText: leadMagnetConfigs.buttonText,
          isActive: leadMagnetConfigs.isActive,
        })
        .from(leadMagnetConfigs)
        .where(eq(leadMagnetConfigs.userId, skillRow.userId))
        .limit(1);
      const cfg = configRows[0];
      if (cfg?.isActive) {
        leadMagnetConfig = {
          headline: cfg.headline,
          buttonText: cfg.buttonText,
        };
      }
    }
  }

  return {
    locale,
    skillId,
    user: skillUser,
    signupUrl,
    appName,
    resolvedModels,
    leadMagnetConfig,
    skillData: initialSkillData,
  };
}

export function TanstackPage(data: SkillLandingPageData): JSX.Element {
  return <SkillLandingPage {...data} />;
}

export default async function SkillPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  if (!data) {
    return <Div />;
  }
  return <TanstackPage {...data} />;
}

/**
 * Lead Magnet Capture Repository
 * Submits a lead to the skill owner's email platform and logs it
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import { referralCodes } from "@/app/api/[locale]/referral/db";
import { db } from "@/app/api/[locale]/system/db";

import type { LeadMagnetCaptureStatusValue } from "../enum";
import { LeadMagnetCaptureStatus } from "../enum";
import { leadMagnetCaptures, leadMagnetConfigs } from "../db";
import { getProvider } from "../providers/forwarding";
import { scopedTranslation as parentScopedTranslation } from "../i18n";
import { scopedTranslation } from "./i18n";
import type {
  CapturePostRequestOutput,
  CapturePostResponseOutput,
} from "./definition";

export const LeadMagnetCaptureRepository = {
  async submitCapture(
    data: CapturePostRequestOutput,
    locale: CountryLanguage,
  ): Promise<ResponseType<CapturePostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: parentT } = parentScopedTranslation.scopedT(locale);
    const { skillId, firstName, email } = data;

    // 1. Look up skill → get owner userId
    const skillRows = await db
      .select({ userId: customSkills.userId })
      .from(customSkills)
      .where(eq(customSkills.id, skillId))
      .limit(1);

    if (skillRows.length === 0) {
      return fail({
        message: t("submit.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const { userId } = skillRows[0];

    // 2. Get creator's lead magnet config
    const configRows = await db
      .select()
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1);

    // 3. Get creator's referral code (for sign-up URL)
    const refRows = await db
      .select({ code: referralCodes.code })
      .from(referralCodes)
      .where(eq(referralCodes.ownerUserId, userId))
      .limit(1);

    const refCode = refRows[0]?.code ?? null;

    const signupUrl = buildSignupUrl(
      locale,
      email,
      firstName,
      refCode,
      skillId,
    );

    // 4. If no config or not active, return success silently (don't expose creator hasn't set up)
    if (configRows.length === 0 || !configRows[0].isActive) {
      return success({
        captured: false,
        nextStep: "signup" as const,
        signupUrl,
      });
    }

    const config = configRows[0];

    // 5. Forward to provider
    let captureStatus: typeof LeadMagnetCaptureStatusValue =
      LeadMagnetCaptureStatus.SUCCESS;
    let errorMessage: string | null = null;

    try {
      const forwardLead = await getProvider(config.provider);
      const result = await forwardLead(
        config.credentials as Record<string, string>,
        { firstName, email, listId: config.listId ?? undefined },
        parentT,
      );

      if (!result.success) {
        captureStatus = LeadMagnetCaptureStatus.FAILED;
        errorMessage = result.message ?? "Provider error";
      }
    } catch (error) {
      captureStatus = LeadMagnetCaptureStatus.FAILED;
      errorMessage = String(error);
    }

    // 6. Log capture regardless of outcome
    await db.insert(leadMagnetCaptures).values({
      configId: config.id,
      skillId,
      email,
      firstName,
      status: captureStatus,
      errorMessage,
    });

    return success({
      captured: captureStatus === LeadMagnetCaptureStatus.SUCCESS,
      nextStep: "signup" as const,
      signupUrl,
    });
  },
};

function buildSignupUrl(
  locale: string,
  email: string,
  firstName: string,
  refCode: string | null,
  skillId: string,
): string {
  const params = new URLSearchParams({ email, firstName, skillId });
  if (refCode) {
    params.set("ref", refCode);
  }
  return `/${locale}/user/sign-up?${params.toString()}`;
}

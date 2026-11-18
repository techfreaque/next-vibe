/**
 * Deep-link attribution for skill and creator links.
 *
 * A visitor who lands on a skill page or a chat deep link with `?ref=` and/or
 * `?skill=` gets the referral code linked to their lead and the skill stored
 * as first-touch skill, exactly like the signup page does. Never blocks the
 * page: failures are logged with context, nothing is thrown.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ReferralRepository } from "./repository";

/** Referral codes are short slugs; anything else is junk from a crafted URL. */
const REF_CODE_PATTERN = /^[\w-]{1,64}$/;
/** Skill ids are slugs, UUIDs or `<skill>__<variant>`. */
const SKILL_ID_PATTERN = /^[\w-]{1,128}$/;

export async function linkDeepLinkAttribution({
  leadId,
  refCode,
  skillId,
  locale,
  logger,
}: {
  leadId: string;
  refCode: string | null;
  skillId: string | null;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<void> {
  if (skillId && SKILL_ID_PATTERN.test(skillId)) {
    const { LeadsRepository } =
      await import("next-vibe/identity/lead/repository");
    // updateLeadSkillId logs its own failures; first touch wins.
    await LeadsRepository.updateLeadSkillId(leadId, skillId, false, logger);
  }

  if (!refCode || !REF_CODE_PATTERN.test(refCode)) {
    return;
  }
  try {
    const linkResult = await ReferralRepository.linkReferralToLead(
      leadId,
      refCode,
      logger,
      locale,
    );
    if (!linkResult.success) {
      // Lost referral attribution - the referrer never gets credited
      logger.warn("Deep link: linking referral code to lead failed", {
        operation: "linkDeepLinkAttribution",
        leadId,
        referralCode: refCode,
        skillId,
        errorType: linkResult.errorType.errorKey,
        reason: linkResult.message,
      });
    }
  } catch (error) {
    logger.error(
      "Deep link: linking referral code to lead threw",
      parseError(error),
      {
        operation: "linkDeepLinkAttribution",
        leadId,
        referralCode: refCode,
        skillId,
      },
    );
  }
}

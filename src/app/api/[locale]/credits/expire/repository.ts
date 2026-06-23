import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

import type { CreditsT } from "../i18n";
import { CreditRepository } from "../repository";
import type { CreditsExpirePostResponseOutput } from "./definition";

export class CreditExpireRepository {
  static async expire(
    logger: EndpointLogger,
    t: CreditsT,
  ): Promise<ResponseType<CreditsExpirePostResponseOutput>> {
    const result = await CreditRepository.expireCredits(logger, t);
    if (!result.success) {
      return result;
    }
    return success<CreditsExpirePostResponseOutput>({
      expiredCount: result.data,
    });
  }
}

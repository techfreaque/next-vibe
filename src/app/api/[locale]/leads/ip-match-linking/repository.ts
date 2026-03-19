/**
 * IP Match Linking Repository
 * Links anonymous leads that share the same IP address within a time window.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import { LeadsRepository } from "../repository";
import type {
  IpMatchLinkingPostRequestOutput,
  IpMatchLinkingPostResponseOutput,
} from "./definition";
import type { IpMatchLinkingT } from "./i18n";

export class IpMatchLinkingRepository {
  static async run(
    data: IpMatchLinkingPostRequestOutput,
    logger: EndpointLogger,
    t: IpMatchLinkingT,
    locale: CountryLanguage,
  ): Promise<ResponseType<IpMatchLinkingPostResponseOutput>> {
    const { t: leadsT } = leadsScopedTranslation.scopedT(locale);
    try {
      const windowDays = data.windowDays ?? 30;
      const dryRun = data.dryRun ?? false;

      logger.info("Starting IP match linking", { windowDays, dryRun });

      // Find candidate pairs: anonymous leads sharing the same IP within the window
      const pairs = await LeadsRepository.findLeadPairsByIp(windowDays, logger);

      logger.info(`Found ${pairs.length} candidate pairs`);

      if (dryRun) {
        return success({ pairsFound: pairs.length, pairsLinked: 0 });
      }

      let pairsLinked = 0;
      for (const pair of pairs) {
        const linkResult = await LeadsRepository.linkLeadToLead(
          pair.leadId1,
          pair.leadId2,
          "ip_match",
          logger,
          leadsT,
        );
        if (linkResult.success) {
          pairsLinked++;
          logger.debug("Linked lead pair", {
            leadId1: pair.leadId1,
            leadId2: pair.leadId2,
          });
        } else {
          logger.warn("Failed to link lead pair", {
            leadId1: pair.leadId1,
            leadId2: pair.leadId2,
            message: linkResult.message,
          });
        }
      }

      logger.info("IP match linking complete", {
        pairsFound: pairs.length,
        pairsLinked,
      });

      return success({ pairsFound: pairs.length, pairsLinked });
    } catch (error) {
      logger.error("IP match linking failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

import "server-only";

import { asc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { isFinanceProductionInstance } from "../../env";
import { bankFeedMappings } from "../db";
import { sendEnableBankingConsentReminders } from "../enable-banking/consent/repository";
import { bankConnectionEnv } from "../env";
import { purgeBankPrivacyEvidence } from "../privacy/repository";
import { syncBankFeed } from "../repository";
import type { MaintenanceOutput } from "./definition";

export async function maintainBankFeeds(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<MaintenanceOutput>> {
  const now = new Date();
  await purgeBankPrivacyEvidence();
  const reminded = await sendEnableBankingConsentReminders(now, logger, locale);
  let completed = 0;
  let failed = 0;
  if (
    isFinanceProductionInstance &&
    bankConnectionEnv.ENABLE_BANKING_DAILY_SYNC === "true"
  ) {
    const feeds = await db
      .select()
      .from(bankFeedMappings)
      .where(eq(bankFeedMappings.daily, true))
      .orderBy(asc(bankFeedMappings.id));
    for (const feed of feeds) {
      try {
        const result = await syncBankFeed(
          feed.actorId,
          {
            companyId: feed.companyId,
            accountId: feed.accountId,
            feedId: feed.consentAccountId,
            dryRun: false,
            matchedOnly: true,
          },
          logger,
          locale,
        );
        if (result.success) {
          completed++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
  }
  return success({ completed, failed, reminded });
}

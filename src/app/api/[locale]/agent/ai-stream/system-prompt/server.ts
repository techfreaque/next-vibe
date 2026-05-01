import "server-only";

import { and, count, eq, like } from "drizzle-orm";

import { FEATURED_MODELS } from "@/app/api/[locale]/agent/ai-stream/models";
import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { scopedTranslation as chatScopedTranslation } from "@/app/api/[locale]/agent/chat/i18n";
import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";
import { MEMORIES_PREFIX } from "@/app/api/[locale]/agent/cortex/repository";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { db } from "@/app/api/[locale]/system/db";
import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import { cronTasks as cronTasksTable } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { languageConfig } from "@/i18n";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import type { PromptContextData } from "./prompt";

function currencySymbol(currency: string): string {
  if (currency === "EUR") {
    return "€";
  }
  if (currency === "PLN") {
    return "zł";
  }
  return "$";
}

export async function loadPromptContextData(
  params: SystemPromptServerParams,
): Promise<PromptContextData> {
  const {
    user,
    locale,
    rootFolderId,
    subFolderId,
    headless = false,
    callMode = false,
    extraInstructions,
    isExposedFolder,
    subAgentDepth,
    mediaCapabilities,
  } = params;

  const userId = user.isPublic ? undefined : user.id;
  const isPublicUser = user.isPublic;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isIncognito = rootFolderId === "incognito";
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;

  const { t } = chatScopedTranslation.scopedT(locale);
  const appName = t("config.appName");

  const { language, country } = getLanguageAndCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];

  const freeTierCredits = productsRepository.getProduct(
    ProductIds.FREE_TIER,
    locale,
  ).credits;
  const subscriptionProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );
  const creditPackProduct = productsRepository.getProduct(
    ProductIds.CREDIT_PACK,
    locale,
  );
  const subLabel = `${currencySymbol(subscriptionProduct.currency)}${subscriptionProduct.price}/month → ${subscriptionProduct.credits} credits`;
  const packLabel = `${currencySymbol(creditPackProduct.currency)}${creditPackProduct.price} → ${creditPackProduct.credits} permanent credits`;

  let privateName = "";
  let publicName = "";
  let isFreshUser = true;
  let dreamerEnabled = false;
  let autopilotEnabled = false;

  if (userId && !isIncognito) {
    try {
      const [userRow, memoriesCount, tasksCount, settingsRow] =
        await Promise.all([
          db
            .select({
              privateName: usersTable.privateName,
              publicName: usersTable.publicName,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1),
          db
            .select({ count: count() })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, userId),
                eq(cortexNodes.nodeType, CortexNodeType.FILE),
                like(cortexNodes.path, `${MEMORIES_PREFIX}/%`),
              ),
            ),
          db
            .select({ count: count() })
            .from(cronTasksTable)
            .where(eq(cronTasksTable.userId, userId)),
          db
            .select({
              dreamerEnabled: chatSettings.dreamerEnabled,
              autopilotEnabled: chatSettings.autopilotEnabled,
            })
            .from(chatSettings)
            .where(eq(chatSettings.userId, userId))
            .limit(1),
        ]);

      const row = userRow[0];
      privateName = row?.privateName ?? "";
      publicName = row?.publicName ?? "";
      isFreshUser =
        (memoriesCount[0]?.count ?? 0) === 0 &&
        (tasksCount[0]?.count ?? 0) === 0;
      dreamerEnabled = settingsRow[0]?.dreamerEnabled ?? false;
      autopilotEnabled = settingsRow[0]?.autopilotEnabled ?? false;
    } catch {
      // fallback: assume fresh user if DB fails
    }
  }

  return {
    appName,
    locale: language,
    languageName: countryInfo?.langName ?? language,
    countryName: countryInfo?.name ?? country,
    flag: countryInfo?.flag ?? "🌐",
    rootFolderId,
    subFolderId,
    headless,
    callMode,
    extraInstructions: extraInstructions ?? "",
    isLocalMode,
    freeTierCredits,
    subLabel,
    packLabel,
    uncensoredNames: FEATURED_MODELS.uncensored.join(", "),
    totalModelCount: getAvailableModelCount(isAdmin),
    isExposedFolder,
    privateName,
    publicName,
    isPublicUser,
    isAdmin,
    isFreshUser,
    dreamerEnabled,
    autopilotEnabled,
    mediaCapabilities: mediaCapabilities ?? null,
    subAgentDepth,
  };
}

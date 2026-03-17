import "server-only";

import { count, eq } from "drizzle-orm";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { memories as memoriesTable } from "@/app/api/[locale]/agent/chat/memories/db";
import {
  FEATURED_MODELS,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { db } from "@/app/api/[locale]/system/db";
import { cronTasks as cronTasksTable } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { languageConfig } from "@/i18n";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

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
    extraInstructions = "",
    isExposedFolder,
  } = params;

  const userId = user.isPublic ? undefined : user.id;
  const isPublicUser = user.isPublic;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isIncognito = rootFolderId === "incognito";
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;

  const { t } = simpleT(locale);
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

  if (userId && !isIncognito) {
    try {
      const [userRow, memoriesCount, tasksCount] = await Promise.all([
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
          .from(memoriesTable)
          .where(eq(memoriesTable.userId, userId)),
        db
          .select({ count: count() })
          .from(cronTasksTable)
          .where(eq(cronTasksTable.userId, userId)),
      ]);

      const row = userRow[0];
      privateName = row?.privateName ?? "";
      publicName = row?.publicName ?? "";
      isFreshUser =
        (memoriesCount[0]?.count ?? 0) === 0 &&
        (tasksCount[0]?.count ?? 0) === 0;
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
    extraInstructions,
    isLocalMode,
    freeTierCredits,
    subLabel,
    packLabel,
    uncensoredNames: FEATURED_MODELS.uncensored.join(", "),
    totalModelCount: TOTAL_MODEL_COUNT,
    isExposedFolder,
    privateName,
    publicName,
    isPublicUser,
    isAdmin,
    isFreshUser,
  };
}

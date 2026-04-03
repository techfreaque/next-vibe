"use client";

import { useMemo } from "react";

import { FEATURED_MODELS } from "@/app/api/[locale]/agent/ai-stream/models";
import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { scopedTranslation as chatScopedTranslation } from "@/app/api/[locale]/agent/chat/i18n";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { useUser } from "@/app/api/[locale]/user/private/me/hooks";
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

export function usePromptContextData(
  params: SystemPromptClientParams,
): PromptContextData {
  const {
    user,
    logger,
    locale,
    enabledPrivate,
    rootFolderId,
    subFolderId = null,
    callMode = false,
    extraInstructions = "",
    headless = false,
  } = params;

  const isExposedFolder = !enabledPrivate || user.isPublic;
  const { user: userData } = useUser(user, logger);
  const isPublicUser = user.isPublic;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const envAvailability = useEnvAvailability();
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const { t: tChat } = chatScopedTranslation.scopedT(locale);
  const appName = tChat("config.appName");

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

  return useMemo((): PromptContextData => {
    const privateName =
      userData && !userData.isPublic ? (userData.privateName ?? "") : "";
    const publicName =
      userData && !userData.isPublic ? (userData.publicName ?? "") : "";
    // On the client we don't have DB counts - assume not fresh if names exist
    const isFreshUser = !privateName && !publicName;

    return {
      appName,
      locale: language,
      languageName: countryInfo?.langName ?? language,
      countryName: countryInfo?.name ?? country,
      flag: countryInfo?.flag ?? "🌐",
      rootFolderId,
      subFolderId: subFolderId ?? null,
      headless,
      callMode,
      extraInstructions,
      isLocalMode,
      freeTierCredits,
      subLabel,
      packLabel,
      uncensoredNames: FEATURED_MODELS.uncensored.join(", "),
      totalModelCount: getAvailableModelCount(envAvailability, isAdmin),
      isExposedFolder,
      privateName,
      publicName,
      isPublicUser,
      isAdmin,
      isFreshUser,
      mediaCapabilities: null,
    };
  }, [
    userData,
    appName,
    language,
    countryInfo,
    country,
    rootFolderId,
    subFolderId,
    headless,
    callMode,
    extraInstructions,
    isLocalMode,
    freeTierCredits,
    subLabel,
    packLabel,
    isExposedFolder,
    isPublicUser,
    isAdmin,
    envAvailability,
  ]);
}

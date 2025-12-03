"use client";

import { useMemo } from "react";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { generateClientSystemPrompt } from "@/app/api/[locale]/agent/ai-stream/system-prompt-generator";
import type { DefaultFolderId } from "../config";

/**
 * Hook to generate the system prompt on the client side
 * Uses the same generator as the server to ensure identical prompts
 */
export function useSystemPrompt(params: {
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
  personaPrompt?: string;
}): string {
  const { locale, rootFolderId, subFolderId, personaPrompt } = params;
  const { t } = simpleT(locale);

  return useMemo(() => {
    const appName = t("config.appName");

    return generateClientSystemPrompt({
      appName,
      locale,
      rootFolderId,
      subFolderId,
      personaPrompt,
    });
  }, [t, locale, rootFolderId, subFolderId, personaPrompt]);
}

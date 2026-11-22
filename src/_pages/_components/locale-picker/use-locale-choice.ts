"use client";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import type {
  Countries,
  CountryLanguage,
  Languages,
} from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { executeMutation } from "next-vibe/unified-ui/hooks/mutation-executor";
import { useCallback } from "react";

export interface LocaleChoice {
  /** Apply an exact language + region pair: one navigation, /me synced. */
  choose: (language: Languages, country: Countries) => void;
}

/**
 * Same switch path as the committed CountrySelector: cookie + storage +
 * URL locale segment, then a fire-and-forget POST /me for signed-in users so
 * the profile locale (emails, notifications) follows the choice.
 */
export function useLocaleChoice(
  locale: CountryLanguage,
  user: JwtPayloadType,
): LocaleChoice {
  const { setLocale } = useTranslation();
  const logger = useLogger();

  const choose = useCallback(
    (language: Languages, country: Countries): void => {
      const next: CountryLanguage = `${language}-${country}`;
      if (next === locale) {
        return;
      }
      if (!user.isPublic) {
        // Loaded on demand: a static import would put the /me definition and
        // its skills enum into every public page's initial JS.
        void import("@/user/private/me/definition")
          .then(({ default: meEndpoints }) =>
            executeMutation({
              endpoint: meEndpoints.POST,
              logger,
              requestData: {},
              pathParams: undefined,
              locale: next,
              user,
            }),
          )
          .catch((error: Error) => {
            logger.error("Locale sync to profile threw", error, {
              component: "LocalePicker",
              operation: "syncLocale",
              locale: next,
            });
          });
      }
      setLocale(next);
    },
    [locale, logger, setLocale, user],
  );

  return { choose };
}

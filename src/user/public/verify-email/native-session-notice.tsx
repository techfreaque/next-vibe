"use client";

import { decodeJwt } from "jose";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation as authTranslation } from "next-vibe/identity/auth/i18n";
import { AuthClientRepository } from "next-vibe/identity/auth/repository-client";
import {
  type JwtPrivatePayloadType,
  privateJwtPayloadSchema,
} from "next-vibe/identity/auth/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { usePathname } from "next-vibe/ui/hooks/use-navigation";
import { useEffect, useState } from "react";

import { useUser } from "../../private/me/hooks";
import { SessionEmailBanner } from "./session-banner";

function AccountNotice({
  user,
  locale,
}: {
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
}): React.JSX.Element | null {
  const logger = useLogger();
  const { user: profile } = useUser(user, logger);
  return profile?.id === user.id && !profile.emailVerified ? (
    <SessionEmailBanner
      key={profile.email}
      email={profile.email}
      user={user}
      locale={locale}
    />
  ) : null;
}

export function NativeSessionNotice({
  locale,
}: {
  locale: CountryLanguage;
}): React.JSX.Element | null {
  const logger = useLogger();
  const path = usePathname();
  const [user, setUser] = useState<JwtPrivatePayloadType | null>(null);
  useEffect(() => {
    if (path.includes("/user/verify-email/")) {
      return;
    }
    let active = true;
    const read = async (): Promise<void> => {
      const token = await AuthClientRepository.getAuthToken(
        logger,
        authTranslation.scopedT(locale).t,
      );
      let session: JwtPrivatePayloadType | null = null;
      if (token.success && token.data) {
        try {
          // Routing context only. The API authenticates the bearer and returns its own profile.
          const parsed = privateJwtPayloadSchema.safeParse(
            decodeJwt(token.data),
          );
          session = parsed.success ? parsed.data : null;
        } catch {
          logger.debug("No readable native session for the email notice");
        }
      }
      if (active) {
        setUser(session);
      }
    };
    void read();
    return (): void => {
      active = false;
    };
  }, [path, locale, logger]);
  return user ? (
    <AccountNotice key={user.id} user={user} locale={locale} />
  ) : null;
}

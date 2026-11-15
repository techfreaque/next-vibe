"use client";

import { ChatFavoritesRepositoryClient } from "next-vibe/agent/skills/favorites/repository-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { assignUrl } from "next-vibe/ui/lib/location";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { useEffect, useState } from "react";

import signupEndpoints from "@/user/public/signup/definition";

interface SignUpFormProps {
  locale: CountryLanguage;
  initialReferralCode: string | null;
  /** Same-site path validated by the page loader. */
  callbackUrl: string | null;
  user: JwtPayloadType;
  platform: Platform;
}

export default function SignUpForm({
  locale,
  initialReferralCode,
  callbackUrl,
  user,
  platform,
}: SignUpFormProps): React.JSX.Element {
  const logger = useLogger();

  const [autoPrefillData, setAutoPrefillData] = useState<
    | {
        referralCode?: string;
        localFavorites?: Awaited<
          ReturnType<
            typeof ChatFavoritesRepositoryClient.getLocalFavoritesForMigration
          >
        >;
        supportedSkillId?: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    void (async (): Promise<void> => {
      const localFavorites =
        await ChatFavoritesRepositoryClient.getLocalFavoritesForMigration(
          logger,
        );
      const supportedSkillId =
        await ChatFavoritesRepositoryClient.getLastAttributedSkillId(logger);
      setAutoPrefillData({
        ...(initialReferralCode ? { referralCode: initialReferralCode } : {}),
        ...(localFavorites.length > 0 ? { localFavorites } : {}),
        ...(supportedSkillId ? { supportedSkillId } : {}),
      });
    })();
  }, [initialReferralCode, logger]);

  return (
    <EndpointsPage
      logger={logger}
      endpoint={{ POST: signupEndpoints.POST }}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{
        create: {
          autoPrefillData,
          mutationOptions: {
            onSuccess: () => {
              // Full page load, same as login: signup swaps the lead cookie
              // for a session, and only a fresh load reconnects the shared
              // WebSocket with it. A client push kept the guest socket, so
              // every user channel (credits, folders, favorites, private
              // threads) was denied until the next reload.
              assignUrl(callbackUrl ?? `/${locale}`);
            },
          },
        },
      }}
    />
  );
}

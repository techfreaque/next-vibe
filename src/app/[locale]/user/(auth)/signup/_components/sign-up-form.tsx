"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useRouter } from "next-vibe/ui/web/hooks/use-navigation";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import { useEffect, useState } from "react";

import { ChatFavoritesRepositoryClient } from "@/app/api/[locale]/agent/skills/favorites/repository-client";
import signupEndpoints from "@/app/api/[locale]/user/public/signup/definition";

interface SignUpFormProps {
  locale: CountryLanguage;
  initialReferralCode: string | null;
  user: JwtPayloadType;
}

export default function SignUpForm({
  locale,
  initialReferralCode,
  user,
}: SignUpFormProps): React.JSX.Element {
  const router = useRouter();

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
        await ChatFavoritesRepositoryClient.getLocalFavoritesForMigration();
      const supportedSkillId =
        await ChatFavoritesRepositoryClient.getLastAttributedSkillId();
      setAutoPrefillData({
        ...(initialReferralCode ? { referralCode: initialReferralCode } : {}),
        ...(localFavorites.length > 0 ? { localFavorites } : {}),
        ...(supportedSkillId ? { supportedSkillId } : {}),
      });
    })();
  }, [initialReferralCode]);

  return (
    <EndpointsPage
      endpoint={{ POST: signupEndpoints.POST }}
      locale={locale}
      user={user}
      endpointOptions={{
        create: {
          autoPrefillData,
          mutationOptions: {
            onSuccess: () => {
              router.push(`/${locale}`);
            },
          },
        },
      }}
    />
  );
}

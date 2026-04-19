"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { useState } from "react";

import { ChatFavoritesRepositoryClient } from "@/app/api/[locale]/agent/chat/favorites/repository-client";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import signupEndpoints from "@/app/api/[locale]/user/public/signup/definition";
import type { CountryLanguage } from "@/i18n/core/config";

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

  const [autoPrefillData] = useState(() => {
    const localFavorites =
      ChatFavoritesRepositoryClient.getLocalFavoritesForMigration();
    const supportedSkillId =
      ChatFavoritesRepositoryClient.getLastAttributedSkillId();
    return {
      ...(initialReferralCode ? { referralCode: initialReferralCode } : {}),
      ...(localFavorites.length > 0 ? { localFavorites } : {}),
      ...(supportedSkillId ? { supportedSkillId } : {}),
    };
  });

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

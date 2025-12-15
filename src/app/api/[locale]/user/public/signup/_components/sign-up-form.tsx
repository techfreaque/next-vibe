"use client";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import signupEndpoints from "@/app/api/[locale]/user/public/signup/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { useRouter } from "next-vibe-ui/hooks";

interface SignUpFormProps {
  locale: CountryLanguage;
  /** Initial referral code from server-side (lead referrals) */
  initialReferralCode: string | null;
}

/**
 * Client component for signup form with redirect handling
 * Uses EndpointsPage with custom onSuccess logic for redirects
 * Accepts initial referral code from server (from lead referrals database)
 */
export default function SignUpForm({
  locale,
  initialReferralCode,
}: SignUpFormProps): React.JSX.Element {
  const router = useRouter();
  return (
    <EndpointsPage
      endpoint={{ POST: signupEndpoints.POST }}
      locale={locale}
      endpointOptions={{
        create: {
          autoPrefillData: initialReferralCode
            ? {
                formCard: {
                  referralCode: initialReferralCode,
                },
              }
            : undefined,
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

"use client";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import loginEndpoints from "@/app/api/[locale]/user/public/login/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface LoginFormProps {
  locale: CountryLanguage;
  callbackUrl?: string;
}

/**
 * Client component for login form with redirect handling
 * Uses EndpointsPage with custom onSuccess logic for redirects
 */
export function LoginForm({
  locale,
  callbackUrl,
}: LoginFormProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={loginEndpoints}
      locale={locale}
      endpointOptions={{
        create: {
          mutationOptions: {
            onSuccess: () => {
              // Redirect after successful login
              if (callbackUrl) {
                window.location.href = callbackUrl;
              } else {
                window.location.href = `/${locale}`;
              }
            },
          },
        },
      }}
    />
  );
}

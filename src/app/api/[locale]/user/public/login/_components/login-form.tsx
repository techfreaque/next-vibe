"use client";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import loginEndpoints from "@/app/api/[locale]/user/public/login/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

interface LoginFormProps {
  locale: CountryLanguage;
  callbackUrl?: string;
  user: JwtPayloadType;
}

/**
 * Client component for login form with redirect handling
 * Uses EndpointsPage with custom onSuccess logic for redirects
 */
export function LoginForm({
  locale,
  callbackUrl,
  user,
}: LoginFormProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={loginEndpoints}
      locale={locale}
      user={user}
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

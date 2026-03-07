"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { useCallback, useState } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { DEV_SEED_USERS } from "@/app/api/[locale]/user/dev-seed-users";
import loginEndpoints from "@/app/api/[locale]/user/public/login/definition";
import { scopedTranslation } from "@/app/api/[locale]/user/public/login/i18n";
import {
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/config/constants";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

interface LoginFormProps {
  locale: CountryLanguage;
  callbackUrl?: string;
  user: JwtPayloadType;
  devSeedPassword: string | null;
  devSeedUsers: typeof DEV_SEED_USERS | null;
}

/**
 * Dev-only quick login buttons for seeded test users
 */
function DevQuickLogin({
  locale,
  callbackUrl,
  devSeedPassword,
  devSeedUsers,
}: {
  locale: CountryLanguage;
  callbackUrl?: string;
  devSeedPassword: string | null;
  devSeedUsers: typeof DEV_SEED_USERS | null;
}): React.JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const handleQuickLogin = useCallback(
    async (email: string) => {
      setLoadingEmail(email);
      try {
        const csrfCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`))
          ?.split("=")[1];
        const response = await fetch(
          `/api/${locale}/${loginEndpoints.POST.path.join("/")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(csrfCookie ? { [CSRF_TOKEN_HEADER_NAME]: csrfCookie } : {}),
            },
            body: JSON.stringify({
              email,
              password: devSeedPassword,
              rememberMe: true,
            }),
          },
        );

        if (response.ok) {
          window.location.assign(callbackUrl ?? `/${locale}`);
        } else {
          setLoadingEmail(null);
        }
      } catch {
        setLoadingEmail(null);
      }
    },
    [locale, callbackUrl, devSeedPassword],
  );

  return (
    <Div className="mt-6 border-t border-gray-700 pt-6">
      <P className="text-sm text-gray-400 mb-3 text-center">
        {t("dev.quickLogin")}
      </P>
      <Div className="flex flex-col gap-2">
        {devSeedUsers?.map((seedUser) => (
          <Button
            key={seedUser.email}
            variant="outline"
            size="sm"
            disabled={loadingEmail !== null}
            onClick={() => handleQuickLogin(seedUser.email)}
            className="justify-between"
          >
            <Span>{seedUser.email}</Span>
            <Span className="text-xs opacity-60">{seedUser.role}</Span>
          </Button>
        ))}
      </Div>
    </Div>
  );
}

/**
 * Client component for login form with redirect handling
 * Uses EndpointsPage with custom onSuccess logic for redirects
 */
export function LoginForm({
  locale,
  callbackUrl,
  user,
  devSeedPassword,
  devSeedUsers,
}: LoginFormProps): React.JSX.Element {
  return (
    <>
      <EndpointsPage
        endpoint={loginEndpoints}
        locale={locale}
        user={user}
        endpointOptions={{
          create: {
            mutationOptions: {
              onSuccess: () => {
                // Redirect after successful login
                window.location.assign(callbackUrl ?? `/${locale}`);
              },
            },
          },
        }}
      />
      {envClient.NODE_ENV === "development" && (
        <DevQuickLogin
          locale={locale}
          callbackUrl={callbackUrl}
          devSeedPassword={devSeedPassword}
          devSeedUsers={devSeedUsers}
        />
      )}
    </>
  );
}

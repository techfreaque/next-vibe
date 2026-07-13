"use client";

import { useApiMutation } from "next-vibe/platforms/react/hooks/use-api-mutation";
import { assignUrl } from "next-vibe/ui/lib/location";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import { P } from "next-vibe/ui/ui/typography";
import { useCallback, useRef, useState } from "react";

const DEFAULT_PASSWORD_SENTINEL = "change-me-now";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { SYSTEM_SETTINGS_ALIAS } from "next-vibe/env/settings/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";

import { envClient } from "@/env/env-client";
import type { DEV_SEED_USERS } from "@/user/dev-seed-users";
import loginEndpoints from "@/user/public/login/definition";
import { scopedTranslation } from "@/user/public/login/i18n";

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
  user,
}: {
  locale: CountryLanguage;
  callbackUrl?: string;
  devSeedPassword: string | null;
  devSeedUsers: typeof DEV_SEED_USERS | null;
  user: JwtPayloadType;
}): React.JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const logger = useLogger();
  // Typed login mutation — the client route handler attaches CSRF + cookies.
  const loginMutation = useApiMutation(loginEndpoints.POST, logger, user);

  const handleQuickLogin = useCallback(
    async (email: string) => {
      setLoadingEmail(email);
      const result = await loginMutation.mutateAsync({
        requestData: {
          email,
          password: devSeedPassword ?? "",
          rememberMe: true,
        },
      });
      if (result.success) {
        const target =
          devSeedPassword === DEFAULT_PASSWORD_SENTINEL
            ? `/${locale}/tools/${SYSTEM_SETTINGS_ALIAS}`
            : (callbackUrl ?? `/${locale}`);
        assignUrl(target);
      } else {
        setLoadingEmail(null);
      }
    },
    [locale, callbackUrl, devSeedPassword, loginMutation],
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
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Div ref={formRef}>
        <EndpointsPage
          endpoint={loginEndpoints}
          locale={locale}
          user={user}
          endpointOptions={{
            create: {
              mutationOptions: {
                onSuccess: ({ requestData }) => {
                  const usedDefaultPassword =
                    requestData.password === DEFAULT_PASSWORD_SENTINEL;
                  const target = usedDefaultPassword
                    ? `/${locale}/tools/${SYSTEM_SETTINGS_ALIAS}`
                    : (callbackUrl ?? `/${locale}`);
                  assignUrl(target);
                },
              },
            },
          }}
        />
      </Div>
      {envClient.NODE_ENV === "development" && (
        <DevQuickLogin
          locale={locale}
          callbackUrl={callbackUrl}
          devSeedPassword={devSeedPassword}
          devSeedUsers={devSeedUsers}
          user={user}
        />
      )}
    </>
  );
}

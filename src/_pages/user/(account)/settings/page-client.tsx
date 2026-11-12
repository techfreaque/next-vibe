"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import meDefinition from "@/user/private/me/definition";

import { scopedTranslation as pageT } from "./i18n";

export interface SettingsPageClientProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
}

export function SettingsPageClient({
  locale,
  isAuthenticated,
  user,
  platform,
}: SettingsPageClientProps): JSX.Element {
  const logger = useLogger();
  const { t } = pageT.scopedT(locale);

  if (!isAuthenticated) {
    return (
      <Div className="bg-background px-4 py-16 sm:py-24">
        <Div className="mx-auto flex max-w-sm flex-col items-center gap-5 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <Span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </Span>
          <Div className="flex flex-col gap-1.5">
            <H1 className="m-0 text-xl font-semibold tracking-tight lg:text-xl">
              {t("unauthenticated.title")}
            </H1>
            <P className="m-0 text-sm text-muted-foreground">
              {t("unauthenticated.subtitle")}
            </P>
          </Div>
          <Div className="flex w-full flex-col gap-2">
            <Link href={`/${locale}/user/login`} className="w-full">
              <Button className="h-11 w-full gap-2">
                <LogIn className="h-4 w-4" />
                {t("unauthenticated.logIn")}
              </Button>
            </Link>
            <Link href={`/${locale}/user/signup`} className="w-full">
              <Button variant="outline" className="h-11 w-full gap-2">
                <UserPlus className="h-4 w-4" />
                {t("unauthenticated.signUp")}
              </Button>
            </Link>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="bg-background">
      {/* Widgets bring their own 16px gutter (WidgetShell p-4) — the header matches it */}
      <Div className="mx-auto flex max-w-3xl flex-col gap-2 py-8 sm:py-12">
        <Div className="flex flex-col gap-1 px-4">
          <H1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-3xl">
            {t("title")}
          </H1>
          <P className="m-0 text-sm text-muted-foreground">
            {t("description")}
          </P>
        </Div>
        <EndpointsPage
          logger={logger}
          endpoint={meDefinition}
          forceMethod="POST"
          user={user}
          locale={locale}
          platform={platform}
          endpointOptions={{
            create: { formOptions: { persistForm: false } },
          }}
        />
      </Div>
    </Div>
  );
}

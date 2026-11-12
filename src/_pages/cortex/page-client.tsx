"use client";

import cortexListDefinitions from "next-vibe/agent/cortex/list/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Brain } from "next-vibe/ui/components/icons/Brain";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Link } from "next-vibe/ui/components/link";
import { H1, H3, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

interface CortexPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

export function CortexPageClient({
  locale,
  user,
  platform,
}: CortexPageClientProps): JSX.Element {
  const logger = useLogger();
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="bg-background min-h-screen">
      <Div className="container max-w-3xl mx-auto py-8 px-4">
        <Link
          href={`/${locale}/threads/private/new`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("backToChat")}
        </Link>

        <Div className="flex items-center gap-3 mb-1">
          <Div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </Div>
          <H1 className="text-2xl font-bold">{t("title")}</H1>
        </Div>
        <P className="text-muted-foreground text-sm mb-8">{t("description")}</P>

        {user.isPublic ? (
          <Div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
            <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </Div>
            <Div className="flex flex-col gap-2">
              <H3 className="m-0 text-xl font-semibold tracking-tight">
                {t("signIn.title")}
              </H3>
              <P className="m-0 text-sm text-muted-foreground">
                {t("signIn.description")}
              </P>
            </Div>
            <Div className="flex w-full flex-col gap-2">
              <Button asChild className="h-11 w-full gap-2">
                <Link
                  href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/cortex`)}`}
                >
                  <LogIn className="h-4 w-4" />
                  {t("signIn.logIn")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full gap-2">
                <Link href={`/${locale}/user/signup`}>
                  <UserPlus className="h-4 w-4" />
                  {t("signIn.signUp")}
                </Link>
              </Button>
            </Div>
          </Div>
        ) : (
          <Div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <EndpointsPage
              logger={logger}
              endpoint={cortexListDefinitions}
              locale={locale}
              user={user}
              platform={platform}
              endpointOptions={{
                read: {
                  queryOptions: {
                    staleTime: 0,
                    refetchOnWindowFocus: true,
                  },
                },
              }}
            />
          </Div>
        )}
      </Div>
    </Div>
  );
}

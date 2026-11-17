"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Key } from "next-vibe/ui/components/icons/Key";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { API_DOCS_PATH, API_KEYS_PAGE_PATH } from "@/api-keys/constants";
import apiKeysEndpoints from "@/api-keys/definition";

import { scopedTranslation as pageT } from "./i18n";

export interface ApiKeysPageClientProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
  modelCount: number;
  subPrice: string;
}

export function ApiKeysPageClient({
  locale,
  isAuthenticated,
  user,
  platform,
  modelCount,
  subPrice,
}: ApiKeysPageClientProps): JSX.Element {
  const logger = useLogger();
  const { t } = pageT.scopedT(locale);
  const docsHref = `/${locale}/${API_DOCS_PATH}`;

  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(`/${locale}/${API_KEYS_PAGE_PATH}`);
    return (
      <Div className="bg-background px-4 py-16 sm:py-24">
        <Div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <Span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Key className="h-5 w-5" />
          </Span>
          <Div className="flex flex-col gap-2">
            <H1 className="m-0 text-xl font-semibold tracking-tight lg:text-xl">
              {t("unauthenticated.title")}
            </H1>
            <P className="m-0 text-sm text-muted-foreground">
              {t("unauthenticated.subtitle", { subPrice })}
            </P>
          </Div>
          <Div className="flex w-full flex-col gap-2.5 text-left">
            {[
              t("unauthenticated.point1", { modelCount }),
              t("unauthenticated.point2"),
              t("unauthenticated.point3"),
            ].map((point) => (
              <Div key={point} className="flex items-start gap-3 text-sm">
                <Span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Check className="h-3 w-3 text-success" />
                </Span>
                <Span className="text-foreground/80">{point}</Span>
              </Div>
            ))}
          </Div>
          <Div className="flex w-full flex-col gap-2">
            <Button asChild className="h-11 w-full gap-2">
              <Link href={`/${locale}/user/signup?callbackUrl=${callbackUrl}`}>
                <UserPlus className="h-4 w-4" />
                {t("unauthenticated.signUp")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 w-full gap-2">
              <Link href={`/${locale}/user/login?callbackUrl=${callbackUrl}`}>
                <LogIn className="h-4 w-4" />
                {t("unauthenticated.logIn")}
              </Link>
            </Button>
          </Div>
          <Link
            href={docsHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <BookOpen className="h-4 w-4" />
            {t("unauthenticated.docs")}
          </Link>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="bg-background">
      {/* The widget brings its own header, intro, docs link and 16px gutter. */}
      <Div className="mx-auto flex max-w-3xl flex-col gap-2 py-6 sm:py-10">
        <H1 className="sr-only">{t("title")}</H1>
        <EndpointsPage
          logger={logger}
          endpoint={apiKeysEndpoints}
          forceMethod="GET"
          user={user}
          locale={locale}
          platform={platform}
        />
      </Div>
    </Div>
  );
}

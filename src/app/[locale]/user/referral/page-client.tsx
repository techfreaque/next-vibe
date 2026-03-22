"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Link } from "next-vibe-ui/ui/link";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import referralCodesListDefinition from "@/app/api/[locale]/referral/codes/list/definition";
import referralDefinition from "@/app/api/[locale]/referral/definition";
import referralPayoutDefinition from "@/app/api/[locale]/referral/payout/definition";
import referralStatsDefinition from "@/app/api/[locale]/referral/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { translations as configTranslations } from "@/config/i18n/en";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";

export function ReferralPageClient({
  locale,
  isAuthenticated,
  user,
}: {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
}): JSX.Element {
  const { t } = pageT.scopedT(locale);

  return (
    <Div className="w-full min-h-screen">
      {/* Background gradient */}
      <Div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-background to-background -z-10" />

      <Div className="container px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/threads`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToChat")}
        </Link>

        {/* Hero Section */}
        <Div className="mb-12">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Gift className="h-3.5 w-3.5" />
            {t("tagline")}
          </Badge>
          <H1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("title", { appName: configTranslations.appName })}
          </H1>
          <P className="text-muted-foreground text-lg max-w-2xl">
            {t("description", { appName: configTranslations.appName })}
          </P>
        </Div>

        {/* Stats + How It Works + Withdraw info (authenticated only) */}
        {isAuthenticated && (
          <>
            <Div className="mb-12">
              <H2 className="text-xl font-semibold mb-4">
                {t("overview.title")}
              </H2>
              <EndpointsPage
                endpoint={referralStatsDefinition}
                user={user}
                locale={locale}
              />
            </Div>
            <Div className="mb-12">
              <EndpointsPage
                endpoint={referralPayoutDefinition}
                user={user}
                locale={locale}
              />
            </Div>
          </>
        )}

        {/* Authenticated: Show Create Code + Codes List */}
        {isAuthenticated ? (
          <>
            {/* Create New Code Section */}
            <Card className="mb-8">
              <CardHeader>
                <Div className="flex items-center justify-between">
                  <Div>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {t("createCode.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("manage.createSubtitle")}
                    </CardDescription>
                  </Div>
                </Div>
              </CardHeader>
              <CardContent>
                <EndpointsPage
                  endpoint={referralDefinition}
                  user={user}
                  locale={locale}
                />
              </CardContent>
            </Card>

            {/* Referral Codes List - Full Width */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  {t("myCodes.title")}
                </CardTitle>
                <CardDescription>{t("manage.codesSubtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointsPage
                  endpoint={referralCodesListDefinition}
                  user={user}
                  locale={locale}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          /* Not Authenticated: Show Sign Up / Login CTA */
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <CardContent className="pt-8 pb-8">
              <Div className="text-center space-y-6">
                <Div className="mx-auto w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </Div>
                <Div className="space-y-2">
                  <H3 className="text-xl font-semibold">{t("cta.title")}</H3>
                  <P className="text-muted-foreground max-w-md mx-auto">
                    {t("cta.description")}
                  </P>
                </Div>
                <Div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="gap-2">
                    <Link href={`/${locale}/user/signup`}>
                      <UserPlus className="h-4 w-4" />
                      {t("cta.signUp")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link
                      href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/user/referral`)}`}
                    >
                      <LogIn className="h-4 w-4" />
                      {t("cta.logIn")}
                    </Link>
                  </Button>
                </Div>
              </Div>
            </CardContent>
          </Card>
        )}
      </Div>
    </Div>
  );
}

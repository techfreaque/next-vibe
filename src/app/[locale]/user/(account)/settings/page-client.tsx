"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Link } from "next-vibe-ui/ui/link";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import meDefinition from "@/app/api/[locale]/user/private/me/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";

export interface SettingsPageClientProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
}

export function SettingsPageClient({
  locale,
  isAuthenticated,
  user,
}: SettingsPageClientProps): JSX.Element {
  const { t } = pageT.scopedT(locale);

  if (!isAuthenticated) {
    return (
      <Div className="min-h-screen bg-background">
        <Div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <CardContent className="pt-10 pb-10">
              <Div className="text-center space-y-6 max-w-sm mx-auto">
                <H2 className="text-xl font-semibold">
                  {t("unauthenticated.title")}
                </H2>
                <P className="text-muted-foreground">
                  {t("unauthenticated.subtitle")}
                </P>
                <Div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/${locale}/user/login`}>
                    <Button variant="outline" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      {t("unauthenticated.logIn")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/user/signup`}>
                    <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                      <UserPlus className="h-4 w-4" />
                      {t("unauthenticated.signUp")}
                    </Button>
                  </Link>
                </Div>
              </Div>
            </CardContent>
          </Card>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="min-h-screen bg-background">
      <Div className="max-w-2xl mx-auto px-4 py-10">
        <EndpointsPage
          endpoint={meDefinition}
          forceMethod="POST"
          user={user}
          locale={locale}
          endpointOptions={{
            create: { formOptions: { persistForm: false } },
          }}
        />
      </Div>
    </Div>
  );
}

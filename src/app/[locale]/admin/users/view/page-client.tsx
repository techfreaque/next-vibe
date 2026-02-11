/**
 * User View Page Client Component
 * Uses EndpointsPage to render user view endpoint
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft, User } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import userViewDefinition from "@/app/api/[locale]/users/view/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function UserViewPageClient({
  locale,
  user,
  userId,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userId?: string;
}): JSX.Element {
  const { t } = simpleT(locale);

  if (!userId) {
    return (
      <Div className="w-full min-h-screen">
        <Div className="container px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/${locale}/admin/users/list`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("app.admin.users.actions.backToList")}
          </Link>

          {/* Error State */}
          <Card>
            <CardContent className="pt-8 pb-8">
              <Div className="text-center space-y-6">
                <Div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </Div>
                <Div className="space-y-2">
                  <P className="text-muted-foreground">
                    {t("app.api.users.view.errors.validation.title")}
                  </P>
                  <P className="text-sm text-muted-foreground">
                    {t("app.api.users.view.errors.validation.description")}
                  </P>
                </Div>
                <Button asChild>
                  <Link href={`/${locale}/admin/users/list`}>
                    {t("app.admin.users.actions.backToList")}
                  </Link>
                </Button>
              </Div>
            </CardContent>
          </Card>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="w-full min-h-screen">
      <Div className="container px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/admin/users/list`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("app.admin.users.actions.backToList")}
        </Link>

        {/* Hero Section */}
        <Div className="mb-12">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <User className="h-3.5 w-3.5" />
            {t("app.api.users.view.badge")}
          </Badge>
          <H1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("app.api.users.view.get.title")}
          </H1>
          <P className="text-muted-foreground text-lg max-w-2xl">
            {t("app.api.users.view.get.description")}
          </P>
        </Div>

        {/* User View Endpoint */}
        <EndpointsPage
          endpoint={userViewDefinition}
          user={user}
          locale={locale}
          endpointOptions={{
            read: {
              initialState: { userId },
            },
          }}
        />
      </Div>
    </Div>
  );
}

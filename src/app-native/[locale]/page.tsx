/**
 * Next.js-style page component for React Native compatibility testing
 *
 * This file uses Next.js 15 conventions:
 * - Async Server Component
 * - Params as Promise (Next.js 15 requirement)
 * - TypeScript with proper types
 *
 * The index.tsx wrapper handles converting this to work with Expo Router
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface HomePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function HomePage({
  params,
}: HomePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  return (
    <Div className="flex-1 p-6 bg-background">
      <Div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Div className="text-center space-y-2">
          <H1>{t("app.native.page.welcome", { appName: t("config.appName") })}</H1>
            <P className="text-muted-foreground">
              {t("app.native.page.description")} {locale}
            </P>
        </Div>

        {/* Locale Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("app.native.page.locale.title")}</CardTitle>
            <CardDescription>
              {t("app.native.page.locale.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Div className="flex flex-row items-center space-x-2">
              <Span className="text-2xl font-bold text-primary">{locale}</Span>
            </Div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("app.native.page.features.title")}</CardTitle>
            <CardDescription>
              {t("app.native.page.features.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Div>
              <H2 className="text-lg mb-2">{t("app.native.page.features.unified.title")}</H2>
              <P className="text-muted-foreground">
                {t("app.native.page.features.unified.description")}
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">{t("app.native.page.features.types.title")}</H2>
              <P className="text-muted-foreground">
                {t("app.native.page.features.types.description")}
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">{t("app.native.page.features.async.title")}</H2>
              <P className="text-muted-foreground">
                {t("app.native.page.features.async.description")}
              </P>
            </Div>
          </CardContent>
          <CardFooter>
            <Div>
              <Link href={`/${locale}`} asChild>
                {/* <Button className="w-full"> */}
                <Span>{t("app.native.page.links.chat")}</Span>
                {/* </Button> */}
              </Link>
              <Link href={`/${locale}/help`} asChild>
                {/* <Button className="w-full"> */}
                <Span>{t("app.native.page.links.help")}</Span>
                {/* </Button> */}
              </Link>
              <Link href={`/${locale}/story/about-us`} asChild>
                {/* <Button className="w-full"> */}
                <Span>{t("app.native.page.links.about")}</Span>
                {/* </Button> */}
              </Link>
            </Div>
          </CardFooter>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("app.native.page.status.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="space-y-2">
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">{t("app.native.page.status.platform")}:</Span>
                <Span className="font-medium">{t("app.native.page.status.universal")}</Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">{t("app.native.page.status.routing")}:</Span>
                <Span className="font-medium">{t("app.native.page.status.filebased")}</Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">{t("app.native.page.status.styling")}:</Span>
                <Span className="font-medium">{t("app.native.page.status.nativewind")}</Span>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}

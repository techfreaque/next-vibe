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

import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { Button } from "@/packages/next-vibe-ui/native/ui/button";

import { scopedTranslation } from "./i18n";

interface HomePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function HomePage({
  params,
}: HomePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return (
    <Div className="flex-1 p-6 bg-background">
      <Div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <Div className="text-center flex flex-col gap-2">
          <H1>{t("page.welcome", { appName: configT("appName") })}</H1>
          <P className="text-muted-foreground">
            {t("page.description")} {locale}
          </P>
        </Div>

        {/* Locale Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("page.locale.title")}</CardTitle>
            <CardDescription>{t("page.locale.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Div className="flex-row items-center flex gap-2">
              <Span className="text-2xl font-bold text-primary">{locale}</Span>
            </Div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("page.features.title")}</CardTitle>
            <CardDescription>{t("page.features.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Div>
              <H2 className="text-lg mb-2">
                {t("page.features.unified.title")}
              </H2>
              <P className="text-muted-foreground">
                {t("page.features.unified.description")}
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">{t("page.features.types.title")}</H2>
              <P className="text-muted-foreground">
                {t("page.features.types.description")}
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">{t("page.features.async.title")}</H2>
              <P className="text-muted-foreground">
                {t("page.features.async.description")}
              </P>
            </Div>
          </CardContent>
          <CardFooter>
            <Div>
              <Link href={`/${locale}`}>
                <Button className="w-full">
                  <Span>{t("page.links.chat")}</Span>
                </Button>
              </Link>
              <Link href={`/${locale}/help`}>
                <Button className="w-full">
                  <Span>{t("page.links.help")}</Span>
                </Button>
              </Link>
              <Link href={`/${locale}/story/about-us`}>
                <Button className="w-full">
                  <Span>{t("page.links.about")}</Span>
                </Button>
              </Link>
              <Link href={`/${locale}/story`}>
                <Button>
                  <Span>{t("page.links.story")}</Span>
                </Button>
              </Link>
              <Link href={`/${locale}/design-test`}>
                {/* <Button> */}
                {t("page.links.designTest")}
                {/* </Button> */}
              </Link>
            </Div>
          </CardFooter>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("page.status.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="flex flex-col gap-2">
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">
                  {t("page.status.platform")}:
                </Span>
                <Span className="font-medium">
                  {t("page.status.universal")}
                </Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">
                  {t("page.status.routing")}:
                </Span>
                <Span className="font-medium">
                  {t("page.status.filebased")}
                </Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">
                  {t("page.status.styling")}:
                </Span>
                <Span className="font-medium">
                  {t("page.status.nativewind")}
                </Span>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}

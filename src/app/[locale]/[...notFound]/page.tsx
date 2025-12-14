import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Home } from "next-vibe-ui/ui/icons";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { H1 } from "next-vibe-ui/ui/typography";
import { H2 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { NotFoundBackButton } from "./not-found-client";

interface NotFoundPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the 404 page with translations
 */
export async function generateMetadata({
  params,
}: NotFoundPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "not-found",
    title: "app.meta.notFound.title",
    category: "app.meta.notFound.category",
    description: "app.meta.notFound.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/not-found.jpg`,
    imageAlt: "app.meta.notFound.imageAlt",
    keywords: ["app.meta.notFound.keywords"],
  });
}

/**
 * Custom 404 Not Found page component for language routes
 * Displayed when a user navigates to a non-existent route within a language
 *
 * @returns JSX Element for the 404 page
 */
export default async function NotFound({
  params,
}: NotFoundPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  return (
    <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <Div className="w-full max-w-3xl">
        <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-0 overflow-hidden">
            <Div className="grid md:grid-cols-2">
              {/* Left side - Illustration */}
              <Div className="relative h-64 md:h-full bg-blue-600 dark:bg-blue-800 overflow-hidden">
                <Div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1974')] bg-cover bg-center" />
                <Div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-white">
                  <Div className="animate-float">
                    <Image
                      src="https://illustrations.popsy.co/white/crashed-error.svg"
                      alt={t("app.pages.notFound.title")}
                      width={250}
                      height={250}
                      className="mx-auto"
                    />
                  </Div>
                  <H1 className="text-7xl font-bold mt-4 animate-pulse-slow">
                    404
                  </H1>
                </Div>
              </Div>

              {/* Right side - Content */}
              <Div className="p-8 md:p-10 flex flex-col justify-center">
                <H2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                  {t("app.pages.notFound.title")}
                </H2>
                <P className="text-gray-600 dark:text-gray-300 mb-8">
                  {t("app.pages.notFound.description")}
                </P>

                {/* Buttons */}
                <Div className="flex flex-col sm:flex-row gap-3">
                  <NotFoundBackButton locale={locale} />
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 group"
                  >
                    <Link href={`/${locale}`}>
                      <Home className="mr-2 h-4 w-4" />
                      {t("app.pages.notFound.goHome")}
                    </Link>
                  </Button>
                </Div>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}

import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Award } from "next-vibe-ui/ui/icons/Award";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Handshake } from "next-vibe-ui/ui/icons/Handshake";
import { Heart } from "next-vibe-ui/ui/icons/Heart";
import { Lightbulb } from "next-vibe-ui/ui/icons/Lightbulb";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the About Us page with translations
 */
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "about-us",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Building_perspective.jpg/1920px-Building_perspective.jpg",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription"),
      },
      twitter: {
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription"),
      },
    },
  });
};

/**
 * Value card component for displaying company values
 */
function ValueCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
}): JSX.Element {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <Div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
          {icon}
        </Div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <P className="text-muted-foreground">{description}</P>
      </CardContent>
    </Card>
  );
}

export interface AboutUsPageData {
  locale: CountryLanguage;
  totalModelCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<AboutUsPageData> {
  const { locale } = await params;
  const totalModelCount = getAvailableModelCount(agentEnvAvailability, false);
  return { locale, totalModelCount };
}

export function TanstackPage({
  locale,
  totalModelCount,
}: AboutUsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  // Get values from translations
  const values = [
    {
      title: t("values.excellence.title"),
      description: t("values.excellence.description"),
      icon: <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
      icon: <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("values.integrity.title"),
      description: t("values.integrity.description"),
      icon: <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("values.collaboration.title"),
      description: t("values.collaboration.description"),
      icon: <Handshake className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
  ];

  return (
    <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <Div className="relative bg-blue-600 dark:bg-blue-900 text-white">
        <Div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')] bg-cover bg-center" />
        <Div className="container mx-auto px-4 py-24 relative z-10">
          <Link
            href={`/${locale}/story`}
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>

          <Div className="max-w-3xl">
            <H1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("title", {
                appName: appName,
              })}
            </H1>
            <P className="text-xl md:text-2xl opacity-90 mb-8">
              {t("subtitle")}
            </P>
            <P className="text-lg opacity-80">
              {t("description", {
                appName: appName,
                foundedYear: 2024,
              })}
            </P>
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <Div className="mb-24">
          <Div className="max-w-4xl mx-auto text-center mb-16">
            <H2 className="text-4xl font-bold mb-6">{t("mission.title")}</H2>
            <P className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-8">
              {t("mission.subtitle")}
            </P>
            <P className="text-lg text-muted-foreground leading-relaxed">
              {t("mission.description", {
                appName: appName,
              })}
            </P>
          </Div>

          {/* Mission Cards Grid */}
          <Div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <Div className="w-14 h-14 rounded-full bg-blue-150 bg-linear-to-br from-blue-100 to-blue-200 dark:bg-blue-850 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mb-4">
                  <Lightbulb className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </Div>
                <CardTitle className="text-xl">
                  {t("mission.vision.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <P className="text-muted-foreground leading-relaxed">
                  {t("mission.vision.description", {
                    appName: appName,
                  })}
                </P>
              </CardContent>
            </Card>

            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-green-500">
              <CardHeader>
                <Div className="w-14 h-14 rounded-full bg-green-150 bg-linear-to-br from-green-100 to-green-200 dark:bg-green-850 dark:from-green-900 dark:to-green-800 flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-green-600 dark:text-green-400" />
                </Div>
                <CardTitle className="text-xl">
                  {t("mission.approach.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <P className="text-muted-foreground leading-relaxed">
                  {t("mission.approach.description")}
                </P>
              </CardContent>
            </Card>

            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-purple-500 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <Div className="w-14 h-14 rounded-full bg-purple-150 bg-linear-to-br from-purple-100 to-purple-200 dark:bg-purple-850 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center mb-4">
                  <Handshake className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </Div>
                <CardTitle className="text-xl">
                  {t("mission.commitment.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <P className="text-muted-foreground leading-relaxed">
                  {t("mission.commitment.description")}
                </P>
              </CardContent>
            </Card>
          </Div>

          {/* Hero Image */}
          <Div className="relative rounded-2xl overflow-hidden h-[400px] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
              alt={t("mission.title")}
              fill
              className="object-cover"
            />
            <Div className="absolute inset-0 bg-black/60 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <Div className="absolute bottom-8 left-8 right-8 text-white">
              <H3 className="text-2xl font-bold mb-2">{appName}</H3>
              <P className="text-lg opacity-90">
                {t("hero.subtitle", {
                  modelCount: totalModelCount,
                  appName: appName,
                })}
              </P>
            </Div>
          </Div>
        </Div>

        {/* Values Section */}
        <Div className="mb-24">
          <Div className="max-w-3xl mx-auto text-center mb-12">
            <H2 className="text-3xl font-bold mb-4">{t("values.title")}</H2>
            <P className="text-lg text-muted-foreground">
              {t("values.description", {
                appName: appName,
              })}
            </P>
          </Div>

          <Div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            ))}
          </Div>
        </Div>

        {/* Contact Section */}
        <Separator className="my-16" />

        <Div className="max-w-3xl mx-auto text-center mb-12">
          <H2 className="text-3xl font-bold mb-4">{t("contact.title")}</H2>
          <P className="text-lg text-muted-foreground">
            {t("contact.description")}
          </P>
        </Div>

        <Div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href={`/${locale}/help`}>{t("contact.cta")}</Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export default async function AboutUsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

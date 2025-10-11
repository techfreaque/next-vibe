import {
  ArrowLeft,
  Award,
  Globe,
  Handshake,
  Heart,
  Lightbulb,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

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
  return metadataGenerator(locale, {
    path: "about-us",
    title: "meta.aboutUs.title",
    category: "meta.aboutUs.category",
    description: "meta.aboutUs.description",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Building_perspective.jpg/1920px-Building_perspective.jpg",
    imageAlt: "meta.aboutUs.imageAlt",
    keywords: ["meta.aboutUs.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.aboutUs.ogTitle",
        description: "meta.aboutUs.ogDescription",
      },
      twitter: {
        title: "meta.aboutUs.twitterTitle",
        description: "meta.aboutUs.twitterDescription",
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
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default async function AboutUsPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);

  // Get values from translations
  const values = [
    {
      title: t("pages.about.values.excellence.title"),
      description: t("pages.about.values.excellence.description"),
      icon: <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("pages.about.values.innovation.title"),
      description: t("pages.about.values.innovation.description"),
      icon: <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("pages.about.values.integrity.title"),
      description: t("pages.about.values.integrity.description"),
      icon: <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: t("pages.about.values.collaboration.title"),
      description: t("pages.about.values.collaboration.description"),
      icon: <Handshake className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
  ];

  return (
    <main className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-blue-600 dark:bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')] bg-cover bg-center" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <Link
            href={`/${locale}/help`}
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("pages.aboutUs.backToHome")}
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("pages.about.title")}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {t("pages.about.subtitle")}
            </p>
            <p className="text-lg opacity-80">{t("pages.about.description")}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              {t("pages.aboutUs.mission.title")}
            </h2>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-8">
              {t("pages.aboutUs.mission.subtitle")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("pages.aboutUs.mission.description")}
            </p>
          </div>

          {/* Mission Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-blue-150 bg-gradient-to-br from-blue-100 to-blue-200 dark:bg-blue-850 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mb-4">
                  <Lightbulb className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">
                  {t("pages.aboutUs.mission.vision.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("pages.aboutUs.mission.vision.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-green-500">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-green-150 bg-gradient-to-br from-green-100 to-green-200 dark:bg-green-850 dark:from-green-900 dark:to-green-800 flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">
                  {t("pages.aboutUs.mission.approach.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("pages.aboutUs.mission.approach.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full transition-all hover:shadow-lg border-l-4 border-l-purple-500 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-purple-150 bg-gradient-to-br from-purple-100 to-purple-200 dark:bg-purple-850 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center mb-4">
                  <Handshake className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">
                  {t("pages.aboutUs.mission.commitment.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("pages.aboutUs.mission.commitment.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
              alt={t("pages.aboutUs.mission.title")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {t("common.logoPart1")} {t("common.logoPart2")}
              </h3>
              <p className="text-lg opacity-90">
                {t("pages.home.hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("pages.about.values.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("pages.aboutUs.values.list")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <Separator className="my-16" />

        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t("pages.aboutUs.contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pages.aboutUs.contact.description", {
              supportEmail: supportEmail,
            })}
          </p>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href={`/${locale}/help`}>
              {t("pages.aboutUs.contact.button")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

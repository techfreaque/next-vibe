import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    title: t("meta.title"),
    description: t("meta.description"),
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle"),
        description: t("meta.ogDescription"),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/careers`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle"),
        description: t("meta.twitterDescription"),
      },
    },
    path: "careers",
    category: t("meta.category"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/careers-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
}

interface JobPosition {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  department: string;
  postedDate: string;
  applicationDeadline: string;
}

export interface CareersPageData {
  locale: CountryLanguage;
  openPositions: readonly JobPosition[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<CareersPageData> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const openPositions: readonly JobPosition[] = [
    {
      id: "socialMediaManager",
      title: t("jobs.socialMediaManager.title"),
      description: t("jobs.socialMediaManager.shortDescription"),
      type: "Full-time",
      location: t("jobs.socialMediaManager.location"),
      department: t("jobs.socialMediaManager.department"),

      // current date - 2.5 weeks
      postedDate: new Date(
        Date.now() - 2.5 * 7 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(locale),
      // current date + 1 month
      applicationDeadline: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(locale),
    },
    {
      id: "contentCreator",
      title: t("jobs.contentCreator.title"),
      description: t("jobs.contentCreator.shortDescription"),
      type: "Full-time",
      location: t("jobs.contentCreator.location"),
      department: t("jobs.contentCreator.department"),
      // current date - 2.5 weeks
      postedDate: new Date(
        Date.now() - 2.5 * 7 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(locale),
      // current date + 1 month
      applicationDeadline: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(locale),
    },
  ];

  return { locale, openPositions };
}

export function TanstackPage({
  locale,
  openPositions,
}: CareersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-6xl mx-auto py-8 px-4">
        <Div className="max-w-4xl mx-auto">
          <H1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-br from-cyan-500 to-blue-600">
            {t("title")}
          </H1>

          <P className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t("description", {
              appName: configT("appName"),
            })}
          </P>

          {/* Hero Section with Image */}
          <Div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl mb-12">
            <Div className="absolute inset-0 bg-blue-600/20 bg-linear-to-br from-blue-600/20 to-cyan-500/20 z-10" />
            <Div className="absolute inset-0 bg-black/60 bg-linear-to-t from-black/60 to-transparent z-10" />
            <Div className="absolute bottom-0 left-0 p-8 z-20 text-white">
              <H2 className="text-3xl font-bold mb-2">{t("joinTeam")}</H2>
              <P className="text-lg max-w-lg">{t("subtitle")}</P>
            </Div>
          </Div>

          <Div className="mb-12">
            <H2 className="text-2xl font-semibold mb-4">
              {t("whyWorkWithUs")}
            </H2>
            <P className="text-gray-700 dark:text-gray-300 mb-6">
              {t("workplaceDescription")}
            </P>
            <Div className="grid md:grid-cols-2 gap-6">
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.growthTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.growthDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.meaningfulTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.meaningfulDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.balanceTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.balanceDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.compensationTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.compensationDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.innovationTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.innovationDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("benefits.teamTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("benefits.teamDesc")}
                </P>
              </Div>
            </Div>
          </Div>

          <Div className="mb-12">
            <H2 className="text-2xl font-semibold mb-6">
              {t("openPositions")}
            </H2>
            <Div className="grid md:grid-cols-2 gap-8">
              {openPositions.map((position) => (
                <Div
                  key={position.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
                >
                  <H3 className="text-xl font-bold mb-2">{position.title}</H3>
                  <P className="text-gray-700 dark:text-gray-300 mb-4">
                    {position.description}
                  </P>
                  <Div className="flex flex-col gap-2 mb-4">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("jobDetail.department")}:
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.department}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("jobDetail.employmentType")}:
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.type}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("jobDetail.location")}:
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.location}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("jobDetail.applicationDeadline")}:
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.applicationDeadline}
                      </Span>
                    </Div>
                  </Div>
                  <Div className="flex flex-row gap-3">
                    <Button className="flex-1" asChild>
                      <Link href={`/${locale}/story/careers/${position.id}`}>
                        {t("jobDetail.moreDetails")}
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link
                        href={`mailto:${contactClientRepository.getSupportEmail(locale)}?subject=Application for ${position.title}`}
                      >
                        {t("applyNow")}
                      </Link>
                    </Button>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          <Div className="text-center bg-blue-50 bg-linear-to-br from-blue-50 to-cyan-50 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
            <H2 className="text-2xl font-semibold mb-4">{t("readyToJoin")}</H2>
            <P className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t("explorePositions")}
            </P>
            <Button size="lg" asChild>
              <Link href={`/${locale}/help`}>{t("getInTouch")}</Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export default async function CareersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

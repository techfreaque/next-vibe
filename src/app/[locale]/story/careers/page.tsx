import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    title: "app.meta.careers.title",
    description: "app.meta.careers.description",
    additionalMetadata: {
      openGraph: {
        title: "app.meta.careers.ogTitle",
        description: "app.meta.careers.ogDescription",
        url: `https://unbottled.ai/${locale}/careers`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.careers.twitterTitle",
        description: "app.meta.careers.twitterDescription",
      },
    },
    path: "careers",
    category: "app.meta.careers.category",
    image: "https://unbottled.ai/images/careers-hero.jpg",
    imageAlt: "app.meta.careers.imageAlt",
    keywords: ["app.meta.careers.keywords"],
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

export default async function CareersPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const openPositions: readonly JobPosition[] = [
    {
      id: "socialMediaManager",
      title: t("app.site.careers.jobs.socialMediaManager.title"),
      description: t(
        "app.site.careers.jobs.socialMediaManager.shortDescription",
      ),
      type: "Full-time",
      location: t("app.site.careers.jobs.socialMediaManager.location"),
      department: t("app.site.careers.jobs.socialMediaManager.department"),

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
      title: t("app.site.careers.jobs.contentCreator.title"),
      description: t("app.site.careers.jobs.contentCreator.shortDescription"),
      type: "Full-time",
      location: t("app.site.careers.jobs.contentCreator.location"),
      department: t("app.site.careers.jobs.contentCreator.department"),
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

  return (
    <div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.site.careers.title")}
          </h1>

          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t("app.site.careers.description", {
              appName: t("app.common.appName"),
            })}
          </p>

          {/* Hero Section with Image */}
          <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl mb-12">
            <div className="absolute inset-0 bg-blue-600/20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 z-10" />
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
              <h2 className="text-3xl font-bold mb-2">
                {t("app.site.careers.joinTeam")}
              </h2>
              <p className="text-lg max-w-lg">
                {t("app.site.careers.subtitle")}
              </p>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {t("app.site.careers.whyWorkWithUs")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t("app.site.careers.workplaceDescription")}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.growthTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.growthDesc")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.meaningfulTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.meaningfulDesc")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.balanceTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.balanceDesc")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.compensationTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.compensationDesc")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.innovationTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.innovationDesc")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.site.careers.benefits.teamTitle")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("app.site.careers.benefits.teamDesc")}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {t("app.site.careers.openPositions")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {openPositions.map((position) => (
                <div
                  key={position.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
                >
                  <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {position.description}
                  </p>
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("app.site.careers.jobDetail.department")}:
                      </span>
                      <span className="text-sm font-medium">
                        {position.department}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("app.site.careers.jobDetail.employmentType")}:
                      </span>
                      <span className="text-sm font-medium">
                        {position.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("app.site.careers.jobDetail.location")}:
                      </span>
                      <span className="text-sm font-medium">
                        {position.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("app.site.careers.jobDetail.applicationDeadline")}:
                      </span>
                      <span className="text-sm font-medium">
                        {position.applicationDeadline}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button className="flex-1" asChild>
                      <Link href={`/${locale}/careers/${position.id}`}>
                        {t("app.site.careers.jobDetail.moreDetails")}
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link
                        href={`mailto:${contactClientRepository.getSupportEmail(locale)}?subject=Application for ${position.title}`}
                      >
                        {t("app.site.careers.applyNow")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center bg-blue-50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">
              {t("app.site.careers.readyToJoin")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t("app.site.careers.explorePositions")}
            </p>
            <Button size="lg" asChild>
              <Link href={`/${locale}/help`}>{t("app.components.nav.contact")}</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

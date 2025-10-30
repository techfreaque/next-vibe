import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div, Span } from "next-vibe-ui/ui";
import { Link } from "next-vibe-ui/ui/link";
import { H1, H2, H3, P } from "next-vibe-ui/ui";
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
      title: t(
        "app.story._components.home.careers.jobs.socialMediaManager.title",
      ),
      description: t(
        "app.story._components.home.careers.jobs.socialMediaManager.shortDescription",
      ),
      type: "Full-time",
      location: t(
        "app.story._components.home.careers.jobs.socialMediaManager.location",
      ),
      department: t(
        "app.story._components.home.careers.jobs.socialMediaManager.department",
      ),

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
      title: t("app.story._components.home.careers.jobs.contentCreator.title"),
      description: t(
        "app.story._components.home.careers.jobs.contentCreator.shortDescription",
      ),
      type: "Full-time",
      location: t(
        "app.story._components.home.careers.jobs.contentCreator.location",
      ),
      department: t(
        "app.story._components.home.careers.jobs.contentCreator.department",
      ),
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
    <Div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-6xl mx-auto py-8 px-4">
        <Div className="max-w-4xl mx-auto">
          <H1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.careers.title")}
          </H1>

          <P className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t("app.story._components.home.careers.description", {
              appName: t("app.common.appName"),
            })}
          </P>

          {/* Hero Section with Image */}
          <Div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl mb-12">
            <Div className="absolute inset-0 bg-blue-600/20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 z-10" />
            <Div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Div className="absolute bottom-0 left-0 p-8 z-20 text-white">
              <H2 className="text-3xl font-bold mb-2">
                {t("app.story._components.home.careers.joinTeam")}
              </H2>
              <P className="text-lg max-w-lg">
                {t("app.story._components.home.careers.subtitle")}
              </P>
            </Div>
          </Div>

          <section className="mb-12">
            <H2 className="text-2xl font-semibold mb-4">
              {t("app.story._components.home.careers.whyWorkWithUs")}
            </H2>
            <P className="text-gray-700 dark:text-gray-300 mb-6">
              {t("app.story._components.home.careers.workplaceDescription")}
            </P>
            <Div className="grid md:grid-cols-2 gap-6">
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.story._components.home.careers.benefits.growthTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("app.story._components.home.careers.benefits.growthDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t(
                    "app.story._components.home.careers.benefits.meaningfulTitle",
                  )}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t(
                    "app.story._components.home.careers.benefits.meaningfulDesc",
                  )}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t(
                    "app.story._components.home.careers.benefits.balanceTitle",
                  )}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("app.story._components.home.careers.benefits.balanceDesc")}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t(
                    "app.story._components.home.careers.benefits.compensationTitle",
                  )}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t(
                    "app.story._components.home.careers.benefits.compensationDesc",
                  )}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t(
                    "app.story._components.home.careers.benefits.innovationTitle",
                  )}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t(
                    "app.story._components.home.careers.benefits.innovationDesc",
                  )}
                </P>
              </Div>
              <Div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <H3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  {t("app.story._components.home.careers.benefits.teamTitle")}
                </H3>
                <P className="text-gray-700 dark:text-gray-300">
                  {t("app.story._components.home.careers.benefits.teamDesc")}
                </P>
              </Div>
            </Div>
          </section>

          <section className="mb-12">
            <H2 className="text-2xl font-semibold mb-6">
              {t("app.story._components.home.careers.openPositions")}
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
                  <Div className="flex flex-col space-y-2 mb-4">
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "app.story._components.home.careers.jobDetail.department",
                        )}
                        :
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.department}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "app.story._components.home.careers.jobDetail.employmentType",
                        )}
                        :
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.type}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "app.story._components.home.careers.jobDetail.location",
                        )}
                        :
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.location}
                      </Span>
                    </Div>
                    <Div className="flex items-center justify-between">
                      <Span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "app.story._components.home.careers.jobDetail.applicationDeadline",
                        )}
                        :
                      </Span>
                      <Span className="text-sm font-medium">
                        {position.applicationDeadline}
                      </Span>
                    </Div>
                  </Div>
                  <Div className="flex space-x-3">
                    <Button className="flex-1" asChild>
                      <Link href={`/${locale}/careers/${position.id}`}>
                        {t(
                          "app.story._components.home.careers.jobDetail.moreDetails",
                        )}
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link
                        href={`mailto:${contactClientRepository.getSupportEmail(locale)}?subject=Application for ${position.title}`}
                      >
                        {t("app.story._components.home.careers.applyNow")}
                      </Link>
                    </Button>
                  </Div>
                </Div>
              ))}
            </Div>
          </section>

          <section className="text-center bg-blue-50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
            <H2 className="text-2xl font-semibold mb-4">
              {t("app.story._components.home.careers.readyToJoin")}
            </H2>
            <P className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t("app.story._components.home.careers.explorePositions")}
            </P>
            <Button size="lg" asChild>
              <Link href={`/${locale}/help`}>{t("app.nav.contact")}</Link>
            </Button>
          </section>
        </Div>
      </Div>
    </Div>
  );
}

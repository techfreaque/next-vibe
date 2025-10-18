import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

interface JobType {
  title: string;
  shortDescription: string;
  longDescription: string;
  responsibilities: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
  };
  requirements: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
  };
  qualifications: {
    required: {
      item1: string;
      item2: string;
      item3: string;
    };
    preferred: {
      item1: string;
      item2: string;
      item3: string;
    };
  };
  location: string;
  department: string;
  type: string;
  experienceLevel: string;
  postedDate: string;
  applicationDeadline: string;
}

interface Props {
  params: Promise<{
    locale: CountryLanguage;
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, jobId } = await params;
  return metadataGenerator(locale, {
    path: `careers/${jobId}`,
    title: "meta.careers.title",
    description: "meta.careers.description",
    category: "meta.careers.category",
    image: "https://unbottled.ai/images/careers-hero.jpg",
    imageAlt: "meta.careers.imageAlt",
    keywords: ["meta.careers.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.careers.ogTitle",
        description: "meta.careers.ogDescription",
        url: `https://unbottled.ai/${locale}/careers/${jobId}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.careers.twitterTitle",
        description: "meta.careers.twitterDescription",
      },
    },
  });
}

export default async function JobPostingPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale, jobId } = await params;
  const { t } = simpleT(locale);

  // Mock job data - in a real app, this would come from an API or database
  const jobs = {
    socialMediaManager: {
      title: t("pages.careers.jobs.socialMediaManager.title"),
      shortDescription: t(
        "pages.careers.jobs.socialMediaManager.shortDescription",
      ),
      longDescription: t(
        "pages.careers.jobs.socialMediaManager.longDescription",
      ),
      responsibilities: {
        item1: t(
          "pages.careers.jobs.socialMediaManager.responsibilities.item1",
        ),
        item2: t(
          "pages.careers.jobs.socialMediaManager.responsibilities.item2",
        ),
        item3: t(
          "pages.careers.jobs.socialMediaManager.responsibilities.item3",
        ),
        item4: t(
          "pages.careers.jobs.socialMediaManager.responsibilities.item4",
        ),
        item5: t(
          "pages.careers.jobs.socialMediaManager.responsibilities.item5",
        ),
      },
      requirements: {
        item1: t("pages.careers.jobs.socialMediaManager.requirements.item1"),
        item2: t("pages.careers.jobs.socialMediaManager.requirements.item2"),
        item3: t("pages.careers.jobs.socialMediaManager.requirements.item3"),
        item4: t("pages.careers.jobs.socialMediaManager.requirements.item4"),
        item5: t("pages.careers.jobs.socialMediaManager.requirements.item5"),
      },
      qualifications: {
        required: {
          item1: t(
            "pages.careers.jobs.socialMediaManager.qualifications.required.item1",
          ),
          item2: t(
            "pages.careers.jobs.socialMediaManager.qualifications.required.item2",
          ),
          item3: t(
            "pages.careers.jobs.socialMediaManager.qualifications.required.item3",
          ),
        },
        preferred: {
          item1: t(
            "pages.careers.jobs.socialMediaManager.qualifications.preferred.item1",
          ),
          item2: t(
            "pages.careers.jobs.socialMediaManager.qualifications.preferred.item2",
          ),
          item3: t(
            "pages.careers.jobs.socialMediaManager.qualifications.preferred.item3",
          ),
        },
      },
      location: t("pages.careers.jobs.socialMediaManager.location"),
      department: t("pages.careers.jobs.socialMediaManager.department"),
      type: t("pages.careers.jobs.socialMediaManager.type"),
      experienceLevel: t(
        "pages.careers.jobs.socialMediaManager.experienceLevel",
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
    contentCreator: {
      title: t("pages.careers.jobs.contentCreator.title"),
      shortDescription: t("pages.careers.jobs.contentCreator.shortDescription"),
      longDescription: t("pages.careers.jobs.contentCreator.longDescription"),
      responsibilities: {
        item1: t("pages.careers.jobs.contentCreator.responsibilities.item1"),
        item2: t("pages.careers.jobs.contentCreator.responsibilities.item2"),
        item3: t("pages.careers.jobs.contentCreator.responsibilities.item3"),
        item4: t("pages.careers.jobs.contentCreator.responsibilities.item4"),
        item5: t("pages.careers.jobs.contentCreator.responsibilities.item5"),
      },
      requirements: {
        item1: t("pages.careers.jobs.contentCreator.requirements.item1"),
        item2: t("pages.careers.jobs.contentCreator.requirements.item2"),
        item3: t("pages.careers.jobs.contentCreator.requirements.item3"),
        item4: t("pages.careers.jobs.contentCreator.requirements.item4"),
        item5: t("pages.careers.jobs.contentCreator.requirements.item5"),
      },
      qualifications: {
        required: {
          item1: t(
            "pages.careers.jobs.contentCreator.qualifications.required.item1",
          ),
          item2: t(
            "pages.careers.jobs.contentCreator.qualifications.required.item2",
          ),
          item3: t(
            "pages.careers.jobs.contentCreator.qualifications.required.item3",
          ),
        },
        preferred: {
          item1: t(
            "pages.careers.jobs.contentCreator.qualifications.preferred.item1",
          ),
          item2: t(
            "pages.careers.jobs.contentCreator.qualifications.preferred.item2",
          ),
          item3: t(
            "pages.careers.jobs.contentCreator.qualifications.preferred.item3",
          ),
        },
      },
      location: t("pages.careers.jobs.contentCreator.location"),
      department: t("pages.careers.jobs.contentCreator.department"),
      type: t("pages.careers.jobs.contentCreator.type"),
      experienceLevel: t("pages.careers.jobs.contentCreator.experienceLevel"),
      postedDate: t("pages.careers.jobs.contentCreator.postedDate"),
      applicationDeadline: t(
        "pages.careers.jobs.contentCreator.applicationDeadline",
      ),
    },
  };

  const job = jobs[jobId as keyof typeof jobs];

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link href={`/${locale}/careers`}>
              <ArrowLeft className="h-4 w-4" />
              <span>{t("pages.careers.openPositions")}</span>
            </Link>
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {job.title}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {job.shortDescription}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {t("pages.careers.jobDetail.jobOverview")}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {job.longDescription}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {t("pages.careers.jobDetail.responsibilities")}
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {Object.values(job.responsibilities).map(
                      (responsibility: string, index: number) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {responsibility}
                        </li>
                      ),
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {t("pages.careers.jobDetail.requirements")}
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {Object.values(job.requirements).map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {requirement}
                        </li>
                      ),
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {t("pages.careers.jobDetail.qualifications")}
                  </h2>

                  <h3 className="text-xl font-semibold mb-2">
                    {t("pages.careers.jobDetail.qualificationsRequired")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    {Object.values(job.qualifications.required).map(
                      (qualification: string, index: number) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {qualification}
                        </li>
                      ),
                    )}
                  </ul>

                  <h3 className="text-xl font-semibold mb-2">
                    {t("pages.careers.jobDetail.qualificationsPreferred")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {Object.values(job.qualifications.preferred).map(
                      (qualification: string, index: number) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {qualification}
                        </li>
                      ),
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {t("pages.careers.benefits.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">
                          {t("pages.careers.benefits.growthTitle")}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("pages.careers.benefits.growthDesc")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">
                          {t("pages.careers.benefits.meaningfulTitle")}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("pages.careers.benefits.meaningfulDesc")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">
                          {t("pages.careers.benefits.balanceTitle")}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("pages.careers.benefits.balanceDesc")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">
                          {t("pages.careers.benefits.compensationTitle")}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("pages.careers.benefits.compensationDesc")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      {t("pages.careers.jobDetail.applyNow")}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.location")}:
                        </div>
                        <div className="font-medium">{job.location}</div>

                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.department")}:
                        </div>
                        <div className="font-medium">{job.department}</div>

                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.employmentType")}:
                        </div>
                        <div className="font-medium">{job.type}</div>

                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.experienceLevel")}:
                        </div>
                        <div className="font-medium">{job.experienceLevel}</div>

                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.postedDate")}:
                        </div>
                        <div className="font-medium">{job.postedDate}</div>

                        <div className="text-gray-500 dark:text-gray-400">
                          {t("pages.careers.jobDetail.applicationDeadline")}:
                        </div>
                        <div className="font-medium">
                          {job.applicationDeadline}
                        </div>
                      </div>

                      <Separator />

                      <Button className="w-full" asChild>
                        <Link
                          href={`mailto:${contactClientRepository.getSupportEmail(locale)}?subject=Application for ${job.title}`}
                        >
                          {t("pages.careers.applyNow")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">
                      {t("pages.careers.jobDetail.relatedPositions")}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(jobs)
                        .filter(([key]) => key !== jobId)
                        .slice(0, 2)
                        .map(([key, relatedJob]) => {
                          const typedJob = relatedJob as JobType;

                          return (
                            <Link
                              key={key}
                              href={`/${locale}/careers/${key}`}
                              className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <h4 className="font-medium">{typedJob.title}</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                                {typedJob.shortDescription}
                              </p>
                            </Link>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

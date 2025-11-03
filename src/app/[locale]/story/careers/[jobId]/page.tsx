import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { translations } from "@/config/i18n/en";

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
    title: "app.meta.careers.title",
    description: "app.meta.careers.description",
    category: "app.meta.careers.category",
    image: `${translations.websiteUrl}/images/careers-hero.jpg`,
    imageAlt: "app.meta.careers.imageAlt",
    keywords: ["app.meta.careers.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.careers.ogTitle",
        description: "app.meta.careers.ogDescription",
        url: `${translations.websiteUrl}/${locale}/careers/${jobId}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.careers.twitterTitle",
        description: "app.meta.careers.twitterDescription",
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
      title: t(
        "app.story._components.home.careers.jobs.socialMediaManager.title",
      ),
      shortDescription: t(
        "app.story._components.home.careers.jobs.socialMediaManager.shortDescription",
      ),
      longDescription: t(
        "app.story._components.home.careers.jobs.socialMediaManager.longDescription",
      ),
      responsibilities: {
        item1: t(
          "app.story._components.home.careers.jobs.socialMediaManager.responsibilities.item1",
        ),
        item2: t(
          "app.story._components.home.careers.jobs.socialMediaManager.responsibilities.item2",
        ),
        item3: t(
          "app.story._components.home.careers.jobs.socialMediaManager.responsibilities.item3",
        ),
        item4: t(
          "app.story._components.home.careers.jobs.socialMediaManager.responsibilities.item4",
        ),
        item5: t(
          "app.story._components.home.careers.jobs.socialMediaManager.responsibilities.item5",
        ),
      },
      requirements: {
        item1: t(
          "app.story._components.home.careers.jobs.socialMediaManager.requirements.item1",
        ),
        item2: t(
          "app.story._components.home.careers.jobs.socialMediaManager.requirements.item2",
        ),
        item3: t(
          "app.story._components.home.careers.jobs.socialMediaManager.requirements.item3",
        ),
        item4: t(
          "app.story._components.home.careers.jobs.socialMediaManager.requirements.item4",
        ),
        item5: t(
          "app.story._components.home.careers.jobs.socialMediaManager.requirements.item5",
        ),
      },
      qualifications: {
        required: {
          item1: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.required.item1",
          ),
          item2: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.required.item2",
          ),
          item3: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.required.item3",
          ),
        },
        preferred: {
          item1: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.preferred.item1",
          ),
          item2: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.preferred.item2",
          ),
          item3: t(
            "app.story._components.home.careers.jobs.socialMediaManager.qualifications.preferred.item3",
          ),
        },
      },
      location: t(
        "app.story._components.home.careers.jobs.socialMediaManager.location",
      ),
      department: t(
        "app.story._components.home.careers.jobs.socialMediaManager.department",
      ),
      type: t(
        "app.story._components.home.careers.jobs.socialMediaManager.type",
      ),
      experienceLevel: t(
        "app.story._components.home.careers.jobs.socialMediaManager.experienceLevel",
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
      title: t("app.story._components.home.careers.jobs.contentCreator.title"),
      shortDescription: t(
        "app.story._components.home.careers.jobs.contentCreator.shortDescription",
      ),
      longDescription: t(
        "app.story._components.home.careers.jobs.contentCreator.longDescription",
      ),
      responsibilities: {
        item1: t(
          "app.story._components.home.careers.jobs.contentCreator.responsibilities.item1",
        ),
        item2: t(
          "app.story._components.home.careers.jobs.contentCreator.responsibilities.item2",
        ),
        item3: t(
          "app.story._components.home.careers.jobs.contentCreator.responsibilities.item3",
        ),
        item4: t(
          "app.story._components.home.careers.jobs.contentCreator.responsibilities.item4",
        ),
        item5: t(
          "app.story._components.home.careers.jobs.contentCreator.responsibilities.item5",
        ),
      },
      requirements: {
        item1: t(
          "app.story._components.home.careers.jobs.contentCreator.requirements.item1",
        ),
        item2: t(
          "app.story._components.home.careers.jobs.contentCreator.requirements.item2",
        ),
        item3: t(
          "app.story._components.home.careers.jobs.contentCreator.requirements.item3",
        ),
        item4: t(
          "app.story._components.home.careers.jobs.contentCreator.requirements.item4",
        ),
        item5: t(
          "app.story._components.home.careers.jobs.contentCreator.requirements.item5",
        ),
      },
      qualifications: {
        required: {
          item1: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.required.item1",
          ),
          item2: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.required.item2",
          ),
          item3: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.required.item3",
          ),
        },
        preferred: {
          item1: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.preferred.item1",
          ),
          item2: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.preferred.item2",
          ),
          item3: t(
            "app.story._components.home.careers.jobs.contentCreator.qualifications.preferred.item3",
          ),
        },
      },
      location: t(
        "app.story._components.home.careers.jobs.contentCreator.location",
      ),
      department: t(
        "app.story._components.home.careers.jobs.contentCreator.department",
      ),
      type: t("app.story._components.home.careers.jobs.contentCreator.type"),
      experienceLevel: t(
        "app.story._components.home.careers.jobs.contentCreator.experienceLevel",
      ),
      postedDate: t(
        "app.story._components.home.careers.jobs.contentCreator.postedDate",
      ),
      applicationDeadline: t(
        "app.story._components.home.careers.jobs.contentCreator.applicationDeadline",
      ),
    },
  };

  const job = jobs[jobId as keyof typeof jobs];

  if (!job) {
    notFound();
  }

  return (
    <Div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-6xl mx-auto py-8 px-4">
        <Div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link href={`/${locale}/story/careers`}>
              <ArrowLeft className="h-4 w-4" />
              <Span>
                {t("app.story._components.home.careers.openPositions")}
              </Span>
            </Link>
          </Button>
        </Div>

        <Div className="max-w-5xl mx-auto">
          <H1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {job.title}
          </H1>
          <P className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {job.shortDescription}
          </P>
          <Div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Div className="lg:col-span-3">
              <Div className="space-y-8">
                <section>
                  <H2 className="text-2xl font-bold mb-4">
                    {t(
                      "app.story._components.home.careers.jobDetail.jobOverview",
                    )}
                  </H2>
                  <P className="text-gray-700 dark:text-gray-300">
                    {job.longDescription}
                  </P>
                </section>

                <section>
                  <H2 className="text-2xl font-bold mb-4">
                    {t(
                      "app.story._components.home.careers.jobDetail.responsibilities",
                    )}
                  </H2>
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
                  <H2 className="text-2xl font-bold mb-4">
                    {t(
                      "app.story._components.home.careers.jobDetail.requirements",
                    )}
                  </H2>
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
                  <H2 className="text-2xl font-bold mb-4">
                    {t(
                      "app.story._components.home.careers.jobDetail.qualifications",
                    )}
                  </H2>

                  <H3 className="text-xl font-semibold mb-2">
                    {t(
                      "app.story._components.home.careers.jobDetail.qualificationsRequired",
                    )}
                  </H3>
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

                  <H3 className="text-xl font-semibold mb-2">
                    {t(
                      "app.story._components.home.careers.jobDetail.qualificationsPreferred",
                    )}
                  </H3>
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
                  <H2 className="text-2xl font-bold mb-4">
                    {t("app.story._components.home.careers.benefits.title")}
                  </H2>
                  <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <H3 className="font-semibold mb-2">
                          {t(
                            "app.story._components.home.careers.benefits.growthTitle",
                          )}
                        </H3>
                        <P className="text-sm text-gray-700 dark:text-gray-300">
                          {t(
                            "app.story._components.home.careers.benefits.growthDesc",
                          )}
                        </P>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <H3 className="font-semibold mb-2">
                          {t(
                            "app.story._components.home.careers.benefits.meaningfulTitle",
                          )}
                        </H3>
                        <P className="text-sm text-gray-700 dark:text-gray-300">
                          {t(
                            "app.story._components.home.careers.benefits.meaningfulDesc",
                          )}
                        </P>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <H3 className="font-semibold mb-2">
                          {t(
                            "app.story._components.home.careers.benefits.balanceTitle",
                          )}
                        </H3>
                        <P className="text-sm text-gray-700 dark:text-gray-300">
                          {t(
                            "app.story._components.home.careers.benefits.balanceDesc",
                          )}
                        </P>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <H3 className="font-semibold mb-2">
                          {t(
                            "app.story._components.home.careers.benefits.compensationTitle",
                          )}
                        </H3>
                        <P className="text-sm text-gray-700 dark:text-gray-300">
                          {t(
                            "app.story._components.home.careers.benefits.compensationDesc",
                          )}
                        </P>
                      </CardContent>
                    </Card>
                  </Div>
                </section>
              </Div>
            </Div>

            <Div className="lg:col-span-2">
              <Div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <H3 className="text-xl font-bold mb-4">
                      {t(
                        "app.story._components.home.careers.jobDetail.applyNow",
                      )}
                    </H3>
                    <Div className="space-y-4">
                      <Div className="grid grid-cols-2 gap-2 text-sm">
                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.location",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">{job.location}</Div>

                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.department",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">{job.department}</Div>

                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.employmentType",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">{job.type}</Div>

                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.experienceLevel",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">{job.experienceLevel}</Div>

                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.postedDate",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">{job.postedDate}</Div>

                        <Div className="text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.careers.jobDetail.applicationDeadline",
                          )}
                          :
                        </Div>
                        <Div className="font-medium">
                          {job.applicationDeadline}
                        </Div>
                      </Div>

                      <Separator />

                      <Button className="w-full" asChild>
                        <Link
                          href={`mailto:${contactClientRepository.getSupportEmail(locale)}?subject=Application for ${job.title}`}
                        >
                          {t("app.story._components.home.careers.applyNow")}
                        </Link>
                      </Button>
                    </Div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <H3 className="text-lg font-bold mb-4">
                      {t(
                        "app.story._components.home.careers.jobDetail.relatedPositions",
                      )}
                    </H3>
                    <Div className="space-y-3">
                      {Object.entries(jobs)
                        .filter(([key]) => key !== jobId)
                        .slice(0, 2)
                        .map(([key, relatedJob]) => {
                          const typedJob = relatedJob as JobType;

                          return (
                            <Link
                              key={key}
                              href={`/${locale}/story/careers/${key}`}
                              className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <H3 className="font-medium">{typedJob.title}</H3>
                              <P className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                                {typedJob.shortDescription}
                              </P>
                            </Link>
                          );
                        })}
                    </Div>
                  </CardContent>
                </Card>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

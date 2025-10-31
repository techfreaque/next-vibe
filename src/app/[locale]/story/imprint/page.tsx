import { Building, FileText, Info } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { ImprintClientInteraction } from "./_components/imprint-client-content";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  const previousImages = (await parent).openGraph?.images || [];

  return metadataGenerator(locale, {
    path: "imprint",
    title: "app.meta.imprint.title",
    description: "app.meta.imprint.description",
    image: "https://unbottled.ai/images/imprint-hero.jpg",
    category: "app.meta.imprint.category",
    imageAlt: "app.meta.imprint.imageAlt",
    keywords: ["app.meta.imprint.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.imprint.ogTitle",
        description: "app.meta.imprint.ogDescription",
        url: `https://unbottled.ai/${locale}/imprint`,
        type: "website",
        images: [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.imprint.twitterTitle",
        description: "app.meta.imprint.twitterDescription",
      },
    },
  });
}

export default async function ImprintPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);

  return (
    <main className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <Div className="mb-12 text-center">
          <Div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </Div>
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.imprint.title")}
          </H1>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story._components.home.imprint.lastUpdated")}
          </P>
        </Div>

        {/* Main content */}
        <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <Div className="prose dark:prose-invert max-w-none">
            <P className="lead text-lg">
              {t("app.story._components.home.imprint.introduction")}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Partnerships Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.imprint.sections.partnerships.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.partnerships.description",
              )}
            </P>
            <Alert variant="default" className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t(
                  "app.story._components.home.imprint.sections.partnerships.content",
                )}
              </AlertDescription>
            </Alert>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Company Information Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.imprint.sections.companyInfo.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.companyInfo.description",
              )}
            </P>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                <Span>{t("app.common.company.name")}</Span>
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                <Span>{t("app.common.company.legalForm")}</Span>
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                <Span>{t("app.common.company.registrationNumber")}</Span>
              </li>
              {/* <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                <Span>{t("app.common.company.vatId")}</Span>
              </li> */}
              {/* <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                <Span>{t("app.common.company.registrationCourt")}</Span>
              </li> */}
            </ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Contact Information Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.imprint.sections.contactInfo.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.contactInfo.description",
              )}
            </P>

            <Div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <H3 className="font-medium text-lg mb-2">
                {t("app.common.company.address.title")}
              </H3>
              <P>{t("app.common.company.address.street")}</P>
              <P>{t("app.common.company.address.city")}</P>
              <P>{t("app.common.company.address.country")}</P>
              <P>{supportEmail}</P>
              {/* <P>{t("app.story._components.home.imprint.sections.contactInfo.communication.phone")}</P> */}
            </Div>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Responsible Person Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.imprint.sections.responsiblePerson.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.responsiblePerson.description",
              )}
            </P>
            <Div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <P>
                <strong>
                  {t("app.common.company.responsiblePerson.name")}
                </strong>
              </P>
              <P>{t("app.common.company.address.addressIn1Line")}</P>
            </Div>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Dispute Resolution Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.imprint.sections.disputeResolution.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.disputeResolution.description",
              )}
            </P>
            <P className="mt-4">
              {t(
                "app.story._components.home.imprint.sections.disputeResolution.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Disclaimer Section */}
            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.imprint.sections.disclaimer.title",
              )}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.liability.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.liability.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.links.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.links.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.copyright.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.imprint.sections.disclaimer.copyright.content",
              )}
            </P>
          </Div>
        </Div>

        {/* Client component for interactive elements only */}
        <ImprintClientInteraction locale={locale} />
      </Div>
    </main>
  );
}

import { Building, FileText, Info } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
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
      <div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.site.imprint.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.site.imprint.lastUpdated")}
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="lead text-lg">{t("app.site.imprint.introduction")}</p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Partnerships Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("app.site.imprint.sections.partnerships.title")}
            </h2>
            <p className="mt-2">
              {t("app.site.imprint.sections.partnerships.description")}
            </p>
            <Alert variant="default" className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t("app.site.imprint.sections.partnerships.content")}
              </AlertDescription>
            </Alert>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Company Information Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {t("app.site.imprint.sections.companyInfo.title")}
            </h2>
            <p className="mt-2">
              {t("app.site.imprint.sections.companyInfo.description")}
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{t("app.common.company.name")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{t("app.common.company.legalForm")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{t("app.common.company.registrationNumber")}</span>
              </li>
              {/* <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{t("app.common.company.vatId")}</span>
              </li> */}
              {/* <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{t("app.common.company.registrationCourt")}</span>
              </li> */}
            </ul>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Contact Information Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("app.site.imprint.sections.contactInfo.title")}
            </h2>
            <p className="mt-2">
              {t("app.site.imprint.sections.contactInfo.description")}
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <h3 className="font-medium text-lg mb-2">
                {t("app.common.company.address.title")}
              </h3>
              <p>{t("app.common.company.address.street")}</p>
              <p>{t("app.common.company.address.city")}</p>
              <p>{t("app.common.company.address.country")}</p>
              <p>{supportEmail}</p>
              {/* <p>{t("app.site.imprint.sections.contactInfo.communication.phone")}</p> */}
            </div>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Responsible Person Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("app.site.imprint.sections.responsiblePerson.title")}
            </h2>
            <p className="mt-2">
              {t("app.site.imprint.sections.responsiblePerson.description")}
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <p>
                <strong>{t("app.common.company.responsiblePerson.name")}</strong>
              </p>
              <p>{t("app.common.company.address.addressIn1Line")}</p>
            </div>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Dispute Resolution Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("app.site.imprint.sections.disputeResolution.title")}
            </h2>
            <p className="mt-2">
              {t("app.site.imprint.sections.disputeResolution.description")}
            </p>
            <p className="mt-4">
              {t("app.site.imprint.sections.disputeResolution.content")}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            {/* Disclaimer Section */}
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t("app.site.imprint.sections.disclaimer.title")}
            </h2>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("app.site.imprint.sections.disclaimer.liability.title")}
            </h3>
            <p className="mt-2">
              {t("app.site.imprint.sections.disclaimer.liability.content")}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("app.site.imprint.sections.disclaimer.links.title")}
            </h3>
            <p className="mt-2">
              {t("app.site.imprint.sections.disclaimer.links.content")}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("app.site.imprint.sections.disclaimer.copyright.title")}
            </h3>
            <p className="mt-2">
              {t("app.site.imprint.sections.disclaimer.copyright.content")}
            </p>
          </div>
        </div>

        {/* Client component for interactive elements only */}
        <ImprintClientInteraction locale={locale} />
      </div>
    </main>
  );
}

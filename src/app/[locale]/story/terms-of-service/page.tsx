import { FileText, Scale } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { TermsClientInteraction } from "./_components/terms-client-content";

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
    path: "terms-of-service",
    title: "app.meta.termsOfService.title",
    description: "app.meta.termsOfService.description",
    image: "https://unbottled.ai/images/terms-hero.jpg",
    imageAlt: "app.meta.termsOfService.imageAlt",
    keywords: ["app.meta.termsOfService.keywords"],
    category: "app.meta.termsOfService.category",
    additionalMetadata: {
      openGraph: {
        title: "app.meta.termsOfService.ogTitle",
        description: "app.meta.termsOfService.ogDescription",
        url: `https://unbottled.ai/${locale}/terms-of-service`,
        type: "website",
        images: [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.termsOfService.twitterTitle",
        description: "app.meta.termsOfService.twitterDescription",
      },
    },
  });
}

export default async function TermsOfServicePage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const appName = t("app.common.appName");
  const supportEmail = contactClientRepository.getSupportEmail(locale);

  return (
    <main className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.termsOfService.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story._components.home.termsOfService.lastUpdated")}
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="lead text-lg">
              {t("app.story._components.home.termsOfService.introduction", {
                appName: appName,
              })}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.termsOfService.sections.agreement.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.agreement.content",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.description.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.description.content",
                {
                  appName: appName,
                },
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.title",
              )}
            </h2>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.plans.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.plans.content",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.billing.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.billing.content",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.cancellation.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.cancellation.content",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.title",
              )}
            </h2>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.creation.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.creation.content",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.responsibilities.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.responsibilities.content",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.title",
              )}
            </h2>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.ownership.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.ownership.content",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.guidelines.title",
              )}
            </h3>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.guidelines.intro",
              )}
            </p>
            <ul className="space-y-1 mt-4">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item1",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item2",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item3",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item4",
                )}
              </li>
            </ul>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.intellectualProperty.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.intellectualProperty.content",
                {
                  appName,
                },
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.limitation.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.limitation.content",
                {
                  appName,
                },
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.indemnification.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.indemnification.content",
                {
                  appName,
                },
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.termination.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.termination.content",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.changes.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.changes.content",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.governingLaw.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.governingLaw.content",
                {
                  jurisdiction: t("app.common.company.address.country"),
                },
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.contact.title",
              )}
            </h2>
            <p className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.contact.content",
              )}{" "}
              <button
                onClick={() => {
                  window.location.href = `mailto:${supportEmail}`;
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                {supportEmail}
              </button>
              .
            </p>
          </div>
        </div>

        {/* Client component for interactive elements only */}
        <TermsClientInteraction locale={locale} />
      </div>
    </main>
  );
}

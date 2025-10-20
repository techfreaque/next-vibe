import { Lock, Shield } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { PrivacyPolicyClientInteraction } from "./_components/privacy-policy-client-content";

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
    path: "privacy-policy",
    title: "app.meta.privacyPolicy.title",
    description: "app.meta.privacyPolicy.description",
    image: "https://unbottled.ai/images/privacy-hero.jpg",
    category: "app.meta.privacyPolicy.category",
    imageAlt: "app.meta.privacyPolicy.imageAlt",
    keywords: ["app.meta.privacyPolicy.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.privacyPolicy.ogTitle",
        description: "app.meta.privacyPolicy.ogDescription",
        url: `https://unbottled.ai/${locale}/privacy-policy`,
        type: "website",
        images: [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.privacyPolicy.twitterTitle",
        description: "app.meta.privacyPolicy.twitterDescription",
      },
    },
  });
}

export default async function PrivacyPolicyPage({
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
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.privacyPolicy.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story._components.home.privacyPolicy.lastUpdated")}
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="lead text-lg">
              {t("app.story._components.home.privacyPolicy.introduction", {
                appName: t("app.common.appName"),
              })}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.privacyPolicy.sections.informationCollect.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.informationCollect.description",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.personalData.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.personalData.description",
              )}
            </p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.name",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.email",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.phone",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.company",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.billing",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.payment",
                )}
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.socialMediaData.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.socialMediaData.description",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.derivativeData.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.derivativeData.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.useOfInformation.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.useOfInformation.description",
              )}
            </p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.provide",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.process",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.send",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.respond",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.monitor",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.personalize",
                )}
              </li>
            </ul>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.disclosure.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.disclosure.description",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.businessTransfers.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.businessTransfers.description",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdParty.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdParty.description",
              )}
            </p>

            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.legal.title",
              )}
            </h3>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.legal.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.security.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.security.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.rights.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.rights.description",
              )}
            </p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.access",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.correction",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.deletion",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.objection",
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.portability",
                )}
              </li>
            </ul>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.cookies.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.cookies.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdPartySites.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdPartySites.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.children.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.children.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.changes.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.changes.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.contact.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.contact.description",
              )}{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {supportEmail}
              </a>
              .
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.gdpr.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.gdpr.description",
              )}
            </p>

            <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.ccpa.title",
              )}
            </h2>
            <p>
              {t(
                "app.story._components.home.privacyPolicy.sections.ccpa.description",
              )}
            </p>
          </div>
        </div>

        {/* Client component for interactive elements only */}
        <PrivacyPolicyClientInteraction locale={locale} />
      </div>
    </main>
  );
}

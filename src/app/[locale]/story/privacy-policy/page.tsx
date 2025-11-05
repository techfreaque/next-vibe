import { Lock, Shield } from 'next-vibe-ui/ui/icons';
import type { Metadata, ResolvingMetadata } from "next";
import type { JSX } from "react";

import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { translations } from "@/config/i18n/en";

import { PrivacyPolicyClientInteraction } from "./_components/privacy-policy-client-content";
import { SupportButton } from "./_components/support-button";

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
    image: `${translations.websiteUrl}/images/privacy-hero.jpg`,
    category: "app.meta.privacyPolicy.category",
    imageAlt: "app.meta.privacyPolicy.imageAlt",
    keywords: ["app.meta.privacyPolicy.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.privacyPolicy.ogTitle",
        description: "app.meta.privacyPolicy.ogDescription",
        url: `${translations.websiteUrl}/${locale}/privacy-policy`,
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
      <Div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <Div className="mb-12 text-center">
          <Div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </Div>
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.privacyPolicy.title")}
          </H1>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story._components.home.privacyPolicy.lastUpdated")}
          </P>
        </Div>

        {/* Main content */}
        <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <Div className="prose dark:prose-invert max-w-none">
            <P className="lead text-lg">
              {t("app.story._components.home.privacyPolicy.introduction", {
                appName: t("config.appName"),
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.privacyPolicy.sections.informationCollect.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.informationCollect.description",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.personalData.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.personalData.description",
              )}
            </P>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.name",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.email",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.phone",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.company",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.billing",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.personalData.items.payment",
                )}
              </li>
            </ul>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.socialMediaData.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.socialMediaData.description",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.derivativeData.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.derivativeData.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.useOfInformation.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.useOfInformation.description",
              )}
            </P>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.provide",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.process",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.send",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.respond",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.monitor",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.useOfInformation.items.personalize",
                )}
              </li>
            </ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.disclosure.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.disclosure.description",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.businessTransfers.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.businessTransfers.description",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdParty.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdParty.description",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t(
                "app.story._components.home.privacyPolicy.sections.legal.title",
              )}
            </H3>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.legal.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.security.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.security.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.rights.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.rights.description",
              )}
            </P>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.access",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.correction",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.deletion",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.objection",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.privacyPolicy.sections.rights.items.portability",
                )}
              </li>
            </ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.cookies.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.cookies.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdPartySites.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.thirdPartySites.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.children.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.children.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.changes.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.changes.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("config.group.contact.title")}
            </H2>
            <SupportButton supportEmail={supportEmail} locale={locale} />

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.gdpr.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.gdpr.description",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.privacyPolicy.sections.ccpa.title",
              )}
            </H2>
            <P>
              {t(
                "app.story._components.home.privacyPolicy.sections.ccpa.description",
              )}
            </P>
          </Div>
        </Div>

        {/* Client component for interactive elements only */}
        <PrivacyPolicyClientInteraction locale={locale} />
      </Div>
    </main>
  );
}

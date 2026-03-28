import type { Metadata, ResolvingMetadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Scale } from "next-vibe-ui/ui/icons/Scale";
import { Li } from "next-vibe-ui/ui/li";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import { Ul } from "next-vibe-ui/ui/ul";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { scopedTranslation } from "./i18n";

import { TermsClientInteraction } from "./_components/terms-client-content";
import { TermsContactButton } from "./_components/terms-contact-button";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const previousImages = (await parent).openGraph?.images || [];

  return metadataGenerator(locale, {
    path: "terms-of-service",
    title: t("meta.title"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/terms-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
    category: t("meta.category"),
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle"),
        description: t("meta.ogDescription"),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/terms-of-service`,
        type: "website",
        images: [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle"),
        description: t("meta.twitterDescription"),
      },
    },
  });
}

export interface TermsOfServicePageData {
  locale: CountryLanguage;
  supportEmail: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<TermsOfServicePageData> {
  const { locale } = await params;
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  return { locale, supportEmail };
}

export function TanstackPage({
  locale,
  supportEmail,
}: TermsOfServicePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <Div className="mb-12 text-center">
          <Div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </Div>
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-cyan-500 to-blue-600">
            {t("title")}
          </H1>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            {t("lastUpdated")}
          </P>
        </Div>

        {/* Main content */}
        <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <Div className="prose dark:prose-invert max-w-none">
            <P className="lead text-lg">
              {t("introduction", {
                appName: appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t("sections.agreement.title")}
            </H2>
            <P className="mt-2">
              {t("sections.agreement.content", {
                appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.description.title")}
            </H2>
            <P className="mt-2">
              {t("sections.description.content", {
                appName: appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.subscriptions.title")}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.subscriptions.plans.title")}
            </H3>
            <P className="mt-2">{t("sections.subscriptions.plans.content")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.subscriptions.billing.title")}
            </H3>
            <P className="mt-2">
              {t("sections.subscriptions.billing.content")}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.subscriptions.cancellation.title")}
            </H3>
            <P className="mt-2">
              {t("sections.subscriptions.cancellation.content")}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.userAccounts.title")}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.userAccounts.creation.title")}
            </H3>
            <P className="mt-2">
              {t("sections.userAccounts.creation.content")}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.userAccounts.responsibilities.title")}
            </H3>
            <P className="mt-2">
              {t("sections.userAccounts.responsibilities.content")}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.userContent.title")}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.userContent.ownership.title")}
            </H3>
            <P className="mt-2">
              {t("sections.userContent.ownership.content")}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t("sections.userContent.guidelines.title")}
            </H3>
            <P className="mt-2">{t("sections.userContent.guidelines.intro")}</P>
            <Ul className="flex flex-col gap-1 mt-4">
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.userContent.guidelines.items.item1")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.userContent.guidelines.items.item2")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.userContent.guidelines.items.item3")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.userContent.guidelines.items.item4")}
              </Li>
            </Ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.intellectualProperty.title")}
            </H2>
            <P className="mt-2">
              {t("sections.intellectualProperty.content", {
                appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.limitation.title")}
            </H2>
            <P className="mt-2">
              {t("sections.limitation.content", {
                appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.indemnification.title")}
            </H2>
            <P className="mt-2">
              {t("sections.indemnification.content", {
                appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.termination.title")}
            </H2>
            <P className="mt-2">{t("sections.termination.content")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.changes.title")}
            </H2>
            <P className="mt-2">{t("sections.changes.content")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.governingLaw.title")}
            </H2>
            <P className="mt-2">
              {t("sections.governingLaw.content", {
                jurisdictionCountry: configT("group.jurisdiction.country"),
                jurisdictionCity: configT("group.jurisdiction.city"),
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {configT("group.contact.title")}
            </H2>
            <TermsContactButton supportEmail={supportEmail} locale={locale} />
          </Div>
        </Div>

        {/* Client component for interactive elements only */}
        <TermsClientInteraction locale={locale} />
      </Div>
    </Div>
  );
}

export default async function TermsOfServicePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

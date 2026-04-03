import type { Metadata, ResolvingMetadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
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
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const previousImages = (await parent).openGraph?.images || [];

  return metadataGenerator(locale, {
    path: "privacy-policy",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/privacy-hero.jpg`,
    category: t("meta.category"),
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/privacy-policy`,
        type: "website",
        images: [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription", { appName }),
      },
    },
  });
}

export interface PrivacyPolicyPageData {
  locale: CountryLanguage;
  supportEmail: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<PrivacyPolicyPageData> {
  const { locale } = await params;
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  return { locale, supportEmail };
}

export function TanstackPage({
  locale,
  supportEmail,
}: PrivacyPolicyPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <Div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <Div className="mb-12 text-center">
          <Div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
                appName: configT("appName"),
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              {t("sections.informationCollect.title")}
            </H2>
            <P>{t("sections.informationCollect.description")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.personalData.title")}
            </H3>
            <P>{t("sections.personalData.description")}</P>
            <Ul className="flex flex-col gap-1">
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.name")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.email")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.phone")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.company")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.billing")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.personalData.items.payment")}
              </Li>
            </Ul>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.socialMediaData.title")}
            </H3>
            <P>{t("sections.socialMediaData.description")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.derivativeData.title")}
            </H3>
            <P>{t("sections.derivativeData.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.useOfInformation.title")}
            </H2>
            <P>{t("sections.useOfInformation.description")}</P>
            <Ul className="flex flex-col gap-1">
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.provide")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.process")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.send")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.respond")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.monitor")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.useOfInformation.items.personalize")}
              </Li>
            </Ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.disclosure.title")}
            </H2>
            <P>{t("sections.disclosure.description")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.businessTransfers.title")}
            </H3>
            <P>{t("sections.businessTransfers.description")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.thirdParty.title")}
            </H3>
            <P>{t("sections.thirdParty.description")}</P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {t("sections.legal.title")}
            </H3>
            <P>{t("sections.legal.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.security.title")}
            </H2>
            <P>{t("sections.security.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.rights.title")}
            </H2>
            <P>{t("sections.rights.description")}</P>
            <Ul className="flex flex-col gap-1">
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.rights.items.access")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.rights.items.correction")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.rights.items.deletion")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.rights.items.objection")}
              </Li>
              <Li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t("sections.rights.items.portability")}
              </Li>
            </Ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.cookies.title")}
            </H2>
            <P>{t("sections.cookies.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.thirdPartySites.title")}
            </H2>
            <P>{t("sections.thirdPartySites.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.children.title")}
            </H2>
            <P>{t("sections.children.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.changes.title")}
            </H2>
            <P>{t("sections.changes.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {configT("group.contact.title")}
            </H2>
            <SupportButton supportEmail={supportEmail} locale={locale} />

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.gdpr.title")}
            </H2>
            <P>{t("sections.gdpr.description")}</P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t("sections.ccpa.title")}
            </H2>
            <P>{t("sections.ccpa.description")}</P>
          </Div>
        </Div>

        {/* Client component for interactive elements only */}
        <PrivacyPolicyClientInteraction locale={locale} />
      </Div>
    </Div>
  );
}

export default async function PrivacyPolicyPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

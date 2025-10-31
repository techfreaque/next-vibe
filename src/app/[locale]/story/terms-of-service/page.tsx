import { FileText, Scale } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import type { JSX } from "react";

import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";

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
      <Div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header with icon */}
        <Div className="mb-12 text-center">
          <Div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </Div>
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.story._components.home.termsOfService.title")}
          </H1>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story._components.home.termsOfService.lastUpdated")}
          </P>
        </Div>

        {/* Main content */}
        <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <Div className="prose dark:prose-invert max-w-none">
            <P className="lead text-lg">
              {t("app.story._components.home.termsOfService.introduction", {
                appName: appName,
              })}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {t(
                "app.story._components.home.termsOfService.sections.agreement.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.agreement.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.description.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.description.content",
                {
                  appName: appName,
                },
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.title",
              )}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.plans.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.plans.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.billing.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.billing.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.cancellation.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.subscriptions.cancellation.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.title",
              )}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.creation.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.creation.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.responsibilities.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userAccounts.responsibilities.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.title",
              )}
            </H2>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.ownership.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.ownership.content",
              )}
            </P>

            <H3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.guidelines.title",
              )}
            </H3>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.userContent.guidelines.intro",
              )}
            </P>
            <ul className="space-y-1 mt-4">
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item1",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item2",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item3",
                )}
              </li>
              <li className="flex items-start">
                <Span className="mr-2 text-blue-500">•</Span>
                {t(
                  "app.story._components.home.termsOfService.sections.userContent.guidelines.items.item4",
                )}
              </li>
            </ul>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.intellectualProperty.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.intellectualProperty.content",
                {
                  appName,
                },
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.limitation.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.limitation.content",
                {
                  appName,
                },
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.indemnification.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.indemnification.content",
                {
                  appName,
                },
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.termination.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.termination.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.changes.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.changes.content",
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.governingLaw.title",
              )}
            </H2>
            <P className="mt-2">
              {t(
                "app.story._components.home.termsOfService.sections.governingLaw.content",
                {
                  jurisdiction: t("app.common.company.address.country"),
                },
              )}
            </P>

            <Div className="my-8 border-t border-gray-200 dark:border-gray-700" />

            <H2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {t(
                "app.story._components.home.termsOfService.sections.contact.title",
              )}
            </H2>
            <P className="mt-2">
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
            </P>
          </Div>
        </Div>

        {/* Client component for interactive elements only */}
        <TermsClientInteraction locale={locale} />
      </Div>
    </main>
  );
}

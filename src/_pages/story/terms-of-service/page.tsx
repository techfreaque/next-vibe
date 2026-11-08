import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { ExternalLink } from "next-vibe/ui/components/link";
import type { JSX } from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";

import { LegalDocument, LegalH3, LegalList, LegalP } from "../_shared/legal";
import { PrintButton } from "../_shared/print-button";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return metadataGenerator(locale, {
    path: "story/terms-of-service",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/terms-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
    category: t("meta.category"),
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/story/terms-of-service`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription", { appName }),
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
    <LegalDocument
      eyebrow={t("meta.category")}
      eyebrowIcon={Scale}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      tocLabel={t("onThisPage")}
      actions={
        <PrintButton label={t("printButton")} ariaLabel={t("printAriaLabel")} />
      }
      intro={<LegalP>{t("introduction", { appName })}</LegalP>}
      sections={[
        {
          id: "agreement",
          title: t("sections.agreement.title"),
          content: (
            <LegalP>{t("sections.agreement.content", { appName })}</LegalP>
          ),
        },
        {
          id: "service",
          title: t("sections.description.title"),
          content: (
            <LegalP>{t("sections.description.content", { appName })}</LegalP>
          ),
        },
        {
          id: "subscriptions",
          title: t("sections.subscriptions.title"),
          content: (
            <>
              <LegalH3>{t("sections.subscriptions.plans.title")}</LegalH3>
              <LegalP>{t("sections.subscriptions.plans.content")}</LegalP>
              <LegalH3>{t("sections.subscriptions.billing.title")}</LegalH3>
              <LegalP>{t("sections.subscriptions.billing.content")}</LegalP>
              <LegalH3>
                {t("sections.subscriptions.cancellation.title")}
              </LegalH3>
              <LegalP>
                {t("sections.subscriptions.cancellation.content")}
              </LegalP>
            </>
          ),
        },
        {
          id: "accounts",
          title: t("sections.userAccounts.title"),
          content: (
            <>
              <LegalH3>{t("sections.userAccounts.creation.title")}</LegalH3>
              <LegalP>{t("sections.userAccounts.creation.content")}</LegalP>
              <LegalH3>
                {t("sections.userAccounts.responsibilities.title")}
              </LegalH3>
              <LegalP>
                {t("sections.userAccounts.responsibilities.content")}
              </LegalP>
            </>
          ),
        },
        {
          id: "content",
          title: t("sections.userContent.title"),
          content: (
            <>
              <LegalH3>{t("sections.userContent.ownership.title")}</LegalH3>
              <LegalP>{t("sections.userContent.ownership.content")}</LegalP>
              <LegalH3>{t("sections.userContent.guidelines.title")}</LegalH3>
              <LegalP>{t("sections.userContent.guidelines.intro")}</LegalP>
              <LegalList
                items={[
                  t("sections.userContent.guidelines.items.item1"),
                  t("sections.userContent.guidelines.items.item2"),
                  t("sections.userContent.guidelines.items.item3"),
                  t("sections.userContent.guidelines.items.item4"),
                ]}
              />
            </>
          ),
        },
        {
          id: "intellectual-property",
          title: t("sections.intellectualProperty.title"),
          content: (
            <LegalP>
              {t("sections.intellectualProperty.content", { appName })}
            </LegalP>
          ),
        },
        {
          id: "liability",
          title: t("sections.limitation.title"),
          content: (
            <LegalP>{t("sections.limitation.content", { appName })}</LegalP>
          ),
        },
        {
          id: "indemnification",
          title: t("sections.indemnification.title"),
          content: (
            <LegalP>
              {t("sections.indemnification.content", { appName })}
            </LegalP>
          ),
        },
        {
          id: "termination",
          title: t("sections.termination.title"),
          content: <LegalP>{t("sections.termination.content")}</LegalP>,
        },
        {
          id: "changes",
          title: t("sections.changes.title"),
          content: <LegalP>{t("sections.changes.content")}</LegalP>,
        },
        {
          id: "governing-law",
          title: t("sections.governingLaw.title"),
          content: (
            <LegalP>
              {t("sections.governingLaw.content", {
                jurisdictionCountry: configT("group.jurisdiction.country"),
                jurisdictionCity: configT("group.jurisdiction.city"),
              })}
            </LegalP>
          ),
        },
        {
          id: "contact",
          title: configT("group.contact.title"),
          content: (
            <LegalP>
              {configT("group.contact.content")}{" "}
              <ExternalLink
                href={`mailto:${supportEmail}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {supportEmail}
              </ExternalLink>
            </LegalP>
          ),
        },
      ]}
    />
  );
}

export default async function TermsOfServicePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

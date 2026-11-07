import type { Metadata, ResolvingMetadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Shield } from "next-vibe/ui/components/icons/Shield";
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
  const appName = configT("appName");

  return (
    <LegalDocument
      eyebrow={t("meta.category")}
      eyebrowIcon={Shield}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      tocLabel={t("onThisPage")}
      actions={
        <PrintButton label={t("printButton")} ariaLabel={t("printAriaLabel")} />
      }
      intro={<LegalP>{t("introduction", { appName })}</LegalP>}
      sections={[
        {
          id: "information-we-collect",
          title: t("sections.informationCollect.title"),
          content: (
            <>
              <LegalP>{t("sections.informationCollect.description")}</LegalP>
              <LegalH3>{t("sections.personalData.title")}</LegalH3>
              <LegalP>{t("sections.personalData.description")}</LegalP>
              <LegalList
                items={[
                  t("sections.personalData.items.name"),
                  t("sections.personalData.items.email"),
                  t("sections.personalData.items.phone"),
                  t("sections.personalData.items.company"),
                  t("sections.personalData.items.billing"),
                  t("sections.personalData.items.payment"),
                ]}
              />
              <LegalH3>{t("sections.socialMediaData.title")}</LegalH3>
              <LegalP>{t("sections.socialMediaData.description")}</LegalP>
              <LegalH3>{t("sections.derivativeData.title")}</LegalH3>
              <LegalP>{t("sections.derivativeData.description")}</LegalP>
            </>
          ),
        },
        {
          id: "use-of-information",
          title: t("sections.useOfInformation.title"),
          content: (
            <>
              <LegalP>{t("sections.useOfInformation.description")}</LegalP>
              <LegalList
                items={[
                  t("sections.useOfInformation.items.provide"),
                  t("sections.useOfInformation.items.process"),
                  t("sections.useOfInformation.items.send"),
                  t("sections.useOfInformation.items.respond"),
                  t("sections.useOfInformation.items.monitor"),
                  t("sections.useOfInformation.items.personalize"),
                ]}
              />
            </>
          ),
        },
        {
          id: "disclosure",
          title: t("sections.disclosure.title"),
          content: (
            <>
              <LegalP>{t("sections.disclosure.description")}</LegalP>
              <LegalH3>{t("sections.businessTransfers.title")}</LegalH3>
              <LegalP>{t("sections.businessTransfers.description")}</LegalP>
              <LegalH3>{t("sections.thirdParty.title")}</LegalH3>
              <LegalP>{t("sections.thirdParty.description")}</LegalP>
              <LegalH3>{t("sections.legal.title")}</LegalH3>
              <LegalP>{t("sections.legal.description")}</LegalP>
            </>
          ),
        },
        {
          id: "security",
          title: t("sections.security.title"),
          content: <LegalP>{t("sections.security.description")}</LegalP>,
        },
        {
          id: "your-rights",
          title: t("sections.rights.title"),
          content: (
            <>
              <LegalP>{t("sections.rights.description")}</LegalP>
              <LegalList
                items={[
                  t("sections.rights.items.access"),
                  t("sections.rights.items.correction"),
                  t("sections.rights.items.deletion"),
                  t("sections.rights.items.objection"),
                  t("sections.rights.items.portability"),
                ]}
              />
            </>
          ),
        },
        {
          id: "cookies",
          title: t("sections.cookies.title"),
          content: <LegalP>{t("sections.cookies.description")}</LegalP>,
        },
        {
          id: "third-party-sites",
          title: t("sections.thirdPartySites.title"),
          content: <LegalP>{t("sections.thirdPartySites.description")}</LegalP>,
        },
        {
          id: "children",
          title: t("sections.children.title"),
          content: <LegalP>{t("sections.children.description")}</LegalP>,
        },
        {
          id: "changes",
          title: t("sections.changes.title"),
          content: <LegalP>{t("sections.changes.description")}</LegalP>,
        },
        {
          id: "contact",
          title: configT("group.contact.title"),
          content: (
            <LegalP>
              {configT("group.contact.description")}{" "}
              <ExternalLink
                href={`mailto:${supportEmail}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {supportEmail}
              </ExternalLink>
            </LegalP>
          ),
        },
        {
          id: "gdpr",
          title: t("sections.gdpr.title"),
          content: <LegalP>{t("sections.gdpr.description")}</LegalP>,
        },
        {
          id: "ccpa",
          title: t("sections.ccpa.title"),
          content: <LegalP>{t("sections.ccpa.description")}</LegalP>,
        },
      ]}
    />
  );
}

export default async function PrivacyPolicyPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

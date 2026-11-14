import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Strong } from "next-vibe/ui/components/strong";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";

import { LegalCard, LegalDocument, LegalH3, LegalP } from "../_shared/legal";
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
    path: "story/imprint",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/imprint-hero.jpg`,
    category: t("meta.category"),
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/story/imprint`,
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

export interface ImprintPageData {
  locale: CountryLanguage;
  supportEmail: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ImprintPageData> {
  const { locale } = await params;
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  return { locale, supportEmail };
}

export function TanstackPage({
  locale,
  supportEmail,
}: ImprintPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <LegalDocument
      eyebrow={t("meta.category")}
      eyebrowIcon={Building}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      tocLabel={t("onThisPage")}
      actions={
        <PrintButton label={t("printButton")} ariaLabel={t("printAriaLabel")} />
      }
      intro={<LegalP>{t("introduction", { appName })}</LegalP>}
      sections={[
        {
          id: "company",
          title: t("sections.companyInfo.title"),
          content: (
            <>
              <LegalP>
                {t("sections.companyInfo.description", { appName })}
              </LegalP>
              <LegalCard>
                <Strong>{configT("group.responsiblePerson.name")}</Strong>
                <P>{configT("group.address.addressIn1Line")}</P>
              </LegalCard>
              <LegalP>{t("sections.companyInfo.vat")}</LegalP>
            </>
          ),
        },
        {
          id: "contact",
          title: t("sections.contactInfo.title"),
          content: (
            <>
              <LegalP>{t("sections.contactInfo.description")}</LegalP>
              <LegalCard>
                <Strong>{configT("group.address.title")}</Strong>
                <P>{configT("group.address.street")}</P>
                <P>{configT("group.address.city")}</P>
                <P>{configT("group.address.country")}</P>
                <ExternalLink
                  href={`mailto:${supportEmail}`}
                  className="mt-2 inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                >
                  {supportEmail}
                </ExternalLink>
              </LegalCard>
            </>
          ),
        },
        {
          id: "responsible-person",
          title: t("sections.responsiblePerson.title"),
          content: (
            <>
              <LegalP>{t("sections.responsiblePerson.description")}</LegalP>
              <LegalCard>
                <Strong>{configT("group.responsiblePerson.name")}</Strong>
                <P>{configT("group.address.addressIn1Line")}</P>
              </LegalCard>
            </>
          ),
        },
        {
          id: "dispute-resolution",
          title: t("sections.disputeResolution.title"),
          content: (
            <>
              <LegalP>{t("sections.disputeResolution.description")}</LegalP>
              <LegalP>{t("sections.disputeResolution.content")}</LegalP>
            </>
          ),
        },
        {
          id: "disclaimer",
          title: t("sections.disclaimer.title"),
          content: (
            <>
              <LegalH3>{t("sections.disclaimer.liability.title")}</LegalH3>
              <LegalP>{t("sections.disclaimer.liability.content")}</LegalP>
              <LegalH3>{t("sections.disclaimer.links.title")}</LegalH3>
              <LegalP>{t("sections.disclaimer.links.content")}</LegalP>
              <LegalH3>{t("sections.disclaimer.copyright.title")}</LegalH3>
              <LegalP>{t("sections.disclaimer.copyright.content")}</LegalP>
            </>
          ),
        },
      ]}
    />
  );
}

export default async function ImprintPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

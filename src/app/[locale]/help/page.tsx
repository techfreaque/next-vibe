export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { configScopedTranslation } from "@/config/i18n";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation as pageT } from "./i18n";
import HelpPageClient from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface HelpPageData {
  locale: CountryLanguage;
  jwtUser: JwtPayloadType;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
  modelCount: number;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "contact",
    title: t("meta.contact.title", { appName }),
    description: t("meta.contact.description", { appName }),
    category: t("meta.contact.category"),
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.contact.imageAlt", { appName }),
    keywords: [t("meta.contact.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.contact.ogTitle", { appName }),
        description: t("meta.contact.ogDescription"),
      },
      twitter: {
        title: t("meta.contact.twitterTitle", { appName }),
        description: t("meta.contact.twitterDescription"),
      },
    },
  });
}

export async function tanstackLoader({ params }: Props): Promise<HelpPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const jwtUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  const products = productsRepository.getProducts(locale);
  const country = getCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];
  const subPrice = products[ProductIds.SUBSCRIPTION].price;
  const subCredits = products[ProductIds.SUBSCRIPTION].credits;
  const packPrice = products[ProductIds.CREDIT_PACK].price;
  const packCredits = products[ProductIds.CREDIT_PACK].credits;
  const currencySymbol = countryInfo.symbol;

  const isAdmin = !jwtUser.isPublic && jwtUser.roles.includes(UserRole.ADMIN);
  const modelCount = getAvailableModelCount(isAdmin);

  return {
    locale,
    jwtUser,
    subPrice: `${currencySymbol}${subPrice}`,
    subCredits,
    packPrice: `${currencySymbol}${packPrice}`,
    packCredits,
    modelCount,
  };
}

export function TanstackPage({
  locale,
  jwtUser,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
  modelCount,
}: HelpPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  return (
    <Div
      role="main"
      className="min-h-screen bg-primary/5 bg-linear-to-b from-primary/5 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900"
    >
      <Div className="container max-w-6xl mx-auto pt-8 px-4">
        <Link
          href={`/${locale}/threads`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary mb-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("nav.home")}
        </Link>
      </Div>
      <HelpPageClient
        locale={locale}
        user={jwtUser}
        modelCount={modelCount}
        subPrice={subPrice}
        subCredits={subCredits}
        packPrice={packPrice}
        packCredits={packCredits}
      />
    </Div>
  );
}

export default async function ContactPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

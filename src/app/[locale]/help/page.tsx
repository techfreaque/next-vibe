import type { Metadata } from "next";
import { notFound } from "next-vibe-ui/lib/not-found";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/agent/models/models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

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
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "contact",
    title: "app.help.meta.contact.title",
    description: "app.help.meta.contact.description",
    category: "app.help.meta.contact.category",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.help.meta.contact.imageAlt",
    keywords: ["app.help.meta.contact.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.help.meta.contact.ogTitle",
        description: "app.help.meta.contact.ogDescription",
      },
      twitter: {
        title: "app.help.meta.contact.twitterTitle",
        description: "app.help.meta.contact.twitterDescription",
      },
    },
  });
}

export async function tanstackLoader({ params }: Props): Promise<HelpPageData> {
  const { locale } = await params;
  if (env.NEXT_PUBLIC_LOCAL_MODE) {
    notFound();
  }
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

  return {
    locale,
    jwtUser,
    subPrice: `${currencySymbol}${subPrice}`,
    subCredits,
    packPrice: `${currencySymbol}${packPrice}`,
    packCredits,
  };
}

export function TanstackPage({
  locale,
  jwtUser,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: HelpPageData): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div
      role="main"
      className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900"
    >
      <Div className="container max-w-6xl mx-auto pt-8 px-4">
        <Link
          href={`/${locale}/threads`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("app.help.nav.home")}
        </Link>
      </Div>
      <HelpPageClient
        locale={locale}
        user={jwtUser}
        modelCount={TOTAL_MODEL_COUNT}
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

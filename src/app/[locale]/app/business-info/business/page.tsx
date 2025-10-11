/**
 * Business Info Form Page
 * Company details and business information form
 */

import "server-only";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { BusinessForm } from "./_components/business-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return metadataGenerator(locale, {
    path: "app/business-info/business",
    title: "meta.businessInfo.title",
    description: "meta.businessInfo.description",
    category: "meta.businessInfo.category",
    image:
      "https://socialmediaservice.center/images/business-info-business.jpg",
    imageAlt: "meta.businessInfo.imageAlt",
    keywords: ["meta.businessInfo.category"],
  });
}

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function BusinessInfoPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth({}, logger);
  const user = userResponse.success ? userResponse.data : undefined;
  if (!user?.id) {
    redirect(
      `/${locale}/user/login?callbackUrl=/${locale}/app/business-info/business`,
    );
  }
  return (
    <div className="space-y-8">
      {/* Form */}
      <BusinessForm locale={locale} />
    </div>
  );
}

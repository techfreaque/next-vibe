/**
 * Goals Form Page
 * Business objectives and targets form
 */

import "server-only";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { GoalsForm } from "./_components/goals-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return metadataGenerator(locale, {
    path: "app/business-info/goals",
    title: "meta.businessInfo.title",
    description: "meta.businessInfo.description",
    category: "meta.businessInfo.category",
    image: "https://socialmediaservice.center/images/business-info-goals.jpg",
    imageAlt: "meta.businessInfo.imageAlt",
    keywords: ["meta.businessInfo.keywords.businessInformation"],
  });
}

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function GoalsPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth({}, logger);
  const user = userResponse.success ? userResponse.data : undefined;
  if (!user?.id) {
    redirect(
      `/${locale}/user/login?callbackUrl=/${locale}/app/business-info/goals`,
    );
  }
  return (
    <div className="space-y-8">
      {/* Form */}
      <GoalsForm locale={locale} />
    </div>
  );
}

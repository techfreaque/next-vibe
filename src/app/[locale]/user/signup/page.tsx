export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { ReferralRepository } from "@/app/api/[locale]/referral/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { envClient } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import SignUpForm from "./_components/sign-up-form";
import { scopedTranslation as pageT } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}

export interface SignUpPageData {
  locale: CountryLanguage;
  user: JwtPayloadType | null;
  initialReferralCode: string | null;
}

/**
 * Generate metadata for the Signup page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "signup",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: t("meta.imageAlt", { appName }),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription", { appName }),
        images: [
          "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export async function tanstackLoader({
  params,
  searchParams,
}: Props): Promise<SignUpPageData> {
  const { locale } = await params;
  const search = searchParams ? await searchParams : {};
  const refFromUrl = search["ref"] ?? null;
  const skillIdFromUrl = search["skillId"] ?? null;

  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await UserRepository.getUserByAuth({}, locale, logger);

  // Only redirect if user is authenticated and not a public user
  if (user.success && !user.data.isPublic) {
    redirect(`/${locale}/`);
  }

  if (!user.success) {
    return { locale, user: null, initialReferralCode: null };
  }

  const leadId = user.data.leadId;

  // Store skillId on lead from URL param (first-touch, if not already set)
  if (leadId && skillIdFromUrl) {
    const { LeadsRepository } =
      await import("@/app/api/[locale]/leads/repository");
    void LeadsRepository.updateLeadSkillId(
      leadId,
      skillIdFromUrl,
      false,
      logger,
    );
  }

  // Link referral code from URL param if present
  if (leadId && refFromUrl) {
    void ReferralRepository.linkReferralToLead(
      leadId,
      refFromUrl,
      logger,
      locale,
    );
  }

  // Get the latest referral code for the lead (URL ref takes priority over DB)
  let initialReferralCode: string | null = refFromUrl;
  if (!initialReferralCode && leadId) {
    const referralResult = await ReferralRepository.getLatestLeadReferralCode(
      leadId,
      logger,
      locale,
    );
    if (referralResult.success && referralResult.data.referralCode) {
      initialReferralCode = referralResult.data.referralCode;
    }
  }

  return { locale, user: user.data, initialReferralCode };
}

export function TanstackPage({
  locale,
  user,
  initialReferralCode,
}: SignUpPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  if (!user) {
    return <Div>{t("errors.failedToLoadBrowserIdentity")}</Div>;
  }

  return (
    <>
      <Link
        href={`/${locale}/threads`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToHome")}
      </Link>
      <SignUpForm
        locale={locale}
        initialReferralCode={initialReferralCode}
        user={user}
      />
    </>
  );
}

/**
 * Signup Page Component
 * Fully definition-driven using EndpointsPage
 */
export default async function SignUpPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

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
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import SignUpForm from "./_components/sign-up-form";
import { scopedTranslation as pageT } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
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
  return metadataGenerator(locale, {
    path: "signup",
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle"),
        description: t("meta.ogDescription"),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: t("meta.imageAlt"),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle"),
        description: t("meta.twitterDescription"),
        images: [
          "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<SignUpPageData> {
  const { locale } = await params;
  if (env.NEXT_PUBLIC_LOCAL_MODE) {
    redirect(`/${locale}/user/login`);
  }

  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await UserRepository.getUserByAuth({}, locale, logger);

  // Only redirect if user is authenticated and not a public user
  if (user.success && !user.data.isPublic) {
    redirect(`/${locale}/`);
  }

  if (!user.success) {
    return { locale, user: null, initialReferralCode: null };
  }

  // Get the latest referral code for the lead (if any)
  let initialReferralCode: string | null = null;
  if (user.data.leadId) {
    const referralResult = await ReferralRepository.getLatestLeadReferralCode(
      user.data.leadId,
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

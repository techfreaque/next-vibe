import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { ReferralRepository } from "@/app/api/[locale]/referral/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import SignUpForm from "@/app/api/[locale]/user/public/signup/_components/sign-up-form";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the Signup page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "signup",
    title: "app.user.signup.meta.title",
    description: "app.user.signup.meta.description",
    category: "app.user.signup.meta.category",
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.user.signup.meta.imageAlt",
    keywords: ["app.user.signup.meta.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.user.signup.meta.ogTitle",
        description: "app.user.signup.meta.ogDescription",
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "app.user.signup.meta.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.user.signup.meta.twitterTitle",
        description: "app.user.signup.meta.twitterDescription",
        images: [
          "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

/**
 * Signup Page Component
 * Fully definition-driven using EndpointsPage
 */
export default async function SignUpPage({ params }: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await UserRepository.getUserByAuth({}, locale, logger);

  // Only redirect if user is authenticated and not a public user
  if (user.success && !user.data.isPublic) {
    redirect(`/${locale}/`);
  }

  // Get the latest referral code for the lead (if any)
  let initialReferralCode: string | undefined;
  if (user.success && user.data.leadId) {
    const referralResult = await ReferralRepository.getLatestLeadReferralCode(
      user.data.leadId,
      logger,
    );
    if (referralResult.success && referralResult.data.referralCode) {
      initialReferralCode = referralResult.data.referralCode;
    }
  }
  if (!user.success) {
    return <Div>{t("app.user.signup.errors.failedToLoadBrowserIdentity")}</Div>;
  }

  return (
    <>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("app.user.common.backToHome")}
      </Link>
      <SignUpForm
        locale={locale}
        initialReferralCode={initialReferralCode ?? null}
        user={user.data}
      />
    </>
  );
}

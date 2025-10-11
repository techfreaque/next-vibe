import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { JSX } from "react";

import { onboardingRepository } from "@/app/api/[locale]/v1/core/onboarding/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { loginRepository } from "@/app/api/[locale]/v1/core/user/public/login/repository";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { LoginForm } from "./_components/login-form";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}

/**
 * Generate metadata for the Login page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "login",
    title: "meta.login.title",
    description: "meta.login.description",
    category: "meta.login.category",
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "meta.login.imageAlt",
    keywords: ["meta.login.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.login.ogTitle",
        description: "meta.login.ogDescription",
        url: `https://nextvibe.dev/${locale}/login`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "meta.login.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.login.twitterTitle",
        description: "meta.login.twitterDescription",
        images: [
          "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export default async function LoginPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check if user is already logged in using repository-first pattern
  const verifiedUserResponse = await userRepository.getUserByAuth({}, logger);
  // Redirect if already authenticated
  if (verifiedUserResponse.success && verifiedUserResponse.data) {
    // If there's a callback URL, use it
    if (callbackUrl) {
      redirect(callbackUrl);
    }
    const userId = verifiedUserResponse.data.id;
    if (userId) {
      // Otherwise, check onboarding status to determine where to redirect
      const onboardingResponse = await onboardingRepository.getOnboardingStatus(
        userId,
        logger,
      );

      const isOnboardingComplete = onboardingResponse.success
        ? onboardingResponse.data.isCompleted
        : false;

      // Redirect based on onboarding status
      if (isOnboardingComplete) {
        redirect(`/${locale}/app/dashboard`);
      } else {
        redirect(`/${locale}/app/onboarding`);
      }
    } else {
      logger.error("No user ID in JWT payload", {
        payload: verifiedUserResponse.data,
      });
    }
  }

  // Get login options
  const loginOptionsResponse = await loginRepository.getLoginOptions(
    logger,
    undefined,
  );
  if (!loginOptionsResponse.success) {
    return (
      <div>
        {t(loginOptionsResponse.message, loginOptionsResponse.messageParams)}
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.backToHome")}
      </Link>
      <div className="">
        <div className="order-1 md:order-2 text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {t("auth.login.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              {t("auth.login.subtitle")}
            </p>
          </div>
        </div>
        <LoginForm locale={locale} loginOptions={loginOptionsResponse.data}  />
      </div>
    </>
  );
}

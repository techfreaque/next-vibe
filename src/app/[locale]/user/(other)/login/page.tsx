import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { loginRepository } from "@/app/api/[locale]/v1/core/user/public/login/repository";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { translations } from "@/config/i18n/en";

import { LoginForm } from "@/app/api/[locale]/v1/core/user/public/login/_components/login-form";

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
    title: "app.user.other.login.meta.title",
    description: "app.user.other.login.meta.description",
    category: "app.user.other.login.meta.category",
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.user.other.login.meta.imageAlt",
    keywords: ["app.user.other.login.meta.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.user.other.login.meta.ogTitle",
        description: "app.user.other.login.meta.ogDescription",
        url: `${translations.websiteUrl}/${locale}/login`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "app.user.other.login.meta.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.user.other.login.meta.twitterTitle",
        description: "app.user.other.login.meta.twitterDescription",
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
  // Allow both PUBLIC and CUSTOMER roles for login page
  const verifiedUserResponse = await userRepository.getUserByAuth(
    { roles: [UserRole.PUBLIC, UserRole.CUSTOMER] },
    locale,
    logger,
  );
  // Redirect if already authenticated (not public)
  if (
    verifiedUserResponse.success &&
    verifiedUserResponse.data &&
    !verifiedUserResponse.data.isPublic
  ) {
    // If there's a callback URL, use it
    const userId = verifiedUserResponse.data.id;
    if (userId) {
      if (callbackUrl) {
        redirect(callbackUrl);
      }
      redirect(`/${locale}`);
    }
  }

  // Get login options
  const loginOptionsResponse = await loginRepository.getLoginOptions(
    logger,
    locale,
    undefined,
  );
  if (!loginOptionsResponse.success) {
    return (
      <Div>
        {t(loginOptionsResponse.message, loginOptionsResponse.messageParams)}
      </Div>
    );
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
      <Div className="">
        <Div className="order-1 md:order-2 text-center">
          <Div className="mb-8">
            <H1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {t("app.user.other.login.auth.login.title")}
            </H1>
            <P className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              {t("app.user.other.login.auth.login.subtitle")}
            </P>
          </Div>
        </Div>
        <LoginForm locale={locale} loginOptions={loginOptionsResponse.data} />
      </Div>
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  DEV_SEED_PASSWORD,
  DEV_SEED_USERS,
} from "@/app/api/[locale]/user/dev-seed-users";
import { LoginForm } from "@/app/api/[locale]/user/public/login/_components/login-form";
import { LoginRepository } from "@/app/api/[locale]/user/public/login/repository";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

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
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/login`,
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

/**
 * Login Page Component
 */
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
  const verifiedUserResponse = await UserRepository.getUserByAuth(
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
    const userId = verifiedUserResponse.data.id;
    if (userId) {
      if (callbackUrl) {
        redirect(callbackUrl);
      }
      redirect(`/${locale}`);
    }
  }

  // Get login options
  const loginOptionsResponse = await LoginRepository.getLoginOptions(
    logger,
    locale,
  );
  if (!loginOptionsResponse.success) {
    return (
      <Div>
        {t(loginOptionsResponse.message, loginOptionsResponse.messageParams)}
      </Div>
    );
  }
  if (!verifiedUserResponse.success) {
    return (
      <Div>{t("app.user.other.login.errors.failedToLoadBrowserIdentity")}</Div>
    );
  }

  const devSeedPassword =
    env.NODE_ENV === "development" ? DEV_SEED_PASSWORD : null;
  const devSeedUsers = env.NODE_ENV === "development" ? DEV_SEED_USERS : null;

  return (
    <>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("app.user.common.backToHome")}
      </Link>
      <LoginForm
        locale={locale}
        callbackUrl={callbackUrl}
        user={verifiedUserResponse.data}
        devSeedPassword={devSeedPassword}
        devSeedUsers={devSeedUsers}
      />
    </>
  );
}

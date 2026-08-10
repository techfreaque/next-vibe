export const dynamic = "force-dynamic";

import type { Metadata, Route } from "next";
import { coreEnv } from "next-vibe/core/env";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { Link } from "next-vibe/ui/components/link";
import { redirect } from "next-vibe/ui/lib/redirect";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
import { DEV_SEED_PASSWORD, DEV_SEED_USERS } from "@/user/dev-seed-users";
import { scopedTranslation as loginScopedTranslation } from "@/user/public/login/i18n";
import type { LoginOptions } from "@/user/public/login/repository";
import { LoginRepository } from "@/user/public/login/repository";

import { LoginForm } from "./_components/login-form";
import { scopedTranslation as pageT } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<{ callbackUrl?: Route }>;
}

export interface LoginPageData {
  locale: CountryLanguage;
  callbackUrl: Route | undefined;
  user: JwtPayloadType | null;
  loginOptions: LoginOptions | null;
  errorMessage: string | null;
  devSeedPassword: string | null;
  devSeedUsers: typeof DEV_SEED_USERS | null;
  platform: Platform;
}

/**
 * Generate metadata for the Login page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "login",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/login`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: t("meta.imageAlt"),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription"),
        images: [
          "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export async function tanstackLoader({
  params,
  searchParams,
}: Props): Promise<LoginPageData> {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  const { t } = pageT.scopedT(locale);
  const { t: loginT } = loginScopedTranslation.scopedT(locale);
  const logger = createEndpointLogger(false, locale);

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
    loginT,
  );
  if (!loginOptionsResponse.success) {
    return {
      locale,
      callbackUrl,
      user: null,
      loginOptions: null,
      errorMessage: loginOptionsResponse.message,
      devSeedPassword: null,
      devSeedUsers: null,
      platform: Platform.NEXT_PAGE,
    };
  }
  if (!verifiedUserResponse.success) {
    return {
      locale,
      callbackUrl,
      user: null,
      loginOptions: loginOptionsResponse.data,
      errorMessage: t("errors.failedToLoadBrowserIdentity"),
      devSeedPassword: null,
      devSeedUsers: null,
      platform: Platform.NEXT_PAGE,
    };
  }

  const devSeedPassword =
    coreEnv.NODE_ENV === "development" ? DEV_SEED_PASSWORD : null;
  const devSeedUsers =
    coreEnv.NODE_ENV === "development" ? DEV_SEED_USERS : null;

  return {
    locale,
    callbackUrl,
    user: verifiedUserResponse.data,
    loginOptions: loginOptionsResponse.data,
    errorMessage: null,
    devSeedPassword,
    devSeedUsers,
    platform: Platform.NEXT_PAGE,
  };
}

export function TanstackPage({
  locale,
  callbackUrl,
  user,
  loginOptions,
  errorMessage,
  devSeedPassword,
  devSeedUsers,
  platform,
}: LoginPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  if (errorMessage || !loginOptions || !user) {
    return <Div>{errorMessage ?? t("errors.failedToLoadBrowserIdentity")}</Div>;
  }

  return (
    <Div className="container max-w-xl mx-auto py-8 px-4">
      <Link
        href={`/${locale}/threads`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToHome")}
      </Link>
      <LoginForm
        locale={locale}
        callbackUrl={callbackUrl}
        user={user}
        devSeedPassword={devSeedPassword}
        devSeedUsers={devSeedUsers}
        platform={platform}
      />
    </Div>
  );
}

/**
 * Login Page Component
 */
export default async function LoginPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}

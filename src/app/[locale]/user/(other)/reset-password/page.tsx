export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import ResetPasswordForm from "./_components/reset-password-form";
import { scopedTranslation as pageT } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface ResetPasswordPageData {
  locale: CountryLanguage;
  user: JWTPublicPayloadType | null;
  errorMessage: string | null;
}

/**
 * Generate metadata for the Reset Password page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "reset-password",
    title: "app.user.other.resetPassword.meta.passwordReset.title",
    description: "app.user.other.resetPassword.meta.passwordReset.description",
    category: "app.user.other.resetPassword.meta.passwordReset.category",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.user.other.resetPassword.meta.passwordReset.imageAlt",
    keywords: ["app.user.other.resetPassword.meta.passwordReset.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.user.other.resetPassword.meta.passwordReset.title",
        description:
          "app.user.other.resetPassword.meta.passwordReset.description",
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/reset-password`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "app.user.other.resetPassword.meta.passwordReset.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.user.other.resetPassword.meta.passwordReset.title",
        description:
          "app.user.other.resetPassword.meta.passwordReset.description",
        images: [
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<ResetPasswordPageData> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check if user is already logged in using repository-first pattern
  const verifiedUserResponse = await UserRepository.getUserByAuth(
    {},
    locale,
    logger,
  );
  const user = verifiedUserResponse.success
    ? verifiedUserResponse.data
    : undefined;

  // Redirect to dashboard if already authenticated
  if (user && !user.isPublic) {
    redirect(`/${locale}/`);
  }

  if (!user) {
    return {
      locale,
      user: null,
      errorMessage: verifiedUserResponse.success
        ? t("errors.unknown")
        : verifiedUserResponse.message,
    };
  }

  if (!user.isPublic) {
    redirect(`/${locale}/`);
  }

  return { locale, user, errorMessage: null };
}

export function TanstackPage({
  locale,
  user,
  errorMessage,
}: ResetPasswordPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  if (errorMessage ?? !user) {
    return <Div>{errorMessage ?? t("errors.unknown")}</Div>;
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

      <ResetPasswordForm locale={locale} user={user} />
    </>
  );
}

export default async function ResetPasswordPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

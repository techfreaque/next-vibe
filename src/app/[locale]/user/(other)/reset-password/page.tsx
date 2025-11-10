import { ArrowLeft } from "next-vibe-ui/ui/icons";
import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { translations } from "@/config/i18n/en";

import ResetPasswordForm from "./_components/reset-password-form";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
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
        url: `${translations.websiteUrl}/${locale}/reset-password`,
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

export default async function ResetPasswordPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check if user is already logged in using repository-first pattern
  const verifiedUserResponse = await userRepository.getUserByAuth(
    {},
    locale,
    logger,
  );

  // Redirect to dashboard if already authenticated
  if (
    verifiedUserResponse.success &&
    verifiedUserResponse.data &&
    !verifiedUserResponse.data.isPublic
  ) {
    redirect(`/${locale}/`);
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

      <ResetPasswordForm locale={locale} />
    </>
  );
}

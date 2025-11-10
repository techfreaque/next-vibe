import { AlertCircle } from "next-vibe-ui/ui/icons";
import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { Suspense } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { passwordRepository } from "@/app/api/[locale]/v1/core/user/public/reset-password/repository";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { translations } from "@/config/i18n/en";

import ResetPasswordConfirmForm from "./_components/reset-password-confirm-form";

/**
 * Generate metadata for the Reset Password Confirm page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "reset-password-confirm",
    title: "app.user.other.resetPassword.meta.passwordReset.title",
    description: "app.user.other.resetPassword.meta.passwordReset.description",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.user.other.resetPassword.meta.passwordReset.imageAlt",
    keywords: ["app.user.other.resetPassword.meta.passwordReset.keywords"],
    category: "app.user.other.resetPassword.meta.passwordReset.category",
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

interface Props {
  params: Promise<{ locale: CountryLanguage; token: string }>;
}

export default async function ResetPasswordConfirmPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale, token } = await params;
  const { t } = simpleT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check if user is already logged in using repository-first pattern
  const verifiedUserResponse = await userRepository.getUserByAuth(
    {},
    locale,
    logger,
  );

  // Redirect to dashboard if already authenticated
  if (verifiedUserResponse.success && verifiedUserResponse.data) {
    redirect(`/${locale}/dashboard`);
  }

  // Validate token on the server side
  const tokenValidationResponse = await passwordRepository.verifyResetToken(
    token,
    logger,
  );

  return (
    <ErrorBoundary
      fallback={
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("app.user.common.error.title")}</AlertTitle>
          <AlertDescription>
            {t(
              "app.user.other.resetPassword.auth.resetPassword.errors.loadingError",
            )}
          </AlertDescription>
        </Alert>
      }
      locale={locale}
    >
      <Suspense fallback={<Div>{t("app.user.common.loading")}</Div>}>
        <Div className="max-w-md mx-auto">
          <ResetPasswordConfirmForm
            locale={locale}
            token={token}
            tokenValidationResponse={tokenValidationResponse}
          />
        </Div>
      </Suspense>
    </ErrorBoundary>
  );
}

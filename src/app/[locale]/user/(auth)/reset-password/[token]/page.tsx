export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import type { JSX } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { scopedTranslation as resetPasswordScopedTranslation } from "@/app/api/[locale]/user/public/reset-password/i18n";
import { PasswordRepository } from "@/app/api/[locale]/user/public/reset-password/repository";
import type { ResetPasswordValidateGetResponseOutput } from "@/app/api/[locale]/user/public/reset-password/validate/definition";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { envClient } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { scopedTranslation as pageT } from "../i18n";
import ResetPasswordConfirmForm from "./_components/reset-password-confirm-form";

/**
 * Generate metadata for the Reset Password Confirm page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "reset-password-confirm",
    title: t("meta.passwordReset.title", { appName }),
    description: t("meta.passwordReset.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.passwordReset.imageAlt"),
    keywords: [t("meta.passwordReset.keywords", { appName })],
    category: t("meta.passwordReset.category"),
    additionalMetadata: {
      openGraph: {
        title: t("meta.passwordReset.title", { appName }),
        description: t("meta.passwordReset.description", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/reset-password`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: t("meta.passwordReset.imageAlt"),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.passwordReset.title", { appName }),
        description: t("meta.passwordReset.description", { appName }),
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

export interface ResetPasswordConfirmPageData {
  locale: CountryLanguage;
  token: string;
  user: JwtPayloadType | undefined;
  tokenValidationResponse: ResponseType<ResetPasswordValidateGetResponseOutput>;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ResetPasswordConfirmPageData> {
  const { locale, token } = await params;
  const { t: resetPasswordT } = resetPasswordScopedTranslation.scopedT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check if user is already logged in using repository-first pattern
  const verifiedUserResponse = await UserRepository.getUserByAuth(
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
    redirect(`/${locale}`);
  }

  const user = verifiedUserResponse.success
    ? verifiedUserResponse.data
    : undefined;

  // Validate token on the server side
  const tokenValidationResponse = await PasswordRepository.verifyResetToken(
    token,
    logger,
    resetPasswordT,
    locale,
  );

  return { locale, token, user, tokenValidationResponse };
}

export function TanstackPage({
  locale,
  token,
  user,
  tokenValidationResponse,
}: ResetPasswordConfirmPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  const errorFallback = (
    <Alert variant="destructive" className="mb-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("errors.title")}</AlertTitle>
      <AlertDescription>
        {t("auth.resetPassword.errors.loadingError")}
      </AlertDescription>
    </Alert>
  );

  if (!user) {
    return errorFallback;
  }

  return (
    <ErrorBoundary fallback={errorFallback} locale={locale}>
      <Div className="max-w-md mx-auto">
        <ResetPasswordConfirmForm
          user={user}
          locale={locale}
          token={token}
          tokenValidationResponse={tokenValidationResponse}
        />
      </Div>
    </ErrorBoundary>
  );
}

export default async function ResetPasswordConfirmPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

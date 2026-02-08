"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Link } from "next-vibe-ui/ui/link";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import resetConfirmDefinitions from "@/app/api/[locale]/user/public/reset-password/confirm/definition";
import type { ResetPasswordValidateGetResponseOutput } from "@/app/api/[locale]/user/public/reset-password/validate/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "../../../../auth/types";

interface ResetPasswordConfirmFormProps {
  locale: CountryLanguage;
  token: string;
  tokenValidationResponse: ResponseType<ResetPasswordValidateGetResponseOutput>;
  user: JwtPayloadType;
}

export default function ResetPasswordConfirmForm({
  locale,
  token,
  tokenValidationResponse,
  user,
}: ResetPasswordConfirmFormProps): JSX.Element {
  const { t } = simpleT(locale);

  // Extract token validation status
  const tokenValid = tokenValidationResponse.success
    ? tokenValidationResponse.data?.response?.valid
    : false;

  // If the token is invalid, show error state
  if (tokenValid === false) {
    return (
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="pt-6 space-y-4">
            <Div className="text-destructive text-center">
              {tokenValidationResponse.success
                ? t(
                    tokenValidationResponse.data?.response?.message ||
                      "app.common.errors.unknown",
                  )
                : t(
                    tokenValidationResponse.message,
                    tokenValidationResponse.messageParams,
                  )}
            </Div>
            <Div className="text-center">
              <Button asChild>
                <Link href={`/${locale}/user/reset-password`}>
                  {t(
                    "app.user.other.resetPassword.auth.resetPassword.requestNewLink",
                  )}
                </Link>
              </Button>
            </Div>
          </CardContent>
        </Card>
      </MotionDiv>
    );
  }

  // Valid token - show the reset password form using EndpointsPage
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EndpointsPage
        endpoint={resetConfirmDefinitions}
        locale={locale}
        user={user}
        endpointOptions={{
          create: {
            initialState: {
              token,
              email: "",
            },
          },
        }}
      />
    </MotionDiv>
  );
}

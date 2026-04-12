"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import resetConfirmDefinitions from "@/app/api/[locale]/user/public/reset-password/confirm/definition";
import { scopedTranslation } from "@/app/api/[locale]/user/public/reset-password/confirm/i18n";
import type { ResetPasswordValidateGetResponseOutput } from "@/app/api/[locale]/user/public/reset-password/validate/definition";
import type { CountryLanguage } from "@/i18n/core/config";

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
  const { t } = scopedTranslation.scopedT(locale);
  const router = useRouter();
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
                ? (tokenValidationResponse.data?.response?.message ??
                  t("errors.unknown.title"))
                : tokenValidationResponse.message}
            </Div>
            <Div className="text-center">
              <Button asChild>
                <Link href={`/${locale}/user/reset-password`}>
                  {t("actions.requestNewLink")}
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
            mutationOptions: {
              onSuccess: () => {
                router.push(`/${locale}/user/login`);
              },
            },
          },
        }}
      />
    </MotionDiv>
  );
}

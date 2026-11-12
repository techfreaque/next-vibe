"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Card, CardContent } from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Link } from "next-vibe/ui/components/link";
import { MotionDiv } from "next-vibe/ui/components/motion";
import { Span } from "next-vibe/ui/components/span";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import resetConfirmDefinitions from "@/user/public/reset-password/confirm/definition";
import { scopedTranslation } from "@/user/public/reset-password/confirm/i18n";
import type { ResetPasswordValidateGetResponseOutput } from "@/user/public/reset-password/validate/definition";

interface ResetPasswordConfirmFormProps {
  locale: CountryLanguage;
  token: string;
  tokenValidationResponse: ResponseType<ResetPasswordValidateGetResponseOutput>;
  user: JwtPayloadType;
  platform: Platform;
}

export default function ResetPasswordConfirmForm({
  locale,
  token,
  tokenValidationResponse,
  user,
  platform,
}: ResetPasswordConfirmFormProps): JSX.Element {
  const logger = useLogger();
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
        <Card className="rounded-xl shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
            <Span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </Span>
            <Div className="text-base font-medium text-foreground">
              {tokenValidationResponse.success
                ? (tokenValidationResponse.data?.response?.message ??
                  t("errors.unknown.title"))
                : tokenValidationResponse.message}
            </Div>
            <Button asChild className="h-11 w-full">
              <Link href={`/${locale}/user/reset-password`}>
                {t("actions.requestNewLink")}
              </Link>
            </Button>
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
        logger={logger}
        endpoint={resetConfirmDefinitions}
        locale={locale}
        user={user}
        platform={platform}
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

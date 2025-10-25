"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { Environment } from "next-vibe/shared/utils/env-util";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormItem,
} from "next-vibe-ui/ui";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useResetPasswordConfirm } from "@/app/api/[locale]/v1/core/user/public/reset-password/confirm/hooks";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { PasswordStrengthIndicator } from "../../../../_components/password-strength-indicator";

interface ResetPasswordConfirmFormProps {
  locale: CountryLanguage;
  token: string;
  tokenValidationResponse: ResponseType<string>;
}

export default function ResetPasswordConfirmForm({
  locale,
  token,
  tokenValidationResponse,
}: ResetPasswordConfirmFormProps): JSX.Element {
  const { t } = simpleT(locale);

  // Initialize logger for client-side operations
  const logger = createEndpointLogger(
    envClient.NODE_ENV === Environment.DEVELOPMENT,
    Date.now(),
    locale,
  );

  const {
    form,
    submitForm,
    isSubmitting,
    passwordValue,
    tokenValid,
    alert,
    isSuccess,
  } = useResetPasswordConfirm(token, tokenValidationResponse, logger);

  // If the token is invalid
  if (tokenValid === false) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="pt-6">
            {alert && <FormAlert alert={alert} className="mb-6" />}
            <div className="text-center">
              <Button asChild>
                <Link href={`/${locale}/user/reset-password`}>
                  {t(
                    "app.user.other.resetPassword.auth.resetPassword.requestNewLink",
                  )}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // If password reset was successful
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="pt-6">
            {alert && <FormAlert alert={alert} className="mb-6" />}
            <div className="text-center">
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href={`/${locale}/user/login`}>
                  {t("app.user.other.login.auth.login.signInButton")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Valid token, show the form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            {t(
              "app.user.other.resetPassword.auth.resetPassword.createNewPasswordTitle",
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {t(
              "app.user.other.resetPassword.auth.resetPassword.createNewPasswordSubtitle",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show form alert if any */}
          {alert && <FormAlert alert={alert} className="mb-6" />}

          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <EndpointFormField
              name="verification.email"
              config={{
                type: "email",
                label:
                  "app.user.other.resetPassword.auth.resetPassword.emailLabel",
                placeholder:
                  "app.user.other.resetPassword.auth.resetPassword.emailPlaceholder",
                disabled: isSubmitting,
              }}
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <FormItem>
              <EndpointFormField
                name="newPassword.password"
                config={{
                  type: "password",
                  label:
                    "app.user.other.resetPassword.auth.resetPassword.newPasswordLabel",
                  placeholder:
                    "app.user.other.resetPassword.auth.resetPassword.newPasswordPlaceholder",
                  disabled: isSubmitting,
                }}
                control={form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
              <PasswordStrengthIndicator
                password={passwordValue}
                locale={locale}
              />
            </FormItem>

            <EndpointFormField
              name="newPassword.confirmPassword"
              config={{
                type: "password",
                label:
                  "app.user.other.resetPassword.auth.resetPassword.confirmPasswordLabel",
                placeholder:
                  "app.user.other.resetPassword.auth.resetPassword.confirmPasswordPlaceholder",
                disabled: isSubmitting,
              }}
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("app.user.common.loading")}
                </>
              ) : (
                t(
                  "app.user.other.resetPassword.auth.resetPassword.resetPasswordButton",
                )
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
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

import { useResetPasswordConfirm } from "@/app/api/[locale]/v1/core/user/public/reset-password/confirm/hooks";
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

  const {
    form,
    submitForm,
    isSubmitting,
    passwordValue,
    tokenValid,
    alert,
    isSuccess,
  } = useResetPasswordConfirm(token, tokenValidationResponse);

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
                  {t("auth.resetPassword.requestNewLink")}
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
                  {t("auth.login.signInButton")}
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
            {t("auth.resetPassword.createNewPasswordTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.resetPassword.createNewPasswordSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show form alert if any */}
          {alert && <FormAlert alert={alert} className="mb-6" />}

          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <EndpointFormField
              name="email"
              config={{
                type: "email",
                label: "auth.resetPassword.emailLabel",
                placeholder: "auth.resetPassword.emailPlaceholder",
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
                name="password"
                config={{
                  type: "password",
                  label: "auth.resetPassword.newPasswordLabel",
                  placeholder: "auth.resetPassword.newPasswordPlaceholder",
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
              name="confirmPassword"
              config={{
                type: "password",
                label: "auth.resetPasswordConfirm.confirmPassword",
                placeholder: "auth.resetPassword.confirmPasswordPlaceholder",
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
                  {t("common.loading")}
                </>
              ) : (
                t("auth.resetPassword.resetPasswordButton")
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

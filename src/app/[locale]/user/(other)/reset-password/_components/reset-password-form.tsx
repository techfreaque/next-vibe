"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'next-vibe-ui/ui/icons';
import { Environment } from "next-vibe/shared/utils/env-util";
import { Link } from "next-vibe-ui/ui/link";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useResetPasswordRequest } from "@/app/api/[locale]/v1/core/user/public/reset-password/request/hooks";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ResetPasswordFormProps {
  locale: CountryLanguage;
}

export default function ResetPasswordForm({
  locale,
}: ResetPasswordFormProps): JSX.Element {
  const { t } = simpleT(locale);

  // Initialize logger for client-side operations
  const logger = createEndpointLogger(
    envClient.NODE_ENV === Environment.DEVELOPMENT,
    Date.now(),
    locale,
  );

  // Use the enhanced reset password request hook that includes all form logic
  const { form, submitForm, isSubmitting, isSuccess, alert } =
    useResetPasswordRequest(logger);

  // Show success state when the form has been successfully submitted
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <Div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </Div>
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              {t(
                "app.user.other.resetPassword.auth.resetPassword.successTitle",
              )}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              {t(
                "app.user.other.resetPassword.auth.resetPassword.successMessage",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <P className="text-sm text-blue-700 dark:text-blue-300">
                {t("app.user.other.resetPassword.auth.resetPassword.emailSent")}
              </P>
            </Div>
            <Div className="flex pt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/${locale}/user/login`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t(
                    "app.user.other.resetPassword.auth.resetPassword.backToLogin",
                  )}
                </Link>
              </Button>
            </Div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
        <CardHeader className="text-center pb-6">
          <Div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </Div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("app.user.other.resetPassword.auth.resetPassword.title")}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
            {t("app.user.other.resetPassword.auth.resetPassword.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show form alert if any */}
          {alert && <FormAlert alert={alert} className="mb-6" />}

          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <EndpointFormField
              name="emailInput.email"
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

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("app.user.common.loading")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  {t(
                    "app.user.other.resetPassword.auth.resetPassword.sendResetLink",
                  )}
                </>
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

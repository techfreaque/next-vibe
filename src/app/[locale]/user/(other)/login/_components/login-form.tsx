"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, Form } from "next-vibe-ui/ui";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useLogin } from "@/app/api/[locale]/v1/core/user/public/login/hooks";
import type { LoginOptions } from "@/app/api/[locale]/v1/core/user/public/login/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LoginFormProps {
  locale: CountryLanguage;
  loginOptions?: LoginOptions;
}

export function LoginForm({
  locale,
  loginOptions: initialLoginOptions = {
    allowPasswordAuth: true,
    allowSocialAuth: false,
  },
}: LoginFormProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(true, Date.now(), locale);

  // Use the enhanced login hook that includes all form logic and state management
  const {
    form,
    submitForm,
    isSubmitting,
    isAccountLocked,
    loginOptions,
    alert,
  } = useLogin(initialLoginOptions, logger);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardContent className="mt-6">
          {/* Show form alert if any */}
          {alert && <FormAlert alert={alert} className="mb-6" />}

          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <EndpointFormField
              name="credentials.email"
              config={{
                type: "email",
                label: "app.user.other.login.auth.login.emailLabel",
                placeholder: "app.user.other.login.auth.login.emailPlaceholder",
                disabled: isSubmitting || isAccountLocked,
              }}
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <EndpointFormField
              name="credentials.password"
              config={{
                type: "password",
                label: "app.user.other.login.auth.login.passwordLabel",
                placeholder:
                  "app.user.other.login.auth.login.passwordPlaceholder",
                disabled: isSubmitting || isAccountLocked,
              }}
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <div className="flex justify-between items-center">
              <EndpointFormField
                name="options.rememberMe"
                config={{
                  type: "checkbox",
                  label: undefined, // Empty label for checkbox
                  checkboxLabel: "app.user.other.login.auth.login.rememberMe",
                  disabled: isSubmitting || isAccountLocked,
                }}
                control={form.control}
                theme={{
                  style: "none",
                }}
              />

              <Link
                href={`/${locale}/user/reset-password`}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("app.user.other.login.auth.login.forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
              disabled={
                isSubmitting ||
                isAccountLocked ||
                !loginOptions.allowPasswordAuth
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("app.user.common.loading")}
                </>
              ) : (
                t("app.user.other.login.auth.login.signInButton")
              )}
            </Button>

            {/* Social login options - only shown if allowed */}
            {loginOptions.allowSocialAuth &&
              loginOptions.socialProviders &&
              loginOptions.socialProviders.length > 0 && (
                <div className="mt-4">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-x-0 h-px bg-gray-300 dark:bg-gray-700" />
                    <span className="relative bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {t("app.user.other.login.auth.login.orContinueWith")}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {loginOptions.socialProviders.map((provider) => (
                      <Button
                        key={provider.name}
                        variant="outline"
                        type="button"
                        disabled={isSubmitting || isAccountLocked}
                        className="flex items-center justify-center"
                      >
                        {t(provider.name)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("app.user.other.login.login.dontHaveAccount")}{" "}
              <Link
                href={`/${locale}/user/signup`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("app.user.other.login.auth.login.createAccount")}
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

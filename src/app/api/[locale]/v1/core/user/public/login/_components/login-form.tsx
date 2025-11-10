"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
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
  const loginResult = useLogin(initialLoginOptions, logger);

  const { form, onSubmit, isSubmitting } = loginResult.create || {};
  const { isAccountLocked, loginOptions, alert } = loginResult;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardContent className="mt-6">
          {/* Show form alert if any */}
          {alert && <FormAlert alert={alert} className="mb-6" />}

          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <EndpointFormField
              name="credentials.email"
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
              config={{
                type: "email",
                label: "app.api.v1.core.user.public.login.fields.email.label",
                placeholder:
                  "app.api.v1.core.user.public.login.fields.email.placeholder",
                description:
                  "app.api.v1.core.user.public.login.fields.email.description",
              }}
            />

            <EndpointFormField
              name="credentials.password"
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
              config={{
                type: "password",
                label:
                  "app.api.v1.core.user.public.login.fields.password.label",
                placeholder:
                  "app.api.v1.core.user.public.login.fields.password.placeholder",
                description:
                  "app.api.v1.core.user.public.login.fields.password.description",
              }}
            />

            <Div className="flex justify-between items-center">
              <EndpointFormField
                name="options.rememberMe"
                control={form.control}
                theme={{
                  style: "none",
                }}
                config={{
                  type: "checkbox",
                  label:
                    "app.api.v1.core.user.public.login.fields.rememberMe.label",
                }}
              />

              <Link
                href={`/${locale}/user/reset-password`}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("app.user.other.login.auth.login.forgotPassword")}
              </Link>
            </Div>

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
                <Div className="mt-4">
                  <Div className="relative flex items-center justify-center">
                    <Span className="absolute inset-x-0 h-px bg-gray-300 dark:bg-gray-700" />
                    <Span className="relative bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {t("app.user.other.login.auth.login.orContinueWith")}
                    </Span>
                  </Div>

                  <Div className="mt-4 grid grid-cols-2 gap-2">
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
                  </Div>
                </Div>
              )}

            <Div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("app.user.other.login.login.dontHaveAccount")}{" "}
              <Link
                href={`/${locale}/user/signup`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("app.user.other.login.auth.login.createAccount")}
              </Link>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

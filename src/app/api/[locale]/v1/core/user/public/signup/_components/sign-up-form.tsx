"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Loader2 } from 'next-vibe-ui/ui/icons';
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import {
  FormField,
  FormItem,
} from "next-vibe-ui/ui/form/form";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type React from "react";

import signupDefinitions from "@/app/api/[locale]/v1/core/user/public/signup/definition";
import { useRegister } from "@/app/api/[locale]/v1/core/user/public/signup/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { PasswordStrengthIndicator } from "@/app/[locale]/user/_components/password-strength-indicator";

interface SignUpFormProps {
  locale: CountryLanguage;
}

export function renderTermsCheckboxLabel(
  t: TFunction,
  locale: CountryLanguage,
): React.ReactElement {
  return (
    <Span>
      {t("app.user.signup.auth.signup.termsAndConditions")}{" "}
      <Link
        href={`/${locale}/terms-of-service`}
        className="text-blue-600 hover:underline dark:text-blue-500"
      >
        {t("app.user.common.footer.terms")}
      </Link>
    </Span>
  );
}

/**
 * Sign-up form component for user registration
 *
 * TODO: Add social media sign-up options (Google, Facebook, etc.)
 * TODO: Implement multi-step form with progress indicator
 */
export default function SignUpForm({
  locale,
}: SignUpFormProps): React.ReactElement {
  const { t } = simpleT(locale);
  const signupResult = useRegister();
  const { form, submitForm, isSubmitting } = signupResult.create || {};
  const { alert } = signupResult;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="space-y-1 pb-2" />
        <CardContent className="p-2 md:p-6">
          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EndpointFormField
                name="personalInfo.privateName"
                control={form.control}
                endpointFields={signupDefinitions.POST.fields}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="personalInfo.publicName"
                control={form.control}
                endpointFields={signupDefinitions.POST.fields}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </Div>

            <EndpointFormField
              name="personalInfo.email"
              control={form.control}
              endpointFields={signupDefinitions.POST.fields}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <Div className="space-y-4">
              <FormField
                control={form.control}
                name="security.password"
                render={({ field }) => (
                  <FormItem>
                    <EndpointFormField
                      name="security.password"
                      control={form.control}
                      endpointFields={signupDefinitions.POST.fields}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />
                    <PasswordStrengthIndicator
                      password={field.value}
                      locale={locale}
                    />
                  </FormItem>
                )}
              />

              <EndpointFormField
                name="security.confirmPassword"
                control={form.control}
                endpointFields={signupDefinitions.POST.fields}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="consent.subscribeToNewsletter"
                control={form.control}
                endpointFields={signupDefinitions.POST.fields}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <Div className="flex items-center">
                <EndpointFormField
                  name="consent.acceptTerms"
                  control={form.control}
                  endpointFields={signupDefinitions.POST.fields}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>
              {/* Show form alert if any */}
              {alert && <FormAlert alert={alert} className="mb-6" />}

              <Button
                type="submit"
                className="w-full bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("app.user.signup.auth.signup.creatingAccount")}
                  </>
                ) : 
                  t("app.user.signup.auth.signup.createAccountButton")
                }
              </Button>

              <Div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t("app.user.signup.auth.signup.alreadyHaveAccount")}{" "}
                <Link
                  href={`/${locale}/user/login`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {t("app.user.signup.auth.signup.signIn")}
                </Link>
              </Div>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

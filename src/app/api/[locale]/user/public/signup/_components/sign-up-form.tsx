"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormField, FormItem } from "next-vibe-ui/ui/form/form";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";
import { useEffect, useState } from "react";

import signupDefinitions from "@/app/api/[locale]/user/public/signup/definition";
import { useRegister } from "@/app/api/[locale]/user/public/signup/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";
import { PasswordStrengthIndicator } from "./password-strength-indicator";

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
  const { form, submitForm, isSubmitting } = signupResult.create;
  const { alert } = signupResult;
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLinked, setReferralLinked] = useState(false);

  // Check localStorage for referral code on mount and link to lead
  useEffect(() => {
    const storedCode = localStorage.getItem("referralCode");
    if (storedCode && !referralLinked) {
      setReferralCode(storedCode);

      // Link referral to lead
      const linkReferral = async (): Promise<void> => {
        try {
          const response = await fetch(`/api/${locale}/referral/link-to-lead`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralCode: storedCode }),
          });

          if (response.ok) {
            setReferralLinked(true);
            signupResult.logger.debug("Referral code linked to lead", {
              code: storedCode,
            });
          } else {
            // Invalid code - remove from localStorage
            localStorage.removeItem("referralCode");
            setReferralCode(null);
            signupResult.logger.warn("Invalid referral code", {
              code: storedCode,
            });
          }
        } catch (error) {
          signupResult.logger.error("Failed to link referral code", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };

      void linkReferral();
    }
  }, [locale, referralLinked, signupResult.logger]);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="flex flex-col gap-1 pb-2" />
        <CardContent className="p-2 md:p-6">
          <Form
            form={form}
            onSubmit={submitForm}
            className="flex flex-col gap-6"
          >
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

            <Div className="flex flex-col gap-4">
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

              {/* Show referral code if present, otherwise show input */}
              {referralCode ? (
                <Div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <P className="text-sm text-blue-700 dark:text-blue-300">
                    {t("app.user.signup.auth.signup.usingReferralCode")}:{" "}
                    <Span className="font-semibold">{referralCode}</Span>
                  </P>
                </Div>
              ) : (
                <EndpointFormField
                  name="referralCode"
                  control={form.control}
                  endpointFields={signupDefinitions.POST.fields}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              )}

              {/* Show form alert if any */}
              {alert && <FormAlert alert={alert} className="mb-6" />}

              <Button
                type="submit"
                className="w-full bg-blue-600 bg-linear-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("app.user.signup.auth.signup.creatingAccount")}
                  </>
                ) : (
                  t("app.user.signup.auth.signup.createAccountButton")
                )}
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

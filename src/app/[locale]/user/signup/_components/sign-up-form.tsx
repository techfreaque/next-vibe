"use client";

import { motion } from "framer-motion";
import { Calendar, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { errorLogger } from "next-vibe/shared/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type React from "react";

import { SignupType } from "@/app/api/[locale]/v1/core/user/public/signup/enum";
import { useRegister } from "@/app/api/[locale]/v1/core/user/public/signup/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { PasswordStrengthIndicator } from "../../_components/password-strength-indicator";

interface SignUpFormProps {
  locale: CountryLanguage;
}

function renderTermsCheckboxLabel(
  t: TFunction,
  locale: CountryLanguage,
): React.ReactElement {
  return (
    <span>
      {t("app.user.signup.auth.signup.termsAndConditions")}{" "}
      <Link
        href={`/${locale}/terms-of-service`}
        className="text-blue-600 hover:underline dark:text-blue-500"
      >
        {t("app.user.common.footer.terms")}
      </Link>
    </span>
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
  const { form, submitForm, isSubmitting, alert } = useRegister();
  const signupType = form.watch("preferences.signupType");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="space-y-1 pb-2" />
        <CardContent className="p-2 md:p-6">
          <Form form={form} onSubmit={submitForm} className="space-y-6">
            <FormField
              control={form.control}
              name="preferences.signupType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tabs
                      value={field.value}
                      onValueChange={(value) => {
                        // Only set the value if it's one of the valid options
                        if (
                          value === SignupType.MEETING ||
                          value === SignupType.PRICING
                        ) {
                          field.onChange(value);
                        } else {
                          errorLogger(
                            "app.api.v1.core.user.public.signup.errors.invalidSignupType",
                            { value },
                          );
                          // Shouldn't happen, but just in case
                          field.onChange(SignupType.PRICING);
                        }
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 mb-6 h-auto">
                        <TabsTrigger
                          value={SignupType.PRICING}
                          className="flex items-center justify-start gap-2 text-md min-h-[3rem]"
                        >
                          <CreditCard className="h-7 w-7 flex-shrink-0" />
                          <span>
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.direct",
                            )}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value={SignupType.MEETING}
                          className="flex items-center justify-start gap-2 text-md min-h-[3rem]"
                        >
                          <Calendar className="h-7 w-7 flex-shrink-0" />
                          <span>
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.schedule",
                            )}
                          </span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pricing" className="mt-0 mb-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.direct",
                            )}
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            {t("app.user.signup.auth.signup.directDescription")}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="meeting" className="mt-0 mb-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.schedule",
                            )}
                          </h3>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            {t(
                              "app.user.signup.auth.signup.scheduleDescription",
                            )}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EndpointFormField
                name="personalInfo.privateName"
                config={{
                  type: "text",
                  label: "app.user.signup.auth.signup.privateName",
                  placeholder:
                    "app.user.signup.auth.signup.privateNamePlaceholder",
                  disabled: isSubmitting,
                }}
                control={form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="personalInfo.publicName"
                config={{
                  type: "text",
                  label: "app.user.signup.auth.signup.publicName",
                  placeholder:
                    "app.user.signup.auth.signup.publicNamePlaceholder",
                  disabled: isSubmitting,
                }}
                control={form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            <EndpointFormField
              name="personalInfo.email"
              config={{
                type: "email",
                label: "app.user.signup.auth.signup.emailLabel",
                placeholder: "app.user.signup.auth.signup.emailPlaceholder",
                disabled: isSubmitting,
              }}
              control={form.control}
              theme={{
                style: "none",
                showAllRequired: false,
              }}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="security.password"
                render={({ field }) => (
                  <FormItem>
                    <EndpointFormField
                      name="security.password"
                      config={{
                        type: "password",
                        label: "app.user.signup.auth.signup.passwordLabel",
                        placeholder:
                          "app.user.signup.auth.signup.passwordPlaceholder",
                        disabled: isSubmitting,
                      }}
                      control={form.control}
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
                config={{
                  type: "password",
                  label: "app.user.signup.auth.signup.confirmPasswordLabel",
                  placeholder:
                    "app.user.signup.auth.signup.confirmPasswordPlaceholder",
                  disabled: isSubmitting,
                }}
                control={form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="consent.subscribeToNewsletter"
                config={{
                  type: "checkbox",
                  label: undefined,
                  checkboxLabel:
                    "app.user.signup.auth.signup.newsletterSubscription",
                  disabled: isSubmitting,
                }}
                control={form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <div className="flex items-center">
                <EndpointFormField
                  name="consent.acceptTerms"
                  config={{
                    type: "checkbox",
                    label: undefined,
                    checkboxLabelJsx: renderTermsCheckboxLabel(t, locale),

                    disabled: isSubmitting,
                  }}
                  control={form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
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
                ) : signupType === SignupType.MEETING ? (
                  t("app.user.signup.auth.signup.createAccountAndBook")
                ) : (
                  t("app.user.signup.auth.signup.createAccountButton")
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t("app.user.signup.auth.signup.alreadyHaveAccount")}{" "}
                <Link
                  href={`/${locale}/user/login`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {t("app.user.signup.auth.signup.signIn")}
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

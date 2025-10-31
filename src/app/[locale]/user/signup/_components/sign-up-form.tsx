"use client";

import { motion } from "framer-motion";
import { Calendar, CreditCard, Loader2 } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "next-vibe-ui/ui/form/form";
import { Link } from "next-vibe-ui/ui/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe-ui/ui/tabs";
import { H3 } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import type React from "react";

import signupDefinitions from "@/app/api/[locale]/v1/core/user/public/signup/definition";
import { SignupType } from "@/app/api/[locale]/v1/core/user/public/signup/enum";
import { useRegister } from "@/app/api/[locale]/v1/core/user/public/signup/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { PasswordStrengthIndicator } from "../../_components/password-strength-indicator";

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
  const { form, submitForm, isSubmitting, alert, logger } = useRegister();
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
                          logger.error(
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
                          <Span>
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.direct",
                            )}
                          </Span>
                        </TabsTrigger>
                        <TabsTrigger
                          value={SignupType.MEETING}
                          className="flex items-center justify-start gap-2 text-md min-h-[3rem]"
                        >
                          <Calendar className="h-7 w-7 flex-shrink-0" />
                          <Span>
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.schedule",
                            )}
                          </Span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pricing" className="mt-0 mb-4">
                        <Div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <H3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.direct",
                            )}
                          </H3>
                          <Div className="text-sm text-blue-700 dark:text-blue-400">
                            {t("app.user.signup.auth.signup.directDescription")}
                          </Div>
                        </Div>
                      </TabsContent>

                      <TabsContent value="meeting" className="mt-0 mb-4">
                        <Div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <H3 className="font-medium text-green-800 dark:text-green-300 mb-1">
                            {t(
                              "app.user.signup.auth.signup.meetingPreferenceOptions.schedule",
                            )}
                          </H3>
                          <Div className="text-sm text-green-700 dark:text-green-400">
                            {t(
                              "app.user.signup.auth.signup.scheduleDescription",
                            )}
                          </Div>
                        </Div>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                ) : signupType === SignupType.MEETING ? (
                  t("app.user.signup.auth.signup.createAccountAndBook")
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
    </motion.div>
  );
}

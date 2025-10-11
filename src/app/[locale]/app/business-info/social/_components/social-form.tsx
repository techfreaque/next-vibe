/**
 * Production-Ready Social Form Component
 * Complete form with FormAlert, translations, redirects, and required field highlighting
 */

"use client";

import { Save } from "lucide-react";
import {
  Form,
  FormAlert,
  FormControl,
  FormField,
  FormFieldGroup,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
} from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";
import { useEffect, useMemo, useRef } from "react";

import { useSocialEndpoint } from "@/app/api/[locale]/v1/core/business-data/social/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SocialPlatformSelector } from "../../_components/social-platform-selector";

export function SocialForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useSocialEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  // Track if we've initialized the form to prevent infinite loops
  const hasInitialized = useRef(false);

  // Memoize the platforms data from the server response
  const serverPlatforms = useMemo(() => {
    if (endpoint.read.response?.success) {
      const responseData = endpoint.read.response.data;
      if (
        responseData &&
        "platforms" in responseData &&
        responseData.platforms
      ) {
        return responseData.platforms.map((platform) => ({
          platform: platform.platform,
          username: platform.username || "",
          isActive: platform.isActive ?? true,
          priority: platform.priority || "medium",
        }));
      }
    }
    return [];
  }, [endpoint.read.response]);

  // Initialize platforms field with existing data (only once)
  useEffect(() => {
    if (serverPlatforms.length > 0 && !hasInitialized.current) {
      endpoint.create.form.setValue("platforms", serverPlatforms);
      hasInitialized.current = true;
    }
  }, [serverPlatforms, endpoint.create.form]);

  if (isLoading) {
    return <SocialFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.social.form.title"}
        description={"businessInfo.social.form.description"}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.social.form.title"}
                description={"businessInfo.social.form.description"}
              >
                {/* Social Platforms - Simple FormField */}
                <FormField
                  control={endpoint.create.form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("businessInfo.social.form.fields.platforms.label")}
                      </FormLabel>
                      <FormControl>
                        <SocialPlatformSelector
                          value={(field.value || []).map((platform) => ({
                            platform: platform.platform,
                            username: platform.username || "",
                            isActive: platform.isActive ?? true,
                            priority: platform.priority || "medium",
                          }))}
                          onChange={field.onChange}
                          t={t}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Strategy */}
                <EndpointFormField
                  name="contentStrategy"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.social.form.fields.contentStrategy.label",
                    placeholder:
                      "businessInfo.social.form.fields.contentStrategy.placeholder",
                    rows: 4,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Posting Frequency and Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="postingFrequency"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.social.form.fields.postingFrequency.label",
                      placeholder:
                        "businessInfo.social.form.fields.postingFrequency.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="goals"
                    config={{
                      type: "textarea",
                      label: "businessInfo.social.form.fields.goals.label",
                      placeholder:
                        "businessInfo.social.form.fields.goals.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>
              </FormFieldGroup>

              {/* Form Alert for errors and success */}

              <FormAlert alert={endpoint.alert} />

              {/* Submit Button */}
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t("businessInfo.social.form.submit.saving")}
                  </>
                ) : endpoint.create.response?.success ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.social.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.social.form.submit.save")}
                  </>
                )}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </FormSection>
    </div>
  );
}

/**
 * Loading skeleton for the social form
 */
function SocialFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Production-Ready Profile Form Component
 * Complete form with FormAlert, translations, redirects, and required field highlighting
 */

"use client";

import { Save } from "lucide-react";
import { Form, FormAlert, FormFieldGroup, FormSection } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import { useProfileEndpoint } from "@/app/api/[locale]/v1/core/business-data/profile/hooks";
import { profileSchema } from "@/app/api/[locale]/v1/core/business-data/profile/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { JOB_TITLES } from "../../_constants/form-options";

export function ProfileFormProduction({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useProfileEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.profile.form.title"}
        description={"businessInfo.profile.form.description"}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.profile.form.personalInfo.title"}
                description={
                  "businessInfo.profile.form.personalInfo.description"
                }
              >
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="firstName"
                    config={{
                      type: "text",
                      label: "businessInfo.profile.form.fields.firstName.label",
                      placeholder:
                        "businessInfo.profile.form.fields.firstName.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={profileSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                  <EndpointFormField
                    name="lastName"
                    config={{
                      type: "text",
                      label: "businessInfo.profile.form.fields.lastName.label",
                      placeholder:
                        "businessInfo.profile.form.fields.lastName.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={profileSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </div>

                {/* Job Title - Enhanced Autocomplete */}
                <EndpointFormField
                  name="jobTitle"
                  config={{
                    type: "autocomplete",
                    label: "businessInfo.profile.form.fields.jobTitle.label",
                    placeholder:
                      "businessInfo.profile.form.fields.jobTitle.placeholder",
                    options: JOB_TITLES.map((title) => ({
                      value: title.value,
                      label: title.label,
                      category: title.category,
                    })),
                    allowCustom: true,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Phone Number - Enhanced International Input */}
                <EndpointFormField
                  name="phone"
                  config={{
                    type: "phone",
                    label: "businessInfo.profile.form.fields.phone.label",
                    placeholder:
                      "businessInfo.profile.form.fields.phone.placeholder",
                    defaultCountry: "DE",
                    preferredCountries: ["DE", "PL", "GLOBAL"],
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"businessInfo.profile.form.additionalInfo.title"}
                description={
                  "businessInfo.profile.form.additionalInfo.description"
                }
              >
                {/* Bio */}
                <EndpointFormField
                  name="bio"
                  config={{
                    type: "textarea",
                    label: "businessInfo.profile.form.fields.bio.label",
                    placeholder:
                      "businessInfo.profile.form.fields.bio.placeholder",
                    rows: 4,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              {/* Form Alert for errors and success */}
              <FormAlert alert={endpoint.alert} />

              {/* Submit Button */}
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t("businessInfo.profile.form.submit.saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.profile.form.submit.save")}
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
 * Loading skeleton for the profile form
 */
function ProfileFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

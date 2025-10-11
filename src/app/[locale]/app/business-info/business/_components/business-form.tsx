/**
 * Business Form Client Component
 * Production-ready form with required field highlighting and error handling
 */

"use client";

import { Save } from "lucide-react";
import { Form, FormAlert, FormSection } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import { BusinessSize } from "@/app/api/[locale]/v1/core/business-data/business-info/enum";
import { useBusinessInfoEndpoint } from "@/app/api/[locale]/v1/core/business-data/business-info/hooks";
import { updateBusinessInfoSchema } from "@/app/api/[locale]/v1/core/business-data/business-info/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { BUSINESS_TYPES, INDUSTRIES } from "../../_constants/form-options";

// Function to get business size translation key
function getBusinessSizeTranslationKey(size: string): TranslationKey {
  switch (size) {
    case "startup":
      return "businessInfo.business.form.fields.businessSize.options.startup";
    case "small":
      return "businessInfo.business.form.fields.businessSize.options.small";
    case "medium":
      return "businessInfo.business.form.fields.businessSize.options.medium";
    case "large":
      return "businessInfo.business.form.fields.businessSize.options.large";
    case "enterprise":
      return "businessInfo.business.form.fields.businessSize.options.enterprise";
    default:
      return "businessInfo.business.form.fields.businessSize.options.small";
  }
}

export function BusinessForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useBusinessInfoEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.isSuccess;

  if (isLoading) {
    return <BusinessFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.business.form.title" as const}
        description={"businessInfo.business.form.description" as const}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={
                  "businessInfo.business.form.sections.basic.title" as const
                }
                description={
                  "businessInfo.business.form.sections.basic.description" as const
                }
              >
                {/* Business Type - Enhanced Autocomplete */}
                <EndpointFormField
                  name="businessType"
                  config={{
                    type: "autocomplete",
                    label:
                      "businessInfo.business.form.fields.businessType.label",
                    placeholder:
                      "businessInfo.business.form.fields.businessType.placeholder",
                    options: BUSINESS_TYPES.map((type) => ({
                      value: type.value,
                      label: type.label,
                      category: type.category,
                    })),
                    allowCustom: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateBusinessInfoSchema}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />

                {/* Business Name and Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="businessName"
                    config={{
                      type: "text",
                      label:
                        "businessInfo.business.form.fields.businessName.label",
                      placeholder:
                        "businessInfo.business.form.fields.businessName.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={updateBusinessInfoSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                  <EndpointFormField
                    name="industry"
                    config={{
                      type: "autocomplete",
                      label: "businessInfo.business.form.fields.industry.label",
                      placeholder:
                        "businessInfo.business.form.fields.industry.placeholder",
                      options: INDUSTRIES.map((industry) => ({
                        value: industry.value,
                        label: industry.label,
                        category: industry.category,
                      })),
                      allowCustom: true,
                    }}
                    control={endpoint.create.form.control}
                    schema={updateBusinessInfoSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Business Size */}
                <EndpointFormField
                  name="businessSize"
                  config={{
                    type: "select",
                    label:
                      "businessInfo.business.form.fields.businessSize.label",
                    placeholder:
                      "businessInfo.business.form.fields.businessSize.placeholder",
                    options: Object.values(BusinessSize).map((size) => ({
                      value: size,
                      label: getBusinessSizeTranslationKey(size),
                    })),
                  }}
                  control={endpoint.create.form.control}
                  schema={updateBusinessInfoSchema}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={
                  "businessInfo.business.form.sections.contact.title" as const
                }
                description={
                  "businessInfo.business.form.sections.contact.description" as const
                }
              >
                {/* Business Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="businessEmail"
                    config={{
                      type: "email",
                      label:
                        "businessInfo.business.form.fields.businessEmail.label",
                      placeholder:
                        "businessInfo.business.form.fields.businessEmail.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="businessPhone"
                    config={{
                      type: "phone",
                      label:
                        "businessInfo.business.form.fields.businessPhone.label",
                      placeholder:
                        "businessInfo.business.form.fields.businessPhone.placeholder",
                      defaultCountry: "DE",
                      preferredCountries: ["DE", "PL", "GLOBAL"],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Website */}
                <EndpointFormField
                  name="website"
                  config={{
                    type: "url",
                    label: "businessInfo.business.form.fields.website.label",
                    placeholder:
                      "businessInfo.business.form.fields.website.placeholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={
                  "businessInfo.business.form.sections.details.title" as const
                }
                description={
                  "businessInfo.business.form.sections.details.description" as const
                }
              >
                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="country"
                    config={{
                      type: "text",
                      label: "businessInfo.business.form.fields.country.label",
                      placeholder:
                        "businessInfo.business.form.fields.country.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="city"
                    config={{
                      type: "text",
                      label: "businessInfo.business.form.fields.city.label",
                      placeholder:
                        "businessInfo.business.form.fields.city.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Founded Year */}
                <EndpointFormField
                  name="foundedYear"
                  config={{
                    type: "text",
                    label:
                      "businessInfo.business.form.fields.foundedYear.label",
                    placeholder:
                      "businessInfo.business.form.fields.foundedYear.placeholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Description */}
                <EndpointFormField
                  name="description"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.business.form.fields.description.label",
                    placeholder:
                      "businessInfo.business.form.fields.description.placeholder",
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
                    {t("businessInfo.business.form.submit.saving")}
                  </>
                ) : isSuccess ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.business.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.business.form.submit.save")}
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

function BusinessFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

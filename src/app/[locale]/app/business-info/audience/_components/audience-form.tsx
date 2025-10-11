/**
 * Production-Ready Audience Form Component
 * Complete form with FormAlert, translations, redirects, and required field highlighting
 */

"use client";

import { Save } from "lucide-react";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup, FormSection } from "next-vibe-ui/ui/form/form-section";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import {
  Gender,
  IncomeLevel,
} from "@/app/api/[locale]/v1/core/business-data/audience/enum";
import { useAudienceEndpoint } from "@/app/api/[locale]/v1/core/business-data/audience/hooks";
import { updateAudienceSchema } from "@/app/api/[locale]/v1/core/business-data/audience/schema";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { AGE_RANGES, INTERESTS } from "../../_constants/form-options";

export function AudienceForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  const endpoint = useAudienceEndpoint(logger, {
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  if (isLoading) {
    return <AudienceFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.nav.audience.title" as const}
        description={"businessInfo.nav.audience.description" as const}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.nav.audience.title" as const}
                description={"businessInfo.nav.audience.description" as const}
              >
                {/* Target Audience */}
                <EndpointFormField
                  name="targetAudience"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.audience.form.fields.targetAudience.label",
                    placeholder:
                      "businessInfo.audience.form.fields.targetAudience.placeholder",
                    rows: 3,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateAudienceSchema}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={
                  "businessInfo.audience.form.sections.demographics.title" as const
                }
                description={
                  "businessInfo.audience.form.sections.demographics.description" as const
                }
              >
                {/* Age Range and Gender - Enhanced Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="ageRange"
                    config={{
                      type: "multiselect",
                      label: "businessInfo.audience.form.fields.ageRange.label",
                      placeholder:
                        "businessInfo.audience.form.fields.ageRange.placeholder",
                      options: AGE_RANGES.map((range) => ({
                        value: range.value,
                        label: range.label,
                        disabled: false,
                      })),
                      maxSelections: 3,
                      searchable: true,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="gender"
                    config={{
                      type: "select",
                      label: "businessInfo.audience.form.fields.gender.label",
                      placeholder:
                        "businessInfo.audience.form.fields.gender.placeholder",
                      options: [
                        {
                          value: Gender.ALL,
                          label:
                            "businessInfo.audience.form.fields.gender.options.all",
                        },
                        {
                          value: Gender.MALE,
                          label:
                            "businessInfo.audience.form.fields.gender.options.male",
                        },
                        {
                          value: Gender.FEMALE,
                          label:
                            "businessInfo.audience.form.fields.gender.options.female",
                        },
                        {
                          value: Gender.NON_BINARY,
                          label:
                            "businessInfo.audience.form.fields.gender.options.non-binary",
                        },
                        {
                          value: Gender.OTHER,
                          label:
                            "businessInfo.audience.form.fields.gender.options.other",
                        },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Location and Income - Enhanced Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="location"
                    config={{
                      type: "tags",
                      label: "businessInfo.audience.form.fields.location.label",
                      placeholder:
                        "businessInfo.audience.form.fields.location.placeholder",
                      maxTags: 5,
                      allowCustom: true,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="income"
                    config={{
                      type: "select",
                      label: "businessInfo.audience.form.fields.income.label",
                      placeholder:
                        "businessInfo.audience.form.fields.income.placeholder",
                      options: [
                        {
                          value: IncomeLevel.LOW,
                          label: "businessInfo.incomeLevels.low",
                        },
                        {
                          value: IncomeLevel.LOWER_MIDDLE,
                          label: "businessInfo.incomeLevels.lowerMiddle",
                        },
                        {
                          value: IncomeLevel.MIDDLE,
                          label: "businessInfo.incomeLevels.middle",
                        },
                        {
                          value: IncomeLevel.UPPER_MIDDLE,
                          label: "businessInfo.incomeLevels.upperMiddle",
                        },
                        {
                          value: IncomeLevel.HIGH,
                          label: "businessInfo.incomeLevels.high",
                        },
                        {
                          value: IncomeLevel.LUXURY,
                          label: "businessInfo.incomeLevels.luxury",
                        },
                        {
                          value: IncomeLevel.ALL_LEVELS,
                          label: "businessInfo.incomeLevels.all",
                        },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>
              </FormFieldGroup>

              <FormFieldGroup
                title={
                  "businessInfo.audience.form.sections.interests.title" as const
                }
                description={
                  "businessInfo.audience.form.sections.interests.description" as const
                }
              >
                {/* Interests and Values - Enhanced Tag Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="interests"
                    config={{
                      type: "tags",
                      label:
                        "businessInfo.audience.form.fields.interests.label",
                      placeholder:
                        "businessInfo.audience.form.fields.interests.placeholder",
                      suggestions: INTERESTS.map((interest) => ({
                        value: interest.value,
                        label: interest.label,
                        category: interest.category,
                      })),
                      maxTags: 10,
                      allowCustom: true,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="values"
                    config={{
                      type: "tags",
                      label: "businessInfo.audience.form.fields.values.label",
                      placeholder:
                        "businessInfo.audience.form.fields.values.placeholder",
                      maxTags: 8,
                      allowCustom: true,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Pain Points and Motivations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="painPoints"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.audience.form.fields.painPoints.label",
                      placeholder:
                        "businessInfo.audience.form.fields.painPoints.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="motivations"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.audience.form.fields.motivations.label",
                      placeholder:
                        "businessInfo.audience.form.fields.motivations.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Lifestyle */}
                <EndpointFormField
                  name="lifestyle"
                  config={{
                    type: "textarea",
                    label: "businessInfo.audience.form.fields.lifestyle.label",
                    placeholder:
                      "businessInfo.audience.form.fields.lifestyle.placeholder",
                    rows: 3,
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
                  "businessInfo.audience.form.sections.behavior.title" as const
                }
                description={
                  "businessInfo.audience.form.sections.behavior.description" as const
                }
              >
                {/* Online and Purchase Behavior */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="onlineBehavior"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.audience.form.fields.onlineBehavior.label",
                      placeholder:
                        "businessInfo.audience.form.fields.onlineBehavior.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="purchaseBehavior"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.audience.form.fields.purchaseBehavior.label",
                      placeholder:
                        "businessInfo.audience.form.fields.purchaseBehavior.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Preferred Channels */}
                <EndpointFormField
                  name="preferredChannels"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.audience.form.fields.preferredChannels.label",
                    placeholder:
                      "businessInfo.audience.form.fields.preferredChannels.placeholder",
                    rows: 3,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Additional Notes */}
                <EndpointFormField
                  name="additionalNotes"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.audience.form.fields.additionalNotes.label",
                    placeholder:
                      "businessInfo.audience.form.fields.additionalNotes.placeholder",
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
                    {t("common.saving")}
                  </>
                ) : endpoint.create.response?.success ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("common.saved")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.audience.form.submit.save")}
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
 * Loading skeleton for the audience form
 */
function AudienceFormSkeleton(): JSX.Element {
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
            {Array.from({ length: 2 }).map((_, i) => (
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

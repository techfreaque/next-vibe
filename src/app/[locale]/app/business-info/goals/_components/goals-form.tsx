/**
 * Production-Ready Goals Form Component
 * Complete form with FormAlert, translations, redirects, and required field highlighting
 */

"use client";

import { Save } from "lucide-react";
import { Form, FormAlert, FormFieldGroup, FormSection } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";
import { Controller } from "react-hook-form";

import { useGoalsEndpoint } from "@/app/api/[locale]/v1/core/business-data/goals/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BusinessGoalsSelector } from "./business-goals-selector";

export function GoalsForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  const endpoint = useGoalsEndpoint({
    enabled: true,
    logger,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  if (isLoading) {
    return <GoalsFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.goals.form.title" as const}
        description={"businessInfo.goals.form.description" as const}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.goals.form.title" as const}
                description={"businessInfo.goals.form.description" as const}
              >
                {/* Primary Goals - Awesome Multi-Select */}
                <Controller
                  name="primaryGoals"
                  control={endpoint.create.form.control}
                  render={({ field, fieldState }) => (
                    <BusinessGoalsSelector
                      value={field.value || []}
                      onChange={field.onChange}
                      locale={locale}
                      required={true}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                {/* Budget Range */}
                <EndpointFormField
                  name="budgetRange"
                  config={{
                    type: "textarea",
                    label: "businessInfo.goals.form.fields.budgetRange.label",
                    placeholder:
                      "businessInfo.goals.form.fields.budgetRange.placeholder",
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
                title={"businessInfo.goals.form.title" as const}
                description={"businessInfo.goals.form.description" as const}
              >
                {/* Short-term and Long-term Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="shortTermGoals"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.goals.form.fields.shortTermGoals.label",
                      placeholder:
                        "businessInfo.goals.form.fields.shortTermGoals.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="longTermGoals"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.goals.form.fields.longTermGoals.label",
                      placeholder:
                        "businessInfo.goals.form.fields.longTermGoals.placeholder",
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

              <FormFieldGroup
                title={"businessInfo.goals.form.title" as const}
                description={"businessInfo.goals.form.description" as const}
              >
                {/* Revenue and Growth Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="revenueGoals"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.goals.form.fields.revenueGoals.label",
                      placeholder:
                        "businessInfo.goals.form.fields.revenueGoals.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="growthGoals"
                    config={{
                      type: "textarea",
                      label: "businessInfo.goals.form.fields.growthGoals.label",
                      placeholder:
                        "businessInfo.goals.form.fields.growthGoals.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Marketing Goals */}
                <EndpointFormField
                  name="marketingGoals"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.goals.form.fields.marketingGoals.label",
                    placeholder:
                      "businessInfo.goals.form.fields.marketingGoals.placeholder",
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
                title={"businessInfo.goals.form.title" as const}
                description={"businessInfo.goals.form.description" as const}
              >
                {/* Success Metrics and Priorities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="successMetrics"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.goals.form.fields.successMetrics.label",
                      placeholder:
                        "businessInfo.goals.form.fields.successMetrics.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="priorities"
                    config={{
                      type: "textarea",
                      label: "businessInfo.goals.form.fields.priorities.label",
                      placeholder:
                        "businessInfo.goals.form.fields.priorities.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Timeline */}
                <EndpointFormField
                  name="timeline"
                  config={{
                    type: "textarea",
                    label: "businessInfo.goals.form.fields.timeline.label",
                    placeholder:
                      "businessInfo.goals.form.fields.timeline.placeholder",
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
                title={"businessInfo.goals.form.title" as const}
                description={"businessInfo.goals.form.description" as const}
              >
                {/* Additional Notes */}
                <EndpointFormField
                  name="additionalNotes"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.goals.form.fields.additionalNotes.label",
                    placeholder:
                      "businessInfo.goals.form.fields.additionalNotes.placeholder",
                    rows: 3,
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
                    {t("businessInfo.goals.form.submit.saving")}
                  </>
                ) : endpoint.create.response?.success ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.goals.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.goals.form.submit.save")}
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

function GoalsFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Production-Ready Competitors Form Component
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

import { useCompetitorsEndpoint } from "@/app/api/[locale]/v1/core/business-data/competitors/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function CompetitorsFormProduction({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useCompetitorsEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.isSuccess;

  if (isLoading) {
    return <CompetitorsFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.competitors.form.title"}
        description={"businessInfo.competitors.form.description"}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.competitors.form.identification.title"}
                description={
                  "businessInfo.competitors.form.identification.description"
                }
              >
                {/* Main Competitors */}
                <EndpointFormField
                  name="mainCompetitors"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.competitors.form.fields.mainCompetitors.label",
                    placeholder:
                      "businessInfo.competitors.form.fields.mainCompetitors.placeholder",
                    rows: 4,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* All Competitors */}
                <EndpointFormField
                  name="competitors"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.competitors.form.fields.competitors.label",
                    placeholder:
                      "businessInfo.competitors.form.fields.competitors.placeholder",
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
                title={"businessInfo.competitors.form.analysis.title"}
                description={
                  "businessInfo.competitors.form.analysis.description"
                }
              >
                {/* Competitive Advantages and Disadvantages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="competitiveAdvantages"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.competitiveAdvantages.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.competitiveAdvantages.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="competitiveDisadvantages"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.competitiveDisadvantages.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.competitiveDisadvantages.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Market Position and Differentiators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="marketPosition"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.marketPosition.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.marketPosition.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="differentiators"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.differentiators.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.differentiators.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Competitor Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="competitorStrengths"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.competitorStrengths.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.competitorStrengths.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="competitorWeaknesses"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.competitors.form.fields.competitorWeaknesses.label",
                      placeholder:
                        "businessInfo.competitors.form.fields.competitorWeaknesses.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Market Gaps */}
                <EndpointFormField
                  name="marketGaps"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.competitors.form.fields.marketGaps.label",
                    placeholder:
                      "businessInfo.competitors.form.fields.marketGaps.placeholder",
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
                title={"businessInfo.competitors.form.additional.title"}
                description={
                  "businessInfo.competitors.form.additional.description"
                }
              >
                {/* Additional Notes */}
                <EndpointFormField
                  name="additionalNotes"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.competitors.form.fields.additionalNotes.label",
                    placeholder:
                      "businessInfo.competitors.form.fields.additionalNotes.placeholder",
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
                    {t("businessInfo.competitors.form.submit.saving")}
                  </>
                ) : isSuccess ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.competitors.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.competitors.form.submit.save")}
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
 * Loading skeleton for the competitors form
 */
function CompetitorsFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
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

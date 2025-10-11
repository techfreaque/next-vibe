/**
 * Production-Ready Challenges Form Component
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

import { useChallengesEndpoint } from "@/app/api/[locale]/v1/core/business-data/challenges/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function ChallengesForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useChallengesEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.isSuccess;

  if (isLoading) {
    return <ChallengesFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.challenges.form.title"}
        description={"businessInfo.challenges.form.description"}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.challenges.form.current.title"}
                description={"businessInfo.challenges.form.current.description"}
              >
                {/* Current Challenges */}
                <EndpointFormField
                  name="currentChallenges"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.currentChallenges.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.currentChallenges.placeholder",
                    rows: 4,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Biggest Challenge */}
                <EndpointFormField
                  name="biggestChallenge"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.biggestChallenge.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.biggestChallenge.placeholder",
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
                title={"businessInfo.challenges.form.categories.title"}
                description={
                  "businessInfo.challenges.form.categories.description"
                }
              >
                {/* Marketing and Operational Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="marketingChallenges"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.marketingChallenges.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.marketingChallenges.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="operationalChallenges"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.operationalChallenges.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.operationalChallenges.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Financial and Technical Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="financialChallenges"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.financialChallenges.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.financialChallenges.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="technicalChallenges"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.technicalChallenges.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.technicalChallenges.placeholder",
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
                title={"businessInfo.challenges.form.impact.title"}
                description={"businessInfo.challenges.form.impact.description"}
              >
                {/* Challenge Impact */}
                <EndpointFormField
                  name="challengeImpact"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.challengeImpact.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.challengeImpact.placeholder",
                    rows: 3,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Previous Solutions */}
                <EndpointFormField
                  name="previousSolutions"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.previousSolutions.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.previousSolutions.placeholder",
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
                title={"businessInfo.challenges.form.constraints.title"}
                description={
                  "businessInfo.challenges.form.constraints.description"
                }
              >
                {/* Resource and Budget Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="resourceConstraints"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.resourceConstraints.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.resourceConstraints.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="budgetConstraints"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.budgetConstraints.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.budgetConstraints.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Time Constraints */}
                <EndpointFormField
                  name="timeConstraints"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.timeConstraints.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.timeConstraints.placeholder",
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
                title={"businessInfo.challenges.form.support.title"}
                description={"businessInfo.challenges.form.support.description"}
              >
                {/* Support Needed and Priority Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="supportNeeded"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.supportNeeded.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.supportNeeded.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="priorityAreas"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.challenges.form.fields.priorityAreas.label",
                      placeholder:
                        "businessInfo.challenges.form.fields.priorityAreas.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Additional Notes */}
                <EndpointFormField
                  name="additionalNotes"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.challenges.form.fields.additionalNotes.label",
                    placeholder:
                      "businessInfo.challenges.form.fields.additionalNotes.placeholder",
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
                    {t("businessInfo.challenges.form.submit.saving")}
                  </>
                ) : isSuccess ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.challenges.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.challenges.form.submit.save")}
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
 * Loading skeleton for the challenges form
 */
function ChallengesFormSkeleton(): JSX.Element {
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

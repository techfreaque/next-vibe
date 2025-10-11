/**
 * Production-Ready Brand Form Component
 * Complete form with FormAlert, translations, redirects, and required field highlighting
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

import { useBrandEndpoint } from "@/app/api/[locale]/v1/core/business-data/brand/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function BrandForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useBrandEndpoint({
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.isSuccess;

  if (isLoading) {
    return <BrandFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FormSection
        title={"businessInfo.brand.form.title" as const}
        description={"businessInfo.brand.form.description" as const}
      >
        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"businessInfo.brand.form.identity.title" as const}
                description={
                  "businessInfo.brand.form.identity.description" as const
                }
              >
                {/* Brand Description */}
                <EndpointFormField
                  name="brandDescription"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.brand.form.fields.brandDescription.label",
                    placeholder:
                      "businessInfo.brand.form.fields.brandDescription.placeholder",
                    rows: 4,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Brand Mission and Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="brandMission"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.brand.form.fields.brandMission.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandMission.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="brandVision"
                    config={{
                      type: "textarea",
                      label: "businessInfo.brand.form.fields.brandVision.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandVision.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Brand Values */}
                <EndpointFormField
                  name="brandValues"
                  config={{
                    type: "textarea",
                    label: "businessInfo.brand.form.fields.brandValues.label",
                    placeholder:
                      "businessInfo.brand.form.fields.brandValues.placeholder",
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
                title={"businessInfo.brand.form.personality.title" as const}
                description={
                  "businessInfo.brand.form.personality.description" as const
                }
              >
                {/* Brand Personality and Voice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="brandPersonality"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.brand.form.fields.brandPersonality.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandPersonality.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="brandVoice"
                    config={{
                      type: "textarea",
                      label: "businessInfo.brand.form.fields.brandVoice.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandVoice.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Brand Tone */}
                <EndpointFormField
                  name="brandTone"
                  config={{
                    type: "textarea",
                    label: "businessInfo.brand.form.fields.brandTone.label",
                    placeholder:
                      "businessInfo.brand.form.fields.brandTone.placeholder",
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
                title={"businessInfo.brand.form.visual.title" as const}
                description={
                  "businessInfo.brand.form.visual.description" as const
                }
              >
                {/* Brand Colors and Fonts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="brandColors"
                    config={{
                      type: "textarea",
                      label: "businessInfo.brand.form.fields.brandColors.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandColors.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="brandFonts"
                    config={{
                      type: "textarea",
                      label: "businessInfo.brand.form.fields.brandFonts.label",
                      placeholder:
                        "businessInfo.brand.form.fields.brandFonts.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Logo Description and Visual Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="logoDescription"
                    config={{
                      type: "textarea",
                      label:
                        "businessInfo.brand.form.fields.logoDescription.label",
                      placeholder:
                        "businessInfo.brand.form.fields.logoDescription.placeholder",
                      rows: 3,
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="visualStyle"
                    config={{
                      type: "textarea",
                      label: "businessInfo.brand.form.fields.visualStyle.label",
                      placeholder:
                        "businessInfo.brand.form.fields.visualStyle.placeholder",
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
                title={"businessInfo.brand.form.positioning.title" as const}
                description={
                  "businessInfo.brand.form.positioning.description" as const
                }
              >
                {/* Brand Promise */}
                <EndpointFormField
                  name="brandPromise"
                  config={{
                    type: "textarea",
                    label: "businessInfo.brand.form.fields.brandPromise.label",
                    placeholder:
                      "businessInfo.brand.form.fields.brandPromise.placeholder",
                    rows: 3,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Brand Differentiators */}
                <EndpointFormField
                  name="brandDifferentiators"
                  config={{
                    type: "textarea",
                    label:
                      "businessInfo.brand.form.fields.brandDifferentiators.label",
                    placeholder:
                      "businessInfo.brand.form.fields.brandDifferentiators.placeholder",
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
                title={"businessInfo.brand.form.assets.title" as const}
                description={
                  "businessInfo.brand.form.assets.description" as const
                }
              >
                {/* Brand Guidelines */}
                <EndpointFormField
                  name="brandGuidelines"
                  config={{
                    type: "checkbox",
                    label:
                      "businessInfo.brand.form.fields.brandGuidelines.label",
                    description:
                      "businessInfo.brand.form.fields.brandGuidelines.description",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Asset Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="hasStyleGuide"
                    config={{
                      type: "checkbox",
                      label:
                        "businessInfo.brand.form.fields.hasStyleGuide.label",
                      description:
                        "businessInfo.brand.form.fields.hasStyleGuide.description",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="hasLogoFiles"
                    config={{
                      type: "checkbox",
                      label:
                        "businessInfo.brand.form.fields.hasLogoFiles.label",
                      description:
                        "businessInfo.brand.form.fields.hasLogoFiles.description",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                  <EndpointFormField
                    name="hasBrandAssets"
                    config={{
                      type: "checkbox",
                      label:
                        "businessInfo.brand.form.fields.hasBrandAssets.label",
                      description:
                        "businessInfo.brand.form.fields.hasBrandAssets.description",
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
                      "businessInfo.brand.form.fields.additionalNotes.label",
                    placeholder:
                      "businessInfo.brand.form.fields.additionalNotes.placeholder",
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
                    {t("businessInfo.brand.form.submit.saving")}
                  </>
                ) : isSuccess ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.brand.form.success.title")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("businessInfo.brand.form.submit.save")}
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
 * Loading skeleton for the brand form
 */
function BrandFormSkeleton(): JSX.Element {
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

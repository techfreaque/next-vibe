/**
 * Template Import Client-Side Examples - Complete Implementation
 *
 * This file demonstrates comprehensive client-side patterns following the business-info model.
 * All business logic has been moved to hooks.ts, keeping components clean and focused on UI.
 *
 * Architecture:
 * - Components only handle UI rendering and user interactions
 * - All business logic is in hooks.ts
 * - Type-safe implementations with no 'any' types
 * - Proper translation key usage throughout
 * - Following the business-info pattern exactly
 *
 * Components:
 * - TemplateImportForm: Main form component using useTemplateImportForm hook
 * - TemplateImportFormSkeleton: Loading state component
 * - ValidationWarnings: Component for displaying validation warnings
 *
 * Following the business-info pattern for optimal performance and maintainability.
 */

"use client";

import { Upload } from "lucide-react";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { templateImportRequestSchema } from "./definition";
import { ImportFormat, ImportMode } from "./enum";
import { useTemplateImport } from "./hooks";

// =============================================================================
// MAIN FORM COMPONENT
// =============================================================================

/**
 * Template Import Form Component
 *
 * Main form implementation following the business-info pattern.
 * Uses useTemplateImportForm hook for all business logic.
 */
export function TemplateImportForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  // Use the single hook that provides all utilities and state
  const importHook = useTemplateImport({ locale });

  if (importHook.isSubmitting) {
    return <TemplateImportFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("templateApiImport.templateApi.import.form.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={importHook.form}
            onSubmit={importHook.handleSubmit}
            className="space-y-6"
          >
            {/* Import Format */}
            <EndpointFormField
              name="format"
              config={{
                type: "select" as const,
                label:
                  "templateApiImport.templateApi.import.form.fields.format.label",
                placeholder:
                  "templateApiImport.templateApi.import.form.fields.format.placeholder",
                description:
                  "templateApiImport.templateApi.import.form.fields.format.description",
                options: [
                  {
                    value: ImportFormat.CSV,
                    label:
                      "templateApiImport.templateApi.import.form.fields.format.options.csv",
                  },
                  {
                    value: ImportFormat.JSON,
                    label:
                      "templateApiImport.templateApi.import.form.fields.format.options.json",
                  },
                  {
                    value: ImportFormat.XML,
                    label:
                      "templateApiImport.templateApi.import.form.fields.format.options.xml",
                  },
                ],
              }}
              control={importHook.form?.control}
              schema={templateImportRequestSchema}
              theme={{
                style: "asterisk",
                showAllRequired: true,
                requiredColor: "red",
              }}
            />

            {/* Import Mode */}
            <EndpointFormField
              name="mode"
              config={{
                type: "select" as const,
                label:
                  "templateApiImport.templateApi.import.form.fields.mode.label",
                placeholder:
                  "templateApiImport.templateApi.import.form.fields.mode.placeholder",
                description:
                  "templateApiImport.templateApi.import.form.fields.mode.description",
                options: [
                  {
                    value: ImportMode.CREATE_ONLY,
                    label:
                      "templateApiImport.templateApi.import.form.fields.mode.options.createonly",
                  },
                  {
                    value: ImportMode.UPDATE_ONLY,
                    label:
                      "templateApiImport.templateApi.import.form.fields.mode.options.updateonly",
                  },
                  {
                    value: ImportMode.CREATE_OR_UPDATE,
                    label:
                      "templateApiImport.templateApi.import.form.fields.mode.options.createorupdate",
                  },
                ],
              }}
              control={importHook.form?.control}
              schema={templateImportRequestSchema}
              theme={{
                style: "asterisk",
                showAllRequired: true,
                requiredColor: "red",
              }}
            />

            {/* Import Data */}
            <EndpointFormField
              name="data"
              config={{
                type: "textarea" as const,
                label:
                  "templateApiImport.templateApi.import.form.fields.data.label",
                placeholder:
                  "templateApiImport.templateApi.import.form.fields.data.placeholder",
                description:
                  "templateApiImport.templateApi.import.form.fields.data.description",

                rows: 8,
              }}
              control={importHook.form?.control}
              schema={templateImportRequestSchema}
              theme={{
                style: "asterisk",
                showAllRequired: true,
                requiredColor: "red",
              }}
            />

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EndpointFormField
                name="validateOnly"
                config={{
                  type: "checkbox" as const,
                  label:
                    "templateApiImport.templateApi.import.form.fields.validateOnly.label",
                  description:
                    "templateApiImport.templateApi.import.form.fields.validateOnly.description",
                }}
                control={importHook.form?.control}
                schema={templateImportRequestSchema}
              />

              <EndpointFormField
                name="skipErrors"
                config={{
                  type: "checkbox" as const,
                  label:
                    "templateApiImport.templateApi.import.form.fields.skipErrors.label",
                  description:
                    "templateApiImport.templateApi.import.form.fields.skipErrors.description",
                }}
                control={importHook.form?.control}
                schema={templateImportRequestSchema}
              />
            </div>

            {/* Form Alert for errors and success */}
            <FormAlert alert={importHook.alert} />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!importHook.canSubmit}
              className="w-full"
            >
              {importHook.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t(
                    "templateApiImport.templateApi.import.form.submit.importing",
                  )}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("templateApiImport.templateApi.import.form.submit.import")}
                </>
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// SKELETON COMPONENT
// =============================================================================

function TemplateImportFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

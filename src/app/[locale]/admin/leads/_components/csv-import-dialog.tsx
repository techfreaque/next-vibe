/**
 * CSV Import Dialog Component
 * Allows admins to upload and import leads from CSV files
 */

"use client";

import { CheckCircle, Download, FileText, Upload } from "lucide-react";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { Input } from "next-vibe-ui/ui/input";
import { Progress } from "next-vibe-ui/ui/progress";
import React from "react";

import {
  EmailCampaignStage,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { useLeadsImportEndpoint } from "@/app/api/[locale]/v1/core/leads/import/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { Languages } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ImportResult {
  successfulImports: number;
  totalRows: number;
  failedImports: number;
  duplicateEmails: number;
}

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: (result: ImportResult) => void;
  locale: CountryLanguage;
}

export function CsvImportDialog({
  open,
  onOpenChange,
  onImportComplete,
  locale,
}: CsvImportDialogProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useLeadsImportEndpoint();

  // Handle successful submission
  React.useEffect(() => {
    if (endpoint.create.response?.success && onImportComplete) {
      onImportComplete(endpoint.create.response.data);
      endpoint.setSelectedFile(null);
      onOpenChange(false);
    }
  }, [endpoint.create.response, onImportComplete, endpoint, onOpenChange]);

  const handleClose = (): void => {
    endpoint.setSelectedFile(null);
    endpoint.create.form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("leads.admin.import.title")}
          </DialogTitle>
          <DialogDescription>
            {t("leads.admin.import.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Card>
            <CardContent className="pt-6">
              <Form
                form={endpoint.create.form}
                onSubmit={endpoint.create.submitForm}
                className="space-y-6"
              >
                <FormFieldGroup
                  title={"app.api.errors.not_found"}
                  description={"app.api.errors.not_found"}
                >
                  {/* Template Download */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {t("leads.admin.import.template.title")}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {t("leads.admin.import.template.description")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={endpoint.downloadTemplate}
                      className="border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t("leads.admin.import.template.download")}
                    </Button>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        endpoint.dragOver
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      onDrop={endpoint.handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        endpoint.setDragOver(true);
                      }}
                      onDragLeave={() => endpoint.setDragOver(false)}
                    >
                      {endpoint.selectedFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium">
                              {endpoint.selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(endpoint.selectedFile.size / 1024).toFixed(1)}{" "}
                              KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium mb-2">
                            {t("leads.admin.import.file.dropzone.title")}
                          </p>
                          <p className="text-gray-500 mb-4">
                            {t("leads.admin.import.file.dropzone.description")}
                          </p>
                          <Input
                            type="file"
                            // eslint-disable-next-line i18next/no-literal-string
                            accept=".csv"
                            onChange={endpoint.handleFileInputChange}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </FormFieldGroup>

                {/* File validation - show errors if file is missing */}
                {(!endpoint.selectedFile ||
                  !endpoint.create.form.watch("file")) && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      {t("validationErrors.common.invalid_input")}
                    </p>
                  </div>
                )}

                {/* Hidden form fields for validation */}
                <input
                  type="hidden"
                  {...endpoint.create.form.register("file", { required: true })}
                />
                <input
                  type="hidden"
                  {...endpoint.create.form.register("fileName", {
                    required: true,
                  })}
                />

                <FormFieldGroup
                  title={"leads.admin.import.options.title" as const}
                  description={
                    "leads.admin.import.options.description" as const
                  }
                >
                  {/* Skip Duplicates */}
                  <EndpointFormField
                    name="skipDuplicates"
                    config={{
                      type: "switch",
                      label: "leads.admin.import.options.skipDuplicates",
                      description: "leads.admin.import.options.skipDuplicates",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Update Existing */}
                  <EndpointFormField
                    name="updateExisting"
                    config={{
                      type: "switch",
                      label: "leads.admin.import.options.updateExisting",
                      description: "leads.admin.import.options.updateExisting",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </FormFieldGroup>

                <FormFieldGroup
                  title={"leads.admin.import.batch.title" as const}
                  description={"leads.admin.import.batch.description" as const}
                >
                  {/* Use Chunked Processing */}
                  <EndpointFormField
                    name="useChunkedProcessing"
                    config={{
                      type: "switch",
                      label: "leads.admin.import.batch.useChunkedProcessing",
                      description:
                        "leads.admin.import.batch.useChunkedProcessingDescription",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Batch Size - only show when chunked processing is enabled */}
                  {endpoint.create.form.watch("useChunkedProcessing") && (
                    <EndpointFormField
                      name="batchSize"
                      config={{
                        type: "number",
                        label: "leads.admin.import.batch.batchSize",
                        description:
                          "leads.admin.import.batch.batchSizeDescription",
                        placeholder:
                          "leads.admin.import.batch.batchSizePlaceholder",
                        min: 10,
                        max: 10000,
                      }}
                      control={endpoint.create.form.control}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />
                  )}
                </FormFieldGroup>

                <FormFieldGroup
                  title={"leads.admin.import.defaults.title" as const}
                  description={
                    "leads.admin.import.defaults.description" as const
                  }
                >
                  {/* Default Country */}
                  <EndpointFormField
                    name="defaultCountry"
                    config={{
                      type: "select",
                      label: "leads.admin.import.defaults.country",
                      description:
                        "leads.admin.import.defaults.countryDescription",
                      placeholder:
                        "leads.admin.import.defaults.countryPlaceholder",
                      options: [
                        {
                          value: "GLOBAL",
                          label: "common.countries.global" as const,
                        },
                        { value: "DE", label: "common.countries.de" as const },
                        { value: "PL", label: "common.countries.pl" as const },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Language */}
                  <EndpointFormField
                    name="defaultLanguage"
                    config={{
                      type: "select",
                      label: "leads.admin.import.defaults.language",
                      description:
                        "leads.admin.import.defaults.languageDescription",
                      placeholder:
                        "leads.admin.import.defaults.languagePlaceholder",
                      options: Object.entries(Languages).map(([, value]) => ({
                        value: value,
                        label: `constants.languages.${value}` as const,
                      })),
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Status */}
                  <EndpointFormField
                    name="defaultStatus"
                    config={{
                      type: "select",
                      label: "leads.admin.import.defaults.status",
                      description:
                        "leads.admin.import.defaults.statusDescription",
                      placeholder:
                        "leads.admin.import.defaults.statusPlaceholder",
                      options: [
                        {
                          value: LeadStatus.NEW,
                          label: "leads.admin.status.new" as const,
                        },
                        {
                          value: LeadStatus.PENDING,
                          label: "leads.admin.status.pending" as const,
                        },
                        {
                          value: LeadStatus.CAMPAIGN_RUNNING,
                          label: "leads.admin.status.campaign_running" as const,
                        },
                        {
                          value: LeadStatus.WEBSITE_USER,
                          label: "leads.admin.status.website_user" as const,
                        },
                        {
                          value: LeadStatus.NEWSLETTER_SUBSCRIBER,
                          label:
                            "leads.admin.status.newsletter_subscriber" as const,
                        },
                        {
                          value: LeadStatus.IN_CONTACT,
                          label: "leads.admin.status.in_contact" as const,
                        },
                        {
                          value: LeadStatus.SIGNED_UP,
                          label: "leads.admin.status.signed_up" as const,
                        },
                        {
                          value: LeadStatus.CONSULTATION_BOOKED,
                          label:
                            "leads.admin.status.consultation_booked" as const,
                        },
                        {
                          value: LeadStatus.SUBSCRIPTION_CONFIRMED,
                          label:
                            "leads.admin.status.subscription_confirmed" as const,
                        },
                        {
                          value: LeadStatus.UNSUBSCRIBED,
                          label: "leads.admin.status.unsubscribed" as const,
                        },
                        {
                          value: LeadStatus.BOUNCED,
                          label: "leads.admin.status.bounced" as const,
                        },
                        {
                          value: LeadStatus.INVALID,
                          label: "leads.admin.status.invalid" as const,
                        },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Campaign Stage */}
                  <EndpointFormField
                    name="defaultCampaignStage"
                    config={{
                      type: "select",
                      label: "leads.admin.import.defaults.campaignStage",
                      description:
                        "leads.admin.import.defaults.campaignStageDescription",
                      placeholder:
                        "leads.admin.import.defaults.campaignStagePlaceholder",
                      options: Object.entries(EmailCampaignStage).map(
                        ([, value]) => ({
                          value: value,
                          label: `leads.admin.stage.${value}` as const,
                        }),
                      ),
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Source */}
                  <EndpointFormField
                    name="defaultSource"
                    config={{
                      type: "select",
                      label: "leads.admin.import.defaults.source",
                      description:
                        "leads.admin.import.defaults.sourceDescription",
                      placeholder:
                        "leads.admin.import.defaults.sourcePlaceholder",
                      options: [
                        {
                          value: LeadSource.WEBSITE,
                          label: "leads.admin.source.website" as const,
                        },
                        {
                          value: LeadSource.SOCIAL_MEDIA,
                          label: "leads.admin.source.social_media" as const,
                        },
                        {
                          value: LeadSource.EMAIL_CAMPAIGN,
                          label: "leads.admin.source.email_campaign" as const,
                        },
                        {
                          value: LeadSource.REFERRAL,
                          label: "leads.admin.source.referral" as const,
                        },
                        {
                          value: LeadSource.CSV_IMPORT,
                          label: "leads.admin.source.csv_import" as const,
                        },
                        {
                          value: LeadSource.API,
                          label: "leads.admin.source.api" as const,
                        },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </FormFieldGroup>

                {/* Import Progress */}
                {endpoint.create.isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {t("leads.admin.import.progress.title")}
                      </p>
                      <span className="text-sm text-gray-500">
                        {t("leads.admin.import.progress.processing")}
                      </span>
                    </div>
                    <Progress value={undefined} className="w-full" />
                  </div>
                )}

                {/* Import Results */}
                {endpoint.create.response?.success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t("leads.admin.import.success", {
                        successful:
                          endpoint.create.response.data.successfulImports,
                        total: endpoint.create.response.data.totalRows,
                        failed: endpoint.create.response.data.failedImports,
                        duplicates:
                          endpoint.create.response.data.duplicateEmails,
                      })}
                    </AlertDescription>
                  </Alert>
                )}
              </Form>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-shrink-0">
          {/* Form Alert for errors and success - positioned above submit button */}
          <div className="w-full mb-4">
            <FormAlert alert={endpoint.alert} />
          </div>

          <Button
            variant="outline"
            onClick={handleClose}
            disabled={endpoint.create.isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={async () => {
              // Trigger form validation and submission
              const isValid = await endpoint.create.form.trigger();
              if (isValid) {
                await endpoint.create.submitForm(undefined);
              }
            }}
            disabled={
              !endpoint.selectedFile ||
              !endpoint.create.form.watch("file") ||
              !endpoint.create.form.watch("fileName") ||
              endpoint.create.isSubmitting
            }
            className="bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
          >
            {endpoint.create.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("leads.admin.import.importing")}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {t("leads.admin.import.start")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

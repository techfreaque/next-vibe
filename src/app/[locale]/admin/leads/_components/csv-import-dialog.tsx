/**
 * CSV Import Dialog Component
 * Allows admins to upload and import leads from CSV files
 */

"use client";

import { CheckCircle, Download, FileText, Upload } from "next-vibe-ui/ui/icons";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
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
  EmailCampaignStageOptions,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { useLeadsImportEndpoint } from "@/app/api/[locale]/v1/core/leads/import/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountriesOptions, LanguagesOptions } from "@/i18n/core/config";
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
  const logger = React.useMemo(
    () => createEndpointLogger(true, Date.now(), locale),
    [locale],
  );

  const endpoint = useLeadsImportEndpoint(logger);

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
            {t("app.admin.leads.leads.admin.import.title")}
          </DialogTitle>
          <DialogDescription>
            {t("app.admin.leads.leads.admin.import.description")}
          </DialogDescription>
        </DialogHeader>

        <Div className="flex-1 overflow-y-auto">
          <Card>
            <CardContent className="pt-6">
              <Form
                form={endpoint.create.form}
                onSubmit={endpoint.create.submitForm}
                className="flex flex-col gap-6"
              >
                <FormFieldGroup
                  title={"app.admin.leads.leads.admin.import.title" as const}
                  description={
                    "app.admin.leads.leads.admin.import.description" as const
                  }
                >
                  {/* Template Download */}
                  <Div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Div>
                        <P className="font-medium text-blue-900 dark:text-blue-100">
                          {t(
                            "app.admin.leads.leads.admin.import.template.title",
                          )}
                        </P>
                        <P className="text-sm text-blue-700 dark:text-blue-300">
                          {t(
                            "app.admin.leads.leads.admin.import.template.description",
                          )}
                        </P>
                      </Div>
                    </Div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={endpoint.downloadTemplate}
                      className="border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t(
                        "app.admin.leads.leads.admin.import.template.download",
                      )}
                    </Button>
                  </Div>

                  {/* File Upload */}
                  <Div className="flex flex-col gap-4">
                    <Div
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
                        <Div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <Div>
                            <P className="font-medium">
                              {endpoint.selectedFile.name}
                            </P>
                            <P className="text-sm text-gray-500">
                              {(endpoint.selectedFile.size / 1024).toFixed(1)}{" "}
                              KB
                            </P>
                          </Div>
                        </Div>
                      ) : (
                        <Div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <P className="text-lg font-medium mb-2">
                            {t(
                              "app.admin.leads.leads.admin.import.file.dropzone.title",
                            )}
                          </P>
                          <P className="text-gray-500 mb-4">
                            {t(
                              "app.admin.leads.leads.admin.import.file.dropzone.description",
                            )}
                          </P>
                          <Input
                            type="file"
                            // eslint-disable-next-line i18next/no-literal-string
                            accept=".csv"
                            onChange={endpoint.handleFileInputChange}
                            className="max-w-xs mx-auto"
                          />
                        </Div>
                      )}
                    </Div>
                  </Div>
                </FormFieldGroup>

                {/* File validation - show errors if file is missing */}
                {(!endpoint.selectedFile ||
                  !endpoint.create.form.watch("file")) && (
                  <Div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <P className="text-red-800 dark:text-red-200 text-sm">
                      {t(
                        "app.admin.leads.leads.admin.import.file.validation.required",
                      )}
                    </P>
                  </Div>
                )}

                {/* Hidden form fields for validation */}
                <Input
                  type="hidden"
                  {...endpoint.create.form.register("file", { required: true })}
                />
                <Input
                  type="hidden"
                  {...endpoint.create.form.register("fileName", {
                    required: true,
                  })}
                />

                <FormFieldGroup
                  title={
                    "app.admin.leads.leads.admin.import.options.title" as const
                  }
                  description={
                    "app.admin.leads.leads.admin.import.options.description" as const
                  }
                >
                  {/* Skip Duplicates */}
                  <EndpointFormField
                    name="skipDuplicates"
                    config={{
                      type: "switch",
                      label:
                        "app.admin.leads.leads.admin.import.options.skipDuplicates",
                      description:
                        "app.admin.leads.leads.admin.import.options.skipDuplicates",
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
                      label:
                        "app.admin.leads.leads.admin.import.options.updateExisting",
                      description:
                        "app.admin.leads.leads.admin.import.options.updateExisting",
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
                    "app.admin.leads.leads.admin.import.batch.title" as const
                  }
                  description={
                    "app.admin.leads.leads.admin.import.batch.description" as const
                  }
                >
                  {/* Use Chunked Processing */}
                  <EndpointFormField
                    name="useChunkedProcessing"
                    config={{
                      type: "switch",
                      label:
                        "app.admin.leads.leads.admin.import.batch.useChunkedProcessing",
                      description:
                        "app.admin.leads.leads.admin.import.batch.useChunkedProcessingDescription",
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
                        label:
                          "app.admin.leads.leads.admin.import.batch.batchSize",
                        description:
                          "app.admin.leads.leads.admin.import.batch.batchSizeDescription",
                        placeholder:
                          "app.admin.leads.leads.admin.import.batch.batchSizePlaceholder",
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
                  title={
                    "app.admin.leads.leads.admin.import.defaults.title" as const
                  }
                  description={
                    "app.admin.leads.leads.admin.import.defaults.description" as const
                  }
                >
                  {/* Default Country */}
                  <EndpointFormField
                    name="defaultCountry"
                    config={{
                      type: "select",
                      label:
                        "app.admin.leads.leads.admin.import.defaults.country",
                      description:
                        "app.admin.leads.leads.admin.import.defaults.countryDescription",
                      placeholder:
                        "app.admin.leads.leads.admin.import.defaults.countryPlaceholder",
                      options: CountriesOptions,
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
                      label:
                        "app.admin.leads.leads.admin.import.defaults.language",
                      description:
                        "app.admin.leads.leads.admin.import.defaults.languageDescription",
                      placeholder:
                        "app.admin.leads.leads.admin.import.defaults.languagePlaceholder",
                      options: LanguagesOptions,
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
                      label:
                        "app.admin.leads.leads.admin.import.defaults.status",
                      description:
                        "app.admin.leads.leads.admin.import.defaults.statusDescription",
                      placeholder:
                        "app.admin.leads.leads.admin.import.defaults.statusPlaceholder",
                      options: [
                        {
                          value: LeadStatus.NEW,
                          label:
                            "app.admin.leads.leads.admin.status.new" as const,
                        },
                        {
                          value: LeadStatus.PENDING,
                          label:
                            "app.admin.leads.leads.admin.status.pending" as const,
                        },
                        {
                          value: LeadStatus.CAMPAIGN_RUNNING,
                          label:
                            "app.admin.leads.leads.admin.status.campaign_running" as const,
                        },
                        {
                          value: LeadStatus.WEBSITE_USER,
                          label:
                            "app.admin.leads.leads.admin.status.website_user" as const,
                        },
                        {
                          value: LeadStatus.NEWSLETTER_SUBSCRIBER,
                          label:
                            "app.admin.leads.leads.admin.status.newsletter_subscriber" as const,
                        },
                        {
                          value: LeadStatus.IN_CONTACT,
                          label:
                            "app.admin.leads.leads.admin.status.in_contact" as const,
                        },
                        {
                          value: LeadStatus.SIGNED_UP,
                          label:
                            "app.admin.leads.leads.admin.status.signed_up" as const,
                        },
                        {
                          value: LeadStatus.CONSULTATION_BOOKED,
                          label:
                            "app.admin.leads.leads.admin.status.consultation_booked" as const,
                        },
                        {
                          value: LeadStatus.SUBSCRIPTION_CONFIRMED,
                          label:
                            "app.admin.leads.leads.admin.status.subscription_confirmed" as const,
                        },
                        {
                          value: LeadStatus.UNSUBSCRIBED,
                          label:
                            "app.admin.leads.leads.admin.status.unsubscribed" as const,
                        },
                        {
                          value: LeadStatus.BOUNCED,
                          label:
                            "app.admin.leads.leads.admin.status.bounced" as const,
                        },
                        {
                          value: LeadStatus.INVALID,
                          label:
                            "app.admin.leads.leads.admin.status.invalid" as const,
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
                      label:
                        "app.admin.leads.leads.admin.import.defaults.campaignStage",
                      description:
                        "app.admin.leads.leads.admin.import.defaults.campaignStageDescription",
                      placeholder:
                        "app.admin.leads.leads.admin.import.defaults.campaignStagePlaceholder",
                      options: EmailCampaignStageOptions,
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
                      label:
                        "app.admin.leads.leads.admin.import.defaults.source",
                      description:
                        "app.admin.leads.leads.admin.import.defaults.sourceDescription",
                      placeholder:
                        "app.admin.leads.leads.admin.import.defaults.sourcePlaceholder",
                      options: [
                        {
                          value: LeadSource.WEBSITE,
                          label:
                            "app.admin.leads.leads.admin.source.website" as const,
                        },
                        {
                          value: LeadSource.SOCIAL_MEDIA,
                          label:
                            "app.admin.leads.leads.admin.source.social_media" as const,
                        },
                        {
                          value: LeadSource.EMAIL_CAMPAIGN,
                          label:
                            "app.admin.leads.leads.admin.source.email_campaign" as const,
                        },
                        {
                          value: LeadSource.REFERRAL,
                          label:
                            "app.admin.leads.leads.admin.source.referral" as const,
                        },
                        {
                          value: LeadSource.CSV_IMPORT,
                          label:
                            "app.admin.leads.leads.admin.source.csv_import" as const,
                        },
                        {
                          value: LeadSource.API,
                          label:
                            "app.admin.leads.leads.admin.source.api" as const,
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
                  <Div className="flex flex-col gap-2">
                    <Div className="flex items-center justify-between">
                      <P className="font-medium">
                        {t("app.admin.leads.leads.admin.import.progress.title")}
                      </P>
                      <Span className="text-sm text-gray-500">
                        {t(
                          "app.admin.leads.leads.admin.import.progress.processing",
                        )}
                      </Span>
                    </Div>
                    <Progress value={undefined} className="w-full" />
                  </Div>
                )}

                {/* Import Results */}
                {endpoint.create.response?.success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t("app.admin.leads.leads.admin.import.success", {
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
        </Div>

        <DialogFooter className="flex-shrink-0">
          {/* Form Alert for errors and success - positioned above submit button */}
          <Div className="w-full mb-4">
            <FormAlert alert={endpoint.alert} />
          </Div>

          <Button
            variant="outline"
            onClick={handleClose}
            disabled={endpoint.create.isSubmitting}
          >
            {t("app.admin.common.actions.cancel")}
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
                <Div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("app.admin.leads.leads.admin.import.importing")}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {t("app.admin.leads.leads.admin.import.start")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

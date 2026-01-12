/**
 * CSV Import Dialog Component
 * Allows admins to upload and import leads from CSV files
 */

"use client";

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
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { CheckCircle, Download, FileText, Upload } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Progress } from "next-vibe-ui/ui/progress";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import leadsImportDefinitions from "@/app/api/[locale]/leads/import/definition";
import { useLeadsImportEndpoint } from "@/app/api/[locale]/leads/import/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
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
    () => createEndpointLogger(false, Date.now(), locale),
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
        <DialogHeader className="shrink-0">
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
                          <Input<"file">
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
                <EndpointFormField
                  name="file"
                  control={endpoint.create.form.control}
                  endpoint={leadsImportDefinitions.POST}
                  locale={locale}
                  theme={{
                    style: "none",
                  }}
                />
                <EndpointFormField
                  name="fileName"
                  control={endpoint.create.form.control}
                  endpoint={leadsImportDefinitions.POST}
                  locale={locale}
                  theme={{
                    style: "none",
                  }}
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
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Update Existing */}
                  <EndpointFormField
                    name="updateExisting"
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
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
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Batch Size - only show when chunked processing is enabled */}
                  {endpoint.create.form.watch("useChunkedProcessing") && (
                    <EndpointFormField
                      name="batchSize"
                      control={endpoint.create.form.control}
                      endpoint={leadsImportDefinitions.POST}
                      locale={locale}
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
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Language */}
                  <EndpointFormField
                    name="defaultLanguage"
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Status */}
                  <EndpointFormField
                    name="defaultStatus"
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Campaign Stage */}
                  <EndpointFormField
                    name="defaultCampaignStage"
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  {/* Default Source */}
                  <EndpointFormField
                    name="defaultSource"
                    control={endpoint.create.form.control}
                    endpoint={leadsImportDefinitions.POST}
                    locale={locale}
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

        <DialogFooter className="shrink-0">
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
                await endpoint.create.onSubmit();
              }
            }}
            disabled={
              !endpoint.selectedFile ||
              !endpoint.create.form.watch("file") ||
              !endpoint.create.form.watch("fileName") ||
              endpoint.create.isSubmitting
            }
            className="bg-blue-600 bg-linear-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
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

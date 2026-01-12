/**
 * Email Preview Client Component
 * Client-side email preview rendering with test email modal and customizable props
 */

"use client";

import { Mail, Send } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Iframe } from "next-vibe-ui/ui/iframe";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { P } from "next-vibe-ui/ui/typography";
import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useEmailPreviewRender } from "@/app/api/[locale]/emails/preview/render/hooks/hooks";
import type { PreviewFieldConfig } from "@/app/api/[locale]/emails/registry/types";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { PreviewPropsForm } from "./preview-props-form";
import { TestEmailForm } from "./test-email-form";

interface EmailPreviewClientProps {
  locale: CountryLanguage;
  templateId: string;
  templateName: string;
  previewFields?: Record<string, PreviewFieldConfig>;
  exampleProps: Record<string, string | number | boolean>;
}

export function EmailPreviewClient({
  locale,
  templateId,
  templateName,
  previewFields,
  exampleProps,
}: EmailPreviewClientProps): ReactElement {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const initialLanguageCountry = useMemo(
    () => getLanguageAndCountryFromLocale(locale),
    [locale],
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    initialLanguageCountry.language,
  );
  const [selectedCountry, setSelectedCountry] = useState(
    initialLanguageCountry.country,
  );

  const previewEndpoint = useEmailPreviewRender(logger);

  const [currentProps, setCurrentProps] = useState<
    Record<string, string | number | boolean>
  >(exampleProps);

  // Update current props when example props change
  useEffect(() => {
    setCurrentProps(exampleProps);
  }, [exampleProps]);

  const updatePreview = useCallback(
    (props: Record<string, string | number | boolean>) => {
      previewEndpoint.create.form.setValue("templateId", templateId);
      previewEndpoint.create.form.setValue("language", selectedLanguage);
      previewEndpoint.create.form.setValue("country", selectedCountry);
      previewEndpoint.create.form.setValue("props", props);
      void previewEndpoint.create.onSubmit();
    },
    [templateId, selectedLanguage, selectedCountry, previewEndpoint.create],
  );

  // Initial preview render
  useEffect(() => {
    updatePreview(currentProps);
  }, [
    templateId,
    selectedLanguage,
    selectedCountry,
    exampleProps,
    currentProps,
    updatePreview,
  ]);

  const handlePropsChange = useCallback(
    (newProps: Record<string, string | number | boolean>) => {
      setCurrentProps(newProps);
      updatePreview(newProps);
    },
    [updatePreview],
  );

  return (
    <Div className="space-y-6">
      {/* Language and Country Selectors */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("app.admin.emails.templates.preview.locale.title")}
          </CardTitle>
          <P className="text-sm text-gray-600 dark:text-gray-400">
            {t("app.admin.emails.templates.preview.locale.description")}
          </P>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 gap-4">
            <Div className="flex flex-col gap-2">
              <Label htmlFor="preview-language">
                {t("app.admin.emails.templates.preview.locale.language")}
              </Label>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => {
                  setSelectedLanguage(value as typeof selectedLanguage);
                  updatePreview(currentProps);
                }}
              >
                <SelectTrigger id="preview-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    {t(
                      "app.admin.emails.templates.preview.locale.languages.en",
                    )}
                  </SelectItem>
                  <SelectItem value="de">
                    {t(
                      "app.admin.emails.templates.preview.locale.languages.de",
                    )}
                  </SelectItem>
                  <SelectItem value="pl">
                    {t(
                      "app.admin.emails.templates.preview.locale.languages.pl",
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Div>

            <Div className="flex flex-col gap-2">
              <Label htmlFor="preview-country">
                {t("app.admin.emails.templates.preview.locale.country")}
              </Label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value as typeof selectedCountry);
                  updatePreview(currentProps);
                }}
              >
                <SelectTrigger id="preview-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">
                    {t(
                      "app.admin.emails.templates.preview.locale.countries.GLOBAL",
                    )}
                  </SelectItem>
                  <SelectItem value="DE">
                    {t(
                      "app.admin.emails.templates.preview.locale.countries.DE",
                    )}
                  </SelectItem>
                  <SelectItem value="PL">
                    {t(
                      "app.admin.emails.templates.preview.locale.countries.PL",
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Props Customization Form */}
      <PreviewPropsForm
        previewFields={previewFields}
        defaultProps={exampleProps}
        onPropsChange={handlePropsChange}
      />

      {/* Email Preview Card */}
      <Card>
        <CardHeader>
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <CardTitle>{templateName}</CardTitle>
            </Div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  {t("app.admin.emails.templates.preview.send_test")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <TestEmailForm
                  locale={locale}
                  templateId={templateId}
                  onSuccess={() => {
                    setIsModalOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </Div>
        </CardHeader>
        <CardContent>
          {previewEndpoint.create && previewEndpoint.create.isSubmitting && (
            <Div className="flex items-center justify-center py-12">
              <P className="text-gray-500">
                {t("app.admin.emails.templates.preview.loading")}
              </P>
            </Div>
          )}

          {previewEndpoint.create && previewEndpoint.create.error && (
            <Div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <P className="text-red-600 dark:text-red-400">
                {previewEndpoint.create.error.message}
              </P>
            </Div>
          )}

          {previewEndpoint.create &&
            !previewEndpoint.create.isSubmitting &&
            !previewEndpoint.create.error &&
            previewEndpoint.create.response?.success && (
              <Div className="border rounded-lg overflow-hidden">
                <Iframe
                  srcDoc={previewEndpoint.create.response.data.html}
                  className="w-full min-h-[600px] bg-white"
                  title={`Email Preview: ${templateName}`}
                  sandbox="allow-same-origin"
                />
              </Div>
            )}
        </CardContent>
      </Card>
    </Div>
  );
}

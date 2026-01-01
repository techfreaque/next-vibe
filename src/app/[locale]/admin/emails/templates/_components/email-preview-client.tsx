/**
 * Email Preview Client Component
 * Client-side email preview rendering with test email modal
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Iframe } from "next-vibe-ui/ui/iframe";
import { P } from "next-vibe-ui/ui/typography";
import { Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { useTranslation } from "@/i18n/core/client";

import { TestEmailForm } from "./test-email-form";

interface EmailPreviewClientProps {
  locale: CountryLanguage;
  templateId: string;
  templateName: string;
}

export function EmailPreviewClient({
  locale,
  templateId,
  templateName,
}: EmailPreviewClientProps): ReactElement {
  const { t } = useTranslation();
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPreview = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      // Get locale parts (language and country)
      const [language, country] = locale.split("-") as [string, string];

      // Call preview render endpoint
      const response = await fetch(`/api/${locale}/emails/preview/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          language: language.toUpperCase(),
          country: country.toUpperCase(),
          props: {},
        }),
      });

      if (!response.ok) {
        setError(t("app.admin.emails.templates.preview.error_loading"));
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setError(
          data.message || t("app.admin.emails.templates.preview.error_loading"),
        );
        setIsLoading(false);
        return;
      }

      setPreviewHtml(data.data.html);
      setIsLoading(false);
    };

    void loadPreview();
  }, [locale, templateId, t]);

  return (
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
        {isLoading && (
          <Div className="flex items-center justify-center py-12">
            <P className="text-gray-500">
              {t("app.admin.emails.templates.preview.loading")}
            </P>
          </Div>
        )}

        {error && (
          <Div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <P className="text-red-600 dark:text-red-400">{error}</P>
          </Div>
        )}

        {!isLoading && !error && previewHtml && (
          <Div className="border rounded-lg overflow-hidden">
            <Iframe
              srcDoc={previewHtml}
              className="w-full min-h-[600px] bg-white"
              title={`Email Preview: ${templateName}`}
              sandbox="allow-same-origin"
            />
          </Div>
        )}
      </CardContent>
    </Card>
  );
}

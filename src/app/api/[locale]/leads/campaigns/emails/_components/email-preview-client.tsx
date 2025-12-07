/**
 * Email Preview Client Component
 * Client-side wrapper for email preview with test email functionality
 */

"use client";

import { render } from "@react-email/render";
import { Mail, Send } from "next-vibe-ui/ui/icons";
import { parseError } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "next-vibe-ui/ui/dialog";
import { Iframe } from "next-vibe-ui/ui/iframe";
import type React from "react";
import { useEffect, useState } from "react";

import type { EmailTemplateResult } from "@/app/api/[locale]/leads/campaigns/emails";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { TestEmailForm } from "./test-email-form";

interface EmailPreviewClientProps {
  journeyVariant: typeof EmailJourneyVariantValues;
  stage: typeof EmailCampaignStageValues;
  emailPreview: EmailTemplateResult;
  companyName: string;
  companyEmail: string;
  locale: CountryLanguage;
}

export function EmailPreviewClient({
  journeyVariant,
  stage,
  emailPreview,
  companyName,
  companyEmail,
  locale,
}: EmailPreviewClientProps): React.JSX.Element {
  const { t } = useTranslation();
  const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const logger = createEndpointLogger(false, Date.now(), locale);

  useEffect(() => {
    // Render JSX to HTML for preview
    const renderEmailHtml = async (): Promise<void> => {
      try {
        const html = await render(emailPreview.jsx);
        setRenderedHtml(html);
      } catch (error) {
        logger.error("Failed to render email HTML:", parseError(error));
        setRenderedHtml(t("app.admin.leads.leads.admin.emails.preview.error"));
      }
    };

    void renderEmailHtml();
  }, [emailPreview.jsx, logger, t]);

  return (
    <>
      {/* Test Email Button */}
      <Div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Div className="flex items-center justify-between">
            <Div>
              <H2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t("app.admin.leads.leads.admin.emails.preview.actions.title")}
              </H2>
              <P className="text-sm text-gray-600 dark:text-gray-400">
                {t(
                  "app.admin.leads.leads.admin.emails.preview.actions.description",
                )}
              </P>
            </Div>
            <Dialog open={isTestEmailOpen} onOpenChange={setIsTestEmailOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center flex flex-row gap-2">
                  <Send className="h-4 w-4" />
                  <Span>
                    {t("app.admin.leads.leads.admin.emails.testEmail.button")}
                  </Span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <TestEmailForm
                  emailJourneyVariant={journeyVariant}
                  emailCampaignStage={stage}
                  onClose={() => setIsTestEmailOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </Div>
        </Div>
      </Div>

      {/* Email Preview Content */}
      <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Email Meta Info */}
          <Div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Div>
                <Span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.from")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {companyName} &lt;{companyEmail}&gt;
                </Span>
              </Div>
              <Div>
                <Span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.recipient")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailPreview.to}
                </Span>
              </Div>
              <Div>
                <Span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.subject")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailPreview.subject}
                </Span>
              </Div>
            </Div>
          </Div>

          {/* Email Preview */}
          <Div className="p-6">
            <Div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <Div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <Div className="flex items-center justify-between">
                  <Span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("app.admin.leads.leads.admin.emails.email_preview")}
                  </Span>
                  <Div className="flex items-center flex flex-row gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Span className="text-xs text-gray-500">
                      {t("app.admin.leads.leads.admin.emails.preview.live")}
                    </Span>
                  </Div>
                </Div>
              </Div>

              {/* Email HTML Content */}
              <Div className="bg-white">
                <Iframe
                  srcDoc={renderedHtml}
                  className="w-full h-[600px] border-0"
                  title={t("app.admin.leads.leads.admin.emails.preview_title")}
                  sandbox="allow-same-origin"
                />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
}

/**
 * Email Preview Client Component
 * Client-side wrapper for email preview with test email functionality
 */

"use client";

import { render } from "@react-email/render";
import { Mail, Send } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "next-vibe-ui/ui/dialog";
import type React from "react";
import { useEffect, useState } from "react";

import type { EmailTemplateResult } from "@/app/api/[locale]/v1/core/leads/campaigns/emails";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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
        logger.error("Failed to render email HTML:", error);
        setRenderedHtml(t("app.admin.leads.leads.admin.emails.preview.error"));
      }
    };

    void renderEmailHtml();
  }, [emailPreview.jsx, logger, t]);

  return (
    <>
      {/* Test Email Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t("app.admin.leads.leads.admin.emails.preview.actions.title")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(
                  "app.admin.leads.leads.admin.emails.preview.actions.description",
                )}
              </p>
            </div>
            <Dialog open={isTestEmailOpen} onOpenChange={setIsTestEmailOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>
                    {t("app.admin.leads.leads.admin.emails.testEmail.button")}
                  </span>
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
          </div>
        </div>
      </div>

      {/* Email Preview Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Email Meta Info */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.from")}:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {companyName} &lt;{companyEmail}&gt;
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.recipient")}:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailPreview.to}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("app.admin.leads.leads.admin.emails.subject")}:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailPreview.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="p-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("app.admin.leads.leads.admin.emails.email_preview")}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {t("app.admin.leads.leads.admin.emails.preview.live")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email HTML Content */}
              <div className="bg-white">
                <iframe
                  srcDoc={renderedHtml}
                  className="w-full h-[600px] border-0"
                  title={t("app.admin.leads.leads.admin.emails.preview_title")}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Email Preview Client Component
 * Client-side wrapper for email preview with test email functionality
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Iframe } from "next-vibe-ui/ui/iframe";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type React from "react";
import { useState } from "react";

import type {
  EmailCampaignStageValue,
  EmailJourneyVariantValue,
} from "@/app/api/[locale]/leads/enum";
import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { TestEmailForm } from "./test-email-form";

interface EmailPreviewClientProps {
  journeyVariant: typeof EmailJourneyVariantValue;
  stage: typeof EmailCampaignStageValue;
  emailTo: string;
  emailSubject: string;
  emailHtml: string;
  companyName: string;
  companyEmail: string;
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function EmailPreviewClient({
  journeyVariant,
  stage,
  emailTo,
  emailSubject,
  emailHtml,
  companyName,
  companyEmail,
  locale,
  user,
}: EmailPreviewClientProps): React.JSX.Element {
  const { t } = leadsScopedTranslation.scopedT(locale);
  const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);

  return (
    <>
      {/* Test Email Button */}
      <Div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Div className="flex items-center justify-between">
            <Div>
              <H2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t("admin.emails.preview.actions.title")}
              </H2>
              <P className="text-sm text-gray-600 dark:text-gray-400">
                {t("admin.emails.preview.actions.description")}
              </P>
            </Div>
            <Dialog open={isTestEmailOpen} onOpenChange={setIsTestEmailOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center flex flex-row gap-2">
                  <Send className="h-4 w-4" />
                  <Span>{t("admin.emails.testEmail.button")}</Span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">
                  {t("admin.emails.testEmail.button")}
                </DialogTitle>
                <TestEmailForm
                  user={user}
                  locale={locale}
                  emailJourneyVariant={journeyVariant}
                  emailCampaignStage={stage}
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
                  {t("admin.emails.from")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {companyName} &lt;{companyEmail}&gt;
                </Span>
              </Div>
              <Div>
                <Span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("admin.emails.recipient")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailTo}
                </Span>
              </Div>
              <Div>
                <Span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("admin.emails.subject")}:
                </Span>
                <Span className="ml-2 text-gray-600 dark:text-gray-400">
                  {emailSubject}
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
                    {t("admin.emails.email_preview")}
                  </Span>
                  <Div className="flex items-center flex flex-row gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Span className="text-xs text-gray-500">
                      {t("admin.emails.preview.live")}
                    </Span>
                  </Div>
                </Div>
              </Div>

              {/* Email HTML Content */}
              <Div className="bg-white">
                <Iframe
                  srcDoc={emailHtml}
                  className="w-full h-[600px] border-0"
                  title={t("admin.emails.preview_title")}
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

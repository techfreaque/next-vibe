/**
 * Test Email Form Component
 * Form for sending test emails with custom props
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { P } from "next-vibe-ui/ui/typography";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactElement } from "react";

import { useEmailPreviewSendTest } from "@/app/api/[locale]/emails/preview/send-test/hooks/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";
import { useTranslation } from "@/i18n/core/client";

interface TestEmailFormProps {
  locale: CountryLanguage;
  templateId: string;
  onSuccess?: () => void;
}

export function TestEmailForm({
  locale,
  templateId,
  onSuccess,
}: TestEmailFormProps): ReactElement {
  const { t } = useTranslation();
  const [recipientEmail, setRecipientEmail] = useState("");
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const { language, country } = getLanguageAndCountryFromLocale(locale);

  const sendTestEndpoint = useEmailPreviewSendTest(logger);

  const emptyProps = useMemo(() => ({}), []);

  const handleSubmit = async (): Promise<void> => {
    if (!recipientEmail) {
      return;
    }

    sendTestEndpoint.create.form.setValue("templateId", templateId);
    sendTestEndpoint.create.form.setValue("recipientEmail", recipientEmail);
    sendTestEndpoint.create.form.setValue("language", language);
    sendTestEndpoint.create.form.setValue("country", country);
    sendTestEndpoint.create.form.setValue("props", emptyProps);

    await sendTestEndpoint.create.onSubmit();

    if (sendTestEndpoint.create.response?.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("app.admin.emails.templates.test.title")}</CardTitle>
        <P className="text-sm text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.templates.test.description")}
        </P>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <Div className="flex flex-col gap-4">
            {/* Recipient Email */}
            <Div>
              <Label htmlFor="recipientEmail">
                {t("app.admin.emails.templates.test.recipient")}
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                }}
                placeholder="test@example.com"
                required
                disabled={sendTestEndpoint.create?.isSubmitting}
                className="mt-2"
              />
            </Div>

            {/* Template ID Display */}
            <Div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <P className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.emails.templates.test.template")}: {templateId}
              </P>
            </Div>

            {/* Error Message */}
            {sendTestEndpoint.create.error && (
              <Div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <P className="text-red-600 dark:text-red-400">
                  {sendTestEndpoint.create.error.message}
                </P>
              </Div>
            )}

            {/* Success Message */}
            {sendTestEndpoint.create.response?.success && (
              <Div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <P className="text-green-600 dark:text-green-400">
                  {t("app.admin.emails.templates.test.success")}
                </P>
              </Div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={sendTestEndpoint.create?.isSubmitting}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendTestEndpoint.create?.isSubmitting
                ? t("app.admin.emails.templates.test.sending")
                : t("app.admin.emails.templates.test.send")}
            </Button>
          </Div>
        </Form>
      </CardContent>
    </Card>
  );
}

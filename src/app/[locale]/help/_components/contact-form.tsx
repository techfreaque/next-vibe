"use client";

import { Loader2 } from "lucide-react";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import { useContactWithEngagement } from "@/app/api/[locale]/v1/core/contact/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ContactFormProps {
  locale: CountryLanguage;
  user: StandardUserType | undefined;
}

/**
 * Contact form component
 * Handles form submission and validation
 */
export default function ContactForm({
  locale,
  user,
}: ContactFormProps): JSX.Element {
  const logger = createEndpointLogger(false, Date.now(), locale);
  const contactResult = useContactWithEngagement(logger, user);
  const form = contactResult.create.form;
  const isSubmitting = contactResult.create.isSubmitting || false;
  const submitForm = contactResult.create.onSubmit;
  const isSubmitSuccessful = contactResult.create.response?.success === true;
  const { t } = simpleT(locale);

  // Show success message if form was submitted successfully
  if (isSubmitSuccessful) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("app.help.components.pages.help.form.title")}
        </h2>
        <FormAlert alert={contactResult.alert} className="mb-6" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold mb-6">
        {t("app.help.components.pages.help.form.title")}
      </h2>
      {/* Show form alert if any */}
      <FormAlert alert={contactResult.alert} className="mb-6" />
      <Form form={form} onSubmit={submitForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EndpointFormField
            name="name"
            config={{
              type: "text",
              label: "app.help.components.pages.help.form.name",
              placeholder:
                "app.help.components.pages.help.form.namePlaceholder",
              disabled: isSubmitting,
            }}
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="email"
            config={{
              type: "email",
              label: "app.help.components.pages.help.form.email",
              placeholder:
                "app.help.components.pages.help.form.emailPlaceholder",
              disabled: isSubmitting,
            }}
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </div>

        <EndpointFormField
          name="company"
          config={{
            type: "text",
            label: "app.help.components.pages.help.form.company",
            placeholder:
              "app.help.components.pages.help.form.companyPlaceholder",
            disabled: isSubmitting,
          }}
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="subject"
          config={{
            type: "select",
            label: "app.help.components.pages.help.form.subject",
            placeholder:
              "app.help.components.pages.help.form.subjectPlaceholder",
            disabled: isSubmitting,
            options: [
              {
                value: "HELP_SUPPORT",
                label: "app.help.components.contact.subjects.HELP_SUPPORT",
              },
              {
                value: "GENERAL_INQUIRY",
                label: "app.help.components.contact.subjects.GENERAL_INQUIRY",
              },
              {
                value: "TECHNICAL_SUPPORT",
                label: "app.help.components.contact.subjects.TECHNICAL_SUPPORT",
              },
              {
                value: "ACCOUNT_QUESTION",
                label: "app.help.components.contact.subjects.ACCOUNT_QUESTION",
              },
              {
                value: "BILLING_QUESTION",
                label: "app.help.components.contact.subjects.BILLING_QUESTION",
              },
              {
                value: "SALES_INQUIRY",
                label: "app.help.components.contact.subjects.SALES_INQUIRY",
              },
              {
                value: "FEATURE_REQUEST",
                label: "app.help.components.contact.subjects.FEATURE_REQUEST",
              },
              {
                value: "BUG_REPORT",
                label: "app.help.components.contact.subjects.BUG_REPORT",
              },
              {
                value: "FEEDBACK",
                label: "app.help.components.contact.subjects.FEEDBACK",
              },
              {
                value: "COMPLAINT",
                label: "app.help.components.contact.subjects.COMPLAINT",
              },
              {
                value: "PARTNERSHIP",
                label: "app.help.components.contact.subjects.PARTNERSHIP",
              },
              {
                value: "OTHER",
                label: "app.help.components.contact.subjects.OTHER",
              },
            ],
          }}
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="message"
          config={{
            type: "textarea",
            label: "app.help.components.pages.help.form.message",
            placeholder:
              "app.help.components.pages.help.form.messagePlaceholder",
            disabled: isSubmitting,
            rows: 6,
          }}
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("app.help.components.pages.help.form.sending")}
            </>
          ) : (
            t("app.help.components.pages.help.form.submit")
          )}
        </Button>
      </Form>
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import contactDefinitions from "@/app/api/[locale]/v1/core/contact/definition";
import { useContactWithEngagement } from "@/app/api/[locale]/v1/core/contact/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/types";
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
            control={form.control}
            endpointFields={contactDefinitions.POST.fields}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="email"
            control={form.control}
            endpointFields={contactDefinitions.POST.fields}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </div>

        <EndpointFormField
          name="company"
          control={form.control}
          endpointFields={contactDefinitions.POST.fields}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="subject"
          control={form.control}
          endpointFields={contactDefinitions.POST.fields}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="message"
          control={form.control}
          endpointFields={contactDefinitions.POST.fields}
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

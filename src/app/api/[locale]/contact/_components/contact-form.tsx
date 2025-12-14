"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { H2 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import contactDefinitions from "@/app/api/[locale]/contact/definition";
import { useContactWithEngagement } from "@/app/api/[locale]/contact/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { StandardUserType } from "@/app/api/[locale]/user/types";
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
  const { t } = simpleT(locale);

  // Type assertion: contactResult.create is always defined because definition has POST
  if (!contactResult.create) {
    logger.error("Contact form endpoint not properly configured");
    return <Div>{t("app.api.contact._components.pages.help.form.error")}</Div>;
  }

  const form = contactResult.create.form;
  const isSubmitting = contactResult.create.isSubmitting || false;
  const submitForm = contactResult.create.onSubmit;
  const isSubmitSuccessful = contactResult.create.response?.success === true;

  // Show success message if form was submitted successfully
  if (isSubmitSuccessful) {
    return (
      <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <H2 className="text-2xl font-bold mb-6">
          {t("app.api.contact._components.pages.help.form.title")}
        </H2>
        <FormAlert alert={contactResult.alert} className="mb-6" />
      </Div>
    );
  }

  return (
    <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <H2 className="text-2xl font-bold mb-6">
        {t("app.api.contact._components.pages.help.form.title")}
      </H2>
      {/* Show form alert if any */}
      <FormAlert alert={contactResult.alert} className="mb-6" />
      <Form form={form} onSubmit={submitForm} className="flex flex-col gap-6">
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EndpointFormField
            name="name"
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
            endpointFields={contactDefinitions.POST.fields}
          />

          <EndpointFormField
            name="email"
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
            endpointFields={contactDefinitions.POST.fields}
          />
        </Div>

        <EndpointFormField
          name="company"
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          endpointFields={contactDefinitions.POST.fields}
        />

        <EndpointFormField
          name="subject"
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          endpointFields={contactDefinitions.POST.fields}
        />

        <EndpointFormField
          name="message"
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          endpointFields={contactDefinitions.POST.fields}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("app.api.contact._components.pages.help.form.sending")}
            </>
          ) : (
            t("app.api.contact._components.pages.help.form.submit")
          )}
        </Button>
      </Form>
    </Div>
  );
}

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import { useMemo, useState } from "react";
import type { JSX } from "react";

import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useApiForm } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation-form";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import helpListEndpoints from "../definition";
import type { HelpListResponseOutput } from "../definition";

interface HelpListViewProps {
  locale: CountryLanguage;
}

/**
 * Help List View Component
 * Shows form to filter commands, then displays results
 */
export function HelpListView({ locale }: HelpListViewProps): JSX.Element {
  const { t } = simpleT(locale);
  const [responseData, setResponseData] =
    useState<HelpListResponseOutput | null>(null);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const { form, submitForm, isSubmitting, submitError } = useApiForm(
    helpListEndpoints.POST,
    logger,
    {
      defaultValues: {
        format: "tree",
        showAliases: true,
        showDescriptions: true,
      },
      persistForm: false,
    },
    {
      onSuccess: ({ responseData }) => {
        setResponseData(responseData);
      },
    },
  );

  return (
    <Div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4">
      <Div className="container max-w-6xl mx-auto">
        <Div className="text-center mb-12">
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.api.system.help.list.post.title")}
          </H1>
          <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("app.api.system.help.list.post.description")}
          </P>
        </Div>

        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg mb-8">
          <CardContent className="mt-6">
            <EndpointRenderer
              endpoint={helpListEndpoints.POST}
              form={form}
              onSubmit={() => submitForm()}
              data={responseData ?? undefined}
              locale={locale}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>

        {submitError && (
          <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-lg mb-8">
            <CardContent className="mt-6">
              <P className="text-red-600 dark:text-red-400">
                {submitError.message}
              </P>
            </CardContent>
          </Card>
        )}

        {isSubmitting && (
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardContent className="mt-6">
              <P className="text-center text-gray-600 dark:text-gray-400">
                {t("app.user.common.loading")}
              </P>
            </CardContent>
          </Card>
        )}
      </Div>
    </Div>
  );
}

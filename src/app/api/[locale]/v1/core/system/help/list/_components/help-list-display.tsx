"use client";

/**
 * Help List Display Component
 * Displays a list of all available commands/endpoints
 * Like running `vibe list` in CLI
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-api-mutation";

import helpListEndpoints from "@/app/api/[locale]/v1/core/system/help/list/definition";
import { EndpointRenderer } from "@/app/api/[locale]/v1/core/system/unified-interface/react/widgets/renderers/EndpointRenderer";

export interface HelpListDisplayProps {
  locale: CountryLanguage;
}

export function HelpListDisplay({ locale }: HelpListDisplayProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use mutation to fetch the list immediately on mount
  const mutation = useApiMutation(helpListEndpoints.POST, logger);

  useEffect(() => {
    // Fetch the list immediately with default options
    void mutation.mutate({
      requestData: {
        format: "tree",
        showAliases: true,
        showDescriptions: true,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Div className="container mx-auto py-8 px-4">
      <H1 className="mb-6">
        {t("app.api.v1.core.system.help.list.post.title")}
      </H1>

      {mutation.isPending && <Div>Loading...</Div>}

      {mutation.data &&
        "success" in mutation.data &&
        mutation.data.success &&
        mutation.data.data && (
          <EndpointRenderer
            endpoint={helpListEndpoints.POST}
            locale={locale}
            data={mutation.data.data}
          />
        )}

      {mutation.error && (
        <Div className="text-red-500">
          {t(
            "app.api.v1.core.system.help.list.post.errors.server.errorLoading",
            { error: mutation.error.message },
          )}
        </Div>
      )}
    </Div>
  );
}

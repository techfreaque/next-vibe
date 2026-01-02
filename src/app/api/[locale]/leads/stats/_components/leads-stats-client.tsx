/**
 * Leads Stats Client Component
 * Refactored to use EndpointRenderer with minimal custom code
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import leadsStatsEndpoints from "@/app/api/[locale]/leads/stats/definition";
import { useLeadsStatsEndpoint } from "@/app/api/[locale]/leads/stats/hooks";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsStatsClientProps {
  locale: CountryLanguage;
}

export function LeadsStatsClient({ locale }: LeadsStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useLeadsStatsEndpoint(logger);

  // For GET endpoints, form submission triggers a refetch
  const handleSubmit = (): void => {
    void endpoint.read.refetch?.();
  };

  return (
    <Div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("app.api.leads.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointRenderer
            endpoint={leadsStatsEndpoints.GET}
            form={endpoint.read.form}
            onSubmit={handleSubmit}
            locale={locale}
            isSubmitting={endpoint.read.isLoading || false}
            data={endpoint.read.response?.success ? endpoint.read.response.data : undefined}
            submitButtonText="app.admin.common.actions.filter"
          />
        </CardContent>
      </Card>
    </Div>
  );
}

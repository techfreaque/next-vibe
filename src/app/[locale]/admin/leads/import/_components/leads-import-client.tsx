/**
 * Leads Import Client Component
 * Handles CSV import and displays import job status
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Upload } from "next-vibe-ui/ui/icons";
import type React from "react";

import leadsImportEndpoints from "@/app/api/[locale]/leads/import/definition";
import { useLeadsImportEndpoint } from "@/app/api/[locale]/leads/import/hooks";
import importJobsStatusEndpoints from "@/app/api/[locale]/leads/import/status/definition";
import { useImportJobsStatusEndpoint } from "@/app/api/[locale]/leads/import/status/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsImportClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsImportClient({
  locale,
  user,
}: LeadsImportClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  const importEndpoint = useLeadsImportEndpoint(logger);
  const statusEndpoint = useImportJobsStatusEndpoint(logger);

  const handleImportSubmit = (): void => {
    // After successful import, refetch the status list
    if (importEndpoint.create.response?.success) {
      void statusEndpoint.read.refetch?.();
    }
  };

  const handleStatusRefresh = (): void => {
    void statusEndpoint.read.refetch?.();
  };

  return (
    <Div className="flex flex-col gap-6">
      {/* CSV Import Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("app.api.leads.import.post.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointRenderer
            endpoint={leadsImportEndpoints.POST}
            form={importEndpoint.create.form}
            user={user}
            onSubmit={handleImportSubmit}
            locale={locale}
            data={
              importEndpoint.create.response?.success
                ? importEndpoint.create.response.data
                : undefined
            }
            submitButtonText="app.admin.leads.leads.admin.import.actions.import"
            logger={logger}
          />
        </CardContent>
      </Card>

      {/* Import Jobs Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("app.api.leads.import.status.get.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointRenderer
            endpoint={importJobsStatusEndpoints.GET}
            form={statusEndpoint.read.form}
            onSubmit={handleStatusRefresh}
            locale={locale}
            user={user}
            data={
              statusEndpoint.read.response?.success
                ? statusEndpoint.read.response.data
                : undefined
            }
            submitButtonText="app.admin.common.actions.reset"
            logger={logger}
          />
        </CardContent>
      </Card>
    </Div>
  );
}

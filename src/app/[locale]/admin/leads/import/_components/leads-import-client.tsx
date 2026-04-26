/**
 * Leads Import Client Component
 * Handles CSV import and displays import job status
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Upload } from "next-vibe-ui/ui/icons/Upload";
import type React from "react";

import leadsImportEndpoints from "@/app/api/[locale]/leads/import/definition";
import { useLeadsImportEndpoint } from "@/app/api/[locale]/leads/import/hooks";
import { scopedTranslation as leadsImportScopedTranslation } from "@/app/api/[locale]/leads/import/i18n";
import importJobsStatusEndpoints from "@/app/api/[locale]/leads/import/status/definition";
import { useImportJobsStatusEndpoint } from "@/app/api/[locale]/leads/import/status/hooks";
import { useLogger } from "@/hooks/use-logger";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsImportClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsImportClient({
  locale,
  user,
}: LeadsImportClientProps): React.JSX.Element {
  const { t } = leadsImportScopedTranslation.scopedT(locale);
  const logger = useLogger();

  const statusEndpoint = useImportJobsStatusEndpoint(user, logger);

  const importEndpoint = useLeadsImportEndpoint(user, logger, {
    onSuccess: (): void => {
      void statusEndpoint.read?.refetch?.();
    },
  });

  return (
    <Div className="flex flex-col gap-6">
      {/* CSV Import Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("post.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointsPage
            endpoint={{ POST: leadsImportEndpoints.POST }}
            endpointInstance={importEndpoint}
            locale={locale}
            user={user}
          />
        </CardContent>
      </Card>

      {/* Import Jobs Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("status.get.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointsPage
            endpoint={{ GET: importJobsStatusEndpoints.GET }}
            endpointInstance={statusEndpoint}
            locale={locale}
            user={user}
          />
        </CardContent>
      </Card>
    </Div>
  );
}

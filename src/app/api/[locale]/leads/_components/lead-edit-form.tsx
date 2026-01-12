/**
 * Lead Edit Form Component
 * Refactored to use EndpointRenderer with minimal custom code
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import leadEndpoints from "@/app/api/[locale]/leads/lead/[id]/definition";
import { useLeadByIdEndpoint } from "@/app/api/[locale]/leads/lead/[id]/hooks";
import type { LeadDetailResponse } from "@/app/api/[locale]/leads/types";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadEditFormProps {
  lead: LeadDetailResponse;
  locale: CountryLanguage;
  leadId: string;
  user: JwtPayloadType;
}

export function LeadEditForm({ lead, locale, leadId, user }: LeadEditFormProps): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  const endpoint = useLeadByIdEndpoint(logger, {
    leadId,
    enabled: true,
  });

  const { form, onSubmit } = endpoint.create || {};

  return (
    <Div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header with Navigation */}
      <Div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("app.admin.leads.leads.edit.form.actions.back")}
        </Button>
        <Div className="text-sm text-gray-500 dark:text-gray-400">{leadId}</Div>
      </Div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("app.admin.common.actions.edit")} - {lead.lead.basicInfo.businessName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointRenderer
            user={user}
            endpoint={leadEndpoints.PATCH}
            form={form}
            onSubmit={onSubmit}
            locale={locale}
            submitButtonText="app.admin.common.actions.save"
            onCancel={() => router.back()}
            logger={logger}
          />
        </CardContent>
      </Card>
    </Div>
  );
}

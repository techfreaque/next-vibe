/**
 * Consultations List Client Component
 * Main client component for consultation list management with filters and pagination
 */

"use client";

import { List, RefreshCw } from "lucide-react";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";

import { useConsultationsListEndpoint } from "@/app/api/[locale]/v1/core/consultation/admin/hooks";
import type { ConsultationAdminListGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationsListFilters } from "./consultations-list-filters";
import { ConsultationsListPagination } from "./consultations-list-pagination";
import { ConsultationsListTable } from "./consultations-list-table";

interface ConsultationsListClientProps {
  locale: CountryLanguage;
}

export function ConsultationsListClient({
  locale,
}: ConsultationsListClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const consultationsEndpoint = useConsultationsListEndpoint();

  const apiResponse = consultationsEndpoint.read.response;
  const consultations: ConsultationAdminListGetResponseTypeOutput["consultations"] =
    apiResponse?.success ? apiResponse.data.consultations : [];
  const totalConsultations = apiResponse?.success
    ? apiResponse.data.pagination.total
    : 0;
  const totalPages = apiResponse?.success
    ? apiResponse.data.pagination.totalPages
    : 0;
  const queryLoading = consultationsEndpoint.read.isLoading || false;

  // Get current form values for pagination display
  const currentPage = consultationsEndpoint.read.form.getValues("page") || 1;
  const currentLimit = consultationsEndpoint.read.form.getValues("limit") || 20;

  const handleRefresh = (): void => {
    void consultationsEndpoint.read.refetch();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            {t("consultations.admin.list.title")}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={queryLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${queryLoading ? "animate-spin" : ""}`}
            />
            {t("leads.admin.actions.refresh")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="border-b pb-4">
          <Form
            form={consultationsEndpoint.read.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <ConsultationsListFilters form={consultationsEndpoint.read.form} />
          </Form>
        </div>

        {/* Results */}
        <ConsultationsListTable
          consultations={consultations}
          loading={queryLoading}
          locale={locale}
        />

        {/* Pagination */}
        <ConsultationsListPagination
          currentPage={currentPage}
          currentLimit={currentLimit}
          totalConsultations={totalConsultations}
          totalPages={totalPages}
          form={consultationsEndpoint.read.form}
          locale={locale}
        />
      </CardContent>
    </Card>
  );
}

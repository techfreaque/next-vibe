/**
 * Consultations List Pagination Component
 * Pagination controls for consultation list
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

import type { ConsultationAdminListGetRequestTypeInput } from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationsListPaginationProps {
  currentPage: number;
  currentLimit: number;
  totalConsultations: number;
  totalPages: number;
  form: UseFormReturn<ConsultationAdminListGetRequestTypeInput>;
  locale: CountryLanguage;
}

export function ConsultationsListPagination({
  currentPage,
  currentLimit,
  totalConsultations,
  totalPages,
  form,
  locale,
}: ConsultationsListPaginationProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const handlePageChange = (newPage: number): void => {
    form.setValue("page", newPage);
    void form.handleSubmit(() => {})();
  };

  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalConsultations);

  if (totalConsultations === 0) {
    return <div />;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {t("consultations.admin.list.pagination.showing", {
          start: startItem,
          end: endItem,
          total: totalConsultations,
        })}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("consultations.admin.list.pagination.previous")}
        </Button>

        <div className="text-sm text-muted-foreground">
          {t("consultations.admin.list.pagination.page", {
            page: currentPage,
            totalPages,
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {t("consultations.admin.list.pagination.next")}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

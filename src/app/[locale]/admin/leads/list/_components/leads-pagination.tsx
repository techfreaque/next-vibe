/**
 * Leads Pagination Component
 * Reusable pagination component for leads admin UI
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import type { JSX } from "react";

import type { LeadsListEndpointReturn } from "@/app/api/[locale]/v1/core/leads/list/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsPaginationProps {
  locale: CountryLanguage;
  leadsEndpoint: LeadsListEndpointReturn;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  className?: string;
}

export function LeadsPagination({
  locale,
  leadsEndpoint,
  totalItems,
  totalPages,
  currentPage,
  currentLimit,
  className = "",
}: LeadsPaginationProps): JSX.Element {
  const { t } = simpleT(locale);

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      leadsEndpoint.read.form?.setValue("searchPagination.page", newPage);
    }
  };

  const handleLimitChange = (newLimit: string): void => {
    const limit = parseInt(newLimit, 10);
    leadsEndpoint.read.form?.setValue("searchPagination.limit", limit);
    leadsEndpoint.read.form?.setValue("searchPagination.page", 1); // Reset to first page when changing limit
  };

  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalItems);

  if (totalItems === 0) {
    return <div />;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}
    >
      {/* Results info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {t("app.admin.leads.leads.list.results.showing", {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </span>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span>{t("app.admin.leads.leads.pagination.page_size")}:</span>
          <Select
            value={currentLimit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("app.admin.leads.leads.pagination.page_info", {
            current: currentPage,
            total: totalPages,
          })}
        </span>

        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">
              {t("app.admin.leads.leads.pagination.first")}
            </span>
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">
              {t("app.admin.leads.leads.pagination.previous")}
            </span>
          </Button>

          {/* Page numbers */}
          {totalPages <= 7 ? (
            // Show all pages if 7 or fewer
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))
          ) : (
            // Show condensed pagination for more than 7 pages
            <>
              {currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="h-8 w-8 p-0"
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) {
                  return null;
                }
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="h-8 w-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </>
          )}

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">
              {t("app.admin.leads.leads.pagination.next")}
            </span>
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">
              {t("app.admin.leads.leads.pagination.last")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

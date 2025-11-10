/**
 * Emails List Pagination Component
 * Pagination controls for emails list
 */

"use client";

import { ChevronLeft, ChevronRight } from "next-vibe-ui/ui/icons";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { EmailsListRequestType } from "@/app/api/[locale]/v1/core/emails/messages/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsListPaginationProps {
  currentPage: number;
  currentLimit: number;
  totalEmails: number;
  totalPages: number;
  form: UseFormReturn<EmailsListRequestType>;
  locale: CountryLanguage;
}

export function EmailsListPagination({
  currentPage,
  currentLimit,
  totalEmails,
  totalPages,
  form,
  locale,
}: EmailsListPaginationProps): JSX.Element {
  const { t } = simpleT(locale);

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      form.setValue("displayOptions.page", currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      form.setValue("displayOptions.page", currentPage + 1);
    }
  };

  const handlePageJump = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      form.setValue("displayOptions.page", page);
    }
  };

  // Calculate display range
  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalEmails);

  // Generate page numbers to show
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {t("app.admin.emails.list.pagination.showing", {
            start: startItem,
            end: endItem,
            total: totalEmails,
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        {t("app.admin.emails.list.pagination.showing", {
          start: startItem,
          end: endItem,
          total: totalEmails,
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("app.admin.emails.list.pagination.previous")}
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {/* First page if not in range */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageJump(1)}
              >
                1
              </Button>
              {currentPage > 4 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Page number buttons */}
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageJump(page)}
            >
              {page}
            </Button>
          ))}

          {/* Last page if not in range */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageJump(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          {t("app.admin.emails.list.pagination.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

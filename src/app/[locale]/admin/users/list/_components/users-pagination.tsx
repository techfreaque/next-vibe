/**
 * Users Pagination Component
 * Pagination controls for users list
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Div, Span } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { UsersListEndpointReturn } from "@/app/api/[locale]/v1/core/users/list/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UsersPaginationProps {
  locale: CountryLanguage;
  usersEndpoint: UsersListEndpointReturn;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  className?: string;
}

export function UsersPagination({
  locale,
  usersEndpoint,
  totalItems,
  totalPages,
  currentPage,
  currentLimit,
  className = "",
}: UsersPaginationProps): JSX.Element {
  const { t } = simpleT(locale);

  if (!usersEndpoint.read) {
    return <></>;
  }

  const handlePageChange = (page: number): void => {
    if (!usersEndpoint.read) {
      return;
    }
    usersEndpoint.read.form.setValue("searchAndPagination.page", page);
  };

  const handleLimitChange = (limit: string): void => {
    if (!usersEndpoint.read) {
      return;
    }
    usersEndpoint.read.form.setValue(
      "searchAndPagination.limit",
      parseInt(limit, 10),
    );
    usersEndpoint.read.form.setValue("searchAndPagination.page", 1); // Reset to first page
  };

  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalItems);

  return (
    <Div className={`flex items-center justify-between ${className}`}>
      <Div className="flex items-center space-x-2">
        <P className="text-sm text-gray-700 dark:text-gray-300">
          {t("app.admin.users.list.pagination.showing", {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </P>
      </Div>

      <Div className="flex items-center space-x-6">
        {/* Items per page */}
        <Div className="flex items-center space-x-2">
          <P className="text-sm text-gray-700 dark:text-gray-300">
            {t("app.admin.users.list.pagination.per_page")}
          </P>
          <Select
            value={currentLimit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </Div>

        {/* Page navigation */}
        <Div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Div className="flex items-center space-x-1">
            <Span className="text-sm text-gray-700 dark:text-gray-300">
              {t("app.admin.users.list.pagination.page", {
                current: currentPage,
                total: totalPages,
              })}
            </Span>
          </Div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

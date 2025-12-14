/**
 * Users List Client Component
 * Uses form-based filtering pattern similar to leads list
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { Filter, List, RefreshCw, Table } from "next-vibe-ui/ui/icons";
import { Link as NextLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  SortOrder,
  UserRoleFilter,
  UserSortField,
  UserStatusFilter,
} from "@/app/api/[locale]/users/enum";
import type { UserListResponseOutput } from "@/app/api/[locale]/users/list/definition";
import type { UsersListEndpointReturn } from "@/app/api/[locale]/users/list/hooks";
import { useUsersListEndpoint } from "@/app/api/[locale]/users/list/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UsersPagination } from "./users-pagination";
import { UsersTable } from "./users-table";

interface UsersListClientProps {
  locale: CountryLanguage;
}

export function UsersListClient({
  locale,
}: UsersListClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const usersEndpoint: UsersListEndpointReturn = useUsersListEndpoint(logger);
  const [viewMode, setViewMode] = useState<"list" | "table">("table");

  type UserType = UserListResponseOutput["response"]["users"][number];

  const apiResponse = usersEndpoint.read?.response;
  const users: UserType[] = apiResponse?.success
    ? apiResponse.data.response.users
    : [];
  const totalUsers = apiResponse?.success
    ? apiResponse.data.paginationInfo.totalCount
    : 0;
  const totalPages = apiResponse?.success
    ? apiResponse.data.paginationInfo.pageCount
    : 0;
  const queryLoading = usersEndpoint.read?.isLoading || false;

  // Get current form values for pagination display
  const currentPage =
    usersEndpoint.read?.form.getValues("paginationInfo.page") || 1;
  const currentLimit =
    usersEndpoint.read?.form.getValues("paginationInfo.limit") || 20;

  const handleClearFilters = (): void => {
    usersEndpoint.read?.form.reset({
      searchFilters: {
        search: undefined,
        status: [UserStatusFilter.ALL],
        role: [UserRoleFilter.ALL],
      },
      sortingOptions: {
        sortBy: UserSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
      paginationInfo: {
        page: 1,
        limit: 20,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <Div className="flex items-center justify-between">
          <CardTitle className="items-center flex flex-row gap-2">
            <Span>{t("app.admin.users.list.title")}</Span>
            {queryLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
            )}
          </CardTitle>

          <Div className="items-center flex flex-row gap-2">
            {/* View Mode Toggle */}
            <Div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </Div>

            {/* Add User */}
            <Button asChild size="sm">
              <NextLink href={`/${locale}/admin/users/create`}>
                {t("app.admin.users.actions.add")}
              </NextLink>
            </Button>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={usersEndpoint.read.refetch}
              disabled={queryLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", queryLoading && "animate-spin")}
              />
            </Button>
          </Div>
        </Div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <Div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Div className="items-center flex flex-row gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("app.admin.users.list.filters.title")}:
            </Span>
          </Div>

          <Form form={usersEndpoint.read.form}>
            <Div className="flex flex-col gap-4">
              <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Search Field */}
                <EndpointFormField
                  name="searchFilters.search"
                  config={{
                    type: "text",
                    label: undefined,
                    placeholder: "app.admin.users.search.placeholder",
                  }}
                  control={usersEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Status Filter */}
                <EndpointFormField
                  name="searchFilters.status"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "app.admin.users.status.placeholder",
                    options: [
                      {
                        value: UserStatusFilter.ALL,
                        label: "app.admin.users.status.all",
                      },
                      {
                        value: UserStatusFilter.ACTIVE,
                        label: "app.admin.users.status.active",
                      },
                      {
                        value: UserStatusFilter.INACTIVE,
                        label: "app.admin.users.status.inactive",
                      },
                      {
                        value: UserStatusFilter.EMAIL_VERIFIED,
                        label: "app.admin.users.status.email_verified",
                      },
                      {
                        value: UserStatusFilter.EMAIL_UNVERIFIED,
                        label: "app.admin.users.status.email_unverified",
                      },
                    ],
                  }}
                  control={usersEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Role Filter */}
                <EndpointFormField
                  name="searchFilters.role"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "app.admin.users.role.placeholder",
                    options: [
                      {
                        value: UserRoleFilter.ALL,
                        label: "app.admin.users.role.all",
                      },
                      {
                        value: UserRoleFilter.PUBLIC,
                        label: "app.admin.users.role.public",
                      },
                      {
                        value: UserRoleFilter.CUSTOMER,
                        label: "app.admin.users.role.customer",
                      },
                      {
                        value: UserRoleFilter.PARTNER_ADMIN,
                        label: "app.admin.users.role.partner_admin",
                      },
                      {
                        value: UserRoleFilter.PARTNER_EMPLOYEE,
                        label: "app.admin.users.role.partner_employee",
                      },
                      {
                        value: UserRoleFilter.ADMIN,
                        label: "app.admin.users.role.admin",
                      },
                    ],
                  }}
                  control={usersEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Sort By */}
                <EndpointFormField
                  name="sortingOptions.sortBy"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "app.admin.users.sort.placeholder",
                    options: [
                      {
                        value: UserSortField.CREATED_AT,
                        label: "app.admin.users.sort.created",
                      },
                      {
                        value: UserSortField.UPDATED_AT,
                        label: "app.admin.users.sort.updated",
                      },
                      {
                        value: UserSortField.EMAIL,
                        label: "app.admin.users.sort.email",
                      },
                      {
                        value: UserSortField.PRIVATE_NAME,
                        label: "app.admin.users.sort.privateName",
                      },
                      {
                        value: UserSortField.PUBLIC_NAME,
                        label: "app.admin.users.sort.publicName",
                      },
                    ],
                  }}
                  control={usersEndpoint.read.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>

              {/* Sort Order and Actions */}
              <Div className="flex items-center justify-between">
                <Div className="items-center flex flex-row gap-4">
                  <EndpointFormField
                    name="sortingOptions.sortOrder"
                    config={{
                      type: "select",
                      label: undefined,
                      placeholder: "app.admin.users.sortOrder.placeholder",
                      options: [
                        {
                          value: SortOrder.ASC,
                          label: "app.admin.users.sortOrder.asc",
                        },
                        {
                          value: SortOrder.DESC,
                          label: "app.admin.users.sortOrder.desc",
                        },
                      ],
                    }}
                    control={usersEndpoint.read.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </Div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  {t("app.admin.users.list.filters.clear")}
                </Button>
              </Div>
            </Div>
          </Form>
        </Div>

        {/* Results Summary */}
        <Div className="mb-4 flex items-center justify-between">
          <Div className="text-sm text-gray-700 dark:text-gray-300">
            {t("app.admin.users.list.results.showing", {
              start:
                totalUsers === 0 ? 0 : (currentPage - 1) * currentLimit + 1,
              end: Math.min(currentPage * currentLimit, totalUsers),
              total: totalUsers,
            })}
          </Div>
        </Div>

        {/* Content */}
        {queryLoading && users.length === 0 ? (
          <Div className="flex items-center justify-center h-64">
            <Div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <P className="text-gray-500">
                {t("app.admin.common.loading")}...
              </P>
            </Div>
          </Div>
        ) : users.length === 0 ? (
          <Div className="flex items-center justify-center h-64">
            <Div className="text-center">
              <P className="text-gray-500 mb-4">
                {t("app.admin.users.list.empty.message")}
              </P>
              <Button asChild>
                <NextLink href={`/${locale}/admin/users/create`}>
                  {t("app.admin.users.actions.add")}
                </NextLink>
              </Button>
            </Div>
          </Div>
        ) : viewMode === "table" ? (
          <UsersTable locale={locale} users={users} isLoading={queryLoading} />
        ) : (
          <Div className="flex flex-col gap-3">
            {users.map((user: UserType) => (
              <Div
                key={user.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Div className="flex items-center justify-between">
                  <Div className="items-center flex flex-row gap-4">
                    <Div>
                      <NextLink
                        href={`/${locale}/admin/users/${user.id}/edit`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {user.privateName || user.publicName}
                      </NextLink>
                      <P className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </P>
                    </Div>
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        )}

        {/* Pagination */}
        {totalUsers > 0 && (
          <UsersPagination
            locale={locale}
            usersEndpoint={usersEndpoint}
            totalItems={totalUsers}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          />
        )}
      </CardContent>
    </Card>
  );
}

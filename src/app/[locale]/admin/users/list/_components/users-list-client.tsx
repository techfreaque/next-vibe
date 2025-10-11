/**
 * Users List Client Component
 * Uses form-based filtering pattern similar to leads list
 */

"use client";

import { Filter, List, RefreshCw, Table } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import React, { useState } from "react";

import { userListRequestSchema } from "@/app/api/[locale]/v1/core/users/list/definition";
import {
  SortOrder,
  UserRoleFilter,
  UserSortField,
  UserStatusFilter,
} from "@/app/api/[locale]/v1/core/users/enum";
import { useUsersListEndpoint } from "@/app/api/[locale]/v1/core/users/list/hooks";
import type { UserResponseType } from "@/app/api/[locale]/v1/core/users/user/[id]/definition";
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
  const usersEndpoint = useUsersListEndpoint();
  const [viewMode, setViewMode] = useState<"list" | "table">("table");

  const apiResponse = usersEndpoint.read.response;
  const users: UserResponseType[] = apiResponse?.success
    ? apiResponse.data.users
    : [];
  const totalUsers = apiResponse?.success ? apiResponse.data.total : 0;
  const totalPages = apiResponse?.success ? apiResponse.data.totalPages : 0;
  const queryLoading = usersEndpoint.read.isLoading || false;

  // Get current form values for pagination display
  const currentPage = usersEndpoint.read.form.getValues("page") || 1;
  const currentLimit = usersEndpoint.read.form.getValues("limit") || 20;

  const handleClearFilters = (): void => {
    usersEndpoint.read.form.reset({
      search: undefined,
      status: UserStatusFilter.ALL,
      role: UserRoleFilter.ALL,
      page: 1,
      limit: 20,
      sortBy: UserSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>{t("users.list.title")}</span>
            {queryLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
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
            </div>

            {/* Add User */}
            <Button asChild size="sm">
              <Link href={`/${locale}/admin/users/create`}>
                {t("users.admin.actions.add")}
              </Link>
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("users.list.filters.title")}:
            </span>
          </div>

          <Form
            form={usersEndpoint.read.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search Field */}
              <EndpointFormField
                name="search"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder: "users.search.placeholder",
                }}
                control={usersEndpoint.read.form.control}
                schema={userListRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Status Filter */}
              <EndpointFormField
                name="status"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "users.status.placeholder",
                  options: [
                    {
                      value: UserStatusFilter.ALL,
                      label: "users.admin.status.all",
                    },
                    {
                      value: UserStatusFilter.ACTIVE,
                      label: "users.admin.status.active",
                    },
                    {
                      value: UserStatusFilter.INACTIVE,
                      label: "users.admin.status.inactive",
                    },
                    {
                      value: UserStatusFilter.EMAIL_VERIFIED,
                      label: "users.admin.status.email_verified",
                    },
                    {
                      value: UserStatusFilter.EMAIL_UNVERIFIED,
                      label: "users.admin.status.email_unverified",
                    },
                  ],
                }}
                control={usersEndpoint.read.form.control}
                schema={userListRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Role Filter */}
              <EndpointFormField
                name="role"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "users.role.placeholder",
                  options: [
                    {
                      value: UserRoleFilter.ALL,
                      label: "users.admin.role.all",
                    },
                    {
                      value: UserRoleFilter.PUBLIC,
                      label: "users.admin.role.public",
                    },
                    {
                      value: UserRoleFilter.CUSTOMER,
                      label: "users.admin.role.customer",
                    },
                    {
                      value: UserRoleFilter.PARTNER_ADMIN,
                      label: "users.admin.role.partner_admin",
                    },
                    {
                      value: UserRoleFilter.PARTNER_EMPLOYEE,
                      label: "users.admin.role.partner_employee",
                    },
                    {
                      value: UserRoleFilter.ADMIN,
                      label: "users.admin.role.admin",
                    },
                  ],
                }}
                control={usersEndpoint.read.form.control}
                schema={userListRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Sort By */}
              <EndpointFormField
                name="sortBy"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder: "users.sort.placeholder",
                  options: [
                    {
                      value: UserSortField.CREATED_AT,
                      label: "users.sort.created",
                    },
                    {
                      value: UserSortField.UPDATED_AT,
                      label: "users.sort.updated",
                    },
                    {
                      value: UserSortField.EMAIL,
                      label: "users.sort.email",
                    },
                    {
                      value: UserSortField.FIRST_NAME,
                      label: "users.sort.first_name",
                    },
                    {
                      value: UserSortField.LAST_NAME,
                      label: "users.sort.last_name",
                    },
                    {
                      value: UserSortField.COMPANY,
                      label: "users.sort.company",
                    },
                  ],
                }}
                control={usersEndpoint.read.form.control}
                schema={userListRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            {/* Sort Order and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <EndpointFormField
                  name="sortOrder"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "users.sort_order.placeholder",
                    options: [
                      {
                        value: SortOrder.ASC,
                        label: "users.sort_order.asc",
                      },
                      {
                        value: SortOrder.DESC,
                        label: "users.sort_order.desc",
                      },
                    ],
                  }}
                  control={usersEndpoint.read.form.control}
                  schema={userListRequestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                {t("users.list.filters.clear")}
              </Button>
            </div>
          </Form>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {t("users.list.results.showing", {
              start:
                totalUsers === 0 ? 0 : (currentPage - 1) * currentLimit + 1,
              end: Math.min(currentPage * currentLimit, totalUsers),
              total: totalUsers,
            })}
          </div>
        </div>

        {/* Content */}
        {queryLoading && users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t("common.loading")}...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                {t("users.list.empty.message")}
              </p>
              <Button asChild>
                <Link href={`/${locale}/admin/users/create`}>
                  {t("users.admin.actions.add")}
                </Link>
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <UsersTable locale={locale} users={users} isLoading={queryLoading} />
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Link
                        href={`/${locale}/admin/users/${user.id}/edit`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

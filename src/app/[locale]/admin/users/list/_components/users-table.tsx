/**
 * Users Table Component
 * Table view for users list following leads pattern
 */

"use client";

import Link from "next/link";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type React from "react";
import { useCallback } from "react";

import type { UserListResponseOutput } from "@/app/api/[locale]/v1/core/users/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

type UserType = UserListResponseOutput["response"]["users"][number];

interface UsersTableProps {
  locale: CountryLanguage;
  users: UserType[];
  isLoading: boolean;
}

export function UsersTable({
  locale,
  users,
  isLoading,
}: UsersTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

  // Utility function for formatting dates
  const formatDate = useCallback(
    (date: Date | string | number | null): string => {
      if (!date) {
        return t("app.admin.users.admin.formatting.fallbacks.never");
      }
      const dateObj =
        typeof date === "string" || typeof date === "number"
          ? new Date(date)
          : date;
      return dateObj.toLocaleDateString(locale);
    },
    [locale, t],
  );

  // Get status configuration
  const getStatusConfig = (
    user: UserType,
  ): {
    variant: "default" | "destructive" | "secondary";
    label: TranslationKey;
  } => {
    if (!user.isActive) {
      return {
        variant: "destructive" as const,
        label: "app.admin.users.status.inactive",
      };
    }
    if (!user.emailVerified) {
      return {
        variant: "secondary" as const,
        label: "app.admin.users.status.emailUnverified",
      };
    }
    return {
      variant: "default" as const,
      label: "app.admin.users.status.active",
    };
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("app.admin.users.admin.table.name")}</TableHead>
              <TableHead>{t("app.admin.users.admin.table.email")}</TableHead>
              <TableHead>{t("app.admin.users.admin.table.status")}</TableHead>
              <TableHead>{t("app.admin.users.admin.table.created")}</TableHead>
              <TableHead className="text-right">
                {t("app.admin.users.admin.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {t("app.admin.users.list.empty.title")}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("app.admin.users.list.empty.description")}
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href={`/${locale}/admin/users/create`}>
                {t("app.admin.users.admin.actions.add")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("app.admin.users.admin.table.name")}
            </TableHead>
            <TableHead className="min-w-[200px]">
              {t("app.admin.users.admin.table.email")}
            </TableHead>
            <TableHead className="min-w-[120px]">
              {t("app.admin.users.admin.table.status")}
            </TableHead>
            <TableHead className="min-w-[120px]">
              {t("app.admin.users.admin.table.created")}
            </TableHead>
            <TableHead className="text-right min-w-[100px]">
              {t("app.admin.users.admin.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: UserType) => {
            const statusConfig = getStatusConfig(user);
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/${locale}/admin/users/${user.id}/edit`}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {user.privateName || user.publicName}
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig.variant}>
                    {t(statusConfig.label)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/${locale}/admin/users/${user.id}/edit`}>
                        {t("app.admin.users.admin.actions.edit")}
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

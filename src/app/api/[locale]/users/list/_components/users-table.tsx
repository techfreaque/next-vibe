/**
 * Users Table Component
 * Table view for users list following leads pattern
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link as NextLink } from "next-vibe-ui/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { H3, P } from "next-vibe-ui/ui/typography";
import type React from "react";
import { useCallback } from "react";

import type { UserListResponseOutput } from "@/app/api/[locale]/users/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

type UserType = UserListResponseOutput["response"]["users"][number];

interface UsersTableProps {
  locale: CountryLanguage;
  users: UserType[];
  isLoading: boolean;
}

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
      label: "app.admin.users.status.email_unverified",
    };
  }
  return {
    variant: "default" as const,
    label: "app.admin.users.status.active",
  };
};

export function UsersTable({ locale, users, isLoading }: UsersTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

  // Utility function for formatting dates
  const formatDate = useCallback(
    (date: Date | string | number | null): string => {
      if (!date) {
        return t("app.admin.users.formatting.fallbacks.never");
      }
      const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
      return dateObj.toLocaleDateString(locale);
    },
    [t, locale],
  );

  if (isLoading && users.length === 0) {
    return (
      <Div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("app.admin.users.table.name")}</TableHead>
              <TableHead>{t("app.admin.users.table.email")}</TableHead>
              <TableHead>{t("app.admin.users.table.status")}</TableHead>
              <TableHead>{t("app.admin.users.table.created")}</TableHead>
              <TableHead className="text-right">{t("app.admin.users.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Array.from callback requires first parameter */}
            {Array.from({ length: 5 }).map((unused, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <Div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <Div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <Div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <Div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Div>
    );
  }

  if (users.length === 0) {
    return (
      <Div className="rounded-md border">
        <Div className="p-8 text-center">
          <H3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {t("app.admin.users.list.empty.title")}
          </H3>
          <P className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("app.admin.users.list.empty.description")}
          </P>
          <Div className="mt-6">
            <Button asChild>
              <NextLink href={`/${locale}/admin/users/create`}>
                {t("app.admin.users.actions.add")}
              </NextLink>
            </Button>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">{t("app.admin.users.table.name")}</TableHead>
            <TableHead className="min-w-[200px]">{t("app.admin.users.table.email")}</TableHead>
            <TableHead className="min-w-[120px]">{t("app.admin.users.table.status")}</TableHead>
            <TableHead className="min-w-[120px]">{t("app.admin.users.table.created")}</TableHead>
            <TableHead className="text-right min-w-[100px]">
              {t("app.admin.users.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: UserType) => {
            const statusConfig = getStatusConfig(user);
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <NextLink
                    href={`/${locale}/admin/users/${user.id}/edit`}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {user.privateName || user.publicName}
                  </NextLink>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig.variant}>{t(statusConfig.label)}</Badge>
                </TableCell>
                <TableCell>
                  <Div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </Div>
                </TableCell>
                <TableCell className="text-right">
                  <Div className="flex items-center justify-end flex flex-row gap-2">
                    <Button asChild variant="outline" size="sm">
                      <NextLink href={`/${locale}/admin/users/${user.id}/edit`}>
                        {t("app.admin.users.actions.edit")}
                      </NextLink>
                    </Button>
                  </Div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Div>
  );
}

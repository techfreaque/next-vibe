/**
 * Custom Widget for Users List
 * Rich admin UI with navigation stack integration
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  UserPlus,
} from "next-vibe-ui/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import {
  SortOrder,
  SortOrderOptions,
  UserRoleFilter,
  UserSortField,
  UserSortFieldOptions,
  UserStatusFilter,
} from "../enum";
import type definition from "./definition";
import type { UserListResponseOutput } from "./definition";

type User = NonNullable<UserListResponseOutput["response"]>["users"][number];

interface CustomWidgetProps {
  field: {
    value: UserListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

function UserRow({
  user,
  locale,
  onView,
  onEdit,
  onDelete,
  onCreditHistory,
  t,
}: {
  user: User;
  locale: CountryLanguage;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreditHistory: (userId: string) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onView(user)}
    >
      <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {((user.privateName ?? user.email) || "?").slice(0, 2).toUpperCase()}
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">
            {user.privateName ?? user.email ?? "—"}
          </Span>
          {user.isActive ? (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {t("app.api.users.list.widget.statusActive")}
            </Span>
          ) : (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {t("app.api.users.list.widget.statusInactive")}
            </Span>
          )}
          {!user.emailVerified && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              {t("app.api.users.list.widget.statusUnverified")}
            </Span>
          )}
        </Div>

        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          {user.email && (
            <Span className="truncate max-w-[200px]">{user.email}</Span>
          )}
          {user.publicName && user.publicName !== user.privateName && (
            <Span>@{user.publicName}</Span>
          )}
        </Div>

        {user.createdAt && (
          <Div className="text-xs text-muted-foreground mt-0.5">
            {t("app.api.users.list.widget.joined")}{" "}
            {formatSimpleDate(user.createdAt, locale)}
          </Div>
        )}
      </Div>

      <Div
        className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onCreditHistory(user.id)}
          title={t("app.api.users.list.widget.creditHistory")}
        >
          <CreditCard className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onView(user)}
          title={t("app.api.users.list.widget.view")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(user)}
          title={t("app.api.users.list.widget.edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(user)}
          title={t("app.api.users.list.widget.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}

export function UsersListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const activeStatuses: (typeof UserStatusFilter)[keyof typeof UserStatusFilter][] =
    form?.watch("searchFilters.status") ?? [];
  const activeRoles: (typeof UserRoleFilter)[keyof typeof UserRoleFilter][] =
    form?.watch("searchFilters.role") ?? [];
  const sortBy: string =
    form?.watch("sortingOptions.sortBy") ?? UserSortField.CREATED_AT;
  const sortOrder: string =
    form?.watch("sortingOptions.sortOrder") ?? SortOrder.DESC;

  const users = field.value?.response?.users ?? [];
  const isLoading = field.value === null || field.value === undefined;

  const currentPage = field.value?.paginationInfo?.page ?? 1;
  const totalPages = field.value?.paginationInfo?.pageCount ?? 1;
  const totalCount = field.value?.paginationInfo?.totalCount ?? 0;

  const handleToggleStatus = useCallback(
    (
      status: (typeof UserStatusFilter)[keyof typeof UserStatusFilter],
    ): void => {
      const current: (typeof UserStatusFilter)[keyof typeof UserStatusFilter][] =
        form?.getValues("searchFilters.status") ?? [];
      const next = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      form?.setValue("searchFilters.status", next);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleToggleRole = useCallback(
    (role: (typeof UserRoleFilter)[keyof typeof UserRoleFilter]): void => {
      const current: (typeof UserRoleFilter)[keyof typeof UserRoleFilter][] =
        form?.getValues("searchFilters.role") ?? [];
      const next = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      form?.setValue("searchFilters.role", next);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleClearFilters = useCallback((): void => {
    form?.setValue("searchFilters.status", []);
    form?.setValue("searchFilters.role", []);
    form?.setValue("searchFilters.search", "");
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit]);

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue("sortingOptions.sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue("sortingOptions.sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      form?.setValue("paginationInfo.page", page);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleView = useCallback(
    (user: User): void => {
      router.push(`/${locale}/admin/users/${user.id}/edit`);
    },
    [router, locale],
  );

  const handleEdit = useCallback(
    (user: User): void => {
      router.push(`/${locale}/admin/users/${user.id}/edit`);
    },
    [router, locale],
  );

  const handleDelete = useCallback(
    (user: User): void => {
      router.push(`/${locale}/admin/users/${user.id}/edit`);
    },
    [router, locale],
  );

  const handleCreate = useCallback((): void => {
    router.push(`/${locale}/admin/users/create`);
  }, [router, locale]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewStats = useCallback((): void => {
    router.push(`/${locale}/admin/users/stats`);
  }, [router, locale]);

  const handleCreditHistory = useCallback(
    (userId: string): void => {
      router.push(`/${locale}/admin/users/${userId}/edit`);
    },
    [router, locale],
  );

  const statusChips: {
    label: string;
    value: (typeof UserStatusFilter)[keyof typeof UserStatusFilter];
  }[] = [
    {
      label: t("app.api.users.list.widget.statusActive"),
      value: UserStatusFilter.ACTIVE,
    },
    {
      label: t("app.api.users.list.widget.statusInactive"),
      value: UserStatusFilter.INACTIVE,
    },
    {
      label: t("app.api.users.list.widget.statusUnverified"),
      value: UserStatusFilter.EMAIL_UNVERIFIED,
    },
  ];

  const roleChips: {
    label: string;
    value: (typeof UserRoleFilter)[keyof typeof UserRoleFilter];
  }[] = [
    {
      label: t("app.api.users.list.widget.roleAdmin"),
      value: UserRoleFilter.ADMIN,
    },
    {
      label: t("app.api.users.list.widget.roleCustomer"),
      value: UserRoleFilter.CUSTOMER,
    },
    {
      label: t("app.api.users.list.widget.rolePartnerAdmin"),
      value: UserRoleFilter.PARTNER_ADMIN,
    },
    {
      label: t("app.api.users.list.widget.rolePartnerEmployee"),
      value: UserRoleFilter.PARTNER_EMPLOYEE,
    },
  ];

  const hasActiveFilters = activeStatuses.length > 0 || activeRoles.length > 0;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto">
          {t("app.api.users.list.get.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          title={t("app.api.users.list.widget.userStatistics")}
          className="gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline text-xs">
            {t("app.api.users.list.widget.stats")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.users.list.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleCreate}
          className="gap-1"
        >
          <UserPlus className="h-4 w-4" />
          {t("app.api.users.list.widget.newUser")}
        </Button>
      </Div>

      {/* Search */}
      <Div className="px-4 pt-3 pb-1">
        <TextFieldWidget
          fieldName={`${fieldName}.searchFilters.search`}
          field={children.searchFilters.children.search}
        />
      </Div>

      {/* Status filter chips */}
      <Div className="px-4 pt-2 pb-1 flex items-center gap-1.5 flex-wrap">
        <Span className="text-xs text-muted-foreground select-none">
          {t("app.api.users.list.widget.roleFilterLabel")}
        </Span>
        {statusChips.map((chip) => (
          <Button
            key={chip.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(chip.value)}
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
              activeStatuses.includes(chip.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
            )}
          >
            {chip.label}
          </Button>
        ))}
      </Div>

      {/* Role filter chips */}
      <Div className="px-4 pb-2 flex items-center gap-1.5 flex-wrap">
        <Span className="text-xs text-muted-foreground select-none">
          {t("app.api.users.list.widget.roleFilterLabel")}
        </Span>
        {roleChips.map((chip) => (
          <Button
            key={chip.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleToggleRole(chip.value)}
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
              activeRoles.includes(chip.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
            )}
          >
            {chip.label}
          </Button>
        ))}
      </Div>

      {/* Sort */}
      <Div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UserSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-8 text-xs w-auto min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SortOrderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto text-xs underline underline-offset-2 hover:text-foreground"
            onClick={handleClearFilters}
          >
            {t("app.api.users.list.widget.clearFilters")}
          </Button>
        )}
      </Div>

      {/* User list */}
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-340px))]">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : users.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                locale={locale}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreditHistory={handleCreditHistory}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {hasActiveFilters
              ? t("app.api.users.list.widget.noUsersMatchFilters")
              : t("app.api.users.list.widget.noUsersFound")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("app.api.users.list.widget.paginationPage")} {currentPage}{" "}
            {t("app.api.users.list.widget.paginationOf")} {totalPages}{" "}
            {t("app.api.users.list.widget.paginationSeparator")} {totalCount}{" "}
            {t("app.api.users.list.widget.paginationUsers")}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

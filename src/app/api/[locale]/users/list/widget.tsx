/**
 * Custom Widget for Users List
 * Rich admin UI with navigation stack integration
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
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
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import {
  SortOrder,
  SortOrderOptions,
  type SortOrderValue,
  UserRoleFilter,
  UserSortField,
  UserSortFieldOptions,
  type UserSortFieldValue,
  UserStatusFilter,
  type UserStatusFilterValue,
} from "../enum";
import { scopedTranslation as usersScopedTranslation } from "../i18n";
import type definition from "./definition";
import type { UserListResponseOutput } from "./definition";
import type { UsersListT } from "./i18n";

type User = NonNullable<UserListResponseOutput["response"]>["users"][number];

interface CustomWidgetProps {
  field: {
    value: UserListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

function UserRow({
  user,
  locale,
  onView,
  onEdit,
  onDelete,
  onCreditHistory,
  t,
  isTouch,
}: {
  user: User;
  locale: CountryLanguage;
  onView: (user: User) => void | Promise<void>;
  onEdit: (user: User) => void | Promise<void>;
  onDelete: (user: User) => void | Promise<void>;
  onCreditHistory: (userId: string) => void | Promise<void>;
  isTouch: boolean;
  t: UsersListT;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => void onView(user)}
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
              {t("widget.statusActive")}
            </Span>
          ) : (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {t("widget.statusInactive")}
            </Span>
          )}
          {!user.emailVerified && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              {t("widget.statusUnverified")}
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
            {t("widget.joined")} {formatSimpleDate(user.createdAt, locale)}
          </Div>
        )}
      </Div>

      <Div
        className={cn(
          "flex-shrink-0 flex gap-0.5",
          isTouch
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void onCreditHistory(user.id)}
          title={t("widget.creditHistory")}
        >
          <CreditCard className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void onView(user)}
          title={t("widget.view")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void onEdit(user)}
          title={t("widget.edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => void onDelete(user)}
          title={t("widget.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}

export function UsersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const isTouch = useTouchDevice();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const usersT = usersScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();

  const activeStatuses: (typeof UserStatusFilterValue)[] =
    form.watch("searchFilters.status") ?? [];
  const activeRoles: (typeof UserRoleFilter)[keyof typeof UserRoleFilter][] =
    form.watch("searchFilters.role") ?? [];
  const sortBy: typeof UserSortFieldValue =
    form.watch("sortingOptions.sortBy") ?? UserSortField.CREATED_AT;
  const sortOrder: typeof SortOrderValue =
    form.watch("sortingOptions.sortOrder") ?? SortOrder.DESC;

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
    (value: typeof UserSortFieldValue): void => {
      form?.setValue("sortingOptions.sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: typeof SortOrderValue): void => {
      form.setValue("sortingOptions.sortOrder", value);
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
    async (user: User): Promise<void> => {
      const viewDefinitions = await import("../view/definition");
      navigate(viewDefinitions.default.GET, {
        data: { userId: user.id },
      });
    },
    [navigate],
  );

  const handleEdit = useCallback(
    async (user: User): Promise<void> => {
      const userDefinitions = await import("../user/[id]/definition");
      navigate(userDefinitions.default.PUT, {
        urlPathParams: { id: user.id },
        prefillFromGet: true,
        getEndpoint: userDefinitions.default.GET,
        popNavigationOnSuccess: 1,
      });
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (user: User): Promise<void> => {
      const userDefinitions = await import("../user/[id]/definition");
      navigate(userDefinitions.default.DELETE, {
        urlPathParams: { id: user.id },
        popNavigationOnSuccess: 1,
        renderInModal: true,
      });
    },
    [navigate],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef = await import("../create/definition");
      navigate(createDef.default.POST);
    })();
  }, [navigate]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef = await import("../stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

  const handleCreditHistory = useCallback(
    async (userId: string): Promise<void> => {
      const viewDefinitions = await import("../view/definition");
      navigate(viewDefinitions.default.GET, {
        data: { userId },
      });
    },
    [navigate],
  );

  const statusChips: {
    label: string;
    value: (typeof UserStatusFilter)[keyof typeof UserStatusFilter];
  }[] = [
    {
      label: t("widget.statusActive"),
      value: UserStatusFilter.ACTIVE,
    },
    {
      label: t("widget.statusInactive"),
      value: UserStatusFilter.INACTIVE,
    },
    {
      label: t("widget.statusUnverified"),
      value: UserStatusFilter.EMAIL_UNVERIFIED,
    },
  ];

  const roleChips: {
    label: string;
    value: (typeof UserRoleFilter)[keyof typeof UserRoleFilter];
  }[] = [
    {
      label: t("widget.roleAdmin"),
      value: UserRoleFilter.ADMIN,
    },
    {
      label: t("widget.roleCustomer"),
      value: UserRoleFilter.CUSTOMER,
    },
    {
      label: t("widget.rolePartnerAdmin"),
      value: UserRoleFilter.PARTNER_ADMIN,
    },
    {
      label: t("widget.rolePartnerEmployee"),
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
          {t("get.title")}
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
          title={t("widget.userStatistics")}
          className="gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline text-xs">{t("widget.stats")}</Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
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
          {t("widget.newUser")}
        </Button>
      </Div>

      {/* Search */}
      <Div className="px-4 pt-3 pb-1">
        <TextFieldWidget
          fieldName={"searchFilters.search"}
          field={children.searchFilters.children.search}
        />
      </Div>

      {/* Status filter chips */}
      <Div className="px-4 pt-2 pb-1 flex items-center gap-1.5 flex-wrap">
        <Span className="text-xs text-muted-foreground select-none">
          {t("widget.roleFilterLabel")}
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
          {t("widget.roleFilterLabel")}
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
                {usersT(opt.label)}
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
                {usersT(opt.label)}
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
            {t("widget.clearFilters")}
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
                isTouch={isTouch}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {hasActiveFilters
              ? t("widget.noUsersMatchFilters")
              : t("widget.noUsersFound")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("widget.paginationPage")} {currentPage}{" "}
            {t("widget.paginationOf")} {totalPages}{" "}
            {t("widget.paginationSeparator")} {totalCount}{" "}
            {t("widget.paginationUsers")}
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

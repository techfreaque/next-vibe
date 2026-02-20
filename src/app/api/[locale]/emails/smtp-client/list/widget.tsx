/**
 * Custom Widget for SMTP Accounts List
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Server,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { SortOrder, SortOrderOptions } from "../../messages/enum";
import {
  CampaignTypeFilter,
  CampaignTypeFilterOptions,
  SmtpAccountSortField,
  SmtpAccountSortFieldOptions,
  SmtpAccountStatus,
  SmtpAccountStatusFilter,
  SmtpAccountStatusFilterOptions,
  SmtpHealthStatus,
  SmtpHealthStatusFilter,
  SmtpHealthStatusFilterOptions,
} from "../enum";
import type definition from "./definition";
import type { SmtpAccountsListGETResponseOutput } from "./definition";

type SmtpAccount = NonNullable<
  SmtpAccountsListGETResponseOutput["accounts"]
>[number];

interface CustomWidgetProps {
  field: {
    value: SmtpAccountsListGETResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  [SmtpAccountStatus.ACTIVE]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [SmtpAccountStatus.INACTIVE]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  [SmtpAccountStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [SmtpAccountStatus.TESTING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

const HEALTH_COLORS: Record<string, string> = {
  [SmtpHealthStatus.HEALTHY]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [SmtpHealthStatus.UNHEALTHY]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [SmtpHealthStatus.UNKNOWN]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  [SmtpHealthStatus.DEGRADED]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

function AccountRow({
  account,
  onEdit,
  t,
}: {
  account: SmtpAccount;
  onEdit: (account: SmtpAccount) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  const statusColor =
    STATUS_COLORS[account.status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  const healthColor =
    account.healthCheckStatus !== null &&
    account.healthCheckStatus !== undefined
      ? (HEALTH_COLORS[account.healthCheckStatus] ?? "")
      : "";

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onEdit(account)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <Server className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{account.name}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              statusColor,
            )}
          >
            {t(account.status)}
          </Span>
          {account.healthCheckStatus !== null &&
            account.healthCheckStatus !== undefined && (
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  healthColor,
                )}
              >
                {t(account.healthCheckStatus)}
              </Span>
            )}
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>
            {t("app.api.emails.smtpClient.list.widget.priority")}:{" "}
            {account.priority}
          </Span>
          <Span>
            {t("app.api.emails.smtpClient.list.widget.sent")}:{" "}
            {account.totalEmailsSent}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}

export function SmtpAccountsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const sortBy: string =
    form?.watch("sortBy") ?? SmtpAccountSortField.CREATED_AT;
  const sortOrder: string = form?.watch("sortOrder") ?? SortOrder.DESC;
  const activeStatus: string =
    form?.watch("status") ?? SmtpAccountStatusFilter.ANY;
  const activeHealthStatus: string =
    form?.watch("healthStatus") ?? SmtpHealthStatusFilter.ANY;
  const activeCampaignType: string =
    form?.watch("campaignType") ?? CampaignTypeFilter.ANY;
  const searchValue: string = form?.watch("search") ?? "";
  const currentPage: number = form?.watch("page") ?? 1;
  const limit: number = form?.watch("limit") ?? 10;

  const accounts = useMemo(
    () => field.value?.accounts ?? [],
    [field.value?.accounts],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.pagination?.total ?? 0;
  const totalPages =
    field.value?.pagination?.totalPages ?? (Math.ceil(total / limit) || 1);

  const handleEdit = useCallback(
    (account: SmtpAccount): void => {
      router.push(`/${locale}/admin/emails/smtp/edit/${account.id}`);
    },
    [router, locale],
  );

  const handleCreate = useCallback((): void => {
    router.push(`/${locale}/admin/emails/smtp/create`);
  }, [router, locale]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue("sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue("sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleStatusChange = useCallback(
    (value: string): void => {
      form?.setValue("status", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleHealthStatusChange = useCallback(
    (value: string): void => {
      form?.setValue("healthStatus", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleCampaignTypeChange = useCallback(
    (value: string): void => {
      form?.setValue("campaignType", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      form?.setValue("page", page);
      if (onSubmit) {
        onSubmit();
      } else {
        endpointMutations?.read?.refetch?.();
      }
    },
    [form, onSubmit, endpointMutations],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <Span className="font-semibold text-base">
          {t("app.api.emails.smtpClient.list.title")}
          {total > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.emails.smtpClient.list.widget.refresh")}
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
          <Plus className="h-4 w-4" />
          {t("app.api.emails.smtpClient.list.widget.create")}
        </Button>
      </Div>

      {/* Search + sort */}
      <Div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap">
        <Div className="flex-1 min-w-[160px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchValue}
            onChange={(e) => {
              form?.setValue("search", e.target.value);
              if (onSubmit) {
                onSubmit();
              }
            }}
            placeholder={t(
              "app.api.emails.smtpClient.list.widget.searchPlaceholder",
            )}
            className="pl-9 h-9"
          />
        </Div>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 w-[140px] flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SmtpAccountSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-9 w-[90px] flex-shrink-0">
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
      </Div>

      {/* Filter row: status chips + health + campaign type selects */}
      <Div className="px-4 py-2 flex items-center gap-2 border-b flex-wrap">
        {/* Status chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {SmtpAccountStatusFilterOptions.map((opt) => {
            const isActive = opt.value === activeStatus;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(opt.value)}
                className={
                  isActive
                    ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                    : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }
              >
                {t(opt.label)}
              </Button>
            );
          })}
        </Div>
        <Div className="flex-1" />
        {/* Health + campaign selects */}
        <Select
          value={activeHealthStatus}
          onValueChange={handleHealthStatusChange}
        >
          <SelectTrigger className="h-8 w-[110px] flex-shrink-0 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SmtpHealthStatusFilterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={activeCampaignType}
          onValueChange={handleCampaignTypeChange}
        >
          <SelectTrigger className="h-8 w-[130px] flex-shrink-0 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CampaignTypeFilterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {/* Account list */}
      <Div className="px-4 py-3">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : accounts.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {accounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                onEdit={handleEdit}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            <Div className="mb-4">
              {t("app.api.emails.smtpClient.list.widget.emptyState")}
            </Div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreate}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {t("app.api.emails.smtpClient.list.widget.create")}
            </Button>
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {currentPage} / {totalPages}
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

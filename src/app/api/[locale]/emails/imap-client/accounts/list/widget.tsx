/**
 * Custom Widget for IMAP Accounts List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  RefreshCw,
} from "next-vibe-ui/ui/icons";
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
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import {
  ImapAccountSortField,
  ImapAccountSortFieldOptions,
  ImapAccountStatusFilter,
  ImapAccountStatusFilterOptions,
  ImapSyncStatus,
  SortOrder,
  SortOrderOptions,
} from "../../enum";
import type definition from "./definition";
import type { ImapAccountsListResponseOutput } from "./definition";

type ImapAccount = NonNullable<
  ImapAccountsListResponseOutput["accounts"]
>[number];

interface CustomWidgetProps {
  field: {
    value: ImapAccountsListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const SYNC_STATUS_COLORS: Record<string, string> = {
  [ImapSyncStatus.SYNCED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [ImapSyncStatus.SYNCING]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [ImapSyncStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [ImapSyncStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function AccountRow({
  account,
  onEdit,
  t,
}: {
  account: ImapAccount;
  onEdit: (account: ImapAccount) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  const syncColor =
    SYNC_STATUS_COLORS[account.syncStatus] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onEdit(account)}
    >
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{account.name}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              syncColor,
            )}
          >
            {t(account.syncStatus)}
          </Span>
          {!account.enabled && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {t("app.api.emails.imapClient.accounts.list.disabled")}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>{account.email}</Span>
          <Span>
            {account.host}:{account.port}
          </Span>
          {account.lastSyncAt !== null && account.lastSyncAt !== undefined && (
            <Span>
              {t("app.api.emails.imapClient.accounts.list.lastSync")}:{" "}
              {account.lastSyncAt}
            </Span>
          )}
        </Div>
      </Div>
    </Div>
  );
}

export function ImapAccountsListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const sortBy: string =
    form?.watch("sortBy") ?? ImapAccountSortField.CREATED_AT;
  const sortOrder: string = form?.watch("sortOrder") ?? SortOrder.DESC;
  const activeStatus: string =
    form?.watch("status") ?? ImapAccountStatusFilter.ALL;
  const currentPage: number = form?.watch("page") ?? 1;
  const limit: number = form?.watch("limit") ?? 20;

  const accounts = useMemo(
    () => field.value?.accounts ?? [],
    [field.value?.accounts],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.pagination?.total ?? 0;
  const totalPages =
    field.value?.pagination?.totalPages ?? (Math.ceil(total / limit) || 1);

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

  const handleEdit = useCallback(
    (account: ImapAccount): void => {
      void (async (): Promise<void> => {
        const editDef = await import("../[id]/definition");
        navigate(editDef.default.PUT, {
          urlPathParams: { id: account.id },
          prefillFromGet: true,
          getEndpoint: editDef.default.GET,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef = await import("../create/definition");
      navigate(createDef.default.POST, { popNavigationOnSuccess: 1 });
    })();
  }, [navigate]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.accounts.list.title")}
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
          title={t("app.api.emails.imapClient.accounts.list.refresh")}
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
          {t("app.api.emails.imapClient.accounts.list.create")}
        </Button>
      </Div>

      {/* Search + sort */}
      <Div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap">
        <Div className="flex-1 min-w-[160px]">
          <TextFieldWidget
            fieldName={`${fieldName}.search`}
            field={children.search}
          />
        </Div>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ImapAccountSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-9 min-w-[80px]">
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

      {/* Status filter chips */}
      <Div className="px-4 pb-2 flex items-center gap-1.5 flex-wrap">
        {ImapAccountStatusFilterOptions.map((opt) => {
          const isActive = opt.value === activeStatus;
          return (
            <Button
              key={opt.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form?.setValue("status", opt.value);
                if (onSubmit) {
                  onSubmit();
                }
              }}
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
              {t("app.api.emails.imapClient.accounts.list.empty")}
            </Div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreate}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {t("app.api.emails.imapClient.accounts.list.create")}
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

/**
 * Messaging Accounts List Widget
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
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

import {
  MessageChannel,
  MessageChannelFilter,
  MessageChannelFilterOptions,
  MessagingAccountStatus,
} from "../../enum";
import type definition from "./definition";
import type { MessagingAccountsListGETResponseOutput } from "./definition";

type MessagingAccount = NonNullable<
  MessagingAccountsListGETResponseOutput["accounts"]
>[number];

interface CustomWidgetProps {
  field: {
    value: MessagingAccountsListGETResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  [MessagingAccountStatus.ACTIVE]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [MessagingAccountStatus.INACTIVE]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  [MessagingAccountStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [MessagingAccountStatus.TESTING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

const CHANNEL_COLORS: Record<string, string> = {
  [MessageChannel.SMS]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [MessageChannel.WHATSAPP]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [MessageChannel.TELEGRAM]:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  [MessageChannel.EMAIL]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

function AccountRow({
  account,
  onEdit,
  t,
}: {
  account: MessagingAccount;
  onEdit: (account: MessagingAccount) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  const statusColor =
    STATUS_COLORS[account.status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  const channelColor =
    CHANNEL_COLORS[account.channel] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onEdit(account)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageCircle className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{account.name}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              channelColor,
            )}
          >
            {t(account.channel)}
          </Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              statusColor,
            )}
          >
            {t(account.status)}
          </Span>
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>{account.provider}</Span>
          {account.fromId !== null && account.fromId !== undefined && (
            <Span className="truncate max-w-[160px]">{account.fromId}</Span>
          )}
          <Span>
            {t("app.api.emails.messaging.accounts.list.widget.sent")}:{" "}
            {account.messagesSentTotal}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}

export function MessagingAccountsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const activeChannel: string =
    form?.watch("channel") ?? MessageChannelFilter.ANY;
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
    (account: MessagingAccount): void => {
      router.push(
        `/${locale}/admin/emails/messaging/accounts/${account.id}/edit`,
      );
    },
    [router, locale],
  );

  const handleCreate = useCallback((): void => {
    router.push(`/${locale}/admin/emails/messaging/accounts/create`);
  }, [router, locale]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleChannelTab = useCallback(
    (value: string): void => {
      form?.setValue("channel", value);
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
      }
    },
    [form, onSubmit],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <Span className="font-semibold text-base">
          {t("app.api.emails.messaging.accounts.list.title")}
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
          title={t("app.api.emails.messaging.accounts.list.widget.refresh")}
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
          {t("app.api.emails.messaging.accounts.list.widget.create")}
        </Button>
      </Div>

      {/* Channel filter tabs */}
      <Div className="flex items-center gap-1 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
        {MessageChannelFilterOptions.map((opt) => {
          const isActive = activeChannel === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleChannelTab(opt.value)}
              className={cn(
                "flex-shrink-0 inline-flex items-center px-3 py-1 h-7 rounded-full text-xs font-medium border transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {t(opt.label)}
            </Button>
          );
        })}
      </Div>

      {/* Search */}
      <Div className="px-4 pt-2 pb-2 flex items-center gap-2 border-b">
        <Div className="flex-1 relative">
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
              "app.api.emails.messaging.accounts.list.widget.searchPlaceholder",
            )}
            className="pl-9 h-9"
          />
        </Div>
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
              {t("app.api.emails.messaging.accounts.list.widget.emptyState")}
            </Div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreate}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {t("app.api.emails.messaging.accounts.list.widget.create")}
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

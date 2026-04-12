/**
 * Unified Messenger Accounts List Widget
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import messengerAccountEditDefinition from "../edit/[id]/definition";
import type { MessengerChannelFilterValue } from "../enum";
import {
  MessengerAccountStatus,
  MessengerChannelFilter,
  MessengerChannelFilterOptions,
} from "../enum";
import { scopedTranslation as accountsScopedTranslation } from "../i18n";
import messengerAccountCreateDefinition from "../create/definition";
import type definition from "./definition";
import type { MessengerAccountsListGETResponseOutput } from "./definition";
import { MessageChannel } from "../enum";

type MessengerAccount = NonNullable<
  MessengerAccountsListGETResponseOutput["accounts"]
>[number];

interface CustomWidgetProps {
  field: {
    value: MessengerAccountsListGETResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

const STATUS_COLORS: Record<string, string> = {
  [MessengerAccountStatus.ACTIVE]: "bg-success/10 text-success",
  [MessengerAccountStatus.INACTIVE]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  [MessengerAccountStatus.ERROR]: "bg-destructive/10 text-destructive",
  [MessengerAccountStatus.TESTING]: "bg-warning/10 text-warning",
};

const CHANNEL_COLORS: Record<string, string> = {
  [MessageChannel.EMAIL]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [MessageChannel.SMS]: "bg-info/10 text-info",
  [MessageChannel.WHATSAPP]: "bg-success/10 text-success",
  [MessageChannel.TELEGRAM]:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
};

function AccountRow({
  account,
  onEdit,
  onDelete,
  t,
}: {
  account: MessengerAccount;
  onEdit: (account: MessengerAccount) => void;
  onDelete: (account: MessengerAccount) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const scopedT = accountsScopedTranslation.scopedT(locale).t;

  const statusColor =
    STATUS_COLORS[account.status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  const channelColor =
    CHANNEL_COLORS[account.channel] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
      <Div
        className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
        onClick={() => onEdit(account)}
      >
        <Server className="h-4 w-4 text-primary" />
      </Div>

      <Div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onEdit(account)}
      >
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{account.name}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              channelColor,
            )}
          >
            {scopedT(account.channel)}
          </Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              statusColor,
            )}
          >
            {scopedT(account.status)}
          </Span>
          {account.isDefault && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {t("response.account.isDefault")}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>{scopedT(account.provider)}</Span>
          {account.smtpFromEmail && (
            <Span className="truncate max-w-[160px]">
              {account.smtpFromEmail}
            </Span>
          )}
          {account.fromId && (
            <Span className="truncate max-w-[160px]">{account.fromId}</Span>
          )}
          <Span>
            {t("response.account.messagesSentTotal")}:{" "}
            {account.messagesSentTotal}
          </Span>
        </Div>
      </Div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(account);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        title={t("widget.deleteConfirm")}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Div>
  );
}

export function MessengerAccountsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const t = useWidgetTranslation<typeof definition.GET>();
  const enumT = accountsScopedTranslation.scopedT(locale).t;
  const onSubmit = useWidgetOnSubmit();

  const activeChannel: typeof MessengerChannelFilterValue =
    form.watch("channel") ?? MessengerChannelFilter.ANY;
  const searchValue = form.watch("search") ?? "";
  const currentPage = form.watch("page") ?? 1;
  const limit = form.watch("limit") ?? 20;

  const accounts = useMemo(
    () => field.value?.accounts ?? [],
    [field.value?.accounts],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.pagination?.total ?? 0;
  const totalPages =
    field.value?.pagination?.totalPages ?? (Math.ceil(total / limit) || 1);

  const handleEdit = useCallback(
    (account: MessengerAccount): void => {
      navigate(messengerAccountEditDefinition.PUT, {
        urlPathParams: { id: account.id },
        prefillFromGet: true,
        getEndpoint: messengerAccountEditDefinition.GET,
        popNavigationOnSuccess: 1,
      });
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (account: MessengerAccount): void => {
      navigate(messengerAccountEditDefinition.DELETE, {
        urlPathParams: { id: account.id },
        popNavigationOnSuccess: 1,
        renderInModal: true,
      });
    },
    [navigate],
  );

  const handleCreate = useCallback((): void => {
    navigate(messengerAccountCreateDefinition.POST);
  }, [navigate]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleGraphs = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef =
        await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition");
      navigate(graphsDef.default.GET, {
        data: { search: "messenger" },
      });
    })();
  }, [navigate]);

  const handleChannelTab = useCallback(
    (value: string): void => {
      form.setValue("channel", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      form.setValue("page", page);
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
          {t("title")}
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
          onClick={handleGraphs}
          title={t("widget.graphs")}
          className="gap-1"
        >
          <GitBranch className="h-4 w-4" />
          <Span className="hidden sm:inline text-xs">{t("widget.graphs")}</Span>
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
          <Plus className="h-4 w-4" />
          {t("widget.create")}
        </Button>
      </Div>

      {/* Channel filter tabs */}
      <Div className="flex items-center gap-1 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
        {MessengerChannelFilterOptions.map((opt) => {
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
              {enumT(opt.label)}
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
              form.setValue("search", e.target.value);
              if (onSubmit) {
                onSubmit();
              }
            }}
            placeholder={t("widget.searchPlaceholder")}
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
                onDelete={handleDelete}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            <Div className="mb-4">{t("widget.emptyState")}</Div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreate}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {t("widget.create")}
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

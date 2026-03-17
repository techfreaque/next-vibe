/**
 * Custom Widget for Email Messages List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { MessageCircle } from "next-vibe-ui/ui/icons/MessageCircle";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Send } from "next-vibe-ui/ui/icons/Send";
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

import { scopedTranslation as messagesScopedTranslation } from "@/app/api/[locale]/messenger/messages/i18n";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { MessengerChannelFilterValue } from "../../accounts/enum";
import {
  MessageChannel,
  MessengerChannelFilter,
  MessengerChannelFilterOptions,
} from "../../accounts/enum";
import type {
  MessageSortFieldValue,
  MessageStatusFilterValue,
  MessageTypeFilterValue,
  SortOrderValue,
} from "../enum";
import {
  MessageSortField,
  MessageSortFieldOptions,
  MessageStatus,
  MessageStatusFilter,
  MessageTypeFilter,
  MessageTypeFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";
import type definition from "./definition";
import type { EmailsListResponseOutput } from "./definition";

type EmailItem = NonNullable<EmailsListResponseOutput["emails"]>[number];

interface CustomWidgetProps {
  field: {
    value: EmailsListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

const STATUS_STYLE: Record<string, string> = {
  [MessageStatus.SENT]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [MessageStatus.DELIVERED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [MessageStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [MessageStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [MessageStatus.BOUNCED]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [MessageStatus.OPENED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [MessageStatus.CLICKED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const STATUS_TABS = [
  {
    label: "widget.tabs.all",
    value: MessageStatusFilter.ANY,
  },
  {
    label: "widget.tabs.sent",
    value: MessageStatusFilter.SENT,
  },
  {
    label: "widget.tabs.delivered",
    value: MessageStatusFilter.DELIVERED,
  },
  {
    label: "widget.tabs.opened",
    value: MessageStatusFilter.OPENED,
  },
  {
    label: "widget.tabs.failed",
    value: MessageStatusFilter.FAILED,
  },
  {
    label: "widget.tabs.bounced",
    value: MessageStatusFilter.BOUNCED,
  },
] as const;

const CHANNEL_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [MessageChannel.EMAIL]: Mail,
  [MessageChannel.SMS]: Send,
  [MessageChannel.WHATSAPP]: MessageCircle,
  [MessageChannel.TELEGRAM]: MessageCircle,
};

function EmailRow({
  email,
  onView,
  t,
  messagesT,
}: {
  email: EmailItem;
  onView: (email: EmailItem) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  messagesT: ReturnType<typeof messagesScopedTranslation.scopedT>["t"];
}): React.JSX.Element {
  const status = email.emailCore.status;
  const channel = email.emailCore.channel ?? MessageChannel.EMAIL;
  const statusClassName =
    STATUS_STYLE[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  const ChannelIcon = CHANNEL_ICON[channel] ?? Mail;

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onView(email)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <ChannelIcon className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm truncate max-w-[240px]">
            {email.emailCore.subject}
          </Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              statusClassName,
            )}
          >
            {messagesT(status)}
          </Span>
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
          <Span className="truncate max-w-[180px]">
            {t("widget.to")}: {email.emailParties.recipient.recipientEmail}
          </Span>
          {email.emailMetadata.type !== null &&
            email.emailMetadata.type !== undefined && (
              <Span className="flex-shrink-0">
                {messagesT(email.emailMetadata.type)}
              </Span>
            )}
        </Div>
      </Div>

      <Div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
        {email.technicalDetails.retryCount > 0 && (
          <Span>
            {t("widget.retries")}: {email.technicalDetails.retryCount}
          </Span>
        )}
        {email.emailEngagement.openedAt !== null &&
          email.emailEngagement.openedAt !== undefined && (
            <Div style={{ color: "#22c55e", fontSize: "11px" }}>
              {t("widget.opened")}
            </Div>
          )}
        {email.emailEngagement.clickedAt !== null &&
          email.emailEngagement.clickedAt !== undefined && (
            <Div style={{ color: "#8b5cf6", fontSize: "11px" }}>
              {t("widget.clicked")}
            </Div>
          )}
      </Div>
    </Div>
  );
}

export function EmailsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const messagesT = messagesScopedTranslation.scopedT(locale).t;
  const { push: navigate } = useWidgetNavigation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const activeStatus: typeof MessageStatusFilterValue =
    form.watch("filters.status") ?? MessageStatusFilter.ANY;

  const emails = useMemo(
    () => field.value?.emails ?? [],
    [field.value?.emails],
  );
  const pagination = field.value?.pagination;
  const isLoading = field.value === null || field.value === undefined;

  const statusCounts = useMemo((): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const email of emails) {
      const s = email.emailCore.status;
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return counts;
  }, [emails]);

  const handleView = useCallback(
    (email: EmailItem): void => {
      void (async (): Promise<void> => {
        const msgDef = await import("../[id]/definition");
        navigate(msgDef.default.GET, {
          urlPathParams: { id: email.emailCore.id },
        });
      })();
    },
    [navigate],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef = await import("../stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

  const handleStatusTab = useCallback(
    (
      status: (typeof MessageStatusFilter)[keyof typeof MessageStatusFilter],
    ): void => {
      form.setValue("filters.status", status);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (newPage: number): void => {
      form.setValue("displayOptions.page", newPage);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortByChange = useCallback(
    (value: string): void => {
      form.setValue("displayOptions.sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form.setValue("displayOptions.sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleTypeFilter = useCallback(
    (value: string): void => {
      form.setValue("filters.type", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleChannelFilter = useCallback(
    (value: string): void => {
      form.setValue("filters.channel", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const activeChannel: typeof MessengerChannelFilterValue =
    form.watch("filters.channel") ?? MessengerChannelFilter.ANY;

  const sortBy: typeof MessageSortFieldValue =
    form.watch("displayOptions.sortBy") ?? MessageSortField.CREATED_AT;
  const sortOrder: typeof SortOrderValue =
    form.watch("displayOptions.sortOrder") ?? SortOrder.DESC;
  const activeType: typeof MessageTypeFilterValue =
    form.watch("filters.type") ?? MessageTypeFilter.ANY;

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

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
          onClick={handleStats}
          className="gap-1"
        >
          <Span className="hidden sm:inline">{t("widget.stats")}</Span>
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
      </Div>

      {/* Status filter tabs — scrollable */}
      <Div className="flex items-center gap-1 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count =
            tab.value === MessageStatusFilter.ANY
              ? emails.length
              : (statusCounts[tab.value] ?? 0);
          return (
            <Button
              key={tab.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleStatusTab(tab.value)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 h-7 rounded-full text-xs font-medium transition-colors border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {t(tab.label)}
              {count > 0 && (
                <Span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-semibold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </Span>
              )}
            </Button>
          );
        })}
      </Div>

      {/* Type filter chips — scrollable */}
      <Div className="flex items-center gap-1 px-4 pb-1 overflow-x-auto scrollbar-none">
        {MessageTypeFilterOptions.map((tab) => {
          const isActive = activeType === tab.value;
          return (
            <Button
              key={tab.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleTypeFilter(tab.value)}
              className={cn(
                "flex-shrink-0 inline-flex items-center px-2.5 py-1 h-7 rounded-full text-xs font-medium border transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {messagesT(tab.label)}
            </Button>
          );
        })}
      </Div>

      {/* Channel filter chips — scrollable */}
      <Div className="flex items-center gap-1 px-4 pb-1 overflow-x-auto scrollbar-none">
        {MessengerChannelFilterOptions.map((tab) => {
          const isActive = activeChannel === tab.value;
          return (
            <Button
              key={tab.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleChannelFilter(tab.value)}
              className={cn(
                "flex-shrink-0 inline-flex items-center px-2.5 py-1 h-7 rounded-full text-xs font-medium border transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {t(tab.label)}
            </Button>
          );
        })}
      </Div>

      {/* Search + sort */}
      <Div className="px-4 pt-2 pb-2 flex items-center gap-2 border-b">
        <Div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={form.watch("filters.search") ?? ""}
            onChange={(e) => {
              form.setValue("filters.search", e.target.value);
              if (onSubmit) {
                onSubmit();
              }
            }}
            placeholder={t("widget.searchPlaceholder")}
            className="pl-9 h-9"
          />
        </Div>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 w-[140px] flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MessageSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {messagesT(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-9 w-[110px] flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SortOrderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {messagesT(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {/* Email list */}
      <Div className="px-4 pb-2">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : emails.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {emails.map((email) => (
              <EmailRow
                key={email.emailCore.id}
                email={email}
                onView={handleView}
                t={t}
                messagesT={messagesT}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {activeStatus !== MessageStatusFilter.ANY
              ? t("widget.emptyFiltered")
              : t("widget.emptyState")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("widget.page")} {currentPage} / {totalPages}
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

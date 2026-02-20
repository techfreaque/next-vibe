/**
 * Gmail-style Widget for IMAP Messages List
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Mail,
  MailOpen,
  Paperclip,
  RefreshCw,
  Search,
  Square,
  SquareCheck,
  Star,
  Trash2,
  X,
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { BulkMessageActionValue } from "../../enum";
import {
  BulkMessageAction,
  ImapMessageSortField,
  ImapMessageSortFieldOptions,
  ImapMessageStatusFilter,
  ImapMessageStatusFilterOptions,
  SortOrder,
} from "../../enum";
import type definition from "./definition";
import type { ImapMessagesListGetResponseOutput } from "./definition";

type ImapMessage = NonNullable<
  ImapMessagesListGetResponseOutput["messages"]
>[number];

interface CustomWidgetProps {
  field: {
    value: ImapMessagesListGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Get initials from sender name or email for avatar
 */
function getSenderInitials(
  name: string | null | undefined,
  email: string,
): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

/**
 * Format a date/ISO string into a compact Gmail-style label.
 * - Same day: "HH:MM"
 * - This year: "Jan 15"
 * - Older: "15/01/23"
 */
function formatMessageDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  if (sameYear) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

/** Deterministic hue from a string for avatar background */
function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function MessageRow({
  message,
  isSelected,
  onToggle,
  onView,
}: {
  message: ImapMessage;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onView: (message: ImapMessage) => void;
}): React.JSX.Element {
  const hue = stringToHue(message.senderEmail);
  const initials = getSenderInitials(message.senderName, message.senderEmail);
  const dateLabel = formatMessageDate(message.sentAt);
  const senderDisplay = message.senderName ?? message.senderEmail;
  const isUnread = !message.isRead;

  return (
    <Div
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b last:border-b-0",
        isSelected
          ? "bg-primary/10"
          : isUnread
            ? "bg-background font-medium hover:bg-accent/50"
            : "bg-muted/20 hover:bg-accent/50",
      )}
    >
      {/* Checkbox */}
      <Div
        className="flex-shrink-0 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(message.id);
        }}
      >
        {isSelected ? (
          <SquareCheck className="h-4 w-4 text-primary" />
        ) : (
          <Square className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        )}
      </Div>

      {/* Avatar */}
      <Div
        className="h-9 w-9 rounded-full flex-shrink-0 overflow-hidden"
        onClick={() => onView(message)}
      >
        <Div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: `hsl(${hue}, 60%, 45%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 600,
            color: "white",
            userSelect: "none",
          }}
        >
          {initials}
        </Div>
      </Div>

      {/* Sender */}
      <Div
        className={cn(
          "w-40 flex-shrink-0 text-sm truncate",
          isUnread ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
        onClick={() => onView(message)}
      >
        {senderDisplay}
      </Div>

      {/* Subject + snippet */}
      <Div
        className="flex-1 min-w-0 flex items-center gap-1.5 truncate text-sm"
        onClick={() => onView(message)}
      >
        <Span
          className={cn(
            isUnread ? "font-semibold text-foreground" : "text-foreground",
          )}
        >
          {message.subject || "(no subject)"}
        </Span>
        {message.hasAttachments && (
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </Div>

      {/* Flag indicator */}
      <Div className="flex-shrink-0 w-6 flex justify-center">
        {message.isFlagged ? (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        ) : (
          <Star className="h-4 w-4 text-transparent group-hover:text-muted-foreground/30" />
        )}
      </Div>

      {/* Date */}
      <Div
        className={cn(
          "flex-shrink-0 text-xs min-w-[52px] text-right",
          isUnread ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
        onClick={() => onView(message)}
      >
        {dateLabel}
      </Div>
    </Div>
  );
}

export function ImapMessagesListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations, locale, logger, user } = useWidgetContext();
  const t = useWidgetTranslation();
  const widgetLocale = useWidgetLocale();
  const router = useRouter();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [showDateFilters, setShowDateFilters] = useState(false);

  const sortBy: string = form?.watch("sortBy") ?? ImapMessageSortField.SENT_AT;
  const sortOrder: string = form?.watch("sortOrder") ?? SortOrder.DESC;
  const currentPage: number = form?.watch("page") ?? 1;
  const limit: number = form?.watch("limit") ?? 20;
  const searchValue: string = form?.watch("search") ?? "";
  const dateFromValue: string = form?.watch("dateFrom") ?? "";
  const dateToValue: string = form?.watch("dateTo") ?? "";

  const messages = useMemo(
    () => field.value?.messages ?? [],
    [field.value?.messages],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.total ?? 0;
  const totalPages = field.value?.totalPages ?? (Math.ceil(total / limit) || 1);

  const allSelected =
    messages.length > 0 && messages.every((m) => selectedIds.has(m.id));
  const someSelected = selectedIds.size > 0;

  // ─── Debounced search ────────────────────────────────────────────
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (text: string): void => {
      form?.setValue("search", text);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        form?.setValue("page", 1);
        if (onSubmit) {
          onSubmit();
        }
      }, 400);
    },
    [form, onSubmit],
  );

  // Cleanup debounce on unmount
  useEffect((): (() => void) => {
    return (): void => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleClearSearch = useCallback((): void => {
    form?.setValue("search", "");
    form?.setValue("page", 1);
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit]);

  // ─── Bulk actions ─────────────────────────────────────────────────
  const handleToggleAll = useCallback((): void => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  }, [allSelected, messages]);

  const handleToggleOne = useCallback((id: string): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkAction = useCallback(
    async (action: typeof BulkMessageActionValue): Promise<void> => {
      if (selectedIds.size === 0 || isBulkLoading) {
        return;
      }
      setIsBulkLoading(true);
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const bulkDef =
          await import("@/app/api/[locale]/emails/imap-client/messages/bulk/definition");
        await apiClient.mutate(
          bulkDef.default.POST,
          logger,
          user,
          { ids: [...selectedIds], action },
          undefined,
          locale,
        );
        setSelectedIds(new Set());
        endpointMutations?.read?.refetch?.();
      } finally {
        setIsBulkLoading(false);
      }
    },
    [selectedIds, isBulkLoading, logger, user, locale, endpointMutations],
  );

  const handleView = useCallback(
    (message: ImapMessage): void => {
      router.push(`/${widgetLocale}/admin/emails/imap/messages/${message.id}`);
    },
    [router, widgetLocale],
  );

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

  const handleSortOrderToggle = useCallback((): void => {
    const next = sortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
    form?.setValue("sortOrder", next);
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit, sortOrder]);

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

  const handleDateFromChange = useCallback(
    (text: string): void => {
      form?.setValue("dateFrom", text);
      form?.setValue("page", 1);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleDateToChange = useCallback(
    (text: string): void => {
      form?.setValue("dateTo", text);
      form?.setValue("page", 1);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleClearDateFilters = useCallback((): void => {
    form?.setValue("dateFrom", "");
    form?.setValue("dateTo", "");
    form?.setValue("page", 1);
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit]);

  const hasDateFilter = Boolean(dateFromValue || dateToValue);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b flex-wrap">
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.messages.list.title")}
          {total > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
          {unreadCount > 0 && (
            <Span className="ml-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium">
              {t("app.api.emails.imapClient.messages.list.unreadDot")}{" "}
              {unreadCount}{" "}
              {t("app.api.emails.imapClient.messages.list.unread")}
            </Span>
          )}
        </Span>
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.emails.imapClient.messages.list.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Bulk action bar — visible when items are selected */}
      {someSelected && (
        <Div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border-b">
          <Span className="text-sm font-medium text-foreground">
            {selectedIds.size}{" "}
            {t("app.api.emails.imapClient.messages.list.selected")}
          </Span>
          <Div className="flex-1" />
          {isBulkLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  void handleBulkAction(BulkMessageAction.MARK_READ)
                }
                title={t("app.api.emails.enums.bulkMessageAction.markRead")}
              >
                <MailOpen className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  void handleBulkAction(BulkMessageAction.MARK_UNREAD)
                }
                title={t("app.api.emails.enums.bulkMessageAction.markUnread")}
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleBulkAction(BulkMessageAction.FLAG)}
                title={t("app.api.emails.enums.bulkMessageAction.flag")}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleBulkAction(BulkMessageAction.DELETE)}
                title={t("app.api.emails.enums.bulkMessageAction.delete")}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-muted-foreground"
              >
                {t("app.api.emails.imapClient.messages.list.deselect")}
              </Button>
            </>
          )}
        </Div>
      )}

      {/* Gmail-style search bar */}
      <Div className="px-4 pt-3 pb-2 border-b">
        <Div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            className="pl-9 pr-9 h-9 w-full bg-muted/40 border-muted hover:bg-muted/60 focus:bg-background focus:border-primary/50 transition-colors"
            placeholder={t(
              "app.api.emails.imapClient.messages.list.get.search.placeholder",
            )}
            value={searchValue}
            onChangeText={handleSearchChange}
          />
          {searchValue && (
            <Div
              className="absolute right-2.5 flex items-center cursor-pointer"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Div>
          )}
        </Div>
        {/* Filter row: status chips + sort controls */}
        <Div className="mt-2 flex items-center gap-2">
          {/* Status filter chips — scrollable */}
          <Div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0 scrollbar-none pb-0.5">
            {ImapMessageStatusFilterOptions.map((opt) => {
              const activeStatus: string =
                form?.watch("status") ?? ImapMessageStatusFilter.ALL;
              const isActive = opt.value === activeStatus;
              return (
                <Button
                  key={opt.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form?.setValue("status", opt.value);
                    form?.setValue("page", 1);
                    if (onSubmit) {
                      onSubmit();
                    }
                  }}
                  className={cn(
                    "flex-shrink-0 inline-flex items-center px-2.5 py-1 h-7 rounded-full text-xs font-medium border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {t(opt.label)}
                </Button>
              );
            })}
          </Div>

          {/* Sort controls — always stay right-aligned */}
          <Div className="flex items-center gap-1 flex-shrink-0">
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="h-7 text-xs w-[120px] border-muted bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ImapMessageSortFieldOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(opt.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 border border-muted flex-shrink-0"
              onClick={handleSortOrderToggle}
              title={
                sortOrder === SortOrder.DESC ? "Newest first" : "Oldest first"
              }
            >
              {sortOrder === SortOrder.DESC ? (
                <ArrowDown className="h-3.5 w-3.5" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 border flex-shrink-0",
                hasDateFilter || showDateFilters
                  ? "border-primary/50 text-primary bg-primary/5"
                  : "border-muted text-muted-foreground",
              )}
              onClick={() => setShowDateFilters((v) => !v)}
              title={t(
                "app.api.emails.imapClient.messages.list.get.dateFrom.label",
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              {hasDateFilter && <Span className="sr-only">active</Span>}
            </Button>
          </Div>
        </Div>

        {/* Date range row — expanded when toggled */}
        {showDateFilters && (
          <Div className="mt-2 flex items-center gap-2 flex-wrap">
            <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <Span>
                {t(
                  "app.api.emails.imapClient.messages.list.get.dateFrom.label",
                )}
                :
              </Span>
            </Div>
            <Input
              type="date"
              className="h-7 text-xs w-36 border-muted"
              value={dateFromValue}
              onChangeText={handleDateFromChange}
            />
            <Div className="h-px w-3 bg-muted-foreground/40 flex-shrink-0" />
            <Input
              type="date"
              className="h-7 text-xs w-36 border-muted"
              value={dateToValue}
              onChangeText={handleDateToChange}
            />
            {hasDateFilter && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={handleClearDateFilters}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                {t("app.api.emails.imapClient.messages.list.deselect")}
              </Button>
            )}
          </Div>
        )}

        {/* Active filter summary chips */}
        {(searchValue || hasDateFilter) && (
          <Div className="mt-1.5 flex items-center gap-1 flex-wrap">
            {searchValue && (
              <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <Search className="h-3 w-3" />
                {searchValue.length > 20
                  ? `${searchValue.slice(0, 20)}\u2026`
                  : searchValue}
                <Div
                  className="cursor-pointer ml-0.5"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Div>
              </Span>
            )}
            {dateFromValue && (
              <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                <Calendar className="h-3 w-3" />
                {t(
                  "app.api.emails.imapClient.messages.list.get.dateFrom.label",
                )}
                : {dateFromValue}
              </Span>
            )}
            {dateToValue && (
              <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                <Calendar className="h-3 w-3" />
                {t("app.api.emails.imapClient.messages.list.get.dateTo.label")}:{" "}
                {dateToValue}
              </Span>
            )}
          </Div>
        )}
      </Div>

      {/* Column headers */}
      {messages.length > 0 && (
        <Div className="hidden sm:flex items-center gap-3 px-4 py-1.5 text-xs text-muted-foreground border-b bg-muted/30">
          {/* Select all checkbox */}
          <Div
            className="flex-shrink-0 flex items-center justify-center cursor-pointer"
            onClick={handleToggleAll}
          >
            {allSelected ? (
              <SquareCheck className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
            )}
          </Div>
          <Div className="w-9 flex-shrink-0" />
          <Div className="w-40 flex-shrink-0">
            {t("app.api.emails.imapClient.messages.list.from")}
          </Div>
          <Div className="flex-1 min-w-0">
            {t("app.api.emails.imapClient.messages.list.subject")}
          </Div>
          <Div className="flex-shrink-0 w-6" />
          <Div
            className="flex-shrink-0 min-w-[52px] text-right flex items-center justify-end gap-0.5 cursor-pointer hover:text-foreground"
            onClick={handleSortOrderToggle}
          >
            {t("app.api.emails.imapClient.messages.list.date")}
            {sortOrder === SortOrder.DESC ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUp className="h-3 w-3" />
            )}
          </Div>
        </Div>
      )}

      {/* Message list */}
      <Div>
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : messages.length > 0 ? (
          <Div className="flex flex-col">
            {messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                isSelected={selectedIds.has(message.id)}
                onToggle={handleToggleOne}
                onView={handleView}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-16">
            <Div className="text-4xl mb-3 text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto" />
            </Div>
            <Div>{t("app.api.emails.imapClient.messages.list.empty")}</Div>
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("app.api.emails.imapClient.messages.list.page")} {currentPage} /{" "}
            {totalPages}
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

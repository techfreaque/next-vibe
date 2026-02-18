/**
 * Custom Widget for Email Messages List
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
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
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import {
  EmailSortField,
  EmailSortFieldOptions,
  EmailStatus,
  EmailStatusFilter,
  EmailTypeFilter,
  EmailTypeFilterOptions,
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
  fieldName: string;
}

const STATUS_STYLE: Record<string, string> = {
  [EmailStatus.SENT]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [EmailStatus.DELIVERED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [EmailStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [EmailStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [EmailStatus.BOUNCED]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [EmailStatus.OPENED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [EmailStatus.CLICKED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const STATUS_TABS = [
  {
    label: "app.api.emails.messages.list.widget.tabs.all",
    value: EmailStatusFilter.ANY,
  },
  {
    label: "app.api.emails.messages.list.widget.tabs.sent",
    value: EmailStatusFilter.SENT,
  },
  {
    label: "app.api.emails.messages.list.widget.tabs.delivered",
    value: EmailStatusFilter.DELIVERED,
  },
  {
    label: "app.api.emails.messages.list.widget.tabs.opened",
    value: EmailStatusFilter.OPENED,
  },
  {
    label: "app.api.emails.messages.list.widget.tabs.failed",
    value: EmailStatusFilter.FAILED,
  },
  {
    label: "app.api.emails.messages.list.widget.tabs.bounced",
    value: EmailStatusFilter.BOUNCED,
  },
] as const;

function EmailRow({
  email,
  onView,
  t,
}: {
  email: EmailItem;
  onView: (email: EmailItem) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  const status = email.emailCore.status;
  const statusClassName =
    STATUS_STYLE[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div
      className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onView(email)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <Mail className="h-4 w-4 text-primary" />
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
            {t(status)}
          </Span>
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
          <Span className="truncate max-w-[180px]">
            {t("app.api.emails.messages.list.widget.to")}:{" "}
            {email.emailParties.recipient.recipientEmail}
          </Span>
          {email.emailMetadata.type !== null &&
            email.emailMetadata.type !== undefined && (
              <Span className="flex-shrink-0">
                {t(email.emailMetadata.type)}
              </Span>
            )}
        </Div>
      </Div>

      <Div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
        {email.technicalDetails.retryCount > 0 && (
          <Span>
            {t("app.api.emails.messages.list.widget.retries")}:{" "}
            {email.technicalDetails.retryCount}
          </Span>
        )}
        {email.emailEngagement.openedAt !== null &&
          email.emailEngagement.openedAt !== undefined && (
            <Div style={{ color: "#22c55e", fontSize: "11px" }}>
              {t("app.api.emails.messages.list.widget.opened")}
            </Div>
          )}
        {email.emailEngagement.clickedAt !== null &&
          email.emailEngagement.clickedAt !== undefined && (
            <Div style={{ color: "#8b5cf6", fontSize: "11px" }}>
              {t("app.api.emails.messages.list.widget.clicked")}
            </Div>
          )}
      </Div>
    </Div>
  );
}

export function EmailsListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const activeStatus = form?.watch("filters.status") ?? EmailStatusFilter.ANY;

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
      router.push(
        `/${locale}/admin/emails/imap/messages/${email.emailCore.id}`,
      );
    },
    [router, locale],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleStats = useCallback((): void => {
    router.push(`/${locale}/admin/emails/stats`);
  }, [router, locale]);

  const handleStatusTab = useCallback(
    (
      status: (typeof EmailStatusFilter)[keyof typeof EmailStatusFilter],
    ): void => {
      form?.setValue("filters.status", status);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (newPage: number): void => {
      form?.setValue("displayOptions.page", newPage);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue("displayOptions.sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue("displayOptions.sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleTypeFilter = useCallback(
    (value: string): void => {
      form?.setValue("filters.type", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const sortBy: string =
    form?.watch("displayOptions.sortBy") ?? EmailSortField.CREATED_AT;
  const sortOrder: string =
    form?.watch("displayOptions.sortOrder") ?? SortOrder.DESC;
  const activeType: string = form?.watch("filters.type") ?? EmailTypeFilter.ANY;

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.messages.list.title")}
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
          <Span className="hidden sm:inline">
            {t("app.api.emails.messages.list.widget.stats")}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.emails.messages.list.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Status filter tabs */}
      <Div className="flex items-center gap-1 px-4 pt-3 pb-1 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count =
            tab.value === EmailStatusFilter.ANY
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
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
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

      {/* Type filter chips */}
      <Div className="flex items-center gap-1 px-4 pb-1 flex-wrap">
        {EmailTypeFilterOptions.map((tab) => {
          const isActive = activeType === tab.value;
          return (
            <Button
              key={tab.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleTypeFilter(tab.value)}
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
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
      <Div className="px-4 pt-2 pb-2 flex items-center gap-2 flex-wrap">
        <Div className="flex-1 min-w-[160px]">
          <TextFieldWidget
            fieldName={`${fieldName}.filters.search`}
            field={children.filters.children.search}
          />
        </Div>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EmailSortFieldOptions.map((opt) => (
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
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {activeStatus !== EmailStatusFilter.ANY
              ? t("app.api.emails.messages.list.widget.emptyFiltered")
              : t("app.api.emails.messages.list.widget.emptyState")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("app.api.emails.messages.list.widget.page")} {currentPage} /{" "}
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

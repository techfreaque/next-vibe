/**
 * Custom Widget for IMAP Messages List
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
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
  ImapMessageSortField,
  ImapMessageSortFieldOptions,
  ImapMessageStatusFilter,
  ImapMessageStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
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

function MessageRow({
  message,
  onView,
  t,
}: {
  message: ImapMessage;
  onView: (message: ImapMessage) => void;
  t: (key: string) => string;
}): React.JSX.Element {
  return (
    <Div
      className="group flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onView(message)}
    >
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm truncate">
            {message.subject}
          </Span>
          {!message.isRead && (
            <Div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                flexShrink: 0,
                backgroundColor: "#3b82f6",
              }}
            />
          )}
          {message.isFlagged && (
            <Div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                flexShrink: 0,
                backgroundColor: "#f97316",
              }}
            />
          )}
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>{message.senderEmail}</Span>
          {message.sentAt !== null && message.sentAt !== undefined && (
            <Span>{message.sentAt}</Span>
          )}
          {message.hasAttachments && (
            <Span>
              {t("app.api.emails.imapClient.messages.list.hasAttachments")}
            </Span>
          )}
        </Div>
      </Div>
    </Div>
  );
}

export function ImapMessagesListContainer({
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

  const sortBy: string = form?.watch("sortBy") ?? ImapMessageSortField.SENT_AT;
  const sortOrder: string = form?.watch("sortOrder") ?? SortOrder.DESC;
  const currentPage: number = form?.watch("page") ?? 1;
  const limit: number = form?.watch("limit") ?? 20;

  const messages = useMemo(
    () => field.value?.messages ?? [],
    [field.value?.messages],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.total ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleView = useCallback(
    (message: ImapMessage): void => {
      router.push(`/${locale}/admin/emails/imap/messages/${message.id}`);
    },
    [router, locale],
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

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.messages.list.title")}
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
          title={t("app.api.emails.imapClient.messages.list.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
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
          <SelectTrigger className="h-9 min-w-[120px]">
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

      {/* Message list */}
      <Div className="px-4 py-3">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : messages.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                onView={handleView}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {t("app.api.emails.imapClient.messages.list.empty")}
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

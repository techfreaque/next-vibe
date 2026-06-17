/**
 * Custom Widget for Email Messages List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EmptyBlock } from "next-vibe-ui/ui/empty-block";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { MessageCircle } from "next-vibe-ui/ui/icons/MessageCircle";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { ListItem } from "next-vibe-ui/ui/list-item";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { Span } from "next-vibe-ui/ui/span";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
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
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";

import type { MessengerChannelFilterValue } from "../../accounts/enum";
import {
  MessageChannel,
  MessengerChannelFilter,
  MessengerChannelFilterOptions,
} from "../../accounts/enum";
import type { MessageStatusFilterValue, MessageTypeFilterValue } from "../enum";
import {
  MessageStatus,
  MessageStatusFilter,
  MessageTypeFilter,
  MessageTypeFilterOptions,
} from "../enum";
import type definition from "./definition";
import type { EmailsListResponseOutput } from "./definition";

type EmailItem = NonNullable<EmailsListResponseOutput["emails"]>[number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type PillVariant = "default" | "success" | "warning" | "danger" | "info";

const STATUS_VARIANT: Record<string, PillVariant> = {
  [MessageStatus.SENT]: "success",
  [MessageStatus.DELIVERED]: "success",
  [MessageStatus.FAILED]: "danger",
  [MessageStatus.PENDING]: "warning",
  [MessageStatus.BOUNCED]: "warning",
  [MessageStatus.OPENED]: "info",
  [MessageStatus.CLICKED]: "info",
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

function ChannelAvatar({ channel }: { channel: string }): React.JSX.Element {
  const Icon = CHANNEL_ICON[channel] ?? Mail;
  return (
    <Div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </Div>
  );
}

export function EmailsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();
  const messagesT = messagesScopedTranslation.scopedT(locale).t;
  const { push: navigate, pop } = useWidgetNavigation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const onPick = usePickerCallback<EmailItem>();
  const isPickerMode = !!onPick;

  const activeStatus: typeof MessageStatusFilterValue =
    form.watch("filters.status") ?? MessageStatusFilter.ANY;

  const emails = useMemo(() => value?.emails ?? [], [value?.emails]);
  const pagination = value?.pagination;
  const isLoading = value === null || value === undefined;

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
      if (isPickerMode && onPick) {
        onPick(email);
        pop();
        return;
      }
      void (async (): Promise<void> => {
        const msgDef = await import("../[id]/definition");
        navigate(msgDef.default.GET, {
          urlPathParams: { id: email.emailCore.id },
        });
      })();
    },
    [isPickerMode, onPick, pop, navigate],
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

  const handleGraphs = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef =
        await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition");
      navigate(graphsDef.default.GET, {
        data: { search: "messenger" },
      });
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

  const handleTypeFilter = useCallback(
    (typeVal: string): void => {
      form.setValue("filters.type", typeVal);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleChannelFilter = useCallback(
    (channelVal: string): void => {
      form.setValue("filters.channel", channelVal);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const activeChannel: typeof MessengerChannelFilterValue =
    form.watch("filters.channel") ?? MessengerChannelFilter.ANY;

  const activeType: typeof MessageTypeFilterValue =
    form.watch("filters.type") ?? MessageTypeFilter.ANY;

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  const headerActions = !isPickerMode ? (
    <Div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleStats}
        className="gap-1"
      >
        <Span className="hidden @sm:inline">{t("widget.stats")}</Span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleGraphs}
        title={t("widget.graphs")}
        className="gap-1"
      >
        <GitBranch className="h-4 w-4" />
        <Span className="hidden @sm:inline">{t("widget.graphs")}</Span>
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
  ) : undefined;

  return (
    <WidgetShell padding="none">
      {/* Header */}
      <Div className="px-4 pt-4">
        <WidgetHeader
          title={`${t("title")}${total > 0 ? ` (${total})` : ""}`}
          actions={headerActions}
          border={false}
        />
      </Div>

      {/* Status/type/channel filter tabs + search + sort — full mode only */}
      {!isPickerMode && (
        <>
          {/* Status filter tabs - scrollable */}
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

          {/* Type filter chips - scrollable */}
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

          {/* Channel filter chips - scrollable */}
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
          <Div className="px-4 pt-2 pb-2 grid grid-cols-1 @sm:grid-cols-3 gap-2 border-b">
            <TextFieldWidget
              fieldName="filters.search"
              field={field.children.filters.children.search}
            />
            <SelectFieldWidget
              fieldName="displayOptions.sortBy"
              field={field.children.displayOptions.children.sortBy}
            />
            <SelectFieldWidget
              fieldName="displayOptions.sortOrder"
              field={field.children.displayOptions.children.sortOrder}
            />
          </Div>
        </>
      )}

      {/* Email list */}
      <Div className="px-4 pb-2">
        {isLoading ? (
          <LoadingBlock />
        ) : emails.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {emails.map((email) => {
              const status = email.emailCore.status;
              const channel = email.emailCore.channel ?? MessageChannel.EMAIL;
              const subtitle = [
                `${t("widget.to")}: ${email.emailParties.recipient.recipientEmail}`,
                email.emailMetadata.type !== null &&
                email.emailMetadata.type !== undefined
                  ? messagesT(email.emailMetadata.type)
                  : null,
              ]
                .filter(Boolean)
                .join(" · ");

              const meta = (
                <>
                  {email.technicalDetails.retryCount > 0 && (
                    <Span className="text-xs text-muted-foreground">
                      {t("widget.retries")}: {email.technicalDetails.retryCount}
                    </Span>
                  )}
                  {email.emailEngagement.openedAt !== null &&
                    email.emailEngagement.openedAt !== undefined && (
                      <Span className="text-xs text-success">
                        {t("widget.opened")}
                      </Span>
                    )}
                  {email.emailEngagement.clickedAt !== null &&
                    email.emailEngagement.clickedAt !== undefined && (
                      <Span className="text-xs text-info">
                        {t("widget.clicked")}
                      </Span>
                    )}
                </>
              );

              return (
                <ListItem
                  key={email.emailCore.id}
                  avatar={<ChannelAvatar channel={channel} />}
                  title={email.emailCore.subject}
                  badges={
                    <StatusPill
                      status={messagesT(status)}
                      variant={STATUS_VARIANT[status] ?? "default"}
                    />
                  }
                  subtitle={subtitle}
                  meta={meta}
                  onClick={() => handleView(email)}
                />
              );
            })}
          </Div>
        ) : (
          <EmptyBlock
            title={
              activeStatus !== MessageStatusFilter.ANY
                ? t("widget.emptyFiltered")
                : t("widget.emptyState")
            }
          />
        )}
      </Div>

      {/* Pagination — full mode only */}
      {!isPickerMode && totalPages > 1 && (
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
    </WidgetShell>
  );
}

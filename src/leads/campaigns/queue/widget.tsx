"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { scopedTranslation as leadsI18n } from "next-vibe/identity/lead/i18n";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import {
  CampaignTypeFilter,
  CampaignTypeFilterDB,
} from "@/messenger/accounts/enum";

import type definition from "./definition";

export function CampaignQueueWidget(): JSX.Element {
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const submit = useWidgetOnSubmit();
  const interactive = useWidgetIsInteractive();
  const navigate = useRelatedEntityNavigation();
  const { canGoBack, pop } = useWidgetNavigation();
  const leadsT = leadsI18n.scopedT(locale).t;

  const leadId = form.watch("leadId");
  const campaignType = form.watch("campaignType") ?? CampaignTypeFilter.ANY;
  const items = data?.items ?? [];
  const page = data?.currentPage ?? 1;
  const totalPages = Math.max(
    1,
    Math.ceil((data?.totalCount ?? 0) / (data?.pageSize ?? 20)),
  );

  const changePage = (next: number): void => {
    form.setValue("page", next, { shouldDirty: true });
    submit?.();
  };
  const clearFilters = (): void => {
    form.setValue("leadId", undefined, { shouldDirty: true });
    form.setValue("campaignType", CampaignTypeFilter.ANY, {
      shouldDirty: true,
    });
    changePage(1);
  };

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("widget.title")}
        backButton={
          canGoBack && interactive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => pop()}
            >
              {t("widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          interactive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t("widget.refresh")}
              onClick={() => void read?.refetch?.()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )
        }
      />
      {interactive && (
        <Div className="flex min-w-0 flex-wrap items-center gap-2">
          <Select
            value={campaignType}
            onValueChange={(value) => {
              const selected = CampaignTypeFilterDB.find(
                (option) => option === value,
              );
              if (selected) {
                form.setValue("campaignType", selected, { shouldDirty: true });
                changePage(1);
              }
            }}
          >
            <SelectTrigger
              aria-label={t("get.fields.campaignType.label")}
              className="w-full @sm:w-auto"
            >
              <SelectValue placeholder={t("get.fields.campaignType.label")} />
            </SelectTrigger>
            <SelectContent>
              {CampaignTypeFilterDB.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {leadId && (
            <StatusPill status={t("widget.selectedLead")} variant="info" />
          )}
          {(leadId || campaignType !== CampaignTypeFilter.ANY) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              {t("widget.clearFilters")}
            </Button>
          )}
        </Div>
      )}
      {response?.success === false ? (
        <EmptyBlock
          title={t("get.errors.server.title")}
          message={response.message}
          action={
            interactive
              ? {
                  label: t("widget.refresh"),
                  onClick: () => void read?.refetch?.(),
                }
              : undefined
          }
        />
      ) : !data ? (
        <LoadingBlock message={t("widget.loading")} />
      ) : items.length === 0 ? (
        <EmptyBlock
          icon={<Mail className="h-7 w-7" />}
          title={leadId ? t("widget.leadEmpty") : t("widget.noData")}
          message={t("widget.emptyDescription")}
          action={
            interactive && page > 1
              ? {
                  label: t("widget.firstPage"),
                  onClick: () => changePage(1),
                }
              : undefined
          }
        />
      ) : (
        <Div className="flex min-w-0 flex-col gap-2">
          {items.map((item) => {
            const recipient =
              item.leadEmail || item.businessName || item.leadId;
            const schedule = item.nextScheduledAt
              ? t("widget.scheduledFor", {
                  date: formatDate(
                    new Date(item.nextScheduledAt),
                    locale,
                    "PPp",
                  ),
                })
              : t("widget.noScheduledEmail");
            return (
              <ListItem
                key={item.leadId}
                title={recipient}
                subtitle={schedule}
                className="min-w-0 [&_.truncate]:whitespace-normal [&_.truncate]:[overflow-wrap:anywhere]"
                badges={
                  item.campaignType && (
                    <StatusPill status={t(item.campaignType)} variant="info" />
                  )
                }
                meta={
                  <Div className="flex w-full min-w-0 flex-col gap-2">
                    {item.businessName && item.businessName !== recipient && (
                      <Span className="break-words">{item.businessName}</Span>
                    )}
                    {item.nextSubject && (
                      <Span className="break-words">{item.nextSubject}</Span>
                    )}
                    <Div className="flex flex-wrap gap-x-3 gap-y-1">
                      {item.currentStage && (
                        <Span>{leadsT(item.currentStage)}</Span>
                      )}
                      {item.journeyVariant && (
                        <Span>{leadsT(item.journeyVariant)}</Span>
                      )}
                      <Span>
                        {t("widget.deliveryStats", {
                          sent: item.emailsSent,
                          opened: item.emailsOpened,
                          clicked: item.emailsClicked,
                        })}
                      </Span>
                      {item.startedAt && (
                        <Span>
                          {t("widget.startedOn", {
                            date: formatDate(item.startedAt, locale, "PP"),
                          })}
                        </Span>
                      )}
                    </Div>
                    {interactive && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        aria-label={t("widget.openLeadNamed", { recipient })}
                        onClick={() =>
                          navigate(
                            async () =>
                              (await import("@/leads/[id]/definition")).default
                                .GET,
                            { urlPathParams: { id: item.leadId } },
                          )
                        }
                      >
                        {t("widget.openLead")}
                      </Button>
                    )}
                  </Div>
                }
              />
            );
          })}
        </Div>
      )}
      {data && data.totalCount > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <Span>
            {t("widget.pagination", {
              page,
              totalPages,
              total: data.totalCount,
            })}
          </Span>
          {interactive && totalPages > 1 && (
            <Div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || read?.isFetching}
                onClick={() => changePage(page - 1)}
              >
                {t("widget.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || read?.isFetching}
                onClick={() => changePage(page + 1)}
              >
                {t("widget.next")}
              </Button>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}

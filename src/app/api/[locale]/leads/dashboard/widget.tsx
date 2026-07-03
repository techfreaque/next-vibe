"use client";

import { LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadsScopedTranslation } from "next-vibe/identity/lead/i18n";
import { ActionCard } from "next-vibe/ui/ui/action-card";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { EmptyBlock } from "next-vibe/ui/ui/empty-block";
import { ArrowRight } from "next-vibe/ui/ui/icons/ArrowRight";
import { BarChart } from "next-vibe/ui/ui/icons/BarChart";
import { Download } from "next-vibe/ui/ui/icons/Download";
import { Plus } from "next-vibe/ui/ui/icons/Plus";
import { UserSearch } from "next-vibe/ui/ui/icons/UserSearch";
import { ListItem } from "next-vibe/ui/ui/list-item";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { MetricCard } from "next-vibe/ui/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/ui/metric-grid";
import { ProgressBlock } from "next-vibe/ui/ui/progress-block";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { type JSX } from "react";

import type definition from "./definition";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

const STATUS_VARIANT: Record<string, StatusVariant> = {
  [LeadStatus.NEW]: "info",
  [LeadStatus.PENDING]: "default",
  [LeadStatus.CAMPAIGN_RUNNING]: "info",
  [LeadStatus.WEBSITE_USER]: "default",
  [LeadStatus.NEWSLETTER_SUBSCRIBER]: "default",
  [LeadStatus.IN_CONTACT]: "info",
  [LeadStatus.SIGNED_UP]: "success",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: "success",
  [LeadStatus.UNSUBSCRIBED]: "warning",
  [LeadStatus.BOUNCED]: "danger",
  [LeadStatus.INVALID]: "danger",
};

function getStatusVariant(status: string): StatusVariant {
  return STATUS_VARIANT[status] ?? "default";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LeadsDashboardWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tLeads } = leadsScopedTranslation.scopedT(locale);

  // --- Navigation handlers ---

  const handleNavNewLead = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/leads/create/definition");
      navigate(def.default.POST, { renderInModal: true });
    })();
  };

  const handleNavAllLeads = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/leads/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavCampaignStats = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/leads/campaigns/stats/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavSearch = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/leads/search/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavImport = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/leads/import/definition");
      navigate(def.default.POST, { renderInModal: true });
    })();
  };

  const handleNavLeadDetail = (leadId: string) => (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/leads/[id]/definition");
      navigate(def.default.GET, { urlPathParams: { id: leadId } });
    })();
  };

  return (
    <WidgetShell>
      <FormAlertWidget field={{}} />

      {!data ? (
        <LoadingBlock message={t("widget.loading")} />
      ) : (data.totalLeadsCount ?? 0) === 0 ? (
        <EmptyBlock
          title={t("widget.noLeadsYet")}
          message={t("widget.noLeadsHint")}
          action={{
            label: t("widget.createFirst"),
            onClick: handleNavNewLead,
          }}
        />
      ) : (
        <>
          {/* KPI Cards */}
          <MetricGrid columns={4}>
            <MetricCard
              label={t("widget.totalLeads")}
              value={data.totalLeadsCount}
            />
            <MetricCard
              label={t("widget.activeLeads")}
              value={data.activeLeadsCount}
              variant="info"
            />
            <MetricCard
              label={t("widget.newThisWeek")}
              value={data.newThisWeekCount}
              variant={data.newThisWeekCount > 0 ? "success" : "default"}
            />
            <MetricCard
              label={t("widget.conversionRate")}
              value={data.conversionRate}
              format="percentage"
              variant={data.conversionRate > 10 ? "success" : "warning"}
            />
          </MetricGrid>

          {/* Second row: campaign + converted */}
          <MetricGrid columns={2}>
            <MetricCard
              label={t("widget.runningCampaigns")}
              value={data.runningCampaignsCount}
              variant="info"
            />
            <MetricCard
              label={t("widget.converted")}
              value={data.convertedCount}
              variant="success"
            />
          </MetricGrid>

          {/* Quick Actions */}
          <SectionGroup title={t("widget.quickActions")}>
            <Div className="grid grid-cols-1 gap-2 @sm:grid-cols-2 @lg:grid-cols-3">
              <ActionCard
                icon={<Plus className="h-4 w-4" />}
                title={t("widget.newLead")}
                description={t("widget.newLeadDesc")}
                onClick={handleNavNewLead}
                variant="primary"
              />
              <ActionCard
                icon={<UserSearch className="h-4 w-4" />}
                title={t("widget.searchLeads")}
                description={t("widget.searchLeadsDesc")}
                onClick={handleNavSearch}
              />
              <ActionCard
                icon={<BarChart className="h-4 w-4" />}
                title={t("widget.campaignStats")}
                description={t("widget.campaignStatsDesc")}
                onClick={handleNavCampaignStats}
              />
              <ActionCard
                icon={<ArrowRight className="h-4 w-4" />}
                title={t("widget.allLeads")}
                description={t("widget.allLeadsDesc")}
                onClick={handleNavAllLeads}
              />
              <ActionCard
                icon={<Download className="h-4 w-4" />}
                title={t("widget.importLeads")}
                description={t("widget.importLeadsDesc")}
                onClick={handleNavImport}
              />
            </Div>
          </SectionGroup>

          {/* Status Breakdown */}
          {data.statusBreakdown &&
            Object.keys(data.statusBreakdown).length > 0 && (
              <SectionGroup title={t("widget.statusBreakdown")}>
                <Div className="flex flex-col gap-2">
                  {(Object.entries(data.statusBreakdown) as [string, number][])
                    .toSorted(([, a], [, b]) => b - a)
                    .map(([status, statusCount]) => (
                      <Div
                        key={status}
                        className="flex items-center justify-between gap-2"
                      >
                        <Div className="flex items-center gap-2 min-w-0">
                          <StatusPill
                            status={tLeads(
                              status as Parameters<typeof tLeads>[0],
                            )}
                            variant={getStatusVariant(status)}
                          />
                        </Div>
                        <ProgressBlock
                          value={statusCount}
                          max={data.totalLeadsCount}
                          label={String(statusCount)}
                          showPercentage={false}
                          className="flex-1 max-w-48"
                        />
                      </Div>
                    ))}
                </Div>
              </SectionGroup>
            )}

          {/* Recent Leads */}
          <SectionGroup
            title={t("widget.recentLeads")}
            subtitle={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e: ButtonMouseEvent) => {
                  e.stopPropagation();
                  handleNavAllLeads();
                }}
                className="gap-1 text-xs"
              >
                {t("widget.viewAll")}
                <ArrowRight className="h-3 w-3" />
              </Button>
            }
          >
            {!data.recentLeads || data.recentLeads.length === 0 ? (
              <EmptyBlock
                title={t("widget.noLeadsYet")}
                message={t("widget.noLeadsHint")}
              />
            ) : (
              <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                {data.recentLeads.map(
                  (lead: {
                    id: string;
                    businessName: string;
                    email: string;
                    status: string;
                    source: string;
                    createdAt: string;
                  }) => (
                    <ListItem
                      key={lead.id}
                      title={
                        lead.businessName || lead.email || lead.id.slice(0, 8)
                      }
                      subtitle={lead.businessName ? lead.email : undefined}
                      badges={
                        <StatusPill
                          status={tLeads(
                            lead.status as Parameters<typeof tLeads>[0],
                          )}
                          variant={getStatusVariant(lead.status)}
                        />
                      }
                      meta={
                        <Div className="text-xs text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString(locale)}
                        </Div>
                      }
                      onClick={handleNavLeadDetail(lead.id)}
                    />
                  ),
                )}
              </Div>
            )}
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}

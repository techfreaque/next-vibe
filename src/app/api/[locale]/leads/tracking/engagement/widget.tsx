/**
 * Lead Engagement Tracking Widget
 * Displays engagement recording confirmation (POST) and click tracking result (GET)
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { MousePointerClick } from "next-vibe-ui/ui/icons/MousePointerClick";
import { User } from "next-vibe-ui/ui/icons/User";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";

// ---- POST (record engagement) ----

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface PostWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

function MetadataRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | number | boolean | null;
  mono?: boolean;
}): React.JSX.Element | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <Div className="flex items-start gap-2 py-1 border-b last:border-0 text-sm">
      <Span className="text-muted-foreground w-36 flex-shrink-0">{label}</Span>
      <Span className={cn("flex-1 break-all", mono && "font-mono text-xs")}>
        {String(value)}
      </Span>
    </Div>
  );
}

export function LeadEngagementTrackingContainer({
  field,
}: PostWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const isLoading = endpointMutations?.create?.isSubmitting;
  const hasResult = data?.id !== null && data?.id !== undefined;
  const leadId = data?.responseLeadId;

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef =
        await import("@/app/api/[locale]/leads/lead/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: leadId } });
    })();
  }, [navigate, leadId]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef =
        await import("@/app/api/[locale]/leads/stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

  const engagementTypeLabel = data?.responseEngagementType
    ? String(data.responseEngagementType).replace(/_/g, " ")
    : null;

  const createdAtFormatted = data?.createdAt
    ? new Date(String(data.createdAt)).toLocaleString()
    : null;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("widget.post.headerTitle")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1 text-xs"
          title={t("widget.post.viewStatsTitle")}
        >
          <BarChart2 className="h-4 w-4" />
          {t("widget.post.statsButton")}
        </Button>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.post.loading")}
          </Span>
        </Div>
      )}

      {/* Success result */}
      {hasResult && !isLoading && (
        <Div className="rounded-lg border bg-card p-6 flex flex-col gap-5">
          {/* Status banner */}
          <Div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success flex-shrink-0" />
            <Div>
              <Span className="font-semibold block">
                {t("widget.post.successTitle")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {engagementTypeLabel ?? t("widget.post.event")}{" "}
                {t("widget.post.successSubtitle")}
              </Span>
            </Div>
          </Div>

          {/* Key fields */}
          <Div className="flex flex-col gap-0">
            <MetadataRow
              label={t("widget.post.labels.engagementId")}
              value={data?.id}
              mono
            />
            <MetadataRow
              label={t("widget.post.labels.type")}
              value={engagementTypeLabel}
            />
            <MetadataRow
              label={t("widget.post.labels.leadId")}
              value={leadId}
              mono
            />
            <MetadataRow
              label={t("widget.post.labels.campaignId")}
              value={data?.responseCampaignId}
              mono
            />
            <MetadataRow
              label={t("widget.post.labels.ipAddress")}
              value={data?.ipAddress}
              mono
            />
            <MetadataRow
              label={t("widget.post.labels.recordedAt")}
              value={createdAtFormatted}
            />
            {data?.leadCreated !== null && data?.leadCreated !== undefined && (
              <MetadataRow
                label={t("widget.post.labels.leadCreated")}
                value={
                  data.leadCreated
                    ? t("widget.post.labels.leadCreatedYes")
                    : t("widget.post.labels.leadCreatedNo")
                }
              />
            )}
            {data?.relationshipEstablished !== null &&
              data?.relationshipEstablished !== undefined && (
                <MetadataRow
                  label={t("widget.post.labels.relationshipEst")}
                  value={
                    data.relationshipEstablished
                      ? t("widget.post.labels.relationshipYes")
                      : t("widget.post.labels.relationshipNo")
                  }
                />
              )}
          </Div>

          {/* Metadata preview */}
          {data?.responseMetadata &&
            Object.keys(data.responseMetadata).length > 0 && (
              <Div className="rounded-md border bg-muted/30 p-3">
                <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
                  {t("widget.post.labels.metadata")}
                </Span>
                <Div className="flex flex-col gap-0">
                  {Object.entries(data.responseMetadata)
                    .slice(0, 8)
                    .map(([k, v]) => (
                      <MetadataRow key={k} label={k} value={String(v)} mono />
                    ))}
                </Div>
              </Div>
            )}

          {/* Post-action navigation */}
          <Div className="flex items-center gap-2 pt-1 border-t flex-wrap">
            <Span className="text-xs text-muted-foreground mr-auto">
              {t("widget.post.nextSteps")}
            </Span>
            {leadId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewLead}
                className="gap-1"
              >
                <User className="h-4 w-4" />
                {t("widget.post.viewLeadButton")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewStats}
              className="gap-1"
            >
              <BarChart2 className="h-4 w-4" />
              {t("widget.post.leadStatsButton")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Div>
        </Div>
      )}

      {/* Empty / pre-submit state */}
      {!hasResult && !isLoading && (
        <Div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center gap-5 text-center">
          <Activity className="h-10 w-10 text-muted-foreground" />
          <Div>
            <Span className="font-medium block text-base">
              {t("widget.post.emptyTitle")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("widget.post.emptyDescription")}
            </Span>
          </Div>
          <Div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleViewStats}
              className="gap-1 text-xs"
            >
              <BarChart2 className="h-4 w-4" />
              {t("widget.post.viewLeadStatsButton")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ---- GET (click tracking / redirect result) ----

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface GetWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

export function LeadClickTrackingContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const isLoading = endpointMutations?.read?.isLoading;
  const hasResult = data?.success !== null && data?.success !== undefined;
  const leadId = data?.responseLeadId;

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef =
        await import("@/app/api/[locale]/leads/lead/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: leadId } });
    })();
  }, [navigate, leadId]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef =
        await import("@/app/api/[locale]/leads/stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

  const handleOpenRedirectUrl = useCallback((): void => {
    if (!data?.redirectUrl) {
      return;
    }
    window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
    return undefined;
  }, [data?.redirectUrl]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <MousePointerClick className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("widget.get.headerTitle")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1 text-xs"
          title={t("widget.get.viewStatsTitle")}
        >
          <BarChart2 className="h-4 w-4" />
          {t("widget.get.statsButton")}
        </Button>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <MousePointerClick className="h-8 w-8 animate-pulse text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.get.loading")}
          </Span>
        </Div>
      )}

      {/* Result */}
      {hasResult && !isLoading && (
        <Div className="rounded-lg border bg-card p-6 flex flex-col gap-5">
          {/* Status banner */}
          <Div className="flex items-center gap-3">
            {data?.success ? (
              <>
                <CheckCircle className="h-8 w-8 text-success flex-shrink-0" />
                <Div>
                  <Span className="font-semibold block">
                    {t("widget.get.successTitle")}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t("widget.get.successSubtitle")}
                  </Span>
                </Div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-destructive flex-shrink-0" />
                <Div>
                  <Span className="font-semibold block">
                    {t("widget.get.failTitle")}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t("widget.get.failSubtitle")}
                  </Span>
                </Div>
              </>
            )}
          </Div>

          {/* Status grid */}
          <Div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("widget.get.labels.engagementLabel")}
              </Span>
              <Span
                className={cn(
                  "text-sm font-semibold",
                  data?.engagementRecorded
                    ? "text-success"
                    : "text-muted-foreground",
                )}
              >
                {data?.engagementRecorded
                  ? t("widget.get.labels.recorded")
                  : t("widget.get.labels.notRecorded")}
              </Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("widget.get.labels.leadStatusLabel")}
              </Span>
              <Span
                className={cn(
                  "text-sm font-semibold",
                  data?.leadStatusUpdated
                    ? "text-info"
                    : "text-muted-foreground",
                )}
              >
                {data?.leadStatusUpdated
                  ? t("widget.get.labels.updated")
                  : t("widget.get.labels.unchanged")}
              </Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("widget.get.labels.userLabel")}
              </Span>
              <Span className="text-sm font-semibold">
                {data?.isLoggedIn
                  ? t("widget.get.labels.loggedIn")
                  : t("widget.get.labels.anonymous")}
              </Span>
            </Div>
          </Div>

          {/* Details */}
          <Div className="flex flex-col gap-0">
            <MetadataRow
              label={t("widget.get.labels.leadId")}
              value={leadId}
              mono
            />
            <MetadataRow
              label={t("widget.get.labels.campaignId")}
              value={data?.responseCampaignId}
              mono
            />
            {data?.redirectUrl && (
              <MetadataRow
                label={t("widget.get.labels.redirectUrl")}
                value={data.redirectUrl}
                mono
              />
            )}
          </Div>

          {/* Post-action navigation */}
          <Div className="flex items-center gap-2 pt-1 border-t flex-wrap">
            <Span className="text-xs text-muted-foreground mr-auto">
              {t("widget.get.nextSteps")}
            </Span>
            {data?.redirectUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenRedirectUrl}
                className="gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                {t("widget.get.openUrlButton")}
              </Button>
            )}
            {leadId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewLead}
                className="gap-1"
              >
                <User className="h-4 w-4" />
                {t("widget.get.viewLeadButton")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewStats}
              className="gap-1"
            >
              <BarChart2 className="h-4 w-4" />
              {t("widget.get.leadStatsButton")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Div>
        </Div>
      )}

      {/* Empty / pre-query state */}
      {!hasResult && !isLoading && (
        <Div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center gap-5 text-center">
          <MousePointerClick className="h-10 w-10 text-muted-foreground" />
          <Div>
            <Span className="font-medium block text-base">
              {t("widget.get.emptyTitle")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("widget.get.emptyDescription")}
            </Span>
          </Div>
          <Div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleViewStats}
              className="gap-1 text-xs"
            >
              <BarChart2 className="h-4 w-4" />
              {t("widget.get.viewLeadStatsButton")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

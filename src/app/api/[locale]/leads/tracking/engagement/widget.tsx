/**
 * Lead Engagement Tracking Widget
 * Displays engagement recording confirmation (POST) and click tracking result (GET)
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle,
  ExternalLink,
  MousePointerClick,
  User,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
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
  fieldName: string;
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
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();

  const isLoading = endpointMutations?.create?.isSubmitting;
  const hasResult = data?.id !== null && data?.id !== undefined;
  const leadId = data?.responseLeadId;

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  const handleViewStats = useCallback((): void => {
    router.push(`/${locale}/admin/leads/stats`);
  }, [router, locale]);

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
            {t("app.api.leads.tracking.engagement.widget.post.headerTitle")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1 text-xs"
          title={t(
            "app.api.leads.tracking.engagement.widget.post.viewStatsTitle",
          )}
        >
          <BarChart2 className="h-4 w-4" />
          {t("app.api.leads.tracking.engagement.widget.post.statsButton")}
        </Button>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.tracking.engagement.widget.post.loading")}
          </Span>
        </Div>
      )}

      {/* Success result */}
      {hasResult && !isLoading && (
        <Div className="rounded-lg border bg-card p-6 flex flex-col gap-5">
          {/* Status banner */}
          <Div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            <Div>
              <Span className="font-semibold block">
                {t(
                  "app.api.leads.tracking.engagement.widget.post.successTitle",
                )}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {engagementTypeLabel ??
                  t("app.api.leads.tracking.engagement.widget.post.event")}{" "}
                {t(
                  "app.api.leads.tracking.engagement.widget.post.successSubtitle",
                )}
              </Span>
            </Div>
          </Div>

          {/* Key fields */}
          <Div className="flex flex-col gap-0">
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.engagementId",
              )}
              value={data?.id}
              mono
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.type",
              )}
              value={engagementTypeLabel}
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.leadId",
              )}
              value={leadId}
              mono
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.campaignId",
              )}
              value={data?.responseCampaignId}
              mono
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.ipAddress",
              )}
              value={data?.ipAddress}
              mono
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.post.labels.recordedAt",
              )}
              value={createdAtFormatted}
            />
            {data?.leadCreated !== null && data?.leadCreated !== undefined && (
              <MetadataRow
                label={t(
                  "app.api.leads.tracking.engagement.widget.post.labels.leadCreated",
                )}
                value={
                  data.leadCreated
                    ? t(
                        "app.api.leads.tracking.engagement.widget.post.labels.leadCreatedYes",
                      )
                    : t(
                        "app.api.leads.tracking.engagement.widget.post.labels.leadCreatedNo",
                      )
                }
              />
            )}
            {data?.relationshipEstablished !== null &&
              data?.relationshipEstablished !== undefined && (
                <MetadataRow
                  label={t(
                    "app.api.leads.tracking.engagement.widget.post.labels.relationshipEst",
                  )}
                  value={
                    data.relationshipEstablished
                      ? t(
                          "app.api.leads.tracking.engagement.widget.post.labels.relationshipYes",
                        )
                      : t(
                          "app.api.leads.tracking.engagement.widget.post.labels.relationshipNo",
                        )
                  }
                />
              )}
          </Div>

          {/* Metadata preview */}
          {data?.responseMetadata &&
            Object.keys(data.responseMetadata).length > 0 && (
              <Div className="rounded-md border bg-muted/30 p-3">
                <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
                  {t(
                    "app.api.leads.tracking.engagement.widget.post.labels.metadata",
                  )}
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
              {t("app.api.leads.tracking.engagement.widget.post.nextSteps")}
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
                {t(
                  "app.api.leads.tracking.engagement.widget.post.viewLeadButton",
                )}
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
              {t(
                "app.api.leads.tracking.engagement.widget.post.leadStatsButton",
              )}
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
              {t("app.api.leads.tracking.engagement.widget.post.emptyTitle")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t(
                "app.api.leads.tracking.engagement.widget.post.emptyDescription",
              )}
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
              {t(
                "app.api.leads.tracking.engagement.widget.post.viewLeadStatsButton",
              )}
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
  fieldName: string;
}

export function LeadClickTrackingContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();

  const isLoading = endpointMutations?.read?.isLoading;
  const hasResult = data?.success !== null && data?.success !== undefined;
  const leadId = data?.responseLeadId;

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  const handleViewStats = useCallback((): void => {
    router.push(`/${locale}/admin/leads/stats`);
  }, [router, locale]);

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
            {t("app.api.leads.tracking.engagement.widget.get.headerTitle")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1 text-xs"
          title={t(
            "app.api.leads.tracking.engagement.widget.get.viewStatsTitle",
          )}
        >
          <BarChart2 className="h-4 w-4" />
          {t("app.api.leads.tracking.engagement.widget.get.statsButton")}
        </Button>
      </Div>

      {/* Loading state */}
      {isLoading && (
        <Div className="h-32 flex flex-col items-center justify-center gap-3">
          <MousePointerClick className="h-8 w-8 animate-pulse text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("app.api.leads.tracking.engagement.widget.get.loading")}
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
                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                <Div>
                  <Span className="font-semibold block">
                    {t(
                      "app.api.leads.tracking.engagement.widget.get.successTitle",
                    )}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t(
                      "app.api.leads.tracking.engagement.widget.get.successSubtitle",
                    )}
                  </Span>
                </Div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <Div>
                  <Span className="font-semibold block">
                    {t(
                      "app.api.leads.tracking.engagement.widget.get.failTitle",
                    )}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t(
                      "app.api.leads.tracking.engagement.widget.get.failSubtitle",
                    )}
                  </Span>
                </Div>
              </>
            )}
          </Div>

          {/* Status grid */}
          <Div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t(
                  "app.api.leads.tracking.engagement.widget.get.labels.engagementLabel",
                )}
              </Span>
              <Span
                className={cn(
                  "text-sm font-semibold",
                  data?.engagementRecorded
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {data?.engagementRecorded
                  ? t(
                      "app.api.leads.tracking.engagement.widget.get.labels.recorded",
                    )
                  : t(
                      "app.api.leads.tracking.engagement.widget.get.labels.notRecorded",
                    )}
              </Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t(
                  "app.api.leads.tracking.engagement.widget.get.labels.leadStatusLabel",
                )}
              </Span>
              <Span
                className={cn(
                  "text-sm font-semibold",
                  data?.leadStatusUpdated
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground",
                )}
              >
                {data?.leadStatusUpdated
                  ? t(
                      "app.api.leads.tracking.engagement.widget.get.labels.updated",
                    )
                  : t(
                      "app.api.leads.tracking.engagement.widget.get.labels.unchanged",
                    )}
              </Span>
            </Div>
            <Div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-1">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t(
                  "app.api.leads.tracking.engagement.widget.get.labels.userLabel",
                )}
              </Span>
              <Span className="text-sm font-semibold">
                {data?.isLoggedIn
                  ? t(
                      "app.api.leads.tracking.engagement.widget.get.labels.loggedIn",
                    )
                  : t(
                      "app.api.leads.tracking.engagement.widget.get.labels.anonymous",
                    )}
              </Span>
            </Div>
          </Div>

          {/* Details */}
          <Div className="flex flex-col gap-0">
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.get.labels.leadId",
              )}
              value={leadId}
              mono
            />
            <MetadataRow
              label={t(
                "app.api.leads.tracking.engagement.widget.get.labels.campaignId",
              )}
              value={data?.responseCampaignId}
              mono
            />
            {data?.redirectUrl && (
              <MetadataRow
                label={t(
                  "app.api.leads.tracking.engagement.widget.get.labels.redirectUrl",
                )}
                value={data.redirectUrl}
                mono
              />
            )}
          </Div>

          {/* Post-action navigation */}
          <Div className="flex items-center gap-2 pt-1 border-t flex-wrap">
            <Span className="text-xs text-muted-foreground mr-auto">
              {t("app.api.leads.tracking.engagement.widget.get.nextSteps")}
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
                {t(
                  "app.api.leads.tracking.engagement.widget.get.openUrlButton",
                )}
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
                {t(
                  "app.api.leads.tracking.engagement.widget.get.viewLeadButton",
                )}
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
              {t(
                "app.api.leads.tracking.engagement.widget.get.leadStatsButton",
              )}
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
              {t("app.api.leads.tracking.engagement.widget.get.emptyTitle")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t(
                "app.api.leads.tracking.engagement.widget.get.emptyDescription",
              )}
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
              {t(
                "app.api.leads.tracking.engagement.widget.get.viewLeadStatsButton",
              )}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

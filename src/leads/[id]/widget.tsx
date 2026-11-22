/**
 * Lead Detail & Edit Widgets
 * - LeadDetailContainer: Tabbed view (Overview + Details + Identity) for GET endpoint
 * - LeadEditContainer: Tabbed edit form for PATCH endpoint
 */

"use client";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  CountriesArr,
  CountriesOptions,
  LanguagesArr,
  LanguagesOptions,
} from "next-vibe/core/i18n/core/config";
import {
  formatDate,
  formatSimpleDate,
} from "next-vibe/core/i18n/core/localization-utils";
import {
  DeviceType,
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "next-vibe/identity/lead/enum";
import {
  type LeadsT,
  scopedTranslation as leadsScopedTranslation,
} from "next-vibe/identity/lead/i18n";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/components/icons/ExternalLink";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Phone } from "next-vibe/ui/components/icons/Phone";
import { Save } from "next-vibe/ui/components/icons/Save";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Target } from "next-vibe/ui/components/icons/Target";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { User } from "next-vibe/ui/components/icons/User";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { ExternalLink } from "next-vibe/ui/components/link";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ProgressBlock } from "next-vibe/ui/components/progress-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Separator } from "next-vibe/ui/components/separator";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { Strong } from "next-vibe/ui/components/strong";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe/ui/components/tabs";
import { Textarea } from "next-vibe/ui/components/textarea";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  RelatedEntitiesPanel,
  type RelatedEntityItem,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { configScopedTranslation } from "@/env/i18n";
import leadsListDefinitions from "@/leads/list/definition";
import leadsSearchDefinitions from "@/leads/search/definition";
import { scopedTranslation as newsletterI18n } from "@/newsletter/i18n";

import { isBotFamily } from "../analytics/enum";
import {
  dimensionValueLabel,
  useLeadAnalyticsT,
  useLeadDrill,
} from "../analytics/widget-parts";
import type { LeadGetResponseOutput } from "./definition";
import definition from "./definition";
import { LeadLinkEvidence } from "./enum";

// ─── Enum type helpers ────────────────────────────────────────────────────────

/**
 * Drop null-valued entries from a metadata record so it matches the form field's
 * `Record<string, string | number | boolean>` type (which does not allow null).
 */
function stripNullValues(
  record: Record<string, string | number | boolean | null> | null | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!record) {
    return undefined;
  }
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== null) {
      out[key] = value;
    }
  }
  return out;
}

type LeadStatusValue = (typeof LeadStatus)[keyof typeof LeadStatus];
type LeadSourceValue = (typeof LeadSource)[keyof typeof LeadSource];
type EmailCampaignStageValue =
  (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
type CountryValue = (typeof CountriesArr)[number];
type LanguageValue = (typeof LanguagesArr)[number];

function asLeadStatus(v: string): LeadStatusValue | undefined {
  const values = Object.values(LeadStatus) as string[];
  return values.includes(v) ? (v as LeadStatusValue) : undefined;
}

function asLeadSource(v: string): LeadSourceValue | undefined {
  const values = Object.values(LeadSource) as string[];
  return values.includes(v) ? (v as LeadSourceValue) : undefined;
}

function asEmailCampaignStage(v: string): EmailCampaignStageValue | undefined {
  const values = Object.values(EmailCampaignStage) as string[];
  return values.includes(v) ? (v as EmailCampaignStageValue) : undefined;
}

function asCountry(v: string): CountryValue | undefined {
  return (CountriesArr as readonly string[]).includes(v)
    ? (v as CountryValue)
    : undefined;
}

function asLanguage(v: string): LanguageValue | undefined {
  return (LanguagesArr as readonly string[]).includes(v)
    ? (v as LanguageValue)
    : undefined;
}

// ─── Constants ───────────────────────────────────────────────────────────────

type PillVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

const STATUS_VARIANT: Record<string, PillVariant> = {
  [LeadStatus.NEW]: "info",
  [LeadStatus.PENDING]: "warning",
  [LeadStatus.CAMPAIGN_RUNNING]: "default",
  [LeadStatus.WEBSITE_USER]: "info",
  [LeadStatus.NEWSLETTER_SUBSCRIBER]: "info",
  [LeadStatus.IN_CONTACT]: "warning",
  [LeadStatus.SIGNED_UP]: "success",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: "success",
  [LeadStatus.UNSUBSCRIBED]: "muted",
};

const DEVICE_VARIANT: Record<string, PillVariant> = {
  [DeviceType.DESKTOP]: "info",
  [DeviceType.MOBILE]: "success",
  [DeviceType.TABLET]: "default",
  [DeviceType.BOT]: "danger",
  [DeviceType.UNKNOWN]: "muted",
};

const CAMPAIGN_FUNNEL_STAGE_KEYS = [
  {
    key: EmailCampaignStage.NOT_STARTED,
    labelKey: "widget.stageNotStarted" as const,
  },
  { key: EmailCampaignStage.INITIAL, labelKey: "widget.stageInitial" as const },
  {
    key: EmailCampaignStage.FOLLOWUP_1,
    labelKey: "widget.stageFollowup1" as const,
  },
  {
    key: EmailCampaignStage.FOLLOWUP_2,
    labelKey: "widget.stageFollowup2" as const,
  },
  {
    key: EmailCampaignStage.FOLLOWUP_3,
    labelKey: "widget.stageFollowup3" as const,
  },
  { key: EmailCampaignStage.NURTURE, labelKey: "widget.stageNurture" as const },
  {
    key: EmailCampaignStage.REACTIVATION,
    labelKey: "widget.stageReactivation" as const,
  },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function CopyButton({
  text,
  label,
}: {
  text: string;
  label?: string;
}): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const logger = useWidgetLogger();
  const handleCopy = useCallback((): void => {
    void copyToClipboard(text, logger).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
      return undefined;
    });
  }, [text, logger]);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 px-1.5 gap-1 text-muted-foreground hover:text-foreground"
      title={label ?? text}
    >
      {copied ? (
        <CheckCircle className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

function CampaignFunnel({
  currentStage,
}: {
  currentStage: string | null | undefined;
}): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const currentIndex = CAMPAIGN_FUNNEL_STAGE_KEYS.findIndex(
    (s) => s.key === currentStage,
  );
  return (
    <Div className="flex items-center gap-0.5 flex-wrap">
      {CAMPAIGN_FUNNEL_STAGE_KEYS.map((stage, idx) => {
        const isCurrent = stage.key === currentStage;
        const isPast = currentIndex >= 0 && idx < currentIndex;
        return (
          <React.Fragment key={stage.key}>
            <Div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : isPast
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-muted/50 text-muted-foreground border-transparent",
              )}
              title={t(stage.labelKey)}
            >
              {isPast && <Check className="h-2.5 w-2.5" />}
              {isCurrent && <Target className="h-2.5 w-2.5" />}
              <Span>{t(stage.labelKey)}</Span>
            </Div>
            {idx < CAMPAIGN_FUNNEL_STAGE_KEYS.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </Div>
  );
}

function daysSince(date: Date | string | null | undefined): number | null {
  if (!date) {
    return null;
  }
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return null;
  }
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Lead header (shared between view tabs) ───────────────────────────────────

function LeadHeader({
  businessName,
  email,
  contactName,
  leadId,
  status,
  isConverted,
  t,
  leadsT,
}: {
  businessName: string | null | undefined;
  email: string | null | undefined;
  contactName: string | null | undefined;
  leadId: string | null | undefined;
  status:
    | NonNullable<LeadGetResponseOutput["lead"]>["basicInfo"]["status"]
    | null
    | undefined;
  isConverted: boolean;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: LeadsT;
}): React.JSX.Element {
  return (
    <SectionGroup
      title=""
      subtitle={
        <Div className="flex items-start gap-4 w-full">
          <Div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
            {(businessName ?? email ?? "?").slice(0, 2).toUpperCase()}
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex flex-wrap items-center gap-2 mb-1">
              <Strong className="text-lg font-bold">
                {businessName ?? "—"}
              </Strong>
              {status && (
                <StatusPill
                  status={leadsT(status)}
                  variant={STATUS_VARIANT[status] ?? "default"}
                />
              )}
              {isConverted && (
                <StatusPill status={t("widget.converted")} variant="success" />
              )}
            </Div>
            {contactName && (
              <P className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {contactName}
              </P>
            )}
            {email && (
              <Div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <P className="text-sm text-muted-foreground">{email}</P>
                <CopyButton text={email} label={t("widget.copyEmail")} />
              </Div>
            )}
            {leadId && (
              <Div className="flex items-center gap-1 mt-0.5">
                <P className="text-xs text-muted-foreground/60 font-mono">
                  {leadId}
                </P>
                <CopyButton text={leadId} label={t("widget.copyId")} />
              </Div>
            )}
          </Div>
        </Div>
      }
    />
  );
}

// ─── Overview tab content ─────────────────────────────────────────────────────

function OverviewTab({
  data,
  locale,
  t,
  leadsT,
  onEdit,
  onDelete,
  onSendTestEmail,
  onViewInSearch,
  onViewUserProfile,
}: {
  data: NonNullable<LeadGetResponseOutput["lead"]>;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: LeadsT;
  onEdit: () => void;
  onDelete: () => void;
  onSendTestEmail: () => void;
  onViewInSearch: () => void;
  onViewUserProfile: (id: string) => void;
}): React.JSX.Element {
  const {
    basicInfo,
    contactDetails,
    campaignTracking,
    engagement,
    conversion,
    metadata,
  } = data;

  const openRate =
    campaignTracking.emailsSent > 0
      ? Math.round(
          (engagement.emailsOpened / campaignTracking.emailsSent) * 100,
        )
      : 0;
  const clickRate =
    campaignTracking.emailsSent > 0
      ? Math.round(
          (engagement.emailsClicked / campaignTracking.emailsSent) * 100,
        )
      : 0;
  const clickToOpenRate =
    engagement.emailsOpened > 0
      ? Math.round((engagement.emailsClicked / engagement.emailsOpened) * 100)
      : 0;
  const leadAgeDays = daysSince(
    metadata.createdAt instanceof Date
      ? metadata.createdAt
      : String(metadata.createdAt),
  );
  const daysSinceEngagement = daysSince(
    engagement.lastEngagementAt instanceof Date
      ? engagement.lastEngagementAt
      : engagement.lastEngagementAt !== null &&
          engagement.lastEngagementAt !== undefined
        ? String(engagement.lastEngagementAt)
        : null,
  );

  return (
    <Div className="flex flex-col gap-4">
      {/* Quick age & engagement bar */}
      <Div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground rounded-lg border p-3">
        {leadAgeDays !== null && (
          <Div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <Span>
              <Strong className="font-semibold text-foreground">
                {leadAgeDays}
              </Strong>{" "}
              {t("widget.daysOld")}
            </Span>
          </Div>
        )}
        {daysSinceEngagement !== null && (
          <Div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <Span>
              {t("widget.lastEngaged")}{" "}
              <Strong className="font-semibold text-foreground">
                {daysSinceEngagement}d
              </Strong>{" "}
              {t("widget.ago")}
            </Span>
          </Div>
        )}
        {campaignTracking.emailJourneyVariant && (
          <Div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <Span>
              {t("widget.variant")}{" "}
              <Strong className="font-semibold text-foreground">
                {leadsT(campaignTracking.emailJourneyVariant)}
              </Strong>
            </Span>
          </Div>
        )}
      </Div>

      {/* Quick actions */}
      <SectionGroup title={t("widget.quickActions")}>
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("widget.editLead")}
          </Button>
          {basicInfo.email && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSendTestEmail}
                className="gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                {t("widget.sendTestEmail")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onViewInSearch}
                className="gap-1.5"
              >
                <Search className="h-3.5 w-3.5" />
                {t("widget.viewInSearch")}
              </Button>
            </>
          )}
          {conversion.convertedUserId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewUserProfile(conversion.convertedUserId!)}
              className="gap-1.5"
            >
              <User className="h-3.5 w-3.5" />
              {t("widget.userProfile")}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("widget.delete")}
          </Button>
        </Div>
      </SectionGroup>

      {/* Campaign funnel */}
      <SectionGroup title={t("widget.campaignFunnel")}>
        <CampaignFunnel currentStage={campaignTracking.currentCampaignStage} />
        {campaignTracking.source && (
          <Div className="mt-2 flex items-center gap-2">
            <P className="text-xs text-muted-foreground">
              {t("widget.sourceLabel")}
            </P>
            <Badge variant="outline" className="text-xs">
              {leadsT(campaignTracking.source)}
            </Badge>
          </Div>
        )}
        {campaignTracking.lastEmailSentAt && (
          <P className="text-xs text-muted-foreground mt-2">
            {t("widget.lastEmailLabel")}{" "}
            {formatSimpleDate(campaignTracking.lastEmailSentAt, locale)}
          </P>
        )}
      </SectionGroup>

      {/* Campaign performance */}
      <SectionGroup title={t("widget.campaignPerformance")}>
        <MetricGrid columns={3}>
          <MetricCard
            label={t("widget.emailsSent")}
            value={campaignTracking.emailsSent}
            variant="info"
          />
          <MetricCard
            label={t("widget.opened")}
            value={engagement.emailsOpened}
            variant="success"
          />
          <MetricCard
            label={t("widget.clicked")}
            value={engagement.emailsClicked}
            variant="default"
          />
        </MetricGrid>
        <Div className="flex flex-col gap-3 mt-3">
          <ProgressBlock
            value={openRate}
            label={t("widget.openRate")}
            variant={openRate > 50 ? "success" : "default"}
          />
          <ProgressBlock
            value={clickRate}
            label={t("widget.clickRate")}
            variant={clickRate > 10 ? "success" : "default"}
          />
          {engagement.emailsOpened > 0 && (
            <ProgressBlock
              value={clickToOpenRate}
              label={t("widget.clickToOpenRate")}
              variant={clickToOpenRate > 20 ? "success" : "default"}
            />
          )}
        </Div>
      </SectionGroup>

      {/* Contact details */}
      <SectionGroup title={t("widget.contactDetails")}>
        <DetailGrid columns={2}>
          {contactDetails.phone && (
            <Div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <P className="text-sm">{contactDetails.phone}</P>
              <CopyButton
                text={contactDetails.phone}
                label={t("widget.copyPhone")}
              />
            </Div>
          )}
          {contactDetails.website && (
            <Div className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <ExternalLink
                href={contactDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-info hover:underline truncate flex items-center gap-1"
              >
                {contactDetails.website}
                <ExternalLinkIcon className="h-3 w-3 flex-shrink-0" />
              </ExternalLink>
            </Div>
          )}
          <DetailField
            label={t("widget.country")}
            value={contactDetails.country}
          />
          <DetailField
            label={t("widget.language")}
            value={contactDetails.language}
          />
        </DetailGrid>
      </SectionGroup>
    </Div>
  );
}

// ─── Details tab content ──────────────────────────────────────────────────────

function DetailsTab({
  data,
  locale,
  t,
}: {
  data: NonNullable<LeadGetResponseOutput["lead"]>;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  const { engagement, conversion, metadata } = data;
  const hasSubscription = Boolean(conversion.subscriptionConfirmedAt);

  return (
    <Div className="flex flex-col gap-4">
      {/* Engagement */}
      <SectionGroup title={t("widget.engagement")}>
        <DetailGrid columns={2}>
          <DetailField
            label={t("widget.emailsOpened")}
            value={String(engagement.emailsOpened)}
          />
          <DetailField
            label={t("widget.emailsClicked")}
            value={String(engagement.emailsClicked)}
          />
          {engagement.lastEngagementAt && (
            <DetailField
              label={t("widget.lastEngagement")}
              value={formatSimpleDate(engagement.lastEngagementAt, locale)}
            />
          )}
        </DetailGrid>
        {engagement.unsubscribedAt && (
          <ResultBanner
            variant="danger"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            title={t("widget.unsubscribed")}
            message={formatSimpleDate(engagement.unsubscribedAt, locale)}
            className="mt-3"
          />
        )}
      </SectionGroup>

      {/* Conversion */}
      {(conversion.signedUpAt ??
        conversion.convertedUserId ??
        conversion.subscriptionConfirmedAt ??
        conversion.convertedAt) && (
        <SectionGroup title={t("widget.conversion")}>
          <DetailGrid columns={2}>
            {conversion.signedUpAt && (
              <DetailField
                label={t("widget.signedUp")}
                value={formatSimpleDate(conversion.signedUpAt, locale)}
              />
            )}
            {conversion.convertedAt && (
              <DetailField
                label={t("widget.convertedAt")}
                value={formatSimpleDate(conversion.convertedAt, locale)}
              />
            )}
            {conversion.subscriptionConfirmedAt && (
              <DetailField
                label={t("widget.subscriptionConfirmed")}
                value={formatSimpleDate(
                  conversion.subscriptionConfirmedAt,
                  locale,
                )}
              />
            )}
            {conversion.convertedUserId && (
              <DetailField
                label={t("widget.convertedUserId")}
                value={conversion.convertedUserId}
                mono
                copyable
              />
            )}
          </DetailGrid>
          {hasSubscription && (
            <ResultBanner
              variant="success"
              icon={<CreditCard className="h-4 w-4" />}
              title={`${t("widget.activeSubscriberSince")} ${formatSimpleDate(
                conversion.subscriptionConfirmedAt!,
                locale,
              )}`}
              className="mt-3"
            />
          )}
        </SectionGroup>
      )}

      {/* Notes & Metadata */}
      {(metadata.notes ?? Object.keys(metadata.metadata ?? {}).length > 0) && (
        <SectionGroup title={t("widget.notesAndMetadata")}>
          {metadata.notes && (
            <Div>
              <P className="text-xs text-muted-foreground mb-1">
                {t("widget.notes")}
              </P>
              <P className="text-sm whitespace-pre-wrap">{metadata.notes}</P>
            </Div>
          )}
          {metadata.metadata && Object.keys(metadata.metadata).length > 0 && (
            <>
              <Separator className="my-3" />
              <Div>
                <P className="text-xs text-muted-foreground mb-2">
                  {t("widget.metadata")}
                </P>
                <DetailGrid columns={2}>
                  {Object.entries(metadata.metadata).map(([key, val]) => (
                    <DetailField key={key} label={key} value={String(val)} />
                  ))}
                </DetailGrid>
              </Div>
            </>
          )}
        </SectionGroup>
      )}

      {/* Timestamps */}
      <SectionGroup title="">
        <DetailGrid columns={2}>
          <Div>
            <DetailField
              label={t("widget.created")}
              value={formatSimpleDate(metadata.createdAt, locale)}
            />
            {daysSince(
              metadata.createdAt instanceof Date
                ? metadata.createdAt
                : String(metadata.createdAt),
            ) !== null && (
              <P className="text-xs text-muted-foreground">
                (
                {daysSince(
                  metadata.createdAt instanceof Date
                    ? metadata.createdAt
                    : String(metadata.createdAt),
                )}{" "}
                {t("widget.daysOld")})
              </P>
            )}
          </Div>
          <DetailField
            label={t("widget.lastUpdated")}
            value={formatSimpleDate(metadata.updatedAt, locale)}
          />
        </DetailGrid>
      </SectionGroup>
    </Div>
  );
}

// ─── Identity tab content ──────────────────────────────────────────────────────

type LeadReview = LeadGetResponseOutput["review"];
type DetailT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function JourneyOverview({
  lead,
  review,
  locale,
  t,
  leadsT,
}: {
  lead: LeadGetResponseOutput["lead"];
  review: LeadReview;
  locale: CountryLanguage;
  t: DetailT;
  leadsT: LeadsT;
}): React.JSX.Element {
  const navigate = useRelatedEntityNavigation();
  const leadId = lead.basicInfo.id;
  const nextEmail = review?.nextEmailAt;
  const showQueue =
    nextEmail || lead.basicInfo.status === LeadStatus.CAMPAIGN_RUNNING;

  return (
    <Div className="flex min-w-0 flex-col gap-4">
      {showQueue && (
        <RelatedEntitiesPanel
          title={t("journey.campaign")}
          emptyTitle={t("journey.noQueue")}
          items={[
            {
              id: leadId,
              title: nextEmail
                ? t("journey.emailScheduled")
                : t("journey.campaignRunning"),
              subtitle: nextEmail
                ? formatDate(new Date(nextEmail), locale, "PPp")
                : review
                  ? t("journey.noQueue")
                  : undefined,
              action: {
                label: t("journey.openQueue"),
                onClick: () =>
                  navigate(
                    async () =>
                      (await import("@/leads/campaigns/queue/definition"))
                        .default.GET,
                    { data: { leadId, page: 1 } },
                  ),
              },
            },
          ]}
        />
      )}
      <SectionGroup title={t("journey.title")} subtitle={t("journey.subtitle")}>
        {review ? (
          <Div className="flex min-w-0 flex-col gap-2">
            {review.events.map((event) => (
              <ListItem
                key={event.id}
                title={
                  event.engagementType
                    ? leadsT(event.engagementType)
                    : t(event.kind)
                }
                subtitle={formatDate(new Date(event.date), locale, "PPp")}
                meta={
                  event.detail && (
                    <Span className="break-all">{event.detail}</Span>
                  )
                }
              />
            ))}
          </Div>
        ) : (
          <EmptyBlock title={t("journey.unavailable")} className="py-3" />
        )}
      </SectionGroup>
    </Div>
  );
}

/** Same threshold as the abuse report default. */
const BURST_MIN_LEADS = 10;

/** First day of the trailing 30-day window (called from click handlers). */
function since(): string {
  return new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
}

function TrafficSection({
  traffic,
  locale,
  t,
}: {
  traffic: NonNullable<LeadGetResponseOutput["traffic"]>;
  locale: CountryLanguage;
  t: DetailT;
}): React.JSX.Element {
  const st = useLeadAnalyticsT(locale);
  const drill = useLeadDrill();
  const isBot = isBotFamily(traffic.botFamily);
  const firstTouch = [
    dimensionValueLabel(traffic.channelType, st),
    traffic.channel && traffic.channel !== "direct" ? traffic.channel : null,
    traffic.source,
    traffic.medium,
    traffic.campaign,
  ].filter((part): part is string => Boolean(part));
  return (
    <SectionGroup title={t("traffic.title")} subtitle={t("traffic.subtitle")}>
      <DetailGrid columns={2}>
        <Div>
          <P className="text-xs text-muted-foreground">{t("traffic.agent")}</P>
          <Div className="mt-0.5 flex flex-wrap gap-1">
            <StatusPill
              status={dimensionValueLabel(traffic.botFamily, st)}
              variant={isBot ? "danger" : "success"}
            />
            {traffic.prefixLeads30d >= BURST_MIN_LEADS && (
              <StatusPill
                status={t("traffic.burstNetwork", {
                  count: traffic.prefixLeads30d,
                })}
                variant="warning"
              />
            )}
            {traffic.uaLeads30d >= BURST_MIN_LEADS && (
              <StatusPill
                status={t("traffic.sharedAgent", {
                  count: traffic.uaLeads30d,
                })}
                variant="warning"
              />
            )}
          </Div>
        </Div>
        <DetailField
          label={t("traffic.firstTouch")}
          value={firstTouch.join(" · ")}
        />
        <DetailField
          label={t("traffic.referrer")}
          value={traffic.referrerHost}
        />
        <DetailField
          label={t("traffic.landingPath")}
          value={traffic.landingPath}
          mono
        />
        <DetailField
          label={t("traffic.refCode")}
          value={traffic.refCode}
          mono
        />
        <DetailField
          label={t("traffic.freeCredits")}
          value={traffic.freeCreditsBurned.toLocaleString(locale, {
            maximumFractionDigits: 2,
          })}
        />
        {traffic.ipPrefix && (
          <Div className="flex items-end justify-between gap-2">
            <DetailField
              label={t("traffic.network")}
              value={
                <Span className="flex flex-col">
                  <Span className="font-mono">{traffic.ipPrefix}</Span>
                  <Span className="text-xs text-muted-foreground">
                    {t("traffic.agentLeadsIn30d", {
                      count: traffic.prefixLeads30d,
                    })}
                  </Span>
                </Span>
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                drill({
                  ipPrefix: traffic.ipPrefix ?? undefined,
                  createdFrom: since(),
                })
              }
            >
              {t("traffic.openLeads")}
            </Button>
          </Div>
        )}
        {traffic.uaFingerprint && (
          <Div className="flex items-end justify-between gap-2">
            <DetailField
              label={t("traffic.sameAgent")}
              value={t("traffic.agentLeadsIn30d", {
                count: traffic.uaLeads30d,
              })}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                drill({
                  uaFingerprint: traffic.uaFingerprint ?? undefined,
                  createdFrom: since(),
                })
              }
            >
              {t("traffic.openLeads")}
            </Button>
          </Div>
        )}
      </DetailGrid>
    </SectionGroup>
  );
}

function LinkedIdentitiesTab({
  data,
  review,
  locale,
  t,
  leadsT,
  onViewUserProfile,
}: {
  data: LeadGetResponseOutput["lead"];
  review: LeadReview;
  locale: CountryLanguage;
  t: DetailT;
  leadsT: LeadsT;
  onViewUserProfile: (id: string) => void;
}): React.JSX.Element {
  const {
    identity,
    lifecycle,
    linkedLeads,
    linkedUsers,
    conversion,
    basicInfo,
  } = data;
  const navigate = useRelatedEntityNavigation();
  const newsletterT = newsletterI18n.scopedT(locale).t;
  const localDate = (date: Date): string =>
    formatDate(new Date(date), locale, "PPp");
  const evidenceLabel = (reason: string): string => {
    const evidence = Object.entries(LeadLinkEvidence).find(
      ([key]) => key === reason,
    );
    return evidence ? t(evidence[1]) : reason;
  };
  const legacyAccounts: RelatedEntityItem[] = linkedUsers.map((link) => ({
    id: link.userId,
    title: link.publicName || link.email,
    subtitle: link.email,
    meta: [evidenceLabel(link.linkReason), localDate(link.linkedAt)].join(
      " · ",
    ),
    action: {
      label: t("journey.openAccount"),
      onClick: () => onViewUserProfile(link.userId),
    },
  }));
  if (
    conversion.convertedUserId &&
    !legacyAccounts.some(({ id }) => id === conversion.convertedUserId)
  ) {
    const userId = conversion.convertedUserId;
    legacyAccounts.push({
      id: userId,
      title: userId,
      subtitle: t("journey.recordedConversion"),
      meta: conversion.convertedAt
        ? localDate(conversion.convertedAt)
        : undefined,
      action: {
        label: t("journey.openAccount"),
        onClick: () => onViewUserProfile(userId),
      },
    });
  }
  if (
    review?.attributedUserId &&
    !legacyAccounts.some(({ id }) => id === review.attributedUserId)
  ) {
    const userId = review.attributedUserId;
    legacyAccounts.push({
      id: userId,
      title: userId,
      subtitle: t("journey.attributedAccount"),
      meta: t("journey.attributionOnly"),
      action: {
        label: t("journey.openAccount"),
        onClick: () => onViewUserProfile(userId),
      },
    });
  }

  const linkedAccounts =
    review?.accountAssociations?.map((record): RelatedEntityItem => {
      const meta = (
        <Div className="flex w-full min-w-0 flex-col gap-1 [overflow-wrap:anywhere]">
          <Span>{t("journey.leadReference", { id: record.leadId })}</Span>
          <Span>{t("journey.accountReference", { id: record.userId })}</Span>
          <Span>
            {[
              record.reason
                ? evidenceLabel(record.reason)
                : t(record.association),
              record.recordedAt ? localDate(record.recordedAt) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Span>
        </Div>
      );
      return {
        id: `${record.leadId}/${record.userId}/${record.association}`,
        title: record.publicName || record.email || record.userId,
        subtitle: record.email ?? undefined,
        meta,
        action: {
          label: t("journey.openAccount"),
          onClick: () => onViewUserProfile(record.userId),
        },
      };
    }) ?? legacyAccounts;

  const evidenceById = new Map(
    review?.relatedLeadEvidence?.map((record) => [record.leadId, record]),
  );
  const touchSummary = (
    date: Date,
    channel: string,
    source: string | null,
    campaign: string | null,
  ): string =>
    [localDate(date), channel, source === channel ? null : source, campaign]
      .filter(Boolean)
      .join(" · ");

  const relatedLeads = linkedLeads.map((link): RelatedEntityItem => {
    const badge = (
      <StatusPill
        status={leadsT(link.status)}
        variant={STATUS_VARIANT[link.status] ?? "default"}
      />
    );
    const record = evidenceById.get(link.linkedLeadId);
    const attribution = record?.attribution;
    const linkEvidence = [
      evidenceLabel(link.linkReason),
      localDate(link.linkedAt),
      link.ipAddress,
    ]
      .filter(Boolean)
      .join(" · ");
    const meta = (
      <Div className="flex w-full min-w-0 flex-col gap-1 [overflow-wrap:anywhere]">
        <Span>{linkEvidence}</Span>
        <Span>{t("journey.leadReference", { id: link.linkedLeadId })}</Span>
        {record ? (
          <>
            <Span>
              {t("journey.leadSource", { source: leadsT(record.source) })}
            </Span>
            <Span>
              {record.guestConsentAt
                ? t("journey.guestConsentOn", {
                    date: localDate(record.guestConsentAt),
                  })
                : t("journey.guestConsentMissing")}
            </Span>
            {record.guestConsentVersion !== null ? (
              <Span>
                {t("journey.consentVersion", {
                  version: record.guestConsentVersion,
                })}
              </Span>
            ) : record.guestConsentAt ? (
              <Span>{t("journey.consentVersionMissing")}</Span>
            ) : null}
            {attribution ? (
              <>
                <Span>
                  {t("journey.firstTouch", {
                    touch: touchSummary(
                      attribution.firstTouchAt,
                      attribution.firstChannel,
                      attribution.firstSource,
                      attribution.firstCampaign,
                    ),
                  })}
                </Span>
                <Span>
                  {t("journey.lastTouch", {
                    touch: touchSummary(
                      attribution.lastTouchAt,
                      attribution.lastChannel,
                      attribution.lastSource,
                      attribution.lastCampaign,
                    ),
                  })}
                </Span>
              </>
            ) : (
              <Span>{t("journey.attributionMissing")}</Span>
            )}
          </>
        ) : (
          <Span>{t("journey.linkEvidenceUnavailable")}</Span>
        )}
      </Div>
    );
    return {
      id: link.linkedLeadId,
      title: link.businessName || link.email || link.linkedLeadId,
      subtitle: link.email ?? undefined,
      badges: badge,
      meta,
      action: {
        label: t("journey.openLead"),
        onClick: () =>
          navigate(async () => (await import("./definition")).default.GET, {
            urlPathParams: { id: link.linkedLeadId },
          }),
      },
    };
  });
  const wallets =
    review?.wallets.map(({ id, leadId, userId }): RelatedEntityItem => {
      const walletId = <Span className="break-all">{id}</Span>;
      return {
        id,
        title:
          leadId === basicInfo.id
            ? t("journey.thisLeadWallet")
            : userId
              ? t("journey.accountWallet")
              : t("journey.relatedLeadWallet"),
        subtitle: userId
          ? t("journey.accountReference", { id: userId })
          : leadId
            ? t("journey.leadReference", { id: leadId })
            : undefined,
        meta: walletId,
      };
    }) ?? [];
  const subscriptions =
    review?.newsletter.map((subscription): RelatedEntityItem => {
      const badge = (
        <StatusPill status={newsletterT(subscription.status)} variant="muted" />
      );
      const consent = t(
        subscription.marketingConsent
          ? "journey.consentRecorded"
          : "journey.consentAbsent",
      );
      const confirmation = subscription.confirmedAt
        ? t("journey.confirmedOn", {
            date: localDate(subscription.confirmedAt),
          })
        : t("journey.confirmationMissing");
      const optOut = subscription.unsubscribedDate
        ? t("journey.optedOutOn", {
            date: localDate(subscription.unsubscribedDate),
          })
        : t("journey.optOutDateMissing");
      const owners = [
        subscription.leadId
          ? t("journey.leadReference", { id: subscription.leadId })
          : undefined,
        subscription.userId
          ? t("journey.accountReference", { id: subscription.userId })
          : undefined,
      ]
        .filter(Boolean)
        .join(" · ");
      const meta = (
        <Div className="flex w-full min-w-0 flex-col gap-1 [overflow-wrap:anywhere]">
          {owners && <Span>{owners}</Span>}
          <Span>{[consent, confirmation, optOut].join(" · ")}</Span>
        </Div>
      );
      return {
        id: subscription.id,
        title: subscription.email,
        badges: badge,
        meta,
      };
    }) ?? [];

  return (
    <Div className="flex flex-col gap-4">
      <RelatedEntitiesPanel
        title={t("widget.linkedLeadsSection")}
        emptyTitle={t("widget.linkedLeadsEmpty")}
        subtitle={t("journey.attributionOnly")}
        items={relatedLeads}
      />
      <RelatedEntitiesPanel
        title={t("widget.linkedUsersSection")}
        emptyTitle={t("widget.linkedUsersEmpty")}
        items={linkedAccounts}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() =>
          navigate(
            async () =>
              (await import("@/leads/attribution/definition")).default.POST,
            {
              data: { dryRun: true },
            },
          )
        }
      >
        {t("journey.previewIpMatches")}
      </Button>
      {!review && (
        <P className="text-sm text-muted-foreground">
          {t("journey.reviewUnavailable")}
        </P>
      )}
      {review && (
        <>
          <RelatedEntitiesPanel
            title={t("journey.wallets")}
            emptyTitle={t("journey.noWallets")}
            items={wallets}
          />
          <RelatedEntitiesPanel
            title={t("journey.newsletterConsent")}
            emptyTitle={t("journey.noNewsletter")}
            items={subscriptions}
          />
          <SectionGroup title={t("journey.guestConsent")}>
            <P className="text-sm">
              {review.guestConsentAt
                ? localDate(review.guestConsentAt)
                : t("journey.consentAbsent")}
            </P>
            {review.guestConsentVersion !== null && (
              <P className="text-sm text-muted-foreground">
                {t("journey.consentVersion", {
                  version: review.guestConsentVersion,
                })}
              </P>
            )}
          </SectionGroup>
        </>
      )}
      {/* Device & Identity */}
      <SectionGroup title={t("widget.deviceIdentity")}>
        <DetailGrid columns={2}>
          {identity.ipAddress && (
            <Div className="flex items-center gap-1 col-span-2">
              <Div className="flex-1 min-w-0">
                <DetailField
                  label={t("widget.ipAddress")}
                  value={identity.ipAddress}
                  mono
                  copyable
                />
              </Div>
            </Div>
          )}
          {identity.deviceType && (
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("widget.deviceType")}
              </P>
              <StatusPill
                status={leadsT(identity.deviceType)}
                variant={DEVICE_VARIANT[identity.deviceType] ?? "muted"}
                className="mt-0.5"
              />
            </Div>
          )}
          <DetailField label={t("widget.browser")} value={identity.browser} />
          <DetailField label={t("widget.os")} value={identity.os} />
          {identity.referralCode && (
            <DetailField
              label={t("widget.referralCode")}
              value={identity.referralCode}
              mono
              className="col-span-2"
            />
          )}
          {identity.userAgent && (
            <Div className="col-span-2">
              <P className="text-xs text-muted-foreground">
                {t("widget.userAgent")}
              </P>
              <P className="text-xs font-mono text-muted-foreground/80 mt-0.5 break-all leading-relaxed">
                {identity.userAgent}
              </P>
            </Div>
          )}
        </DetailGrid>
      </SectionGroup>

      {/* Lifecycle timestamps */}
      {(lifecycle.bouncedAt ??
        lifecycle.invalidAt ??
        lifecycle.campaignStartedAt) && (
        <SectionGroup title={t("widget.lifecycleTimestamps")}>
          <DetailGrid columns={2}>
            {lifecycle.campaignStartedAt && (
              <DetailField
                label={t("widget.campaignStartedAt")}
                value={formatSimpleDate(lifecycle.campaignStartedAt, locale)}
              />
            )}
            {lifecycle.bouncedAt && (
              <Div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                <DetailField
                  label={t("widget.bouncedAt")}
                  value={formatSimpleDate(lifecycle.bouncedAt, locale)}
                />
              </Div>
            )}
            {lifecycle.invalidAt && (
              <Div className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
                <DetailField
                  label={t("widget.invalidAt")}
                  value={formatSimpleDate(lifecycle.invalidAt, locale)}
                />
              </Div>
            )}
          </DetailGrid>
        </SectionGroup>
      )}
    </Div>
  );
}

// ─── LeadDetailContainer (GET widget) ────────────────────────────────────────

export function LeadDetailContainer(): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const navigate = useRelatedEntityNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const endpointMutations = useWidgetEndpointMutations();
  const [activeTab, setActiveTab] = useState("overview");

  const fieldValue = useWidgetValue<typeof definition.GET>();
  const isLoading = endpointMutations?.read?.isLoading ?? false;
  const { response } = useWidgetContext();
  const data = fieldValue?.lead;
  const leadId = data?.basicInfo?.id;

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      navigation.push(leadsListDefinitions.GET);
    }
  }, [navigation]);

  const handleEdit = useCallback((): void => {
    if (!leadId || !data) {
      return;
    }
    navigation.push(definition.PATCH, {
      urlPathParams: { id: leadId },
      data: {
        email: data.basicInfo.email ?? undefined,
        businessName: data.basicInfo.businessName ?? undefined,
        contactName: data.basicInfo.contactName ?? undefined,
        status: data.basicInfo.status ?? undefined,
        phone: data.contactDetails.phone ?? undefined,
        website: data.contactDetails.website ?? undefined,
        country: data.contactDetails.country ?? undefined,
        language: data.contactDetails.language ?? undefined,
        source: data.campaignTracking.source ?? undefined,
        currentCampaignStage:
          data.campaignTracking.currentCampaignStage ?? undefined,
        notes: data.metadata.notes ?? undefined,
        metadata: stripNullValues(data.metadata.metadata),
        convertedUserId: data.conversion.convertedUserId ?? undefined,
        subscriptionConfirmedAt: data.conversion.subscriptionConfirmedAt
          ? new Date(data.conversion.subscriptionConfirmedAt)
          : undefined,
      },
      popNavigationOnSuccess: 1,
      onSuccessCallback: () => {
        endpointMutations?.read?.refetch?.();
      },
    });
  }, [navigation, leadId, data, endpointMutations]);

  const handleDelete = useCallback((): void => {
    if (!leadId) {
      return;
    }
    navigation.push(definition.DELETE, {
      urlPathParams: { id: leadId },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  }, [navigation, leadId]);

  const handleViewUserProfile = (userId: string): void => {
    navigate(
      async () => (await import("@/users/view/definition")).default.GET,
      {
        data: { userId },
      },
    );
  };

  const handleSendTestEmail = useCallback((): void => {
    void (async (): Promise<void> => {
      const testMailDef =
        await import("@/leads/campaigns/emails/test-mail/definition");
      navigation.push(testMailDef.default.POST, {
        renderInModal: true,
        data: undefined,
      });
    })();
  }, [navigation]);

  const handleViewInSearch = useCallback((): void => {
    navigation.push(leadsSearchDefinitions.GET);
  }, [navigation]);

  if (!fieldValue) {
    if (isLoading) {
      return (
        <WidgetShell>
          <LoadingBlock message={t("widget.loading")} />
        </WidgetShell>
      );
    }
    if (
      response?.success === false &&
      navigation.current?.params?.urlPathParams?.id
    ) {
      return (
        <WidgetShell>
          <EmptyBlock
            title={response.message}
            action={{ label: t("widget.back"), onClick: handleBack }}
          />
        </WidgetShell>
      );
    }
    return (
      <WidgetShell>
        <Div className="flex items-center justify-center h-full py-16">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              navigation.push(leadsSearchDefinitions.GET, {
                renderInModal: true,
                pickerCallback: (picked) => {
                  const lead = picked as { id: string };
                  navigation.replace(definition.GET, {
                    urlPathParams: { id: lead.id },
                  });
                },
              });
            }}
          >
            <Search className="h-4 w-4" />
            {t("widget.selectLead")}
          </Button>
        </Div>
      </WidgetShell>
    );
  }

  if (!data) {
    return (
      <WidgetShell>
        <EmptyBlock
          icon={<AlertCircle className="h-8 w-8" />}
          title={t("widget.notFound")}
          action={{
            label: t("widget.back"),
            onClick: handleBack,
          }}
        />
      </WidgetShell>
    );
  }

  const { basicInfo, conversion } = data;
  const identityCount =
    data.linkedLeads.length +
    (fieldValue.review?.accountAssociations?.length ?? data.linkedUsers.length);

  const headerActions = (
    <Div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        aria-label={t("widget.edit")}
        className="gap-1"
      >
        <Pencil className="h-4 w-4" />
        <Span className="hidden @sm:inline">{t("widget.edit")}</Span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        aria-label={t("widget.delete")}
        className="gap-1 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <Span className="hidden @sm:inline">{t("widget.delete")}</Span>
      </Button>
    </Div>
  );

  return (
    <WidgetShell padding="none">
      {/* Top action bar */}
      <Div className="px-4 pt-4">
        <WidgetHeader
          title={
            basicInfo.businessName ??
            basicInfo.email ??
            t("widget.leadFallbackTitle")
          }
          backButton={
            <Button variant="outline" size="sm" onClick={handleBack}>
              {t("widget.back")}
            </Button>
          }
          actions={headerActions}
        />
      </Div>

      <Div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        <LeadHeader
          businessName={basicInfo.businessName}
          email={basicInfo.email}
          contactName={basicInfo.contactName}
          leadId={leadId}
          status={basicInfo.status}
          isConverted={Boolean(conversion.convertedUserId)}
          t={t}
          leadsT={leadsT}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              {t("widget.tabOverview")}
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-1">
              {t("widget.tabDetails")}
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex-1 relative">
              {t("widget.tabIdentity")}
              {identityCount > 0 && (
                <Span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary px-1 text-primary-foreground text-[10px] font-bold min-w-4 h-4">
                  {identityCount}
                </Span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
            <JourneyOverview
              lead={data}
              review={fieldValue.review}
              locale={locale}
              t={t}
              leadsT={leadsT}
            />
            {fieldValue.traffic && (
              <TrafficSection
                traffic={fieldValue.traffic}
                locale={locale}
                t={t}
              />
            )}
            <OverviewTab
              data={data}
              locale={locale}
              t={t}
              leadsT={leadsT}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSendTestEmail={handleSendTestEmail}
              onViewInSearch={handleViewInSearch}
              onViewUserProfile={handleViewUserProfile}
            />
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <DetailsTab data={data} locale={locale} t={t} />
          </TabsContent>

          <TabsContent value="identity" className="mt-4">
            <LinkedIdentitiesTab
              data={data}
              review={fieldValue.review}
              locale={locale}
              t={t}
              leadsT={leadsT}
              onViewUserProfile={handleViewUserProfile}
            />
          </TabsContent>
        </Tabs>
      </Div>
    </WidgetShell>
  );
}

// ─── FormField helper ─────────────────────────────────────────────────────────

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </Div>
  );
}

// ─── LeadEditContainer (PATCH widget) ────────────────────────────────────────

export function LeadEditContainer(): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const { locale: leadsLocale } = useTranslation();
  const { t: tGlobal } = configScopedTranslation.scopedT(leadsLocale);
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.PATCH>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const patchValue = useWidgetValue<typeof definition.PATCH>();
  const [activeTab, setActiveTab] = useState("basic");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const leadId = form.watch("id");

  // Prefill flat form fields from GET response data.
  // When navigated with prefillFromGet: true, the GET response is passed as field.value
  // (typed as LeadPatchResponseOutput but at runtime contains { lead: { basicInfo: {...} } }).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- patchValue contains GET response data at runtime when prefillFromGet: true
  const fieldLead = (patchValue as Record<string, any>)
    ?.lead as LeadGetResponseOutput["lead"];
  const prefillAppliedRef = useRef<string | undefined>(undefined);
  const nestedLeadId = fieldLead?.basicInfo?.id;
  useEffect(() => {
    if (!fieldLead?.basicInfo?.id) {
      return;
    }
    if (prefillAppliedRef.current === fieldLead.basicInfo.id) {
      return;
    }
    prefillAppliedRef.current = fieldLead.basicInfo.id;
    const nestedLead = fieldLead;
    const {
      basicInfo,
      contactDetails,
      campaignTracking,
      metadata,
      conversion,
    } = nestedLead;
    if (basicInfo) {
      if (basicInfo.id) {
        form.setValue("id", basicInfo.id);
      }
      if (basicInfo.email) {
        form.setValue("email", basicInfo.email);
      }
      if (basicInfo.businessName) {
        form.setValue("businessName", basicInfo.businessName);
      }
      if (basicInfo.contactName !== undefined) {
        form.setValue("contactName", basicInfo.contactName ?? null);
      }
      if (basicInfo.status) {
        form.setValue("status", basicInfo.status);
      }
    }
    if (contactDetails) {
      if (contactDetails.phone !== undefined) {
        form.setValue("phone", contactDetails.phone ?? undefined);
      }
      if (contactDetails.website !== undefined) {
        form.setValue("website", contactDetails.website ?? undefined);
      }
      if (contactDetails.country) {
        form.setValue("country", contactDetails.country);
      }
      if (contactDetails.language) {
        form.setValue("language", contactDetails.language);
      }
    }
    if (campaignTracking) {
      if (campaignTracking.source !== undefined) {
        form.setValue("source", campaignTracking.source ?? undefined);
      }
      if (campaignTracking.currentCampaignStage !== undefined) {
        form.setValue(
          "currentCampaignStage",
          campaignTracking.currentCampaignStage ?? undefined,
        );
      }
    }
    if (metadata) {
      if (metadata.notes !== undefined) {
        form.setValue("notes", metadata.notes ?? undefined);
      }
      if (metadata.metadata !== undefined) {
        form.setValue("metadata", stripNullValues(metadata.metadata));
      }
    }
    if (conversion) {
      if (conversion.convertedUserId !== undefined) {
        form.setValue("convertedUserId", conversion.convertedUserId ?? null);
      }
      if (conversion.subscriptionConfirmedAt !== undefined) {
        form.setValue(
          "subscriptionConfirmedAt",
          conversion.subscriptionConfirmedAt
            ? new Date(conversion.subscriptionConfirmedAt)
            : null,
        );
      }
    }
  }, [form, fieldLead]);

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      navigation.push(leadsListDefinitions.GET);
    }
  }, [navigation]);

  const handleDelete = useCallback((): void => {
    const currentId = navigation.current?.params?.urlPathParams?.id;
    const id = leadId ?? nestedLeadId ?? currentId;
    if (!id) {
      return;
    }
    navigation.push(definition.DELETE, {
      urlPathParams: { id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  }, [navigation, leadId, nestedLeadId]);

  const wasSubmittingRef = useRef(false);

  const handleSubmit = useCallback((): void => {
    setSubmittedSuccessfully(false);
    wasSubmittingRef.current = true;
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  // Detect when submit transitions from in-progress to done
  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting) {
      wasSubmittingRef.current = false;
      setSubmittedSuccessfully(true);
    }
  }, [isSubmitting]);

  // Show success only after an actual submit (not from GET prefill data populating field.value)
  const showSuccess = submittedSuccessfully && !isSubmitting;

  const headerActions = (
    <Div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="gap-1 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <Span className="hidden @sm:inline">{t("widget.delete")}</Span>
      </Button>
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="gap-1"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSubmitting
          ? t("patch.submitButton.loadingText")
          : t("patch.submitButton.label")}
      </Button>
    </Div>
  );

  return (
    <WidgetShell padding="none">
      {/* Top action bar */}
      <Div className="px-4 pt-4">
        <WidgetHeader
          title={t("patch.form.title")}
          backButton={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
            >
              {t("widget.back")}
            </Button>
          }
          actions={headerActions}
        />
      </Div>

      <Div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        {/* Success: show after actual PATCH submission completes */}
        {showSuccess && (
          <ResultBanner
            variant="success"
            icon={<CheckCircle className="h-4 w-4" />}
            title={t("patch.success.description")}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="basic">{t("widget.tabBasic")}</TabsTrigger>
            <TabsTrigger value="campaign">
              {t("widget.tabCampaign")}
            </TabsTrigger>
            <TabsTrigger value="advanced">
              {t("widget.tabAdvanced")}
            </TabsTrigger>
          </TabsList>

          {/* Basic Info tab */}
          <TabsContent value="basic" className="mt-4">
            <SectionGroup title="">
              <Div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                <FormField label={t("patch.email.label")}>
                  <Input
                    type="email"
                    placeholder={t("patch.email.placeholder")}
                    value={form.watch("email") ?? ""}
                    onChangeText={(v) => form.setValue("email", v)}
                  />
                </FormField>
                <FormField label={t("patch.businessName.label")}>
                  <Input
                    placeholder={t("patch.businessName.placeholder")}
                    value={form.watch("businessName") ?? ""}
                    onChangeText={(v) => form.setValue("businessName", v)}
                  />
                </FormField>
                <FormField label={t("patch.contactName.label")}>
                  <Input
                    placeholder={t("patch.contactName.placeholder")}
                    value={form.watch("contactName") ?? ""}
                    onChangeText={(v) => form.setValue("contactName", v)}
                  />
                </FormField>
                <FormField label={t("patch.status.label")}>
                  <Select
                    value={form.watch("status") ?? ""}
                    onValueChange={(v) => {
                      const parsed = asLeadStatus(v);
                      if (parsed !== undefined) {
                        form.setValue("status", parsed);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("patch.status.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {LeadStatusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {leadsT(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label={t("patch.phone.label")}>
                  <Input
                    type="tel"
                    placeholder={t("patch.phone.placeholder")}
                    value={form.watch("phone") ?? ""}
                    onChangeText={(v) => form.setValue("phone", v)}
                  />
                </FormField>
                <FormField label={t("patch.website.label")}>
                  <Input
                    type="url"
                    placeholder={t("patch.website.placeholder")}
                    value={form.watch("website") ?? ""}
                    onChangeText={(v) => form.setValue("website", v)}
                  />
                </FormField>
                <FormField label={t("patch.country.label")}>
                  <Select
                    value={form.watch("country") ?? ""}
                    onValueChange={(v) => {
                      const parsed = asCountry(v);
                      if (parsed !== undefined) {
                        form.setValue("country", parsed);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("patch.country.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {CountriesOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {tGlobal(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label={t("patch.language.label")}>
                  <Select
                    value={form.watch("language") ?? ""}
                    onValueChange={(v) => {
                      const parsed = asLanguage(v);
                      if (parsed !== undefined) {
                        form.setValue("language", parsed);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("patch.language.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {LanguagesOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {tGlobal(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </Div>
            </SectionGroup>
          </TabsContent>

          {/* Campaign tab */}
          <TabsContent value="campaign" className="mt-4">
            <SectionGroup title="">
              <Div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                <FormField label={t("patch.source.label")}>
                  <Select
                    value={form.watch("source") ?? ""}
                    onValueChange={(v) => {
                      const parsed = asLeadSource(v);
                      if (parsed !== undefined) {
                        form.setValue("source", parsed);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("patch.source.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {LeadSourceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {leadsT(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label={t("patch.currentCampaignStage.label")}>
                  <Select
                    value={form.watch("currentCampaignStage") ?? ""}
                    onValueChange={(v) => {
                      const parsed = asEmailCampaignStage(v);
                      if (parsed !== undefined) {
                        form.setValue("currentCampaignStage", parsed);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "patch.currentCampaignStage.placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {EmailCampaignStageOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {leadsT(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </Div>
              <FormField label={t("patch.notes.label")}>
                <Textarea
                  className="min-h-[80px]"
                  placeholder={t("patch.notes.placeholder")}
                  value={form.watch("notes") ?? ""}
                  onChange={(e) => form.setValue("notes", e.target.value)}
                />
              </FormField>
            </SectionGroup>
          </TabsContent>

          {/* Advanced tab */}
          <TabsContent value="advanced" className="mt-4">
            <SectionGroup title="">
              <Div className="flex flex-col gap-4">
                <FormField label={t("patch.convertedUserId.label")}>
                  <Input
                    placeholder={t("patch.convertedUserId.placeholder")}
                    value={form.watch("convertedUserId") ?? ""}
                    onChangeText={(v) =>
                      form.setValue("convertedUserId", v || null)
                    }
                  />
                </FormField>
                <FormField label={t("patch.subscriptionConfirmedAt.label")}>
                  <Input
                    type="datetime-local"
                    value={
                      (form.watch("subscriptionConfirmedAt") as
                        | string
                        | undefined) ?? ""
                    }
                    onChangeText={(v) =>
                      form.setValue(
                        "subscriptionConfirmedAt",
                        v ? new Date(v) : null,
                      )
                    }
                  />
                </FormField>
                <FormField label={t("patch.metadata.label")}>
                  <Textarea
                    className="min-h-[100px] font-mono"
                    placeholder={t("patch.metadata.placeholder")}
                    value={(() => {
                      const v = form.watch("metadata");
                      if (!v) {
                        return "";
                      }
                      try {
                        return JSON.stringify(v, null, 2);
                      } catch {
                        return "";
                      }
                    })()}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value) as Record<
                          string,
                          string | number | boolean
                        >;
                        form.setValue("metadata", parsed);
                      } catch {
                        // ignore parse errors while typing
                      }
                    }}
                  />
                </FormField>
              </Div>
            </SectionGroup>
          </TabsContent>
        </Tabs>

        {/* Save button at bottom */}
        <Div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleBack}>
            {t("widget.back")}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting
              ? t("patch.submitButton.loadingText")
              : t("patch.submitButton.label")}
          </Button>
        </Div>
      </Div>
    </WidgetShell>
  );
}

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
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { cn } from "next-vibe/core/utils/utils";
import {
  type LeadsT,
  scopedTranslation as leadsScopedTranslation,
} from "next-vibe/identity/lead/i18n";
import { copyToClipboard } from "next-vibe/ui/web/lib/clipboard";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { DetailField, DetailGrid } from "next-vibe/ui/web/ui/detail-grid";
import { Div } from "next-vibe/ui/web/ui/div";
import { EmptyBlock } from "next-vibe/ui/web/ui/empty-block";
import { Activity } from "next-vibe/ui/web/ui/icons/Activity";
import { AlertCircle } from "next-vibe/ui/web/ui/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/web/ui/icons/AlertTriangle";
import { Check } from "next-vibe/ui/web/ui/icons/Check";
import { CheckCircle } from "next-vibe/ui/web/ui/icons/CheckCircle";
import { ChevronRight } from "next-vibe/ui/web/ui/icons/ChevronRight";
import { Clock } from "next-vibe/ui/web/ui/icons/Clock";
import { Copy } from "next-vibe/ui/web/ui/icons/Copy";
import { CreditCard } from "next-vibe/ui/web/ui/icons/CreditCard";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/web/ui/icons/ExternalLink";
import { Globe } from "next-vibe/ui/web/ui/icons/Globe";
import { Hash } from "next-vibe/ui/web/ui/icons/Hash";
import { Info } from "next-vibe/ui/web/ui/icons/Info";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { Mail } from "next-vibe/ui/web/ui/icons/Mail";
import { Pencil } from "next-vibe/ui/web/ui/icons/Pencil";
import { Phone } from "next-vibe/ui/web/ui/icons/Phone";
import { Save } from "next-vibe/ui/web/ui/icons/Save";
import { Search } from "next-vibe/ui/web/ui/icons/Search";
import { Send } from "next-vibe/ui/web/ui/icons/Send";
import { Target } from "next-vibe/ui/web/ui/icons/Target";
import { Trash2 } from "next-vibe/ui/web/ui/icons/Trash2";
import { User } from "next-vibe/ui/web/ui/icons/User";
import { Input } from "next-vibe/ui/web/ui/input";
import { Label } from "next-vibe/ui/web/ui/label";
import { ExternalLink } from "next-vibe/ui/web/ui/link";
import { LoadingBlock } from "next-vibe/ui/web/ui/loading-block";
import { MetricCard } from "next-vibe/ui/web/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/web/ui/metric-grid";
import { ProgressBlock } from "next-vibe/ui/web/ui/progress-block";
import { ResultBanner } from "next-vibe/ui/web/ui/result-banner";
import { SectionGroup } from "next-vibe/ui/web/ui/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/web/ui/select";
import { Separator } from "next-vibe/ui/web/ui/separator";
import { Span } from "next-vibe/ui/web/ui/span";
import { StatusPill } from "next-vibe/ui/web/ui/status-pill";
import { Strong } from "next-vibe/ui/web/ui/strong";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe/ui/web/ui/tabs";
import { Textarea } from "next-vibe/ui/web/ui/textarea";
import { P } from "next-vibe/ui/web/ui/typography";
import { WidgetHeader } from "next-vibe/ui/web/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/web/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React, { useCallback, useEffect, useRef, useState } from "react";

import leadsListDefinitions from "@/app/api/[locale]/leads/list/definition";
import leadsSearchDefinitions from "@/app/api/[locale]/leads/search/definition";
import { configScopedTranslation } from "@/config/i18n";

import {
  DeviceType,
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../enum";
import type { LeadGetResponseOutput } from "./definition";
import userDefinitions from "./definition";
import definition from "./definition";

// ─── Enum type helpers ────────────────────────────────────────────────────────

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
  const handleCopy = useCallback((): void => {
    void copyToClipboard(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
      return undefined;
    });
  }, [text]);
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

function LinkedIdentitiesTab({
  data,
  locale,
  t,
  leadsT,
  onViewUserProfile,
  onViewLinkedLead,
}: {
  data: NonNullable<LeadGetResponseOutput["lead"]>;
  locale: ReturnType<typeof useWidgetLocale>;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  leadsT: LeadsT;
  onViewUserProfile: (id: string) => void;
  onViewLinkedLead: (id: string) => void;
}): React.JSX.Element {
  const { identity, lifecycle, linkedLeads, linkedUsers } = data;

  return (
    <Div className="flex flex-col gap-4">
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

      {/* Linked Leads */}
      <SectionGroup
        title={t("widget.linkedLeadsSection")}
        subtitle={
          linkedLeads.length > 0 ? (
            <StatusPill status={String(linkedLeads.length)} variant="info" />
          ) : undefined
        }
      >
        {linkedLeads.length === 0 ? (
          <P className="text-sm text-muted-foreground">
            {t("widget.linkedLeadsEmpty")}
          </P>
        ) : (
          <Div className="flex flex-col gap-3">
            {linkedLeads.map((link) => (
              <Div
                key={link.linkedLeadId}
                className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30"
              >
                <Div className="flex items-center justify-between gap-2">
                  <Div className="flex items-center gap-2 min-w-0">
                    <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <Strong className="text-sm font-medium truncate">
                      {link.businessName ?? link.email ?? "—"}
                    </Strong>
                    {link.status && (
                      <StatusPill
                        status={leadsT(link.status)}
                        variant={STATUS_VARIANT[link.status] ?? "default"}
                      />
                    )}
                  </Div>
                  <Div className="flex items-center gap-1 flex-shrink-0">
                    <CopyButton
                      text={link.linkedLeadId}
                      label={t("widget.copyLinkedLeadId")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewLinkedLead(link.linkedLeadId)}
                      className="h-6 px-1.5 gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Button>
                  </Div>
                </Div>
                {link.email && (
                  <P className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    {link.email}
                  </P>
                )}
                {link.ipAddress && (
                  <P className="text-xs text-muted-foreground font-mono">
                    {link.ipAddress}
                  </P>
                )}
                <Div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                  <Span>
                    {t("widget.linkReason")}{" "}
                    <Strong className="text-foreground">
                      {link.linkReason}
                    </Strong>
                  </Span>
                  <Span>
                    {t("widget.linkedAt")}{" "}
                    {formatSimpleDate(link.linkedAt, locale)}
                  </Span>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </SectionGroup>

      {/* Linked Users */}
      <SectionGroup
        title={t("widget.linkedUsersSection")}
        subtitle={
          linkedUsers.length > 0 ? (
            <StatusPill status={String(linkedUsers.length)} variant="info" />
          ) : undefined
        }
      >
        {linkedUsers.length === 0 ? (
          <P className="text-sm text-muted-foreground">
            {t("widget.linkedUsersEmpty")}
          </P>
        ) : (
          <Div className="flex flex-col gap-3">
            {linkedUsers.map((link) => (
              <Div
                key={link.userId}
                className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30"
              >
                <Div className="flex items-center justify-between gap-2">
                  <Div className="flex items-center gap-2 min-w-0">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <Strong className="text-sm font-medium truncate">
                      {link.publicName ?? link.email}
                    </Strong>
                  </Div>
                  <Div className="flex items-center gap-1 flex-shrink-0">
                    <CopyButton
                      text={link.userId}
                      label={t("widget.copyUserId2")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewUserProfile(link.userId)}
                      className="h-6 px-1.5 gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Button>
                  </Div>
                </Div>
                <P className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  {link.email}
                </P>
                <Div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                  <Span>
                    {t("widget.linkReason")}{" "}
                    <Strong className="text-foreground">
                      {link.linkReason}
                    </Strong>
                  </Span>
                  <Span>
                    {t("widget.linkedAt")}{" "}
                    {formatSimpleDate(link.linkedAt, locale)}
                  </Span>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </SectionGroup>
    </Div>
  );
}

// ─── LeadDetailContainer (GET widget) ────────────────────────────────────────

export function LeadDetailContainer(): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const endpointMutations = useWidgetEndpointMutations();
  const [activeTab, setActiveTab] = useState("overview");

  const fieldValue = useWidgetValue<typeof definition.GET>();
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
        metadata: data.metadata.metadata ?? undefined,
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

  const handleViewUserProfile = useCallback(
    (convertedUserId: string): void => {
      navigation.push(userDefinitions.GET, {
        urlPathParams: { id: convertedUserId },
      });
    },
    [navigation],
  );

  const handleViewLinkedLead = useCallback(
    (linkedLeadId: string): void => {
      navigation.push(definition.GET, {
        urlPathParams: { id: linkedLeadId },
      });
    },
    [navigation],
  );

  const handleSendTestEmail = useCallback((): void => {
    void (async (): Promise<void> => {
      const testMailDef =
        await import("@/app/api/[locale]/leads/campaigns/emails/test-mail/definition");
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
    if (response === undefined) {
      return (
        <WidgetShell>
          <LoadingBlock message={t("widget.loading")} />
        </WidgetShell>
      );
    }
    // No id in URL — show picker so user can select a lead
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

  const headerActions = (
    <Div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleEdit} className="gap-1">
        <Pencil className="h-4 w-4" />
        <Span className="hidden @sm:inline">{t("widget.edit")}</Span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
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
              {(data.linkedLeads.length > 0 || data.linkedUsers.length > 0) && (
                <Span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4">
                  {data.linkedLeads.length + data.linkedUsers.length}
                </Span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
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
              locale={locale}
              t={t}
              leadsT={leadsT}
              onViewUserProfile={handleViewUserProfile}
              onViewLinkedLead={handleViewLinkedLead}
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
        form.setValue("metadata", metadata.metadata);
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
  }, [nestedLeadId, form, fieldLead]);

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

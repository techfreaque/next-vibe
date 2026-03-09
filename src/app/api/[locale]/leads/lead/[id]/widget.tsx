/**
 * Lead Detail & Edit Widgets
 * - LeadDetailContainer: Tabbed view (Overview + Details) for GET endpoint
 * - LeadEditContainer: Tabbed edit form for PATCH endpoint
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { MousePointer } from "next-vibe-ui/ui/icons/MousePointer";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Phone } from "next-vibe-ui/ui/icons/Phone";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Target } from "next-vibe-ui/ui/icons/Target";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { User } from "next-vibe-ui/ui/icons/User";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Link } from "next-vibe-ui/ui/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  CountriesArr,
  CountriesOptions,
  LanguagesArr,
  LanguagesOptions,
} from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import userDefinitions from "../../../users/user/[id]/definition";
import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../../enum";
import {
  type LeadsT,
  scopedTranslation as leadsScopedTranslation,
} from "../../i18n";
import leadsListDefinitions from "../../list/definition";
import leadsSearchDefinitions from "../../search/definition";
import type {
  LeadGetResponseOutput,
  LeadPatchResponseOutput,
} from "./definition";
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

// ─── Types ───────────────────────────────────────────────────────────────────

interface GetWidgetProps {
  field: {
    value: LeadGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

interface PatchWidgetProps {
  field: {
    value: LeadPatchResponseOutput | null | undefined;
  } & (typeof definition.PATCH)["fields"];
  fieldName: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  [LeadStatus.NEW]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [LeadStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [LeadStatus.CAMPAIGN_RUNNING]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [LeadStatus.WEBSITE_USER]:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  [LeadStatus.NEWSLETTER_SUBSCRIBER]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  [LeadStatus.IN_CONTACT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [LeadStatus.SIGNED_UP]:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [LeadStatus.UNSUBSCRIBED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
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

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}): React.JSX.Element | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <Div className="flex flex-col gap-0.5">
      <P className="text-xs text-muted-foreground">{label}</P>
      <P className={cn("text-sm", mono && "font-mono")}>{String(value)}</P>
    </Div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-card">
      <Div
        style={
          color
            ? {
                color,
                fontWeight: 700,
                fontSize: "1.5rem",
                fontVariantNumeric: "tabular-nums",
              }
            : {
                fontWeight: 700,
                fontSize: "1.5rem",
                fontVariantNumeric: "tabular-nums",
              }
        }
      >
        {String(value)}
      </Div>
      <P className="text-xs text-muted-foreground text-center">{label}</P>
    </Div>
  );
}

function RateBar({
  rate,
  color,
  label,
}: {
  rate: number;
  color: string;
  label: string;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Div className="flex items-center justify-between">
        <P className="text-xs text-muted-foreground">{label}</P>
        <Div
          style={{
            color,
            fontWeight: 600,
            fontSize: "0.75rem",
            fontVariantNumeric: "tabular-nums",
            display: "inline",
          }}
        >
          {rate}%
        </Div>
      </Div>
      <Div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <Div
          style={{
            width: `${Math.min(rate, 100)}%`,
            height: "100%",
            borderRadius: "9999px",
            transition: "all 500ms",
            backgroundColor: color,
          }}
        />
      </Div>
    </Div>
  );
}

function CopyButton({
  text,
  label,
}: {
  text: string;
  label?: string;
}): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(text).then(() => {
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
        <CheckCircle className="h-3 w-3 text-green-500" />
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
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
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
    <Card>
      <CardContent className="pt-4">
        <Div className="flex items-start gap-4">
          <Div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
            {(businessName ?? email ?? "?").slice(0, 2).toUpperCase()}
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex flex-wrap items-center gap-2 mb-1">
              <Strong className="text-lg font-bold">
                {businessName ?? "—"}
              </Strong>
              {status && (
                <Span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800",
                  )}
                >
                  {leadsT(status)}
                </Span>
              )}
              {isConverted && (
                <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle className="h-3 w-3" />
                  {t("widget.converted")}
                </Span>
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
      </CardContent>
    </Card>
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
      <Card>
        <CardContent className="pt-4">
          <Div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardContent className="pt-4">
          <P className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
            {t("widget.quickActions")}
          </P>
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
              className="gap-1.5 text-destructive hover:text-destructive ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("widget.delete")}
            </Button>
          </Div>
        </CardContent>
      </Card>

      {/* Campaign funnel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t("widget.campaignFunnel")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignFunnel
            currentStage={campaignTracking.currentCampaignStage}
          />
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
        </CardContent>
      </Card>

      {/* Campaign performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t("widget.campaignPerformance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-3 gap-3 mb-4">
            <StatBadge
              label={t("widget.emailsSent")}
              value={campaignTracking.emailsSent}
              color="#2563eb"
            />
            <StatBadge
              label={t("widget.opened")}
              value={engagement.emailsOpened}
              color="#16a34a"
            />
            <StatBadge
              label={t("widget.clicked")}
              value={engagement.emailsClicked}
              color="#9333ea"
            />
          </Div>
          <Div className="flex flex-col gap-3">
            <RateBar
              rate={openRate}
              color="#16a34a"
              label={t("widget.openRate")}
            />
            <RateBar
              rate={clickRate}
              color="#9333ea"
              label={t("widget.clickRate")}
            />
            {engagement.emailsOpened > 0 && (
              <RateBar
                rate={clickToOpenRate}
                color="#ea580c"
                label={t("widget.clickToOpenRate")}
              />
            )}
          </Div>
        </CardContent>
      </Card>

      {/* Contact details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("widget.contactDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 gap-3">
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
                <Link
                  href={contactDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center gap-1"
                >
                  {contactDetails.website}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </Link>
              </Div>
            )}
            <InfoRow
              label={t("widget.country")}
              value={contactDetails.country}
            />
            <InfoRow
              label={t("widget.language")}
              value={contactDetails.language}
            />
          </Div>
        </CardContent>
      </Card>
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t("widget.engagement")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 gap-3">
            <Div className="flex items-center gap-2">
              <BarChart2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              <InfoRow
                label={t("widget.emailsOpened")}
                value={engagement.emailsOpened}
              />
            </Div>
            <Div className="flex items-center gap-2">
              <MousePointer className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
              <InfoRow
                label={t("widget.emailsClicked")}
                value={engagement.emailsClicked}
              />
            </Div>
            {engagement.lastEngagementAt && (
              <Div className="col-span-2">
                <InfoRow
                  label={t("widget.lastEngagement")}
                  value={formatSimpleDate(engagement.lastEngagementAt, locale)}
                />
              </Div>
            )}
            {engagement.unsubscribedAt && (
              <Div className="col-span-2 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                <Div>
                  <P className="text-xs text-muted-foreground">
                    {t("widget.unsubscribed")}
                  </P>
                  <P className="text-sm text-red-600 dark:text-red-400">
                    {formatSimpleDate(engagement.unsubscribedAt, locale)}
                  </P>
                </Div>
              </Div>
            )}
          </Div>
        </CardContent>
      </Card>

      {/* Conversion */}
      {(conversion.signedUpAt ??
        conversion.convertedUserId ??
        conversion.subscriptionConfirmedAt ??
        conversion.convertedAt) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              {t("widget.conversion")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-2 gap-3">
              {conversion.signedUpAt && (
                <InfoRow
                  label={t("widget.signedUp")}
                  value={formatSimpleDate(conversion.signedUpAt, locale)}
                />
              )}
              {conversion.convertedAt && (
                <InfoRow
                  label={t("widget.convertedAt")}
                  value={formatSimpleDate(conversion.convertedAt, locale)}
                />
              )}
              {conversion.subscriptionConfirmedAt && (
                <InfoRow
                  label={t("widget.subscriptionConfirmed")}
                  value={formatSimpleDate(
                    conversion.subscriptionConfirmedAt,
                    locale,
                  )}
                />
              )}
              {conversion.convertedUserId && (
                <Div className="col-span-2">
                  <P className="text-xs text-muted-foreground">
                    {t("widget.convertedUserId")}
                  </P>
                  <Div className="flex items-center gap-1 mt-0.5">
                    <P className="text-sm font-mono truncate">
                      {conversion.convertedUserId}
                    </P>
                    <CopyButton
                      text={conversion.convertedUserId}
                      label={t("widget.copyUserId")}
                    />
                  </Div>
                </Div>
              )}
            </Div>
            {hasSubscription && (
              <Div className="mt-3 pt-3 border-t flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                <P className="text-sm text-green-700 dark:text-green-400 font-medium">
                  {t("widget.activeSubscriberSince")}{" "}
                  {formatSimpleDate(
                    conversion.subscriptionConfirmedAt!,
                    locale,
                  )}
                </P>
              </Div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes & Metadata */}
      {(metadata.notes ?? Object.keys(metadata.metadata ?? {}).length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {t("widget.notesAndMetadata")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
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
                <Separator />
                <Div>
                  <P className="text-xs text-muted-foreground mb-2">
                    {t("widget.metadata")}
                  </P>
                  <Div className="grid grid-cols-2 gap-2">
                    {Object.entries(metadata.metadata).map(([key, val]) => (
                      <InfoRow key={key} label={key} value={String(val)} />
                    ))}
                  </Div>
                </Div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardContent className="pt-4">
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("widget.created")}
              </P>
              <P className="text-sm">
                {formatSimpleDate(metadata.createdAt, locale)}
              </P>
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
            <InfoRow
              label={t("widget.lastUpdated")}
              value={formatSimpleDate(metadata.updatedAt, locale)}
            />
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}

// ─── LeadDetailContainer (GET widget) ────────────────────────────────────────

export function LeadDetailContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const [activeTab, setActiveTab] = useState("overview");

  const data = field.value?.lead;
  const leadId = data?.basicInfo?.id;

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      navigation.push(leadsListDefinitions.GET);
    }
  }, [navigation]);

  const handleEdit = useCallback((): void => {
    if (!leadId) {
      return;
    }
    navigation.push(definition.PATCH, {
      urlPathParams: { id: leadId },
      prefillFromGet: true,
      getEndpoint: definition.GET,
    });
  }, [navigation, leadId]);

  const handleDelete = useCallback((): void => {
    if (!leadId) {
      return;
    }
    navigation.push(definition.DELETE, {
      urlPathParams: { id: leadId },
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

  const handleSendTestEmail = useCallback((): void => {
    void (async (): Promise<void> => {
      const testMailDef =
        await import("@/app/api/[locale]/leads/campaigns/emails/test-mail/definition");
      navigation.push(testMailDef.default.POST, {
        renderInModal: true,
        data: leadId ? { leadId } : undefined,
      });
    })();
  }, [navigation, leadId]);

  const handleViewInSearch = useCallback((): void => {
    navigation.push(leadsSearchDefinitions.GET);
  }, [navigation]);

  if (!field.value) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <Div className="rounded-full bg-muted p-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
        <P className="text-sm text-muted-foreground">{t("widget.loading")}</P>
      </Div>
    );
  }

  if (!data) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <Div className="rounded-full bg-muted p-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </Div>
        <P className="text-sm text-muted-foreground">{t("widget.notFound")}</P>
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("widget.back")}
        </Button>
      </Div>
    );
  }

  const { basicInfo, conversion } = data;

  return (
    <Div className="flex flex-col gap-0 pb-6">
      {/* Top action bar */}
      <Div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("widget.back")}
        </Button>
        <Div className="flex-1 min-w-0">
          <P className="font-semibold text-base truncate">
            {basicInfo.businessName ??
              basicInfo.email ??
              t("widget.leadFallbackTitle")}
          </P>
        </Div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="gap-1"
        >
          <Pencil className="h-4 w-4" />
          {t("widget.edit")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t("widget.delete")}
        </Button>
      </Div>

      <Div className="px-4 pt-4 flex flex-col gap-4">
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
        </Tabs>
      </Div>
    </Div>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- widget receives props from framework but uses context hooks instead
export function LeadEditContainer(_props: PatchWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const { t: tGlobal } = useTranslation();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof definition.PATCH>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const [activeTab, setActiveTab] = useState("basic");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const leadId = form.watch("id");

  // Prefill flat form fields from GET response data (autoPrefillData arrives as nested `lead.*`)
  // The form.getValues() returns the entire form state including nested GET response data
  const allFormValues = form.watch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- form values contain nested GET response data at runtime
  const nestedLead = (allFormValues as Record<string, any>)
    ?.lead as LeadGetResponseOutput["lead"];
  const nestedLeadId = nestedLead?.basicInfo?.id;
  const prefillAppliedRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!nestedLead?.basicInfo?.id) {
      return;
    }
    if (prefillAppliedRef.current === nestedLead.basicInfo.id) {
      return;
    }
    prefillAppliedRef.current = nestedLead.basicInfo.id;
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
  }, [nestedLeadId, form, nestedLead]);

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      navigation.push(leadsListDefinitions.GET);
    }
  }, [navigation]);

  const handleDelete = useCallback((): void => {
    if (!leadId) {
      return;
    }
    navigation.push(definition.DELETE, {
      urlPathParams: { id: leadId },
    });
  }, [navigation, leadId]);

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

  return (
    <Div className="flex flex-col gap-0 pb-6">
      {/* Top action bar */}
      <Div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background z-10">
        <Button type="button" variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("widget.back")}
        </Button>
        <Div className="flex-1 min-w-0">
          <P className="font-semibold text-base truncate">
            {t("patch.form.title")}
          </P>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t("widget.delete")}
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

      <Div className="px-4 pt-4 flex flex-col gap-4">
        {/* Success: show after actual PATCH submission completes */}
        {showSuccess && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
            <CardContent className="pt-3 pb-3">
              <Div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <P className="text-sm text-green-700 dark:text-green-400 font-medium">
                  {t("patch.success.description")}
                </P>
              </Div>
            </CardContent>
          </Card>
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
            <Card>
              <CardContent className="pt-4 flex flex-col gap-4">
                <Div className="grid grid-cols-2 gap-4">
                  <FormField label={t("patch.email.label")}>
                    <Input
                      type="email"
                      placeholder={t("patch.email.placeholder")}
                      value={(form?.watch("email") as string | undefined) ?? ""}
                      onChangeText={(v) => form?.setValue("email", v)}
                    />
                  </FormField>
                  <FormField label={t("patch.businessName.label")}>
                    <Input
                      placeholder={t("patch.businessName.placeholder")}
                      value={
                        (form?.watch("businessName") as string | undefined) ??
                        ""
                      }
                      onChangeText={(v) => form?.setValue("businessName", v)}
                    />
                  </FormField>
                  <FormField label={t("patch.contactName.label")}>
                    <Input
                      placeholder={t("patch.contactName.placeholder")}
                      value={
                        (form?.watch("contactName") as string | undefined) ?? ""
                      }
                      onChangeText={(v) => form?.setValue("contactName", v)}
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
                      value={(form?.watch("phone") as string | undefined) ?? ""}
                      onChangeText={(v) => form?.setValue("phone", v)}
                    />
                  </FormField>
                  <FormField label={t("patch.website.label")}>
                    <Input
                      type="url"
                      placeholder={t("patch.website.placeholder")}
                      value={
                        (form?.watch("website") as string | undefined) ?? ""
                      }
                      onChangeText={(v) => form?.setValue("website", v)}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign tab */}
          <TabsContent value="campaign" className="mt-4">
            <Card>
              <CardContent className="pt-4 flex flex-col gap-4">
                <Div className="grid grid-cols-2 gap-4">
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
                    value={(form?.watch("notes") as string | undefined) ?? ""}
                    onChange={(e) => form?.setValue("notes", e.target.value)}
                  />
                </FormField>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced tab */}
          <TabsContent value="advanced" className="mt-4">
            <Card>
              <CardContent className="pt-4 flex flex-col gap-4">
                <FormField label={t("patch.convertedUserId.label")}>
                  <Input
                    placeholder={t("patch.convertedUserId.placeholder")}
                    value={
                      (form?.watch("convertedUserId") as string | undefined) ??
                      ""
                    }
                    onChangeText={(v) =>
                      form?.setValue("convertedUserId", v || null)
                    }
                  />
                </FormField>
                <FormField label={t("patch.subscriptionConfirmedAt.label")}>
                  <Input
                    type="datetime-local"
                    value={
                      (form?.watch("subscriptionConfirmedAt") as
                        | string
                        | undefined) ?? ""
                    }
                    onChangeText={(v) =>
                      form?.setValue(
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
                      const v = form?.watch("metadata");
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
                        form?.setValue("metadata", parsed);
                      } catch {
                        // ignore parse errors while typing
                      }
                    }}
                  />
                </FormField>
              </CardContent>
            </Card>
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
    </Div>
  );
}

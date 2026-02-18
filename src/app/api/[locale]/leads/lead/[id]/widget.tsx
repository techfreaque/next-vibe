/**
 * Custom Widget for Lead Detail View
 * Full-featured lead profile with all sections and navigation stack integration
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart2,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  History,
  Info,
  Mail,
  MousePointer,
  Pencil,
  Phone,
  Search,
  Send,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  User,
  UserSearch,
} from "next-vibe-ui/ui/icons";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";
import type { LeadGetResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: LeadGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CAMPAIGN_RUNNING:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  WEBSITE_USER:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  NEWSLETTER_SUBSCRIBER:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  IN_CONTACT:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  SIGNED_UP: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  SUBSCRIPTION_CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  UNSUBSCRIBED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  BOUNCED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  INVALID: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200",
};

/** Campaign funnel stage keys in order */
const CAMPAIGN_FUNNEL_STAGE_KEYS = [
  { key: "NOT_STARTED", labelKey: "app.api.leads.lead.widget.stageNotStarted" },
  { key: "INITIAL", labelKey: "app.api.leads.lead.widget.stageInitial" },
  { key: "FOLLOWUP_1", labelKey: "app.api.leads.lead.widget.stageFollowup1" },
  { key: "FOLLOWUP_2", labelKey: "app.api.leads.lead.widget.stageFollowup2" },
  { key: "FOLLOWUP_3", labelKey: "app.api.leads.lead.widget.stageFollowup3" },
  { key: "NURTURE", labelKey: "app.api.leads.lead.widget.stageNurture" },
  {
    key: "REACTIVATION",
    labelKey: "app.api.leads.lead.widget.stageReactivation",
  },
] as const;

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

/** Small inline progress bar for rate visualization */
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

/** Copy-to-clipboard button */
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

/** Campaign stage funnel visualization */
function CampaignFunnel({
  currentStage,
}: {
  currentStage: string | null | undefined;
}): React.JSX.Element {
  const t = useWidgetTranslation();
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

/** Compute days since a date */
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

export function LeadDetailContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const router = useRouter();
  const t = useWidgetTranslation();

  const data = field.value?.lead;
  const leadId = data?.basicInfo?.id;

  // ── Navigation: back to leads list ──
  const handleBack = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  // ── Edit ──
  const handleEdit = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  // ── Delete ──
  const handleDelete = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  // ── View User Profile ──
  const handleViewUserProfile = useCallback(
    (convertedUserId: string): void => {
      router.push(`/${locale}/admin/users/${convertedUserId}/edit`);
    },
    [router, locale],
  );

  // ── View User Detail ──
  const handleViewUserDetail = useCallback(
    (convertedUserId: string): void => {
      router.push(`/${locale}/admin/users/${convertedUserId}/edit`);
    },
    [router, locale],
  );

  // ── Credit History — no dedicated admin page, go to user edit ──
  const handleViewCreditHistory = useCallback(
    (convertedUserId: string): void => {
      router.push(`/${locale}/admin/users/${convertedUserId}/edit`);
    },
    [router, locale],
  );

  // ── Send Test Email — no dedicated page, navigate to leads emails ──
  const handleSendTestEmail = useCallback((): void => {
    router.push(`/${locale}/admin/leads/emails`);
  }, [router, locale]);

  // ── View in Search ──
  const handleViewInSearch = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  // ── Loading state ──
  if (!field.value) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <Div className="rounded-full bg-muted p-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
        <P className="text-sm text-muted-foreground">
          {t("app.api.leads.lead.widget.loading")}
        </P>
      </Div>
    );
  }

  // ── Not found state ──
  if (!data) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <Div className="rounded-full bg-muted p-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </Div>
        <P className="text-sm text-muted-foreground">
          {t("app.api.leads.lead.widget.notFound")}
        </P>
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("app.api.leads.lead.widget.back")}
        </Button>
      </Div>
    );
  }

  const {
    basicInfo,
    contactDetails,
    campaignTracking,
    engagement,
    conversion,
    metadata,
  } = data;

  // ── Computed stats ──
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

  const isConverted = Boolean(conversion.convertedUserId);
  const hasSubscription = Boolean(conversion.subscriptionConfirmedAt);

  return (
    <Div className="flex flex-col gap-0 pb-6">
      {/* ── Top action bar ── */}
      <Div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("app.api.leads.lead.widget.back")}
        </Button>
        <Div className="flex-1 min-w-0">
          <P className="font-semibold text-base truncate">
            {basicInfo.businessName ??
              basicInfo.email ??
              t("app.api.leads.lead.widget.leadFallbackTitle")}
          </P>
        </Div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="gap-1"
        >
          <Pencil className="h-4 w-4" />
          {t("app.api.leads.lead.widget.edit")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t("app.api.leads.lead.widget.delete")}
        </Button>
      </Div>

      <Div className="px-4 pt-4 flex flex-col gap-4">
        {/* ── Header card ── */}
        <Card>
          <CardContent className="pt-4">
            <Div className="flex items-start gap-4">
              <Div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                {(basicInfo.businessName ?? basicInfo.email ?? "?")
                  .slice(0, 2)
                  .toUpperCase()}
              </Div>
              <Div className="flex-1 min-w-0">
                <Div className="flex flex-wrap items-center gap-2 mb-1">
                  <Strong className="text-lg font-bold">
                    {basicInfo.businessName ?? "—"}
                  </Strong>
                  {basicInfo.status && (
                    <Span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        STATUS_COLORS[basicInfo.status] ??
                          "bg-gray-100 text-gray-800",
                      )}
                    >
                      {basicInfo.status.replace(/_/g, " ")}
                    </Span>
                  )}
                  {isConverted && (
                    <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" />
                      {t("app.api.leads.lead.widget.converted")}
                    </Span>
                  )}
                </Div>
                {basicInfo.contactName && (
                  <P className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {basicInfo.contactName}
                  </P>
                )}
                {basicInfo.email && (
                  <Div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <P className="text-sm text-muted-foreground">
                      {basicInfo.email}
                    </P>
                    <CopyButton
                      text={basicInfo.email}
                      label={t("app.api.leads.lead.widget.copyEmail")}
                    />
                  </Div>
                )}
                {leadId && (
                  <Div className="flex items-center gap-1 mt-0.5">
                    <P className="text-xs text-muted-foreground/60 font-mono">
                      {leadId}
                    </P>
                    <CopyButton
                      text={leadId}
                      label={t("app.api.leads.lead.widget.copyId")}
                    />
                  </Div>
                )}
              </Div>
            </Div>

            {/* ── Lead age & quick stats row ── */}
            <Div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {leadAgeDays !== null && (
                <Div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <Span>
                    <Strong className="font-semibold text-foreground">
                      {leadAgeDays}
                    </Strong>{" "}
                    {t("app.api.leads.lead.widget.daysOld")}
                  </Span>
                </Div>
              )}
              {daysSinceEngagement !== null && (
                <Div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <Span>
                    {t("app.api.leads.lead.widget.lastEngaged")}{" "}
                    <Strong className="font-semibold text-foreground">
                      {daysSinceEngagement}d
                    </Strong>{" "}
                    {t("app.api.leads.lead.widget.ago")}
                  </Span>
                </Div>
              )}
              {campaignTracking.emailJourneyVariant && (
                <Div className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <Span>
                    {t("app.api.leads.lead.widget.variant")}{" "}
                    <Strong className="font-semibold text-foreground">
                      {campaignTracking.emailJourneyVariant.replace(/_/g, " ")}
                    </Strong>
                  </Span>
                </Div>
              )}
            </Div>
          </CardContent>
        </Card>

        {/* ── Quick actions bar ── */}
        <Card>
          <CardContent className="pt-4">
            <P className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              {t("app.api.leads.lead.widget.quickActions")}
            </P>
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("app.api.leads.lead.widget.editLead")}
              </Button>
              {basicInfo.email && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendTestEmail}
                    className="gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.sendTestEmail")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleViewInSearch}
                    className="gap-1.5"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.viewInSearch")}
                  </Button>
                </>
              )}
              {conversion.convertedUserId && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewUserProfile(conversion.convertedUserId!)
                    }
                    className="gap-1.5"
                  >
                    <User className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.userProfile")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewUserDetail(conversion.convertedUserId!)
                    }
                    className="gap-1.5"
                  >
                    <UserSearch className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.userDetail")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewCreditHistory(conversion.convertedUserId!)
                    }
                    className="gap-1.5"
                  >
                    <History className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.creditHistory")}
                  </Button>
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="gap-1.5 text-destructive hover:text-destructive ml-auto"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("app.api.leads.lead.widget.delete")}
              </Button>
            </Div>
          </CardContent>
        </Card>

        {/* ── Campaign stage funnel ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t("app.api.leads.lead.widget.campaignFunnel")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignFunnel
              currentStage={campaignTracking.currentCampaignStage}
            />
            {campaignTracking.source && (
              <Div className="mt-2 flex items-center gap-2">
                <P className="text-xs text-muted-foreground">
                  {t("app.api.leads.lead.widget.sourceLabel")}
                </P>
                <Badge variant="outline" className="text-xs">
                  {campaignTracking.source.replace(/_/g, " ")}
                </Badge>
              </Div>
            )}
            {campaignTracking.lastEmailSentAt && (
              <P className="text-xs text-muted-foreground mt-2">
                {t("app.api.leads.lead.widget.lastEmailLabel")}{" "}
                {formatSimpleDate(campaignTracking.lastEmailSentAt, locale)}
              </P>
            )}
          </CardContent>
        </Card>

        {/* ── Campaign performance stats ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t("app.api.leads.lead.widget.campaignPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-3 gap-3 mb-4">
              <StatBadge
                label={t("app.api.leads.lead.widget.emailsSent")}
                value={campaignTracking.emailsSent}
                color="#2563eb"
              />
              <StatBadge
                label={t("app.api.leads.lead.widget.opened")}
                value={engagement.emailsOpened}
                color="#16a34a"
              />
              <StatBadge
                label={t("app.api.leads.lead.widget.clicked")}
                value={engagement.emailsClicked}
                color="#9333ea"
              />
            </Div>

            {/* Rate progress bars */}
            <Div className="flex flex-col gap-3">
              <RateBar
                rate={openRate}
                color="#16a34a"
                label={t("app.api.leads.lead.widget.openRate")}
              />
              <RateBar
                rate={clickRate}
                color="#9333ea"
                label={t("app.api.leads.lead.widget.clickRate")}
              />
              {engagement.emailsOpened > 0 && (
                <RateBar
                  rate={clickToOpenRate}
                  color="#ea580c"
                  label={t("app.api.leads.lead.widget.clickToOpenRate")}
                />
              )}
            </Div>
          </CardContent>
        </Card>

        {/* ── Contact details ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("app.api.leads.lead.widget.contactDetails")}
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
                    label={t("app.api.leads.lead.widget.copyPhone")}
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
                label={t("app.api.leads.lead.widget.country")}
                value={contactDetails.country}
              />
              <InfoRow
                label={t("app.api.leads.lead.widget.language")}
                value={contactDetails.language}
              />
            </Div>
          </CardContent>
        </Card>

        {/* ── Engagement ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("app.api.leads.lead.widget.engagement")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-2 gap-3">
              <Div className="flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                <InfoRow
                  label={t("app.api.leads.lead.widget.emailsOpened")}
                  value={engagement.emailsOpened}
                />
              </Div>
              <Div className="flex items-center gap-2">
                <MousePointer className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                <InfoRow
                  label={t("app.api.leads.lead.widget.emailsClicked")}
                  value={engagement.emailsClicked}
                />
              </Div>
              {engagement.lastEngagementAt && (
                <Div className="col-span-2">
                  <InfoRow
                    label={t("app.api.leads.lead.widget.lastEngagement")}
                    value={formatSimpleDate(
                      engagement.lastEngagementAt,
                      locale,
                    )}
                  />
                </Div>
              )}
              {engagement.unsubscribedAt && (
                <Div className="col-span-2 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <Div>
                    <P className="text-xs text-muted-foreground">
                      {t("app.api.leads.lead.widget.unsubscribed")}
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

        {/* ── Conversion ── */}
        {(conversion.signedUpAt ??
          conversion.convertedUserId ??
          conversion.subscriptionConfirmedAt ??
          conversion.convertedAt) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                {t("app.api.leads.lead.widget.conversion")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Div className="grid grid-cols-2 gap-3">
                {conversion.signedUpAt && (
                  <InfoRow
                    label={t("app.api.leads.lead.widget.signedUp")}
                    value={formatSimpleDate(conversion.signedUpAt, locale)}
                  />
                )}
                {conversion.convertedAt && (
                  <InfoRow
                    label={t("app.api.leads.lead.widget.convertedAt")}
                    value={formatSimpleDate(conversion.convertedAt, locale)}
                  />
                )}
                {conversion.subscriptionConfirmedAt && (
                  <InfoRow
                    label={t("app.api.leads.lead.widget.subscriptionConfirmed")}
                    value={formatSimpleDate(
                      conversion.subscriptionConfirmedAt,
                      locale,
                    )}
                  />
                )}
                {conversion.convertedUserId && (
                  <Div className="col-span-2">
                    <P className="text-xs text-muted-foreground">
                      {t("app.api.leads.lead.widget.convertedUserId")}
                    </P>
                    <Div className="flex items-center gap-1 mt-0.5">
                      <P className="text-sm font-mono truncate">
                        {conversion.convertedUserId}
                      </P>
                      <CopyButton
                        text={conversion.convertedUserId}
                        label={t("app.api.leads.lead.widget.copyUserId")}
                      />
                    </Div>
                  </Div>
                )}
              </Div>

              {/* ── Subscription info badge ── */}
              {hasSubscription && (
                <Div className="mt-3 pt-3 border-t flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                  <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <P className="text-sm text-green-700 dark:text-green-400 font-medium">
                    {t("app.api.leads.lead.widget.activeSubscriberSince")}{" "}
                    {formatSimpleDate(
                      conversion.subscriptionConfirmedAt!,
                      locale,
                    )}
                  </P>
                </Div>
              )}

              {/* ── Converted user action buttons ── */}
              {conversion.convertedUserId && (
                <Div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewUserProfile(conversion.convertedUserId!)
                    }
                    className="gap-1"
                  >
                    <User className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.viewUserProfile")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewUserDetail(conversion.convertedUserId!)
                    }
                    className="gap-1"
                  >
                    <UserSearch className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.viewUserDetail")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewCreditHistory(conversion.convertedUserId!)
                    }
                    className="gap-1"
                  >
                    <History className="h-3.5 w-3.5" />
                    {t("app.api.leads.lead.widget.creditHistory")}
                  </Button>
                </Div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Notes & Metadata ── */}
        {(metadata.notes ??
          Object.keys(metadata.metadata ?? {}).length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {t("app.api.leads.lead.widget.notesAndMetadata")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {metadata.notes && (
                <Div>
                  <P className="text-xs text-muted-foreground mb-1">
                    {t("app.api.leads.lead.widget.notes")}
                  </P>
                  <P className="text-sm whitespace-pre-wrap">
                    {metadata.notes}
                  </P>
                </Div>
              )}
              {metadata.metadata &&
                Object.keys(metadata.metadata).length > 0 && (
                  <>
                    <Separator />
                    <Div>
                      <P className="text-xs text-muted-foreground mb-2">
                        {t("app.api.leads.lead.widget.metadata")}
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

        {/* ── Timestamps ── */}
        <Card>
          <CardContent className="pt-4">
            <Div className="grid grid-cols-2 gap-3">
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.leads.lead.widget.created")}
                </P>
                <P className="text-sm">
                  {formatSimpleDate(metadata.createdAt, locale)}
                </P>
                {leadAgeDays !== null && (
                  <P className="text-xs text-muted-foreground">
                    ({leadAgeDays} {t("app.api.leads.lead.widget.daysOld")})
                  </P>
                )}
              </Div>
              <InfoRow
                label={t("app.api.leads.lead.widget.lastUpdated")}
                value={formatSimpleDate(metadata.updatedAt, locale)}
              />
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}

/**
 * Custom Widget for User View
 * Comprehensive user dashboard with tabs for embedded sub-endpoints
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { User } from "next-vibe-ui/ui/icons/User";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { P } from "next-vibe-ui/ui/typography";
import { useCallback, useMemo, useState } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";

import type definition from "./definition";
import type { UserViewResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type TabId =
  | "overview"
  | "credits"
  | "referrals"
  | "earnings"
  | "connections"
  | "favorites"
  | "skills";

/**
 * Format currency cents to dollars
 */
function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format a role enum key like "enums.userRole.partnerAdmin" to "Partner Admin"
 */
function formatRoleLabel(roleKey: string): string {
  const lastSegment = roleKey.split(".").pop() ?? roleKey;
  return lastSegment
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/**
 * Format date to readable string
 */
function formatDate(date: Date | null | undefined): string {
  if (!date) {
    return "Never";
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Stat card component
 */
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClassName,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClassName: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardContent className="p-4">
        <Div className="flex items-start gap-3">
          <Div className={`rounded-lg p-2 ${colorClassName}`}>
            <Icon className="h-5 w-5" />
          </Div>
          <Div className="flex-1 min-w-0">
            <P className="text-xs text-muted-foreground mb-1">{title}</P>
            <P className="text-2xl font-bold tabular-nums">{value}</P>
            {description && (
              <P className="text-xs text-muted-foreground mt-1">
                {description}
              </P>
            )}
          </Div>
        </Div>
      </CardContent>
    </Card>
  );
}

/**
 * Custom container widget for user view
 */
export function UserViewContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { user } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const data = useWidgetValue<typeof definition.GET>();
  const children = field.children;

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copyIdSuccess, setCopyIdSuccess] = useState(false);

  const userId = data?.basicInfo?.id;

  const handleAddCredits = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const adminAddDefs = await import("../../credits/admin-add/definition");
    navigate(adminAddDefs.default.POST, {
      data: { targetUserId: userId },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleEdit = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const userDefs = await import("../user/[id]/definition");
    navigate(userDefs.default.PUT, {
      urlPathParams: { id: userId },
      prefillFromGet: true,
      getEndpoint: userDefs.default.GET,
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const userDefs = await import("../user/[id]/definition");
    navigate(userDefs.default.DELETE, {
      urlPathParams: { id: userId },
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleBan = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const userDefs = await import("../user/[id]/definition");
    navigate(userDefs.default.PUT, {
      urlPathParams: { id: userId },
      data: { isBanned: true },
      prefillFromGet: true,
      getEndpoint: userDefs.default.GET,
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleUnban = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const userDefs = await import("../user/[id]/definition");
    navigate(userDefs.default.PUT, {
      urlPathParams: { id: userId },
      data: { isBanned: false, bannedReason: null },
      prefillFromGet: true,
      getEndpoint: userDefs.default.GET,
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleCopyUserId = useCallback((): void => {
    if (!userId) {
      return;
    }
    void navigator.clipboard.writeText(userId).then(() => {
      setCopyIdSuccess(true);
      setTimeout(() => {
        setCopyIdSuccess(false);
      }, 2000);
      return undefined;
    });
  }, [userId]);

  // Memoize endpoint options for embedded EndpointsPage components
  const creditsEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: {
                targetUserId: userId,
                paginationInfo: { page: 1, limit: 20 },
              },
            },
          }
        : undefined,
    [userId],
  );

  const referralEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: {
                targetUserId: userId,
              },
            },
          }
        : undefined,
    [userId],
  );

  const earningsEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: {
                targetUserId: userId,
                limit: 50,
                offset: 0,
              },
            },
          }
        : undefined,
    [userId],
  );

  const favoritesEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: {
                userId,
              },
            },
          }
        : undefined,
    [userId],
  );

  const skillsEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: {
                targetUserId: userId,
              },
            },
          }
        : undefined,
    [userId],
  );

  if (!data) {
    return (
      <Div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const {
    basicInfo,
    chatStats,
    creditInfo,
    paymentStats,
    newsletterInfo,
    referralStats,
    roles,
    recentActivity,
    modelUsageStats,
    connectedLeads,
    connectedUsers,
  } = data;

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: t("tabs.overview") },
    { id: "credits", label: t("tabs.credits") },
    { id: "referrals", label: t("tabs.referrals") },
    { id: "earnings", label: t("tabs.earnings") },
    { id: "connections", label: t("tabs.connections") },
    { id: "favorites", label: t("tabs.favorites") },
    { id: "skills", label: t("tabs.skills") },
  ];

  return (
    <Div className="flex flex-col gap-4">
      {/* Top action bar */}
      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex-1" />
        {userId && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleEdit()}
              className="gap-1"
            >
              <Pencil className="h-4 w-4" />
              {t("widget.actions.edit")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleAddCredits()}
              className="gap-1"
            >
              <Coins className="h-4 w-4" />
              {t("widget.actions.addCredits")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleDelete()}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t("widget.actions.delete")}
            </Button>
            {basicInfo.isBanned ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleUnban()}
                className="gap-1 text-success hover:text-success/80"
              >
                <CheckCircle className="h-4 w-4" />
                {t("ban.unbanUser")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleBan()}
                className="gap-1 text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4" />
                {t("ban.banUser")}
              </Button>
            )}
          </>
        )}
      </Div>

      {/* Basic User Information Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* User Header */}
          <Div className="flex items-start gap-4">
            {basicInfo.avatarUrl ? (
              <Div
                className="h-16 w-16 rounded-full overflow-hidden border-2 border-muted bg-cover bg-center"
                data-avatar-url={basicInfo.avatarUrl}
              />
            ) : (
              <Div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </Div>
            )}
            <Div className="flex-1">
              <Div className="flex items-center gap-2 mb-1 flex-wrap">
                <Span className="text-xl font-bold">
                  {basicInfo.privateName}
                </Span>
                {basicInfo.isBanned && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t("status.banned")}
                  </Badge>
                )}
                {!basicInfo.isActive && !basicInfo.isBanned && (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t("status.inactive")}
                  </Badge>
                )}
                {basicInfo.isActive && (
                  <Badge
                    variant="default"
                    className="gap-1 bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-3 w-3" />
                    {t("status.active")}
                  </Badge>
                )}
                {basicInfo.emailVerified && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {t("status.verified")}
                  </Badge>
                )}
              </Div>
              <P className="text-sm text-muted-foreground">
                @{basicInfo.publicName}
              </P>
              <P className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                {basicInfo.email}
              </P>
            </Div>
          </Div>

          {/* Banned Reason */}
          {basicInfo.isBanned && basicInfo.bannedReason && (
            <Div className="rounded-lg bg-destructive/10 p-3 border border-destructive/30">
              <Div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <Div>
                  <P className="text-sm font-medium text-destructive">
                    {t("fields.banReason")}
                  </P>
                  <P className="text-sm text-destructive/80 dark:text-destructive/80">
                    {basicInfo.bannedReason}
                  </P>
                </Div>
              </Div>
            </Div>
          )}

          <Separator />

          {/* User Details Grid */}
          <Div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.userId")}
              </P>
              <Div className="flex items-center gap-1">
                <P className="text-sm font-mono">
                  {basicInfo.id.slice(0, 8)}...
                </P>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={handleCopyUserId}
                >
                  {copyIdSuccess ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </Div>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.locale")}
              </P>
              <P className="text-sm">{basicInfo.locale}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.twoFactor")}
              </P>
              <Div className="flex items-center gap-1">
                {basicInfo.twoFactorEnabled ? (
                  <>
                    <Shield className="h-3 w-3 text-success" />
                    <P className="text-sm">{t("fields.enabled")}</P>
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm text-muted-foreground">
                      {t("fields.disabled")}
                    </P>
                  </>
                )}
              </Div>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.created")}
              </P>
              <P className="text-sm">{formatDate(basicInfo.createdAt)}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.lastUpdated")}
              </P>
              <P className="text-sm">{formatDate(basicInfo.updatedAt)}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("fields.marketing")}
              </P>
              <P className="text-sm">
                {basicInfo.marketingConsent
                  ? t("fields.optedIn")
                  : t("fields.optedOut")}
              </P>
            </Div>
          </Div>

          {/* Roles */}
          {roles.length > 0 && (
            <>
              <Separator />
              <Div>
                <P className="text-xs text-muted-foreground mb-2">
                  {t("fields.roles")}
                </P>
                <Div className="flex flex-wrap gap-2">
                  {roles.map((roleItem, index) => (
                    <Badge key={index} variant="outline">
                      {formatRoleLabel(roleItem.role)}
                    </Badge>
                  ))}
                </Div>
              </Div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-b-none border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </Div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          chatStats={chatStats}
          creditInfo={creditInfo}
          paymentStats={paymentStats}
          newsletterInfo={newsletterInfo}
          referralStats={referralStats}
          recentActivity={recentActivity}
          modelUsageStats={modelUsageStats}
          t={t}
        />
      )}

      {activeTab === "credits" && userId && creditsEndpointOptions && (
        <CreditHistoryTab
          locale={locale}
          user={user}
          endpointOptions={creditsEndpointOptions}
        />
      )}

      {activeTab === "referrals" && referralEndpointOptions && (
        <ReferralCodesTab
          locale={locale}
          user={user}
          endpointOptions={referralEndpointOptions}
        />
      )}

      {activeTab === "earnings" && earningsEndpointOptions && (
        <ReferralEarningsTab
          locale={locale}
          user={user}
          endpointOptions={earningsEndpointOptions}
        />
      )}

      {activeTab === "connections" && (
        <ConnectionsTab
          connectedLeads={connectedLeads}
          connectedUsers={connectedUsers}
          t={t}
          navigate={navigate}
        />
      )}

      {activeTab === "favorites" && userId && favoritesEndpointOptions && (
        <FavoritesTab
          locale={locale}
          user={user}
          endpointOptions={favoritesEndpointOptions}
        />
      )}

      {activeTab === "skills" && userId && skillsEndpointOptions && (
        <SkillsTab
          locale={locale}
          user={user}
          endpointOptions={skillsEndpointOptions}
        />
      )}
    </Div>
  );
}

/**
 * Overview tab with all stats cards
 */
function OverviewTab({
  chatStats,
  creditInfo,
  paymentStats,
  newsletterInfo,
  referralStats,
  recentActivity,
  modelUsageStats,
  t,
}: {
  chatStats: UserViewResponseOutput["chatStats"];
  creditInfo: UserViewResponseOutput["creditInfo"];
  paymentStats: UserViewResponseOutput["paymentStats"];
  newsletterInfo: UserViewResponseOutput["newsletterInfo"];
  referralStats: UserViewResponseOutput["referralStats"];
  recentActivity: UserViewResponseOutput["recentActivity"];
  modelUsageStats: UserViewResponseOutput["modelUsageStats"];
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-6">
      {/* Chat Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            {t("sections.chatActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={t("widget.stats.totalThreads")}
              value={chatStats.totalThreads}
              description={`${chatStats.activeThreads} active, ${chatStats.archivedThreads} archived`}
              icon={MessageSquare}
              colorClassName="bg-info/10 text-info"
            />
            <StatCard
              title={t("widget.stats.totalMessages")}
              value={chatStats.totalMessages}
              description={`${chatStats.userMessages} user, ${chatStats.aiMessages} AI`}
              icon={Activity}
              colorClassName="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
            <StatCard
              title={t("widget.stats.userMessages")}
              value={chatStats.userMessages}
              icon={User}
              colorClassName="bg-success/10 text-success"
            />
            <StatCard
              title={t("widget.stats.lastActivity")}
              value={
                chatStats.lastActivityAt
                  ? formatDate(chatStats.lastActivityAt)
                  : t("widget.stats.never")
              }
              icon={Clock}
              colorClassName="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            />
          </Div>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="h-4 w-4" />
            {t("sections.credits")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={t("credits.currentBalance")}
              value={creditInfo.currentBalance.toFixed(2)}
              description={t("credits.availableCredits")}
              icon={Coins}
              colorClassName="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
            />
            <StatCard
              title={t("widget.stats.freeCredits")}
              value={creditInfo.freeCreditsRemaining.toFixed(2)}
              description={`${t("widget.stats.freePeriod")}: ${creditInfo.freePeriodId || "N/A"}`}
              icon={Gift}
              colorClassName="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title={t("widget.stats.totalSpent")}
              value={creditInfo.totalCreditsSpent.toFixed(2)}
              icon={TrendingUp}
              colorClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title={t("widget.stats.totalPurchased")}
              value={creditInfo.totalCreditsPurchased.toFixed(2)}
              icon={CreditCard}
              colorClassName="bg-info/10 text-info"
            />
          </Div>
          <Separator />
          <P className="text-xs font-medium text-muted-foreground">
            {t("credits.packBreakdown")}
          </P>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={t("credits.subscription")}
              value={creditInfo.subscriptionCredits.toFixed(2)}
              description={
                creditInfo.nextExpiry
                  ? `${t("credits.expires")}: ${formatDate(creditInfo.nextExpiry)}`
                  : undefined
              }
              icon={Calendar}
              colorClassName="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            />
            <StatCard
              title={t("credits.permanent")}
              value={creditInfo.permanentCredits.toFixed(2)}
              icon={Shield}
              colorClassName="bg-info/10 text-info"
            />
            <StatCard
              title={t("credits.bonus")}
              value={creditInfo.bonusCredits.toFixed(2)}
              icon={Gift}
              colorClassName="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
            />
            <StatCard
              title={t("credits.earned")}
              value={creditInfo.earnedCredits.toFixed(2)}
              icon={DollarSign}
              colorClassName="bg-success/10 text-success"
            />
          </Div>
        </CardContent>
      </Card>

      {/* Model Usage */}
      {modelUsageStats && modelUsageStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              {t("modelUsage.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("modelUsage.model")}</TableHead>
                  <TableHead className="text-right">
                    {t("modelUsage.spent")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("modelUsage.messages")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelUsageStats.map((stat) => (
                  <TableRow key={stat.modelId}>
                    <TableCell className="font-mono text-sm">
                      {stat.modelId}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {stat.totalCreditsSpent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {stat.messageCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4" />
            {t("sections.payments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              title={t("widget.stats.totalRevenue")}
              value={formatCurrency(paymentStats.totalRevenueCents)}
              description={`${paymentStats.totalPayments} ${t("widget.stats.payments")}`}
              icon={DollarSign}
              colorClassName="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title={t("widget.stats.successful")}
              value={paymentStats.successfulPayments}
              description={`${t("widget.stats.failed")}: ${paymentStats.failedPayments}`}
              icon={CheckCircle}
              colorClassName="bg-success/10 text-success"
            />
            <StatCard
              title={t("widget.stats.totalRefunds")}
              value={formatCurrency(paymentStats.totalRefundsCents)}
              icon={XCircle}
              colorClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title={t("widget.stats.lastPayment")}
              value={
                paymentStats.lastPaymentAt
                  ? formatDate(paymentStats.lastPaymentAt)
                  : t("widget.stats.never")
              }
              icon={Calendar}
              colorClassName="bg-info/10 text-info"
            />
          </Div>
          <Separator className="my-4" />
          <Div className="grid grid-cols-2 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground mb-1">
                {t("payment.stripeCustomerId")}
              </P>
              <P className="text-sm font-mono">
                {paymentStats.stripeCustomerId || "N/A"}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground mb-1">
                {t("payment.activeSubscription")}
              </P>
              <Div className="flex items-center gap-1">
                {paymentStats.hasActiveSubscription ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-success" />
                    <P className="text-sm">{t("common.yes")}</P>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm text-muted-foreground">
                      {t("common.no")}
                    </P>
                  </>
                )}
              </Div>
            </Div>
            {paymentStats.subscriptionPlan && (
              <Div>
                <P className="text-xs text-muted-foreground mb-1">
                  {t("payment.subscriptionPlan")}
                </P>
                <P className="text-sm">
                  {paymentStats.subscriptionPlan}
                  {paymentStats.subscriptionInterval
                    ? ` / ${paymentStats.subscriptionInterval}`
                    : ""}
                </P>
              </Div>
            )}
            {paymentStats.subscriptionStatus &&
              !paymentStats.hasActiveSubscription && (
                <Div>
                  <P className="text-xs text-muted-foreground mb-1">
                    {t("payment.subscriptionStatus")}
                  </P>
                  <Badge variant="secondary" className="text-xs">
                    {paymentStats.subscriptionStatus}
                  </Badge>
                </Div>
              )}
            {paymentStats.subscriptionNextBilling && (
              <Div>
                <P className="text-xs text-muted-foreground mb-1">
                  {t("payment.nextBilling")}
                </P>
                <P className="text-sm">
                  {formatDate(paymentStats.subscriptionNextBilling)}
                </P>
              </Div>
            )}
          </Div>
        </CardContent>
      </Card>

      {/* Newsletter & Referrals */}
      <Div className="grid md:grid-cols-2 gap-6">
        {/* Newsletter */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              {t("sections.newsletter")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="flex items-center justify-between">
              <P className="text-sm text-muted-foreground">
                {t("newsletter.status")}
              </P>
              {newsletterInfo.isSubscribed ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t("newsletter.subscribed")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {t("newsletter.notSubscribed")}
                </Badge>
              )}
            </Div>
            {newsletterInfo.subscribedAt && (
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("newsletter.subscribedAt")}
                </P>
                <P className="text-sm">
                  {formatDate(newsletterInfo.subscribedAt)}
                </P>
              </Div>
            )}
            {newsletterInfo.confirmedAt && (
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("newsletter.confirmedAt")}
                </P>
                <P className="text-sm">
                  {formatDate(newsletterInfo.confirmedAt)}
                </P>
              </Div>
            )}
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              {t("sections.referrals")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="grid grid-cols-2 gap-3">
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("referrals.totalReferrals")}
                </P>
                <P className="text-2xl font-bold tabular-nums">
                  {referralStats.totalReferrals}
                </P>
              </Div>
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("referrals.activeCodes")}
                </P>
                <P className="text-2xl font-bold tabular-nums">
                  {referralStats.activeReferralCodes}
                </P>
              </Div>
            </Div>
            <Separator />
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("referrals.earnings")}
              </P>
              <P className="text-xl font-bold text-info">
                {formatCurrency(referralStats.totalReferralEarningsCents)}
              </P>
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            {t("sections.recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("activity.lastLogin")}
              </P>
              <P className="text-sm">{formatDate(recentActivity.lastLogin)}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("activity.lastThread")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastThreadCreated)}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("activity.lastMessage")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastMessageSent)}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("activity.lastPayment")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastPayment)}
              </P>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}

/**
 * Connections tab - shows connected leads and users
 */
function ConnectionsTab({
  connectedLeads,
  connectedUsers,
  t,
  navigate,
}: {
  connectedLeads: UserViewResponseOutput["connectedLeads"];
  connectedUsers: UserViewResponseOutput["connectedUsers"];
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): React.JSX.Element {
  const handleViewLead = useCallback(
    async (leadId: string): Promise<void> => {
      const leadDefs = await import("../../leads/lead/[id]/definition");
      navigate(leadDefs.default.GET, {
        urlPathParams: { id: leadId },
      });
    },
    [navigate],
  );

  const handleViewUser = useCallback(
    async (userId: string): Promise<void> => {
      const userViewDef = await import("./definition");
      navigate(userViewDef.GET, {
        data: { userId },
      });
    },
    [navigate],
  );

  return (
    <Div className="flex flex-col gap-6">
      {/* Connected Leads */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            {t("connections.leadsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectedLeads.length === 0 ? (
            <P className="text-sm text-muted-foreground">
              {t("connections.noLeads")}
            </P>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("connections.leadEmail")}</TableHead>
                  <TableHead>{t("connections.leadBusiness")}</TableHead>
                  <TableHead>{t("connections.leadStatus")}</TableHead>
                  <TableHead>{t("connections.ipAddress")}</TableHead>
                  <TableHead>{t("connections.device")}</TableHead>
                  <TableHead>{t("connections.linkReason")}</TableHead>
                  <TableHead>{t("connections.linkedAt")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-sm">
                      {lead.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.businessName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {lead.ipAddress ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[lead.deviceType, lead.browser, lead.os]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.linkReason ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(lead.linkedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleViewLead(lead.id)}
                        className="gap-1"
                      >
                        {t("connections.viewLead")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Connected Users */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            {t("connections.usersTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectedUsers.length === 0 ? (
            <P className="text-sm text-muted-foreground">
              {t("connections.noUsers")}
            </P>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("connections.userEmail")}</TableHead>
                  <TableHead>{t("connections.userPublicName")}</TableHead>
                  <TableHead>{t("connections.linkReason")}</TableHead>
                  <TableHead>{t("connections.linkedAt")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="text-sm">{u.email}</TableCell>
                    <TableCell className="text-sm">@{u.publicName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.linkReason ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(u.linkedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleViewUser(u.id)}
                        className="gap-1"
                      >
                        {t("connections.viewUser")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Div>
  );
}

/**
 * Credit History tab - embeds the credits/history EndpointsPage
 */
function CreditHistoryTab({
  locale,
  user,
  endpointOptions,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetContext>["user"];
  endpointOptions: {
    read: {
      initialState: {
        targetUserId: string;
        paginationInfo: { page: number; limit: number };
      };
    };
  };
}): React.JSX.Element {
  const [creditsHistoryDef, setCreditsHistoryDef] = useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  // Lazy load the definition
  if (!creditsHistoryDef) {
    void import("@/app/api/[locale]/credits/history/definition").then((mod) => {
      setCreditsHistoryDef(mod.default);
      return undefined;
    });
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={creditsHistoryDef}
        locale={locale}
        user={user}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Referral Codes tab - embeds the referral/codes/list EndpointsPage
 */
function ReferralCodesTab({
  locale,
  user,
  endpointOptions,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetContext>["user"];
  endpointOptions: {
    read: {
      initialState: {
        targetUserId: string;
      };
    };
  };
}): React.JSX.Element {
  const [referralCodesDef, setReferralCodesDef] = useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  if (!referralCodesDef) {
    void import("@/app/api/[locale]/referral/codes/list/definition").then(
      (mod) => {
        setReferralCodesDef(mod.default);
        return undefined;
      },
    );
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={referralCodesDef}
        locale={locale}
        user={user}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Favorites tab - embeds the agent/chat/favorites EndpointsPage (readonly via admin userId param)
 */
function FavoritesTab({
  locale,
  user,
  endpointOptions,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetContext>["user"];
  endpointOptions: {
    read: {
      initialState: {
        userId: string;
      };
    };
  };
}): React.JSX.Element {
  const [favoritesDef, setFavoritesDef] = useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  if (!favoritesDef) {
    void import("@/app/api/[locale]/agent/chat/favorites/definition").then(
      (mod) => {
        setFavoritesDef(mod.default);
        return undefined;
      },
    );
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={favoritesDef}
        locale={locale}
        user={user}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Skills tab - embeds the agent/chat/skills EndpointsPage (readonly via admin targetUserId param)
 */
function SkillsTab({
  locale,
  user,
  endpointOptions,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetContext>["user"];
  endpointOptions: {
    read: {
      initialState: {
        targetUserId: string;
      };
    };
  };
}): React.JSX.Element {
  const [skillsDef, setSkillsDef] = useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  if (!skillsDef) {
    void import("@/app/api/[locale]/agent/chat/skills/definition").then(
      (mod) => {
        setSkillsDef(mod.default);
        return undefined;
      },
    );
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={skillsDef}
        locale={locale}
        user={user}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Referral Earnings tab - embeds the referral/earnings/list EndpointsPage
 */
function ReferralEarningsTab({
  locale,
  user,
  endpointOptions,
}: {
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetContext>["user"];
  endpointOptions: {
    read: {
      initialState: {
        targetUserId: string;
        limit: number;
        offset: number;
      };
    };
  };
}): React.JSX.Element {
  const [referralEarningsDef, setReferralEarningsDef] = useState<{
    GET: CreateApiEndpointAny;
  } | null>(null);

  if (!referralEarningsDef) {
    void import("@/app/api/[locale]/referral/earnings/list/definition").then(
      (mod) => {
        setReferralEarningsDef(mod.default);
        return undefined;
      },
    );
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={referralEarningsDef}
        locale={locale}
        user={user}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

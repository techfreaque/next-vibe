/**
 * Custom Widget for User View
 * Comprehensive user dashboard with tabs for embedded sub-endpoints
 */

"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { User } from "next-vibe/ui/components/icons/User";
import { Users } from "next-vibe/ui/components/icons/Users";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { useCallback, useMemo, useState } from "react";

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
 * Format date to readable string
 */
function formatDate(date: Date | null | undefined, locale: string): string {
  if (!date) {
    return "—";
  }
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

  const handleCopyUserId = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    await copyToClipboard(userId);
    setCopyIdSuccess(true);
    setTimeout(() => {
      setCopyIdSuccess(false);
    }, 2000);
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
    return <LoadingBlock />;
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
    <WidgetShell>
      <WidgetHeader
        title={basicInfo.privateName}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          userId ? (
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
          ) : undefined
        }
      />

      {/* User Profile Section */}
      <SectionGroup title={t("sections.basicInfo")}>
        {/* User Header */}
        <Div className="flex items-start gap-4">
          {basicInfo.avatarUrl ? (
            <Div
              className="h-16 w-16 rounded-full overflow-hidden border-2 border-muted bg-cover bg-center flex-shrink-0"
              data-avatar-url={basicInfo.avatarUrl}
            />
          ) : (
            <Div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-muted flex-shrink-0">
              <User className="h-8 w-8 text-muted-foreground" />
            </Div>
          )}
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 mb-1 flex-wrap">
              <Span className="text-xl font-bold">{basicInfo.privateName}</Span>
              {basicInfo.isBanned && (
                <StatusPill
                  status="banned"
                  label={t("status.banned")}
                  variant="danger"
                />
              )}
              {!basicInfo.isActive && !basicInfo.isBanned && (
                <StatusPill
                  status="inactive"
                  label={t("status.inactive")}
                  variant="muted"
                />
              )}
              {basicInfo.isActive && (
                <StatusPill
                  status="active"
                  label={t("status.active")}
                  variant="success"
                />
              )}
              {basicInfo.emailVerified && (
                <StatusPill
                  status="verified"
                  label={t("status.verified")}
                  variant="info"
                />
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

        {/* User Details */}
        <DetailGrid columns={3}>
          <DetailField
            label={t("fields.userId")}
            mono
            copyable
            value={
              <Div className="flex items-center gap-1">
                <Span>{basicInfo.id.slice(0, 8)}...</Span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => void handleCopyUserId()}
                >
                  {copyIdSuccess ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </Div>
            }
          />
          <DetailField label={t("fields.locale")} value={basicInfo.locale} />
          <DetailField
            label={t("fields.twoFactor")}
            value={
              <Div className="flex items-center gap-1">
                <Shield
                  className={`h-3 w-3 ${basicInfo.twoFactorEnabled ? "text-success" : "text-muted-foreground"}`}
                />
                <Span>
                  {basicInfo.twoFactorEnabled
                    ? t("fields.enabled")
                    : t("fields.disabled")}
                </Span>
              </Div>
            }
          />
          <DetailField
            label={t("fields.created")}
            value={formatDate(basicInfo.createdAt, locale)}
          />
          <DetailField
            label={t("fields.lastUpdated")}
            value={formatDate(basicInfo.updatedAt, locale)}
          />
          <DetailField
            label={t("fields.marketing")}
            value={
              basicInfo.marketingConsent
                ? t("fields.optedIn")
                : t("fields.optedOut")
            }
          />
        </DetailGrid>

        {/* Roles */}
        {roles.length > 0 && (
          <Div>
            <P className="text-xs text-muted-foreground mb-2">
              {t("fields.roles")}
            </P>
            <Div className="flex flex-wrap gap-2">
              {roles.map((roleItem, index) => (
                <StatusPill
                  key={index}
                  status={roleItem.role}
                  variant="muted"
                />
              ))}
            </Div>
          </Div>
        )}
      </SectionGroup>

      {/* Tabs */}
      <Div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-b-none border-b-2 flex-shrink-0 ${
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
          locale={locale}
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
          locale={locale}
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
    </WidgetShell>
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
  locale,
}: {
  chatStats: UserViewResponseOutput["chatStats"];
  creditInfo: UserViewResponseOutput["creditInfo"];
  paymentStats: UserViewResponseOutput["paymentStats"];
  newsletterInfo: UserViewResponseOutput["newsletterInfo"];
  referralStats: UserViewResponseOutput["referralStats"];
  recentActivity: UserViewResponseOutput["recentActivity"];
  modelUsageStats: UserViewResponseOutput["modelUsageStats"];
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  locale: CountryLanguage;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      {/* Chat Activity */}
      <SectionGroup title={t("sections.chatActivity")}>
        <MetricGrid columns={4}>
          <MetricCard
            label={t("widget.stats.totalThreads")}
            value={chatStats.totalThreads}
            description={`${chatStats.activeThreads} active, ${chatStats.archivedThreads} archived`}
            variant="info"
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.stats.totalMessages")}
            value={chatStats.totalMessages}
            description={`${chatStats.userMessages} user, ${chatStats.aiMessages} AI`}
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.stats.userMessages")}
            value={chatStats.userMessages}
            variant="success"
            icon={<User className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.stats.lastActivity")}
            value={
              chatStats.lastActivityAt
                ? formatDate(chatStats.lastActivityAt, locale)
                : t("widget.stats.never")
            }
          />
        </MetricGrid>
      </SectionGroup>

      {/* Credits */}
      <SectionGroup title={t("sections.credits")}>
        <MetricGrid columns={4}>
          <MetricCard
            label={t("credits.currentBalance")}
            value={creditInfo.currentBalance.toFixed(2)}
            description={t("credits.availableCredits")}
            variant="info"
            icon={<Coins className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.stats.freeCredits")}
            value={creditInfo.freeCreditsRemaining.toFixed(2)}
            description={`${t("widget.stats.freePeriod")}: ${creditInfo.freePeriodId ?? "N/A"}`}
            variant="success"
          />
          <MetricCard
            label={t("widget.stats.totalSpent")}
            value={creditInfo.totalCreditsSpent.toFixed(2)}
            variant="danger"
          />
          <MetricCard
            label={t("widget.stats.totalPurchased")}
            value={creditInfo.totalCreditsPurchased.toFixed(2)}
          />
        </MetricGrid>

        <P className="text-xs font-medium text-muted-foreground">
          {t("credits.packBreakdown")}
        </P>

        <MetricGrid columns={4}>
          <MetricCard
            label={t("credits.subscription")}
            value={creditInfo.subscriptionCredits.toFixed(2)}
            description={
              creditInfo.nextExpiry
                ? `${t("credits.expires")}: ${formatDate(creditInfo.nextExpiry, locale)}`
                : undefined
            }
          />
          <MetricCard
            label={t("credits.permanent")}
            value={creditInfo.permanentCredits.toFixed(2)}
            variant="info"
          />
          <MetricCard
            label={t("credits.bonus")}
            value={creditInfo.bonusCredits.toFixed(2)}
          />
          <MetricCard
            label={t("credits.earned")}
            value={creditInfo.earnedCredits.toFixed(2)}
            variant="success"
          />
        </MetricGrid>
      </SectionGroup>

      {/* Model Usage */}
      {modelUsageStats && modelUsageStats.length > 0 && (
        <SectionGroup title={t("modelUsage.title")}>
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
        </SectionGroup>
      )}

      {/* Payments */}
      <SectionGroup title={t("sections.payments")}>
        <MetricGrid columns={4}>
          <MetricCard
            label={t("widget.stats.totalRevenue")}
            value={formatCurrency(paymentStats.totalRevenueCents)}
            description={`${paymentStats.totalPayments} ${t("widget.stats.payments")}`}
            variant="success"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.stats.successful")}
            value={paymentStats.successfulPayments}
            description={`${t("widget.stats.failed")}: ${paymentStats.failedPayments}`}
            variant="success"
          />
          <MetricCard
            label={t("widget.stats.totalRefunds")}
            value={formatCurrency(paymentStats.totalRefundsCents)}
            variant="danger"
          />
          <MetricCard
            label={t("widget.stats.lastPayment")}
            value={
              paymentStats.lastPaymentAt
                ? formatDate(paymentStats.lastPaymentAt, locale)
                : t("widget.stats.never")
            }
          />
        </MetricGrid>

        <DetailGrid columns={2}>
          <DetailField
            label={t("payment.stripeCustomerId")}
            value={paymentStats.stripeCustomerId ?? "N/A"}
            mono
          />
          <DetailField
            label={t("payment.activeSubscription")}
            value={
              paymentStats.hasActiveSubscription ? (
                <StatusPill
                  status="active"
                  label={t("common.yes")}
                  variant="success"
                />
              ) : (
                <StatusPill
                  status="inactive"
                  label={t("common.no")}
                  variant="muted"
                />
              )
            }
          />
          {paymentStats.subscriptionPlan && (
            <DetailField
              label={t("payment.subscriptionPlan")}
              value={`${paymentStats.subscriptionPlan}${paymentStats.subscriptionInterval ? ` / ${paymentStats.subscriptionInterval}` : ""}`}
            />
          )}
          {paymentStats.subscriptionStatus &&
            !paymentStats.hasActiveSubscription && (
              <DetailField
                label={t("payment.subscriptionStatus")}
                value={
                  <StatusPill
                    status={paymentStats.subscriptionStatus}
                    variant="muted"
                  />
                }
              />
            )}
          {paymentStats.subscriptionNextBilling && (
            <DetailField
              label={t("payment.nextBilling")}
              value={formatDate(paymentStats.subscriptionNextBilling, locale)}
            />
          )}
        </DetailGrid>
      </SectionGroup>

      {/* Newsletter & Referrals */}
      <Div className="grid @lg:grid-cols-2 gap-4">
        <SectionGroup title={t("sections.newsletter")}>
          <DetailGrid columns={1}>
            <DetailField
              label={t("newsletter.status")}
              value={
                newsletterInfo.isSubscribed ? (
                  <StatusPill
                    status="subscribed"
                    label={t("newsletter.subscribed")}
                    variant="success"
                  />
                ) : (
                  <StatusPill
                    status="not-subscribed"
                    label={t("newsletter.notSubscribed")}
                    variant="muted"
                  />
                )
              }
            />
            {newsletterInfo.subscribedAt && (
              <DetailField
                label={t("newsletter.subscribedAt")}
                value={formatDate(newsletterInfo.subscribedAt, locale)}
              />
            )}
            {newsletterInfo.confirmedAt && (
              <DetailField
                label={t("newsletter.confirmedAt")}
                value={formatDate(newsletterInfo.confirmedAt, locale)}
              />
            )}
          </DetailGrid>
        </SectionGroup>

        <SectionGroup title={t("sections.referrals")}>
          <MetricGrid columns={2}>
            <MetricCard
              label={t("referrals.totalReferrals")}
              value={referralStats.totalReferrals}
            />
            <MetricCard
              label={t("referrals.activeCodes")}
              value={referralStats.activeReferralCodes}
            />
          </MetricGrid>
          <DetailField
            label={t("referrals.earnings")}
            value={
              <Span className="text-xl font-bold text-info">
                {formatCurrency(referralStats.totalReferralEarningsCents)}
              </Span>
            }
          />
        </SectionGroup>
      </Div>

      {/* Recent Activity */}
      <SectionGroup title={t("sections.recentActivity")}>
        <DetailGrid columns={2}>
          <DetailField
            label={t("activity.lastLogin")}
            value={formatDate(recentActivity.lastLogin, locale)}
          />
          <DetailField
            label={t("activity.lastThread")}
            value={formatDate(recentActivity.lastThreadCreated, locale)}
          />
          <DetailField
            label={t("activity.lastMessage")}
            value={formatDate(recentActivity.lastMessageSent, locale)}
          />
          <DetailField
            label={t("activity.lastPayment")}
            value={formatDate(recentActivity.lastPayment, locale)}
          />
        </DetailGrid>
      </SectionGroup>
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
  locale,
}: {
  connectedLeads: UserViewResponseOutput["connectedLeads"];
  connectedUsers: UserViewResponseOutput["connectedUsers"];
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
}): React.JSX.Element {
  const handleViewLead = useCallback(
    async (leadId: string): Promise<void> => {
      const leadDefs = await import("@/leads/[id]/definition");
      navigate(leadDefs.default.GET, {
        urlPathParams: { id: leadId },
      });
    },
    [navigate],
  );

  const handleViewUser = useCallback(
    async (viewUserId: string): Promise<void> => {
      const userViewDef = await import("./definition");
      navigate(userViewDef.GET, {
        data: { userId: viewUserId },
      });
    },
    [navigate],
  );

  return (
    <Div className="flex flex-col gap-4">
      {/* Connected Leads */}
      <SectionGroup title={t("connections.leadsTitle")}>
        {connectedLeads.length === 0 ? (
          <EmptyBlock
            icon={<Users className="h-8 w-8" />}
            title={t("connections.noLeads")}
          />
        ) : (
          <Div className="flex flex-col divide-y divide-border">
            {connectedLeads.map((lead) => (
              <ListItem
                key={lead.id}
                title={lead.email ?? "—"}
                subtitle={lead.businessName}
                badges={<StatusPill status={lead.status} variant="default" />}
                meta={
                  <>
                    {lead.ipAddress && (
                      <Span className="font-mono text-xs">
                        {lead.ipAddress}
                      </Span>
                    )}
                    {[lead.deviceType, lead.browser, lead.os]
                      .filter(Boolean)
                      .join(" · ") && (
                      <Span>
                        {[lead.deviceType, lead.browser, lead.os]
                          .filter(Boolean)
                          .join(" · ")}
                      </Span>
                    )}
                    {lead.linkReason && <Span>{lead.linkReason}</Span>}
                    <Span>{formatDate(lead.linkedAt, locale)}</Span>
                  </>
                }
                actions={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleViewLead(lead.id)}
                  >
                    {t("connections.viewLead")}
                  </Button>
                }
              />
            ))}
          </Div>
        )}
      </SectionGroup>

      {/* Connected Users */}
      <SectionGroup title={t("connections.usersTitle")}>
        {connectedUsers.length === 0 ? (
          <EmptyBlock
            icon={<User className="h-8 w-8" />}
            title={t("connections.noUsers")}
          />
        ) : (
          <Div className="flex flex-col divide-y divide-border">
            {connectedUsers.map((u) => (
              <ListItem
                key={u.id}
                title={u.email}
                subtitle={`@${u.publicName}`}
                meta={
                  <>
                    {u.linkReason && <Span>{u.linkReason}</Span>}
                    <Span>{formatDate(u.linkedAt, locale)}</Span>
                  </>
                }
                actions={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleViewUser(u.id)}
                  >
                    {t("connections.viewUser")}
                  </Button>
                }
              />
            ))}
          </Div>
        )}
      </SectionGroup>
    </Div>
  );
}

/**
 * Credit History tab
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
  const [def, setDef] = useState<{ GET: CreateApiEndpointAny } | null>(null);
  const platform = useWidgetPlatform();

  if (!def) {
    void import("@/credits/history/definition").then((mod) => {
      setDef(mod.default);
      return undefined;
    });
    return <LoadingBlock />;
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Referral Codes tab
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
  const [def, setDef] = useState<{ GET: CreateApiEndpointAny } | null>(null);
  const platform = useWidgetPlatform();

  if (!def) {
    void import("@/referral/codes/list/definition").then((mod) => {
      setDef(mod.default);
      return undefined;
    });
    return <LoadingBlock />;
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Referral Earnings tab
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
  const [def, setDef] = useState<{ GET: CreateApiEndpointAny } | null>(null);
  const platform = useWidgetPlatform();

  if (!def) {
    void import("@/referral/earnings/list/definition").then((mod) => {
      setDef(mod.default);
      return undefined;
    });
    return <LoadingBlock />;
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Favorites tab
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
  const [def, setDef] = useState<{ GET: CreateApiEndpointAny } | null>(null);
  const platform = useWidgetPlatform();

  if (!def) {
    void import("next-vibe/agent/skills/favorites/definition").then((mod) => {
      setDef(mod.default);
      return undefined;
    });
    return <LoadingBlock />;
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

/**
 * Skills tab
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
  const [def, setDef] = useState<{ GET: CreateApiEndpointAny } | null>(null);
  const platform = useWidgetPlatform();

  if (!def) {
    void import("next-vibe/agent/skills/definition").then((mod) => {
      setDef(mod.default);
      return undefined;
    });
    return <LoadingBlock />;
  }

  return (
    <Div className="border rounded-lg overflow-hidden">
      <EndpointsPage
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

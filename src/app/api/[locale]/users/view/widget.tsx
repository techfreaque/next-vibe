/**
 * Custom Widget for User View
 * Displays comprehensive user information with statistics
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
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Gift,
  History,
  Mail,
  MessageSquare,
  Pencil,
  Shield,
  ShoppingCart,
  Trash2,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { useCallback, useState } from "react";

import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";
import type { UserViewResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: UserViewResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Format currency cents to dollars
 */
function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
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
  const t = useWidgetTranslation();
  const router = useRouter();
  const locale = useWidgetLocale();
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const data = field.value;
  const children = field.children;

  const userId = data?.basicInfo?.id;

  const handleViewCreditHistory = useCallback((): void => {
    if (!userId) {
      return;
    }
    router.push(`/${locale}/admin/users/${userId}/edit`);
  }, [router, locale, userId]);

  const handleEdit = useCallback((): void => {
    if (!userId) {
      return;
    }
    setEditLoading(true);
    router.push(`/${locale}/admin/users/${userId}/edit`);
    setEditLoading(false);
  }, [router, locale, userId]);

  const handleDelete = useCallback((): void => {
    if (!userId) {
      return;
    }
    setDeleteLoading(true);
    router.push(`/${locale}/admin/users/${userId}/edit`);
    setDeleteLoading(false);
  }, [router, locale, userId]);

  const handleViewSubscription = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleViewReferralCodes = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleViewReferralEarnings = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleAddCredits = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleViewLeadByEmail = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const [copyIdSuccess, setCopyIdSuccess] = useState(false);
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

  if (!data) {
    return (
      <Div className="flex flex-col items-center justify-center py-12 text-center">
        <Div className="rounded-full bg-muted p-3 mb-4">
          <User className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Div className="text-sm font-medium text-muted-foreground">
          {t("app.api.users.view.empty")}
        </Div>
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
  } = data;

  return (
    <Div className="flex flex-col gap-6">
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
              onClick={handleEdit}
              disabled={editLoading}
              className="gap-1"
            >
              {editLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              {t("app.api.users.view.widget.actions.edit")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="gap-1 text-destructive hover:text-destructive"
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {t("app.api.users.view.widget.actions.delete")}
            </Button>
          </>
        )}
      </Div>
      {/* Basic User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("app.api.users.view.sections.basicInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Div className="flex items-center gap-2 mb-1">
                <Span className="text-xl font-bold">
                  {basicInfo.privateName}
                </Span>
                {basicInfo.isBanned && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t("app.api.users.view.status.banned")}
                  </Badge>
                )}
                {!basicInfo.isActive && (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t("app.api.users.view.status.inactive")}
                  </Badge>
                )}
                {basicInfo.emailVerified && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {t("app.api.users.view.status.verified")}
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

          <Separator />

          {/* User Details Grid */}
          <Div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.userId")}
              </P>
              <P className="text-sm font-mono">{basicInfo.id.slice(0, 8)}...</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.locale")}
              </P>
              <P className="text-sm">{basicInfo.locale}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.twoFactor")}
              </P>
              <Div className="flex items-center gap-1">
                {basicInfo.twoFactorEnabled ? (
                  <>
                    <Shield className="h-3 w-3 text-green-600" />
                    <P className="text-sm">
                      {t("app.api.users.view.fields.enabled")}
                    </P>
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm text-muted-foreground">
                      {t("app.api.users.view.fields.disabled")}
                    </P>
                  </>
                )}
              </Div>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.marketing")}
              </P>
              <P className="text-sm">
                {basicInfo.marketingConsent
                  ? t("app.api.users.view.fields.optedIn")
                  : t("app.api.users.view.fields.optedOut")}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.created")}
              </P>
              <P className="text-sm">{formatDate(basicInfo.createdAt)}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.fields.lastUpdated")}
              </P>
              <P className="text-sm">{formatDate(basicInfo.updatedAt)}</P>
            </Div>
          </Div>

          {/* Banned Reason */}
          {basicInfo.isBanned && basicInfo.bannedReason && (
            <>
              <Separator />
              <Div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-800">
                <Div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                  <Div>
                    <P className="text-sm font-medium text-red-600 dark:text-red-400">
                      {t("app.api.users.view.fields.banReason")}
                    </P>
                    <P className="text-sm text-red-600/80 dark:text-red-400/80">
                      {basicInfo.bannedReason}
                    </P>
                  </Div>
                </Div>
              </Div>
            </>
          )}

          {/* User Roles */}
          {roles.length > 0 && (
            <>
              <Separator />
              <Div>
                <P className="text-xs text-muted-foreground mb-2">
                  {t("app.api.users.view.fields.roles")}
                </P>
                <Div className="flex flex-wrap gap-2">
                  {roles.map((roleItem, index) => (
                    <Badge key={index} variant="outline">
                      {roleItem.role}
                    </Badge>
                  ))}
                </Div>
              </Div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Chat Activity Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("app.api.users.view.sections.chatActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={t("app.api.users.view.widget.stats.totalThreads")}
              value={chatStats.totalThreads}
              description={`${chatStats.activeThreads} active, ${chatStats.archivedThreads} archived`}
              icon={MessageSquare}
              colorClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.totalMessages")}
              value={chatStats.totalMessages}
              description={`${chatStats.userMessages} user, ${chatStats.aiMessages} AI`}
              icon={Activity}
              colorClassName="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.userMessages")}
              value={chatStats.userMessages}
              icon={User}
              colorClassName="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.lastActivity")}
              value={
                chatStats.lastActivityAt
                  ? formatDate(chatStats.lastActivityAt)
                  : t("app.api.users.view.widget.stats.never")
              }
              icon={Clock}
              colorClassName="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            />
          </Div>
        </CardContent>
      </Card>

      {/* Credits Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {t("app.api.users.view.sections.credits")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={t("app.api.users.view.credits.currentBalance")}
              value={creditInfo.currentBalance.toFixed(2)}
              description={t("app.api.users.view.credits.availableCredits")}
              icon={Coins}
              colorClassName="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.freeCredits")}
              value={creditInfo.freeCreditsRemaining.toFixed(2)}
              description={`${t("app.api.users.view.widget.stats.freePeriod")}: ${creditInfo.freePeriodId || "N/A"}`}
              icon={Gift}
              colorClassName="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.totalSpent")}
              value={creditInfo.totalCreditsSpent.toFixed(2)}
              icon={TrendingUp}
              colorClassName="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.totalPurchased")}
              value={creditInfo.totalCreditsPurchased.toFixed(2)}
              icon={CreditCard}
              colorClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
          </Div>
        </CardContent>
      </Card>

      {/* Payment & Revenue Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t("app.api.users.view.sections.payments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              title={t("app.api.users.view.widget.stats.totalRevenue")}
              value={formatCurrency(paymentStats.totalRevenueCents)}
              description={`${paymentStats.totalPayments} ${t("app.api.users.view.widget.stats.payments")}`}
              icon={DollarSign}
              colorClassName="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.successful")}
              value={paymentStats.successfulPayments}
              description={`${t("app.api.users.view.widget.stats.failed")}: ${paymentStats.failedPayments}`}
              icon={CheckCircle}
              colorClassName="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.totalRefunds")}
              value={formatCurrency(paymentStats.totalRefundsCents)}
              icon={XCircle}
              colorClassName="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            />
            <StatCard
              title={t("app.api.users.view.widget.stats.lastPayment")}
              value={
                paymentStats.lastPaymentAt
                  ? formatDate(paymentStats.lastPaymentAt)
                  : t("app.api.users.view.widget.stats.never")
              }
              icon={Calendar}
              colorClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
          </Div>

          <Separator className="my-4" />

          <Div className="grid grid-cols-2 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground mb-1">
                {t("app.api.users.view.payment.stripeCustomerId")}
              </P>
              <P className="text-sm font-mono">
                {paymentStats.stripeCustomerId || "N/A"}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground mb-1">
                {t("app.api.users.view.payment.activeSubscription")}
              </P>
              <Div className="flex items-center gap-1">
                {paymentStats.hasActiveSubscription ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <P className="text-sm">
                      {t("app.api.users.view.common.yes")}
                    </P>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm text-muted-foreground">
                      {t("app.api.users.view.common.no")}
                    </P>
                  </>
                )}
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Newsletter & Referral Stats */}
      <Div className="grid md:grid-cols-2 gap-6">
        {/* Newsletter Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("app.api.users.view.sections.newsletter")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="flex items-center justify-between">
              <P className="text-sm text-muted-foreground">
                {t("app.api.users.view.newsletter.status")}
              </P>
              {newsletterInfo.isSubscribed ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t("app.api.users.view.newsletter.subscribed")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {t("app.api.users.view.newsletter.notSubscribed")}
                </Badge>
              )}
            </Div>
            {newsletterInfo.subscribedAt && (
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.users.view.newsletter.subscribedAt")}
                </P>
                <P className="text-sm">
                  {formatDate(newsletterInfo.subscribedAt)}
                </P>
              </Div>
            )}
            {newsletterInfo.confirmedAt && (
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.users.view.newsletter.confirmedAt")}
                </P>
                <P className="text-sm">
                  {formatDate(newsletterInfo.confirmedAt)}
                </P>
              </Div>
            )}
            {newsletterInfo.lastEmailSentAt && (
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.users.view.newsletter.lastEmailSent")}
                </P>
                <P className="text-sm">
                  {formatDate(newsletterInfo.lastEmailSentAt)}
                </P>
              </Div>
            )}
          </CardContent>
        </Card>

        {/* Referral Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("app.api.users.view.sections.referrals")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Div className="grid grid-cols-2 gap-3">
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.users.view.referrals.totalReferrals")}
                </P>
                <P className="text-2xl font-bold tabular-nums">
                  {referralStats.totalReferrals}
                </P>
              </Div>
              <Div>
                <P className="text-xs text-muted-foreground">
                  {t("app.api.users.view.referrals.activeCodes")}
                </P>
                <P className="text-2xl font-bold tabular-nums">
                  {referralStats.activeReferralCodes}
                </P>
              </Div>
            </Div>
            <Separator />
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.referrals.revenue")}
              </P>
              <P className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(referralStats.totalReferralRevenueCents)}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.referrals.earnings")}
              </P>
              <P className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(referralStats.totalReferralEarningsCents)}
              </P>
            </Div>
          </CardContent>
        </Card>
      </Div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("app.api.users.view.sections.recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.activity.lastLogin")}
              </P>
              <P className="text-sm">{formatDate(recentActivity.lastLogin)}</P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.activity.lastThread")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastThreadCreated)}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.activity.lastMessage")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastMessageSent)}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-muted-foreground">
                {t("app.api.users.view.activity.lastPayment")}
              </P>
              <P className="text-sm">
                {formatDate(recentActivity.lastPayment)}
              </P>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {t("app.api.users.view.widget.sections.quickActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewCreditHistory}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              {t("app.api.users.view.widget.actions.viewCreditHistory")}
            </Button>

            {paymentStats.hasActiveSubscription && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewSubscription}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {t("app.api.users.view.widget.actions.viewSubscription")}
              </Button>
            )}

            {referralStats.activeReferralCodes > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewReferralCodes}
                className="gap-2"
              >
                <Gift className="h-4 w-4" />
                {t("app.api.users.view.widget.actions.viewReferralCodes")}
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewReferralEarnings}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {t("app.api.users.view.widget.actions.viewReferralEarnings")}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCredits}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {t("app.api.users.view.widget.actions.addCredits")}
            </Button>

            {basicInfo.email && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewLeadByEmail}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                {t("app.api.users.view.widget.actions.viewLead")}
              </Button>
            )}

            {userId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyUserId}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                {copyIdSuccess
                  ? t("app.api.users.view.widget.actions.copied")
                  : t("app.api.users.view.widget.actions.copyUserId")}
              </Button>
            )}
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}

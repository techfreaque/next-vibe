/**
 * User View Widget
 * Admin detail for one account: money, credits, activity, attribution,
 * referrals, errors, and every admin action that exists for a user.
 * CLI/MCP get a compact text report.
 */

"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { UserPermissionRoleOptions } from "next-vibe/identity/roles/enum";
import { Platform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { User } from "next-vibe/ui/components/icons/User";
import { Users } from "next-vibe/ui/components/icons/Users";
import { X } from "next-vibe/ui/components/icons/X";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
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
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { useCallback, useMemo, useState } from "react";

import {
  formatDateTime,
  formatDay,
  formatMoney,
  formatNumber,
  formatRelative,
  formatUsd,
  roleLabel,
  subscriptionStatusLabel,
  subscriptionStatusVariant,
} from "../format";
import type definition from "./definition";
import type { UserViewResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type ViewT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

type TabId =
  | "overview"
  | "billing"
  | "credits"
  | "referrals"
  | "activity"
  | "connections"
  | "favorites"
  | "skills";

/** Last time we saw the user do anything: spend credits or log in. */
function lastSeen(data: UserViewResponseOutput): Date | null {
  const candidates = [
    data.recentActivity.lastCreditUsage,
    data.recentActivity.lastLogin,
    data.recentActivity.lastMessageSent,
  ].filter((d): d is Date => d !== null);
  if (candidates.length === 0) {
    return null;
  }
  return new Date(Math.max(...candidates.map((d) => new Date(d).getTime())));
}

/** Short label from an enum i18n value ("enums.paymentStatus.succeeded" -> "succeeded"). */
function enumTail(value: string): string {
  return value.split(".").pop() ?? value;
}

function paymentStatusVariant(
  status: string,
): "success" | "warning" | "danger" | "muted" {
  const tail = enumTail(status);
  if (tail === "succeeded") {
    return "success";
  }
  if (tail === "pending" || tail === "processing") {
    return "warning";
  }
  if (tail === "failed" || tail === "canceled") {
    return "danger";
  }
  return "muted";
}

// ─── CLI / MCP text report ──────────────────────────────────────────────────

function renderText(
  data: UserViewResponseOutput,
  t: ViewT,
  locale: CountryLanguage,
): string {
  const b = data.basicInfo;
  const lines: string[] = [];
  const flags = [
    b.isBanned ? t("status.banned") : "",
    !b.isActive ? t("status.inactive") : "",
    b.emailVerified ? t("status.verified") : t("status.unverified"),
  ].filter(Boolean);
  lines.push(`${b.privateName} <${b.email}> [${flags.join(", ")}]`);
  lines.push(
    `${t("fields.userId")}: ${b.id} | ${t("fields.roles")}: ${data.roles
      .map((r) => roleLabel(r.role, locale))
      .join(", ")}`,
  );
  lines.push(
    `${t("fields.created")}: ${formatDay(b.createdAt, locale)} | ${t("text.lastSeen")}: ${formatRelative(lastSeen(data), locale)} | ${t("fields.locale")}: ${b.locale}`,
  );
  lines.push("");
  lines.push(
    `${t("kpi.paid")}: ${formatUsd(data.paymentStats.totalPaidUsd, locale)} (${t("text.payments", { ok: data.paymentStats.successfulPayments, failed: data.paymentStats.failedPayments })})${data.paymentStats.totalRefundedUsd > 0 ? ` | ${t("kpi.refunded")}: ${formatUsd(data.paymentStats.totalRefundedUsd, locale)}` : ""}`,
  );
  lines.push(
    `${t("payment.subscription")}: ${
      data.paymentStats.subscriptionStatus
        ? `${subscriptionStatusLabel(data.paymentStats.subscriptionStatus, locale)}${data.paymentStats.subscriptionNextBilling ? `, ${t("payment.renews")} ${formatDay(data.paymentStats.subscriptionNextBilling, locale)}` : ""}`
        : t("payment.none")
    }`,
  );
  lines.push(
    `${t("kpi.credits")}: ${formatNumber(data.creditInfo.currentBalance, locale)} (+${formatNumber(data.creditInfo.freeCreditsRemaining, locale)} ${t("credits.free")}) | ${t("kpi.spent")}: ${formatNumber(data.creditInfo.totalCreditsSpent, locale)} | ${t("credits.purchased")}: ${formatNumber(data.creditInfo.totalCreditsPurchased, locale)}`,
  );
  if (data.attribution) {
    const a = data.attribution;
    lines.push(
      `${t("attribution.title")}: ${[
        a.firstChannel,
        a.firstSource,
        a.firstMedium,
        a.firstCampaign,
      ]
        .filter(Boolean)
        .join(" / ")}${a.firstRefCode ? ` (ref ${a.firstRefCode})` : ""}`,
    );
  }
  if (data.referredBy) {
    lines.push(
      `${t("referrals.referredBy")}: ${data.referredBy.email}${data.referredBy.code ? ` (${data.referredBy.code})` : ""}`,
    );
  }
  lines.push(
    `${t("referrals.signups")}: ${data.referralStats.totalReferrals} (${t("referrals.paying")}: ${data.referralStats.payingReferrals}) | ${t("chat.threads")}: ${data.chatStats.totalThreads} | ${t("engagement.favorites")}: ${data.engagement.favoritesCount} | ${t("engagement.skills")}: ${data.engagement.customSkillsCount}`,
  );
  if (data.payments.length > 0) {
    lines.push("");
    lines.push(t("billing.paymentsTitle"));
    for (const p of data.payments.slice(0, 8)) {
      lines.push(
        `  ${formatDay(p.createdAt, locale).padEnd(13)} ${formatMoney(p.amount, p.currency, locale).padEnd(11)} ${enumTail(p.status).padEnd(10)} ${enumTail(p.provider)}`,
      );
    }
  }
  if (data.modelUsageStats.length > 0) {
    lines.push("");
    lines.push(t("modelUsage.title"));
    for (const m of data.modelUsageStats.slice(0, 5)) {
      lines.push(
        `  ${m.modelId.padEnd(32)} ${formatNumber(m.totalCreditsSpent, locale).padStart(9)} cr  ${m.messageCount}x`,
      );
    }
  }
  if (data.errorLogs.length > 0) {
    lines.push("");
    lines.push(t("errorsTab.title"));
    for (const e of data.errorLogs.slice(0, 5)) {
      lines.push(
        `  ${formatDay(e.lastSeenAt, locale).padEnd(13)} x${String(e.occurrences).padEnd(4)} ${e.resolved ? "ok " : "!! "}${e.message.slice(0, 90)}`,
      );
    }
  }
  lines.push("");
  lines.push(t("text.actions", { id: b.id }));
  return lines.join("\n");
}

// ─── Container ──────────────────────────────────────────────────────────────

export function UserViewContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { user, endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const logger = useWidgetLogger();
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
      renderInModal: true,
      popNavigationOnSuccess: 2,
    });
  }, [navigate, userId]);

  const handleSetBanned = useCallback(
    async (isBanned: boolean): Promise<void> => {
      if (!userId) {
        return;
      }
      const userDefs = await import("../user/[id]/definition");
      navigate(userDefs.default.PUT, {
        urlPathParams: { id: userId },
        data: isBanned
          ? { isBanned: true }
          : { isBanned: false, bannedReason: null },
        prefillFromGet: true,
        getEndpoint: userDefs.default.GET,
        popNavigationOnSuccess: 1,
      });
    },
    [navigate, userId],
  );

  const handleAddRole = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const roleDefs = await import("../user/[id]/roles/definition");
    navigate(roleDefs.default.POST, {
      urlPathParams: { id: userId },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleRemoveRole = useCallback(
    async (
      role: (typeof UserPermissionRoleOptions)[number]["value"],
    ): Promise<void> => {
      if (!userId) {
        return;
      }
      const roleDefs = await import("../user/[id]/roles/definition");
      navigate(roleDefs.default.DELETE, {
        urlPathParams: { id: userId },
        data: { role },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    },
    [navigate, userId],
  );

  const handleViewUser = useCallback(
    async (viewUserId: string): Promise<void> => {
      const userViewDef = await import("./definition");
      navigate(userViewDef.GET, { data: { userId: viewUserId } });
    },
    [navigate],
  );

  const handleViewErrors = useCallback(async (): Promise<void> => {
    const errorDefs =
      await import("next-vibe/logger/error-monitor/logs/definition");
    navigate(errorDefs.default.GET, { data: { search: userId } });
  }, [navigate, userId]);

  const handleCopyUserId = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    await copyToClipboard(userId, logger);
    setCopyIdSuccess(true);
    setTimeout(() => {
      setCopyIdSuccess(false);
    }, 2000);
  }, [userId, logger]);

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
      userId ? { read: { initialState: { targetUserId: userId } } } : undefined,
    [userId],
  );
  const earningsEndpointOptions = useMemo(
    () =>
      userId
        ? {
            read: {
              initialState: { targetUserId: userId, limit: 50, offset: 0 },
            },
          }
        : undefined,
    [userId],
  );
  const favoritesEndpointOptions = useMemo(
    () => (userId ? { read: { initialState: { userId } } } : undefined),
    [userId],
  );
  const skillsEndpointOptions = useMemo(
    () =>
      userId ? { read: { initialState: { targetUserId: userId } } } : undefined,
    [userId],
  );

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return data ? <Pre>{renderText(data, t, locale)}</Pre> : <Pre>{""}</Pre>;
  }

  if (!data) {
    return (
      <WidgetShell>
        <WidgetHeader
          title={t("get.title")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
        />
        <FormAlertWidget field={{}} />
        {endpointMutations?.read?.isLoading !== false && (
          <LoadingBlock message={t("widget.loading")} />
        )}
      </WidgetShell>
    );
  }

  const {
    basicInfo,
    chatStats,
    creditInfo,
    paymentStats,
    roles,
    recentActivity,
  } = data;
  const seen = lastSeen(data);
  const heldRoles = new Set(roles.map((r) => r.role));
  const canAddRole = UserPermissionRoleOptions.some(
    (option) => !heldRoles.has(option.value),
  );

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "overview", label: t("tabs.overview") },
    {
      id: "billing",
      label: t("tabs.billing"),
      count: data.payments.length,
    },
    { id: "credits", label: t("tabs.credits") },
    {
      id: "referrals",
      label: t("tabs.referrals"),
      count: data.referralStats.totalReferrals,
    },
    {
      id: "activity",
      label: t("tabs.activity"),
      count: data.errorLogs.filter((e) => !e.resolved).length,
    },
    {
      id: "connections",
      label: t("tabs.connections"),
      count: data.connectedLeads.length + data.connectedUsers.length,
    },
    {
      id: "favorites",
      label: t("tabs.favorites"),
      count: data.engagement.favoritesCount,
    },
    {
      id: "skills",
      label: t("tabs.skills"),
      count: data.engagement.customSkillsCount,
    },
  ];

  return (
    <WidgetShell>
      <WidgetHeader
        title={basicInfo.privateName || basicInfo.email}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleEdit()}
              className="gap-1"
            >
              <Pencil className="h-4 w-4" />
              <Span className="hidden sm:inline">
                {t("widget.actions.edit")}
              </Span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleAddCredits()}
              className="gap-1"
            >
              <Coins className="h-4 w-4" />
              <Span className="hidden sm:inline">
                {t("widget.actions.addCredits")}
              </Span>
            </Button>
            {basicInfo.isBanned ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleSetBanned(false)}
                className="gap-1 text-success hover:text-success/80"
              >
                <CheckCircle className="h-4 w-4" />
                <Span className="hidden sm:inline">{t("ban.unbanUser")}</Span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleSetBanned(true)}
                className="gap-1 text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4" />
                <Span className="hidden sm:inline">{t("ban.banUser")}</Span>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleDelete()}
              className="gap-1 text-destructive hover:text-destructive"
              title={t("widget.actions.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />

      {/* Identity */}
      <Div className="flex items-start gap-4">
        <Div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg font-semibold text-primary">
          {(basicInfo.privateName || basicInfo.email).slice(0, 2).toUpperCase()}
        </Div>
        <Div className="flex-1 min-w-0 flex flex-col gap-1">
          <Div className="flex items-center gap-2 flex-wrap">
            <Span className="text-xl font-bold">{basicInfo.privateName}</Span>
            <Span className="text-sm text-muted-foreground">
              @{basicInfo.publicName}
            </Span>
            {basicInfo.isBanned ? (
              <StatusPill
                status="banned"
                label={t("status.banned")}
                variant="danger"
              />
            ) : basicInfo.isActive ? (
              <StatusPill
                status="active"
                label={t("status.active")}
                variant="success"
              />
            ) : (
              <StatusPill
                status="inactive"
                label={t("status.inactive")}
                variant="muted"
              />
            )}
            <StatusPill
              status={basicInfo.emailVerified ? "verified" : "unverified"}
              label={
                basicInfo.emailVerified
                  ? t("status.verified")
                  : t("status.unverified")
              }
              variant={basicInfo.emailVerified ? "info" : "warning"}
            />
            {paymentStats.subscriptionStatus && (
              <StatusPill
                status={paymentStats.subscriptionStatus}
                label={subscriptionStatusLabel(
                  paymentStats.subscriptionStatus,
                  locale,
                )}
                variant={subscriptionStatusVariant(
                  paymentStats.subscriptionStatus,
                )}
              />
            )}
          </Div>
          <P className="text-sm text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {basicInfo.email}
          </P>
          <Div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Span>{basicInfo.id}</Span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={() => void handleCopyUserId()}
              title={t("widget.actions.copyUserId")}
            >
              {copyIdSuccess ? (
                <CheckCircle className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </Div>
          {/* Roles with inline management */}
          <Div className="flex items-center gap-1.5 flex-wrap pt-1">
            {roles.map((roleItem) => (
              <Span
                key={roleItem.role}
                className="inline-flex items-center gap-1 rounded-full bg-muted pl-2.5 pr-1 py-0.5 text-xs font-medium"
              >
                {roleLabel(roleItem.role, locale)}
                {UserPermissionRoleOptions.map((o) => o.value)
                  .filter((value) => value === roleItem.role)
                  .map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 rounded-full hover:text-destructive"
                      onClick={() => void handleRemoveRole(value)}
                      title={t("roles.remove")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  ))}
              </Span>
            ))}
            {canAddRole && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 gap-1 text-xs"
                onClick={() => void handleAddRole()}
              >
                <Plus className="h-3 w-3" />
                {t("roles.add")}
              </Button>
            )}
          </Div>
        </Div>
      </Div>

      {basicInfo.isBanned && basicInfo.bannedReason && (
        <Div className="rounded-lg bg-destructive/10 p-3 border border-destructive/30 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
          <Div>
            <P className="text-sm font-medium text-destructive">
              {t("fields.banReason")}
            </P>
            <P className="text-sm text-destructive/80">
              {basicInfo.bannedReason}
            </P>
          </Div>
        </Div>
      )}

      {/* Business KPIs */}
      <MetricGrid columns={4}>
        <MetricCard
          label={t("kpi.paid")}
          value={formatUsd(paymentStats.totalPaidUsd, locale)}
          description={t("kpi.paidHint", {
            count: paymentStats.successfulPayments,
          })}
          variant={paymentStats.totalPaidUsd > 0 ? "success" : "muted"}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.credits")}
          value={formatNumber(creditInfo.currentBalance, locale)}
          description={t("kpi.creditsHint", {
            free: formatNumber(creditInfo.freeCreditsRemaining, locale),
          })}
          variant="info"
          icon={<Coins className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.spent")}
          value={formatNumber(creditInfo.totalCreditsSpent, locale)}
          description={t("kpi.spentHint", {
            usd: formatUsd(creditInfo.totalCreditsSpent * 0.01, locale),
          })}
          icon={<Zap className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.lastSeen")}
          value={seen ? formatRelative(seen, locale) : t("widget.never")}
          description={t("kpi.joined", {
            date: formatDay(basicInfo.createdAt, locale),
          })}
          icon={<User className="h-4 w-4" />}
        />
      </MetricGrid>

      {/* Tabs */}
      <Div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-b-none border-b-2 flex-shrink-0 gap-1.5 ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Span className="rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">
                {tab.count}
              </Span>
            )}
          </Button>
        ))}
      </Div>

      {activeTab === "overview" && (
        <OverviewTab data={data} t={t} locale={locale} />
      )}

      {activeTab === "billing" && (
        <BillingTab data={data} t={t} locale={locale} />
      )}

      {activeTab === "credits" && creditsEndpointOptions && (
        <CreditHistoryTab
          locale={locale}
          user={user}
          endpointOptions={creditsEndpointOptions}
        />
      )}

      {activeTab === "referrals" &&
        referralEndpointOptions &&
        earningsEndpointOptions && (
          <Div className="flex flex-col gap-4">
            <ReferralSummary
              data={data}
              t={t}
              locale={locale}
              onViewUser={handleViewUser}
            />
            <ReferralCodesTab
              locale={locale}
              user={user}
              endpointOptions={referralEndpointOptions}
            />
            <ReferralEarningsTab
              locale={locale}
              user={user}
              endpointOptions={earningsEndpointOptions}
            />
          </Div>
        )}

      {activeTab === "activity" && (
        <ActivityTab
          data={data}
          chatStats={chatStats}
          recentActivity={recentActivity}
          t={t}
          locale={locale}
          onViewErrors={handleViewErrors}
        />
      )}

      {activeTab === "connections" && (
        <ConnectionsTab
          connectedLeads={data.connectedLeads}
          connectedUsers={data.connectedUsers}
          t={t}
          navigate={navigate}
          locale={locale}
        />
      )}

      {activeTab === "favorites" && favoritesEndpointOptions && (
        <FavoritesTab
          locale={locale}
          user={user}
          endpointOptions={favoritesEndpointOptions}
        />
      )}

      {activeTab === "skills" && skillsEndpointOptions && (
        <SkillsTab
          locale={locale}
          user={user}
          endpointOptions={skillsEndpointOptions}
        />
      )}
    </WidgetShell>
  );
}

// ─── Overview ───────────────────────────────────────────────────────────────

function OverviewTab({
  data,
  t,
  locale,
}: {
  data: UserViewResponseOutput;
  t: ViewT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const { creditInfo, paymentStats, newsletterInfo, attribution, basicInfo } =
    data;
  return (
    <Div className="flex flex-col gap-4">
      <SectionGroup title={t("sections.subscription")}>
        {paymentStats.subscriptionStatus ? (
          <DetailGrid columns={3}>
            <DetailField
              label={t("payment.status")}
              value={
                <StatusPill
                  status={paymentStats.subscriptionStatus}
                  label={subscriptionStatusLabel(
                    paymentStats.subscriptionStatus,
                    locale,
                  )}
                  variant={subscriptionStatusVariant(
                    paymentStats.subscriptionStatus,
                  )}
                />
              }
            />
            <DetailField
              label={t("payment.interval")}
              value={
                paymentStats.subscriptionInterval
                  ? enumTail(paymentStats.subscriptionInterval)
                  : "-"
              }
            />
            <DetailField
              label={
                paymentStats.cancelAtPeriodEnd
                  ? t("payment.endsOn")
                  : t("payment.renews")
              }
              value={formatDay(paymentStats.subscriptionNextBilling, locale)}
            />
            <DetailField
              label={t("payment.firstPayment")}
              value={formatDay(paymentStats.firstPaymentAt, locale)}
            />
            <DetailField
              label={t("payment.lastPayment")}
              value={formatDay(paymentStats.lastPaymentAt, locale)}
            />
            <DetailField
              label={t("payment.stripeCustomerId")}
              value={paymentStats.stripeCustomerId ?? "-"}
              mono
            />
          </DetailGrid>
        ) : (
          <P className="text-sm text-muted-foreground">
            {paymentStats.successfulPayments > 0
              ? t("payment.noSubscriptionButPaid", {
                  amount: formatUsd(paymentStats.totalPaidUsd, locale),
                })
              : t("payment.none")}
          </P>
        )}
      </SectionGroup>

      <SectionGroup title={t("sections.credits")}>
        <MetricGrid columns={4}>
          <MetricCard
            label={t("credits.subscription")}
            value={formatNumber(creditInfo.subscriptionCredits, locale)}
            description={
              creditInfo.nextExpiry
                ? t("credits.expires", {
                    date: formatDay(creditInfo.nextExpiry, locale),
                  })
                : undefined
            }
          />
          <MetricCard
            label={t("credits.permanent")}
            value={formatNumber(creditInfo.permanentCredits, locale)}
          />
          <MetricCard
            label={t("credits.bonus")}
            value={formatNumber(creditInfo.bonusCredits, locale)}
          />
          <MetricCard
            label={t("credits.free")}
            value={formatNumber(creditInfo.freeCreditsRemaining, locale)}
            description={creditInfo.freePeriodId ?? undefined}
          />
        </MetricGrid>
        <DetailGrid columns={3}>
          <DetailField
            label={t("credits.purchased")}
            value={formatNumber(creditInfo.totalCreditsPurchased, locale)}
          />
          <DetailField
            label={t("credits.earnedTotal")}
            value={formatNumber(creditInfo.totalCreditsEarned, locale)}
          />
          <DetailField
            label={t("credits.spentTotal")}
            value={formatNumber(creditInfo.totalCreditsSpent, locale)}
          />
        </DetailGrid>
      </SectionGroup>

      <SectionGroup title={t("attribution.title")}>
        {attribution ? (
          <DetailGrid columns={3}>
            <DetailField
              label={t("attribution.firstChannel")}
              value={attribution.firstChannel}
            />
            <DetailField
              label={t("attribution.utm")}
              value={
                [
                  attribution.firstSource,
                  attribution.firstMedium,
                  attribution.firstCampaign,
                ]
                  .filter(Boolean)
                  .join(" / ") || "-"
              }
            />
            <DetailField
              label={t("attribution.refCode")}
              value={attribution.firstRefCode ?? "-"}
            />
            <DetailField
              label={t("attribution.referrerHost")}
              value={attribution.firstReferrerHost ?? "-"}
            />
            <DetailField
              label={t("attribution.landingPath")}
              value={attribution.firstLandingPath ?? "-"}
              mono
            />
            <DetailField
              label={t("attribution.lastChannel")}
              value={attribution.lastChannel}
            />
            <DetailField
              label={t("attribution.firstTouch")}
              value={formatDateTime(attribution.firstTouchAt, locale)}
            />
            <DetailField
              label={t("attribution.firstChat")}
              value={formatDateTime(attribution.firstChatAt, locale)}
            />
            <DetailField
              label={t("attribution.firstPaid")}
              value={formatDateTime(attribution.firstPaidAt, locale)}
            />
          </DetailGrid>
        ) : (
          <P className="text-sm text-muted-foreground">
            {t("attribution.none")}
          </P>
        )}
      </SectionGroup>

      <SectionGroup title={t("sections.profile")}>
        <DetailGrid columns={3}>
          <DetailField label={t("fields.locale")} value={basicInfo.locale} />
          <DetailField
            label={t("fields.twoFactor")}
            value={
              basicInfo.twoFactorEnabled
                ? t("fields.enabled")
                : t("fields.disabled")
            }
          />
          <DetailField
            label={t("fields.marketing")}
            value={
              basicInfo.marketingConsent
                ? t("fields.optedIn")
                : t("fields.optedOut")
            }
          />
          <DetailField
            label={t("newsletter.status")}
            value={
              newsletterInfo.isSubscribed
                ? t("newsletter.subscribed")
                : t("newsletter.notSubscribed")
            }
          />
          <DetailField
            label={t("fields.created")}
            value={formatDateTime(basicInfo.createdAt, locale)}
          />
          <DetailField
            label={t("fields.lastUpdated")}
            value={formatDateTime(basicInfo.updatedAt, locale)}
          />
        </DetailGrid>
      </SectionGroup>
    </Div>
  );
}

// ─── Billing ────────────────────────────────────────────────────────────────

function BillingTab({
  data,
  t,
  locale,
}: {
  data: UserViewResponseOutput;
  t: ViewT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const { paymentStats, payments, subscriptions } = data;
  return (
    <Div className="flex flex-col gap-4">
      <MetricGrid columns={4}>
        <MetricCard
          label={t("kpi.paid")}
          value={formatUsd(paymentStats.totalPaidUsd, locale)}
          variant="success"
        />
        <MetricCard
          label={t("kpi.refunded")}
          value={formatUsd(paymentStats.totalRefundedUsd, locale)}
          variant={paymentStats.totalRefundedUsd > 0 ? "danger" : "muted"}
        />
        <MetricCard
          label={t("billing.succeeded")}
          value={paymentStats.successfulPayments}
          description={t("billing.ofAttempts", {
            count: paymentStats.totalPayments,
          })}
        />
        <MetricCard
          label={t("billing.failedPending")}
          value={`${paymentStats.failedPayments} / ${paymentStats.pendingPayments}`}
          variant={paymentStats.failedPayments > 0 ? "warning" : "muted"}
        />
      </MetricGrid>

      <SectionGroup title={t("billing.paymentsTitle")}>
        {payments.length === 0 ? (
          <EmptyBlock
            icon={<DollarSign className="h-8 w-8" />}
            title={t("billing.noPayments")}
          />
        ) : (
          <Div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("billing.date")}</TableHead>
                  <TableHead className="text-right">
                    {t("billing.amount")}
                  </TableHead>
                  <TableHead className="text-right">USD</TableHead>
                  <TableHead>{t("billing.status")}</TableHead>
                  <TableHead>{t("billing.kind")}</TableHead>
                  <TableHead>{t("billing.provider")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {formatDateTime(p.createdAt, locale)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(p.amount, p.currency, locale)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatUsd(p.amountUsd, locale)}
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        status={p.status}
                        label={enumTail(p.status)}
                        variant={paymentStatusVariant(p.status)}
                      />
                    </TableCell>
                    <TableCell className="text-xs">
                      {enumTail(p.mode)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {enumTail(p.provider)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
        )}
      </SectionGroup>

      <SectionGroup title={t("billing.subscriptionsTitle")}>
        {subscriptions.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("payment.none")}</P>
        ) : (
          <Div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("billing.started")}</TableHead>
                  <TableHead>{t("billing.status")}</TableHead>
                  <TableHead>{t("payment.interval")}</TableHead>
                  <TableHead>{t("billing.periodEnd")}</TableHead>
                  <TableHead>{t("billing.provider")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {formatDay(s.createdAt, locale)}
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        status={s.status}
                        label={subscriptionStatusLabel(s.status, locale)}
                        variant={subscriptionStatusVariant(s.status)}
                      />
                      {s.cancelAtPeriodEnd && (
                        <Span className="ml-1 text-xs text-warning">
                          {t("billing.cancels")}
                        </Span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {enumTail(s.billingInterval)}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {formatDay(s.currentPeriodEnd, locale)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {enumTail(s.provider)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
        )}
      </SectionGroup>
    </Div>
  );
}

// ─── Referrals summary ──────────────────────────────────────────────────────

function ReferralSummary({
  data,
  t,
  locale,
  onViewUser,
}: {
  data: UserViewResponseOutput;
  t: ViewT;
  locale: CountryLanguage;
  onViewUser: (id: string) => Promise<void>;
}): React.JSX.Element {
  const { referralStats, referredBy, referredUsers } = data;
  return (
    <Div className="flex flex-col gap-4">
      {referredBy && (
        <SectionGroup title={t("referrals.referredBy")}>
          <ListItem
            title={referredBy.email}
            subtitle={
              referredBy.code
                ? t("referrals.viaCode", { code: referredBy.code })
                : undefined
            }
            meta={<Span>{formatDay(referredBy.referredAt, locale)}</Span>}
            actions={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void onViewUser(referredBy.userId)}
              >
                {t("connections.viewUser")}
              </Button>
            }
          />
        </SectionGroup>
      )}

      <MetricGrid columns={4}>
        <MetricCard
          label={t("referrals.signups")}
          value={referralStats.totalReferrals}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          label={t("referrals.paying")}
          value={referralStats.payingReferrals}
          variant="success"
        />
        <MetricCard
          label={t("referrals.activeCodes")}
          value={referralStats.activeReferralCodes}
        />
        <MetricCard
          label={t("referrals.earnings")}
          value={
            referralStats.earnings.length === 0
              ? "-"
              : referralStats.earnings
                  .map((e) =>
                    formatMoney(e.amountCents / 100, e.currency, locale),
                  )
                  .join(" + ")
          }
          variant="info"
        />
      </MetricGrid>

      <SectionGroup title={t("referrals.referredUsers")}>
        {referredUsers.length === 0 ? (
          <P className="text-sm text-muted-foreground">
            {t("referrals.noneReferred")}
          </P>
        ) : (
          <Div className="flex flex-col divide-y divide-border">
            {referredUsers.map((u) => (
              <ListItem
                key={u.id}
                title={u.email}
                meta={
                  <>
                    <Span>{formatDay(u.createdAt, locale)}</Span>
                    {u.totalPaidUsd > 0 && (
                      <Span className="text-success">
                        {formatUsd(u.totalPaidUsd, locale)}
                      </Span>
                    )}
                  </>
                }
                actions={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void onViewUser(u.id)}
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

// ─── Activity ───────────────────────────────────────────────────────────────

function ActivityTab({
  data,
  chatStats,
  recentActivity,
  t,
  locale,
  onViewErrors,
}: {
  data: UserViewResponseOutput;
  chatStats: UserViewResponseOutput["chatStats"];
  recentActivity: UserViewResponseOutput["recentActivity"];
  t: ViewT;
  locale: CountryLanguage;
  onViewErrors: () => Promise<void>;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <SectionGroup title={t("sections.recentActivity")}>
        <DetailGrid columns={3}>
          <DetailField
            label={t("activity.lastCreditUsage")}
            value={formatDateTime(recentActivity.lastCreditUsage, locale)}
          />
          <DetailField
            label={t("activity.lastLogin")}
            value={formatDateTime(recentActivity.lastLogin, locale)}
          />
          <DetailField
            label={t("activity.activeSessions")}
            value={String(recentActivity.activeSessions)}
          />
          <DetailField
            label={t("activity.lastMessage")}
            value={formatDateTime(recentActivity.lastMessageSent, locale)}
          />
          <DetailField
            label={t("activity.lastThread")}
            value={formatDateTime(recentActivity.lastThreadCreated, locale)}
          />
          <DetailField
            label={t("activity.lastPayment")}
            value={formatDateTime(recentActivity.lastPayment, locale)}
          />
        </DetailGrid>
      </SectionGroup>

      <SectionGroup title={t("sections.chatActivity")}>
        <MetricGrid columns={4}>
          <MetricCard
            label={t("chat.threads")}
            value={chatStats.totalThreads}
            description={t("chat.threadsHint", {
              active: chatStats.activeThreads,
              archived: chatStats.archivedThreads,
            })}
          />
          <MetricCard
            label={t("chat.userMessages")}
            value={chatStats.userMessages}
          />
          <MetricCard
            label={t("chat.aiMessages")}
            value={chatStats.aiMessages}
          />
          <MetricCard
            label={t("engagement.favorites")}
            value={data.engagement.favoritesCount}
            description={t("engagement.skillsHint", {
              count: data.engagement.customSkillsCount,
            })}
          />
        </MetricGrid>
        <P className="text-xs text-muted-foreground">
          {t("chat.incognitoNote")}
        </P>
      </SectionGroup>

      {data.modelUsageStats.length > 0 && (
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
              {data.modelUsageStats.map((stat) => (
                <TableRow key={stat.modelId}>
                  <TableCell className="font-mono text-sm">
                    {stat.modelId}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(stat.totalCreditsSpent, locale, 2)}
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

      <SectionGroup title={t("errorsTab.title")}>
        {data.errorLogs.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("errorsTab.none")}</P>
        ) : (
          <Div className="flex flex-col divide-y divide-border">
            {data.errorLogs.map((e) => (
              <ListItem
                key={e.id}
                title={e.message}
                badges={
                  <StatusPill
                    status={e.resolved ? "resolved" : "open"}
                    label={
                      e.resolved ? t("errorsTab.resolved") : t("errorsTab.open")
                    }
                    variant={e.resolved ? "muted" : "danger"}
                  />
                }
                meta={
                  <>
                    <Span>{formatDateTime(e.lastSeenAt, locale)}</Span>
                    <Span>x{e.occurrences}</Span>
                    <Span>{e.level}</Span>
                  </>
                }
              />
            ))}
            <Div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => void onViewErrors()}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {t("errorsTab.openMonitor")}
              </Button>
            </Div>
          </Div>
        )}
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
  t: ViewT;
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
                    <Span>{formatDateTime(lead.linkedAt, locale)}</Span>
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
                    <Span>{formatDateTime(u.linkedAt, locale)}</Span>
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
  const logger = useWidgetLogger();
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
        logger={logger}
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
  const logger = useWidgetLogger();
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
        logger={logger}
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
  const logger = useWidgetLogger();
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
        logger={logger}
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
  const logger = useWidgetLogger();
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
        logger={logger}
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
  const logger = useWidgetLogger();
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
        logger={logger}
        endpoint={def}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={endpointOptions}
      />
    </Div>
  );
}

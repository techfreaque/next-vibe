/**
 * User View Widget
 * Admin detail for one account: money, credits, activity, attribution,
 * referrals, errors, and every admin action that exists for a user.
 * CLI/MCP get a compact text report.
 */

"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadTranslation } from "next-vibe/identity/lead/i18n";
import { UserPermissionRoleOptions } from "next-vibe/identity/roles/enum";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
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
import { Section } from "next-vibe/ui/components/section";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe/ui/components/tabs";
import { P } from "next-vibe/ui/components/typography";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import {
  AdminRecordDetail,
  type AdminRecordDetailState,
} from "next-vibe/unified-ui/_shared/admin-record-detail";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { Fragment, useCallback, useId, useMemo, useState } from "react";

import { CheckoutMode, PaymentProvider, PaymentStatus } from "@/payment/enum";
import { scopedTranslation as paymentTranslation } from "@/payment/i18n";
import { BillingInterval } from "@/subscription/enum";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import {
  formatDateTime,
  formatDay,
  formatMoney,
  formatNumber,
  formatReferralEarning,
  formatRelative,
  formatUsd,
  roleLabel,
  subscriptionStatusLabel,
  subscriptionStatusVariant,
} from "../format";
import type definition from "./definition";
import type { UserViewResponseOutput, UserViewTab } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type ViewT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

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

function activityKpi(
  date: Date | null,
  locale: CountryLanguage,
  t: ViewT,
): string {
  if (!date) {
    return t("widget.never");
  }
  return Math.abs(Date.now() - date.getTime()) < 60_000
    ? t("kpi.justNow")
    : formatRelative(date, locale);
}

/** Short label from an enum i18n value ("enums.paymentStatus.succeeded" -> "succeeded"). */
function enumTail(value: string): string {
  return value.split(".").pop() ?? value;
}

function billingIntervalLabel(
  value: string | null,
  locale: CountryLanguage,
): string {
  const interval =
    value === "monthly"
      ? BillingInterval.MONTHLY
      : value === "yearly"
        ? BillingInterval.YEARLY
        : value;
  return interval && isValidEnumValue(BillingInterval, interval)
    ? subscriptionTranslation.scopedT(locale).t(interval)
    : "-";
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
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { user, endpointMutations } = useWidgetContext();
  const { push: navigate, canGoBack } = useWidgetNavigation();
  const openRelated = useRelatedEntityNavigation();
  const endpoint = useWidgetEndpoint<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const response = useWidgetResponse();
  const logger = useWidgetLogger();
  const data = useWidgetValue<typeof definition.GET>();
  const children = field.children;

  const [activeTab, setActiveTab] = useState<UserViewTab>(
    () => form?.getValues("tab") ?? "overview",
  );
  const [copyIdSuccess, setCopyIdSuccess] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const mobileActionsId = useId();

  const userId = data?.basicInfo?.id;

  const handleAddCredits = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const adminAddDefs = await import("../../credits/admin-add/definition");
    navigate(adminAddDefs.default.POST, {
      data: { targetUserId: userId },
      renderInModal: true,
    });
  }, [navigate, userId]);

  const handleEdit = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const userDefs = await import("../user/[id]/definition");
    navigate(userDefs.default.PUT, {
      urlPathParams: { id: userId },
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

  const openDirectory = (): void => {
    openRelated(() => import("../list/definition").then((m) => m.default.GET));
  };

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
    const requestedId = form?.watch("userId");
    const validTarget = endpoint.requestSchema.safeParse({
      userId: requestedId,
    }).success;
    const status =
      response?.success === false ? response.errorType.errorCode : undefined;
    const unavailableMessage =
      status === 404
        ? t("errors.notFound.description")
        : status === 403
          ? t("errors.forbidden.description")
          : response?.success === false
            ? response.message
            : undefined;
    const retryable =
      validTarget && status !== undefined && canRetryRecordRead(status);
    const state: AdminRecordDetailState =
      validTarget &&
      response?.success !== false &&
      endpointMutations?.read?.isLoading !== false
        ? { kind: "loading", label: t("widget.loading") }
        : {
            kind: response?.success === false ? "error" : "empty",
            icon: <Users className="size-8" />,
            title: t(requestedId ? "widget.unavailable" : "widget.chooseUser"),
            message: unavailableMessage,
            action: retryable
              ? {
                  label: t("widget.actions.retry"),
                  onClick: () => void endpointMutations?.read?.refetch(),
                }
              : { label: t("widget.actions.browse"), onClick: openDirectory },
          };
    return (
      <AdminRecordDetail
        title={t("get.title")}
        backButton={
          retryable && interactive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openDirectory}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {t("widget.actions.browse")}
            </Button>
          ) : (
            <NavigateButtonWidget field={children.backButton} />
          )
        }
        state={state}
        feedback={
          response?.success === false ? undefined : (
            <FormAlertWidget field={{}} />
          )
        }
      />
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

  const tabs: { id: UserViewTab; label: string; count?: number }[] = [
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
      count: data.connectedLeadsTotal + data.connectedUsers.length,
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
  const selectSection = (value: string): void => {
    const section = tabs.find((tab) => tab.id === value);
    if (section) {
      setActiveTab(section.id);
    }
  };

  const moreActions = [
    {
      key: "edit",
      label: t("widget.actions.edit"),
      icon: Pencil,
      run: handleEdit,
    },
    {
      key: "copy",
      label: t("widget.actions.copyUserId"),
      icon: copyIdSuccess ? CheckCircle : Copy,
      run: handleCopyUserId,
    },
    {
      key: "ban",
      label: t(basicInfo.isBanned ? "ban.unbanUser" : "ban.banUser"),
      icon: basicInfo.isBanned ? CheckCircle : XCircle,
      run: (): Promise<void> => handleSetBanned(!basicInfo.isBanned),
    },
    {
      key: "delete",
      label: t("widget.actions.delete"),
      icon: Trash2,
      run: handleDelete,
    },
  ];

  const name = basicInfo.privateName || basicInfo.publicName || basicInfo.email;
  return (
    <AdminRecordDetail
      title={name}
      subtitle={basicInfo.email !== name ? basicInfo.email : undefined}
      status={
        basicInfo.isBanned
          ? { status: "banned", label: t("status.banned"), variant: "danger" }
          : basicInfo.isActive
            ? {
                status: "active",
                label: t("status.active"),
                variant: "success",
              }
            : {
                status: "inactive",
                label: t("status.inactive"),
                variant: "muted",
              }
      }
      titleAccessory={
        <>
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
        </>
      }
      backButton={
        canGoBack ? (
          <NavigateButtonWidget field={children.backButton} />
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={openDirectory}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("widget.actions.browse")}
          </Button>
        )
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 @lg:hidden"
            aria-expanded={mobileActionsOpen}
            aria-controls={mobileActionsId}
            onClick={() => setMobileActionsOpen((open) => !open)}
          >
            {t("widget.actions.more")}
          </Button>
          <Div className="hidden @lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  {t("widget.actions.more")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-48 data-[state=open]:animate-none"
              >
                {moreActions.map(({ key, label, icon: ActionIcon, run }) => (
                  <Fragment key={key}>
                    {key === "delete" && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      className={
                        key === "delete" ? "text-destructive" : undefined
                      }
                      onSelect={() => void run()}
                    >
                      <ActionIcon className="size-4" />
                      {label}
                    </DropdownMenuItem>
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Div>
          <Button
            type="button"
            size="sm"
            onClick={() => void handleAddCredits()}
            className="gap-1"
          >
            <Coins className="size-4" />
            {t("widget.actions.addCredits")}
          </Button>
        </>
      }
    >
      <Section
        id={mobileActionsId}
        aria-label={t("widget.actions.more")}
        className={
          mobileActionsOpen
            ? "flex flex-col rounded-lg border bg-card p-1 @lg:hidden"
            : "hidden"
        }
      >
        {mobileActionsOpen &&
          moreActions.map(({ key, label, icon: ActionIcon, run }) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              className={`h-auto min-h-11 justify-start gap-3 whitespace-normal px-3 text-left ${key === "delete" ? "text-destructive" : ""}`}
              onClick={() => {
                setMobileActionsOpen(false);
                void run();
              }}
            >
              <ActionIcon className="size-4 shrink-0" />
              {label}
            </Button>
          ))}
      </Section>

      <Div className="flex min-w-0 items-center gap-3">
        <Div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase()}
        </Div>
        <Div className="flex min-w-0 flex-1 flex-col gap-1">
          {basicInfo.publicName && basicInfo.publicName !== name && (
            <Span className="truncate text-sm text-muted-foreground">
              {basicInfo.publicName}
            </Span>
          )}
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
                      aria-label={t("roles.removeNamed", {
                        role: roleLabel(roleItem.role, locale),
                      })}
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
          variant="muted"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.credits")}
          value={t("widget.creditAmount", {
            count: formatNumber(creditInfo.currentBalance, locale, 2),
          })}
          description={t("kpi.creditsHint", {
            free: formatNumber(creditInfo.freeCreditsRemaining, locale),
          })}
          variant="info"
          icon={<Coins className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.spent")}
          value={t("widget.creditAmount", {
            count: formatNumber(creditInfo.totalCreditsSpent, locale, 2),
          })}
          icon={<Zap className="h-4 w-4" />}
        />
        <MetricCard
          label={t("kpi.lastSeen")}
          value={activityKpi(seen, locale, t)}
          className="[&>div:nth-child(2)>span]:text-lg @md:[&>div:nth-child(2)>span]:text-2xl"
          description={t("kpi.joined", {
            date: formatDay(basicInfo.createdAt, locale),
          })}
          icon={<User className="h-4 w-4" />}
        />
      </MetricGrid>

      <Tabs value={activeTab} onValueChange={selectSection}>
        <Div className="flex min-w-0 flex-col gap-1 @lg:hidden">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("tabs.section")}
          </Span>
          <Select value={activeTab} onValueChange={selectSection}>
            <SelectTrigger aria-label={t("tabs.section")} className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem value={tab.id} key={tab.id}>
                  {tab.label}
                  {tab.count ? ` (${formatNumber(tab.count, locale)})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
        <Div className="hidden max-w-full min-w-0 overflow-x-auto border-b [scrollbar-width:thin] @lg:block">
          <TabsList
            aria-label={t("get.title")}
            className="h-auto w-max min-w-full justify-start gap-1 rounded-none border-0 bg-transparent p-0"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="min-h-11 shrink-0 snap-start gap-1.5 rounded-b-none border-b-2 border-transparent px-3 text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-none @lg:min-h-9"
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Span className="rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">
                    {tab.count}
                  </Span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Div>
        <TabsContent value={activeTab} className="mt-4 min-w-0">
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
                <ReferralSummary data={data} t={t} locale={locale} />
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
              connectedLeadsTotal={data.connectedLeadsTotal}
              connectedUsers={data.connectedUsers}
              t={t}
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
        </TabsContent>
      </Tabs>
    </AdminRecordDetail>
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
              value={billingIntervalLabel(
                paymentStats.subscriptionInterval,
                locale,
              )}
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
        <MetricGrid columns={2} className="@xl:grid-cols-4">
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
  const { basicInfo, paymentStats, payments, subscriptions } = data;
  const openRelated = useRelatedEntityNavigation();
  const isInteractive = useWidgetIsInteractive();
  const { t: tPayment } = paymentTranslation.scopedT(locale);
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

      <SectionGroup
        title={t("billing.paymentsTitle")}
        subtitle={
          basicInfo.privateName || basicInfo.publicName || basicInfo.email
        }
      >
        {payments.length === 0 ? (
          <Div className="flex min-w-0 items-center gap-3 rounded-md bg-muted/35 px-3 py-4 text-sm text-foreground">
            <DollarSign
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <Span>{t("billing.noPayments")}</Span>
          </Div>
        ) : (
          <Div className="flex flex-col gap-2">
            {payments.map((payment) => {
              const amount = formatMoney(
                payment.amount,
                payment.currency,
                locale,
              );
              const date = formatDateTime(payment.createdAt, locale);
              return (
                <ListItem
                  key={payment.id}
                  title={amount}
                  subtitle={date}
                  badges={
                    <StatusPill
                      status={payment.status}
                      label={
                        isValidEnumValue(PaymentStatus, payment.status)
                          ? tPayment(payment.status)
                          : payment.status
                      }
                      variant={paymentStatusVariant(payment.status)}
                    />
                  }
                  meta={
                    <>
                      <Span>
                        {isValidEnumValue(PaymentProvider, payment.provider)
                          ? tPayment(payment.provider)
                          : payment.provider}
                      </Span>
                      <Span>
                        {isValidEnumValue(CheckoutMode, payment.mode)
                          ? tPayment(payment.mode)
                          : payment.mode}
                      </Span>
                      {payment.currency.toUpperCase() !== "USD" && (
                        <Span>{formatUsd(payment.amountUsd, locale)}</Span>
                      )}
                      {isInteractive && (
                        <Div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-auto min-h-9 whitespace-normal"
                            aria-label={t("billing.inspectNamed", {
                              amount,
                              date,
                            })}
                            onClick={() =>
                              openRelated(
                                () =>
                                  import("@/payment/processor/definition").then(
                                    (m) => m.default.GET,
                                  ),
                                {
                                  data: {
                                    userId: basicInfo.id,
                                    transactionId: payment.id,
                                  },
                                },
                              )
                            }
                          >
                            {t("billing.inspect")}
                          </Button>
                          {payment.refundEligible && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-auto min-h-9 whitespace-normal"
                              aria-label={t("billing.refundNamed", {
                                amount,
                                date,
                              })}
                              onClick={() =>
                                openRelated(
                                  () =>
                                    import("@/payment/refund/definition").then(
                                      (m) => m.default.POST,
                                    ),
                                  {
                                    data: { transactionId: payment.id },
                                    renderInModal: true,
                                    popNavigationOnSuccess: 1,
                                  },
                                )
                              }
                            >
                              {t("billing.refund")}
                            </Button>
                          )}
                        </Div>
                      )}
                    </>
                  }
                />
              );
            })}
          </Div>
        )}
      </SectionGroup>

      <SectionGroup title={t("billing.subscriptionsTitle")}>
        {subscriptions.length === 0 ? (
          <EmptyBlock title={t("payment.none")} className="py-3" />
        ) : (
          <Div className="flex flex-col gap-2">
            {isInteractive && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start h-auto min-h-9 whitespace-normal"
                onClick={() =>
                  openRelated(
                    () =>
                      import("@/subscription/admin/list/definition").then(
                        (m) => m.default.GET,
                      ),
                    {
                      data: { userId: basicInfo.id },
                    },
                  )
                }
              >
                {t("billing.openSubscriptions")}
              </Button>
            )}
            {subscriptions.map((subscription) => {
              const provider = isValidEnumValue(
                PaymentProvider,
                subscription.provider,
              )
                ? tPayment(subscription.provider)
                : subscription.provider;
              const interval = billingIntervalLabel(
                subscription.billingInterval,
                locale,
              );
              return (
                <ListItem
                  key={subscription.id}
                  title={provider}
                  subtitle={interval}
                  badges={
                    <StatusPill
                      status={subscription.status}
                      label={subscriptionStatusLabel(
                        subscription.status,
                        locale,
                      )}
                      variant={subscriptionStatusVariant(subscription.status)}
                    />
                  }
                  meta={
                    <>
                      <Span>
                        {t("billing.startedOn", {
                          date: formatDay(subscription.createdAt, locale),
                        })}
                      </Span>
                      {subscription.currentPeriodEnd && (
                        <Span>
                          {t("billing.periodEndsOn", {
                            date: formatDay(
                              subscription.currentPeriodEnd,
                              locale,
                            ),
                          })}
                        </Span>
                      )}
                      {subscription.cancelAtPeriodEnd && (
                        <Span className="text-warning">
                          {t("billing.cancels")}
                        </Span>
                      )}
                    </>
                  }
                />
              );
            })}
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
}: {
  data: UserViewResponseOutput;
  t: ViewT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const { referralStats, referredBy, referredUsers } = data;
  const openRelated = useRelatedEntityNavigation();
  const openAccount = (userId: string): void =>
    openRelated(() => import("./definition").then((m) => m.GET), {
      data: { userId },
    });

  return (
    <Div className="flex flex-col gap-4">
      <RelatedEntitiesPanel
        title={t("referrals.referredBy")}
        emptyTitle={t("referrals.noReferrer")}
        items={
          referredBy
            ? [
                {
                  id: referredBy.userId,
                  title: referredBy.email,
                  subtitle: referredBy.code
                    ? t("referrals.viaCode", { code: referredBy.code })
                    : undefined,
                  meta: formatDay(referredBy.referredAt, locale),
                  action: {
                    label: t("connections.viewUser"),
                    ariaLabel: t("connections.viewNamedUser", {
                      name: referredBy.email,
                    }),
                    onClick: () => openAccount(referredBy.userId),
                  },
                },
              ]
            : []
        }
      />

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
                    formatReferralEarning(e.amountCents, e.currency, locale),
                  )
                  .join(" · ")
          }
          variant="info"
        />
      </MetricGrid>

      <RelatedEntitiesPanel
        title={t("referrals.referredUsers")}
        emptyTitle={t("referrals.noneReferred")}
        items={referredUsers.map((account) => {
          const meta = (
            <>
              <Span>{formatDay(account.createdAt, locale)}</Span>
              {account.totalPaidUsd > 0 && (
                <Span className="text-success">
                  {formatUsd(account.totalPaidUsd, locale)}
                </Span>
              )}
            </>
          );
          return {
            id: account.id,
            title: account.email,
            meta,
            action: {
              label: t("connections.viewUser"),
              ariaLabel: t("connections.viewNamedUser", {
                name: account.email,
              }),
              onClick: () => openAccount(account.id),
            },
          };
        })}
      />
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
  connectedLeadsTotal,
  connectedUsers,
  t,
  locale,
}: {
  connectedLeads: UserViewResponseOutput["connectedLeads"];
  connectedLeadsTotal: number;
  connectedUsers: UserViewResponseOutput["connectedUsers"];
  t: ViewT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const openRelated = useRelatedEntityNavigation();
  const { t: tLead } = leadTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-4">
      <RelatedEntitiesPanel
        title={t("connections.leadsTitle")}
        subtitle={
          connectedLeadsTotal > connectedLeads.length
            ? t("connections.leadsCapped", {
                shown: connectedLeads.length,
                total: connectedLeadsTotal,
              })
            : undefined
        }
        emptyTitle={t("connections.noLeads")}
        items={connectedLeads.map((lead) => {
          const title = lead.email || lead.businessName || lead.id;
          const device = [lead.deviceType, lead.browser, lead.os]
            .filter(Boolean)
            .join(" · ");
          const badges = (
            <StatusPill
              status={lead.status}
              label={
                isValidEnumValue(LeadStatus, lead.status)
                  ? tLead(lead.status)
                  : lead.status
              }
              variant="default"
            />
          );
          const meta = (
            <>
              {lead.ipAddress && (
                <Span className="font-mono">{lead.ipAddress}</Span>
              )}
              {device && <Span>{device}</Span>}
              {lead.linkReason && <Span>{lead.linkReason}</Span>}
              <Span>{formatDateTime(lead.linkedAt, locale)}</Span>
            </>
          );
          return {
            id: lead.id,
            title,
            subtitle: lead.email ? lead.businessName : undefined,
            badges,
            meta,
            action: {
              label: t("connections.viewLead"),
              ariaLabel: t("connections.viewNamedLead", { name: title }),
              onClick: () =>
                openRelated(
                  () =>
                    import("@/leads/[id]/definition").then(
                      (m) => m.default.GET,
                    ),
                  {
                    urlPathParams: { id: lead.id },
                  },
                ),
            },
          };
        })}
      />

      <RelatedEntitiesPanel
        title={t("connections.usersTitle")}
        emptyTitle={t("connections.noUsers")}
        items={connectedUsers.map((account) => {
          const meta = (
            <>
              {account.linkReason && <Span>{account.linkReason}</Span>}
              <Span>{formatDateTime(account.linkedAt, locale)}</Span>
            </>
          );
          return {
            id: account.id,
            title: account.email,
            subtitle: account.publicName ? `@${account.publicName}` : undefined,
            meta,
            action: {
              label: t("connections.viewUser"),
              ariaLabel: t("connections.viewNamedUser", {
                name: account.email,
              }),
              onClick: () =>
                openRelated(() => import("./definition").then((m) => m.GET), {
                  data: { userId: account.id },
                }),
            },
          };
        })}
      />
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

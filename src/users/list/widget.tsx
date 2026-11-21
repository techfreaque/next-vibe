/**
 * Users List Widget
 * Admin user directory. Web: KPI strip, search, quick filters, sortable table.
 * CLI/MCP: one line per user plus a pagination hint.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { KpiGrid, KpiTile } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { ArrowUp } from "next-vibe/ui/components/icons/ArrowUp";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Filter } from "next-vibe/ui/components/icons/Filter";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Users } from "next-vibe/ui/components/icons/Users";
import { X } from "next-vibe/ui/components/icons/X";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
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
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import {
  getCurrentPathname,
  getCurrentSearch,
} from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type React from "react";
import { useCallback, useId, useState } from "react";

import {
  cell,
  formatDay,
  formatNumber,
  formatRelative,
  formatUsd,
  roleLabel,
  subscriptionPlanLabel,
  subscriptionStatusLabel,
  subscriptionStatusVariant,
} from "../format";
import { FREE_BURN_MIN_CREDITS, USERS_LIST_ALIAS } from "./constants";
import type definition from "./definition";
import type { UserListResponseOutput, UserListRow } from "./definition";
import {
  AccountStateFilter,
  LastActiveFilter,
  ListSortOrder,
  PayerFilter,
  UserListSortField,
  UsersAudience,
} from "./enum";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type ListT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
type SortFieldValue =
  (typeof UserListSortField)[keyof typeof UserListSortField];
type PayerValue = (typeof PayerFilter)[keyof typeof PayerFilter];
type LastActiveValue = (typeof LastActiveFilter)[keyof typeof LastActiveFilter];

const ADMIN_ROLE = "enums.userRole.admin";

/** One line of attribution: channel / campaign, plus the ref code once. */
function sourceText(user: UserListRow, t: ListT): string {
  const code = user.referralCode ?? user.firstRefCode;
  if (!user.source && code) {
    return t("widget.refCode", { code });
  }
  const source =
    user.source ??
    (user.referredByEmail
      ? t("widget.referredBy", { email: user.referredByEmail })
      : "");
  if (code && !source.toLowerCase().includes(code.toLowerCase())) {
    return [source, t("widget.refCode", { code })].filter(Boolean).join(" · ");
  }
  return source;
}

/** Shorten from the middle so the email domain stays visible. */
function middleTruncate(value: string, width: number): string {
  if (value.length <= width) {
    return value;
  }
  const keep = width - 1;
  const head = Math.ceil(keep / 2);
  return `${value.slice(0, head)}~${value.slice(value.length - (keep - head))}`;
}

/** Never paid but spent at least the free-burn threshold. */
function isFreeBurner(user: UserListRow): boolean {
  return (
    !user.roles.includes(ADMIN_ROLE) &&
    user.totalPaidUsd === 0 &&
    user.creditsSpent >= FREE_BURN_MIN_CREDITS
  );
}

function displayName(user: UserListRow): string {
  return user.privateName || user.publicName || user.email;
}

// ─── CLI / MCP text output ──────────────────────────────────────────────────

function renderText(
  data: UserListResponseOutput,
  t: ListT,
  locale: CountryLanguage,
): string {
  const { summary, users } = data;
  const lines: string[] = [];
  lines.push(
    t("widget.text.header", {
      total: summary.totalCount,
      paying: summary.payingCount,
      paid: formatUsd(summary.totalPaidUsd, locale),
    }),
  );
  lines.push(
    t("widget.text.subheader", {
      verified: summary.verifiedCount,
      active: summary.activeMonthCount,
      banned: summary.bannedCount,
      weekly: summary.signupsByWeek.join(" "),
    }),
  );
  if (users.length === 0) {
    lines.push(t("widget.empty.filtered"));
    return lines.join("\n");
  }
  lines.push("");
  lines.push(
    [
      cell(t("widget.columns.user"), 44),
      cell(t("widget.columns.flags"), 28),
      cell(t("widget.columns.joined"), 12),
      cell(t("widget.columns.lastActive"), 14),
      cell(t("widget.columns.credits"), 9),
      cell(t("widget.columns.spent"), 20),
      cell(t("widget.columns.paid"), 9),
      cell(t("widget.columns.subscription"), 10),
      cell(t("widget.columns.source"), 22),
      t("widget.columns.id"),
    ].join(" "),
  );
  for (const user of users) {
    const flags = [
      user.roles.includes(ADMIN_ROLE) ? t("widget.flags.admin") : "",
      user.isBanned ? t("widget.flags.banned") : "",
      user.emailVerified ? "" : t("widget.flags.unverified"),
      isFreeBurner(user) ? t("widget.flags.freeBurn") : "",
    ]
      .filter(Boolean)
      .join(",");
    lines.push(
      [
        cell(middleTruncate(user.email, 44), 44),
        cell(flags || "-", 28),
        cell(formatDay(user.createdAt, locale), 12),
        cell(
          user.lastActiveAt
            ? formatRelative(user.lastActiveAt, locale)
            : t("widget.never"),
          14,
        ),
        cell(formatNumber(user.creditBalance, locale), 9),
        cell(
          `${formatNumber(user.creditsSpent, locale)} (${formatNumber(user.creditsSpent30d, locale)} 30d)`,
          20,
        ),
        cell(
          user.totalPaidUsd > 0 ? formatUsd(user.totalPaidUsd, locale) : "-",
          9,
        ),
        cell(
          user.plan
            ? subscriptionPlanLabel(user.plan, locale)
            : user.subscriptionStatus
              ? subscriptionStatusLabel(user.subscriptionStatus, locale)
              : "-",
          10,
        ),
        cell(sourceText(user, t) || t("widget.notTracked"), 22),
        user.id,
      ].join(" "),
    );
  }
  if (summary.pageCount > 1) {
    lines.push("");
    lines.push(
      t("widget.text.pageHint", {
        page: summary.page,
        pages: summary.pageCount,
        next: Math.min(summary.page + 1, summary.pageCount),
      }),
    );
  }
  lines.push(t("widget.text.detailHint"));
  return lines.join("\n");
}

// ─── Web pieces ─────────────────────────────────────────────────────────────

function SortHeader({
  label,
  field,
  activeField,
  order,
  onSort,
  className,
}: {
  label: string;
  field: SortFieldValue;
  activeField: SortFieldValue;
  order: (typeof ListSortOrder)[keyof typeof ListSortOrder];
  onSort: (field: SortFieldValue) => void;
  className?: string;
}): React.JSX.Element {
  const active = field === activeField;
  return (
    <TableHead
      className={className}
      aria-sort={
        active
          ? order === ListSortOrder.ASC
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onSort(field)}
        className={cn(
          "h-7 px-1 -ml-1 gap-1 text-xs font-medium",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        {active &&
          (order === ListSortOrder.ASC ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </Button>
    </TableHead>
  );
}

function UserCell({
  user,
  t,
  locale,
}: {
  user: UserListRow;
  t: ListT;
  locale: CountryLanguage;
}): React.JSX.Element {
  return (
    <Div className="flex items-start gap-3 min-w-0">
      <Div className="min-w-0">
        <Div className="flex items-center gap-1.5 flex-wrap">
          <Span className="font-medium text-sm break-all @3xl:truncate @3xl:max-w-[220px]">
            {displayName(user)}
          </Span>
          {user.roles
            .filter((role) => role !== "enums.userRole.customer")
            .map((role) => (
              <StatusPill
                key={role}
                status={role}
                label={roleLabel(role, locale)}
                variant="info"
              />
            ))}
          {user.isBanned && (
            <StatusPill
              status="banned"
              label={t("widget.flags.banned")}
              variant="danger"
            />
          )}
          {isFreeBurner(user) && (
            <StatusPill
              status="free-burn"
              label={t("widget.flags.freeBurn")}
              variant="warning"
            />
          )}
          {!user.emailVerified && (
            <StatusPill
              status="unverified"
              label={t("widget.flags.unverified")}
              variant="warning"
            />
          )}
        </Div>
        <Span className="block text-xs text-muted-foreground break-all @3xl:truncate @3xl:max-w-[320px]">
          {user.email}
        </Span>
      </Div>
    </Div>
  );
}

function QuickChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-7 px-2.5 rounded-full text-xs font-medium border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
      )}
    >
      {label}
    </Button>
  );
}

/** Active filter shown as a removable chip (drill-downs land with these set). */
function ActiveFilterChip({
  label,
  value,
  removeLabel,
  onRemove,
}: {
  label: string;
  value: string;
  removeLabel: string;
  onRemove: () => void;
}): React.JSX.Element {
  return (
    <Span className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/30 bg-primary/5 py-0.5 pe-1 ps-2.5 text-xs">
      <Span className="text-muted-foreground">{label}</Span>
      <Span className="truncate font-medium text-foreground">{value}</Span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label={removeLabel}
        className="h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </Button>
    </Span>
  );
}

/**
 * Optional numeric bound. Empty means "no bound": a stepper would force 0 and
 * silently filter out every user with credits.
 */
function CreditBoundInput({
  label,
  placeholder,
  value,
  onCommit,
}: {
  label: string;
  placeholder: string;
  value: number | undefined;
  onCommit: (next: number | undefined) => void;
}): React.JSX.Element {
  const [text, setText] = useState(value === undefined ? "" : String(value));
  const commit = (): void => {
    const trimmed = text.trim();
    const parsed = Number(trimmed);
    const next =
      trimmed === "" || !Number.isFinite(parsed) || parsed < 0
        ? undefined
        : parsed;
    if (next !== value) {
      onCommit(next);
    }
  };
  return (
    <Div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        type="text"
        keyboardType="numeric"
        value={text}
        placeholder={placeholder}
        onChangeText={setText}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
          }
        }}
      />
    </Div>
  );
}

// ─── Container ──────────────────────────────────────────────────────────────

export function UsersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const searchId = useId();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { push: navigate } = useWidgetNavigation();
  const history = useSilentHistory();
  const openRelated = useRelatedEntityNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const onPick = usePickerCallback<UserListRow>();
  const isPickerMode = !!onPick;
  const data = useWidgetValue<typeof definition.GET>();
  const [showFilters, setShowFilters] = useState(false);

  const sortBy: SortFieldValue =
    form.watch("sortBy") ?? UserListSortField.CREATED_AT;
  const sortOrder = form.watch("sortOrder") ?? ListSortOrder.DESC;
  const payer = form.watch("payer");
  const lastActive = form.watch("lastActive");

  const submit = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const resetPageAndSubmit = useCallback((): void => {
    form.setValue("page", 1, { shouldDirty: true });
    submit();
  }, [form, submit]);

  const handleSort = useCallback(
    (fieldName: SortFieldValue): void => {
      if (fieldName === sortBy) {
        form.setValue(
          "sortOrder",
          sortOrder === ListSortOrder.DESC
            ? ListSortOrder.ASC
            : ListSortOrder.DESC,
          { shouldDirty: true },
        );
      } else {
        form.setValue("sortBy", fieldName, { shouldDirty: true });
        form.setValue("sortOrder", ListSortOrder.DESC, { shouldDirty: true });
      }
      resetPageAndSubmit();
    },
    [form, sortBy, sortOrder, resetPageAndSubmit],
  );

  const togglePayer = useCallback(
    (value: PayerValue): void => {
      form.setValue("payer", payer === value ? undefined : value, {
        shouldDirty: true,
      });
      resetPageAndSubmit();
    },
    [form, payer, resetPageAndSubmit],
  );

  const toggleLastActive = useCallback(
    (value: LastActiveValue): void => {
      form.setValue("lastActive", lastActive === value ? undefined : value, {
        shouldDirty: true,
      });
      resetPageAndSubmit();
    },
    [form, lastActive, resetPageAndSubmit],
  );

  const handleClearFilters = useCallback((): void => {
    form.setValue("search", "", { shouldDirty: true });
    form.setValue("roles", [], { shouldDirty: true });
    form.setValue("accountState", [], { shouldDirty: true });
    form.setValue("payer", undefined, { shouldDirty: true });
    form.setValue("subscription", undefined, { shouldDirty: true });
    form.setValue("lastActive", undefined, { shouldDirty: true });
    form.setValue("signupFrom", undefined, { shouldDirty: true });
    form.setValue("signupTo", undefined, { shouldDirty: true });
    form.setValue("creditsMin", undefined, { shouldDirty: true });
    form.setValue("creditsMax", undefined, { shouldDirty: true });
    form.setValue("source", "", { shouldDirty: true });
    form.setValue("referralActivity", undefined, { shouldDirty: true });
    form.setValue("audience", undefined, { shouldDirty: true });
    form.setValue("channel", "", { shouldDirty: true });
    form.setValue("channelType", undefined, { shouldDirty: true });
    form.setValue("refCode", "", { shouldDirty: true });
    form.setValue("plan", undefined, { shouldDirty: true });
    form.setValue("activeFrom", undefined, { shouldDirty: true });
    form.setValue("activeTo", undefined, { shouldDirty: true });
    form.setValue("spentMin", undefined, { shouldDirty: true });
    form.setValue("paidFrom", undefined, { shouldDirty: true });
    form.setValue("paidTo", undefined, { shouldDirty: true });
    resetPageAndSubmit();
  }, [form, resetPageAndSubmit]);

  const handlePageChange = useCallback(
    (page: number): void => {
      form.setValue("page", page, { shouldDirty: true });
      submit();
    },
    [form, submit],
  );

  const handleRowClick = (user: UserListRow): void => {
    if (onPick) {
      onPick(user);
      return;
    }
    const pathname = getCurrentPathname();
    if (pathname.endsWith(`/tools/${USERS_LIST_ALIAS}`)) {
      // Browser Back reconstructs this entry from its URL.
      const params = new URLSearchParams(getCurrentSearch());
      params.delete("search");
      params.delete("page");
      params.set("arg.search", form.getValues("search") ?? "");
      params.set("arg.page", String(form.getValues("page") ?? 1));
      history.replaceState(`${pathname}?${params.toString()}`);
    }
    openRelated(() => import("../view/definition").then((m) => m.GET), {
      data: { userId: user.id },
    });
  };

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef = await import("../create/definition");
      navigate(createDef.default.POST);
    })();
  }, [navigate]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewStats = useCallback((): void => {
    openRelated(
      () => import("../stats/definition").then((m) => m.default.GET),
      {
        data: {
          audience: form.getValues("audience"),
          channel: form.getValues("channel") || undefined,
          channelType: form.getValues("channelType"),
          refCode: form.getValues("refCode") || undefined,
          payer: form.getValues("payer"),
          plan: form.getValues("plan"),
          accountState: form.getValues("accountState"),
        },
      },
    );
  }, [openRelated, form]);

  const audience = form.watch("audience");
  const watchedAccountState = form.watch("accountState");
  const accountState = watchedAccountState ?? [];
  const toggleHumans = useCallback((): void => {
    form.setValue(
      "audience",
      audience === UsersAudience.HUMANS ? undefined : UsersAudience.HUMANS,
      { shouldDirty: true },
    );
    resetPageAndSubmit();
  }, [form, audience, resetPageAndSubmit]);
  const toggleBanned = useCallback((): void => {
    const only =
      watchedAccountState?.length === 1 &&
      watchedAccountState[0] === AccountStateFilter.BANNED;
    form.setValue("accountState", only ? [] : [AccountStateFilter.BANNED], {
      shouldDirty: true,
    });
    resetPageAndSubmit();
  }, [form, watchedAccountState, resetPageAndSubmit]);
  const toggleFreeBurn = useCallback((): void => {
    const on =
      form.getValues("payer") === PayerFilter.FREE &&
      Number(form.getValues("spentMin")) === FREE_BURN_MIN_CREDITS;
    form.setValue("payer", on ? undefined : PayerFilter.FREE, {
      shouldDirty: true,
    });
    form.setValue("spentMin", on ? undefined : FREE_BURN_MIN_CREDITS, {
      shouldDirty: true,
    });
    form.setValue("audience", on ? undefined : UsersAudience.HUMANS, {
      shouldDirty: true,
    });
    if (!on) {
      form.setValue("sortBy", UserListSortField.CREDITS_SPENT, {
        shouldDirty: true,
      });
      form.setValue("sortOrder", ListSortOrder.DESC, { shouldDirty: true });
    }
    resetPageAndSubmit();
  }, [form, resetPageAndSubmit]);
  const toggleVerified = useCallback((): void => {
    const only =
      watchedAccountState?.length === 1 &&
      watchedAccountState[0] === AccountStateFilter.VERIFIED;
    form.setValue("accountState", only ? [] : [AccountStateFilter.VERIFIED], {
      shouldDirty: true,
    });
    resetPageAndSubmit();
  }, [form, watchedAccountState, resetPageAndSubmit]);

  // CLI / MCP: plain text table
  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return data ? <Pre>{renderText(data, t, locale)}</Pre> : <Pre>{""}</Pre>;
  }

  const users = data?.users ?? [];
  const summary = data?.summary;
  const currentPage = summary?.page ?? 1;
  const totalPages = summary?.pageCount ?? 1;
  const totalCount = summary?.totalCount ?? 0;
  const rangeStart =
    totalCount === 0 ? 0 : (currentPage - 1) * (summary?.limit ?? 0) + 1;
  const rangeEnd = Math.min(currentPage * (summary?.limit ?? 0), totalCount);

  const search = form.watch("search") ?? "";
  const chips: Array<{
    key: string;
    label: string;
    value: string;
    clear: () => void;
  }> = [];
  const clearAnd = (apply: () => void) => (): void => {
    apply();
    resetPageAndSubmit();
  };
  if (audience) {
    chips.push({
      key: "audience",
      label: t("get.fields.audience.label"),
      value: t(audience),
      clear: clearAnd(() =>
        form.setValue("audience", undefined, { shouldDirty: true }),
      ),
    });
  }
  if (payer && payer !== PayerFilter.ANY) {
    chips.push({
      key: "payer",
      label: t("get.fields.payer.label"),
      value: t(payer),
      clear: clearAnd(() =>
        form.setValue("payer", undefined, { shouldDirty: true }),
      ),
    });
  }
  if (lastActive && lastActive !== LastActiveFilter.ANY) {
    chips.push({
      key: "lastActive",
      label: t("get.fields.lastActive.label"),
      value: t(lastActive),
      clear: clearAnd(() =>
        form.setValue("lastActive", undefined, { shouldDirty: true }),
      ),
    });
  }
  const channel = form.watch("channel");
  if (channel) {
    chips.push({
      key: "channel",
      label: t("get.fields.channel.label"),
      value: channel,
      clear: clearAnd(() =>
        form.setValue("channel", "", { shouldDirty: true }),
      ),
    });
  }
  const channelType = form.watch("channelType");
  if (channelType) {
    chips.push({
      key: "channelType",
      label: t("get.fields.channelType.label"),
      value: t(channelType),
      clear: clearAnd(() =>
        form.setValue("channelType", undefined, { shouldDirty: true }),
      ),
    });
  }
  const refCode = form.watch("refCode");
  if (refCode) {
    chips.push({
      key: "refCode",
      label: t("get.fields.refCode.label"),
      value: refCode,
      clear: clearAnd(() =>
        form.setValue("refCode", "", { shouldDirty: true }),
      ),
    });
  }
  const plan = form.watch("plan");
  if (plan) {
    chips.push({
      key: "plan",
      label: t("get.fields.plan.label"),
      value: t(plan),
      clear: clearAnd(() =>
        form.setValue("plan", undefined, { shouldDirty: true }),
      ),
    });
  }
  const signupFrom = form.watch("signupFrom");
  const signupTo = form.watch("signupTo");
  if (signupFrom || signupTo) {
    chips.push({
      key: "signup",
      label: t("widget.chips.signedUp"),
      value: `${signupFrom ? formatDay(signupFrom, locale, true) : "…"} → ${signupTo ? formatDay(signupTo, locale, true) : "…"}`,
      clear: clearAnd(() => {
        form.setValue("signupFrom", undefined, { shouldDirty: true });
        form.setValue("signupTo", undefined, { shouldDirty: true });
      }),
    });
  }
  const activeFrom = form.watch("activeFrom");
  const activeTo = form.watch("activeTo");
  if (activeFrom || activeTo) {
    chips.push({
      key: "active",
      label: t("widget.chips.spentCredits"),
      value: `${activeFrom ? formatDay(activeFrom, locale, true) : "…"} → ${activeTo ? formatDay(activeTo, locale, true) : "…"}`,
      clear: clearAnd(() => {
        form.setValue("activeFrom", undefined, { shouldDirty: true });
        form.setValue("activeTo", undefined, { shouldDirty: true });
      }),
    });
  }
  const paidFrom = form.watch("paidFrom");
  const paidTo = form.watch("paidTo");
  if (paidFrom || paidTo) {
    chips.push({
      key: "paid",
      label: t("widget.chips.paid"),
      value: `${paidFrom ? formatDay(paidFrom, locale, true) : "…"} → ${paidTo ? formatDay(paidTo, locale, true) : "…"}`,
      clear: clearAnd(() => {
        form.setValue("paidFrom", undefined, { shouldDirty: true });
        form.setValue("paidTo", undefined, { shouldDirty: true });
      }),
    });
  }
  const spentMin = form.watch("spentMin");
  if (spentMin !== undefined) {
    chips.push({
      key: "spentMin",
      label: t("get.fields.spentMin.label"),
      value: formatNumber(spentMin, locale),
      clear: clearAnd(() =>
        form.setValue("spentMin", undefined, { shouldDirty: true }),
      ),
    });
  }
  const subscription = form.watch("subscription");
  if (subscription) {
    chips.push({
      key: "subscription",
      label: t("get.fields.subscription.label"),
      value: t(subscription),
      clear: clearAnd(() =>
        form.setValue("subscription", undefined, { shouldDirty: true }),
      ),
    });
  }
  if (accountState.length > 0) {
    chips.push({
      key: "accountState",
      label: t("get.fields.accountState.label"),
      value: accountState.map((state) => t(state)).join(", "),
      clear: clearAnd(() =>
        form.setValue("accountState", [], { shouldDirty: true }),
      ),
    });
  }
  const source = form.watch("source");
  if (source) {
    chips.push({
      key: "source",
      label: t("get.fields.source.label"),
      value: source,
      clear: clearAnd(() => form.setValue("source", "", { shouldDirty: true })),
    });
  }
  const referralActivity = form.watch("referralActivity");
  if (referralActivity) {
    chips.push({
      key: "referralActivity",
      label: t("get.fields.referralActivity.label"),
      value: t(referralActivity),
      clear: clearAnd(() =>
        form.setValue("referralActivity", undefined, { shouldDirty: true }),
      ),
    });
  }
  const hasActiveFilters = Boolean(
    search ||
    (form.watch("roles") ?? []).length > 0 ||
    (form.watch("accountState") ?? []).length > 0 ||
    payer ||
    form.watch("subscription") ||
    lastActive ||
    form.watch("signupFrom") ||
    form.watch("signupTo") ||
    form.watch("creditsMin") !== undefined ||
    form.watch("creditsMax") !== undefined ||
    chips.length > 0 ||
    audience,
  );

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={
          summary
            ? t("widget.titleWithCount", {
                count: formatNumber(totalCount, locale),
              })
            : t("get.title")
        }
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          !isPickerMode ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleViewStats}
                aria-label={t("widget.actions.stats")}
                className="gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                <Span className="hidden sm:inline text-xs">
                  {t("widget.actions.stats")}
                </Span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                title={t("widget.actions.refresh")}
                aria-label={t("widget.actions.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCreate}
                className="gap-1"
              >
                <UserPlus className="h-4 w-4" />
                {t("widget.actions.newUser")}
              </Button>
            </>
          ) : undefined
        }
      />

      <Div className="flex flex-col gap-2">
        <Label htmlFor={searchId}>{t("get.fields.search.label")}</Label>
        <Input
          id={searchId}
          type="text"
          value={search}
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          maxLength={200}
          aria-label={t("get.fields.search.label")}
          placeholder={t("get.fields.search.placeholder")}
          onChangeText={(value) => {
            form.setValue("page", 1, { shouldDirty: true });
            form.setValue("search", value, { shouldDirty: true });
          }}
        />
      </Div>

      {/* KPI strip for the current filter */}
      {!isPickerMode && summary && (
        <KpiGrid columns={5}>
          <KpiTile
            label={t("widget.kpi.matching")}
            value={summary.totalCount}
            locale={locale}
            hint={t("widget.kpi.matchingHint", {
              count: formatNumber(summary.signupsThisWeek, locale),
              last: formatNumber(summary.signupsByWeek.at(-1) ?? 0, locale),
            })}
            sparkline={summary.signupsByWeek}
            onClick={handleViewStats}
          />
          <KpiTile
            label={t("widget.kpi.paying")}
            value={summary.payingCount}
            locale={locale}
            tone="positive"
            hint={
              summary.totalCount > 0
                ? t("widget.kpi.payingShare", {
                    percent: Math.round(
                      (summary.payingCount / summary.totalCount) * 100,
                    ),
                  })
                : undefined
            }
            onClick={() => togglePayer(PayerFilter.PAID)}
          />
          <KpiTile
            className="hidden @md:flex"
            label={t("widget.kpi.verified")}
            value={
              summary.totalCount > 0
                ? summary.verifiedCount / summary.totalCount
                : null
            }
            format="percent"
            locale={locale}
            hint={t("widget.kpi.verifiedHint", {
              count: formatNumber(summary.verifiedCount, locale),
            })}
            onClick={toggleVerified}
          />
          <KpiTile
            label={t("widget.kpi.active")}
            value={summary.activeMonthCount}
            locale={locale}
            hint={t("widget.kpi.activeSpentHint", {
              credits: formatNumber(summary.creditsSpent30d, locale),
            })}
            onClick={() => toggleLastActive(LastActiveFilter.MONTH)}
          />
          <KpiTile
            className="hidden @md:flex"
            label={t("widget.kpi.revenue")}
            value={summary.totalPaidUsd}
            format="currency"
            currency="USD"
            locale={locale}
            hint={t("widget.kpi.revenueHint")}
            onClick={() => togglePayer(PayerFilter.PAID)}
          />
        </KpiGrid>
      )}

      {/* Quick filters */}
      {!isPickerMode && (
        <Div className="flex items-center gap-1.5 flex-wrap">
          <QuickChip
            label={t("widget.quick.humans")}
            active={audience === UsersAudience.HUMANS}
            onClick={toggleHumans}
          />
          <Span className="mx-1 h-4 w-px bg-border" />
          <QuickChip
            label={t("widget.quick.paying", {
              count: formatNumber(summary?.payingCount ?? 0, locale),
            })}
            active={payer === PayerFilter.PAID}
            onClick={() => togglePayer(PayerFilter.PAID)}
          />
          <QuickChip
            label={t("widget.quick.free")}
            active={payer === PayerFilter.FREE}
            onClick={() => togglePayer(PayerFilter.FREE)}
          />
          <Span className="mx-1 h-4 w-px bg-border" />
          <QuickChip
            label={t("widget.quick.activeWeek")}
            active={lastActive === LastActiveFilter.WEEK}
            onClick={() => toggleLastActive(LastActiveFilter.WEEK)}
          />
          <QuickChip
            label={t("widget.quick.dormant")}
            active={lastActive === LastActiveFilter.DORMANT}
            onClick={() => toggleLastActive(LastActiveFilter.DORMANT)}
          />
          <QuickChip
            label={t("widget.quick.freeBurn", {
              min: formatNumber(FREE_BURN_MIN_CREDITS, locale),
              count: formatNumber(summary?.freeBurnCount ?? 0, locale),
            })}
            active={
              payer === PayerFilter.FREE &&
              Number(form.watch("spentMin")) === FREE_BURN_MIN_CREDITS
            }
            onClick={toggleFreeBurn}
          />
          <QuickChip
            label={t("widget.quick.banned", {
              count: formatNumber(summary?.bannedCount ?? 0, locale),
            })}
            active={
              accountState.length === 1 &&
              accountState[0] === AccountStateFilter.BANNED
            }
            onClick={toggleBanned}
          />
          <QuickChip
            label={t("widget.quick.never")}
            active={lastActive === LastActiveFilter.NEVER}
            onClick={() => toggleLastActive(LastActiveFilter.NEVER)}
          />
          <Div className="ml-auto flex items-center gap-1">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs underline underline-offset-2"
                onClick={handleClearFilters}
              >
                {t("widget.actions.clearFilters")}
              </Button>
            )}
            <Button
              type="button"
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <Filter className="h-3.5 w-3.5" />
              {t("widget.actions.moreFilters")}
            </Button>
          </Div>
        </Div>
      )}

      {/* Active filters (drill-downs from reports land here) */}
      {!isPickerMode && chips.length > 0 && (
        <Div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <ActiveFilterChip
              key={chip.key}
              label={chip.label}
              value={chip.value}
              removeLabel={t("widget.chips.remove", { label: chip.label })}
              onRemove={chip.clear}
            />
          ))}
        </Div>
      )}

      {/* Full filter panel */}
      {!isPickerMode && showFilters && (
        <Div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3 rounded-lg border p-3">
          <SelectFieldWidget fieldName="audience" field={children.audience} />
          <TextFieldWidget fieldName="channel" field={children.channel} />
          <SelectFieldWidget
            fieldName="channelType"
            field={children.channelType}
          />
          <TextFieldWidget fieldName="refCode" field={children.refCode} />
          <SelectFieldWidget fieldName="plan" field={children.plan} />
          <MultiSelectFieldWidget fieldName="roles" field={children.roles} />
          <MultiSelectFieldWidget
            fieldName="accountState"
            field={children.accountState}
          />
          <SelectFieldWidget
            fieldName="subscription"
            field={children.subscription}
          />
          <SelectFieldWidget
            fieldName="lastActive"
            field={children.lastActive}
          />
          <DateFieldWidget fieldName="signupFrom" field={children.signupFrom} />
          <DateFieldWidget fieldName="signupTo" field={children.signupTo} />
          <DateFieldWidget fieldName="activeFrom" field={children.activeFrom} />
          <DateFieldWidget fieldName="activeTo" field={children.activeTo} />
          <DateFieldWidget fieldName="paidFrom" field={children.paidFrom} />
          <DateFieldWidget fieldName="paidTo" field={children.paidTo} />
          <CreditBoundInput
            label={t("get.fields.spentMin.label")}
            placeholder={t("widget.creditsAny")}
            value={form.watch("spentMin")}
            onCommit={(next) => {
              form.setValue("spentMin", next, { shouldDirty: true });
              resetPageAndSubmit();
            }}
          />
          <CreditBoundInput
            label={t("get.fields.creditsMin.label")}
            placeholder={t("widget.creditsAny")}
            value={form.watch("creditsMin")}
            onCommit={(next) => {
              form.setValue("creditsMin", next, { shouldDirty: true });
              resetPageAndSubmit();
            }}
          />
          <CreditBoundInput
            label={t("get.fields.creditsMax.label")}
            placeholder={t("widget.creditsAny")}
            value={form.watch("creditsMax")}
            onCommit={(next) => {
              form.setValue("creditsMax", next, { shouldDirty: true });
              resetPageAndSubmit();
            }}
          />
          <TextFieldWidget fieldName="source" field={children.source} />
          <SelectFieldWidget
            fieldName="referralActivity"
            field={children.referralActivity}
          />
          <SelectFieldWidget fieldName="payer" field={children.payer} />
          <SelectFieldWidget fieldName="sortBy" field={children.sortBy} />
          <SelectFieldWidget fieldName="sortOrder" field={children.sortOrder} />
          <NumberFieldWidget fieldName="limit" field={children.limit} />
        </Div>
      )}

      <FormAlertWidget field={children.formAlert} />

      {/* Table */}
      {!data ? (
        endpointMutations?.read?.isLoading !== false ? (
          <LoadingBlock message={t("widget.loading")} />
        ) : (
          <EmptyBlock
            icon={<Users className="h-8 w-8" />}
            title={t("get.errors.server.title")}
            action={{
              label: t("widget.actions.refresh"),
              onClick: handleRefresh,
            }}
          />
        )
      ) : users.length === 0 ? (
        <EmptyBlock
          icon={<Users className="h-8 w-8" />}
          title={
            hasActiveFilters
              ? t("widget.empty.filtered")
              : t("widget.empty.none")
          }
          message={
            hasActiveFilters ? t("widget.empty.filteredHint") : undefined
          }
          action={
            hasActiveFilters
              ? {
                  label: t("widget.actions.clearFilters"),
                  onClick: handleClearFilters,
                }
              : undefined
          }
        />
      ) : (
        <Div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader
              className={
                isPickerMode ? undefined : "hidden @3xl:table-header-group"
              }
            >
              <TableRow>
                <SortHeader
                  label={t("widget.columns.user")}
                  field={UserListSortField.NAME}
                  activeField={sortBy}
                  order={sortOrder}
                  onSort={handleSort}
                />
                {!isPickerMode && (
                  <>
                    <SortHeader
                      label={t("widget.columns.joined")}
                      field={UserListSortField.CREATED_AT}
                      activeField={sortBy}
                      order={sortOrder}
                      onSort={handleSort}
                      className="hidden whitespace-nowrap @3xl:table-cell"
                    />
                    <SortHeader
                      label={t("widget.columns.lastActive")}
                      field={UserListSortField.LAST_ACTIVE}
                      activeField={sortBy}
                      order={sortOrder}
                      onSort={handleSort}
                      className="hidden whitespace-nowrap @3xl:table-cell"
                    />
                    <SortHeader
                      label={t("widget.columns.credits")}
                      field={UserListSortField.CREDITS}
                      activeField={sortBy}
                      order={sortOrder}
                      onSort={handleSort}
                      className="hidden text-right @3xl:table-cell"
                    />
                    <SortHeader
                      label={t("widget.columns.spent")}
                      field={UserListSortField.CREDITS_SPENT}
                      activeField={sortBy}
                      order={sortOrder}
                      onSort={handleSort}
                      className="hidden text-right @3xl:table-cell"
                    />
                    <SortHeader
                      label={t("widget.columns.paid")}
                      field={UserListSortField.TOTAL_PAID}
                      activeField={sortBy}
                      order={sortOrder}
                      onSort={handleSort}
                      className="hidden text-right @3xl:table-cell"
                    />
                    <TableHead className="hidden text-xs @3xl:table-cell">
                      {t("widget.columns.subscription")}
                    </TableHead>
                    <TableHead className="hidden text-xs @3xl:table-cell">
                      {t("widget.columns.source")}
                    </TableHead>
                    <TableHead className="hidden w-10 @3xl:table-cell">
                      <Span className="sr-only">
                        {t("widget.actions.open")}
                      </Span>
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell className="whitespace-normal">
                    <Div className="flex flex-col items-start gap-2">
                      <UserCell user={user} t={t} locale={locale} />
                      {!isPickerMode && (
                        <Span className="block text-xs text-muted-foreground @3xl:hidden">
                          {[
                            t("widget.compact.joined", {
                              date: formatDay(user.createdAt, locale),
                            }),
                            user.lastActiveAt
                              ? t("widget.compact.active", {
                                  when: formatRelative(
                                    user.lastActiveAt,
                                    locale,
                                  ),
                                })
                              : t("widget.compact.neverActive"),
                            user.totalPaidUsd > 0
                              ? t("widget.compact.paid", {
                                  amount: formatUsd(user.totalPaidUsd, locale),
                                })
                              : t("widget.compact.free"),
                            user.plan
                              ? subscriptionPlanLabel(user.plan, locale)
                              : "",
                            t("widget.compact.spent", {
                              count: formatNumber(user.creditsSpent, locale),
                            }),
                            t("widget.spent30d", {
                              count: formatNumber(user.creditsSpent30d, locale),
                            }),
                            sourceText(user, t),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </Span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-auto min-h-9 whitespace-normal",
                          !isPickerMode && "hidden",
                        )}
                        aria-label={t(
                          isPickerMode
                            ? "widget.actions.selectUser"
                            : "widget.actions.openUser",
                          { email: user.email },
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowClick(user);
                        }}
                      >
                        {t(
                          isPickerMode
                            ? "widget.actions.select"
                            : "widget.actions.open",
                        )}
                      </Button>
                    </Div>
                  </TableCell>
                  {!isPickerMode && (
                    <>
                      <TableCell className="hidden text-xs text-muted-foreground whitespace-nowrap @3xl:table-cell">
                        {formatDay(user.createdAt, locale)}
                      </TableCell>
                      <TableCell className="hidden text-xs whitespace-nowrap @3xl:table-cell">
                        {user.lastActiveAt ? (
                          formatRelative(user.lastActiveAt, locale)
                        ) : (
                          <Span className="text-muted-foreground">
                            {t("widget.never")}
                          </Span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-sm @3xl:table-cell">
                        {formatNumber(user.creditBalance, locale)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "hidden text-right tabular-nums text-sm @3xl:table-cell",
                          isFreeBurner(user)
                            ? "font-medium text-warning"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatNumber(user.creditsSpent, locale)}
                        <Span className="block text-[11px] font-normal text-muted-foreground">
                          {t("widget.spent30d", {
                            count: formatNumber(user.creditsSpent30d, locale),
                          })}
                        </Span>
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-sm @3xl:table-cell">
                        {user.totalPaidUsd > 0 ? (
                          <Span className="font-medium text-success">
                            {formatUsd(user.totalPaidUsd, locale)}
                          </Span>
                        ) : (
                          <Span className="text-muted-foreground">-</Span>
                        )}
                      </TableCell>
                      <TableCell className="hidden @3xl:table-cell">
                        {user.subscriptionStatus ? (
                          <Div className="flex flex-col items-start gap-0.5">
                            {user.plan && (
                              <Span className="text-xs font-medium">
                                {subscriptionPlanLabel(user.plan, locale)}
                              </Span>
                            )}
                            <StatusPill
                              status={user.subscriptionStatus}
                              label={subscriptionStatusLabel(
                                user.subscriptionStatus,
                                locale,
                              )}
                              variant={subscriptionStatusVariant(
                                user.subscriptionStatus,
                              )}
                            />
                          </Div>
                        ) : (
                          <Span className="whitespace-nowrap text-xs text-muted-foreground">
                            {user.totalPaidUsd > 0 ? t("widget.oneOff") : "-"}
                          </Span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground max-w-[200px] @3xl:table-cell">
                        <Span className="block truncate">
                          {sourceText(user, t) || t("widget.notTracked")}
                        </Span>
                      </TableCell>
                      <TableCell className="hidden w-10 @3xl:table-cell">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground"
                          aria-label={t("widget.actions.openUser", {
                            email: user.email,
                          })}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRowClick(user);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Div>
      )}

      {/* Pagination */}
      {summary && totalCount > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <Span>
            {t("widget.pagination.showing", {
              start: rangeStart,
              end: rangeEnd,
              total: totalCount,
            })}
          </Span>
          {totalPages > 1 && (
            <Div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                aria-label={t("widget.pagination.previous")}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Span className="tabular-nums text-xs">
                {currentPage} / {totalPages}
              </Span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                aria-label={t("widget.pagination.next")}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}

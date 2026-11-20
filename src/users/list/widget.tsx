/**
 * Users List Widget
 * Admin user directory. Web: KPI strip, search, quick filters, sortable table.
 * CLI/MCP: one line per user plus a pagination hint.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
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
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
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
  subscriptionStatusLabel,
  subscriptionStatusVariant,
} from "../format";
import { USERS_LIST_ALIAS } from "./constants";
import type definition from "./definition";
import type { UserListResponseOutput, UserListRow } from "./definition";
import {
  LastActiveFilter,
  ListSortOrder,
  PayerFilter,
  UserListSortField,
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
  if (users.length === 0) {
    lines.push(t("widget.empty.filtered"));
    return lines.join("\n");
  }
  lines.push("");
  lines.push(
    [
      cell(t("widget.columns.user"), 40),
      cell(t("widget.columns.joined"), 12),
      cell(t("widget.columns.lastActive"), 14),
      cell(t("widget.columns.credits"), 9),
      cell(t("widget.columns.spent"), 8),
      cell(t("widget.columns.paid"), 9),
      cell(t("widget.columns.subscription"), 10),
      t("widget.columns.id"),
    ].join(" "),
  );
  for (const user of users) {
    const flags = [
      user.roles.includes(ADMIN_ROLE) ? t("widget.flags.admin") : "",
      user.isBanned ? t("widget.flags.banned") : "",
    ]
      .filter(Boolean)
      .join(",");
    lines.push(
      [
        cell(`${user.email}${flags ? ` [${flags}]` : ""}`, 40),
        cell(formatDay(user.createdAt, locale), 12),
        cell(formatRelative(user.lastActiveAt, locale), 14),
        cell(formatNumber(user.creditBalance, locale), 9),
        cell(formatNumber(user.creditsSpent, locale), 8),
        cell(
          user.totalPaidUsd > 0 ? formatUsd(user.totalPaidUsd, locale) : "-",
          9,
        ),
        cell(
          user.subscriptionStatus
            ? subscriptionStatusLabel(user.subscriptionStatus, locale)
            : "-",
          10,
        ),
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
      <Div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
        {displayName(user).slice(0, 2).toUpperCase()}
      </Div>
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
          {!user.emailVerified && (
            <StatusPill
              status="unverified"
              label={t("widget.flags.unverified")}
              variant="warning"
            />
          )}
        </Div>
        <Span className="block text-xs text-muted-foreground break-all @3xl:truncate @3xl:max-w-[260px]">
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
    void (async (): Promise<void> => {
      const statsDef = await import("../stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

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
    form.watch("source") ||
    form.watch("referralActivity"),
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
        <MetricGrid columns={4}>
          <MetricCard
            label={t("widget.kpi.matching")}
            value={formatNumber(summary.totalCount, locale)}
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            label={t("widget.kpi.paying")}
            value={formatNumber(summary.payingCount, locale)}
            description={
              summary.totalCount > 0
                ? t("widget.kpi.payingShare", {
                    percent: Math.round(
                      (summary.payingCount / summary.totalCount) * 100,
                    ),
                  })
                : undefined
            }
            variant="success"
          />
          <MetricCard
            label={t("widget.kpi.revenue")}
            value={formatUsd(summary.totalPaidUsd, locale)}
            description={t("widget.kpi.revenueHint")}
            variant="info"
          />
          <MetricCard
            label={t("widget.kpi.credits")}
            value={formatNumber(summary.creditBalance, locale)}
            description={t("widget.kpi.creditsHint")}
          />
        </MetricGrid>
      )}

      {/* Quick filters */}
      {!isPickerMode && (
        <Div className="flex items-center gap-1.5 flex-wrap">
          <QuickChip
            label={t("widget.quick.paying")}
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

      {/* Full filter panel */}
      {!isPickerMode && showFilters && (
        <Div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3 rounded-lg border p-3">
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
        endpointMutations?.read?.isLoading !== false && (
          <LoadingBlock message={t("widget.loading")} />
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
            <TableHeader>
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
                        <Div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground @3xl:hidden">
                          <Span>
                            {t("widget.compact.credits", {
                              count: formatNumber(user.creditBalance, locale),
                            })}
                          </Span>
                          {user.subscriptionStatus && (
                            <Span>
                              {subscriptionStatusLabel(
                                user.subscriptionStatus,
                                locale,
                              )}
                            </Span>
                          )}
                        </Div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto min-h-9 whitespace-normal"
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
                      <TableCell className="hidden text-right tabular-nums text-sm text-muted-foreground @3xl:table-cell">
                        {formatNumber(user.creditsSpent, locale)}
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
                        ) : (
                          <Span className="text-xs text-muted-foreground">
                            -
                          </Span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground max-w-[180px] truncate @3xl:table-cell">
                        {user.referredByEmail
                          ? t("widget.referredBy", {
                              email: user.referredByEmail,
                            })
                          : (user.source ?? "-")}
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

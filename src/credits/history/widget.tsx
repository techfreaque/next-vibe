"use client";

import { toIntlLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { UserRole } from "next-vibe/identity/roles/enum";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PaginationWidget } from "next-vibe/unified-ui/widgets/containers/pagination/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { useState } from "react";

import {
  DayRangeInputs,
  type FilterChip,
  FilterChips,
  formatUtc,
  SegmentGroup,
} from "@/payment/processor/list-controls";

import { CreditsTabHeader } from "../credits-tab-header";
import {
  CreditTransactionType,
  CreditTransactionTypeDB,
  type CreditTransactionTypeValue,
} from "../enum";
import type definition from "./definition";

const typeVariants: Record<
  typeof CreditTransactionTypeValue,
  StatusPillVariant
> = {
  [CreditTransactionType.FREE_GRANT]: "info",
  [CreditTransactionType.FREE_RESET]: "warning",
  [CreditTransactionType.PURCHASE]: "success",
  [CreditTransactionType.SUBSCRIPTION]: "success",
  [CreditTransactionType.USAGE]: "muted",
  [CreditTransactionType.EXPIRY]: "warning",
  [CreditTransactionType.REFUND]: "danger",
  [CreditTransactionType.TRANSFER]: "default",
  [CreditTransactionType.OTHER_DEVICES]: "muted",
  [CreditTransactionType.REFERRAL_EARNING]: "success",
  [CreditTransactionType.REFERRAL_PAYOUT]: "warning",
};

const FILTER_TYPES = [
  CreditTransactionType.USAGE,
  CreditTransactionType.PURCHASE,
  CreditTransactionType.SUBSCRIPTION,
  CreditTransactionType.FREE_GRANT,
  CreditTransactionType.FREE_RESET,
  CreditTransactionType.REFUND,
  CreditTransactionType.EXPIRY,
  CreditTransactionType.REFERRAL_EARNING,
  CreditTransactionType.REFERRAL_PAYOUT,
] as const;

export function CreditHistoryContainer({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definition.GET>();
  const user = useWidgetUser();
  const navigate = useRelatedEntityNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { endpointMutations } = useWidgetContext();
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const onSubmit = useWidgetOnSubmit();
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || platform === Platform.MCP;
  const [showFilters, setShowFilters] = useState(false);
  const resolved = isAdmin ? value?.resolvedTarget : undefined;
  const targetUserId = isAdmin
    ? (form?.watch("targetUserId") ?? resolved?.userId ?? undefined)
    : undefined;
  const targetLeadId = isAdmin
    ? (form?.watch("targetLeadId") ?? resolved?.leadId ?? undefined)
    : undefined;
  const isTargeted = Boolean(targetUserId || targetLeadId);
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const canFilter =
    isAdmin && interactive && !responseOnly && Boolean(onSubmit);
  const typeFilter = isAdmin ? form?.watch("typeFilter") : undefined;
  const packId = isAdmin ? form?.watch("packId") : undefined;
  const from = isAdmin ? form?.watch("from") : undefined;
  const to = isAdmin ? form?.watch("to") : undefined;
  const transactions = value?.transactions ?? [];
  const pagination = value?.paginationInfo;
  const lang = toIntlLocale(locale);
  const numbers = new Intl.NumberFormat(lang, { maximumFractionDigits: 6 });
  const signedNumbers = new Intl.NumberFormat(lang, {
    maximumFractionDigits: 6,
    signDisplay: "exceptZero",
  });
  const ledgerNumbers = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const pageNumber = Number(form?.watch("paginationInfo.page")) || 1;
  const pageLimit =
    Number(form?.watch("paginationInfo.limit")) || transactions.length || 1;
  const rangeFrom = (pageNumber - 1) * pageLimit + 1;
  const resubmit = (): void => {
    form.setValue("paginationInfo.page", 1, { shouldDirty: true });
    onSubmit?.();
  };
  const clearTarget = (): void => {
    form.setValue("targetUserId", undefined, { shouldDirty: true });
    form.setValue("targetLeadId", undefined, { shouldDirty: true });
    form.setValue("target", "", { shouldDirty: true });
    form.setValue("typeFilter", undefined, { shouldDirty: true });
    form.setValue("packId", undefined, { shouldDirty: true });
    form.setValue("from", undefined, { shouldDirty: true });
    form.setValue("to", undefined, { shouldDirty: true });
    resubmit();
  };
  const setType = (
    next: typeof CreditTransactionTypeValue | undefined,
  ): void => {
    form.setValue("typeFilter", next, { shouldDirty: true });
    resubmit();
  };
  const setDays = (patch: { from?: string; to?: string }): void => {
    if (patch.from !== undefined) {
      form.setValue("from", patch.from || undefined, { shouldDirty: true });
    }
    if (patch.to !== undefined) {
      form.setValue("to", patch.to || undefined, { shouldDirty: true });
    }
    resubmit();
  };
  const chips: FilterChip[] = [];
  if (packId) {
    chips.push({
      key: "packId",
      label: t("history.get.packId"),
      value: packId.slice(0, 8),
      onRemove: () => {
        form.setValue("packId", undefined, { shouldDirty: true });
        resubmit();
      },
    });
  }
  if (typeFilter) {
    chips.push({
      key: "type",
      label: t("history.get.colType"),
      value: t(typeFilter),
      onRemove: () => setType(undefined),
    });
  }
  if (from) {
    chips.push({
      key: "from",
      label: t("history.get.from"),
      value: formatDate(new Date(`${from}T00:00:00Z`), locale, "PP"),
      onRemove: () => setDays({ from: "" }),
    });
  }
  if (to) {
    chips.push({
      key: "to",
      label: t("history.get.to"),
      value: formatDate(new Date(`${to}T00:00:00Z`), locale, "PP"),
      onRemove: () => setDays({ to: "" }),
    });
  }

  const pager = interactive &&
    !responseOnly &&
    pagination &&
    (pagination.totalCount > 0 || form.watch("paginationInfo.page") > 1) && (
      <PaginationWidget
        field={withValue(
          { ...children.paginationInfo, className: "flex-wrap gap-3" },
          pagination,
          value,
        )}
        fieldName="paginationInfo"
      />
    );

  // ---- Admin without a target: ledger lookup, never the admin's own wallet
  if (isAdmin && !isTargeted) {
    return (
      <WidgetShell className="gap-4">
        {isText ? (
          <Span>{t("history.get.lookupHint")}</Span>
        ) : (
          <Div className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
            <Div className="flex min-w-0 items-start gap-3">
              <Receipt className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <Div className="flex min-w-0 flex-col gap-0.5">
                <Span className="text-base font-semibold">
                  {t("history.get.lookupTitle")}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {t("history.get.lookupHint")}
                </Span>
              </Div>
            </Div>
            {canFilter && (
              <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-end">
                <Div className="min-w-0 flex-1">
                  <TextFieldWidget
                    fieldName="target"
                    field={{ ...children.target, hidden: false }}
                  />
                </Div>
                <Button type="submit" size="sm" onClick={resubmit}>
                  {t("history.get.openLedger")}
                </Button>
              </Div>
            )}
          </Div>
        )}
        <FormAlertWidget field={{}} />
        {isText && value?.recent && value.recent.length > 0 && (
          <Div className="flex flex-col">
            <Span>{t("history.get.recentTitle")}</Span>
            {value.recent.map((entry) => (
              <Span key={entry.id}>
                {[
                  formatUtc(entry.createdAt, locale),
                  signedNumbers.format(entry.amount),
                  entry.label,
                  entry.email ?? entry.leadId ?? t("history.get.guestDevice"),
                ].join(" · ")}
              </Span>
            ))}
          </Div>
        )}
        {!isText && value?.recent && value.recent.length > 0 && (
          <Div className="flex min-w-0 flex-col gap-2">
            <Div className="flex flex-wrap items-baseline gap-x-2">
              <Span className="text-sm font-semibold">
                {t("history.get.recentTitle")}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("history.get.guestGrantsHidden")}
              </Span>
            </Div>
            <Div className="min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card">
              {value.recent.map((entry) => (
                <Div
                  key={entry.id}
                  className="flex min-w-0 flex-col gap-1 px-3 py-2 @md:flex-row @md:items-center @md:gap-4 @md:px-4"
                >
                  <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                      {entry.email ?? t("history.get.guestDevice")}
                      <Span className="ms-2 font-mono text-xs font-normal text-muted-foreground">
                        {(entry.userId ?? entry.leadId ?? "").slice(0, 8)}
                      </Span>
                    </Span>
                    <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                      {[
                        formatUtc(entry.createdAt, locale),
                        entry.label,
                        ...(entry.detail ? [entry.detail] : []),
                      ].join(" · ")}
                    </Span>
                  </Div>
                  <Span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      entry.amount > 0 && "text-success",
                    )}
                  >
                    {signedNumbers.format(entry.amount)}
                  </Span>
                  {canFilter && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        form.setValue(
                          "targetUserId",
                          entry.userId ?? undefined,
                          {
                            shouldDirty: true,
                          },
                        );
                        form.setValue(
                          "targetLeadId",
                          entry.userId
                            ? undefined
                            : (entry.leadId ?? undefined),
                          { shouldDirty: true },
                        );
                        resubmit();
                      }}
                    >
                      {t("history.get.openLedger")}
                    </Button>
                  )}
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </WidgetShell>
    );
  }

  // ---- Admin ledger of one account or lead
  if (isAdmin) {
    const who = resolved?.email ?? targetUserId ?? targetLeadId ?? "";
    return (
      <WidgetShell className="min-w-0 gap-4">
        {isText ? (
          <Span>{t("history.get.showing", { who })}</Span>
        ) : (
          <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-center @md:justify-between">
            <Div className="flex min-w-0 flex-col gap-0.5">
              <Div className="flex min-w-0 flex-wrap items-center gap-2">
                <Span className="text-base font-semibold [overflow-wrap:anywhere]">
                  {t("history.get.showing", { who })}
                </Span>
                <StatusPill
                  className="shrink-0"
                  status={
                    targetUserId
                      ? t("history.get.kindAccount")
                      : t("history.get.kindLead")
                  }
                  variant={targetUserId ? "info" : "muted"}
                />
              </Div>
              <Span className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                {targetUserId ?? targetLeadId}
              </Span>
            </Div>
            {interactive && !responseOnly && (
              <Div className="flex flex-wrap gap-2">
                {targetUserId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        () =>
                          import("@/users/view/definition").then(
                            (module) => module.default.GET,
                          ),
                        { data: { userId: targetUserId } },
                      )
                    }
                  >
                    {t("history.get.openAccount")}
                  </Button>
                )}
                {!targetUserId && targetLeadId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        () =>
                          import("@/leads/[id]/definition").then(
                            (module) => module.default.GET,
                          ),
                        { urlPathParams: { id: targetLeadId } },
                      )
                    }
                  >
                    {t("history.get.openLead")}
                  </Button>
                )}
                {targetUserId && resolved?.isPartner && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        () =>
                          import("@/referral/admin/payouts/definition").then(
                            (module) => module.default.GET,
                          ),
                        { data: { userId: targetUserId } },
                      )
                    }
                  >
                    {t("history.get.openPayouts")}
                  </Button>
                )}
                {canFilter && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearTarget}
                  >
                    {t("history.get.changeTarget")}
                  </Button>
                )}
              </Div>
            )}
          </Div>
        )}
        {isText && value?.totals && (
          <Span>
            {[
              value.currentBalance
                ? `${t("history.get.currentBalance")} ${ledgerNumbers.format(
                    value.currentBalance.paid + value.currentBalance.free,
                  )} (${t("history.get.currentBalanceHint", {
                    paid: ledgerNumbers.format(value.currentBalance.paid),
                    free: ledgerNumbers.format(value.currentBalance.free),
                  })})`
                : "",
              `${t("history.get.spent")} ${ledgerNumbers.format(value.totals.spent)}`,
              `${t("history.get.granted")} ${ledgerNumbers.format(value.totals.granted)}`,
              `${t("history.get.entries")} ${pagination?.totalCount ?? 0}`,
            ].join(" · ")}
          </Span>
        )}
        {!isText && value?.totals && (
          <Div className="grid min-w-0 grid-cols-2 gap-3 @3xl:grid-cols-4">
            {[
              {
                key: "balance",
                label: t("history.get.currentBalance"),
                value: value.currentBalance
                  ? ledgerNumbers.format(
                      value.currentBalance.paid + value.currentBalance.free,
                    )
                  : "",
                hint: value.currentBalance
                  ? t("history.get.currentBalanceHint", {
                      paid: ledgerNumbers.format(value.currentBalance.paid),
                      free: ledgerNumbers.format(value.currentBalance.free),
                    })
                  : "",
                tone: "text-foreground",
              },
              {
                key: "spent",
                label: t("history.get.spent"),
                value: ledgerNumbers.format(value.totals.spent),
                hint: t("history.get.periodHint"),
                tone: "text-destructive",
              },
              {
                key: "granted",
                label: t("history.get.granted"),
                value: ledgerNumbers.format(value.totals.granted),
                hint: t("history.get.periodHint"),
                tone: "text-success",
              },
              {
                key: "entries",
                label: t("history.get.entries"),
                value: new Intl.NumberFormat(lang).format(
                  pagination?.totalCount ?? 0,
                ),
                hint: t("history.get.periodHint"),
                tone: "text-foreground",
              },
            ].map((card) => (
              <Div
                key={card.key}
                className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-2.5 @md:p-4"
              >
                <Span className="text-xs text-muted-foreground">
                  {card.label}
                </Span>
                <Span
                  className={cn(
                    "text-lg font-semibold tabular-nums [overflow-wrap:anywhere] @md:text-2xl",
                    card.tone,
                  )}
                >
                  {card.value}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {card.hint}
                </Span>
              </Div>
            ))}
          </Div>
        )}
        {!isText && pagination && pagination.totalCount > 0 && (
          <Span className="text-xs text-muted-foreground tabular-nums">
            {t("history.get.showingRange", {
              from: rangeFrom,
              to: rangeFrom + transactions.length - 1,
              total: pagination.totalCount,
            })}
          </Span>
        )}
        <FormAlertWidget field={{}} />
        {canFilter && (
          <Div className="flex min-w-0 flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={showFilters}
              className="self-start @3xl:hidden"
              onClick={() => setShowFilters((shown) => !shown)}
            >
              {t(
                showFilters
                  ? "history.get.hideFilters"
                  : "history.get.showFilters",
              )}
            </Button>
            <Div
              className={cn(
                "min-w-0 grid-cols-1 gap-3 @3xl:grid @3xl:grid-cols-[minmax(0,1fr)_auto]",
                showFilters ? "grid" : "hidden",
              )}
            >
              <SegmentGroup
                label={t("history.get.colType")}
                value={typeFilter}
                disabled={isFetching}
                onSelect={setType}
                options={[
                  { value: undefined, label: t("history.get.allTypes") },
                  ...FILTER_TYPES.map((option) => ({
                    value: option,
                    label: t(option),
                  })),
                ]}
              />
              <DayRangeInputs
                fromLabel={t("history.get.from")}
                toLabel={t("history.get.to")}
                from={from}
                to={to}
                disabled={isFetching}
                onChange={setDays}
              />
            </Div>
            <FilterChips
              title={t("history.get.filteredBy")}
              chips={chips}
              clearLabel={t("history.get.clearFilters")}
              removeLabel={t("history.get.removeFilter")}
              disabled={isFetching}
              onClear={() => {
                form.setValue("typeFilter", undefined, { shouldDirty: true });
                form.setValue("packId", undefined, { shouldDirty: true });
                form.setValue("from", undefined, { shouldDirty: true });
                form.setValue("to", undefined, { shouldDirty: true });
                resubmit();
              }}
            />
          </Div>
        )}
        {!value && !response && (
          <LoadingBlock message={t("history.get.loading")} />
        )}
        {value && transactions.length === 0 && (
          <EmptyBlock
            className="rounded-xl border"
            icon={<Receipt className="size-6" />}
            title={t("history.get.emptyState")}
            message={
              chips.length > 0
                ? t("history.get.emptyFiltered")
                : t("history.get.emptyHint")
            }
          />
        )}
        {isText && transactions.length > 0 && (
          <Div className="flex flex-col">
            {transactions.map((transaction) => (
              <Span key={transaction.id}>
                {[
                  formatUtc(transaction.createdAt, locale),
                  transaction.label ?? transaction.type ?? "",
                  ...(transaction.detail ? [transaction.detail] : []),
                  signedNumbers.format(transaction.amount),
                  `${t("history.get.colBalance")} ${numbers.format(transaction.balanceAfter)}`,
                ].join(" · ")}
              </Span>
            ))}
          </Div>
        )}
        {!isText && transactions.length > 0 && (
          <Div
            className={cn(
              "min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card",
              isFetching && "opacity-60",
            )}
          >
            <Div className="hidden gap-3 px-4 py-2 text-xs font-medium text-muted-foreground @2xl:grid @2xl:grid-cols-[11.5rem_10rem_minmax(0,1fr)_7rem_8rem]">
              <Span>{t("history.get.colDate")}</Span>
              <Span>{t("history.get.colType")}</Span>
              <Span>{t("history.get.colDetail")}</Span>
              <Span className="text-right">{t("history.get.colAmount")}</Span>
              <Span className="text-right">{t("history.get.colBalance")}</Span>
            </Div>
            {transactions.map((transaction) => {
              const typeKey = CreditTransactionTypeDB.find(
                (key) => key === transaction.typeKey,
              );
              const label = transaction.label ?? transaction.type ?? "";
              return (
                <Div
                  key={transaction.id}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 px-3 py-2 @2xl:grid-cols-[11.5rem_10rem_minmax(0,1fr)_7rem_8rem] @2xl:items-center @2xl:px-4"
                >
                  <Span className="order-3 text-xs tabular-nums text-muted-foreground @2xl:order-none @2xl:whitespace-nowrap">
                    {formatUtc(transaction.createdAt, locale)}
                  </Span>
                  <Div className="order-1 flex min-w-0 flex-wrap @2xl:order-none">
                    <StatusPill
                      status={label}
                      variant={typeKey ? typeVariants[typeKey] : "muted"}
                    />
                  </Div>
                  <Span className="order-5 col-span-2 min-w-0 text-xs text-muted-foreground [overflow-wrap:anywhere] @2xl:order-none @2xl:col-span-1 @2xl:text-sm">
                    {transaction.detail ?? ""}
                    {transaction.paymentId && interactive && !responseOnly && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="ms-2 h-auto p-0 text-xs"
                        onClick={() =>
                          navigate(
                            () =>
                              import("@/payment/processor/definition").then(
                                (module) => module.default.GET,
                              ),
                            {
                              data: {
                                transactionId:
                                  transaction.paymentId ?? undefined,
                              },
                            },
                          )
                        }
                      >
                        {t("history.get.openPayment")}
                      </Button>
                    )}
                  </Span>
                  <Span
                    className={cn(
                      "order-2 text-right text-sm font-semibold @2xl:order-none",
                      transaction.amount > 0
                        ? "text-success"
                        : transaction.amount < 0
                          ? "text-foreground"
                          : "text-muted-foreground",
                    )}
                  >
                    {signedNumbers.format(transaction.amount)}
                  </Span>
                  <Span className="order-4 text-right text-xs tabular-nums text-muted-foreground @2xl:order-none @2xl:text-sm">
                    <Span className="@2xl:hidden">
                      {t("history.get.colBalance")}{" "}
                    </Span>
                    {numbers.format(transaction.balanceAfter)}
                  </Span>
                </Div>
              );
            })}
          </Div>
        )}
        {pager}
      </WidgetShell>
    );
  }

  // ---- Customer: own history
  return (
    <WidgetShell className="gap-4">
      {interactive && !responseOnly && <CreditsTabHeader activeTab="history" />}
      <FormAlertWidget field={{}} />
      {!value && !response && (
        <LoadingBlock message={t("history.get.loading")} />
      )}
      {value && transactions.length === 0 && (
        <EmptyBlock
          icon={<Receipt className="size-6" />}
          title={t("history.get.emptyState")}
          message={t("history.get.emptyHint")}
        />
      )}
      {transactions.length > 0 && (
        <Div className="rounded-xl border bg-card divide-y divide-border">
          {transactions.map((transaction) => {
            const typeKey = CreditTransactionTypeDB.find(
              (key) => key === transaction.type,
            );
            const typeLabel =
              transaction.type === "history.get.bonusGrant"
                ? t("history.get.bonusGrant")
                : typeKey
                  ? t(typeKey)
                  : transaction.type;
            return (
              <Div
                key={transaction.id}
                className="grid min-w-0 gap-2 p-3 @sm:grid-cols-2 @sm:px-4"
              >
                <Div className="flex min-w-0 flex-col gap-1">
                  <Span className="break-words text-sm font-medium">
                    {typeLabel}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {formatDate(
                      new Date(transaction.createdAt),
                      locale,
                      "PP p",
                    )}
                  </Span>
                </Div>
                <Div className="flex min-w-0 flex-col gap-1">
                  <Span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      transaction.amount > 0 && "text-success",
                    )}
                  >
                    {t("history.get.delta", {
                      amount: signedNumbers.format(transaction.amount),
                    })}
                  </Span>
                  <Span className="text-xs tabular-nums text-muted-foreground">
                    {t("history.get.entryBalance", {
                      count: numbers.format(transaction.balanceAfter),
                    })}
                  </Span>
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
      {pager}
    </WidgetShell>
  );
}

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { isAgentPlatform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Alert } from "next-vibe/ui/components/alert";
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
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo, useState } from "react";

import {
  PayoutCurrency,
  PayoutCurrencyDB,
  PayoutStatus,
  PayoutStatusDB,
  type PayoutStatusValue,
} from "../../enum";
import type { ReferralT } from "../../i18n";
import {
  type adminPayoutActions,
  canDocumentReferralPayout,
  getAdminPayoutActions,
} from "../../payout-actions";
import definitions, { type AdminPayoutsGetResponseOutput } from "./definition";

type Payout = AdminPayoutsGetResponseOutput["items"][number];

/** Work queue order: what needs a decision first, finished states last. */
const TAB_ORDER = [
  PayoutStatus.PENDING,
  PayoutStatus.APPROVED,
  PayoutStatus.PROCESSING,
  PayoutStatus.FAILED,
  PayoutStatus.COMPLETED,
  PayoutStatus.REJECTED,
] as const;

const ALL_METHODS = "__all_payout_methods";

const statusVariants: Record<typeof PayoutStatusValue, StatusPillVariant> = {
  [PayoutStatus.PENDING]: "warning",
  [PayoutStatus.APPROVED]: "info",
  [PayoutStatus.REJECTED]: "danger",
  [PayoutStatus.PROCESSING]: "info",
  [PayoutStatus.COMPLETED]: "success",
  [PayoutStatus.FAILED]: "danger",
};

const actionLabels = {
  approve: "admin.payouts.widget.approve",
  reject: "admin.payouts.widget.reject",
  complete: "admin.payouts.widget.complete",
} as const;

const actionTitles = {
  approve: "admin.payouts.widget.confirmApprove",
  reject: "admin.payouts.widget.confirmReject",
  complete: "admin.payouts.widget.confirmComplete",
} as const;

const actionDescriptions = {
  approve: "admin.payouts.widget.approveDetail",
  reject: "admin.payouts.widget.rejectDetail",
  complete: "admin.payouts.widget.completeDetail",
} as const;

function isOpenStatus(status: typeof PayoutStatusValue): boolean {
  return (
    status === PayoutStatus.PENDING ||
    status === PayoutStatus.APPROVED ||
    status === PayoutStatus.PROCESSING
  );
}

function nextStepKey(
  item: Payout,
):
  | "admin.payouts.widget.nextStep.failed"
  | "admin.payouts.widget.nextStep.processing"
  | "admin.payouts.widget.nextStep.credits"
  | null {
  if (item.status === PayoutStatus.FAILED) {
    return "admin.payouts.widget.nextStep.failed";
  }
  if (item.status === PayoutStatus.PROCESSING) {
    return "admin.payouts.widget.nextStep.processing";
  }
  if (
    item.currency === PayoutCurrency.CREDITS &&
    item.status === PayoutStatus.PENDING
  ) {
    return "admin.payouts.widget.nextStep.credits";
  }
  return null;
}

function summaryByStatus(
  summary: AdminPayoutsGetResponseOutput["summary"],
  status: typeof PayoutStatusValue,
): { count: number; amountCents: number } {
  const row = summary.find((candidate) => candidate.status === status);
  return { count: row?.count ?? 0, amountCents: row?.amountCents ?? 0 };
}

function formatPayoutValue(
  item: Payout,
  locale: CountryLanguage,
  t: ReferralT,
): string {
  return t("admin.payouts.widget.amount", {
    credits: item.amountCents.toLocaleString(locale.split("-")[0]),
    value: formatCurrency(item.amountCents / 100, "USD", locale),
  });
}

/** First 6 and last 4 characters: enough to match a wallet or reference by eye. */
function maskValue(value: string): string {
  return value.length > 14 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;
}

function CopyValue({
  value,
  label,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const platform = useWidgetPlatform();
  const logger = useWidgetLogger();
  if (isCliPlatform(platform) || isAgentPlatform(platform)) {
    return (
      <Span className="font-mono text-xs">
        {label}: {value}
      </Span>
    );
  }
  return (
    <Div className="flex min-w-0 flex-col gap-0.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Div className="flex min-w-0 items-center gap-1">
        <Span className="font-mono text-xs" title={value}>
          {maskValue(value)}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label={`${copyLabel}: ${label}`}
          title={copied ? copiedLabel : copyLabel}
          onClick={(event) => {
            event.stopPropagation();
            void copyToClipboard(value, logger).then((ok) => {
              setCopied(ok);
              if (ok) {
                setTimeout(() => setCopied(false), 1500);
              }
              return ok;
            });
          }}
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </Div>
    </Div>
  );
}

type PayoutFlag = "over" | "duplicate" | null;

function flagOf(item: Payout): PayoutFlag {
  if (isOpenStatus(item.status) && item.partner.freeCents < 0) {
    return "over";
  }
  if (item.duplicateCount > 0 && isOpenStatus(item.status)) {
    return "duplicate";
  }
  return null;
}

export function AdminPayoutsContainer({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const navigate = useRelatedEntityNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || isAgentPlatform(platform);
  const { read } = useWidgetEndpointMutations() ?? {};
  const isFetching = read?.isFetching ?? false;
  const canAct = interactive && !responseOnly;
  const [openId, setOpenId] = useState<string | null>(null);
  const userId = form?.watch("userId");
  const activeStatus = form?.watch("status");
  const activeCurrency = form?.watch("currency");
  const search = form?.watch("search") ?? "";
  const page = data?.resultPage ?? 1;
  const pageSize = data?.pageSize ?? form?.watch("limit") ?? 20;
  const totalCount = data?.totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasError = response?.success === false;
  const filtered = Boolean(search || activeCurrency || activeStatus);

  function setFilter(
    key: "status" | "currency",
    value: string | undefined,
  ): void {
    form.setValue("page", 1);
    if (key === "status") {
      form.setValue(
        "status",
        PayoutStatusDB.find((status) => status === value),
      );
    } else {
      form.setValue(
        "currency",
        PayoutCurrencyDB.find((currency) => currency === value),
      );
    }
  }

  function clearFilters(): void {
    form.setValue("page", 1);
    form.setValue("search", undefined);
    form.setValue("status", undefined);
    form.setValue("currency", undefined);
  }

  const firstOpenIds = new Set<string>();
  const seenPartners = new Set<string>();
  for (const candidate of data?.items ?? []) {
    if (isOpenStatus(candidate.status) && !seenPartners.has(candidate.userId)) {
      seenPartners.add(candidate.userId);
      firstOpenIds.add(candidate.id);
    }
  }

  function money(cents: number): string {
    return formatMoney(cents / 100, "USD", locale);
  }

  function openAction(
    item: Payout,
    action: (typeof adminPayoutActions)[number],
  ): void {
    navigate(() => Promise.resolve(definitions.POST), {
      data: { requestId: item.id, action },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  }

  function openPartner(item: Payout): void {
    navigate(
      () =>
        import("@/users/view/definition").then((module) => module.default.GET),
      { data: { userId: item.userId } },
    );
  }

  function openCodeReport(code: string): void {
    navigate(
      () => import("../code/definition").then((module) => module.default.GET),
      { data: { code } },
    );
  }

  function prepareBill(item: Payout): void {
    navigate(
      async () =>
        (await import("@/finance/supplier-evidence/definition")).default.POST,
      {
        data: {
          operation: "referral",
          externalReference: item.id,
          dryRun: true,
        },
      },
    );
  }

  function statusPill(item: Payout): JSX.Element {
    return (
      <StatusPill
        status={t(item.status)}
        variant={statusVariants[item.status]}
      />
    );
  }

  function flagLine(item: Payout): JSX.Element | null {
    const flag = flagOf(item);
    if (!flag) {
      return null;
    }
    return (
      <Span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
        <AlertTriangle className="size-3.5 shrink-0" />
        {flag === "over"
          ? t("admin.payouts.widget.flagOver")
          : t("admin.payouts.widget.flagDuplicate", {
              count: item.duplicateCount,
            })}
      </Span>
    );
  }

  function rowActions(item: Payout): JSX.Element | null {
    if (!canAct) {
      return null;
    }
    const actions = getAdminPayoutActions(item);
    const primary = actions.find((action) => action !== "reject");
    const canReject = actions.includes("reject");
    const overCommitted =
      isOpenStatus(item.status) && item.partner.freeCents < 0;
    return (
      <Div className="flex items-center justify-end gap-1">
        {primary && (
          <Button
            type="button"
            size="sm"
            variant={overCommitted ? "outline" : "default"}
            className="h-8"
            aria-label={t("admin.payouts.widget.actionFor", {
              action: t(actionLabels[primary]),
              email: item.userEmail,
            })}
            onClick={(event) => {
              event.stopPropagation();
              openAction(item, primary);
            }}
          >
            {primary === "approve" && overCommitted
              ? t("admin.payouts.widget.approveOverBalance")
              : t(actionLabels[primary])}
          </Button>
        )}
        {!primary && canReject && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8"
            aria-label={t("admin.payouts.widget.actionFor", {
              action: t(actionLabels.reject),
              email: item.userEmail,
            })}
            onClick={(event) => {
              event.stopPropagation();
              openAction(item, "reject");
            }}
          >
            {t(actionLabels.reject)}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              aria-label={t("admin.payouts.widget.moreFor", {
                email: item.userEmail,
              })}
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48" stopPropagation>
            <DropdownMenuItem onSelect={() => openPartner(item)}>
              {t("admin.payouts.widget.openPartner")}
            </DropdownMenuItem>
            {item.partnerCodes[0] && (
              <DropdownMenuItem
                onSelect={() => openCodeReport(item.partnerCodes[0] ?? "")}
              >
                {t("admin.payouts.widget.codeReport")}
              </DropdownMenuItem>
            )}
            {canDocumentReferralPayout(item) && (
              <DropdownMenuItem onSelect={() => prepareBill(item)}>
                {t("admin.payouts.widget.prepareBill")}
              </DropdownMenuItem>
            )}
            {primary && canReject && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => openAction(item, "reject")}
                >
                  {t("admin.payouts.widget.rejectEllipsis")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Div>
    );
  }

  function details(item: Payout): JSX.Element {
    const nextStep = nextStepKey(item);
    const overCommitted =
      isOpenStatus(item.status) && item.partner.freeCents < 0;
    const firstOpenOfPartner = firstOpenIds.has(item.id);
    return (
      <Div className="flex min-w-0 flex-col gap-3 text-sm">
        {overCommitted && (
          <Span className="font-medium text-destructive">
            {!firstOpenOfPartner
              ? t("admin.payouts.widget.overBalanceShort")
              : item.partner.openCount > 1
                ? t("admin.payouts.widget.overBalance", {
                    count: item.partner.openCount,
                    open: money(item.partner.openCents),
                    available: money(item.partner.availableCents),
                  })
                : t("admin.payouts.widget.overBalanceSingle", {
                    amount: money(item.amountCents),
                    available: money(item.partner.availableCents),
                  })}
          </Span>
        )}
        {item.duplicateCount > 0 && isOpenStatus(item.status) && (
          <Span className="font-medium text-destructive">
            {t("admin.payouts.widget.possibleDuplicate", {
              count: item.duplicateCount,
            })}
          </Span>
        )}
        {nextStep && (
          <Span className="text-muted-foreground">{t(nextStep)}</Span>
        )}
        <DetailGrid columns={3}>
          <DetailField
            label={t("admin.payouts.widget.freeLabel")}
            value={
              <Span
                className={
                  item.partner.freeCents < 0
                    ? "tabular-nums text-destructive"
                    : "tabular-nums"
                }
              >
                {money(item.partner.freeCents)}
              </Span>
            }
          />
          <DetailField
            label={t("admin.payouts.widget.earnedLabel")}
            value={t("admin.payouts.widget.earnedValue", {
              confirmed: money(item.partner.confirmedCents),
              pending: money(item.partner.pendingCents),
            })}
          />
          <DetailField
            label={t("admin.payouts.widget.paidLabel")}
            value={money(item.partner.paidOutCents)}
          />
          <DetailField
            label={t("admin.payouts.widget.codesLabel")}
            value={
              item.partnerCodes.length > 0
                ? t("admin.payouts.widget.codesValue", {
                    codes: item.partnerCodes.join(", "),
                    referred: item.partner.referredUsers,
                  })
                : t("admin.payouts.widget.partnerNoCodes", {
                    referred: item.partner.referredUsers,
                  })
            }
          />
          <DetailField
            label={t("admin.payouts.widget.valueLabel")}
            value={formatPayoutValue(item, locale, t)}
          />
          {item.processedAt && (
            <DetailField
              label={t("admin.payouts.widget.updatedLabel")}
              value={formatDate(new Date(item.processedAt), locale, "PP p")}
            />
          )}
          {item.rejectionReason && (
            <DetailField
              label={t("admin.payouts.fields.rejectionReason.label")}
              value={item.rejectionReason}
            />
          )}
          {item.adminNotes && (
            <DetailField
              label={t("admin.payouts.fields.adminNotes.label")}
              value={item.adminNotes}
            />
          )}
          {item.walletAddress && (
            <CopyValue
              value={item.walletAddress}
              label={t("payout.fields.walletAddress.label")}
              copyLabel={t("admin.payouts.widget.copy")}
              copiedLabel={t("admin.payouts.widget.copied")}
            />
          )}
          <CopyValue
            value={item.id}
            label={t("admin.payouts.widget.reference")}
            copyLabel={t("admin.payouts.widget.copy")}
            copiedLabel={t("admin.payouts.widget.copied")}
          />
        </DetailGrid>
      </Div>
    );
  }

  const items = data?.items ?? [];
  const columns = [
    { id: "partner", label: t("admin.payouts.widget.col.partner") },
    { id: "requested", label: t("admin.payouts.widget.col.requested") },
    { id: "method", label: t("admin.payouts.widget.col.method") },
    { id: "status", label: t("admin.payouts.widget.col.status") },
    {
      id: "amount",
      label: t("admin.payouts.widget.col.amount"),
      numeric: true,
    },
    ...(canAct
      ? [{ id: "actions", label: t("admin.payouts.widget.col.actions") }]
      : []),
  ];
  function partnerCell(item: Payout): JSX.Element {
    return (
      <Div className="flex min-w-0 flex-col">
        <Span className="truncate font-medium">
          {item.partnerName ?? item.userEmail}
        </Span>
        {item.partnerName && (
          <Span className="truncate text-xs text-muted-foreground">
            {item.userEmail}
          </Span>
        )}
        {flagLine(item)}
      </Div>
    );
  }

  function dateCell(item: Payout): JSX.Element {
    return (
      <Span className="whitespace-nowrap text-muted-foreground">
        {formatDocDate(item.createdAt, locale)}
      </Span>
    );
  }

  function methodCell(item: Payout): JSX.Element {
    return <Span className="whitespace-nowrap">{t(item.currency)}</Span>;
  }

  function amountCell(item: Payout): JSX.Element {
    return <Span className="font-semibold">{money(item.amountCents)}</Span>;
  }

  const rows = items.map((item) => ({
    id: item.id,
    onOpen: (): void => setOpenId(openId === item.id ? null : item.id),
    expanded: openId === item.id ? details(item) : undefined,
    cells: {
      partner: partnerCell(item),
      requested: dateCell(item),
      method: methodCell(item),
      status: statusPill(item),
      amount: amountCell(item),
      actions: rowActions(item),
    },
  }));

  const compact = (
    <Div className="flex min-w-0 flex-col gap-2">
      {items.map((item) => (
        <Div
          key={item.id}
          className="flex min-w-0 flex-col gap-2 rounded-lg border bg-card p-3"
        >
          <Div className="flex min-w-0 items-start justify-between gap-3">
            <Div className="flex min-w-0 flex-col">
              <Span className="truncate text-sm font-semibold">
                {item.partnerName ?? item.userEmail}
              </Span>
              <Span className="truncate text-xs text-muted-foreground">
                {t("admin.payouts.widget.compactMeta", {
                  method: t(item.currency),
                  date: formatDocDate(item.createdAt, locale),
                })}
                {isText ? ` · ${money(item.amountCents)}` : ""}
              </Span>
            </Div>
            <Div className="flex shrink-0 flex-col items-end gap-1">
              {!isText && (
                <Span className="text-sm font-semibold tabular-nums">
                  {money(item.amountCents)}
                </Span>
              )}
              {statusPill(item)}
            </Div>
          </Div>
          {flagLine(item)}
          {(isText || openId === item.id) && details(item)}
          {canAct && (
            <Div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-muted-foreground"
                aria-expanded={openId === item.id}
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                {openId === item.id
                  ? t("admin.payouts.widget.hideDetails")
                  : t("admin.payouts.widget.showDetails")}
              </Button>
              {rowActions(item)}
            </Div>
          )}
        </Div>
      ))}
    </Div>
  );

  const allCount = (data?.summary ?? []).reduce(
    (sum, row) => sum + row.count,
    0,
  );
  const tabs: { value: typeof PayoutStatusValue | undefined; count: number }[] =
    [
      { value: undefined, count: allCount },
      ...TAB_ORDER.map((status) => ({
        value: status,
        count: summaryByStatus(data?.summary ?? [], status).count,
      })),
    ];
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(totalCount, page * pageSize);
  const scopedEmail = userId ? (items[0]?.userEmail ?? null) : null;

  return (
    <WidgetShell layout="page" className="min-w-0">
      <WidgetHeader
        size="page"
        title={t("admin.payouts.get.title")}
        subtitle={t("admin.payouts.widget.subtitle")}
        backButton={
          canAct ? (
            <NavigateButtonWidget field={children.backButton} />
          ) : undefined
        }
        actions={
          canAct ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              aria-label={t("admin.payouts.widget.refresh")}
              disabled={isFetching}
              onClick={() => {
                void read?.refetch();
              }}
            >
              <RefreshCw
                className={isFetching ? "size-4 animate-spin" : "size-4"}
              />
              <Span className="hidden @sm:inline">
                {t("admin.payouts.widget.refresh")}
              </Span>
            </Button>
          ) : undefined
        }
      />
      {userId && (
        <Div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <Span className="min-w-0 [overflow-wrap:anywhere]">
            {t("admin.payouts.widget.partnerScope", {
              email: scopedEmail ?? t("admin.payouts.fields.userId.label"),
            })}
          </Span>
          {canAct && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ms-auto h-8"
              onClick={() => {
                form.setValue("page", 1);
                form.setValue("userId", undefined);
              }}
            >
              {t("admin.payouts.widget.showAllPartners")}
            </Button>
          )}
        </Div>
      )}
      <FormAlertWidget field={{}} />
      <Div className="flex min-w-0 flex-col gap-3">
        {data && (
          <Div
            role="tablist" // oxlint-disable-line jsx-a11y/prefer-tag-over-role -- Shared UI has no cross-platform tablist component.
            ariaLabel={t("admin.payouts.fields.status.label")}
            className="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 pb-1"
          >
            {tabs.map(({ value, count }) => {
              const selected = activeStatus === value;
              const alert =
                count > 0 &&
                (value === PayoutStatus.PENDING ||
                  value === PayoutStatus.FAILED);
              return (
                <Button
                  key={value ?? "all"}
                  type="button"
                  size="sm"
                  role="tab"
                  aria-selected={selected}
                  variant={selected ? "secondary" : "ghost"}
                  className="h-9 shrink-0 gap-1.5"
                  disabled={!canAct}
                  onClick={() => setFilter("status", value)}
                >
                  {value ? t(value) : t("admin.payouts.widget.tabAll")}
                  <Span
                    className={
                      alert
                        ? value === PayoutStatus.FAILED
                          ? "rounded-full bg-destructive/10 px-1.5 text-xs tabular-nums text-destructive"
                          : "rounded-full bg-warning/15 px-1.5 text-xs tabular-nums text-warning"
                        : "rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground"
                    }
                  >
                    {count.toLocaleString(locale)}
                  </Span>
                </Button>
              );
            })}
          </Div>
        )}
        {canAct && (
          <Div className="flex min-w-0 flex-wrap items-center gap-2">
            <Div className="relative min-w-0 flex-1 basis-56 @md:max-w-sm">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                className="h-9 ps-8"
                aria-label={t("admin.payouts.fields.search.label")}
                placeholder={t("admin.payouts.widget.searchPlaceholder")}
                value={search}
                onChangeText={(value) => {
                  form.setValue("page", 1);
                  form.setValue("search", value || undefined);
                }}
              />
            </Div>
            <Select
              value={activeCurrency ?? ALL_METHODS}
              onValueChange={(value) =>
                setFilter("currency", value === ALL_METHODS ? undefined : value)
              }
            >
              <SelectTrigger
                className={
                  activeCurrency
                    ? "h-9 w-auto min-w-36 border-primary"
                    : "h-9 w-auto min-w-36"
                }
                aria-label={t("admin.payouts.fields.currency.label")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_METHODS}>
                  {t("admin.payouts.fields.currency.all")}
                </SelectItem>
                {PayoutCurrencyDB.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {t(currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtered && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9"
                onClick={clearFilters}
              >
                {t("admin.payouts.widget.clear")}
              </Button>
            )}
            {data && (
              <Span
                aria-live="polite"
                className="ms-auto text-sm tabular-nums text-muted-foreground"
              >
                {t("admin.payouts.widget.results", {
                  count: totalCount.toLocaleString(locale),
                })}
              </Span>
            )}
          </Div>
        )}
        {hasError && (
          <EmptyBlock
            icon={<AlertTriangle className="size-6" />}
            title={t("admin.payouts.widget.loadFailed")}
            message={response?.message}
            action={
              canAct
                ? {
                    label: t("admin.payouts.widget.retry"),
                    onClick: () => {
                      void read?.refetch();
                    },
                  }
                : undefined
            }
          />
        )}
        {!data && !hasError && (
          <LoadingBlock message={t("admin.payouts.widget.loading")} size="sm" />
        )}
        {data && !hasError && items.length === 0 && (
          <EmptyBlock
            icon={<Wallet className="size-6" />}
            title={
              filtered
                ? t("admin.payouts.widget.empty")
                : t("admin.payouts.widget.emptyAll")
            }
            message={
              filtered
                ? t("admin.payouts.widget.emptyHint")
                : t("admin.payouts.widget.emptyAllHint")
            }
            action={
              canAct && filtered
                ? {
                    label: t("admin.payouts.widget.clear"),
                    onClick: clearFilters,
                  }
                : undefined
            }
          />
        )}
        {data && !hasError && items.length > 0 && (
          <Div
            className={
              isFetching
                ? "min-w-0 opacity-60 transition-opacity"
                : "min-w-0 transition-opacity"
            }
          >
            <RecordTable
              label={t("admin.payouts.get.title")}
              columns={columns}
              rows={rows}
              compact={compact}
            />
          </Div>
        )}
        {data && !hasError && totalCount > 0 && (
          <Div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Span className="text-sm tabular-nums text-muted-foreground">
              {t("admin.payouts.widget.showing", {
                from: from.toLocaleString(locale),
                to: to.toLocaleString(locale),
                total: totalCount.toLocaleString(locale),
              })}
            </Span>
            {canAct && pageCount > 1 && (
              <Div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isFetching}
                  onClick={() => form.setValue("page", page - 1)}
                >
                  {t("admin.payouts.widget.previous")}
                </Button>
                <Span className="text-sm tabular-nums text-muted-foreground">
                  {t("admin.payouts.widget.page", {
                    page,
                    total: pageCount,
                  })}
                </Span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page >= pageCount || isFetching}
                  onClick={() => form.setValue("page", page + 1)}
                >
                  {t("admin.payouts.widget.next")}
                </Button>
              </Div>
            )}
          </Div>
        )}
      </Div>
    </WidgetShell>
  );
}

export function PayoutActionContainer({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const form = useWidgetForm<typeof definitions.POST>();
  const value = useWidgetValue<typeof definitions.POST>();
  const t = useWidgetTranslation<typeof definitions.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const responseOnly = useWidgetResponseOnly();
  const requestId = form?.watch("requestId");
  const action = form?.watch("action");
  const lookup = children.requestId.schema.safeParse(requestId);
  const lookupId = lookup.success ? lookup.data : undefined;
  const definitionsRead = useMemo(() => ({ GET: definitions.GET }), []);
  const options = useMemo(
    () => ({
      read: {
        initialState: {
          requestId: lookupId,
          userId: undefined,
          page: 1,
          limit: 1,
        },
        queryOptions: {
          enabled: Boolean(lookupId) && !responseOnly,
          refetchOnWindowFocus: false,
        },
      },
    }),
    [lookupId, responseOnly],
  );
  const { read } = useEndpoint(definitionsRead, options, logger, user);
  const payout = read.response?.success
    ? read.data?.items.find((item) => item.id === lookupId)
    : undefined;
  const allowedActions = payout ? getAdminPayoutActions(payout) : [];
  const allowed =
    !read.isFetching && Boolean(action && allowedActions.includes(action));

  const { pop, canGoBack } = useWidgetNavigation();
  const headerTitle =
    payout && action && allowedActions.includes(action)
      ? t(actionTitles[action])
      : t("admin.payouts.post.title");

  return (
    <WidgetShell className="gap-4">
      {!responseOnly && (
        <>
          <WidgetHeader
            title={headerTitle}
            backButton={<NavigateButtonWidget field={children.backButton} />}
          />
          {!payout && (
            <Div
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            >
              <TextFieldWidget
                fieldName="requestId"
                field={children.requestId}
              />
            </Div>
          )}
          {lookupId && read.isFetching && (
            <LoadingBlock message={t("admin.payouts.widget.loading")} />
          )}
          {lookupId && !read.isFetching && !payout && (
            <EmptyBlock
              title={t("admin.payouts.widget.lookupFailed")}
              message={read.error?.message ?? t("payout.errors.notFound")}
              action={{
                label: t("admin.payouts.widget.refresh"),
                onClick: () => {
                  void read.refetch();
                },
              }}
            />
          )}
          {payout && (
            <DetailGrid columns={2}>
              <DetailField
                label={t("admin.payouts.widget.col.partner")}
                value={payout.partnerName ?? payout.userEmail}
              />
              <DetailField
                label={t("admin.payouts.widget.state")}
                value={
                  <StatusPill
                    status={t(payout.status)}
                    variant={statusVariants[payout.status]}
                  />
                }
              />
              <DetailField
                label={t("admin.payouts.widget.valueLabel")}
                value={formatPayoutValue(payout, locale, t)}
              />
              <DetailField
                label={t("admin.payouts.widget.destinationLabel")}
                value={t(payout.currency)}
              />
              {payout.walletAddress && (
                <DetailField
                  className="@sm:col-span-2"
                  label={t("payout.fields.walletAddress.label")}
                  value={payout.walletAddress}
                  mono
                  copyable
                  copyLabel={t("admin.payouts.widget.copy")}
                />
              )}
            </DetailGrid>
          )}
          {payout && allowedActions.length > 1 && (
            <SelectFieldWidget
              fieldName="action"
              field={{
                ...children.action,
                options: children.action.options.filter((option) =>
                  allowedActions.includes(option.value),
                ),
              }}
            />
          )}
          {payout &&
            (!allowedActions.length ||
              Boolean(action && !allowedActions.includes(action))) && (
              <Span className="text-sm text-muted-foreground">
                {t("payout.errors.invalidStatus")}
              </Span>
            )}
          {allowed && action && (
            <>
              <Span className="text-sm text-muted-foreground">
                {t(actionDescriptions[action])}
              </Span>
              {action === "reject" ? (
                <TextFieldWidget
                  fieldName="rejectionReason"
                  field={children.rejectionReason}
                />
              ) : (
                <TextFieldWidget
                  fieldName="adminNotes"
                  field={children.adminNotes}
                />
              )}
              <Div className="flex flex-wrap items-center justify-end gap-2">
                {canGoBack && (
                  <Button type="button" variant="ghost" onClick={() => pop()}>
                    {t("admin.payouts.widget.cancel")}
                  </Button>
                )}
                <SubmitButtonWidget<typeof definitions.POST>
                  field={children.submitButton}
                  label={action ? t(actionTitles[action]) : undefined}
                  variant={action === "reject" ? "destructive" : "default"}
                />
              </Div>
            </>
          )}
        </>
      )}
      <FormAlertWidget field={{}} />
      {value?.message && <Alert variant="success">{value.message}</Alert>}
    </WidgetShell>
  );
}

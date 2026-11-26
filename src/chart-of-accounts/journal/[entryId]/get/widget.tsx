"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { JournalEntryStatus, JournalSourceType, LineType } from "../../../enum";
import { formatJournalCurrency } from "../../../shared/journal-presentation";
import {
  journalAmountUnits,
  journalLineType,
} from "../../../shared/journal-validation";
import type definition from "./definition";
import type { CoaJournalEntryGetResponseOutput } from "./definition";
import { supplierJournalCopy } from "./i18n/supplier-journal";

type JournalLine = NonNullable<
  CoaJournalEntryGetResponseOutput["result"]
>["lines"][number];

// Double-entry row: shows debit OR credit in the correct column
function JournalLineRow({
  line,
  onAccountClick,
  locale,
}: {
  line: JournalLine;
  locale: string;
  onAccountClick: (accountId: string) => void;
}): JSX.Element {
  const side = journalLineType(line.lineType);
  const account = [line.accountCode, line.accountName]
    .filter(Boolean)
    .join(" ");
  const units = journalAmountUnits(line.amount);
  const display =
    units === null
      ? formatMoney(line.amount, line.currency, locale)
      : formatJournalCurrency(units, line.currency, locale);
  return (
    <Div className="grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,0.6fr)_minmax(5.5rem,0.6fr)] @md:grid-cols-[minmax(0,1fr)_10rem_10rem] gap-0 border-b last:border-b-0 hover:bg-muted/20">
      {/* Account identifier — code if available, else short UUID */}
      <Div className="flex flex-col justify-center px-2 py-2 @md:px-4 border-r gap-0.5">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto justify-start p-0 text-left whitespace-normal"
          onClick={() => onAccountClick(line.accountId)}
        >
          {account || line.accountId}
        </Button>
        {line.lineDescription && (
          <Span className="text-xs text-muted-foreground truncate italic">
            {line.lineDescription}
          </Span>
        )}
      </Div>

      {/* Debit column */}
      <Div className="flex items-center justify-end px-2 py-2 @md:px-4 border-r">
        {side === LineType.DEBIT && (
          <Span className="min-w-0 text-right text-sm font-medium tabular-nums [overflow-wrap:anywhere]">
            {display}
          </Span>
        )}
      </Div>

      {/* Credit column */}
      <Div className="flex items-center justify-end px-2 py-2 @md:px-4">
        {side === LineType.CREDIT && (
          <Span className="min-w-0 text-right text-sm font-medium tabular-nums [overflow-wrap:anywhere]">
            {display}
          </Span>
        )}
      </Div>
    </Div>
  );
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  POSTED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  REVERSED: "bg-muted text-muted-foreground",
};

const SOURCE_BADGE_CLASS: Record<string, string> = {
  MANUAL: "bg-muted text-muted-foreground",
  AR_INVOICE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  AR_PAYMENT: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  POS_ORDER:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  AP_BILL:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

const REVERSAL_BADGE_CLASS = "bg-accent text-accent-foreground";

function InlineBadge({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}): JSX.Element {
  return (
    <Span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${colorClass}`}
    >
      {label}
    </Span>
  );
}

export function CoaJournalEntryGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: supplierT } = supplierJournalCopy.scopedT(locale);
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();

  const entry = data?.result;

  const openSupplierBill = (billId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("@/payment/bill/[billId]/get/definition");
      navigation.push(def.default.GET, { urlPathParams: { billId } });
    })();
  };

  const openJournal = (entryId: string): void => {
    void import("./definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.GET, { urlPathParams: { entryId } }),
    );
  };

  const handleAccountClick = (accountId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../../ledger/[accountId]/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { accountId },
      });
    })();
  };

  const handlePost = (): void => {
    if (!entry?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../post/definition");
      const details = await import("./definition");
      const entryId = entry.id;
      navigation.push(def.default.POST, {
        urlPathParams: { entryId },
        replaceOnSuccess: {
          endpoint: details.default.GET,
          getUrlPathParams: () => ({ entryId }),
        },
      });
    })();
  };

  const handleReverse = (): void => {
    if (!entry?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../reverse/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { entryId: entry.id },
      });
    })();
  };

  if (!entry) {
    return (
      <Div className="flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("journalEntryGet.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="entryId"
          field={field.children.entryId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "journalEntryGet.widget.select" as const }}
        />
      </Div>
    );
  }

  const totals = new Map<
    string,
    { debits: bigint; credits: bigint; valid: boolean }
  >();
  for (const line of entry.lines) {
    const total = totals.get(line.currency) ?? {
      debits: BigInt(0),
      credits: BigInt(0),
      valid: true,
    };
    const side = journalLineType(line.lineType);
    const units = journalAmountUnits(line.amount);
    if (units === null || side === null) {
      total.valid = false;
    } else if (side === LineType.DEBIT) {
      total.debits += units;
    } else {
      total.credits += units;
    }
    totals.set(line.currency, total);
  }

  const status = Object.values(JournalEntryStatus).find(
    (key) => key === entry.status || key.endsWith(`.${entry.status}`),
  );
  const source = Object.values(JournalSourceType).find(
    (key) => key === entry.sourceType || key.endsWith(`.${entry.sourceType}`),
  );
  const bill = entry.supplierBill;
  const billPostingTitle = bill && supplierT(bill.posting);
  const billLabel = bill?.number
    ? new Intl.ListFormat(locale, { style: "short", type: "unit" }).format([
        bill.number,
        bill.supplierName,
      ])
    : bill?.supplierName;
  const statusBadgeClass =
    STATUS_BADGE_CLASS[status?.split(".").at(-1) ?? ""] ??
    "bg-muted text-muted-foreground";
  const sourceBadgeClass =
    SOURCE_BADGE_CLASS[source?.split(".").at(-1) ?? ""] ??
    "bg-muted text-muted-foreground";

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={entry.entryNumber}
        subtitle={
          bill?.systemDescription ? billPostingTitle : entry.description
        }
        titleAccessory={
          <Div className="flex flex-wrap items-center gap-2">
            {status && (
              <InlineBadge label={t(status)} colorClass={statusBadgeClass} />
            )}
            {entry.reversalOfId && (
              <InlineBadge
                label={t("journalEntryGet.widget.reversalBadge")}
                colorClass={REVERSAL_BADGE_CLASS}
              />
            )}
          </Div>
        }
        backButton={
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("journalEntryGet.widget.back")}
            </Button>
          )
        }
      />
      <Div className="flex flex-col gap-2">
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="text-sm text-muted-foreground">
            {formatDocDate(entry.date, locale)}
          </Span>
          {source && !bill?.systemDescription && (
            <InlineBadge
              label={billPostingTitle ?? t(source)}
              colorClass={sourceBadgeClass}
            />
          )}
        </Div>

        {entry.linkedEntries?.map((link) => {
          const relationship = t(
            link.relation === "original"
              ? "journalEntryGet.widget.originalEntry"
              : "journalEntryGet.widget.reversingEntry",
          );
          return (
            <Div
              key={link.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
            >
              <Span className="font-medium">{relationship}</Span>
              {isInteractive && !responseOnly ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-9 max-w-full whitespace-normal px-2 text-start text-foreground [overflow-wrap:anywhere]"
                  aria-label={`${relationship} ${link.entryNumber}`}
                  onClick={() => openJournal(link.id)}
                >
                  {link.entryNumber}
                </Button>
              ) : (
                <Span className="[overflow-wrap:anywhere]">
                  {link.entryNumber}
                </Span>
              )}
            </Div>
          );
        })}
        {entry.reversalOfId &&
          entry.lines.some((line) => line.lineDescription) && (
            <Span className="text-sm text-muted-foreground">
              {t("journalEntryGet.widget.originalLineNotes")}
            </Span>
          )}

        {/* Memo */}
        {entry.memo && (
          <Span className="text-xs text-muted-foreground italic">
            {entry.memo}
          </Span>
        )}

        {bill && billLabel ? (
          <Div className="flex min-w-0 flex-col items-start gap-1">
            <Span className="text-sm text-muted-foreground">
              {supplierT("sourceBill")}
            </Span>
            {isInteractive && !responseOnly ? (
              <Button
                type="button"
                variant="link"
                className="h-auto min-h-11 max-w-full justify-start whitespace-normal p-0 text-left"
                onClick={() => openSupplierBill(bill.id)}
              >
                {billLabel}
              </Button>
            ) : (
              <Span className="text-sm [overflow-wrap:anywhere]">
                {billLabel}
              </Span>
            )}
          </Div>
        ) : (
          entry.sourceId && (
            <Span className="text-xs text-muted-foreground font-mono">
              {t("journalEntryGet.response.sourceId")}: {entry.sourceId}
            </Span>
          )
        )}
      </Div>

      {/* Double-entry table */}
      {entry.lines.length > 0 && (
        <Div className="rounded-md border overflow-hidden">
          {/* Column headers */}
          <Div className="grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,0.6fr)_minmax(5.5rem,0.6fr)] @md:grid-cols-[minmax(0,1fr)_10rem_10rem] gap-0 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Span className="px-2 py-2 @md:px-4 border-r">
              {t("journalCreate.widget.account")}
            </Span>
            <Span className="px-2 py-2 @md:px-4 text-right border-r">
              {t("enums.lineType.DEBIT")}
            </Span>
            <Span className="px-2 py-2 @md:px-4 text-right">
              {t("enums.lineType.CREDIT")}
            </Span>
          </Div>

          {/* Entry lines */}
          {entry.lines.map((line) => (
            <JournalLineRow
              key={line.lineId}
              line={line}
              onAccountClick={handleAccountClick}
              locale={locale}
            />
          ))}

          {[...totals].map(([currency, total]) => {
            const balanced = total.valid && total.debits === total.credits;
            return (
              <Div
                key={currency}
                className="grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,0.6fr)_minmax(5.5rem,0.6fr)] border-t-2 bg-muted/30 @md:grid-cols-[minmax(0,1fr)_10rem_10rem]"
              >
                <Div className="flex flex-wrap items-center gap-2 border-r px-2 py-2 @md:px-4">
                  <Span className="text-xs font-semibold">{currency}</Span>
                  <Badge
                    variant={balanced ? "outline" : "destructive"}
                    className="text-xs"
                  >
                    {balanced
                      ? t("journalEntryGet.widget.balancedLabel")
                      : t("journalEntryGet.widget.notBalancedLabel")}
                  </Badge>
                </Div>
                <Div className="flex items-center justify-end border-r px-2 py-2 @md:px-4">
                  <Span className="min-w-0 text-right text-sm font-semibold tabular-nums [overflow-wrap:anywhere]">
                    {formatJournalCurrency(total.debits, currency, locale)}
                  </Span>
                </Div>
                <Div className="flex items-center justify-end px-2 py-2 @md:px-4">
                  <Span className="min-w-0 text-right text-sm font-semibold tabular-nums [overflow-wrap:anywhere]">
                    {formatJournalCurrency(total.credits, currency, locale)}
                  </Span>
                </Div>
              </Div>
            );
          })}
        </Div>
      )}

      {/* Action buttons */}
      <Div className="flex gap-2 flex-wrap">
        {(entry.status === JournalEntryStatus.DRAFT ||
          entry.status === "DRAFT") && (
          <Button variant="default" size="sm" onClick={handlePost}>
            {t("journalEntryGet.widget.postButton")}
          </Button>
        )}
        {(entry.status === JournalEntryStatus.POSTED ||
          entry.status === "POSTED") &&
          (entry.sourceType === JournalSourceType.MANUAL ||
            entry.sourceType === "MANUAL") && (
            <Button variant="outline" size="sm" onClick={handleReverse}>
              {t(
                entry.reversalOfId
                  ? "journalEntryGet.widget.reverseReversal"
                  : "journalEntryGet.widget.reverseButton",
              )}
            </Button>
          )}
      </Div>
    </WidgetShell>
  );
}

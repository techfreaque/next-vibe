"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";
import type { CoaJournalEntryGetResponseOutput } from "./definition";

type JournalLine = NonNullable<
  CoaJournalEntryGetResponseOutput["result"]
>["lines"][number];

function formatMoney(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(d: Date | string): string {
  if (d instanceof Date) {
    return d.toLocaleDateString();
  }
  return String(d).slice(0, 10);
}

// Double-entry row: shows debit OR credit in the correct column
function JournalLineRow({
  line,
  onAccountClick,
}: {
  line: JournalLine;
  onAccountClick: (accountId: string) => void;
}): JSX.Element {
  const isDebit = line.lineType === "DEBIT";
  return (
    <Div className="grid grid-cols-[1fr_9rem_9rem] gap-0 border-b last:border-b-0 hover:bg-muted/20">
      {/* Account identifier — code if available, else short UUID */}
      <Div className="flex flex-col justify-center px-4 py-2 border-r gap-0.5">
        <Span
          className="text-xs font-mono text-primary underline cursor-pointer truncate block max-w-[12rem] hover:text-primary/70"
          onClick={(): void => {
            onAccountClick(line.accountId);
          }}
        >
          {line.accountId}
        </Span>
        {line.lineDescription && (
          <Span className="text-xs text-muted-foreground truncate italic">
            {line.lineDescription}
          </Span>
        )}
      </Div>

      {/* Debit column */}
      <Div className="flex items-center justify-end px-4 py-2 border-r">
        {isDebit && (
          <Span className="font-mono text-sm font-medium text-amber-600 dark:text-amber-400 tabular-nums">
            {formatMoney(line.amount)}
          </Span>
        )}
      </Div>

      {/* Credit column */}
      <Div className="flex items-center justify-end px-4 py-2">
        {!isDebit && (
          <Span className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatMoney(line.amount)}
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

  const entry = data?.result;

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
      navigation.push(def.default.POST, {
        data: { entryId: entry.id },
        popNavigationOnSuccess: 1,
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
        data: { entryId: entry.id },
        popNavigationOnSuccess: 1,
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

  const totalDebits = entry.lines
    .filter((l) => l.lineType === "DEBIT")
    .reduce((s, l) => s + l.amount, 0);
  const totalCredits = entry.lines
    .filter((l) => l.lineType === "CREDIT")
    .reduce((s, l) => s + l.amount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const statusBadgeClass =
    STATUS_BADGE_CLASS[entry.status] ?? "bg-muted text-muted-foreground";
  const sourceBadgeClass =
    SOURCE_BADGE_CLASS[entry.sourceType] ?? "bg-muted text-muted-foreground";

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
      {/* Header card */}
      <Div className="rounded-md border p-4 flex flex-col gap-3">
        {/* Entry number, date, badges */}
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="font-mono text-sm font-bold text-foreground">
            {entry.entryNumber}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {formatDate(entry.date)}
          </Span>
          <InlineBadge
            label={t(
              `enums.journalEntryStatus.${entry.status}` as Parameters<
                typeof t
              >[0],
            )}
            colorClass={statusBadgeClass}
          />
          <InlineBadge
            label={t(
              `enums.journalSourceType.${entry.sourceType}` as Parameters<
                typeof t
              >[0],
            )}
            colorClass={sourceBadgeClass}
          />
        </Div>

        {/* Description */}
        {entry.description && (
          <Span className="text-base font-semibold">{entry.description}</Span>
        )}

        {/* Memo */}
        {entry.memo && (
          <Span className="text-xs text-muted-foreground italic">
            {entry.memo}
          </Span>
        )}

        {/* Source reference */}
        {entry.sourceId && (
          <Span className="text-xs text-muted-foreground font-mono">
            {t("journalEntryGet.response.sourceId")}: {entry.sourceId}
          </Span>
        )}
      </Div>

      {/* Double-entry table */}
      {entry.lines.length > 0 && (
        <Div className="rounded-md border overflow-hidden">
          {/* Column headers */}
          <Div className="grid grid-cols-[1fr_9rem_9rem] gap-0 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Span className="px-4 py-2 border-r">
              {t("journalEntryGet.response.accountId")}
            </Span>
            <Span className="px-4 py-2 text-right border-r text-amber-700 dark:text-amber-400">
              {t("enums.lineType.DEBIT")}
            </Span>
            <Span className="px-4 py-2 text-right text-emerald-700 dark:text-emerald-400">
              {t("enums.lineType.CREDIT")}
            </Span>
          </Div>

          {/* Entry lines */}
          {entry.lines.map((line) => (
            <JournalLineRow
              key={line.lineId}
              line={line}
              onAccountClick={handleAccountClick}
            />
          ))}

          {/* Totals row — separator line */}
          <Div className="grid grid-cols-[1fr_9rem_9rem] gap-0 border-t-2 bg-muted/30">
            <Div className="px-4 py-2 border-r flex items-center gap-2">
              <Span className="text-xs font-semibold">
                {t("journalEntryGet.widget.totalDebits")} /{" "}
                {t("journalEntryGet.widget.totalCredits")}
              </Span>
              {!isBalanced && (
                <Badge variant="destructive" className="text-xs py-0">
                  {t("journalEntryGet.widget.notBalancedLabel")}
                </Badge>
              )}
              {isBalanced && (
                <Badge
                  variant="default"
                  className="text-xs py-0 bg-emerald-600 dark:bg-emerald-700"
                >
                  {t("journalEntryGet.widget.balancedLabel")}
                </Badge>
              )}
            </Div>
            <Div className="px-4 py-2 flex items-center justify-end border-r">
              <Span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {formatMoney(totalDebits)}
              </Span>
            </Div>
            <Div className="px-4 py-2 flex items-center justify-end">
              <Span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatMoney(totalCredits)}
              </Span>
            </Div>
          </Div>
        </Div>
      )}

      {/* Action buttons */}
      <Div className="flex gap-2 flex-wrap">
        {entry.status === "DRAFT" && (
          <Button variant="default" size="sm" onClick={handlePost}>
            {t("journalEntryGet.widget.postButton")}
          </Button>
        )}
        {entry.status === "POSTED" && (
          <Button variant="outline" size="sm" onClick={handleReverse}>
            {t("journalEntryGet.widget.reverseButton")}
          </Button>
        )}
      </Div>
    </Div>
  );
}

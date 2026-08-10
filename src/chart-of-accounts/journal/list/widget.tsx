"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useRef } from "react";

import type definition from "./definition";
import type { CoaJournalListResponseOutput } from "./definition";

type JournalEntry = NonNullable<
  CoaJournalListResponseOutput["entries"]
>[number];

// Status — yellow/green/muted
const STATUS_BADGE_CLASS: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  POSTED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  REVERSED: "bg-muted text-muted-foreground",
};

// Source type — contextual colors
const SOURCE_BADGE_CLASS: Record<string, string> = {
  MANUAL: "bg-muted text-muted-foreground",
  AR_INVOICE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  AR_PAYMENT: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  POS_ORDER:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  AP_BILL:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  AP_PAYMENT:
    "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  TAX_PAYMENT:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  PERIOD_CLOSE: "bg-muted text-muted-foreground",
  CREDIT_TRANSACTION:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
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

function JournalEntryRow({
  entry,
  onView,
  statusLabel,
  sourceTypeLabel,
}: {
  entry: JournalEntry;
  onView: (id: string) => void;
  statusLabel: string;
  sourceTypeLabel: string;
}): JSX.Element {
  return (
    <Div
      className="flex items-center gap-3 py-2.5 px-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => {
        onView(entry.id);
      }}
    >
      {/* Left: number + date + description */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Div className="flex items-center gap-2">
          <Span className="text-xs font-mono font-semibold text-muted-foreground shrink-0">
            {entry.entryNumber}
          </Span>
          <Span className="text-xs text-muted-foreground shrink-0">
            {entry.date.toISOString().slice(0, 10)}
          </Span>
        </Div>
        <Span className="text-sm font-medium truncate text-foreground">
          {entry.description}
        </Span>
      </Div>

      {/* Right: source + status badges */}
      <Div className="flex items-center gap-1.5 shrink-0">
        <InlineBadge
          label={sourceTypeLabel}
          colorClass={
            SOURCE_BADGE_CLASS[entry.sourceType] ??
            "bg-muted text-muted-foreground"
          }
        />
        <InlineBadge
          label={statusLabel}
          colorClass={
            STATUS_BADGE_CLASS[entry.status] ?? "bg-muted text-muted-foreground"
          }
        />
      </Div>
    </Div>
  );
}

export function CoaJournalListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["entries"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  // Auto-load on mount — companyId is optional, backend returns all companies
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (!onSubmit || didAutoSubmit.current) {
      return;
    }
    didAutoSubmit.current = true;
    onSubmit();
  }, [onSubmit]);

  const handleView = (entryId: string): void => {
    if (isPickerMode) {
      const entry = (data?.entries ?? []).find((e) => e.id === entryId);
      if (entry && onPick) {
        onPick(entry);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[entryId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  const handlePeriods = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../period/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const statusLabels: Record<string, string> = {
    DRAFT: t("enums.journalEntryStatus.DRAFT"),
    POSTED: t("enums.journalEntryStatus.POSTED"),
    REVERSED: t("enums.journalEntryStatus.REVERSED"),
  };

  const sourceTypeLabels: Record<string, string> = {
    MANUAL: t("enums.journalSourceType.MANUAL"),
    AR_INVOICE: t("enums.journalSourceType.AR_INVOICE"),
    AR_PAYMENT: t("enums.journalSourceType.AR_PAYMENT"),
    AP_BILL: t("enums.journalSourceType.AP_BILL"),
    AP_PAYMENT: t("enums.journalSourceType.AP_PAYMENT"),
    POS_ORDER: t("enums.journalSourceType.POS_ORDER"),
    TAX_PAYMENT: t("enums.journalSourceType.TAX_PAYMENT"),
    PERIOD_CLOSE: t("enums.journalSourceType.PERIOD_CLOSE"),
    CREDIT_TRANSACTION: t("enums.journalSourceType.CREDIT_TRANSACTION"),
  };

  // Loading state
  if (!data) {
    return (
      <Div className="flex flex-col items-center gap-4 py-10 rounded-lg border border-dashed">
        <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("journalList.widget.loading")}
        </Span>
      </Div>
    );
  }

  const entries = data.entries ?? [];

  return (
    <Div className="flex flex-col gap-4">
      {/* Header bar */}
      <Div className="flex items-center justify-between gap-2">
        <Span className="text-sm text-muted-foreground">
          {data.totalCount ?? entries.length}{" "}
          {t("journalList.response.entries")}
        </Span>
        {!isPickerMode && (
          <Div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePeriods}>
              {t("journalList.widget.periodsButton")}
            </Button>
            <Button variant="default" size="sm" onClick={handleCreate}>
              {t("journalList.widget.createButton")}
            </Button>
          </Div>
        )}
      </Div>

      {/* Entries list or empty state */}
      {entries.length > 0 ? (
        <Div className="rounded-md border overflow-hidden">
          {/* Column headers */}
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
            <Div className="flex-1 min-w-0">
              <Span>
                {t("journalList.response.entryNumber")} /{" "}
                {t("journalList.response.description")}
              </Span>
            </Div>
            <Span className="shrink-0">
              {t("journalList.response.sourceType")} /{" "}
              {t("journalList.response.status")}
            </Span>
          </Div>

          {entries.map((entry) => (
            <JournalEntryRow
              key={entry.id}
              entry={entry}
              onView={handleView}
              statusLabel={statusLabels[entry.status] ?? entry.status}
              sourceTypeLabel={
                sourceTypeLabels[entry.sourceType] ?? entry.sourceType
              }
            />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col items-center gap-3 py-12 text-center border border-dashed rounded-md">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("journalList.widget.empty")}
          </Span>
          {!isPickerMode && (
            <Button variant="default" size="sm" onClick={handleCreate}>
              {t("journalList.widget.createButton")}
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}

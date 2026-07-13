"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

function formatMoney(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaJournalCreateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();

  const handleViewEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[entryId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  const handlePost = (entryId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[entryId]/post/definition");
      navigation.push(def.default.POST, {
        data: { entryId },
        popNavigationOnSuccess: 2,
      });
    })();
  };

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("journalCreate.success.title")}
          </Span>
          <Div className="flex items-center gap-2 mt-1">
            <Span className="font-mono text-sm font-bold text-foreground">
              {data.entryNumber}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("journalCreate.widget.savedAsDraft")}
            </Span>
          </Div>
        </Div>
        <Div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              handlePost(data.id);
            }}
          >
            {t("journalCreate.widget.postNowButton")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleViewEntry(data.id);
            }}
          >
            {t("journalCreate.widget.viewEntryButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  // Show balance indicator below the form
  // Read live form values to compute real debit/credit totals
  const lines = form.watch("lines") ?? [];
  const debitTotal = lines.reduce(
    (sum, line) =>
      line?.type === "DEBIT" ? sum + (Number(line.amount) || 0) : sum,
    0,
  );
  const creditTotal = lines.reduce(
    (sum, line) =>
      line?.type === "CREDIT" ? sum + (Number(line.amount) || 0) : sum,
    0,
  );
  const diff = Math.abs(debitTotal - creditTotal);
  const isBalanced = diff < 0.01;

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
          {t("journalCreate.widget.back")}
        </Button>
      )}
      <FormAlertWidget field={{}} />

      {/* Balance indicator */}
      <Div className="rounded-md border p-3 bg-muted/30">
        <Div className="flex items-center justify-between gap-4 text-sm">
          <Div className="flex items-center gap-4">
            <Div className="flex flex-col">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("journalCreate.widget.totalDebits")}
              </Span>
              <Span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {formatMoney(debitTotal)}
              </Span>
            </Div>
            <Span className="text-muted-foreground" aria-hidden="true" />
            <Div className="flex flex-col">
              <Span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("journalCreate.widget.totalCredits")}
              </Span>
              <Span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {formatMoney(creditTotal)}
              </Span>
            </Div>
          </Div>
          <Span
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${
              isBalanced
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
            }`}
          >
            {isBalanced
              ? t("journalCreate.widget.balanced")
              : `${t("journalCreate.widget.difference")}: ${formatMoney(diff)}`}
          </Span>
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

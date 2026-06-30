"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe-ui/unified/form-fields/date-field/widget";
import type { JSX } from "react";

import { LineType } from "../../enum";
import { scopedTranslation as coaScopedTranslation } from "../../i18n";
import type definition from "./definition";
import type { CoaLedgerResponseOutput } from "./definition";

type LedgerLine = NonNullable<CoaLedgerResponseOutput["lines"]>[number];

export function CoaLedgerWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const { t: tCoa } = coaScopedTranslation.scopedT(locale);

  // accountId lives in urlPathParams, not form data — read from navigation context
  const currentEntry = navigation.current;
  const hasAccountId =
    !!currentEntry?.params?.urlPathParams &&
    "accountId" in currentEntry.params.urlPathParams &&
    !!currentEntry.params.urlPathParams.accountId;

  const handleEntryClick = (entryId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../journal/[entryId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  const formatAmount = (n: number, currency?: string | null): string => {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
    return currency ? `${formatted} ${currency}` : formatted;
  };

  const isLoading = !data && hasAccountId;

  return (
    <Div className="flex flex-col gap-4">
      {/* Back */}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("ledger.widget.back")}
        </Button>
      )}

      {/* Title */}
      <Div className="flex items-center justify-between flex-wrap gap-2">
        <Span className="text-base font-bold">{t("ledger.title")}</Span>
        {data?.totalCount !== undefined && (
          <Span className="text-xs text-muted-foreground">
            {data.totalCount} {t("ledger.widget.totalCount")}
          </Span>
        )}
      </Div>

      {/* Date filters */}
      <Div className="flex gap-3 flex-wrap">
        <Div className="flex-1 min-w-32">
          <DateFieldWidget
            fieldName="dateFrom"
            field={withValue(_props.field.children.dateFrom, undefined, null)}
          />
        </Div>
        <Div className="flex-1 min-w-32">
          <DateFieldWidget
            fieldName="dateTo"
            field={withValue(_props.field.children.dateTo, undefined, null)}
          />
        </Div>
      </Div>

      {/* No account selected */}
      {!hasAccountId && !data && (
        <Div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-md">
          {t("ledger.widget.noAccount")}
        </Div>
      )}

      {/* Loading */}
      {isLoading && (
        <Div className="py-12 text-center text-sm text-muted-foreground">
          {t("ledger.widget.loading")}
        </Div>
      )}

      {/* Results */}
      {data?.lines !== undefined && (
        <Div className="flex flex-col gap-2">
          {data.lines.length === 0 ? (
            <Div className="py-10 text-center text-sm text-muted-foreground border border-dashed rounded-md">
              {t("ledger.widget.empty")}
            </Div>
          ) : (
            <Div className="rounded-md border overflow-hidden">
              {/* Column headers */}
              <Div className="grid grid-cols-[5rem_1fr_4.5rem_8rem_8rem] gap-2 px-3 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
                <Span>{t("ledger.response.date")}</Span>
                <Span>{t("ledger.response.description")}</Span>
                <Span>{t("ledger.response.type")}</Span>
                <Span className="text-right">
                  {t("ledger.response.amount")}
                </Span>
                <Span className="text-right">
                  {t("ledger.widget.runningBalance")}
                </Span>
              </Div>

              {data.lines.map((line: LedgerLine) => {
                const isDebit = line.type === LineType.DEBIT;
                return (
                  <Div
                    key={line.id}
                    className="grid grid-cols-[5rem_1fr_4.5rem_8rem_8rem] gap-2 px-3 py-2 border-b last:border-b-0 text-sm hover:bg-muted/20"
                  >
                    <Span className="text-xs text-muted-foreground font-mono">
                      {line.date.toISOString().slice(0, 10)}
                    </Span>
                    <Span
                      className="truncate text-xs text-primary underline cursor-pointer hover:text-primary/70"
                      onClick={() => handleEntryClick(line.entryId)}
                    >
                      {line.description ?? line.entryNumber}
                    </Span>
                    <Span
                      className={`text-xs font-medium ${
                        isDebit
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {tCoa(line.type as Parameters<typeof tCoa>[0])}
                    </Span>
                    <Span
                      className={`text-right font-mono text-xs ${
                        isDebit
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatAmount(line.amount, line.currency)}
                    </Span>
                    <Span className="text-right font-mono text-xs font-medium">
                      {formatAmount(line.runningBalance)}
                    </Span>
                  </Div>
                );
              })}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

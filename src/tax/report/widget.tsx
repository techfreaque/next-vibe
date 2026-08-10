"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { TaxReportResponseOutput } from "./definition";

type TaxRow = NonNullable<TaxReportResponseOutput["rows"]>[number];

function TaxReportRow({
  row,
  locale,
}: {
  row: TaxRow;
  locale: CountryLanguage;
}): JSX.Element {
  const fmt = (n: number): string =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <Div className="grid grid-cols-[6rem_1fr_9rem_9rem] gap-2 px-4 py-2.5 border-b last:border-b-0 hover:bg-muted/20 text-sm">
      <Span className="text-xs font-mono text-muted-foreground self-center">
        {row.period}
      </Span>
      <Div className="flex flex-col gap-0.5 min-w-0 self-center">
        <Span className="font-medium truncate">{row.taxRateName}</Span>
        <Span className="text-xs text-muted-foreground font-mono">
          {row.taxRateCode}
        </Span>
      </Div>
      <Span className="text-right font-mono text-sm text-muted-foreground self-center">
        {fmt(row.taxableAmount)}
      </Span>
      <Span className="text-right font-mono text-sm font-semibold self-center">
        {fmt(row.taxAmount)}
      </Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxReportWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  const fmt = (n: number): string =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const totalTax = data?.rows?.reduce((sum, row) => sum + row.taxAmount, 0);
  const totalTaxable = data?.rows?.reduce(
    (sum, row) => sum + row.taxableAmount,
    0,
  );

  const labelPeriod = t("report.response.row.period");
  const labelRate = t("report.widget.columnRate");
  const labelTaxable = t("report.response.row.taxableAmount");
  const labelTax = t("report.response.row.taxAmount");
  const labelTotal = t("report.widget.total");
  const labelEmpty = t("report.widget.empty");

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.GET> field={{}} />

      {data?.rows !== undefined && (
        <Div className="flex flex-col gap-2">
          {data.rows.length > 0 ? (
            <Div className="rounded-md border overflow-hidden">
              <Div className="grid grid-cols-[6rem_1fr_9rem_9rem] gap-2 px-4 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
                <Span>{labelPeriod}</Span>
                <Span>{labelRate}</Span>
                <Span className="text-right">{labelTaxable}</Span>
                <Span className="text-right">{labelTax}</Span>
              </Div>
              {data.rows.map((row, idx) => (
                <TaxReportRow
                  key={`${row.period}-${row.taxRateCode}-${idx}`}
                  row={row}
                  locale={locale}
                />
              ))}
              {(totalTaxable !== undefined || totalTax !== undefined) && (
                <Div className="grid grid-cols-[6rem_1fr_9rem_9rem] gap-2 px-4 py-2.5 bg-muted/30 border-t text-sm font-semibold">
                  <Span />
                  <Span>{labelTotal}</Span>
                  <Span className="text-right font-mono">
                    {totalTaxable !== undefined ? fmt(totalTaxable) : ""}
                  </Span>
                  <Span className="text-right font-mono">
                    {totalTax !== undefined ? fmt(totalTax) : ""}
                  </Span>
                </Div>
              )}
            </Div>
          ) : (
            <Div className="text-center py-8 text-sm text-muted-foreground">
              {labelEmpty}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

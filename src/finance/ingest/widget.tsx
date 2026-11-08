/**
 * Finance Ingest Widget (web, CLI, MCP, AI, native)
 * Scope + dry-run form; result lists each source with status/reason, the
 * margin per day and the alerts the run raised or suppressed.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function FinanceIngestContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = useWidgetValue<typeof definition.POST>();
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={t("ingest.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
      />
      <P className="text-sm text-muted-foreground">{t("ingest.widget.hint")}</P>
      <Div className="grid grid-cols-3 items-end gap-3">
        <SelectFieldWidget fieldName="scope" field={children.scope} />
        <NumberFieldWidget fieldName="windowDays" field={children.windowDays} />
        <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      </Div>
      <FormAlertWidget field={{}} />
      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "ingest.widget.submit",
            loadingText: "ingest.widget.submitting",
            icon: "refresh-cw",
            variant: "primary",
            size: "sm",
          }}
        />
      </Div>

      {result !== null && result !== undefined && "sources" in result && (
        <Div className="flex flex-col gap-4">
          <SectionGroup
            title={
              result.dryRunResult
                ? t("ingest.widget.resultDry")
                : t("ingest.widget.result")
            }
          >
            <Div className="flex flex-col gap-2">
              {result.sources.map((s) => (
                <Div key={s.source} className="flex flex-col gap-0.5">
                  <Div className="flex items-center justify-between gap-2">
                    <Div className="flex items-center gap-2">
                      <Span className="text-sm font-semibold">
                        {t(s.source)}
                      </Span>
                      <Badge
                        variant={
                          s.status === "enums.runStatus.ok"
                            ? "secondary"
                            : s.status === "enums.runStatus.failed"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {t(s.status)}
                      </Badge>
                    </Div>
                    <Span className="text-sm tabular-nums">
                      {s.balanceUsd !== null
                        ? money.format(s.balanceUsd)
                        : s.kind === "revenue" &&
                            s.status === "enums.runStatus.ok"
                          ? t("ingest.widget.events", {
                              count: String(s.events),
                            })
                          : ""}
                    </Span>
                  </Div>
                  {s.reason && (
                    <Span className="text-xs text-muted-foreground">
                      {s.reason}
                    </Span>
                  )}
                </Div>
              ))}
            </Div>
          </SectionGroup>

          <SectionGroup title={t("ingest.widget.margin")}>
            <Div className="flex flex-col gap-1">
              {result.days.map((d) => (
                <Div
                  key={d.day}
                  className="flex items-center justify-between gap-2 text-sm tabular-nums"
                >
                  <Span className="font-medium">{d.day}</Span>
                  <Span className="text-muted-foreground">
                    {money.format(d.netRevenueUsd)} -{" "}
                    {money.format(d.upstreamCostUsd)}
                  </Span>
                  <Span className="font-semibold">
                    {money.format(d.grossMarginUsd)}
                    {d.grossMarginPct === null
                      ? ""
                      : ` (${d.grossMarginPct.toFixed(1)}%)`}
                  </Span>
                </Div>
              ))}
            </Div>
          </SectionGroup>

          <SectionGroup
            title={t("ingest.widget.alerts", {
              raised: String(result.alertsRaised),
              suppressed: String(result.alertsSuppressed),
            })}
          >
            <Div className="flex flex-col gap-2">
              {result.alerts.map((a) => (
                <Div key={`${a.type}-${a.subject}`} className="flex flex-col">
                  <Span className="text-sm">{a.message}</Span>
                  <Span className="text-xs text-muted-foreground">
                    {a.delivery}
                  </Span>
                </Div>
              ))}
            </Div>
          </SectionGroup>
        </Div>
      )}
    </WidgetShell>
  );
}

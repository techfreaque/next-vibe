"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
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
import {
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import revaluationDefinitions from "../../revaluation/definition";
import setRateDefinitions from "../set/definition";
import syncEcbDefinitions from "../sync-ecb/definition";
import type definition from "./definition";

export function ExchangeRateListWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const actions = interactive ? (
    <Div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        onClick={() =>
          navigation.push(syncEcbDefinitions.POST, { renderInModal: true })
        }
      >
        {t("list.syncEcbAction")}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          navigation.push(setRateDefinitions.POST, { renderInModal: true })
        }
      >
        {t("list.setManualAction")}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => navigation.push(revaluationDefinitions.POST, {})}
      >
        {t("list.revalueAction")}
      </Button>
    </Div>
  ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("list.title")}
        subtitle={t("list.description")}
        actions={actions}
      />
      {interactive && (
        <Div className="max-w-xs">
          <TextFieldWidget
            fieldName="currency"
            field={field.children.currency}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <Div className="grid gap-3 @sm:grid-cols-2">
            <MetricCard
              label={t("list.countLabel")}
              value={String(data.rates.length)}
            />
            <MetricCard
              label={t("list.latestDate")}
              value={data.latestDate ?? "-"}
            />
          </Div>
          {data.rates.length === 0 ? (
            <EmptyBlock title={t("list.empty")} />
          ) : (
            <Div className="rounded-md border">
              <Table scrollLabel={t("list.title")}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("fields.rateDate")}</TableHead>
                    <TableHead>{t("fields.baseCurrency")}</TableHead>
                    <TableHead>{t("fields.quoteCurrency")}</TableHead>
                    <TableHead className="text-right">
                      {t("fields.rate")}
                    </TableHead>
                    <TableHead>{t("fields.source")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rates.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="tabular-nums">
                        {r.rateDate}
                      </TableCell>
                      <TableCell className="font-mono">
                        {r.baseCurrency}
                      </TableCell>
                      <TableCell className="font-mono">
                        {r.quoteCurrency}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {r.rate.toFixed(6)}
                      </TableCell>
                      <TableCell>
                        <StatusPill
                          status={r.source}
                          variant={r.source === "MANUAL" ? "info" : "muted"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}

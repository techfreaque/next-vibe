"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function FxRevaluationWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();

  return (
    <AdminForm
      title={t("revaluation.title")}
      description={t("revaluation.description")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "revaluation.action" }}
        />
      }
    >
      <AdminFormSection title={t("revaluation.title")} columns={2}>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={field.children.companyId}
        />
        <DateFieldWidget fieldName="asOfDate" field={field.children.asOfDate} />
        <BooleanFieldWidget fieldName="dryRun" field={field.children.dryRun} />
        <BooleanFieldWidget
          fieldName="postReversalNextDay"
          field={field.children.postReversalNextDay}
        />
      </AdminFormSection>

      {data && (
        <Div className="flex flex-col gap-4">
          <ResultBanner
            variant={data.dryRunResponse ? "info" : "success"}
            title={
              data.dryRunResponse
                ? t("revaluation.previewBanner")
                : t("revaluation.postedBanner")
            }
          />
          <DetailGrid columns={3}>
            <DetailField
              label={t("revaluation.functionalCurrency")}
              value={data.functionalCurrency}
            />
            <DetailField
              label={t("revaluation.totalUnrealized")}
              value={formatMoney(
                data.totalUnrealizedGainLoss,
                data.functionalCurrency,
                locale,
              )}
            />
            {data.journalEntryId && (
              <DetailField
                label={t("revaluation.journalEntryId")}
                value={data.journalEntryId}
                mono
              />
            )}
          </DetailGrid>
          {data.items.length === 0 ? (
            <EmptyBlock title={t("revaluation.noAdjustments")} />
          ) : (
            <Div className="rounded-md border">
              <Table scrollLabel={t("revaluation.title")}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("revaluation.account")}</TableHead>
                    <TableHead className="text-right">
                      {t("revaluation.foreignBalance")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("revaluation.carryingFunctional")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("revaluation.closingRate")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("revaluation.revaluedFunctional")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("revaluation.unrealizedDelta")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item) => (
                    <TableRow key={`${item.accountId}-${item.currency}`}>
                      <TableCell>{`${item.accountCode} ${item.accountName}`}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(
                          item.foreignBalance,
                          item.currency,
                          locale,
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(
                          item.carryingFunctional,
                          data.functionalCurrency,
                          locale,
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {item.closingRate.toFixed(6)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(
                          item.revaluedFunctional,
                          data.functionalCurrency,
                          locale,
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatMoney(
                          item.unrealizedGainLoss,
                          data.functionalCurrency,
                          locale,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          )}
        </Div>
      )}
    </AdminForm>
  );
}

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { useMemo, useState } from "react";
import { type JSX } from "react";

import { BillStatus } from "@/payment/enum";

import billDefinition from "../get/definition";
import type definition from "./definition";

export function BillApproveWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.POST>();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const billId = form.watch("billId");
  const interactive = useWidgetIsInteractive();
  const complete = Boolean(data?.status);
  const detailOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { billId: billId ?? "" },
        queryOptions: { enabled: interactive && Boolean(billId) && !complete },
      },
    }),
    [billId, interactive, complete],
  );
  const loaded = useEndpoint(billDefinition, detailOptions, logger, user).read
    ?.data;
  const bill = loaded?.id === billId ? loaded : undefined;
  const toggleCharge = (): void => {
    if (expanded) {
      form.setValue("reverseChargeBase", undefined);
      form.setValue("reverseChargeRatePercent", undefined);
    }
    setExpanded(!expanded);
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("post.title")}
      description={
        bill
          ? `${bill.supplierName} · ${bill.billNumber}`
          : t("post.description")
      }
      backButton={backButton}
      primaryAction={
        data?.status !== undefined ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text:
                bill?.status === BillStatus.DRAFT
                  ? "receiveBill"
                  : "post.widget.submit",
            }}
          />
        )
      }
    >
      {data?.status !== undefined ? (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t(data.status)}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigation.pop()}
            >
              {t("post.widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <Div className="flex flex-col gap-4">
          {!billId && (
            <EntityPickerFieldWidget
              fieldName="billId"
              field={{ ...field.children.billId, hidden: false }}
            />
          )}
          <Div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
            <P className="text-sm text-warning">
              {t("post.widget.confirmDescription")}
            </P>
          </Div>

          {bill?.status === BillStatus.RECEIVED && (
            <Div className="space-y-3">
              {bill.bankSupplierDocument === "missing" && (
                <>
                  <P className="text-sm text-muted-foreground">
                    {t("supplierDocument.missingHelp")}
                  </P>
                  <BooleanFieldWidget
                    fieldName="confirmNoSupplierDocument"
                    field={field.children.confirmNoSupplierDocument}
                  />
                </>
              )}
              {bill.possibleBankDuplicate && (
                <BooleanFieldWidget
                  fieldName="confirmSeparateBankBill"
                  field={field.children.confirmSeparateBankBill}
                />
              )}
            </Div>
          )}

          {bill?.canRecordReverseCharge && (
            <Div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-expanded={expanded}
                onClick={toggleCharge}
              >
                {t("reverseCharge.title")}
              </Button>
              {expanded && (
                <Div className="space-y-3 rounded-lg border p-3">
                  <P className="text-sm text-muted-foreground">
                    {t("reverseCharge.help")}
                  </P>
                  <NumberFieldWidget
                    fieldName="reverseChargeBase"
                    presentation="money"
                    currency={bill.currency}
                    field={withValue(
                      field.children.reverseChargeBase,
                      undefined,
                      null,
                    )}
                  />
                  <NumberFieldWidget
                    fieldName="reverseChargeRatePercent"
                    presentation="quantity"
                    field={withValue(
                      field.children.reverseChargeRatePercent,
                      undefined,
                      null,
                    )}
                  />
                </Div>
              )}
            </Div>
          )}
        </Div>
      )}
    </AdminForm>
  );
}

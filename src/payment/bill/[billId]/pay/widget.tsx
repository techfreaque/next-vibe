"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import { AccountSubtype } from "@/chart-of-accounts/enum";
import { BillStatus } from "@/payment/enum";

import billDefinition from "../get/definition";
import type definition from "./definition";

export function BillPayWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const billId = form.watch("billId");
  const complete = data?.status !== undefined;
  const detailOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { billId: billId ?? "" },
        queryOptions: { enabled: interactive && Boolean(billId) && !complete },
      },
    }),
    [billId, interactive, complete],
  );
  const read = useEndpoint(billDefinition, detailOptions, logger, user).read;
  const response = read?.response;
  const loaded = response?.success ? response.data : undefined;
  const bill = loaded?.id === billId ? loaded : undefined;
  const backButton = navigation.canGoBack && (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("post.widget.back")}
    </Button>
  );

  const readError = response?.success === false ? response : undefined;
  const canPay = bill?.status === BillStatus.APPROVED;
  const reference = bill
    ? [
        bill.billNumber,
        bill.supplierName,
        formatMoney(bill.total, bill.currency, locale),
      ]
        .filter(Boolean)
        .join(" · ")
    : undefined;
  return (
    <AdminForm
      title={t("post.title")}
      description={reference}
      backButton={backButton}
      primaryAction={
        canPay && !complete ? (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "post.widget.submit" }}
          />
        ) : null
      }
    >
      {complete ? (
        <ResultBanner
          variant="success"
          title={t("post.widget.paymentRecorded")}
          message={t("post.success.description")}
        />
      ) : canPay ? (
        <AdminFormSection title={t("post.widget.details")} columns={2}>
          <EntityPickerFieldWidget
            fieldName="accountNodeId"
            field={withValue(field.children.accountNodeId, undefined, null)}
            listData={{
              companyId: bill.companyId,
              postableOnly: true,
              subtypes: [AccountSubtype.BANK, AccountSubtype.CASH],
            }}
          />
          <DateFieldWidget
            fieldName="paidAt"
            utcCalendarDay
            localizedDate
            field={withValue(field.children.paidAt, undefined, null)}
          />
        </AdminFormSection>
      ) : bill ? (
        <ResultBanner
          variant="warning"
          title={t("post.errors.conflict.title")}
          message={t("post.errors.conflict.description")}
        />
      ) : !billId ? (
        <AdminFormSection title={t("post.widget.details")}>
          <EntityPickerFieldWidget
            fieldName="billId"
            field={{ ...field.children.billId, hidden: false }}
          />
        </AdminFormSection>
      ) : readError ? (
        <ResultBanner variant="danger" title={readError.message}>
          {canRetryRecordRead(readError.errorType.errorCode) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => void read?.refetch()}
            >
              {t("post.widget.retry")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <LoadingBlock message={t("post.widget.loadingBill")} />
      )}
    </AdminForm>
  );
}

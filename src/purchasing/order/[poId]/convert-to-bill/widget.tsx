"use client";

import { Button } from "next-vibe/ui/components/button";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { PurchaseOrderActionConfirm } from "../../action-confirm";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderConvertToBillWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const poId = useWidgetForm<typeof definition.POST>()?.watch("poId") ?? "";
  const navigation = useWidgetNavigation();
  const billId = data?.result?.billId;
  const openBill = (): void => {
    if (!billId) {
      return;
    }
    void import("@/payment/bill/[billId]/get/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { billId } }),
    );
  };

  return (
    <PurchaseOrderActionConfirm
      poId={poId}
      title={t("orderConvertToBill.post.title")}
      consequence={t("orderConvertToBill.post.widget.consequence")}
      tone="info"
      allowedStatuses={["RECEIVED"]}
      blockedMessage={t("orderConvertToBill.post.widget.blocked")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderConvertToBill.post.title" }}
        />
      }
      done={data?.result !== undefined}
      doneTitle={t("orderConvertToBill.post.success.title")}
      doneMessage={t("orderConvertToBill.post.success.description")}
      doneActions={
        billId ? (
          <Button type="button" variant="outline" onClick={openBill}>
            {t("orderConvertToBill.post.widget.viewBill")}
          </Button>
        ) : undefined
      }
    />
  );
}

"use client";

import {
  useWidgetForm,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { PurchaseOrderActionConfirm } from "../../action-confirm";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderCancelWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const poId = useWidgetForm<typeof definition.POST>()?.watch("poId") ?? "";

  return (
    <PurchaseOrderActionConfirm
      poId={poId}
      title={t("orderCancel.post.title")}
      consequence={t("orderCancel.post.widget.warning")}
      tone="warning"
      allowedStatuses={["DRAFT", "SENT"]}
      blockedMessage={t("orderCancel.post.widget.blocked")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderCancel.post.title", variant: "destructive" }}
        />
      }
      done={data?.result !== undefined}
      doneTitle={t("orderCancel.post.success.title")}
      doneMessage={t("orderCancel.post.success.description")}
    />
  );
}

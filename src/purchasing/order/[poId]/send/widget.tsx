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
export function OrderSendWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const poId = useWidgetForm<typeof definition.POST>()?.watch("poId") ?? "";

  return (
    <PurchaseOrderActionConfirm
      poId={poId}
      title={t("orderSend.post.title")}
      consequence={t("orderSend.post.widget.consequence")}
      tone="info"
      allowedStatuses={["DRAFT"]}
      blockedMessage={t("orderSend.post.widget.blocked")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderSend.post.title" }}
        />
      }
      done={data?.result !== undefined}
      doneTitle={t("orderSend.post.success.title")}
      doneMessage={t("orderSend.post.success.description")}
    />
  );
}

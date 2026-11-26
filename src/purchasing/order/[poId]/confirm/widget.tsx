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
export function OrderConfirmWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const poId = useWidgetForm<typeof definition.POST>()?.watch("poId") ?? "";

  return (
    <PurchaseOrderActionConfirm
      poId={poId}
      title={t("orderConfirm.post.title")}
      consequence={t("orderConfirm.post.widget.consequence")}
      tone="info"
      allowedStatuses={["SENT"]}
      blockedMessage={t("orderConfirm.post.widget.blocked")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderConfirm.post.title" }}
        />
      }
      done={data?.result !== undefined}
      doneTitle={t("orderConfirm.post.success.title")}
      doneMessage={t("orderConfirm.post.success.description")}
    />
  );
}

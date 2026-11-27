"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InvoiceCheckoutWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("checkout.title")}
      description={t("checkout.description")}
      primaryAction={
        data ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "checkout.action" }}
          />
        )
      }
    >
      {data && (
        <>
          <ResultBanner variant="success" title={t("checkout.success")} />
          <DetailGrid columns={2}>
            <DetailField
              label={t("checkout.paymentUrl")}
              value={data.paymentUrl}
              mono
              copyable
            />
            <DetailField
              label={t("checkout.sessionId")}
              value={data.sessionId}
              mono
            />
          </DetailGrid>
        </>
      )}
    </AdminForm>
  );
}

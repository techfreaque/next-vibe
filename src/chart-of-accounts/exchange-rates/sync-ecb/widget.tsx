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

export function ExchangeRateSyncWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("sync.title")}
      description={t("sync.description")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "sync.action" }}
        />
      }
    >
      {data && (
        <>
          <ResultBanner variant="success" title={t("sync.success")} />
          <DetailGrid columns={2}>
            <DetailField label={t("fields.rateDate")} value={data.rateDate} />
            <DetailField
              label={t("sync.upsertedCount")}
              value={String(data.upsertedCount)}
            />
          </DetailGrid>
        </>
      )}
    </AdminForm>
  );
}

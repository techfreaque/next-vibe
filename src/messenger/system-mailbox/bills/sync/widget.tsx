"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type endpoint from "./definition";

export function Sync({
  field: { children },
}: {
  field: typeof endpoint.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoint.POST>();
  const data = useWidgetValue<typeof endpoint.POST>();
  const form = useWidgetForm<typeof endpoint.POST>();
  const preview = form?.watch("dryRun") !== false;
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("syncTitle")}
        subtitle={t("syncDescription")}
      />
      {interactive && !responseOnly && (
        <Div className="flex max-w-md flex-col gap-4">
          <BooleanFieldWidget field={children.dryRun} fieldName="dryRun" />
          <NumberFieldWidget field={children.limit} fieldName="limit" />
          <SubmitButtonWidget<typeof endpoint.POST>
            field={{
              text: preview ? "previewScan" : "applyScan",
              className: "self-end",
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data?.scanned !== undefined && (
        <DetailGrid columns={2}>
          <DetailField label={t("scanned")} value={data.scanned} />
          <DetailField
            label={t(data.dryRun ? "newDraftCount" : "linkedCount")}
            value={data.dryRun ? data.ready - data.existing : data.ready}
          />
          <DetailField label={t("existingCount")} value={data.existing} />
          <DetailField label={t("reviewCount")} value={data.review} />
          <DetailField label={t("persisted")} value={data.persisted} />
          <DetailField label={t("skipped")} value={data.skipped} />
          <DetailField label={t("flagged")} value={data.flagged} />
        </DetailGrid>
      )}
    </WidgetShell>
  );
}

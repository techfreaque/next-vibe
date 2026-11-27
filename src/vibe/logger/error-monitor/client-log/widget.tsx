"use client";

import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";

import {
  useWidgetIsInteractive,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "../../../unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "../../../unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";

export function ClientErrorReportWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const editable = interactive && !responseOnly;

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        actions={
          editable && (
            <SubmitButtonWidget<typeof definition.POST>
              field={{ className: "h-10 w-full @lg:w-auto" }}
            />
          )
        }
      />
      <FormAlertWidget field={{}} />
      {editable && (
        <Div className="grid min-w-0 gap-4 rounded-lg border bg-card p-4 @md:grid-cols-[12rem_1fr]">
          <SelectFieldWidget fieldName="level" field={field.children.level} />
          <TextFieldWidget fieldName="message" field={field.children.message} />
        </Div>
      )}
      {data?.ok && (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t("post.success.description")}
        />
      )}
    </WidgetShell>
  );
}

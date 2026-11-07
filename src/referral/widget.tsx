/**
 * Custom Widget for creating a referral code — one compact row: code, label, create.
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import {
  useWidgetForm,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useState } from "react";

import type definition from "./definition";

interface CreateCodeWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ReferralCodeCreateContainer({
  field,
}: CreateCodeWidgetProps): JSX.Element {
  const children = field.children;
  const grid = children.fieldsGrid.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const saved = useWidgetValue<typeof definition.POST>();

  // A created code clears the form for the next one (adjust state during render)
  const [handled, setHandled] = useState(saved);
  if (saved !== handled) {
    setHandled(saved);
    if (saved !== undefined && "successMessage" in saved) {
      form.reset({ fieldsGrid: { code: "", label: "" } });
    }
  }

  return (
    <Div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <Div className="flex items-start gap-3">
        <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Plus className="h-4 w-4" />
        </Span>
        <Div className="flex flex-col gap-0.5">
          <H3 className="m-0 text-base font-semibold tracking-tight">
            {t("post.form.title")}
          </H3>
          <P className="m-0 text-sm text-muted-foreground">
            {t("post.form.description")}
          </P>
        </Div>
      </Div>
      <Div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <TextFieldWidget fieldName="fieldsGrid.code" field={grid.code} />
        <TextFieldWidget fieldName="fieldsGrid.label" field={grid.label} />
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.submit.label",
            loadingText: "post.submit.loading",
            icon: "plus",
            variant: "default",
            size: "default",
            className: "h-11 w-full sm:h-10 sm:w-auto",
          }}
        />
      </Div>
      <FormAlertWidget field={children.formAlert} />
    </Div>
  );
}

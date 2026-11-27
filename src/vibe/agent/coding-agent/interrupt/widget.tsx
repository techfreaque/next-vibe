"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InterruptWidget({
  field,
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const responseOnly = useWidgetResponseOnly();
  return (
    <Div className="flex flex-col gap-4 p-4">
      {!responseOnly && (
        <>
          <FormAlertWidget field={{}} />
          <TextFieldWidget fieldName="name" field={field.children.name} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "codingAgent.interrupt.post.titleShort",
              icon: "square",
            }}
          />
        </>
      )}
      {value && (
        <Span>
          {t(
            value.interrupted
              ? "codingAgent.interrupt.post.fields.interrupted.label"
              : "codingAgent.interrupt.post.fields.noInterrupt.label",
          )}
        </Span>
      )}
    </Div>
  );
}

InterruptWidget.cliWidget = true as const;

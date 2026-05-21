"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function SubscriptionReminderContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const value = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {value === null || value === undefined ? (
        <P className="text-sm text-muted-foreground" />
      ) : (
        <Div className="flex flex-col gap-3">
          <Div className="grid grid-cols-2 gap-3">
            <TextWidget
              fieldName="checked"
              field={withValue(children.checked, value.checked, null)}
            />
            <TextWidget
              fieldName="reminded"
              field={withValue(children.reminded, value.reminded, null)}
            />
          </Div>
          {value.errors.length > 0 && (
            <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex flex-col gap-1">
              {value.errors.map((err, i) => (
                <TextWidget
                  key={i}
                  fieldName={`errors.${i}`}
                  field={withValue(children.errors.child, err, value.errors)}
                />
              ))}
            </Div>
          )}
        </Div>
      )}

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.widget.run",
          loadingText: "post.widget.loading",
        }}
      />
    </Div>
  );
}

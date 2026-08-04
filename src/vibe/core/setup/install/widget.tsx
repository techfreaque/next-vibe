"use client";

import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import type { JSX } from "react";

import { withValue } from "../../../unified-ui/_shared/field-helpers";
import { useWidgetValue } from "../../../unified-ui/_shared/use-widget-context";
import { AlertWidget } from "../../../unified-ui/widgets/display-only/alert/widget";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * The web surface has no logger stream, so unlike the CLI widget this does show
 * every setup's summary — there is nothing above it that already did.
 */
export function SetupInstallWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const value = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {value && (
        <AlertWidget
          fieldName="message"
          field={withValue(children.message, value.message, null)}
        />
      )}

      {value?.results?.map((entry) => (
        <Div key={entry.key} className="flex flex-col gap-1 text-sm">
          <Div>
            <Span>{entry.ok ? "✓" : "✗"}</Span>{" "}
            <Span className="font-medium">{entry.description}</Span>
          </Div>
          <Span className="font-mono text-xs text-muted-foreground">
            {entry.summary}
          </Span>
        </Div>
      ))}

      <Div className="flex flex-col gap-3">
        <BooleanFieldWidget fieldName="verbose" field={children.verbose} />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "Install",
          loadingText: "Installing…",
          icon: "download",
          variant: "primary",
        }}
      />
    </Div>
  );
}

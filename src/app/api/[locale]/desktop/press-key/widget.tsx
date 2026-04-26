/**
 * Press Key Widget
 * Form: key combo input, repeat count, delay, optional window targeting
 * Result: success confirmation with key badge
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetForm,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PressKeyWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const pressedKey = form?.getValues("key") as string | undefined;
  const repeat = form?.getValues("repeat") as number | undefined;

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <TextFieldWidget fieldName="key" field={children.key} />
        <NumberFieldWidget fieldName="repeat" field={children.repeat} />
        <NumberFieldWidget fieldName="delay" field={children.delay} />
      </Div>

      <Div className="grid grid-cols-2 gap-3">
        <TextFieldWidget fieldName="windowId" field={children.windowId} />
        <TextFieldWidget fieldName="windowTitle" field={children.windowTitle} />
      </Div>

      <Div className="flex gap-2">
        <NavigateButtonWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST> field={{}} />
      </Div>

      {data?.success === true ? (
        <Div className="flex items-center gap-2">
          <Span className="text-sm text-emerald-600 dark:text-emerald-400">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            ✓ Pressed
          </Span>
          {pressedKey ? (
            <Badge variant="outline" className="font-mono text-xs">
              {pressedKey}
              {repeat && repeat > 1 ? ` ×${repeat}` : ""}
            </Badge>
          ) : null}
        </Div>
      ) : data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}

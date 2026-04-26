/**
 * Scroll Widget
 * Form: direction selector, amount, optional position
 * Result: success confirmation
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ScrollWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SelectFieldWidget fieldName="direction" field={children.direction} />
        <NumberFieldWidget fieldName="amount" field={children.amount} />
        <NumberFieldWidget fieldName="x" field={children.x} />
        <NumberFieldWidget fieldName="y" field={children.y} />
      </Div>

      <Div className="flex gap-2">
        <NavigateButtonWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST> field={{}} />
      </Div>

      {data?.success === true ? (
        <Span className="text-sm text-emerald-600 dark:text-emerald-400">
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}✓
          Scrolled
        </Span>
      ) : data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}

/**
 * Type Text Widget
 * Form: textarea for text, delay input, optional window targeting
 * Result: success + preview of what was typed
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
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function TypeTextWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const typedText = form?.getValues("text") as string | undefined;

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      <TextareaFieldWidget fieldName="text" field={children.text} />

      <Div className="grid grid-cols-2 gap-3">
        <NumberFieldWidget fieldName="delay" field={children.delay} />
        <TextFieldWidget fieldName="windowId" field={children.windowId} />
      </Div>
      <TextFieldWidget fieldName="windowTitle" field={children.windowTitle} />

      <Div className="flex gap-2">
        <NavigateButtonWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST> field={{}} />
      </Div>

      {data?.success === true && typedText ? (
        <Div className="flex flex-col gap-1.5">
          <Span className="text-sm text-emerald-600 dark:text-emerald-400">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            ✓ Text typed
          </Span>
          <Badge
            variant="secondary"
            className="font-mono text-xs w-fit max-w-full truncate"
          >
            &ldquo;{truncate(typedText, 60)}&rdquo;
          </Badge>
        </Div>
      ) : data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}

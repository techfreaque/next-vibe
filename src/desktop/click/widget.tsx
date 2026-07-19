"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Camera } from "next-vibe/ui/ui/icons/Camera";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ClickWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleScreenshot = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../take-screenshot/definition");
      navigate(def.default.POST, { renderInModal: true });
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader title={t("widget.titleClick")} />

      {data?.success === true ? (
        /* Success state */
        <Div className="flex flex-col gap-4 p-4">
          <Div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
            <Div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <Span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t("widget.statusClickExecuted")}
              </Span>
            </Div>
          </Div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs w-fit"
            onClick={handleScreenshot}
          >
            <Camera className="h-3.5 w-3.5" />
            {t("widget.actionScreenshotLink")}
          </Button>
        </Div>
      ) : (
        /* Form state */
        <Div className="flex flex-col gap-4 p-4">
          <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumberFieldWidget fieldName="x" field={children.x} />
            <NumberFieldWidget fieldName="y" field={children.y} />
            <SelectFieldWidget fieldName="button" field={children.button} />
            <BooleanFieldWidget
              fieldName="doubleClick"
              field={children.doubleClick}
            />
          </Div>

          <Div className="flex gap-2">
            <NavigateButtonWidget field={{}} />
            <FormAlertWidget field={{}} />
            <SubmitButtonWidget<typeof definition.POST> field={{}} />
          </Div>

          {data?.error ? (
            <Span className="text-sm text-destructive">{data.error}</Span>
          ) : null}
        </Div>
      )}
    </Div>
  );
}

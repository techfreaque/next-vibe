"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PressKeyWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const pressedKey = form?.getValues("key") as string | undefined;
  const windowTitle = form?.getValues("windowTitle") as string | undefined;
  const repeat = form?.getValues("repeat") as number | undefined;

  const handleListWindows = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list-windows/definition");
      navigate(def.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader title={windowTitle ?? t("widget.titlePressKey")} />

      {data?.success === true ? (
        /* Success state */
        <Div className="flex flex-col gap-4 p-4">
          <Div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
            <Div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <Span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t("widget.statusPressed")}
              </Span>
              {pressedKey ? (
                <Badge variant="outline" className="font-mono text-xs">
                  {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                  {pressedKey}
                  {repeat && repeat > 1 ? ` ×${repeat}` : ""}
                </Badge>
              ) : null}
            </Div>
          </Div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 text-xs w-fit"
            onClick={handleListWindows}
          >
            {t("widget.actionAllWindows")}
          </Button>
        </Div>
      ) : (
        /* Form state */
        <Div className="flex flex-col gap-4 p-4">
          {/* Key + modifiers row */}
          <Div className="grid grid-cols-3 gap-3">
            <TextFieldWidget fieldName="key" field={children.key} />
            <NumberFieldWidget fieldName="repeat" field={children.repeat} />
            <NumberFieldWidget fieldName="delay" field={children.delay} />
          </Div>

          {/* Target window */}
          <Div className="grid grid-cols-2 gap-3">
            <EntityPickerFieldWidget
              fieldName="windowId"
              field={children.windowId}
            />
            <TextFieldWidget
              fieldName="windowTitle"
              field={children.windowTitle}
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

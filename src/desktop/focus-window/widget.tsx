"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { Eye } from "next-vibe/ui/ui/icons/Eye";
import { Keyboard } from "next-vibe/ui/ui/icons/Keyboard";
import { Type } from "next-vibe/ui/ui/icons/Type";
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

export function FocusWindowWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const windowId = form?.getValues("windowId") as string | undefined;

  const handleType = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../type-text/definition");
      navigate(def.default.POST, {
        data: { windowId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleKey = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../press-key/definition");
      navigate(def.default.POST, {
        data: { windowId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleA11y = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../get-accessibility-tree/definition");
      const title = form?.getValues("title") as string | undefined;
      navigate(def.default.POST, {
        data: { appName: title },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader title={t("widget.titleFocusWindow")} />
      <Div className="flex flex-col gap-5 p-4">
        {/* Inputs */}
        <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <EntityPickerFieldWidget
            fieldName="windowId"
            field={children.windowId}
          />
          <NumberFieldWidget fieldName="pid" field={children.pid} />
          <TextFieldWidget fieldName="title" field={children.title} />
        </Div>

        <Div className="flex gap-2">
          <NavigateButtonWidget field={{}} />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST> field={{}} />
        </Div>

        {/* Success */}
        {data?.success === true ? (
          <Div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
            <Div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <Span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t("widget.statusFocused")}
              </Span>
            </Div>
            {windowId ? (
              <Div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleType}
                >
                  <Type className="h-3.5 w-3.5" />
                  {t("widget.actionTypeText")}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleKey}
                >
                  <Keyboard className="h-3.5 w-3.5" />
                  {t("widget.actionPressKey")}
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleA11y}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("widget.actionA11yTree")}
                </Button>
              </Div>
            ) : null}
          </Div>
        ) : data?.error ? (
          <Span className="text-sm text-destructive">{data.error}</Span>
        ) : null}
      </Div>
    </Div>
  );
}

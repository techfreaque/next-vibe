"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import { DesktopNavHeader } from "../shared/nav-header";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function MoveWindowToMonitorWidget({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleListWindows = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list-windows/definition");
      navigate(def.default.POST, {});
    })();
  };

  const handleListMonitors = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list-monitors/definition");
      navigate(def.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader title={t("widget.titleMoveWindow")} />

      {data?.success === true ? (
        /* Success state */
        <Div className="flex flex-col gap-4 p-4">
          <Div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
            <Div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <Span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t("widget.statusMoved")}
              </Span>
            </Div>
            {(data.windowTitle ?? data.movedTo) ? (
              <Div className="flex items-center gap-2 flex-wrap">
                {data.windowTitle ? (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {data.windowTitle}
                  </Badge>
                ) : null}
                {data.movedTo ? (
                  <>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <Badge variant="outline" className="text-xs">
                      {data.movedTo}
                    </Badge>
                  </>
                ) : null}
              </Div>
            ) : null}
          </Div>
          <Div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-xs"
              onClick={handleListWindows}
            >
              {t("widget.actionAllWindows")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-xs"
              onClick={handleListMonitors}
            >
              {t("widget.actionAllMonitors")}
            </Button>
          </Div>
        </Div>
      ) : (
        /* Form state */
        <Div className="flex flex-col gap-4 p-4">
          {/* Window selection */}
          <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <EntityPickerFieldWidget
              fieldName="windowId"
              field={children.windowId}
            />
            <NumberFieldWidget fieldName="pid" field={children.pid} />
            <TextFieldWidget fieldName="title" field={children.title} />
          </Div>

          {/* Target monitor */}
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <EntityPickerFieldWidget
              fieldName="monitorName"
              field={children.monitorName}
            />
            <NumberFieldWidget
              fieldName="monitorIndex"
              field={children.monitorIndex}
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

"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX, useRef } from "react";

import { posTerminalNameMap } from "../../terminal/list/widget";
import type definition from "./definition";

interface PosSessionOpenWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PosSessionOpenWidget({
  field,
}: PosSessionOpenWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;

  // Look up terminal name from module-level map populated by the terminal list widget.
  // This avoids polluting the API schema with UI-only display context.
  const terminalId = form?.getValues("details.terminalId") ?? "";
  const terminalNameRef = useRef<string>(
    posTerminalNameMap.get(terminalId) ?? t("sessionOpen.post.widget.terminal"),
  );

  const handleStartOrders = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../order/list/definition");
      navigation.push(def.default.GET, {
        data: {
          input: { sessionId, status: undefined },
          page: 1,
          pageSize: 50,
        },
      });
    })();
  };

  const handleBackToTerminals = (): void => {
    navigation.pop();
  };

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-5">
        {/* Success banner */}
        <Div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-4 flex items-start gap-3">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold text-green-700 dark:text-green-400">
              {t("sessionOpen.post.success.title")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("sessionOpen.post.success.description")}
            </Span>
          </Div>
        </Div>

        {/* Session summary */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Span className="text-sm font-semibold">
              {t("sessionOpen.post.widget.terminal")}
            </Span>
            <Span className="text-sm font-medium">
              {terminalNameRef.current}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionOpen.post.response.status")}
            </Span>
            <Badge
              variant="default"
              className="text-xs bg-blue-600 hover:bg-blue-600"
            >
              {t("enums.sessionStatus.open")}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionOpen.post.response.openingFloat")}
            </Span>
            <Span className="text-sm font-mono font-semibold tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.openingFloat)}
            </Span>
          </Div>
          {result.openedAt ? (
            <Div className="flex items-center justify-between px-4 py-3">
              <Span className="text-sm text-muted-foreground">
                {t("sessionOpen.post.response.openedAt")}
              </Span>
              <Span className="text-sm tabular-nums">
                {new Date(result.openedAt).toLocaleString(locale)}
              </Span>
            </Div>
          ) : null}
        </Div>

        {/* Primary CTA */}
        <Div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => handleStartOrders(result.id)}
          >
            {t("sessionOpen.post.widget.startOrders")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleBackToTerminals}
          >
            {t("sessionOpen.post.widget.backToTerminals")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      <FormAlertWidget field={{}} />

      {/* Terminal header — read-only, not a UUID field */}
      <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {t("sessionOpen.post.widget.terminal")}
          </Span>
          <Span className="text-base font-semibold">
            {terminalNameRef.current}
          </Span>
        </Div>
        <Badge variant="secondary" className="text-xs">
          {t("sessionOpen.post.widget.readyToOpen")}
        </Badge>
      </Div>

      {/* Opening float */}
      <Div className="flex flex-col gap-1">
        <NumberFieldWidget
          fieldName="details.openingFloat"
          field={withValue(
            field.children.details.children.openingFloat,
            undefined,
            null,
          )}
        />
        <Span className="text-xs text-muted-foreground px-1">
          {t("sessionOpen.post.widget.floatHint")}
        </Span>
      </Div>

      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={handleBackToTerminals}
        type="button"
      >
        {t("sessionOpen.post.widget.backToTerminals")}
      </Button>
    </Div>
  );
}

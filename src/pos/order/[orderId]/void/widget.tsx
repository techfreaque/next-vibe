"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function PosOrderVoidWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.POST)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = data?.result;

  const handleBackToList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/pos/order/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/20 border-muted">
        <Div className="flex items-center gap-3 rounded-lg border px-4 py-3">
          <Span className="text-sm font-medium flex-1">
            {t("orderVoid.post.success.title")}
          </Span>
          <Badge variant="destructive" className="text-xs">
            {t("enums.orderStatus.voided")}
          </Badge>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBackToList}
        >
          {t("orderVoid.post.widget.backToList")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderVoid.post.widget.backToList")}
        </Button>
      )}
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

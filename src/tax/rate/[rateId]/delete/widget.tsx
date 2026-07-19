"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import { H4, P } from "next-vibe/ui/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxRateDeleteWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const [confirmed, setConfirmed] = useState(false);

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.deleted !== undefined) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="p-4 rounded-lg border border-muted">
          <Span className="text-sm font-medium">
            {t("rate.delete.success.title")}
          </Span>
          <Div className="text-xs text-muted-foreground mt-1">
            {t("rate.delete.success.description")}
          </Div>
        </Div>
        <Button variant="outline" size="sm" onClick={handleBack}>
          {t("rate.delete.widget.backToList")}
        </Button>
      </Div>
    );
  }

  if (!confirmed) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border border-destructive/40 bg-destructive/5">
        <Div className="flex flex-col gap-1">
          <H4 className="text-sm font-semibold text-destructive">
            {t("rate.delete.widget.confirmTitle")}
          </H4>
          <P className="text-sm text-muted-foreground">
            {t("rate.delete.widget.confirmDescription")}
          </P>
        </Div>
        <Div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmed(true)}
            type="button"
          >
            {t("rate.delete.widget.confirmButton")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("rate.delete.widget.cancelButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

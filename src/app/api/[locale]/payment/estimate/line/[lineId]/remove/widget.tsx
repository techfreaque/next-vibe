"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EstimateLineRemoveWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const [confirmed, setConfirmed] = useState(false);

  if (data?.success === true) {
    return (
      <Div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/20">
        <Span className="text-sm font-medium text-foreground">
          {t("widget.removed")}
        </Span>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
          >
            {t("widget.back")}
          </Button>
        )}
      </Div>
    );
  }

  if (!confirmed) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border border-destructive/40 bg-destructive/5">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )}
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold text-destructive">
            {t("widget.confirmTitle")}
          </Span>
          <P className="text-sm text-muted-foreground">
            {t("widget.confirmDescription")}
          </P>
        </Div>
        <Div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmed(true)}
            type="button"
          >
            {t("widget.confirmButton")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("widget.cancelButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}

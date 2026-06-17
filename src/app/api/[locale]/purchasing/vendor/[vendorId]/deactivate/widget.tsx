"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VendorDeactivateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/20">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("vendorDeactivate.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("vendorDeactivate.post.success.description")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start"
        >
          {t("vendorDeactivate.post.widget.backToList")}
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
          {t("vendorDeactivate.post.widget.backToList")}
        </Button>
      )}

      <Div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
        <Span className="text-sm text-destructive font-medium">
          {t("vendorDeactivate.post.widget.warning")}
        </Span>
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "vendorDeactivate.post.title", variant: "destructive" }}
      />
    </Div>
  );
}

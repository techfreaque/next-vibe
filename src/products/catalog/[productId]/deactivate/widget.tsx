"use client";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CatalogProductDeactivateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-1">
            {t("post.success.description")}
          </Span>
        </Div>
        {canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => pop()}
            className="self-start"
          >
            {t("post.widget.backToList")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      )}
      <Div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
        <Span className="text-sm text-destructive font-medium">
          {t("post.widget.warning")}
        </Span>
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

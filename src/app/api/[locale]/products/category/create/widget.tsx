"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import type { JSX } from "react";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function ProductCategoryCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const result = data?.result;

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Span className="text-base font-semibold text-foreground mt-1">
            {result.name}
          </Span>
          <Span className="text-xs text-muted-foreground font-mono">
            {result.id}
          </Span>
        </Div>
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleViewList}
          >
            {t("post.widget.backToList")}
          </Button>
          {canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => pop()}
            >
              {t("post.widget.back")}
            </Button>
          )}
        </Div>
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

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="details.name"
          field={withValue(
            field.children.details.children.name,
            undefined,
            null,
          )}
        />
        <NumberFieldWidget
          fieldName="details.sortOrder"
          field={withValue(
            field.children.details.children.sortOrder,
            undefined,
            null,
          )}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

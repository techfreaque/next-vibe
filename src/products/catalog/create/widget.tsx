"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CatalogCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewProduct = (productId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[productId]/get/definition");
      navigate(def.default.GET, { urlPathParams: { productId } });
    })();
  };

  const handleAddAnother = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {});
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
          <Span className="font-mono text-xs text-muted-foreground">
            {result.id}
          </Span>
        </Div>
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              handleViewProduct(result.id);
            }}
          >
            {t("post.widget.viewProduct")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAnother}
          >
            {t("post.widget.backToList")}
          </Button>
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
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="details.name"
            field={withValue(
              field.children.details.children.name,
              undefined,
              null,
            )}
          />
          <SelectFieldWidget
            fieldName="details.type"
            field={withValue(
              field.children.details.children.type,
              undefined,
              null,
            )}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="details.productDescription"
          field={withValue(
            field.children.details.children.productDescription,
            undefined,
            null,
          )}
        />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="details.sku"
            field={withValue(
              field.children.details.children.sku,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="details.unit"
            field={withValue(
              field.children.details.children.unit,
              undefined,
              null,
            )}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="details.basePrice"
            field={withValue(
              field.children.details.children.basePrice,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="details.currency"
            field={withValue(
              field.children.details.children.currency,
              undefined,
              null,
            )}
          />
        </Div>
        <NumberFieldWidget
          fieldName="details.defaultTaxRate"
          field={withValue(
            field.children.details.children.defaultTaxRate,
            undefined,
            null,
          )}
        />
        <BooleanFieldWidget
          fieldName="details.isSubscription"
          field={withValue(
            field.children.details.children.isSubscription,
            undefined,
            null,
          )}
        />
        <SelectFieldWidget
          fieldName="details.billingInterval"
          field={withValue(
            field.children.details.children.billingInterval,
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

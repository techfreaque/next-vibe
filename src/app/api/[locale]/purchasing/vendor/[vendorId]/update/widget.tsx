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
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { PhoneFieldWidget } from "next-vibe-ui/unified/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import { UrlFieldWidget } from "next-vibe-ui/unified/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function VendorUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-base font-semibold text-emerald-700 dark:text-emerald-400 block">
            {result.nameResponse}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("vendorUpdate.patch.success.description")}
          </Span>
        </Div>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("vendorUpdate.patch.widget.viewVendor")}
          </Button>
        )}
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
          {t("vendorUpdate.patch.widget.viewVendor")}
        </Button>
      )}

      <Div className="flex flex-col gap-4">
        {/* Company Info */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Div className="sm:col-span-2">
            <TextFieldWidget
              fieldName="name"
              field={withValue(field.children.name, undefined, null)}
            />
          </Div>
          <TextFieldWidget
            fieldName="code"
            field={withValue(field.children.code, undefined, null)}
          />
        </Div>

        {/* Contact */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EmailFieldWidget
            fieldName="email"
            field={withValue(field.children.email, undefined, null)}
          />
          <PhoneFieldWidget
            fieldName="phone"
            field={withValue(field.children.phone, undefined, null)}
          />
          <Div className="sm:col-span-2">
            <UrlFieldWidget
              fieldName="website"
              field={withValue(field.children.website, undefined, null)}
            />
          </Div>
        </Div>

        {/* Tax & Registration */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextFieldWidget
            fieldName="vatNumber"
            field={withValue(field.children.vatNumber, undefined, null)}
          />
          <TextFieldWidget
            fieldName="taxId"
            field={withValue(field.children.taxId, undefined, null)}
          />
        </Div>

        {/* Address */}
        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            fieldName="addressLine1"
            field={withValue(field.children.addressLine1, undefined, null)}
          />
          <TextFieldWidget
            fieldName="addressLine2"
            field={withValue(field.children.addressLine2, undefined, null)}
          />
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextFieldWidget
              fieldName="city"
              field={withValue(field.children.city, undefined, null)}
            />
            <TextFieldWidget
              fieldName="region"
              field={withValue(field.children.region, undefined, null)}
            />
            <TextFieldWidget
              fieldName="postalCode"
              field={withValue(field.children.postalCode, undefined, null)}
            />
            <TextFieldWidget
              fieldName="country"
              field={withValue(field.children.country, undefined, null)}
            />
          </Div>
        </Div>

        {/* Terms */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextFieldWidget
            fieldName="defaultCurrency"
            field={withValue(field.children.defaultCurrency, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="defaultPaymentTermsDays"
            field={withValue(
              field.children.defaultPaymentTermsDays,
              undefined,
              null,
            )}
          />
          <Div className="sm:col-span-2">
            <TextareaFieldWidget
              fieldName="notes"
              field={withValue(field.children.notes, undefined, null)}
            />
          </Div>
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{ text: "vendorUpdate.patch.title" }}
      />
    </Div>
  );
}

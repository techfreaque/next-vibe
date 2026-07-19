"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function VendorCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewVendor = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const id = data?.id;
    if (!id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[vendorId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { vendorId: id },
      });
    })();
  };

  const handleCreateAnother = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
        {/* Success header */}
        <Div className="flex items-start gap-3">
          <Div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <Span className="text-emerald-600 dark:text-emerald-400 text-lg font-semibold">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              ✓
            </Span>
          </Div>
          <Div>
            <Span className="text-base font-semibold block text-emerald-700 dark:text-emerald-400">
              {t("vendorCreate.post.success.title")}
            </Span>
            <Span className="text-sm text-muted-foreground block mt-0.5">
              {t("vendorCreate.post.success.description")}
            </Span>
          </Div>
        </Div>

        {/* Vendor summary */}
        <Div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <Div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Span className="text-sm font-bold text-primary">
              {data.nameResponse?.charAt(0).toUpperCase() ?? "V"}
            </Span>
          </Div>
          <Div className="flex-1 min-w-0">
            <Span className="text-sm font-medium block">
              {data.nameResponse}
            </Span>
            {data.codeResponse ? (
              <Span className="text-xs text-muted-foreground font-mono">
                {data.codeResponse}
              </Span>
            ) : null}
            {data.emailResponse ? (
              <Span className="text-xs text-muted-foreground block">
                {data.emailResponse}
              </Span>
            ) : null}
          </Div>
          <Badge
            variant="default"
            className="text-xs shrink-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            {t("vendorList.get.widget.active")}
          </Badge>
        </Div>

        {/* Actions */}
        <Div className="flex items-center gap-2">
          <Button type="button" size="sm" onClick={handleViewVendor}>
            {t("vendorCreate.post.widget.viewVendor")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCreateAnother}
          >
            {t("vendorCreate.post.widget.createAnother")}
          </Button>
        </Div>
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
          {t("vendorCreate.post.widget.back")}
        </Button>
      )}

      <Div className="flex flex-col gap-4">
        {/* Company Info */}
        <Div className="flex flex-col gap-3">
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
            <TextFieldWidget
              fieldName="companyId"
              field={withValue(field.children.companyId, undefined, null)}
            />
          </Div>
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
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "vendorCreate.post.title" }}
      />
    </Div>
  );
}

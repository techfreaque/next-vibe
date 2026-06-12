"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { PhoneFieldWidget } from "next-vibe-ui/unified/form-fields/phone-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { UrlFieldWidget } from "next-vibe-ui/unified/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function CompanyCreateContainer({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewCompany = (): void => {
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[companyId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { companyId: data.result.id },
      });
    })();
  };

  if (data?.result?.id) {
    return (
      <Div className="flex flex-col gap-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
        <Div className="flex items-start gap-3">
          <Div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Building className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </Div>
          <Div>
            <Span className="text-base font-semibold block text-emerald-700 dark:text-emerald-400">
              {t("post.success.title")}
            </Span>
            <Span className="text-sm text-muted-foreground block mt-0.5">
              {data.result.name}
            </Span>
          </Div>
        </Div>
        <Div className="flex items-center gap-2">
          <Button size="sm" onClick={handleViewCompany} className="gap-1.5">
            {t("post.widget.viewCompany")}
            <ChevronRight className="h-3.5 w-3.5" />
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
          {t("post.widget.back")}
        </Button>
      )}
      <Div className="flex flex-col gap-1">
        <Span className="text-lg font-semibold">{t("post.title")}</Span>
        <Span className="text-sm text-muted-foreground">
          {t("post.description")}
        </Span>
      </Div>

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
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="details.vatNumber"
            field={withValue(
              field.children.details.children.vatNumber,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="details.country"
            field={withValue(
              field.children.details.children.country,
              undefined,
              null,
            )}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="details.currency"
            field={withValue(
              field.children.details.children.currency,
              undefined,
              null,
            )}
          />
          <EmailFieldWidget
            fieldName="details.email"
            field={withValue(
              field.children.details.children.email,
              undefined,
              null,
            )}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <PhoneFieldWidget
            fieldName="details.phone"
            field={withValue(
              field.children.details.children.phone,
              undefined,
              null,
            )}
          />
          <UrlFieldWidget
            fieldName="details.website"
            field={withValue(
              field.children.details.children.website,
              undefined,
              null,
            )}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}

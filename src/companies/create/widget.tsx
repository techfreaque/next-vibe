"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import { useWorkspaceCompany } from "../_shared/workspace-company-context";
import { proposeOpeningMonth } from "../[companyId]/onboard/first-period";
import { getCompanySetupCountry } from "../[companyId]/onboard/setup-country";
import type definition from "./definition";

export function CompanyCreateContainer({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const workspace = useWorkspaceCompany();

  const handleSetupAccounting = (): void => {
    if (!data?.result?.id) {
      return;
    }
    const companyId = data.result.id;
    const country = getCompanySetupCountry(data.result.country);
    workspace?.register({
      id: companyId,
      name: data.result.name,
      currency: null,
    });
    void (async (): Promise<void> => {
      const { default: onboard } =
        await import("../[companyId]/onboard/definition");
      navigation.push(onboard.POST, {
        urlPathParams: { companyId },
        data: {
          country,
          openFirstPeriod: true,
          ...proposeOpeningMonth(locale),
        },
      });
    })();
  };

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
        <Div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={handleSetupAccounting}>
            {t("post.widget.setupAccounting")}
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleViewCompany}
            className="gap-1.5"
          >
            {t("post.widget.viewCompany")}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <WidgetShell layout="page" className="min-w-0 max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="size-4" />
              {t("post.widget.back")}
            </Button>
          )
        }
      />

      <Div className="flex flex-col gap-3">
        <Div className="grid gap-3 @lg:grid-cols-2">
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
        <Div className="grid gap-3 @lg:grid-cols-2">
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
        <Div className="grid gap-3 @lg:grid-cols-2">
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
        <Div className="grid gap-3 @lg:grid-cols-2">
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
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.title", className: "min-h-11 self-end" }}
      />
    </WidgetShell>
  );
}

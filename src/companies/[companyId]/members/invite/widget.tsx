"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import { scopedTranslation as companiesScopedTranslation } from "../../../i18n";
import type definition from "./definition";

export function MemberInviteWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);
  const invited = Boolean(data?.result?.memberId);

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.description")}
      backButton={backButton}
      primaryAction={
        invited ? null : (
          <SubmitButtonWidget<typeof definition.POST> field={{}} />
        )
      }
    >
      {data?.result?.memberId ? (
        <ResultBanner
          variant="success"
          title={t("post.widget.invited")}
          message={data.result.role ? tCompanies(data.result.role) : undefined}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => navigation.pop()}
            >
              {t("post.widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <AdminFormSection title={t("post.title")}>
          <EmailFieldWidget
            fieldName="email"
            field={withValue(field.children.email, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="role"
            field={withValue(field.children.role, undefined, null)}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}

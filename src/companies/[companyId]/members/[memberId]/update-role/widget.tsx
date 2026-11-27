"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import { scopedTranslation as companiesScopedTranslation } from "../../../../i18n";
import { useCompanyMemberLabel } from "../../use-company-member-label";
import type definition from "./definition";

export function UpdateMemberRoleWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.PATCH>();
  const memberLabel = useCompanyMemberLabel(
    form?.watch("companyId") ?? "",
    form?.watch("memberId") ?? "",
  );
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);

  const newRole = data?.result?.role;

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("updateRole.patch.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("updateRole.patch.widget.title")}
      description={memberLabel ?? t("updateRole.patch.description")}
      backButton={backButton}
      primaryAction={
        newRole ? null : (
          <SubmitButtonWidget<typeof definition.PATCH> field={{}} />
        )
      }
    >
      {newRole ? (
        <ResultBanner
          variant="success"
          title={t("updateRole.patch.widget.successLabel")}
          message={tCompanies(newRole)}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(): void => navigation.pop()}
            >
              {t("updateRole.patch.widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <AdminFormSection title={t("updateRole.patch.widget.title")}>
          <SelectFieldWidget
            fieldName="role"
            field={withValue(field.children.role, undefined, null)}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}

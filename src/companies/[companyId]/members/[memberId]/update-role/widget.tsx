"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX } from "react";

import type { CompanyMemberRoleValue } from "../../../../enum";
import { CompanyMemberRole } from "../../../../enum";
import { scopedTranslation as companiesScopedTranslation } from "../../../../i18n";
import type definition from "./definition";

const ROLE_COLOR: Record<typeof CompanyMemberRoleValue, string> = {
  [CompanyMemberRole.OWNER]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  [CompanyMemberRole.ADMIN]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  [CompanyMemberRole.ACCOUNTANT]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  [CompanyMemberRole.MEMBER]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [CompanyMemberRole.VIEWER]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function UpdateMemberRoleWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const locale = useWidgetLocale();
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);

  const newRole = data?.result?.role;

  if (newRole) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <Div className="flex flex-col items-center gap-2">
            <Span className="text-base font-semibold">
              {t("updateRole.patch.widget.successLabel")}
            </Span>
            <Badge variant="secondary" className={ROLE_COLOR[newRole] ?? ""}>
              {tCompanies(newRole)}
            </Badge>
          </Div>
        </Div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(): void => navigation.pop()}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("updateRole.patch.widget.back")}
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
          onClick={(): void => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("updateRole.patch.widget.back")}
        </Button>
      )}
      <Div className="flex flex-col gap-1">
        <Span className="text-lg font-semibold">
          {t("updateRole.patch.widget.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("updateRole.patch.description")}
        </Span>
      </Div>
      <SelectFieldWidget
        fieldName="role"
        field={withValue(field.children.role, undefined, null)}
      />
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH> field={{}} />
    </Div>
  );
}

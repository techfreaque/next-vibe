"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/widget";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ConfigCreateWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const value = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {value?.message && (
        <AlertWidget
          fieldName="message"
          field={withValue(children.message, value.message, null)}
        />
      )}

      <Div className="grid grid-cols-2 gap-3">
        <BooleanFieldWidget
          fieldName="createMcpConfig"
          field={children.createMcpConfig}
        />
        <BooleanFieldWidget
          fieldName="updateVscodeSettings"
          field={children.updateVscodeSettings}
        />
        <BooleanFieldWidget
          fieldName="updatePackageJson"
          field={children.updatePackageJson}
        />
        <BooleanFieldWidget
          fieldName="enableReactRules"
          field={children.enableReactRules}
        />
        <BooleanFieldWidget
          fieldName="enableNextjsRules"
          field={children.enableNextjsRules}
        />
        <BooleanFieldWidget
          fieldName="enableI18nRules"
          field={children.enableI18nRules}
        />
        <BooleanFieldWidget
          fieldName="jsxCapitalization"
          field={children.jsxCapitalization}
        />
        <BooleanFieldWidget
          fieldName="enablePedanticRules"
          field={children.enablePedanticRules}
        />
        <BooleanFieldWidget
          fieldName="enableRestrictedSyntax"
          field={children.enableRestrictedSyntax}
        />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "success.title",
          loadingText: "steps.creatingConfig",
          icon: "wrench",
          variant: "primary",
        }}
      />
    </Div>
  );
}

/**
 * SSH Connection Create Widget
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import { useWidgetForm } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type endpoints from "./definition";
import type { ConnectionCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ConnectionCreateResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

export function ConnectionCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  useWidgetForm<typeof endpoints.POST>();
  const emptyField = useMemo(() => ({}), []);

  return (
    <Div className="flex flex-col gap-0">
      {/* Actions */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{ icon: "arrow-left", variant: "outline" }}
        />
        <SubmitButtonWidget<typeof endpoints.POST>
          field={{
            text: "post.submitButton.text",
            loadingText: "widget.creating",
            icon: "plus",
            variant: "primary",
            className: "ml-auto",
          }}
        />
      </Div>

      {/* Scrollable form */}
      <Div className="overflow-y-auto max-h-[min(600px,calc(100dvh-220px))] px-4 pb-4">
        <FormAlertWidget field={emptyField} />

        <Div className="flex flex-col gap-4">
          <TextFieldWidget fieldName="label" field={children.label} />
          <TextFieldWidget fieldName="host" field={children.host} />
          <NumberFieldWidget fieldName="port" field={children.port} />
          <TextFieldWidget fieldName="username" field={children.username} />
          <SelectFieldWidget fieldName="authType" field={children.authType} />
          <PasswordFieldWidget fieldName="secret" field={children.secret} />
          <PasswordFieldWidget fieldName="passphrase" field={children.passphrase} />
          <BooleanFieldWidget
            fieldName="isDefault"
            field={children.isDefault}
          />
          <TextareaFieldWidget fieldName="notes" field={children.notes} />
        </Div>
      </Div>
    </Div>
  );
}

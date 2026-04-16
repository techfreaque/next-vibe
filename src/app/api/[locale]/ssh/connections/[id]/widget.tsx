"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import {
  useWidgetForm,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import { SshAuthType } from "../../enum";
import type endpoints from "./definition";

interface CustomWidgetProps {
  field: (typeof endpoints.PATCH)["fields"];
}

export function ConnectionDetailContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof endpoints.PATCH>();
  const emptyField = useMemo(() => ({}), []);
  const loadedData = useWidgetValue<typeof endpoints.GET>();

  // Watch authType reactively; fall back to loaded value before form initialises
  const watchedAuthType = form.watch("authType");
  const authType = watchedAuthType ?? loadedData?.authType;
  const isLocal = authType === SshAuthType.LOCAL;
  const isKeyAgent = authType === SshAuthType.KEY_AGENT;

  return (
    <Div className="flex flex-col gap-0">
      {/* Actions */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4 sticky top-0 bg-background z-10 border-b">
        <NavigateButtonWidget
          field={{ icon: "arrow-left", variant: "outline" }}
        />
        <SubmitButtonWidget<typeof endpoints.PATCH>
          field={{
            text: "widget.saveButton",
            loadingText: "widget.saveButton",
            icon: "save",
            variant: "primary",
            className: "ml-auto",
          }}
        />
        <SubmitButtonWidget<typeof endpoints.DELETE>
          field={{
            text: "widget.deleteButton",
            loadingText: "widget.deleteButton",
            icon: "trash",
            variant: "destructive",
          }}
        />
      </Div>

      <Div className="px-4 pb-4 flex flex-col gap-4">
        <FormAlertWidget field={emptyField} />
        <TextFieldWidget fieldName="label" field={children.label} />
        {!isLocal && (
          <SelectFieldWidget fieldName="authType" field={children.authType} />
        )}
        {!isLocal && (
          <>
            <TextFieldWidget fieldName="host" field={children.host} />
            <NumberFieldWidget fieldName="port" field={children.port} />
          </>
        )}
        <TextFieldWidget fieldName="username" field={children.username} />
        {!isLocal && !isKeyAgent && (
          <PasswordFieldWidget fieldName="secret" field={children.secret} />
        )}
        {!isLocal && !isKeyAgent && (
          <PasswordFieldWidget
            fieldName="passphrase"
            field={children.passphrase}
          />
        )}
        <BooleanFieldWidget fieldName="isDefault" field={children.isDefault} />
        <TextareaFieldWidget fieldName="notes" field={children.notes} />
      </Div>
    </Div>
  );
}

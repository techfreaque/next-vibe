/**
 * Linux User Create Widget
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import { useWidgetForm } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextArrayFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-array-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type endpoints from "./definition";
import type { LinuxUserCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: LinuxUserCreateResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

export function LinuxUserCreateContainer({
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
            icon: "user-plus",
            variant: "primary",
            className: "ml-auto",
          }}
        />
      </Div>

      <Div className="overflow-y-auto max-h-[min(500px,calc(100dvh-220px))] px-4 pb-4 flex flex-col gap-4">
        <FormAlertWidget field={emptyField} />
        <TextFieldWidget
          fieldName="connectionId"
          field={children.connectionId}
        />
        <TextFieldWidget fieldName="username" field={children.username} />
        <TextArrayFieldWidget fieldName="groups" field={children.groups} />
        <SelectFieldWidget fieldName="loginShell" field={children.loginShell} />
        <TextFieldWidget fieldName="homeDir" field={children.homeDir} />
        <BooleanFieldWidget
          fieldName="sudoAccess"
          field={children.sudoAccess}
        />
        <PasswordFieldWidget
          fieldName="sudoPassword"
          field={children.sudoPassword}
        />
      </Div>
    </Div>
  );
}

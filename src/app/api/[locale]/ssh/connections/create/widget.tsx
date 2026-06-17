/**
 * SSH Connection Create Widget
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import {
  useWidgetForm,
  useWidgetUser,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { PasswordFieldWidget } from "next-vibe-ui/unified/form-fields/password-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";
import { useMemo } from "react";

import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeOptions } from "../../enum";
import type endpoints from "./definition";
import type { ConnectionCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ConnectionCreateResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
}

export function ConnectionCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof endpoints.POST>();
  const user = useWidgetUser();
  const emptyField = useMemo(() => ({}), []);

  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const authTypeOptions = useMemo(
    () =>
      isAdmin
        ? SshAuthTypeOptions
        : SshAuthTypeOptions.filter((o) => o.value !== SshAuthType.LOCAL),
    [isAdmin],
  );

  const authType = form.watch("authType");
  const isLocal = authType === SshAuthType.LOCAL;
  const isKeyAgent = authType === SshAuthType.KEY_AGENT;

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

      {/* Form */}
      <Div className="px-4 pb-4 flex flex-col gap-4">
        <FormAlertWidget field={emptyField} />
        <TextFieldWidget fieldName="label" field={children.label} />
        <SelectFieldWidget
          fieldName="authType"
          field={{ ...children.authType, options: authTypeOptions }}
        />
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

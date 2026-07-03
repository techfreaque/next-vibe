"use client";

import { Methods } from "next-vibe/core/definition/enums";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { FolderOpen } from "next-vibe/ui/ui/icons/FolderOpen";
import { Trash2 } from "next-vibe/ui/ui/icons/Trash2";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import {
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/form-fields/number-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/form-fields/password-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import { SshAuthType, SshAuthTypeOptions } from "../../enum";
import type endpoints from "./definition";

interface CustomWidgetProps {
  field: (typeof endpoints.PATCH)["fields"];
}

export function ConnectionDetailContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof endpoints.PATCH>();
  const user = useWidgetUser();
  const emptyField = useMemo(() => ({}), []);
  const loadedData = useWidgetValue<typeof endpoints.GET>();
  const navigation = useWidgetNavigation();
  const endpoint = useWidgetEndpoint();

  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const authTypeOptions = useMemo(
    () =>
      isAdmin
        ? SshAuthTypeOptions
        : SshAuthTypeOptions.filter((o) => o.value !== SshAuthType.LOCAL),
    [isAdmin],
  );

  const t = useWidgetTranslation<typeof endpoints.PATCH>();
  const isDeleteMode = endpoint.method === Methods.DELETE;
  const connectionId = form.watch("id");
  const watchedAuthType = form.watch("authType");

  const handleDelete = useCallback((): void => {
    if (!connectionId) {
      return;
    }
    void (async (): Promise<void> => {
      const connDef = await import("./definition");
      navigation.push(connDef.DELETE, {
        urlPathParams: { id: connectionId },
        renderInModal: true,
        popNavigationOnSuccess: 2,
      });
    })();
  }, [navigation, connectionId]);

  const handleManageMounts = useCallback((): void => {
    if (!connectionId) {
      return;
    }
    void (async (): Promise<void> => {
      const mountDef = await import("./mounts/list/definition");
      navigation.push(mountDef.default.GET, {
        urlPathParams: { id: connectionId },
      });
    })();
  }, [navigation, connectionId]);

  if (isDeleteMode) {
    return (
      <Div className="flex flex-col gap-4 px-6 py-6">
        <FormAlertWidget field={emptyField} />
        <Div className="flex flex-row gap-2">
          <NavigateButtonWidget
            field={{ icon: "arrow-left", variant: "outline" }}
          />
          <SubmitButtonWidget<typeof endpoints.DELETE>
            field={{
              text: "delete.title",
              loadingText: "delete.title",
              icon: "trash",
              variant: "destructive",
            }}
          />
        </Div>
      </Div>
    );
  }

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
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={!connectionId}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t("widget.deleteButton")}
        </Button>
      </Div>

      <Div className="px-4 pb-4 flex flex-col gap-4">
        <FormAlertWidget field={emptyField} />
        <TextFieldWidget fieldName="label" field={children.label} />
        {!isLocal && (
          <SelectFieldWidget
            fieldName="authType"
            field={{ ...children.authType, options: authTypeOptions }}
          />
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

      {/* Mounts section */}
      <Div className="border-t px-4 py-4 flex flex-col gap-3">
        <WidgetHeader title={t("widget.mountsSection")} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleManageMounts}
          disabled={!connectionId}
          className="self-start"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          {t("widget.manageMounts")}
        </Button>
      </Div>
    </Div>
  );
}

"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetForm,
  useWidgetPlatform,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect } from "react";

import type definitions from "./definition";

interface DeleteMessageWidgetProps {
  field: (typeof definitions.DELETE)["fields"];
}

export function DeleteMessageWidget({
  field,
}: DeleteMessageWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definitions.DELETE>();
  const form = useWidgetForm();
  const children = field.children;
  const isWeb = platform === Platform.NEXT_PAGE;

  useEffect(() => {
    if (!isWeb || !form) {
      return;
    }
    form.register("threadId");
    form.register("messageId");
    form.register("rootFolderId");
  }, [isWeb, form]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {isWeb ? (
        <Div className="flex flex-col gap-1">
          <Span className="text-base font-semibold text-foreground">
            {t("delete.confirmTitle")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("delete.confirmText")}
          </Span>
        </Div>
      ) : (
        <>
          <TextFieldWidget fieldName="threadId" field={children.threadId} />
          <TextFieldWidget fieldName="messageId" field={children.messageId} />
          <SelectFieldWidget
            fieldName="rootFolderId"
            field={children.rootFolderId}
          />
        </>
      )}

      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definitions.DELETE>
          field={children.submitButton}
        />
      </Div>
    </Div>
  );
}

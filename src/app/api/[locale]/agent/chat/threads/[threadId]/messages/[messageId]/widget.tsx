"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetPlatform,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";

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

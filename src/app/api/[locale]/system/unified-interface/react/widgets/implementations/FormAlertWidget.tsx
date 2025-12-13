"use client";

import type { JSX } from "react";
import {
  FormAlert,
  type FormAlertState,
} from "next-vibe-ui/ui/form/form-alert";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Displays form validation and API errors from context.response.
 */
export function FormAlertWidget({
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.FORM_ALERT>): JSX.Element | null {
  const response = context.response;
  let alert: FormAlertState | null = null;

  if (response && response.success === false) {
    alert = {
      variant: "destructive",
      message: {
        message: response.message as TranslationKey,
        messageParams: response.messageParams,
      },
    };
  } else if (response && response.success === true) {
    const data = response.data;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      alert = {
        variant: "success",
        message: {
          message: data.message as TranslationKey,
          messageParams:
            "messageParams" in data
              ? (data.messageParams as
                  | Record<string, string | number>
                  | undefined)
              : undefined,
        },
      };
    }
  }

  return <FormAlert alert={alert} className={className} />;
}

FormAlertWidget.displayName = "FormAlertWidget";

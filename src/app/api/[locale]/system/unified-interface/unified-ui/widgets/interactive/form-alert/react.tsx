"use client";

import {
  FormAlert,
  type FormAlertState,
} from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { ReactStaticWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { useWidgetResponse } from "../../_shared/use-widget-context";
import type { FormAlertWidgetConfig } from "./types";

/**
 * Displays form validation and API errors from context.response.
 */
export function FormAlertWidget<
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
}: ReactStaticWidgetProps<
  TEndpoint,
  TUsage,
  FormAlertWidgetConfig<TUsage, "widget">
>): JSX.Element | null {
  const response = useWidgetResponse();

  if (response && response.success === false) {
    const alert: FormAlertState = {
      variant: "destructive",
      message: {
        message: response.message,
        messageParams: response.messageParams,
      },
    };
    return <FormAlert alert={alert} className={field.className} />;
  }
  return null;
}

FormAlertWidget.displayName = "FormAlertWidget";

export default FormAlertWidget;

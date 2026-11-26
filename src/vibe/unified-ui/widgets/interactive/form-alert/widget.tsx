"use client";

import {
  FormAlert,
  type FormAlertState,
} from "next-vibe/ui/components/form/form-alert";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { ReactStaticWidgetProps } from "../../../_shared/react-types";
import type { FieldUsageConfig } from "../../../_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetResponse,
} from "../../../_shared/use-widget-context";
import { getRootFormErrorMessage } from "./root-error";
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
  const form = useWidgetForm();
  const locale = useWidgetLocale();
  const rootError = getRootFormErrorMessage(form?.formState.errors, locale);

  if (rootError) {
    return (
      <FormAlert
        alert={{ variant: "destructive", message: { message: rootError } }}
        className={field.className}
      />
    );
  }

  if (response && response.success === false) {
    const alert: FormAlertState = {
      variant: "destructive",
      // `response.message` is already fully interpolated - nothing left to fill in.
      message: {
        message: response.message,
      },
    };
    return <FormAlert alert={alert} className={field.className} />;
  }
  return null;
}

FormAlertWidget.displayName = "FormAlertWidget";

export default FormAlertWidget;

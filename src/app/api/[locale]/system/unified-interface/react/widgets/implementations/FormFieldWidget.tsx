"use client";

import type { JSX } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";

import { simpleT } from "@/i18n/core/shared";
import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Renders form fields based on fieldType (TEXT, SELECT, BOOLEAN, etc.).
 * Always renders as editable input - no "readonly" mode.
 */
export function FormFieldWidget({
  field,
  fieldName = "field",
  className,
  form,
  context,
}: ReactWidgetProps<typeof WidgetType.FORM_FIELD>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!form || !field.ui) {
    return (
      <Div className={className}>
        <Div className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
          )}
        </Div>
      </Div>
    );
  }

  const formControl = form as { control: Control<FieldValues> };

  return (
    <EndpointFormField
      name={fieldName as FieldPath<FieldValues>}
      control={formControl.control}
      endpointFields={context.endpointFields ?? {}}
      className={className}
    />
  );
}

FormFieldWidget.displayName = "FormFieldWidget";

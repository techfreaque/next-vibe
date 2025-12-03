"use client";

import type { JSX } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";

import { simpleT } from "@/i18n/core/shared";
import type { WidgetComponentProps } from "../../../shared/widgets/types";

/**
 * Form Field Widget
 *
 * Renders form fields based on fieldType (TEXT, SELECT, BOOLEAN, etc.)
 * Always renders as editable input - no "readonly" mode.
 *
 * **Key Behavior**:
 * - Looks at field.ui.fieldType to determine which input component to render
 * - Always editable in both request and response modes
 * - Request vs Response only determines WHICH fields are shown (via usage flags)
 * - The field type itself never changes between modes
 *
 * **Supported Field Types**:
 * - TEXT, EMAIL, URL, PASSWORD, PHONE: Input component
 * - NUMBER, INT: NumberInput component
 * - TEXTAREA: Textarea component
 * - BOOLEAN: Checkbox or Switch component
 * - SELECT: Select component
 * - MULTISELECT: MultiSelect component
 * - DATE: DatePicker component
 * - etc.
 */
export function FormFieldWidget({
  field,
  fieldName = "field",
  className,
  form,
  context,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Check if we have form context and field configuration
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

  // Use the existing EndpointFormField component which has all the styling
  // Pass the original endpoint fields from context for proper nested path lookup
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

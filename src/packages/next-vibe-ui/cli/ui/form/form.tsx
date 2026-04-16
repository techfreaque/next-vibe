import { Box, Text } from "ink";
import type { JSX } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import type {
  FormProps,
  FormFieldContextValue,
  FormItemContextValue,
  UseFormFieldReturn,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
  FormFieldProps,
  FormComboboxProps,
  FormDatePickerProps,
} from "../../../web/ui/form/form";

export type {
  FormProps,
  FormFieldContextValue,
  FormItemContextValue,
  UseFormFieldReturn,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
  FormFieldProps,
  FormComboboxProps,
  FormDatePickerProps,
} from "../../../web/ui/form/form";

const COLON = "\u003A";
const SPACE = "\u0020";

export function Form<TRequest extends FieldValues>({
  children,
  form,
}: FormProps<TRequest>): JSX.Element {
  if (form) {
    return (
      <FormProvider {...form}>
        <Box flexDirection="column">{children}</Box>
      </FormProvider>
    );
  }
  return <Box flexDirection="column">{children}</Box>;
}

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ render, name, control }: FormFieldProps<TFieldValues, TName>): JSX.Element {
  // If control is provided, use real RHF Controller for value/onChange
  if (control) {
    return <Controller control={control} name={name} render={render} />;
  }

  // Fallback: try to get form context (for FormProvider usage)
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const formContext = useFormContext<TFieldValues>();
    if (formContext) {
      return (
        <Controller control={formContext.control} name={name} render={render} />
      );
    }
  } catch {
    // No form context available
  }

  // Last resort: render with empty stubs (display-only, responseOnly mode)
  return (
    <Box flexDirection="column">
      {render({
        field: {
          name,
          value: "" as TFieldValues[TName],
          onChange: (): void => undefined,
          onBlur: (): void => undefined,
          ref: (): void => undefined,
          disabled: false,
        },
        fieldState: {
          invalid: false,
          isDirty: false,
          isTouched: false,
          isValidating: false,
          error: undefined,
        },
        formState: {} as Parameters<typeof render>[0]["formState"],
      })}
    </Box>
  );
}

export function FormItem({ children }: FormItemProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
FormItem.displayName = "FormItem";

export function FormLabel({ children }: FormLabelProps): JSX.Element {
  return (
    <Text bold>
      {children}
      {COLON}
      {SPACE}
    </Text>
  );
}
FormLabel.displayName = "FormLabel";

export function FormControl({ children }: FormControlProps): JSX.Element {
  return <Box>{children}</Box>;
}
FormControl.displayName = "FormControl";

export function FormDescription({
  children,
}: FormDescriptionProps): JSX.Element {
  return <Text dimColor>{children}</Text>;
}
FormDescription.displayName = "FormDescription";

export function FormMessage({
  children,
  t,
}: FormMessageProps): JSX.Element | null {
  if (!children) {
    return null;
  }
  return <Text color="red">{t(String(children))}</Text>;
}
FormMessage.displayName = "FormMessage";

export function useFormField(): UseFormFieldReturn {
  const id = "cli-form-item";
  return {
    id,
    name: "",
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    invalid: false,
    isDirty: false,
    isTouched: false,
    isValidating: false,
    error: undefined,
  };
}

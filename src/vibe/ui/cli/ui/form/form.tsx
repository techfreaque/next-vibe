import { Box, Text } from "ink";
import type { JSX } from "react";
import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { CliFocusManager } from "../../../cli/lib/focus-manager";
import type {
  FormComboboxProps,
  FormControlProps,
  FormDatePickerProps,
  FormDescriptionProps,
  FormFieldContextValue,
  FormFieldProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
  UseFormFieldReturn,
} from "../../../web/ui/form/form";
import { parseClassesToInkProps } from "../tailwind-to-ink";

export type {
  FormComboboxProps,
  FormControlProps,
  FormDatePickerProps,
  FormDescriptionProps,
  FormFieldContextValue,
  FormFieldProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
  UseFormFieldReturn,
} from "../../../web/ui/form/form";

const COLON = ":";
const SPACE = " ";

// Mirror the web form's context setup so FormMessage can read field errors
const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined,
);

export function Form<TRequest extends FieldValues>({
  children,
  form,
  className,
}: FormProps<TRequest>): JSX.Element {
  const { box } = parseClassesToInkProps(className);
  const boxProps = { flexDirection: "column" as const, ...box };

  if (form) {
    return (
      <FormProvider {...form}>
        <CliFocusManager>
          <Box {...boxProps}>{children}</Box>
        </CliFocusManager>
      </FormProvider>
    );
  }
  return (
    <CliFocusManager>
      <Box {...boxProps}>{children}</Box>
    </CliFocusManager>
  );
}

function FormFieldInContext<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  render,
  name,
}: {
  render: FormFieldProps<TFieldValues, TName>["render"];
  name: TName;
}): JSX.Element {
  const formContext = useFormContext<TFieldValues>();
  if (formContext?.control) {
    return (
      <FormFieldContext.Provider value={{ name }}>
        <Controller control={formContext.control} name={name} render={render} />
      </FormFieldContext.Provider>
    );
  }
  // No form context — display-only stub
  return (
    <FormFieldContext.Provider value={{ name }}>
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
    </FormFieldContext.Provider>
  );
}

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ render, name, control }: FormFieldProps<TFieldValues, TName>): JSX.Element {
  if (control) {
    return (
      <FormFieldContext.Provider value={{ name }}>
        <Controller control={control} name={name} render={render} />
      </FormFieldContext.Provider>
    );
  }
  return <FormFieldInContext render={render} name={name} />;
}

export function FormItem({ children }: FormItemProps): JSX.Element {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <Box flexDirection="column">{children}</Box>
    </FormItemContext.Provider>
  );
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
  const { error } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body || body === "undefined") {
    return null;
  }

  return <Text color="red">{t(String(body))}</Text>;
}
FormMessage.displayName = "FormMessage";

export function useFormField(): UseFormFieldReturn {
  const fieldCtx = React.useContext(FormFieldContext);
  const itemCtx = React.useContext(FormItemContext);
  // Destructure formState directly from useFormContext to trigger proxy subscription
  const ctx = useFormContext();

  const id = itemCtx?.id ?? "cli-form-item";
  const name = fieldCtx?.name ?? "";

  const fieldState =
    ctx && name
      ? ctx.getFieldState(name, ctx.formState)
      : {
          invalid: false,
          isDirty: false,
          isTouched: false,
          isValidating: false,
          error: undefined,
        };

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

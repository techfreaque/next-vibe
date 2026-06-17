import { Box, Text } from "ink";
import type { JSX } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { CliFocusManager } from "@/packages/next-vibe-ui/cli/lib/focus-manager";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

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

const COLON = "\u003A";
const SPACE = "\u0020";

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
      <Controller control={formContext.control} name={name} render={render} />
    );
  }
  // No form context — display-only stub
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

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ render, name, control }: FormFieldProps<TFieldValues, TName>): JSX.Element {
  if (control) {
    return <Controller control={control} name={name} render={render} />;
  }
  return <FormFieldInContext render={render} name={name} />;
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

import { Box, Text } from "ink";
import type { JSX } from "react";
import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

import {
  useWidgetOnSubmit,
  useWidgetResponseOnly,
} from "../../../../unified-ui/_shared/use-widget-context";
import type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldContextValue,
  FormFieldProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
  UseFormFieldReturn,
} from "../../../web/components/form/form";
import { CliFocusManager } from "../../lib/focus-manager";
import {
  setLiveRequestValues,
  setSubmitHandler,
} from "../../lib/live-request-values";
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
} from "../../../web/components/form/form";

const COLON = ":";
const SPACE = " ";

// Mirror the web form's context setup so FormMessage can read field errors
const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined,
);

/**
 * Publishes the form's current values so the page header can show a live
 * `$ vibe …` command. Renders nothing; must sit inside FormProvider to watch.
 */
function LiveRequestValuesPublisher(): null {
  const values = useWatch();
  const onSubmit = useWidgetOnSubmit();

  React.useEffect(() => {
    setLiveRequestValues(values);
  }, [values]);

  // Enter anywhere in the form submits; the page-level handler needs the
  // form's submit, and it lives outside the form.
  React.useEffect(() => {
    setSubmitHandler(onSubmit);
    return (): void => setSubmitHandler(undefined);
  }, [onSubmit]);

  return null;
}

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
        <LiveRequestValuesPublisher />
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
  // A form field is an INPUT — there is nothing to type into on a response-only
  // surface (the non-interactive CLI frame, MCP). Enforced here rather than in
  // each widget so forgetting the check in one place cannot leak request fields
  // into agent output, where they are pure wasted context.
  const responseOnly = useWidgetResponseOnly();
  if (responseOnly === true) {
    return <></>;
  }

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
  // useFormState creates a subscription for THIS component. Reading
  // `useFormContext().formState` only borrows the proxy owned by whichever
  // component called useForm — it does not subscribe the reader, so the message
  // never re-rendered when validation failed and the field showed a bare error
  // icon with no text until some unrelated keypress forced a repaint.
  const { getFieldState, control } = useFormContext();
  const formState = useFormState({ control });

  const id = itemCtx?.id ?? "cli-form-item";
  const name = fieldCtx?.name ?? "";

  const fieldState = name
    ? getFieldState(name, formState)
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

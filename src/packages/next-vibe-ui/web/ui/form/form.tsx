"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type {
  ControllerProps,
  FieldError,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import type { StyleType } from "../../utils/style-type";

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { LabelRootProps } from "../label";
import { Label } from "../label";

export interface FormProps<TRequest extends FieldValues = FieldValues> {
  children: React.ReactNode;
  form?: UseFormReturn<TRequest>;
  onSubmit?: () => void | Promise<void>;
  className?: string;
}

export interface FormFieldContextValue<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName;
}

export interface FormItemContextValue {
  id: string;
}

export interface UseFormFieldReturn {
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  error?: FieldError;
  id: string;
  name: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
}
export type FormItemProps = {
  children?: React.ReactNode;
} & StyleType;

export type FormLabelProps = LabelRootProps;

export interface FormControlProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

export type FormDescriptionProps = {
  children?: React.ReactNode;
} & StyleType;

export type FormMessageProps = {
  children?: React.ReactNode;
} & StyleType;

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

export interface FormComboboxProps {
  label?: string;
  description?: string;
  value?: { label: string; value: string };
  onChange?: (value: { label: string; value: string }) => void;
  options?: { label: string; value: string }[];
}

export interface FormDatePickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Form<TRequest extends FieldValues>(
  props: FormProps<TRequest>,
): React.JSX.Element {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    void props.onSubmit?.();
  };

  // If form is provided, wrap with FormProvider for react-hook-form integration
  if (props.form) {
    return (
      <FormProvider {...props.form}>
        <form className={cn(props.className)} onSubmit={handleSubmit}>
          {props.children}
        </form>
      </FormProvider>
    );
  }

  // Otherwise, render a simple form element
  return (
    <form className={cn(props.className)} onSubmit={handleSubmit}>
      {props.children}
    </form>
  );
}

const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

export const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  ...props
}: FormFieldProps<TFieldValues, TName>): React.JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined,
);

export const useFormField = (): UseFormFieldReturn => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export function FormItem({
  className,
  ...props
}: FormItemProps): React.JSX.Element {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

export function FormLabel({
  className,
  ...props
}: FormLabelProps): React.JSX.Element {
  const { error, formItemId } = useFormField();

  return (
    <div>
      <Label
        className={cn(error && "text-red-600 dark:text-red-400", className)}
        htmlFor={formItemId}
        {...props}
      />
    </div>
  );
}
FormLabel.displayName = "FormLabel";

export function FormControl({ ...props }: FormControlProps): React.JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}
FormControl.displayName = "FormControl";

export function FormDescription({
  className,
  ...props
}: FormDescriptionProps): React.JSX.Element {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
}
FormDescription.displayName = "FormDescription";

export function FormMessage({
  className,
  children,
  ...props
}: FormMessageProps): React.JSX.Element | null {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation();
  const body = error ? String(error.message) : children;

  if (!body || body === "undefined") {
    return null;
  }
  return (
    <p
      id={formMessageId}
      className={cn(
        "text-[0.8rem] font-medium text-red-600 dark:text-red-400",
        className,
      )}
      {...props}
    >
      {t(body as TranslationKey)}
    </p>
  );
}
FormMessage.displayName = "FormMessage";

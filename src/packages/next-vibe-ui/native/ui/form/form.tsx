/**
 * Native Form Components
 * Production-ready implementation with web interface alignment
 * Imports types from web version using relative paths to ensure type safety
 */

"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
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

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

// Import web types using relative paths to ensure alignment
import type { ComponentPropsWithoutRef, ElementRef } from "react";

import { Label } from "../label";

function Form<TRequest extends FieldValues>(props: {
  className?: string;
  children: React.ReactNode;
  form?: UseFormReturn<TRequest>;
  onSubmit:
    | ((e: React.FormEvent<HTMLFormElement>) => void | Promise<void>)
    | undefined;
}): React.JSX.Element {
  // If form is provided, wrap with FormProvider for react-hook-form integration
  if (props.form) {
    return (
      <FormProvider {...props.form}>
        <form className={cn(props.className)} onSubmit={props.onSubmit}>
          {props.children}
        </form>
      </FormProvider>
    );
  }

  // Otherwise, render a simple form element
  return (
    <form className={cn(props.className)} onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
}

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>): React.JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField: () => {
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
} = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useFormField should be used within <FormField>");
  }

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

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-red-600 dark:text-red-400", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation();
  const body = error ? String(error.message) : children;

  if (!body || body === "undefined") {
    return null;
  }
  return (
    <p
      ref={ref}
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
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};

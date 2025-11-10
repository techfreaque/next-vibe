"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { styled } from "nativewind";

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

const StyledView = styled(View);

// ============================================================================
// IMPORT ALL TYPES FROM WEB - DO NOT REDEFINE ANY TYPES
// ============================================================================

import type {
  FormProps,
  FormFieldProps,
  FormItemProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
  FormFieldContextValue,
  FormItemContextValue,
  UseFormFieldReturn,
} from "../../../web/ui/form/form";

import { Label } from "../label";
import { P } from "../typography";

// ============================================================================
// IMPLEMENTATION - Uses imported types, platform-specific components
// ============================================================================

/**
 * Form - Native implementation using View instead of form element
 * React Native does not support HTML form elements
 */
function Form<TRequest extends FieldValues>(
  props: FormProps<TRequest>,
): React.JSX.Element {
  // If form is provided, wrap with FormProvider for react-hook-form integration
  if (props.form) {
    return (
      <FormProvider {...props.form}>
        <View className={cn(props.className)}>{props.children}</View>
      </FormProvider>
    );
  }

  // Otherwise, render a simple View element
  return <View className={cn(props.className)}>{props.children}</View>;
}

const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

const FormField = <
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

const useFormField = (): UseFormFieldReturn => {
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

/**
 * FormItem - Native implementation using View instead of div
 * Uses FormItemProps type from web but renders with native components
 *
 * Type compatibility: FormItemProps is HTMLAttributes on web, but we need
 * ViewProps on native. We pick only the compatible props (className, children, etc.)
 */
const FormItem = React.forwardRef<
  View,
  Pick<FormItemProps, "className" | "children">
>((props, ref): React.JSX.Element => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <StyledView ref={ref} className={cn("space-y-2", props.className)}>
        {props.children}
      </StyledView>
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

/**
 * FormLabel - Native implementation using Label component
 * Uses native-compatible props (only className and children)
 * Note: ref and htmlFor are web-specific and not used in native
 */
const FormLabel = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}): React.JSX.Element => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-red-600 dark:text-red-400", className)}
      nativeID={formItemId}
    >
      {children}
    </Label>
  );
};
FormLabel.displayName = "FormLabel";

/**
 * FormControl - Native implementation using Slot
 * Uses FormControlProps type from web
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  FormControlProps
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

/**
 * FormDescription - Native implementation using P (Text) instead of p
 * Uses FormDescriptionProps type from web but renders with native components
 *
 * Type compatibility: FormDescriptionProps is HTMLAttributes on web, but we need
 * TextProps on native. We pick only the compatible props (className, children, etc.)
 */
function FormDescription({ className, ...props }: Pick<FormDescriptionProps, "className" | "children">): React.JSX.Element {
  const { formDescriptionId } = useFormField();

  return (
    <P
      nativeID={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
}
FormDescription.displayName = "FormDescription";

/**
 * FormMessage - Native implementation using P (Text) instead of p
 * Uses FormMessageProps type from web but renders with native components
 *
 * Type compatibility: FormMessageProps is HTMLAttributes on web, but we need
 * TextProps on native. We pick only the compatible props (className, children, etc.)
 */
function FormMessage({ className, children, ...props }: Pick<FormMessageProps, "className" | "children">): React.JSX.Element | null {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation();
  const body = error ? String(error.message) : children;

  if (!body || body === "undefined") {
    return null;
  }
  return (
    <P
      nativeID={formMessageId}
      className={cn(
        "text-[0.8rem] font-medium text-red-600 dark:text-red-400",
        className,
      )}
      {...props}
    >
      {t(body as TranslationKey)}
    </P>
  );
}
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

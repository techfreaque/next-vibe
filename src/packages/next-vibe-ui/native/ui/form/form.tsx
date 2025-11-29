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

// ============================================================================
// IMPORT ALL TYPES FROM WEB - DO NOT REDEFINE ANY TYPES
// ============================================================================

import type {
  FormProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
  FormFieldContextValue,
  FormItemContextValue,
  UseFormFieldReturn,
} from "../../../web/ui/form/form";

import { Label } from "../label";
import { P } from "../typography";
import { convertCSSToViewStyle } from "../../utils/style-converter";
import { applyStyleType } from "../../../web/utils/style-type";

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const StyledView = styled(View, { className: "style" });

// ============================================================================
// IMPLEMENTATION - Uses imported types, platform-specific components
// ============================================================================

function Form<TRequest extends FieldValues>(
  props: FormProps<TRequest>,
): React.JSX.Element {
  if (props.form) {
    return (
      <FormProvider {...props.form}>
        <StyledView className={cn(props.className)}>
          {props.children}
        </StyledView>
      </FormProvider>
    );
  }

  return (
    <StyledView className={cn(props.className)}>{props.children}</StyledView>
  );
}

/**
 * FormFieldContext - Identical to web implementation
 * Stores the current field name for use in child components
 */
const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

/**
 * FormField - Identical to web implementation
 * Wraps react-hook-form Controller with context provider
 * Function signature identical to web version
 */
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

/**
 * FormItemContext - Identical to web implementation
 * Stores the unique ID for the form item
 */
const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined,
);

/**
 * useFormField - Identical to web implementation
 * Hook for accessing form field state in child components
 * Return type identical to web version
 */
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
 * Function signature identical to web version
 *
 * TYPE COMPATIBILITY: FormItemProps is HTMLAttributes<HTMLDivElement> on web.
 * We accept all props and filter to native-compatible ones internally.
 */
function FormItem({
  className,
  style,
  ...props
}: FormItemProps): React.JSX.Element {
  const id = React.useId();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Filter to only props compatible with View
  // React Native View doesn't support all HTML attributes
  const { children } = props;

  return (
    <FormItemContext.Provider value={{ id }}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn("space-y-1", className),
        })}
      >
        {children}
      </StyledView>
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

function FormLabel({
  className,
  children,
  htmlFor: _htmlFor,
}: FormLabelProps): React.JSX.Element {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-red-600 dark:text-red-400", className)}
      htmlFor={formItemId}
    >
      {children}
    </Label>
  );
}
FormLabel.displayName = "FormLabel";

/**
 * FormControl - Native implementation using Slot
 * Function signature identical to web version
 *
 * ACCESSIBILITY: Passes through aria attributes which will be converted
 * to React Native accessibility props by the Slot component
 */
function FormControl({ ...props }: FormControlProps): React.JSX.Element {
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

/**
 * FormDescription - Native implementation using P (Text) instead of p
 * Function signature identical to web version
 *
 * TYPE COMPATIBILITY: FormDescriptionProps is HTMLAttributes<HTMLParagraphElement> on web.
 * We accept all props and filter to native-compatible ones internally.
 */
function FormDescription({
  className,
  style: _style,
  ...props
}: FormDescriptionProps): React.JSX.Element {
  const { formDescriptionId } = useFormField();

  // Filter to only props compatible with Text
  const { children } = props;

  // Note: style prop is not passed due to StyleType discriminated union
  return (
    <P
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
    >
      {children}
    </P>
  );
}
FormDescription.displayName = "FormDescription";

/**
 * FormMessage - Native implementation using P (Text) instead of p
 * Function signature identical to web version
 *
 * TRANSLATION: Uses i18next for error message translation
 * Handles undefined/missing error messages gracefully
 *
 * TYPE COMPATIBILITY: FormMessageProps is HTMLAttributes<HTMLParagraphElement> on web.
 * We accept all props and filter to native-compatible ones internally.
 */
function FormMessage({
  className,
  style: _style,
  children,
  ..._props
}: FormMessageProps): React.JSX.Element | null {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation();
  const body = error ? String(error.message) : children;

  if (!body || body === "undefined") {
    return null;
  }

  // Note: style prop is not passed due to StyleType discriminated union
  return (
    <P
      id={formMessageId}
      className={cn(
        "text-[0.8rem] font-medium text-red-600 dark:text-red-400",
        className,
      )}
    >
      {t(body as TranslationKey)}
    </P>
  );
}
FormMessage.displayName = "FormMessage";

// ============================================================================
// EXPORTS - Must match web version exactly
// ============================================================================

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

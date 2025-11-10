/**
 * Web Form Components
 * Production-ready implementation with react-hook-form integration
 *
 * TYPE SAFETY: This file exports ALL types used by both web and native
 * implementations to ensure cross-platform type consistency. The native
 * version imports these types to maintain identical public APIs.
 *
 * FEATURES:
 * ✅ react-hook-form integration (FormProvider, Controller, useFormContext)
 * ✅ All form components: Form, FormField, FormItem, FormLabel, FormControl,
 *    FormDescription, FormMessage
 * ✅ Error handling and validation with translation support
 * ✅ Accessibility (aria attributes, proper form semantics)
 * ✅ useFormField hook for form state access
 *
 * USAGE EXAMPLE:
 * ```tsx
 * <Form form={endpoint.create.form} onSubmit={endpoint.create.onSubmit}>
 *   <FormField
 *     control={endpoint.create.form.control}
 *     name="email"
 *     render={({ field }) => (
 *       <FormItem>
 *         <FormLabel>Email</FormLabel>
 *         <FormControl>
 *           <Input {...field} />
 *         </FormControl>
 *         <FormDescription>Enter your email address</FormDescription>
 *         <FormMessage />
 *       </FormItem>
 *     )}
 *   />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 *
 * PLATFORM NOTES:
 * - Web: Uses HTML <form> element with native form submission
 * - Native: Uses View component, submission triggered by button handlers
 * - Both: Share identical type interfaces for seamless cross-platform development
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

import { Label } from "../label";

// ============================================================================
// EXPORTED TYPES - Must be imported by native implementation
// ============================================================================

export interface FormProps<TRequest extends FieldValues> {
  className?: string;
  children: React.ReactNode;
  form?: UseFormReturn<TRequest>;
  onSubmit:
    | ((e: React.FormEvent<HTMLFormElement>) => void | Promise<void>)
    | undefined;
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

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

export type FormLabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
>;

export type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>;

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

// Native-specific form component props (not implemented on web)
export interface FormDatePickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface FormComboboxProps {
  label?: string;
  description?: string;
  value?: { label: string; value: string };
  onChange?: (value: { label: string; value: string }) => void;
  options?: { label: string; value: string }[];
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

function Form<TRequest extends FieldValues>(
  props: FormProps<TRequest>,
): React.JSX.Element {
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

function FormItem({ className, ...props }: FormItemProps): React.JSX.Element {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

function FormLabel({ className, ...props }: FormLabelProps): React.JSX.Element {
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

function FormDescription({ className, ...props }: FormDescriptionProps): React.JSX.Element {
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

function FormMessage({ className, children, ...props }: FormMessageProps): React.JSX.Element | null {
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

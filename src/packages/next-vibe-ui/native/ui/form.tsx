// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui

import * as React from "react";
import type { JSX } from "react";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

// Import ALL form types from web - ZERO definitions here
import type {
  FormFieldContextValue,
  FormItemContextValue,
  UseFormFieldReturn,
  FormDescriptionProps,
  FormMessageProps,
  FormDatePickerProps,
  FormComboboxProps,
  FormItemProps,
} from "@/packages/next-vibe-ui/web/ui/form/form";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { styled } from "nativewind";

import { cn } from "../lib/utils";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetOpenTrigger,
  BottomSheetView,
} from "./bottom-sheet";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Checkbox } from "./checkbox";
import { Calendar as CalendarIcon } from "./icons/Calendar";
import { X } from "./icons/X";
import { Input } from "./input";
import { Label } from "./label";
import type { LabelRootProps } from "../../web/ui/label";
import { RadioGroup } from "./radio-group";
import {
  type Option,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";

import { Textarea } from "./textarea";
import { Span } from "./span";

// Styled components for NativeWind support
const StyledView = styled(View, { className: "style" });
const StyledAnimatedText = styled(Animated.Text, { className: "style" });

const Form = FormProvider;

const FormFieldContext = React.createContext<
  FormFieldContextValue<FieldValues, FieldPath<FieldValues>> | undefined
>(undefined);

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>): JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = (): UseFormFieldReturn => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!itemContext) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useFormField should be used within <FormItem>");
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

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined,
);

function FormItem({
  className,
  style: _style,
  children,
}: FormItemProps): JSX.Element {
  const id = React.useId();
  const viewClassName = cn("space-y-1", className);

  return (
    <FormItemContext.Provider value={{ id }}>
      <StyledView className={viewClassName}>{children}</StyledView>
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

function FormLabel({
  className,
  children,
  htmlFor: _htmlFor,
}: LabelRootProps): JSX.Element {
  const { error, formItemId } = useFormField();
  const labelClassName = cn("px-px", error && "text-destructive", className);

  return (
    <Label htmlFor={formItemId} className={labelClassName}>
      {children}
    </Label>
  );
}
FormLabel.displayName = "FormLabel";

function FormDescription({
  children,
  className,
}: Pick<FormDescriptionProps, "children" | "className">): JSX.Element {
  const { formDescriptionId } = useFormField();

  return (
    <Span
      id={formDescriptionId}
      className={className ?? "text-sm text-muted-foreground pt-1"}
    >
      {children}
    </Span>
  );
}
FormDescription.displayName = "FormDescription";

function FormMessage({
  children,
  className,
}: Pick<FormMessageProps, "children" | "className">): JSX.Element | null {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <StyledAnimatedText
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      nativeID={formMessageId}
      className={className ?? "text-sm font-medium text-destructive"}
    >
      {body}
    </StyledAnimatedText>
  );
}
FormMessage.displayName = "FormMessage";

function FormInput({
  label,
  description,
  onChange,
  style: _style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Input>, "onChangeText"> & {
  label?: string;
  description?: string;
  onChange?: (value: string) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  // Note: style prop is excluded due to StyleType discriminated union
  return (
    <FormItem>
      {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}

      <Input
        aria-labelledby={formItemId}
        aria-describedby={
          error
            ? `${formDescriptionId} ${formMessageId}`
            : `${formDescriptionId}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormInput.displayName = "FormInput";

function FormTextarea({
  label,
  description,
  onChange,
  style: _style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Textarea>, "onChangeText"> & {
  label?: string;
  description?: string;
  onChange?: (value: string) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  // Note: style prop is excluded due to StyleType discriminated union
  return (
    <FormItem>
      {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}

      <Textarea
        aria-labelledby={formItemId}
        aria-describedby={
          error
            ? `${formDescriptionId} ${formMessageId}`
            : `${formDescriptionId}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormTextarea.displayName = "FormTextarea";

function FormCheckbox({
  label,
  description,
  value,
  onChange,
  style: _style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox>,
  "checked" | "onCheckedChange"
> & {
  label?: string;
  description?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  return (
    <FormItem className={formItemClassName}>
      <StyledView className={viewClassName}>
        <Checkbox
          aria-labelledby={formItemId}
          aria-describedby={
            error
              ? `${formDescriptionId} ${formMessageId}`
              : `${formDescriptionId}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
      </StyledView>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormCheckbox.displayName = "FormCheckbox";

function FormDatePicker({
  label,
  description,
  value,
  onChange,
}: FormDatePickerProps): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  const buttonClassName = "flex-row gap-3 justify-start px-3 relative";
  const clearButtonClassName = "absolute right-0 active:opacity-70 pr-3";
  const bottomSheetViewClassName = "pt-2";

  return (
    <FormItem>
      {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
      <BottomSheet>
        <BottomSheetOpenTrigger asChild>
          <Button
            variant="outline"
            className={buttonClassName}
            aria-labelledby={formItemId}
            aria-describedby={
              error
                ? `${formDescriptionId} ${formMessageId}`
                : `${formDescriptionId}`
            }
            aria-invalid={!!error}
          >
            <CalendarIcon size={18} />
            <Span className="flex-1 text-left">
              {value ? new Date(value).toLocaleDateString() : "Pick a date"}
            </Span>
            {!!value && (
              <Pressable
                className={clearButtonClassName}
                onPress={(): void => {
                  onChange?.("");
                }}
              >
                <X size={18} />
              </Pressable>
            )}
          </Button>
        </BottomSheetOpenTrigger>
        <BottomSheetContent>
          <BottomSheetView className={bottomSheetViewClassName}>
            <Calendar
              selected={value ? new Date(value) : undefined}
              onSelect={(date): void => {
                onChange?.(date?.toISOString().split("T")[0] ?? "");
              }}
            />
          </BottomSheetView>
        </BottomSheetContent>
      </BottomSheet>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormDatePicker.displayName = "FormDatePicker";

function FormRadioGroup({
  label,
  description,
  value,
  onChange,
  style: _style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroup>,
  "onValueChange" | "value"
> & {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  // Note: style prop is excluded due to StyleType discriminated union
  return (
    <FormItem className="gap-3">
      <View>
        {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
        {!!description && <FormDescription>{description}</FormDescription>}
      </View>
      <RadioGroup
        aria-labelledby={formItemId}
        aria-describedby={
          error
            ? `${formDescriptionId} ${formMessageId}`
            : `${formDescriptionId}`
        }
        aria-invalid={!!error}
        onValueChange={onChange}
        value={value}
        {...props}
      />
      <FormMessage />
    </FormItem>
  );
}

FormRadioGroup.displayName = "FormRadioGroup";

function FormCombobox({
  label,
  description,
  value,
  onChange,
  options = [],
}: FormComboboxProps): JSX.Element {
  const { formItemId } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
      <Select
        value={value?.value}
        onValueChange={(val) => onChange?.({ label: val, value: val })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option): JSX.Element | null => {
            if (!option) {
              return null;
            }
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {!!description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}

FormCombobox.displayName = "FormCombobox";

/**
 * @prop {children}
 * @example
 *  <SelectTrigger className='w-[250px]'>
      <SelectValue
        className='text-foreground text-sm text-lg'
        placeholder='Select a fruit'
      />
    </SelectTrigger>
    <SelectContent insets={contentInsets} className='w-[250px]'>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem label='Apple' value='apple'>
          Apple
        </SelectItem>
      </SelectGroup>
    </SelectContent>
 */
function FormSelect({
  label,
  description,
  onChange,
  value,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof Select>,
  "open" | "onOpenChange" | "onValueChange" | "value"
> & {
  label?: string;
  description?: string;
  value?: Partial<Option>;
  onChange: (value: { label: string; value: string }) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
      <Select
        aria-labelledby={formItemId}
        aria-describedby={
          error
            ? `${formDescriptionId} ${formMessageId}`
            : `${formDescriptionId}`
        }
        aria-invalid={!!error}
        value={value?.value}
        onValueChange={(val) => onChange({ label: val, value: val })}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormSelect.displayName = "FormSelect";

function FormSwitch({
  label,
  description,
  value,
  onChange,
  style: _style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof Switch>,
  "checked" | "onCheckedChange"
> & {
  label?: string;
  description?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  // Note: style prop is excluded due to StyleType discriminated union
  return (
    <FormItem className={formItemClassName}>
      <StyledView className={viewClassName}>
        <Switch
          aria-labelledby={formItemId}
          aria-describedby={
            error
              ? `${formDescriptionId} ${formMessageId}`
              : `${formDescriptionId}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && <FormLabel htmlFor={formItemId}>{label}</FormLabel>}
      </StyledView>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormSwitch.displayName = "FormSwitch";

export {
  Form,
  FormCheckbox,
  // FormCombobox, // TODO: Implement Combobox component
  // FormDatePicker, // TODO: Implement Calendar and BottomSheet components
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
  useFormField,
};

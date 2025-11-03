// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui

import * as React from "react";
import type { JSX, ReactNode } from "react";
import type {
  ControllerProps,
  FieldError,
  FieldPath,
  FieldValues,
  Noop,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { Pressable, View } from "react-native";
import { FadeInDown, FadeOut } from "react-native-reanimated";

import { StyledAnimatedText } from "../lib/styled";
import { cn } from "../lib/utils";
import { styled } from "nativewind";
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

const StyledView = styled(View);

const Form = FormProvider;

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
}: ControllerProps<TFieldValues, TName>): JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

interface UseFormFieldReturn {
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  error?: FieldError;
  id: string;
  name: string;
  nativeID: string;
  formItemId: string;
  formItemNativeID: string;
  formDescriptionId: string;
  formDescriptionNativeID: string;
  formMessageId: string;
  formMessageNativeID: string;
  handleSubmit: UseFormHandleSubmit<FieldValues, FieldValues>;
}

const useFormField = (): UseFormFieldReturn => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useFormField should be used within <FormField>");
  }

  const { nativeID } = itemContext;

  return {
    id: nativeID,
    nativeID,
    name: fieldContext.name,
    formItemId: `${nativeID}-form-item`,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionId: `${nativeID}-form-item-description`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageId: `${nativeID}-form-item-message`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};

interface FormItemContextValue {
  nativeID: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View> & { className?: string }): JSX.Element {
  const nativeID = React.useId();
  const viewClassName = cn("space-y-2", className);

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <StyledView className={viewClassName} {...props} />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>): JSX.Element {
  const { error, formItemNativeID } = useFormField();
  const labelClassName = cn(
    "pb-1 native:pb-2 px-px",
    error && "text-destructive",
    className,
  );

  return (
    <Label
      nativeID={formItemNativeID}
      className={labelClassName}
      {...props}
    />
  );
}
FormLabel.displayName = "FormLabel";

interface FormDescriptionProps {
  children?: ReactNode;
}

function FormDescription({ ...props }: FormDescriptionProps): JSX.Element {
  const { formDescriptionNativeID } = useFormField();

  return (
    <Span
      nativeID={formDescriptionNativeID}
      className="text-sm text-muted-foreground pt-1"
      {...props}
    />
  );
}
FormDescription.displayName = "FormDescription";

interface FormMessageProps {
  children?: ReactNode;
}

function FormMessage({ children }: FormMessageProps): JSX.Element | null {
  const { error, formMessageNativeID } = useFormField();
  const body = error ? String(error?.message) : children;
  const messageClassName = "text-sm font-medium text-destructive";

  if (!body) {
    return null;
  }

  return (
    <StyledAnimatedText
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      nativeID={formMessageNativeID}
      className={messageClassName}
    >
      {body}
    </StyledAnimatedText>
  );
}
FormMessage.displayName = "FormMessage";

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
  name: string;
  onBlur: Noop;
  onChange: (val: T) => void;
  value: T;
  disabled?: boolean;
}

type FormItemProps<T extends React.ElementType, U> = Override<
  React.ComponentPropsWithoutRef<T>,
  FormFieldFieldProps<U>
> & {
  label?: string;
  description?: string;
};

function FormInput({
  label,
  description,
  onChange,
  ...props
}: FormItemProps<typeof Input, string>): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID}>
          {label}
        </FormLabel>
      )}

      <Input
        aria-labelledby={formItemNativeID}
        aria-describedby={
          error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`
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
  ...props
}: FormItemProps<typeof Textarea, string>): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID}>
          {label}
        </FormLabel>
      )}

      <Textarea
        aria-labelledby={formItemNativeID}
        aria-describedby={
          error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`
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
  ...props
}: Omit<FormItemProps<typeof Checkbox, boolean>, "checked" | "onCheckedChange">): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  return (
    <FormItem className={formItemClassName}>
      <StyledView className={viewClassName}>
        <Checkbox
          aria-labelledby={formItemNativeID}
          aria-describedby={
            error
              ? `${formDescriptionNativeID} ${formMessageNativeID}`
              : `${formDescriptionNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel nativeID={formItemNativeID}>
            {label}
          </FormLabel>
        )}
      </StyledView>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

FormCheckbox.displayName = "FormCheckbox";

interface FormDatePickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function FormDatePicker({
  label,
  description,
  value,
  onChange
}: FormDatePickerProps): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  const buttonClassName = "flex-row gap-3 justify-start px-3 relative";
  const clearButtonClassName = "absolute right-0 active:opacity-70 native:pr-3";
  const bottomSheetViewClassName = "pt-2";

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <BottomSheet>
        <BottomSheetOpenTrigger asChild>
          <Button
            variant="outline"
            className={buttonClassName}
            aria-labelledby={formItemNativeID}
            aria-describedby={
              error
                ? `${formDescriptionNativeID} ${formMessageNativeID}`
                : `${formDescriptionNativeID}`
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
  ...props
}: Omit<FormItemProps<typeof RadioGroup, string>, "onValueChange">): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem className="gap-3">
      <View>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        {!!description && (
          <FormDescription>{description}</FormDescription>
        )}
      </View>
      <RadioGroup
        aria-labelledby={formItemNativeID}
        aria-describedby={
          error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`
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

interface FormComboboxProps {
  label?: string;
  description?: string;
  value?: Option;
  onChange?: (value: Option) => void;
  options?: Option[];
}

function FormCombobox({
  label,
  description,
  value,
  onChange,
  options = []
}: FormComboboxProps): JSX.Element {
  const { formItemNativeID, formDescriptionNativeID: _formDescriptionNativeID } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option): JSX.Element | null => {
            if (!option) {
              return null;
            }
            return (
              <SelectItem key={option.value} value={option.value} label={option.label}>
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
        className='text-foreground text-sm native:text-lg'
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
  FormItemProps<typeof Select, Partial<Option>>,
  "open" | "onOpenChange" | "onValueChange"
>): JSX.Element {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select
        aria-labelledby={formItemNativeID}
        aria-describedby={
          error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`
        }
        aria-invalid={!!error}
        value={
          value
            ? { label: value?.label ?? "", value: value?.label ?? "" }
            : undefined
        }
        onValueChange={onChange}
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
  ...props
}: Omit<FormItemProps<typeof Switch, boolean>, "checked" | "onCheckedChange">): JSX.Element {
  const switchRef = React.useRef<React.ComponentRef<typeof Switch>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  return (
    <FormItem className={formItemClassName}>
      <StyledView className={viewClassName}>
        <Switch
          ref={switchRef}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            error
              ? `${formDescriptionNativeID} ${formMessageNativeID}`
              : `${formDescriptionNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel nativeID={formItemNativeID}>
            {label}
          </FormLabel>
        )}
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

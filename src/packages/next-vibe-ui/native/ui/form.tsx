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
import { View } from "react-native";
import { FadeInDown, FadeOut } from "react-native-reanimated";

import { StyledAnimatedText } from "../lib/styled";
import { cn } from "../lib/utils";
import {
  BottomSheet,
  BottomSheetCloseTrigger,
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
import { Text } from "./text";
import { Textarea } from "./textarea";
import { Span } from "./span";

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

const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { className?: string }
>(({ className, ...props }, ref) => {
  const nativeID = React.useId();
  const viewClassName = cn("space-y-2", className);

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View ref={ref} {...({ ...props, className: viewClassName } as any)} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemNativeID } = useFormField();
  const labelClassName = cn(
    "pb-1 native:pb-2 px-px",
    error && "text-destructive",
    className,
  );

  return (
    <Label
      ref={ref}
      {...({
        nativeID: formItemNativeID,
        className: labelClassName,
        ...props,
      } as any)}
    />
  );
});
FormLabel.displayName = "FormLabel";

interface FormDescriptionProps {
  children?: ReactNode;
}

const FormDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  FormDescriptionProps
>(({ ...props }, ref) => {
  const { formDescriptionNativeID } = useFormField();

  return (
    <Span
      ref={ref}
      {...({
        nativeID: formDescriptionNativeID,
        className: "text-sm text-muted-foreground pt-1",
        ...props,
      } as any)}
    />
  );
});
FormDescription.displayName = "FormDescription";

interface FormMessageProps {
  children?: ReactNode;
}

const FormMessage = React.forwardRef<
  React.ElementRef<typeof StyledAnimatedText>,
  FormMessageProps
>(({ children }, ref) => {
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
      ref={ref}
      nativeID={formMessageNativeID}
      className={messageClassName}
    >
      {body}
    </StyledAnimatedText>
  );
});
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

const FormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  FormItemProps<typeof Input, string>
>(({ label, description, onChange, ...props }, ref) => {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, (): React.ComponentRef<typeof Input> => {
    if (!inputRef.current) {
      return {} as React.ComponentRef<typeof Input>;
    }
    return inputRef.current;
  }, []);

  function handleOnLabelPress(): void {
    if (!inputRef.current) {
      return;
    }
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel {...({ nativeID: formItemNativeID, onPress: handleOnLabelPress } as any)}>
          {label}
        </FormLabel>
      )}

      <Input
        ref={inputRef}
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
});

FormInput.displayName = "FormInput";

const FormTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  FormItemProps<typeof Textarea, string>
>(({ label, description, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<React.ComponentRef<typeof Textarea>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, (): React.ComponentRef<typeof Textarea> => {
    if (!textareaRef.current) {
      return {} as React.ComponentRef<typeof Textarea>;
    }
    return textareaRef.current;
  }, []);

  function handleOnLabelPress(): void {
    if (!textareaRef.current) {
      return;
    }
    if (textareaRef.current.isFocused()) {
      textareaRef.current?.blur();
    } else {
      textareaRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel {...({ nativeID: formItemNativeID, onPress: handleOnLabelPress } as any)}>
          {label}
        </FormLabel>
      )}

      <Textarea
        ref={textareaRef}
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
});

FormTextarea.displayName = "FormTextarea";

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  Omit<FormItemProps<typeof Checkbox, boolean>, "checked" | "onCheckedChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  function handleOnLabelPress(): void {
    onChange?.(!value);
  }

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  return (
    <FormItem className={formItemClassName}>
      <View {...({ className: viewClassName } as any)}>
        <Checkbox
          ref={ref}
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
          <FormLabel
            {...({
              nativeID: formItemNativeID,
              onPress: handleOnLabelPress,
            } as any)}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormCheckbox.displayName = "FormCheckbox";

interface FormDatePickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const FormDatePicker = React.forwardRef<React.ElementRef<typeof Button>, FormDatePickerProps>(
  ({ label, description, value, onChange }, ref) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();

    const buttonClassName = "flex-row gap-3 justify-start px-3 relative";
    const clearButtonClassName = "absolute right-0 active:opacity-70 native:pr-3";
    const bottomSheetViewClassName = "pt-2";
    const viewClassName = "pb-2 pt-4";

    return (
      <FormItem>
        {!!label && <FormLabel {...({ nativeID: formItemNativeID } as any)}>{label}</FormLabel>}
        <BottomSheet>
          <BottomSheetOpenTrigger asChild>
            <Button
              variant="outline"
              className={buttonClassName}
              ref={ref}
              aria-labelledby={formItemNativeID}
              aria-describedby={
                error
                  ? `${formDescriptionNativeID} ${formMessageNativeID}`
                  : `${formDescriptionNativeID}`
              }
              aria-invalid={!!error}
            >
              <CalendarIcon
                size={18}
              />
              <Span>
                {value ?? "Pick a date"}
              </Span>
              {!!value && (
                <Button
                  className={clearButtonClassName}
                  variant="ghost"
                  onPress={(): void => {
                    onChange?.("");
                  }}
                >
                  <X size={18} />
                </Button>
              )}
            </Button>
          </BottomSheetOpenTrigger>
          <BottomSheetContent>
            <BottomSheetView className={bottomSheetViewClassName}>
              <Calendar
                selected={value ? new Date(value) : undefined}
                onSelect={(date): void => {
                  onChange?.(date ? date.toISOString().split("T")[0] : "");
                }}
              />
              <View {...({ className: viewClassName } as any)}>
                <BottomSheetCloseTrigger asChild>
                  <Button>
                    <Span>Close</Span>
                  </Button>
                </BottomSheetCloseTrigger>
              </View>
            </BottomSheetView>
          </BottomSheetContent>
        </BottomSheet>
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  },
);

FormDatePicker.displayName = "FormDatePicker";

const FormRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  Omit<FormItemProps<typeof RadioGroup, string>, "onValueChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem className="gap-3">
      <View>
        {!!label && <FormLabel {...({ nativeID: formItemNativeID } as any)}>{label}</FormLabel>}
        {!!description && (
          <FormDescription>{description}</FormDescription>
        )}
      </View>
      <RadioGroup
        ref={ref}
        {...({
          "aria-labelledby": formItemNativeID,
          "aria-describedby": error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`,
          "aria-invalid": !!error,
          onValueChange: onChange,
          value,
          ...props,
        } as any)}
      />

      <FormMessage />
    </FormItem>
  );
});

FormRadioGroup.displayName = "FormRadioGroup";

interface FormComboboxProps {
  label?: string;
  description?: string;
  value?: Option;
  onChange?: (value: Option) => void;
  options?: Option[];
}

const FormCombobox = React.forwardRef<React.ElementRef<typeof SelectTrigger>, FormComboboxProps>(
  ({ label, description, value, onChange, options = [] }, ref) => {
    const { formItemNativeID, formDescriptionNativeID: _formDescriptionNativeID } = useFormField();

    return (
      <FormItem>
        {!!label && <FormLabel {...({ nativeID: formItemNativeID } as any)}>{label}</FormLabel>}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger {...({ ref } as any)}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent {...({} as any)}>
            {options.map((option): JSX.Element | null => {
              if (!option) {
                return null;
              }
              return (
                <SelectItem
                  {...({
                    key: option.value,
                    label: option.label,
                    value: option.value,
                  } as any)}
                />
              );
            })}
          </SelectContent>
        </Select>
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  },
);

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
const FormSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  Omit<
    FormItemProps<typeof Select, Partial<Option>>,
    "open" | "onOpenChange" | "onValueChange"
  >
>(({ label, description, onChange, value, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel {...({ nativeID: formItemNativeID } as any)}>{label}</FormLabel>}
      <Select
        {...({
          ref,
          "aria-labelledby": formItemNativeID,
          "aria-describedby": error
            ? `${formDescriptionNativeID} ${formMessageNativeID}`
            : `${formDescriptionNativeID}`,
          "aria-invalid": !!error,
          value: value
            ? { label: value?.label ?? "", value: value?.label ?? "" }
            : undefined,
          onValueChange: onChange,
          ...props,
        } as any)}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormSelect.displayName = "FormSelect";

const FormSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  Omit<FormItemProps<typeof Switch, boolean>, "checked" | "onCheckedChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const switchRef = React.useRef<React.ComponentRef<typeof Switch>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, (): React.ComponentRef<typeof Switch> => {
    if (!switchRef.current) {
      return {} as React.ComponentRef<typeof Switch>;
    }
    return switchRef.current;
  }, []);

  function handleOnLabelPress(): void {
    onChange?.(!value);
  }

  const formItemClassName = "px-1";
  const viewClassName = "flex-row gap-3 items-center";

  return (
    <FormItem className={formItemClassName}>
      <View {...({ className: viewClassName } as any)}>
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
          <FormLabel
            {...({
              nativeID: formItemNativeID,
              onPress: handleOnLabelPress,
            } as any)}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

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

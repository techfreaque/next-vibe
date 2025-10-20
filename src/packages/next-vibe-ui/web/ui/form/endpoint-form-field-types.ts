/**
 * Type definitions for Endpoint Form Field Component
 * Provides type-safe field definitions for use with useEndpoint hook
 */

import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import type { Countries } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { FormFieldCategory } from "../autocomplete-field";

// Base field configuration
export interface BaseFieldConfig {
  label: TranslationKey | undefined;
  placeholder?: TranslationKey;
  description?: TranslationKey;
  disabled?: boolean;
  className?: string;
}

// Field type specific configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "tel" | "url" | "password";
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldConfig<TValue = string> extends BaseFieldConfig {
  type: "select";
  options: Array<{
    value: TValue;
    label: TranslationKey;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
  }>;
  placeholder?: TranslationKey;
}

export type CheckboxFieldConfig = BaseFieldConfig & {
  type: "checkbox";
} & (
    | {
        checkboxLabel?: TranslationKey;
        checkboxLabelJsx?: never;
      }
    | {
        checkboxLabel?: never;
        checkboxLabelJsx: ReactNode;
      }
  );

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: Array<{ value: string; label: TranslationKey; disabled?: boolean }>;
  orientation?: "horizontal" | "vertical";
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
  switchLabel?: TranslationKey; // Different from main label for switch-specific text
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
}

export interface AutocompleteFieldConfig extends BaseFieldConfig {
  type: "autocomplete";
  options: Array<{
    value: string;
    label: TranslationKey;
    category?: string;
  }>;
  allowCustom?: boolean;
  searchPlaceholder?: TranslationKey;
}

export interface TagsFieldConfig extends BaseFieldConfig {
  type: "tags";
  suggestions?: Array<{
    value: string;
    label: TranslationKey;
    category?: string;
  }>;
  maxTags?: number;
  allowCustom?: boolean;
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: "phone";
  defaultCountry: Countries;
  preferredCountries: Countries[];
}

export interface ColorPickerFieldConfig extends BaseFieldConfig {
  type: "color";
  presetColors?: string[];
  allowCustom?: boolean;
}

export interface SliderFieldConfig extends BaseFieldConfig {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  formatValue?: (value: number) => string;
}

export interface MultiSelectFieldConfig extends BaseFieldConfig {
  type: "multiselect";
  options: Array<{
    value: string;
    label: TranslationKey;
    disabled?: boolean;
    icon?: string;
  }>;
  maxSelections?: number;
  searchable?: boolean;
}

export interface LocationFieldConfig extends BaseFieldConfig {
  type: "location";
  types?: Array<"country" | "city" | "region">;
  multiple?: boolean;
}

export interface YearPickerFieldConfig extends BaseFieldConfig {
  type: "year";
  minYear?: number;
  maxYear?: number;
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig<string>
  | CheckboxFieldConfig
  | RadioFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | AutocompleteFieldConfig
  | TagsFieldConfig
  | PhoneFieldConfig
  | ColorPickerFieldConfig
  | SliderFieldConfig
  | MultiSelectFieldConfig
  | LocationFieldConfig
  | YearPickerFieldConfig;

// Required field styling options
export type RequiredFieldStyle =
  | "highlight" // Highlight required fields with colored borders/backgrounds
  | "asterisk" // Show asterisk for required fields
  | "badge" // Show "Required" badge
  | "none"; // No special styling for required fields

// Form styling theme for required fields
export interface RequiredFieldTheme {
  style: RequiredFieldStyle;
  showAllRequired?: boolean; // If true, show required styling even when all fields are required
  requiredColor?: "amber" | "red" | "blue" | "green"; // Color theme for required field highlighting
  completedColor?: "green" | "blue" | "purple"; // Color theme for completed required fields
}

// Field validation state
export interface FieldValidationState {
  hasError: boolean;
  hasValue: boolean;
  isRequired: boolean;
  errorMessage?: string;
}

// Field styling classes
export interface FieldStyleClassName {
  containerClassName: string;
  labelClassName: string;
  inputClassName: string;
  errorClassName: string;
  descriptionClassName: string;
}

// Type to extract the value type of a specific field from form values
type FieldValueType<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = TFieldValues[TName];

// Type-safe field config that adapts based on the field value type
export type TypeSafeFieldConfig<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig<FieldValueType<TFieldValues, TName>>
  | CheckboxFieldConfig
  | RadioFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | AutocompleteFieldConfig
  | TagsFieldConfig
  | PhoneFieldConfig
  | ColorPickerFieldConfig
  | SliderFieldConfig
  | MultiSelectFieldConfig
  | LocationFieldConfig
  | YearPickerFieldConfig;

// Generic field props for type safety with form control
export interface EndpointFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  config: FieldConfig;
  control: Control<TFieldValues>; // Properly typed form control from useEndpoint
  requiredFields?: string[]; // List of required field names
  theme?: RequiredFieldTheme;
  className?: string;
}

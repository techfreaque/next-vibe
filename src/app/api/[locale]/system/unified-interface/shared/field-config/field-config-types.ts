/**
 * Type definitions for Endpoint Form Field Component
 * Provides type-safe field definitions for use with useEndpoint hook
 *
 * This is the shared version - platform-specific code should import from here
 */

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { Countries, CountryLanguage } from "@/i18n/core/config";

import type { CreateApiEndpointAny } from "../types/endpoint-base";

export interface EndpointFormFieldProps<
  TEndpoint extends CreateApiEndpointAny,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TKey extends string,
> {
  name: TName;
  config?: FieldConfig<TKey>; // Optional - override of endpoint-based field settings
  control: Control<TFieldValues>; // Properly typed form control from useEndpoint
  endpoint: TEndpoint; // Required - provides schema, scopedT, and endpointFields
  theme?: RequiredFieldTheme;
  className?: string;
  locale: CountryLanguage; // Required for scoped translations
}

/**
 * Prefill display configuration for form fields
 * When a field has a prefilled value from server/URL params, this controls how it's displayed
 */
export interface PrefillDisplayConfig<TKey extends string> {
  /** Display variant when field is prefilled */
  variant: "badge" | "highlight" | "card";
  /** Translation key for the label shown with prefilled value */
  labelKey?: NoInfer<TKey>;
  /** Icon to show with prefilled value */
  icon?: IconKey;
}

// Base field configuration
export interface BaseFieldConfig<TKey extends string> {
  label: NoInfer<TKey> | undefined;
  placeholder?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  disabled?: boolean;
  className?: string;
  /**
   * Make field readonly - displays value but cannot be edited
   * Use with prefillDisplay to show special styling for server-provided values
   */
  readonly?: boolean;
  /**
   * Configure how prefilled values are displayed when readonly
   * Only applies when field has a prefilled value and readonly is true
   */
  prefillDisplay?: PrefillDisplayConfig<TKey>;
}

// Field type specific configurations
export interface TextFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "text" | "email" | "tel" | "url" | "password";
}

export interface NumberFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldConfig<
  TTranslationKey extends string,
  TValue = string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "select";
  options: Array<{
    value: TValue;
    label: NoInfer<TTranslationKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
  }>;
  placeholder?: NoInfer<TTranslationKey>;
}

export interface CheckboxFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "checkbox";
  checkboxLabel?: NoInfer<TTranslationKey>;
}

export interface RadioFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "radio";
  options: Array<{
    value: string;
    label: NoInfer<TTranslationKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
  }>;
  orientation?: "horizontal" | "vertical";
}

export interface SwitchFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "switch";
  switchLabel?: NoInfer<TTranslationKey>;
}

export interface DateFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
}

export interface AutocompleteFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "autocomplete";
  options: Array<{
    value: string;
    label: NoInfer<TTranslationKey>;
    category?: string;
  }>;
  allowCustom?: boolean;
  searchPlaceholder?: NoInfer<TTranslationKey>;
}

export interface TagsFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "tags";
  suggestions?: Array<{
    value: string;
    label: NoInfer<TTranslationKey>;
    category?: string;
  }>;
  maxTags?: number;
  allowCustom?: boolean;
}

export interface PhoneFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "phone";
  defaultCountry: Countries;
  preferredCountries: Countries[];
}

export interface ColorPickerFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "color";
  presetColors?: string[];
  allowCustom?: boolean;
}

export interface SliderFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  formatValue?: (value: number) => string;
}

export interface MultiSelectFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "multiselect";
  options: Array<{
    value: string;
    label: NoInfer<TTranslationKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
    icon?: IconKey;
  }>;
  maxSelections?: number;
  searchable?: boolean;
}

export interface LocationFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "location";
  types?: Array<"country" | "city" | "region">;
  multiple?: boolean;
}

export interface YearPickerFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "year";
  minYear?: number;
  maxYear?: number;
}

export interface IconFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "icon";
}

export interface FilterPillsFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "filter_pills";
  options: Array<{
    value: string;
    label: NoInfer<TTranslationKey>;
    icon?: IconKey;
    disabled?: boolean;
  }>;
}

export interface RangeSliderFieldConfig<
  TTranslationKey extends string,
> extends BaseFieldConfig<TTranslationKey> {
  type: "range_slider";
  options: Array<{
    value: string | number;
    label: NoInfer<TTranslationKey>;
    icon?: IconKey;
    description?: NoInfer<TTranslationKey>;
  }>;
  minLabel?: NoInfer<TTranslationKey>;
  maxLabel?: NoInfer<TTranslationKey>;
  minDefault?: string | number;
  maxDefault?: string | number;
  disabled?: boolean;
}

// Union type for all field configurations
export type FieldConfig<TTranslationKey extends string> =
  | TextFieldConfig<TTranslationKey>
  | NumberFieldConfig<TTranslationKey>
  | TextareaFieldConfig<TTranslationKey>
  | SelectFieldConfig<TTranslationKey, string>
  | CheckboxFieldConfig<TTranslationKey>
  | RadioFieldConfig<TTranslationKey>
  | SwitchFieldConfig<TTranslationKey>
  | DateFieldConfig<TTranslationKey>
  | AutocompleteFieldConfig<TTranslationKey>
  | TagsFieldConfig<TTranslationKey>
  | PhoneFieldConfig<TTranslationKey>
  | ColorPickerFieldConfig<TTranslationKey>
  | SliderFieldConfig<TTranslationKey>
  | MultiSelectFieldConfig<TTranslationKey>
  | LocationFieldConfig<TTranslationKey>
  | YearPickerFieldConfig<TTranslationKey>
  | IconFieldConfig<TTranslationKey>
  | FilterPillsFieldConfig<TTranslationKey>
  | RangeSliderFieldConfig<TTranslationKey>;

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

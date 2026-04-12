/**
 * Endpoint Form Field Component
 * A comprehensive form field component that integrates with useEndpoint hook
 * Supports multiple field types, required field styling, and Zod validation
 */

"use client";

import { AlertCircle, Calendar } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { safeGetRequiredFields } from "next-vibe/shared/utils/zod-required-fields";
import type { JSX } from "react";
import * as React from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import type {
  FieldConfig,
  FieldStyleClassName,
  FieldValidationState,
  PrefillDisplayConfig,
  RequiredFieldTheme,
} from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";
import { getFieldConfig } from "@/app/api/[locale]/system/unified-interface/shared/field-config/infer-field-config";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getTheme } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/_shared/constants";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  scopedTranslation as unifiedInterfaceScopedTranslation,
  type UnifiedInterfaceT,
} from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import { AutocompleteField } from "../autocomplete-field";
import { Badge } from "../badge";
import { Button } from "../button";
import { Calendar as CalendarComponent } from "../calendar";
import { Checkbox } from "../checkbox";
import { IconPicker } from "../icon-picker";
import { Info } from "../icons/Info";
import { Input } from "../input";
import { Label } from "../label";
import { MultiSelect } from "../multi-select";
import { NumberInput } from "../number-input";
import { PhoneField } from "../phone-field";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { RangeSlider } from "../range-slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Span } from "../span";
import { Switch } from "../switch";
import { TagsField } from "../tags-field";
import { Textarea } from "../textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

// Constants
const OPTION_KEY_PREFIX = "option-";

// Type for form field errors
export interface FormFieldError {
  message?: string;
  type?: string;
}

/**
 * Get field validation state
 */
function getFieldValidationState<T>(
  fieldValue: T,
  error: FormFieldError | undefined,
  isRequired: boolean,
): FieldValidationState {
  const hasValue = Boolean(
    fieldValue !== undefined &&
    fieldValue !== null &&
    fieldValue !== "" &&
    (Array.isArray(fieldValue) ? fieldValue.length > 0 : true),
  );

  return {
    hasError: Boolean(error),
    hasValue,
    isRequired,
    errorMessage: error?.message,
  };
}

/**
 * Get field styling classes based on validation state and theme
 */
function getFieldStyleClassName(
  validationState: FieldValidationState,
  theme: RequiredFieldTheme,
): FieldStyleClassName {
  const { hasError, hasValue, isRequired } = validationState;
  const { style, requiredColor = "blue", completedColor = "green" } = theme;

  // Base classes with consistent blueish focus and improved styling
  const baseInputClassName = cn(
    "transition-all duration-200 ease-in-out",
    "border border-input bg-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/20 focus-visible:border-info",
    "hover:border-info/60",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  const baseLabelClassName = cn(
    "text-sm font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-colors duration-200",
  );

  const baseContainerClassName = "flex flex-col gap-2";

  // Error state - consistent destructive styling with better spacing and improved dark mode readability
  if (hasError) {
    return {
      containerClassName: cn(
        baseContainerClassName,
        "p-4 rounded-lg border border-destructive/20 dark:border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
      ),
      labelClassName: cn(baseLabelClassName, "text-destructive font-semibold"),
      inputClassName: cn(
        baseInputClassName,
        "border-destructive/30 dark:border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20",
        "bg-destructive/5 dark:bg-destructive/8",
      ),
      errorClassName: cn(
        "text-sm text-destructive flex items-center gap-2 mt-2",
        "[&>svg]:text-destructive",
      ),
      descriptionClassName: "text-sm text-muted-foreground",
      inlineDescriptionClassName: "text-sm text-muted-foreground",
    };
  }

  // Required field styling with blueish theme
  if (isRequired && style === "highlight") {
    if (hasValue) {
      // Required field with value - success state with better styling
      const successVariants = {
        green: {
          containerClassName:
            "p-4 rounded-lg border border-success/20 dark:border-success/30 bg-success/5 bg-linear-to-br from-success/5 to-success/3 dark:bg-success/10 dark:from-success/10 dark:to-success/5",
          labelClassName: "text-success font-semibold",
          inputClassName:
            "border-success/30 dark:border-success/50 focus-visible:border-success focus-visible:ring-success/30 bg-success/5 dark:bg-success/8",
          descriptionClassName: "text-success",
        },
        blue: {
          containerClassName:
            "p-4 rounded-lg border border-info/20 dark:border-info/30 bg-info/5 bg-linear-to-br from-info/5 to-info/3 dark:bg-info/10 dark:from-info/10 dark:to-info/5",
          labelClassName: "text-info font-semibold",
          inputClassName:
            "border-info/30 dark:border-info/50 focus-visible:border-info focus-visible:ring-info/30 bg-info/5 dark:bg-info/8",
          descriptionClassName: "text-info",
        },
        purple: {
          containerClassName:
            "p-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 bg-linear-to-br from-primary/5 to-primary/3 dark:bg-primary/10 dark:from-primary/10 dark:to-primary/5",
          labelClassName: "text-primary font-semibold",
          inputClassName:
            "border-primary/30 dark:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/30 bg-primary/5 dark:bg-primary/8",
          descriptionClassName: "text-primary",
        },
      };

      const colors = successVariants[completedColor];
      return {
        containerClassName: cn(
          baseContainerClassName,
          colors.containerClassName,
        ),
        labelClassName: cn(baseLabelClassName, colors.labelClassName),
        inputClassName: cn(baseInputClassName, colors.inputClassName),
        errorClassName: cn(
          "text-sm text-destructive flex items-center gap-2 mt-2",
          "[&>svg]:text-destructive",
        ),
        descriptionClassName: cn("text-sm", colors.descriptionClassName),
        inlineDescriptionClassName: "text-sm text-muted-foreground",
      };
    }
    // Required field without value - enhanced blueish highlight
    const colorVariantsClassName = {
      blue: {
        containerClassName:
          "p-4 rounded-lg border border-info/30 dark:border-info/40 bg-info/5 bg-linear-to-br from-info/5 to-info/3 dark:bg-info/10 dark:from-info/10 dark:to-info/5",
        labelClassName: "text-info font-semibold",
        inputClassName:
          "border-info/30 dark:border-info/50 focus-visible:border-info focus-visible:ring-info/30 bg-info/5 dark:bg-info/10 placeholder:text-info/60",
        descriptionClassName: "text-info",
      },
      amber: {
        containerClassName:
          "p-4 rounded-lg border border-warning/30 dark:border-warning/40 bg-warning/5 bg-linear-to-br from-warning/5 to-warning/3 dark:bg-warning/10 dark:from-warning/10 dark:to-warning/5",
        labelClassName: "text-warning font-semibold",
        inputClassName:
          "border-warning/30 dark:border-warning/50 focus-visible:border-warning focus-visible:ring-warning/30 bg-warning/5 dark:bg-warning/10",
        descriptionClassName: "text-warning",
      },
      red: {
        containerClassName:
          "p-4 rounded-lg border border-destructive/30 dark:border-destructive/40 bg-destructive/5 bg-linear-to-br from-destructive/5 to-destructive/3 dark:bg-destructive/10 dark:from-destructive/10 dark:to-destructive/5",
        labelClassName: "text-destructive font-semibold",
        inputClassName:
          "border-destructive/30 dark:border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/30 bg-destructive/5 dark:bg-destructive/10",
        descriptionClassName: "text-destructive",
      },
      green: {
        containerClassName:
          "p-4 rounded-lg border border-success/30 dark:border-success/40 bg-success/5 bg-linear-to-br from-success/5 to-success/3 dark:bg-success/10 dark:from-success/10 dark:to-success/5",
        labelClassName: "text-success font-semibold",
        inputClassName:
          "border-success/30 dark:border-success/50 focus-visible:border-success focus-visible:ring-success/30 bg-success/5 dark:bg-success/10",
        descriptionClassName: "text-success",
      },
    };

    const colors = colorVariantsClassName[requiredColor];
    return {
      containerClassName: cn(baseContainerClassName, colors.containerClassName),
      labelClassName: cn(baseLabelClassName, colors.labelClassName),
      inputClassName: cn(baseInputClassName, colors.inputClassName),
      errorClassName: cn(
        "text-sm text-destructive flex items-center gap-2 mt-2",
        "[&>svg]:text-destructive",
      ),
      descriptionClassName: cn("text-sm", colors.descriptionClassName),
      inlineDescriptionClassName: "text-sm text-muted-foreground",
    };
  }

  // Default styling - clean and minimal with blueish focus
  return {
    containerClassName: baseContainerClassName,
    labelClassName: cn(baseLabelClassName, "text-foreground"),
    inputClassName: baseInputClassName,
    errorClassName: cn(
      "text-sm text-destructive flex items-center gap-2 mt-2",
      "[&>svg]:text-destructive",
    ),
    descriptionClassName: "text-sm text-muted-foreground",
    inlineDescriptionClassName: "text-sm text-muted-foreground",
  };
}

/**
 * Render prefilled readonly display
 * Shows the prefilled value with styled card/badge based on prefillDisplay config
 */
function renderPrefillDisplay<TKey extends string>(
  value: string,
  label: TKey | undefined,
  prefillDisplay: PrefillDisplayConfig<TKey>,
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType,
): JSX.Element {
  const displayLabel = prefillDisplay.labelKey
    ? t(prefillDisplay.labelKey)
    : label
      ? t(label)
      : "";

  switch (prefillDisplay.variant) {
    case "card":
      return (
        <div className="p-3 bg-info/5 dark:bg-info/10 border border-info/20 dark:border-info/30 rounded-md">
          <p className="text-sm text-info">
            {displayLabel}: <span className="font-semibold">{value}</span>
          </p>
        </div>
      );
    case "highlight":
      return (
        <div className="p-4 rounded-lg border border-success/20 dark:border-success/30 bg-success/5 dark:bg-success/10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-success font-medium">
              {displayLabel}:
            </span>
            <span className="text-sm text-success font-semibold">{value}</span>
          </div>
        </div>
      );
    case "badge":
    default:
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{displayLabel}:</span>
          <Badge
            variant="secondary"
            className="bg-info/10 dark:bg-info/15 text-info border-info/20 dark:border-info/30"
          >
            {value}
          </Badge>
        </div>
      );
  }
}

function renderFieldInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TKey extends string,
>(
  config: FieldConfig<TKey>,
  field: ControllerRenderProps<TFieldValues, TName>,
  inputClassName: string,
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType, // Adapted translation for definition keys (uses scopedT when available)
  widgetT: UnifiedInterfaceT, // Scoped translation for hardcoded framework keys
  disabled?: boolean,
): JSX.Element {
  switch (config.type) {
    case "text":
    case "email":
    case "tel":
    case "url":
    case "password":
      return (
        <Input
          name={field.name}
          value={field.value ? t(field.value) : ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          type={config.type}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          disabled={disabled || config.disabled}
          className={cn(inputClassName, "h-10")}
        />
      );

    case "number":
      return (
        <NumberInput
          name={field.name}
          value={Number(field.value) || config.min || 1}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          min={config.min}
          max={config.max}
          step={config.step}
          disabled={disabled || config.disabled}
          className={inputClassName}
        />
      );

    case "textarea":
      return (
        <Textarea
          name={field.name}
          value={field.value ? t(field.value) : ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className={cn(inputClassName, "min-h-20 resize-none")}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          rows={config.rows || 3}
          maxLength={config.maxLength}
          disabled={disabled || config.disabled}
        />
      );

    case "select":
      return (
        <Select
          // Force re-render when value changes
          key={`${field.name}-${String(field.value) || "empty"}`}
          onValueChange={(value) => field.onChange(value)}
          value={
            field.value !== undefined && field.value !== null
              ? String(field.value)
              : undefined
          }
          disabled={disabled || config.disabled}
          name={field.name}
        >
          <SelectTrigger className={cn(inputClassName, "h-10")}>
            <SelectValue
              placeholder={
                config.placeholder ? t(config.placeholder) : undefined
              }
            />
          </SelectTrigger>
          <SelectContent>
            {config.options
              .filter(
                (option) =>
                  option.value !== undefined &&
                  option.value !== null &&
                  option.value !== "",
              )
              .map((option, index) => (
                <SelectItem
                  key={option.value ?? `${OPTION_KEY_PREFIX}${index}`}
                  value={option.value!}
                  disabled={option.disabled}
                >
                  {t(option.label, option.labelParams)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-3">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled || config.disabled}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor={field.name}
            className="text-sm font-normal cursor-pointer leading-relaxed"
          >
            {config.checkboxLabel
              ? t(config.checkboxLabel)
              : config.label
                ? t(config.label)
                : null}
          </Label>
        </div>
      );

    case "radio":
      return (
        <RadioGroup
          name={field.name}
          onValueChange={(value) => field.onChange(value)}
          value={String(field.value || "")}
          disabled={disabled || config.disabled}
          className={cn(
            "flex py-2",
            config.orientation === "horizontal"
              ? "flex-row gap-6"
              : "flex-col gap-3",
          )}
        >
          {config.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem
                value={option.value}
                id={`${field.name}-${option.value}`}
                disabled={option.disabled}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`${field.name}-${option.value}`}
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                {t(option.label)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "switch":
      return (
        <div className="flex items-center space-x-3 py-2">
          <Switch
            id={field.name}
            name={field.name}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled || config.disabled}
            className="data-[state=checked]:bg-primary"
          />
          {config.switchLabel && (
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              {t(config.switchLabel)}
            </Label>
          )}
        </div>
      );

    case "date": {
      const dateValue = field.value;
      const parsedDate = dateValue
        ? typeof dateValue === "string"
          ? new Date(dateValue)
          : dateValue
        : undefined;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                inputClassName,
                "w-full h-10 justify-start text-left font-normal",
                !dateValue && "text-muted-foreground",
              )}
              disabled={disabled || config.disabled}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateValue ? (
                parsedDate?.toLocaleDateString()
              ) : (
                <span>
                  {config.placeholder
                    ? t(config.placeholder)
                    : widgetT("widgets.formFields.common.selectDate")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={parsedDate}
              onSelect={(date) => field.onChange(date?.toISOString())}
              disabled={(date) => {
                if (config.minDate && date < config.minDate) {
                  return true;
                }
                if (config.maxDate && date > config.maxDate) {
                  return true;
                }
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      );
    }

    case "autocomplete":
      return (
        <AutocompleteField
          value={String(field.value || "")}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          options={(config.options || []).map((opt) => ({
            value: opt.value,
            label: t(opt.label),
          }))}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          searchPlaceholder={
            config.searchPlaceholder ? t(config.searchPlaceholder) : undefined
          }
          allowCustom={config.allowCustom ?? true}
          disabled={disabled || config.disabled}
          className={inputClassName}
          name={field.name}
        />
      );

    case "tags": {
      const tagsValue = Array.isArray(field.value) ? field.value : [];
      return (
        <TagsField
          value={tagsValue}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          suggestions={config.suggestions || []}
          placeholder={config.placeholder}
          maxTags={config.maxTags}
          allowCustom={config.allowCustom ?? true}
          disabled={disabled || config.disabled}
          className={inputClassName}
          name={field.name}
          t={t}
        />
      );
    }

    case "phone": {
      if (config.type !== "phone") {
        // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard for developer mistakes at runtime
        // eslint-disable-next-line i18next/no-literal-string -- Error handling for invalid config
        throw new Error("Invalid config type for phone field");
      }
      // Translate placeholder - use adapted t for definition keys, widgetT for hardcoded default
      const phonePlaceholder =
        config.placeholder !== undefined
          ? t(config.placeholder)
          : widgetT("widgets.formFields.common.enterPhoneNumber");
      return (
        <PhoneField
          value={String(field.value ?? "")}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          placeholder={phonePlaceholder}
          defaultCountry={config.defaultCountry ?? "GLOBAL"}
          preferredCountries={config.preferredCountries ?? ["GLOBAL"]}
          disabled={disabled ?? config.disabled}
          className={inputClassName}
          name={field.name}
        />
      );
    }

    case "multiselect": {
      const multiselectValue: string[] = Array.isArray(field.value)
        ? field.value
        : [];

      return (
        <MultiSelect
          options={config.options.map((opt) => ({
            value: opt.value,
            label: t(opt.label),
            disabled: opt.disabled,
          }))}
          value={multiselectValue}
          onChange={(newValue) => field.onChange(newValue)}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          disabled={disabled || config.disabled}
          maxSelections={config.maxSelections}
          searchable={config.searchable}
          className={inputClassName}
        />
      );
    }

    case "icon": {
      return (
        <IconPicker
          value={field.value as IconKey | undefined}
          onChange={(iconKey) => field.onChange(iconKey)}
          className={inputClassName}
          size="default"
          name={field.name}
        />
      );
    }

    case "filter_pills": {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {config.options.map((option) => {
            const isSelected = field.value === option.value;

            return (
              <Button
                key={`${option.value}`}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => {
                  if (!disabled && !config.disabled) {
                    field.onChange(option.value);
                  }
                }}
                disabled={disabled || config.disabled}
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 h-9 px-3 transition-all",
                  !isSelected && "hover:border-primary/50 hover:bg-primary/5",
                )}
              >
                {option.icon && (
                  <Icon
                    icon={option.icon}
                    className={cn(
                      "h-4 w-4",
                      isSelected && "text-primary-foreground",
                    )}
                  />
                )}
                <Span className="text-xs font-medium">{t(option.label)}</Span>
              </Button>
            );
          })}
        </div>
      );
    }

    case "range_slider": {
      // Calculate current indices from field values
      const minIndex =
        field.value?.min !== undefined
          ? config.options.findIndex((opt) => opt.value === field.value.min)
          : config.minDefault !== undefined
            ? config.options.findIndex((opt) => opt.value === config.minDefault)
            : 0;

      const maxIndex =
        field.value?.max !== undefined
          ? config.options.findIndex((opt) => opt.value === field.value.max)
          : config.maxDefault !== undefined
            ? config.options.findIndex((opt) => opt.value === config.maxDefault)
            : config.options.length - 1;

      return (
        <RangeSlider
          options={config.options.map((opt) => ({
            ...opt,
            label: t(opt.label),
            description: opt.description ? t(opt.description) : undefined,
          }))}
          minIndex={minIndex}
          maxIndex={maxIndex}
          onChange={(newMinIndex, newMaxIndex) => {
            field.onChange({
              min: config.options[newMinIndex].value,
              max: config.options[newMaxIndex].value,
            });
          }}
          disabled={disabled || config.disabled}
          minLabel={
            config.minLabel
              ? t(config.minLabel)
              : widgetT("widgets.rangeSlider.min")
          }
          maxLabel={
            config.maxLabel
              ? t(config.maxLabel)
              : widgetT("widgets.rangeSlider.max")
          }
        />
      );
    }

    default: {
      // Fallback for any unknown field types
      return (
        <Input
          name={field.name}
          value={String(field.value || "")}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          disabled={disabled || false}
          className={cn(inputClassName, "h-10")}
          placeholder={widgetT("widgets.formFields.common.unknownFieldType")}
        />
      );
    }
  }
}

// Generic field props interface with full type inference from endpoint fields
export interface EndpointFormFieldProps<
  TKey extends string,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TEndpoint extends CreateApiEndpointAny,
> {
  name: TName;
  config?: FieldConfig<TKey>; // Optional - override of endpoint-based field settings
  control: Control<TFieldValues>; // Properly typed form control from useEndpoint
  endpoint: TEndpoint; // Required - provides schema, scopedT, and endpointFields
  theme?: Partial<RequiredFieldTheme>;
  className?: string;
  /**
   * Current locale for translations
   */
  locale: CountryLanguage;
}

/**
 * Main Endpoint Form Field Component
 * Integrates with useEndpoint hook and provides comprehensive form field functionality
 *
 * Config is auto-inferred from endpointFields if not provided
 *
 * Type Parameters:
 * - TFieldValues: The form values type from react-hook-form
 * - TName: The field name (must be a valid path in TFieldValues)
 * - TFields: The endpoint fields structure (inferred from definition.POST.fields)
 */
export function EndpointFormField<
  TKey extends string,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TEndpoint extends CreateApiEndpointAny,
>({
  name,
  config: providedConfig,
  control,
  endpoint,
  theme: _theme,
  className,
  locale,
}: EndpointFormFieldProps<TKey, TFieldValues, TName, TEndpoint>): JSX.Element {
  // Extract from endpoint
  const {
    fields: endpointFields,
    scopedTranslation,
    requestSchema: schema,
  } = endpoint;
  const { scopedT } = scopedTranslation;

  const theme = getTheme(_theme);

  // Use scoped translation from endpoint.scopedTranslation.scopedT
  const { t } = scopedT(locale);
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  // Auto-infer config from endpoint fields if not provided
  const config =
    providedConfig ||
    (endpointFields ? getFieldConfig(endpointFields, name) : null);

  if (!config) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Developer mistake - missing required prop
    // eslint-disable-next-line i18next/no-literal-string -- Error handling for missing config
    throw new Error(
      `EndpointFormField: No config provided for field "${name}". ` +
        `Either provide a config prop or pass endpointFields for auto-inference.`,
    );
  }

  // Use schema-based required fields if schema is provided, otherwise fall back to manual requiredFields
  const schemaRequiredFields = schema ? safeGetRequiredFields(schema) : [];

  // Determine if field is required using schema first, then manual override
  const isRequired = schema ? schemaRequiredFields.includes(name) : false;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const validationState = getFieldValidationState(
          field.value,
          fieldState.error,
          isRequired,
        );

        const styleClassName = getFieldStyleClassName(validationState, theme);
        const { style } = theme;

        // For checkbox/switch, skip the top label since they have inline labels
        const skipTopLabel =
          config.type === "checkbox" || config.type === "switch";

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, className)}
          >
            {!skipTopLabel && (
              <div className="flex flex-row items-start gap-2">
                <FormLabel
                  className={cn(
                    styleClassName.labelClassName,
                    "flex items-center gap-1.5",
                  )}
                >
                  <span>{config.label && t(config.label)}</span>
                  {config.label && style === "asterisk" && isRequired && (
                    <span className="text-info font-bold">*</span>
                  )}
                  {config.description && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="cursor-help inline-flex"
                          >
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          <span className="text-sm">
                            {t(config.description)}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                {style === "badge" && isRequired && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-info/10 dark:bg-info/15 text-info border-info/20 dark:border-info/30"
                  >
                    {widgetT("widgets.formFields.common.required")}
                  </Badge>
                )}
              </div>
            )}

            <FormControl>
              {config.prefillDisplay && field.value && !fieldState.isDirty
                ? // Render prefilled readonly display ONLY when:
                  // 1. prefillDisplay is configured
                  // 2. Field has a value
                  // 3. Field is NOT dirty (value hasn't changed from initial/prefilled)
                  renderPrefillDisplay(
                    String(field.value),
                    config.label,
                    config.prefillDisplay,
                    t,
                  )
                : // Render normal form input
                  renderFieldInput(
                    config,
                    field,
                    styleClassName.inputClassName,
                    t,
                    widgetT,
                    config.disabled || config.readonly,
                  )}
            </FormControl>

            {fieldState.error && (
              <div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage t={t} />
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

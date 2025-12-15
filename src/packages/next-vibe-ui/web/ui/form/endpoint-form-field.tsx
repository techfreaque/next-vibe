/**
 * Endpoint Form Field Component
 * A comprehensive form field component that integrates with useEndpoint hook
 * Supports multiple field types, required field styling, and Zod validation
 *
 * ✅ NOW WITH 100% TYPE INFERENCE FROM DEFINITION.TS
 */

"use client";

import { AlertCircle, Calendar } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { safeGetRequiredFields } from "next-vibe/shared/utils/zod-required-fields";
import type { JSX } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from "react-hook-form";
import type { z } from "zod";

import type { EndpointFieldStructure } from "@/app/api/[locale]/system/unified-interface/shared/field-config/endpoint-field-types";
import type {
  FieldConfig,
  FieldStyleClassName,
  FieldValidationState,
  PrefillDisplayConfig,
  RequiredFieldTheme,
} from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";
import { getFieldConfig } from "@/app/api/[locale]/system/unified-interface/shared/field-config/infer-field-config";
import { useTranslation } from "@/i18n/core/client";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import { AutocompleteField } from "../autocomplete-field";
import { Badge } from "../badge";
import { Button } from "../button";
import { Calendar as CalendarComponent } from "../calendar";
import { Checkbox } from "../checkbox";
import { Info } from "../icons/Info";
import { Input } from "../input";
import { Label } from "../label";
import { MultiSelect } from "../multi-select";
import { NumberInput } from "../number-input";
import { PhoneField } from "../phone-field";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
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

// Default theme for required fields
const DEFAULT_THEME: RequiredFieldTheme = {
  style: "highlight",
  showAllRequired: false,
  requiredColor: "blue",
  completedColor: "green",
};

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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",
    "hover:border-blue-400",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  const baseLabelClassName = cn(
    "text-sm font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-colors duration-200",
  );

  const baseContainerClassName = "flex flex-col gap-2";

  // Error state - consistent red styling with better spacing and improved dark mode readability
  if (hasError) {
    return {
      containerClassName: cn(
        baseContainerClassName,
        "p-4 rounded-lg border border-red-200/60 dark:border-red-800/60 bg-red-50/60 dark:bg-red-950/30",
      ),
      labelClassName: cn(
        baseLabelClassName,
        "text-red-600 dark:text-red-400 font-semibold",
      ),
      inputClassName: cn(
        baseInputClassName,
        "border-red-300 dark:border-red-600 focus-visible:border-red-500 focus-visible:ring-red-500/20",
        "bg-red-50/40 dark:bg-red-950/20",
      ),
      errorClassName: cn(
        "text-sm text-red-600 dark:text-red-400 flex items-center gap-2 mt-2",
        "[&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      ),
      descriptionClassName: "text-sm text-muted-foreground",
    };
  }

  // Required field styling with blueish theme
  if (isRequired && style === "highlight") {
    if (hasValue) {
      // Required field with value - success state with better styling
      const successVariants = {
        green: {
          containerClassName:
            "p-4 rounded-lg border border-green-200/60 dark:border-green-800/60 bg-green-50/60 bg-linear-to-br from-green-50/60 to-emerald-50/40 dark:bg-green-950/30 dark:from-green-950/30 dark:to-emerald-950/20",
          labelClassName: "text-green-700 dark:text-green-400 font-semibold",
          inputClassName:
            "border-green-300 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/30 bg-green-50/40 dark:bg-green-950/20",
          descriptionClassName: "text-green-600 dark:text-green-400",
        },
        blue: {
          containerClassName:
            "p-4 rounded-lg border border-blue-200/60 dark:border-blue-800/60 bg-blue-50/60 bg-linear-to-br from-blue-50/60 to-blue-100/40 dark:bg-blue-950/30 dark:from-blue-950/30 dark:to-blue-900/20",
          labelClassName: "text-blue-700 dark:text-blue-400 font-semibold",
          inputClassName:
            "border-blue-300 dark:border-blue-600 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20",
          descriptionClassName: "text-blue-600 dark:text-blue-400",
        },
        purple: {
          containerClassName:
            "p-4 rounded-lg border border-purple-200/60 dark:border-purple-800/60 bg-purple-50/60 bg-linear-to-br from-purple-50/60 to-purple-100/40 dark:bg-purple-950/30 dark:from-purple-950/30 dark:to-purple-900/20",
          labelClassName: "text-purple-700 dark:text-purple-400 font-semibold",
          inputClassName:
            "border-purple-300 dark:border-purple-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/30 bg-purple-50/40 dark:bg-purple-950/20",
          descriptionClassName: "text-purple-600 dark:text-purple-400",
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
          "text-sm text-red-600 dark:text-red-400 flex items-center gap-2 mt-2",
          "[&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        ),
        descriptionClassName: cn("text-sm", colors.descriptionClassName),
      };
    }
    // Required field without value - enhanced blueish highlight
    const colorVariantsClassName = {
      blue: {
        containerClassName:
          "p-4 rounded-lg border border-blue-300/40 dark:border-blue-600/40 bg-blue-50/60 bg-linear-to-br from-blue-50/60 to-blue-100/30 dark:bg-blue-950/30 dark:from-blue-950/30 dark:to-blue-900/20",
        labelClassName: "text-blue-700 dark:text-blue-400 font-semibold",
        inputClassName:
          "border-blue-300 dark:border-blue-600 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 bg-blue-50/60 dark:bg-blue-950/30 placeholder:text-blue-500/60",
        descriptionClassName: "text-blue-600 dark:text-blue-400",
      },
      amber: {
        containerClassName:
          "p-4 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-amber-50/60 bg-linear-to-br from-amber-50/60 to-amber-100/30 dark:bg-amber-950/30 dark:from-amber-950/30 dark:to-amber-900/20",
        labelClassName: "text-amber-700 dark:text-amber-400 font-semibold",
        inputClassName:
          "border-amber-300 dark:border-amber-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30",
        descriptionClassName: "text-amber-600 dark:text-amber-400",
      },
      red: {
        containerClassName:
          "p-4 rounded-lg border border-red-300/40 dark:border-red-600/40 bg-red-50/60 bg-linear-to-br from-red-50/60 to-red-100/30 dark:bg-red-950/30 dark:from-red-950/30 dark:to-red-900/20",
        labelClassName: "text-red-700 dark:text-red-400 font-semibold",
        inputClassName:
          "border-red-300 dark:border-red-600 focus-visible:border-red-500 focus-visible:ring-red-500/30 bg-red-50/60 dark:bg-red-950/30",
        descriptionClassName: "text-red-600 dark:text-red-400",
      },
      green: {
        containerClassName:
          "p-4 rounded-lg border border-green-300/40 dark:border-green-600/40 bg-green-50/60 bg-linear-to-br from-green-50/60 to-green-100/30 dark:bg-green-950/30 dark:from-green-950/30 dark:to-green-900/20",
        labelClassName: "text-green-700 dark:text-green-400 font-semibold",
        inputClassName:
          "border-green-300 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/30 bg-green-50/60 dark:bg-green-950/30",
        descriptionClassName: "text-green-600 dark:text-green-400",
      },
    };

    const colors = colorVariantsClassName[requiredColor];
    return {
      containerClassName: cn(baseContainerClassName, colors.containerClassName),
      labelClassName: cn(baseLabelClassName, colors.labelClassName),
      inputClassName: cn(baseInputClassName, colors.inputClassName),
      errorClassName: cn(
        "text-sm text-red-600 dark:text-red-400 flex items-center gap-2 mt-2",
        "[&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      ),
      descriptionClassName: cn("text-sm", colors.descriptionClassName),
    };
  }

  // Default styling - clean and minimal with blueish focus
  return {
    containerClassName: baseContainerClassName,
    labelClassName: cn(baseLabelClassName, "text-foreground"),
    inputClassName: baseInputClassName,
    errorClassName: cn(
      "text-sm text-red-600 dark:text-red-400 flex items-center gap-2 mt-2",
      "[&>svg]:text-red-600 dark:[&>svg]:text-red-400",
    ),
    descriptionClassName: "text-sm text-muted-foreground",
  };
}

/**
 * Render prefilled readonly display
 * Shows the prefilled value with styled card/badge based on prefillDisplay config
 */
function renderPrefillDisplay(
  value: string,
  label: TranslationKey | undefined,
  prefillDisplay: PrefillDisplayConfig,
  t: TFunction,
): JSX.Element {
  const displayLabel = prefillDisplay.labelKey
    ? t(prefillDisplay.labelKey)
    : label
      ? t(label)
      : "";

  switch (prefillDisplay.variant) {
    case "card":
      return (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {displayLabel}: <span className="font-semibold">{value}</span>
          </p>
        </div>
      );
    case "highlight":
      return (
        <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-950/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              {displayLabel}:
            </span>
            <span className="text-sm text-green-800 dark:text-green-300 font-semibold">
              {value}
            </span>
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
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            {value}
          </Badge>
        </div>
      );
  }
}

/**
 * Render field input based on type
 */
function renderFieldInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  config: FieldConfig,
  field: ControllerRenderProps<TFieldValues, TName>,
  inputClassName: string,
  t: TFunction,
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
          value={String(field.value || "")}
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
          value={String(field.value || "")}
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
          value={String(field.value || "")}
          disabled={disabled || config.disabled}
        >
          <SelectTrigger className={cn(inputClassName, "h-10")}>
            <SelectValue
              placeholder={
                config.placeholder ? t(config.placeholder) : undefined
              }
            />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option, index) => (
              <SelectItem
                key={option.value ?? `${OPTION_KEY_PREFIX}${index}`}
                value={option.value ?? ""}
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
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled || config.disabled}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled || config.disabled}
            className="data-[state=checked]:bg-blue-600"
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
                    : t("packages.nextVibeUi.web.common.selectDate")}
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
          options={config.options || []}
          placeholder={config.placeholder}
          searchPlaceholder={config.searchPlaceholder}
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
        />
      );
    }

    case "phone": {
      if (config.type !== "phone") {
        // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard for developer mistakes at runtime
        // eslint-disable-next-line i18next/no-literal-string -- Error handling for invalid config
        throw new Error("Invalid config type for phone field");
      }
      // Extract placeholder to avoid complex union type error
      let phonePlaceholder: TranslationKey;
      if (config.placeholder !== undefined) {
        phonePlaceholder = config.placeholder;
      } else {
        phonePlaceholder = "packages.nextVibeUi.web.common.enterPhoneNumber";
      }
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
          placeholder={t("packages.nextVibeUi.web.common.unknownFieldType")}
        />
      );
    }
  }
}

// Generic field props interface with full type inference from endpoint fields
export interface EndpointFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TFields extends EndpointFieldStructure = EndpointFieldStructure,
> {
  name: TName;
  config?: FieldConfig; // Optional - auto-inferred from endpointFields if not provided
  control: Control<TFieldValues>; // Properly typed form control from useEndpoint
  schema?: z.ZodTypeAny; // Optional Zod schema for automatic required field detection
  endpointFields?: TFields; // Endpoint fields for auto-inference (from definition.POST.fields) - now fully typed
  theme?: RequiredFieldTheme;
  className?: string;
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
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TFields extends EndpointFieldStructure = EndpointFieldStructure,
>({
  name,
  config: providedConfig,
  control,
  schema,
  theme = DEFAULT_THEME,
  className,
  endpointFields,
}: EndpointFormFieldProps<TFieldValues, TName, TFields>): JSX.Element {
  const { t } = useTranslation();

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
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      *
                    </span>
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
                    className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {t("packages.nextVibeUi.web.common.required")}
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
                    config.disabled || config.readonly,
                  )}
            </FormControl>

            {fieldState.error && (
              <div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage />
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

/**
 * Convenience component for creating multiple form fields
 * Config is auto-inferred from endpointFields if not provided
 *
 * Type Parameters:
 * - TFieldValues: The form values type from react-hook-form
 * - TFields: The endpoint fields structure (inferred from definition.POST.fields)
 */
export interface EndpointFormFieldsProps<
  TFieldValues extends FieldValues,
  TFields extends EndpointFieldStructure = EndpointFieldStructure,
> {
  fields: Array<{
    name: Path<TFieldValues>;
    config?: FieldConfig; // Optional - auto-inferred from endpointFields
  }>;
  control: Control<TFieldValues>;
  requiredFields?: string[];
  schema?: z.ZodTypeAny; // Optional Zod schema for automatic required field detection
  endpointFields?: TFields; // Endpoint fields for auto-inference - now fully typed
  theme?: RequiredFieldTheme;
  className?: string;
  fieldClassName?: string;
}

export function EndpointFormFields<
  TFieldValues extends FieldValues,
  TFields extends EndpointFieldStructure = EndpointFieldStructure,
>({
  fields,
  control,
  schema,
  endpointFields,
  theme = DEFAULT_THEME,
  className,
  fieldClassName,
}: EndpointFormFieldsProps<TFieldValues, TFields>): JSX.Element {
  return (
    <div className={cn("space-y-6", className)}>
      {fields.map((fieldDef) => (
        <EndpointFormField<TFieldValues, Path<TFieldValues>, TFields>
          key={fieldDef.name}
          name={fieldDef.name}
          config={fieldDef.config}
          control={control}
          schema={schema}
          endpointFields={endpointFields}
          theme={theme}
          className={fieldClassName}
        />
      ))}
    </div>
  );
}

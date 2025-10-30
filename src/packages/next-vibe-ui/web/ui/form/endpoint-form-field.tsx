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
  FieldValues,
  Path,
} from "react-hook-form";
import type { z } from "zod";

import { useTranslation } from "@/i18n/core/client";
import type { TFunction } from "@/i18n/core/static-types";

import { AutocompleteField } from "../autocomplete-field";
import { Badge } from "../badge";
import { Button } from "../button";
import { Calendar as CalendarComponent } from "../calendar";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { Label } from "../label";
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
import type {
  EndpointFormFieldProps as EndpointFormFieldPropsType,
  FieldConfig,
  FieldStyleClassName,
  FieldValidationState,
  RequiredFieldTheme,
} from "./endpoint-form-field-types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { getFieldConfig } from "./infer-field-config";

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
interface FormFieldError {
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
    "text-sm font-medium leading-none mb-2",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-colors duration-200",
  );

  const baseContainerClassName = "space-y-3";

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
            "p-4 rounded-lg border border-green-200/60 dark:border-green-800/60 bg-green-50/60 bg-gradient-to-br from-green-50/60 to-emerald-50/40 dark:bg-green-950/30 dark:from-green-950/30 dark:to-emerald-950/20",
          labelClassName: "text-green-700 dark:text-green-400 font-semibold",
          inputClassName:
            "border-green-300 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/30 bg-green-50/40 dark:bg-green-950/20",
          descriptionClassName: "text-green-600 dark:text-green-400",
        },
        blue: {
          containerClassName:
            "p-4 rounded-lg border border-blue-200/60 dark:border-blue-800/60 bg-blue-50/60 bg-gradient-to-br from-blue-50/60 to-blue-100/40 dark:bg-blue-950/30 dark:from-blue-950/30 dark:to-blue-900/20",
          labelClassName: "text-blue-700 dark:text-blue-400 font-semibold",
          inputClassName:
            "border-blue-300 dark:border-blue-600 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20",
          descriptionClassName: "text-blue-600 dark:text-blue-400",
        },
        purple: {
          containerClassName:
            "p-4 rounded-lg border border-purple-200/60 dark:border-purple-800/60 bg-purple-50/60 bg-gradient-to-br from-purple-50/60 to-purple-100/40 dark:bg-purple-950/30 dark:from-purple-950/30 dark:to-purple-900/20",
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
    } else {
      // Required field without value - enhanced blueish highlight
      const colorVariantsClassName = {
        blue: {
          containerClassName:
            "p-4 rounded-lg border border-blue-300/40 dark:border-blue-600/40 bg-blue-50/60 bg-gradient-to-br from-blue-50/60 to-blue-100/30 dark:bg-blue-950/30 dark:from-blue-950/30 dark:to-blue-900/20",
          labelClassName: "text-blue-700 dark:text-blue-400 font-semibold",
          inputClassName:
            "border-blue-300 dark:border-blue-600 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 bg-blue-50/60 dark:bg-blue-950/30 placeholder:text-blue-500/60",
          descriptionClassName: "text-blue-600 dark:text-blue-400",
        },
        amber: {
          containerClassName:
            "p-4 rounded-lg border border-amber-300/40 dark:border-amber-600/40 bg-amber-50/60 bg-gradient-to-br from-amber-50/60 to-amber-100/30 dark:bg-amber-950/30 dark:from-amber-950/30 dark:to-amber-900/20",
          labelClassName: "text-amber-700 dark:text-amber-400 font-semibold",
          inputClassName:
            "border-amber-300 dark:border-amber-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30",
          descriptionClassName: "text-amber-600 dark:text-amber-400",
        },
        red: {
          containerClassName:
            "p-4 rounded-lg border border-red-300/40 dark:border-red-600/40 bg-red-50/60 bg-gradient-to-br from-red-50/60 to-red-100/30 dark:bg-red-950/30 dark:from-red-950/30 dark:to-red-900/20",
          labelClassName: "text-red-700 dark:text-red-400 font-semibold",
          inputClassName:
            "border-red-300 dark:border-red-600 focus-visible:border-red-500 focus-visible:ring-red-500/30 bg-red-50/60 dark:bg-red-950/30",
          descriptionClassName: "text-red-600 dark:text-red-400",
        },
        green: {
          containerClassName:
            "p-4 rounded-lg border border-green-300/40 dark:border-green-600/40 bg-green-50/60 bg-gradient-to-br from-green-50/60 to-green-100/30 dark:bg-green-950/30 dark:from-green-950/30 dark:to-green-900/20",
          labelClassName: "text-green-700 dark:text-green-400 font-semibold",
          inputClassName:
            "border-green-300 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/30 bg-green-50/60 dark:bg-green-950/30",
          descriptionClassName: "text-green-600 dark:text-green-400",
        },
      };

      const colors = colorVariantsClassName[requiredColor];
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
 * Render label with required indicators
 */
function renderLabel(
  config: FieldConfig,
  isRequired: boolean,
  theme: RequiredFieldTheme,
  labelClassName: string,
  t: TFunction,
): JSX.Element | null {
  const { style } = theme;

  return config.label ? (
    <div className="flex items-center gap-2">
      <span className={labelClassName}>
        {t(config.label)}
        {style === "asterisk" && isRequired && (
          <span className="text-blue-600 dark:text-blue-400 ml-1 font-bold">
            *
          </span>
        )}
      </span>
      {style === "badge" && isRequired && (
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          {t("packages.nextVibeUi.web.common.required")}
        </Badge>
      )}
    </div>
  ) : null;
}

/**
 * Render field input based on type
 */
function renderFieldInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
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
        <Input
          name={field.name}
          value={String(field.value || "")}
          onChange={(e) => {
            const value = e.target.value;
            // Convert to number if it's a valid number, otherwise keep as string for validation
            const numValue = value === "" ? "" : Number(value);
            field.onChange(Number.isNaN(numValue as number) ? value : numValue);
          }}
          onBlur={field.onBlur}
          type="number"
          min={config.min}
          max={config.max}
          step={config.step}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          disabled={disabled || config.disabled}
          className={cn(inputClassName, "h-10")}
        />
      );

    case "textarea":
      return (
        <Textarea
          name={field.name}
          value={String(field.value || "")}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className={cn(inputClassName, "min-h-[80px] resize-none")}
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
          {(config.checkboxLabel || config.checkboxLabelJsx) && (
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              {config.checkboxLabelJsx
                ? config.checkboxLabelJsx
                : config.checkboxLabel
                  ? t(config.checkboxLabel)
                  : null}
            </Label>
          )}
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

    case "phone":
      if (config.type !== "phone") {
        throw new Error("Invalid config type for phone field");
      }
      return (
        <PhoneField
          value={String(field.value ?? "")}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          placeholder={
            config.placeholder ?? "packages.nextVibeUi.web.common.enterPhoneNumber"
          }
          defaultCountry={config.defaultCountry ?? "DE"}
          preferredCountries={config.preferredCountries ?? ["DE", "PL", "GLOBAL"]}
          disabled={disabled ?? config.disabled}
          className={inputClassName}
          name={field.name}
        />
      );

    case "multiselect": {
      const multiselectValue: string[] = Array.isArray(field.value)
        ? field.value
        : [];

      return (
        <div className="space-y-2">
          {config.options.map((option) => {
            const isSelected = multiselectValue.includes(option.value);
            const isDisabled = disabled || config.disabled || option.disabled;
            const canSelect =
              !isSelected ||
              config.maxSelections === undefined ||
              multiselectValue.length <= config.maxSelections;

            return (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  checked={isSelected}
                  disabled={isDisabled || (!isSelected && !canSelect)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...multiselectValue, option.value]
                      : multiselectValue.filter((v) => v !== option.value);
                    field.onChange(newValue);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className={cn(
                    "text-sm font-normal cursor-pointer",
                    isDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {t(option.label)}
                </label>
              </div>
            );
          })}
          {config.maxSelections && (
            <div className="text-xs text-gray-500 mt-1">
              {multiselectValue.length} / {config.maxSelections} selected
            </div>
          )}
        </div>
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

// Generic field props interface
export interface EndpointFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> extends Omit<
    EndpointFormFieldPropsType<TFieldValues, TName>,
    "requiredFields"
  > {
  schema?: z.ZodTypeAny; // Optional Zod schema for automatic required field detection
  endpointFields?: unknown; // Endpoint fields for auto-inference (from definition.POST.fields)
}

/**
 * Main Endpoint Form Field Component
 * Integrates with useEndpoint hook and provides comprehensive form field functionality
 *
 * Config is auto-inferred from endpointFields if not provided
 */
export function EndpointFormField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  name,
  config: providedConfig,
  control,
  schema,
  theme = DEFAULT_THEME,
  className,
  endpointFields,
}: EndpointFormFieldProps<TFieldValues, TName>): JSX.Element {
  const { t } = useTranslation();

  // Auto-infer config from endpoint fields if not provided
  const config =
    providedConfig ||
    (endpointFields ? getFieldConfig(endpointFields, name) : null);

  if (!config) {
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

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, className)}
          >
            <FormLabel className={styleClassName.labelClassName}>
              {renderLabel(
                config,
                isRequired,
                theme,
                styleClassName.labelClassName,
                t,
              )}
            </FormLabel>

            <FormControl>
              {renderFieldInput(
                config,
                field,
                styleClassName.inputClassName,
                t,
                config.disabled,
              )}
            </FormControl>

            {config.description && !fieldState.error && (
              <FormDescription className={styleClassName.descriptionClassName}>
                {t(config.description)}
              </FormDescription>
            )}

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
 */
export interface EndpointFormFieldsProps<TFieldValues extends FieldValues> {
  fields: Array<{
    name: Path<TFieldValues>;
    config?: FieldConfig; // Optional - auto-inferred from endpointFields
  }>;
  control: Control<TFieldValues>;
  requiredFields?: string[];
  schema?: z.ZodTypeAny; // Optional Zod schema for automatic required field detection
  endpointFields?: unknown; // Endpoint fields for auto-inference
  theme?: RequiredFieldTheme;
  className?: string;
  fieldClassName?: string;
}

export function EndpointFormFields<TFieldValues extends FieldValues>({
  fields,
  control,
  schema,
  endpointFields,
  theme = DEFAULT_THEME,
  className,
  fieldClassName,
}: EndpointFormFieldsProps<TFieldValues>): JSX.Element {
  return (
    <div className={cn("space-y-6", className)}>
      {fields.map((fieldDef) => (
        <EndpointFormField
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

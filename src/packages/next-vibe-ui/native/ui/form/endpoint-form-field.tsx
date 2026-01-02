/**
 * Endpoint Form Field Component
 */

"use client";

import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils";
import { safeGetRequiredFields } from "next-vibe/shared/utils/zod-required-fields";
import { AlertCircle, Calendar } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues, Path } from "react-hook-form";
import { View } from "react-native";

import type { IconKey } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type {
  FieldConfig,
  FieldStyleClassName,
  FieldValidationState,
  RequiredFieldTheme,
} from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";
import { getFieldConfig } from "@/app/api/[locale]/system/unified-interface/shared/field-config/infer-field-config";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction, TParams } from "@/i18n/core/static-types";

import type {
  EndpointFormFieldProps,
  FormFieldError,
} from "../../../web/ui/form/endpoint-form-field";
import { convertCSSToViewStyle } from "../../utils/style-converter";
import { AutocompleteField } from "../autocomplete-field";
import { Badge } from "../badge";
import { Button } from "../button";
import { Calendar as CalendarComponent } from "../calendar";
import { Checkbox } from "../checkbox";
import { Div } from "../div";
import { IconPicker } from "../icon-picker";
import { Info } from "../icons/Info";
import { Input } from "../input";
import { Label } from "../label";
import { PhoneField } from "../phone-field";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Span } from "../span";
import { Switch } from "../switch";
import { TagsField } from "../tags-field";
import { Textarea } from "../textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";

// Re-export types for module compatibility with web version
export type { EndpointFormFieldProps, FormFieldError };

// Styled View for proper NativeWind support
const StyledView = styled(View, { className: "style" });

// Default theme for required fields
const DEFAULT_THEME: RequiredFieldTheme = {
  style: "highlight",
  showAllRequired: false,
  requiredColor: "blue",
  completedColor: "green",
};

// Constants
const OPTION_KEY_PREFIX = "option-";

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
    // "transition-all duration-200 ease-in-out",
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
      labelClassName: cn(baseLabelClassName, "text-red-600 dark:text-red-400 font-semibold"),
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
 * Render label with required indicators and optional info tooltip
 */
function renderLabel<TKey extends string>(
  config: FieldConfig<TKey>,
  isRequired: boolean,
  theme: RequiredFieldTheme,
  labelClassName: string,
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType, // Adapted translation for definition keys
  globalT: TFunction, // Global translation for hardcoded framework keys
): JSX.Element | null {
  const { style } = theme;

  return config.label ? (
    <StyledView className="flex flex-row items-center gap-2">
      <StyledView className="flex flex-row items-center gap-1.5">
        <Span className={labelClassName}>{t(config.label)}</Span>
        {style === "asterisk" && isRequired && (
          <Span className="text-blue-600 dark:text-blue-400 font-bold">*</Span>
        )}
        {config.description && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <StyledView className="cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </StyledView>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <Span className="text-sm">{t(config.description)}</Span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </StyledView>
      {style === "badge" && isRequired && (
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          {globalT("packages.nextVibeUi.web.common.required")}
        </Badge>
      )}
    </StyledView>
  ) : null;
}

/**
 * Render field input based on type
 */
function renderFieldInput<
  TKey extends string,
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>(
  config: FieldConfig<TKey>,
  field: ControllerRenderProps<TFieldValues, TName>,
  inputClassName: string,
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType, // Adapted translation for definition keys (uses scopedT when available)
  globalT: TFunction, // Global translation for hardcoded framework keys
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
          value={String(field.value || "")}
          onChangeText={(text: string) => field.onChange(text)}
          onBlur={field.onBlur}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          disabled={disabled || config.disabled}
          className={inputClassName}
        />
      );

    case "number":
      return (
        <Input
          value={String(field.value || "")}
          onChangeText={(text: string) => {
            // Convert to number if it's a valid number, otherwise keep as string for validation
            const numValue = text === "" ? "" : Number(text);
            field.onChange(Number.isNaN(numValue as number) ? text : numValue);
          }}
          onBlur={field.onBlur}
          keyboardType="numeric"
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          disabled={disabled || config.disabled}
          className={inputClassName}
        />
      );

    case "textarea":
      return (
        <Textarea
          value={String(field.value || "")}
          onChangeText={(text: string) => field.onChange(text)}
          onBlur={field.onBlur}
          className={inputClassName}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          minRows={config.rows || 3}
          maxLength={config.maxLength}
          disabled={disabled || config.disabled}
        />
      );

    case "select": {
      // Find the selected option to get the proper label
      const selectedOption = config.options.find((opt) => opt.value === field.value);
      const selectedValue = selectedOption
        ? {
            value: String(selectedOption.value),
            label: t(selectedOption.label, selectedOption.labelParams),
          }
        : undefined;

      return (
        <Select
          // Force re-render when value changes
          key={`${field.name}-${String(field.value) || "empty"}`}
          onValueChange={(value) => {
            field.onChange(value);
          }}
          value={selectedValue?.value}
          disabled={disabled || config.disabled}
        >
          <SelectTrigger className={inputClassName}>
            <SelectValue placeholder={config.placeholder ? t(config.placeholder) : ""} />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option, index) => (
              <SelectItem
                key={option.value ?? `${OPTION_KEY_PREFIX}${index}`}
                value={option.value ?? ""}
                label={t(option.label, option.labelParams)}
                disabled={option.disabled}
              >
                {t(option.label, option.labelParams)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "checkbox":
      return (
        <Div className="flex items-center space-x-3">
          <Checkbox
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled || config.disabled}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          {config.checkboxLabel && (
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              {t(config.checkboxLabel)}
            </Label>
          )}
        </Div>
      );

    case "radio":
      return (
        <RadioGroup
          onValueChange={(value: string) => field.onChange(value)}
          value={String(field.value || "")}
          className={cn(
            "flex py-2",
            config.orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-3",
          )}
        >
          {config.options.map((option) => (
            <Div key={option.value} className="flex items-center space-x-3">
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
            </Div>
          ))}
        </RadioGroup>
      );

    case "switch":
      return (
        <Div className="flex items-center space-x-3 py-2">
          <Switch
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
        </Div>
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
                <Span>
                  {config.placeholder
                    ? t(config.placeholder)
                    : globalT("packages.nextVibeUi.web.common.selectDate")}
                </Span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={parsedDate}
              onSelect={(date) => field.onChange(date?.toISOString())}
              disabled={(date: Date) => {
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
          t={t}
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
      // Translate placeholder - use adapted t for definition keys, globalT for hardcoded default
      const phonePlaceholder =
        config.placeholder !== undefined
          ? t(config.placeholder)
          : globalT("packages.nextVibeUi.web.common.enterPhoneNumber");
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
      const multiselectValue: string[] = Array.isArray(field.value) ? field.value : [];

      return (
        <Div className="space-y-2">
          {config.options.map((option) => {
            const isSelected = multiselectValue.includes(option.value);
            const isDisabled = disabled || config.disabled || option.disabled;
            const canSelect =
              !isSelected ||
              config.maxSelections === undefined ||
              multiselectValue.length <= config.maxSelections;

            return (
              <Div key={option.value} className="flex flex-row items-center space-x-2">
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled || (!isSelected && !canSelect)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...multiselectValue, option.value]
                      : multiselectValue.filter((v) => v !== option.value);
                    field.onChange(newValue);
                  }}
                />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className={cn(
                    "text-sm font-normal cursor-pointer",
                    isDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {t(option.label)}
                </Label>
              </Div>
            );
          })}
          {config.maxSelections && (
            <Div className="text-xs text-gray-500 mt-1">
              {multiselectValue.length} / {config.maxSelections} selected
            </Div>
          )}
        </Div>
      );
    }

    case "icon": {
      return (
        <IconPicker
          value={field.value as IconKey | undefined}
          onChange={(iconKey) => field.onChange(iconKey)}
          className={inputClassName}
        />
      );
    }

    default: {
      // Fallback for any unknown field types
      return (
        <Input
          value={String(field.value || "")}
          onChangeText={(text: string) => field.onChange(text)}
          onBlur={field.onBlur}
          disabled={disabled || false}
          className={inputClassName}
          placeholder={globalT("packages.nextVibeUi.web.common.unknownFieldType")}
        />
      );
    }
  }
}

/**
 * Main Endpoint Form Field Component
 * Integrates with useEndpoint hook and provides comprehensive form field functionality
 *
 * Config is auto-inferred from endpointFields if not provided
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
  theme = DEFAULT_THEME,
  className,
  style,
  locale,
}: EndpointFormFieldProps<TKey, TFieldValues, TName, TEndpoint> & {
  style?: React.CSSProperties;
}): JSX.Element {
  // Extract from endpoint
  const { fields: endpointFields, scopedTranslation, requestSchema: schema } = endpoint;
  const { scopedT } = scopedTranslation;

  const { t } = scopedT(locale);
  const { t: globalT } = simpleT(locale);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Auto-infer config from endpoint fields if not provided
  const config = providedConfig || (endpointFields ? getFieldConfig(endpointFields, name) : null);

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
        const validationState = getFieldValidationState(field.value, fieldState.error, isRequired);

        const styleClassName = getFieldStyleClassName(validationState, theme);

        // Note: style prop is not passed to FormItem due to StyleType discriminated union
        // FormItem uses className for styling via NativeWind (either style OR className, not both)
        void nativeStyle; // Acknowledge nativeStyle is intentionally unused for FormItem
        return (
          <FormItem className={cn(styleClassName.containerClassName, className)}>
            <FormLabel className={styleClassName.labelClassName}>
              {renderLabel(config, isRequired, theme, styleClassName.labelClassName, t, globalT)}
            </FormLabel>

            <FormControl>
              {renderFieldInput(
                config,
                field,
                styleClassName.inputClassName,
                t,
                globalT,
                config.disabled,
              )}
            </FormControl>

            {fieldState.error && (
              <Div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage />
              </Div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

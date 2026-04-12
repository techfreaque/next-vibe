/**
 * Endpoint Form Field Component
 */

"use client";

import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils";
import { safeGetRequiredFields } from "next-vibe/shared/utils/zod-required-fields";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import type { JSX } from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from "react-hook-form";
import { View } from "react-native";

import type {
  FieldConfig,
  FieldStyleClassName,
  FieldValidationState,
  RequiredFieldTheme,
} from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";
import { getFieldConfig } from "@/app/api/[locale]/system/unified-interface/shared/field-config/infer-field-config";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  scopedTranslation as unifiedInterfaceScopedTranslation,
  type UnifiedInterfaceT,
} from "@/app/api/[locale]/system/unified-interface/i18n";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

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
  descriptionStyle: "tooltip",
  optionalColor: "none",
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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
    "hover:border-primary/60",
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
        "p-4 rounded-lg border border-destructive/20 dark:border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
      ),
      labelClassName: cn(baseLabelClassName, "text-destructive font-semibold"),
      inputClassName: cn(
        baseInputClassName,
        "border-destructive/40 focus-visible:border-destructive focus-visible:ring-destructive/20",
        "bg-destructive/5 dark:bg-destructive/10",
      ),
      errorClassName: cn(
        "text-sm text-destructive flex items-center gap-2 mt-2",
        "[&>svg]:text-destructive",
      ),
      descriptionClassName: "text-sm text-muted-foreground",
      inlineDescriptionClassName:
        "text-sm text-muted-foreground flex items-center gap-2 mt-1",
    };
  }

  // Required field styling with blueish theme
  if (isRequired && style === "highlight") {
    if (hasValue) {
      // Required field with value - success state with better styling
      const successVariants = {
        green: {
          containerClassName:
            "p-4 rounded-lg border border-success/20 dark:border-success/30 bg-success/5 dark:bg-success/10",
          labelClassName: "text-success font-semibold",
          inputClassName:
            "border-success/40 focus-visible:border-success focus-visible:ring-success/30 bg-success/5 dark:bg-success/10",
          descriptionClassName: "text-success",
        },
        blue: {
          containerClassName:
            "p-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10",
          labelClassName: "text-primary font-semibold",
          inputClassName:
            "border-primary/40 focus-visible:border-primary focus-visible:ring-primary/30 bg-primary/5 dark:bg-primary/10",
          descriptionClassName: "text-primary",
        },
        purple: {
          containerClassName:
            "p-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10",
          labelClassName: "text-primary font-semibold",
          inputClassName:
            "border-primary/40 focus-visible:border-primary focus-visible:ring-primary/30 bg-primary/5 dark:bg-primary/10",
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
        inlineDescriptionClassName: cn(
          "text-sm flex items-center gap-2 mt-1",
          colors.descriptionClassName,
        ),
      };
    }
    // Required field without value - enhanced blueish highlight
    const colorVariantsClassName = {
      blue: {
        containerClassName:
          "p-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10",
        labelClassName: "text-primary font-semibold",
        inputClassName:
          "border-primary/40 focus-visible:border-primary focus-visible:ring-primary/30 bg-primary/5 dark:bg-primary/10 placeholder:text-primary/60",
        descriptionClassName: "text-primary",
      },
      amber: {
        containerClassName:
          "p-4 rounded-lg border border-warning/20 dark:border-warning/30 bg-warning/5 dark:bg-warning/10",
        labelClassName: "text-warning font-semibold",
        inputClassName:
          "border-warning/40 focus-visible:border-warning focus-visible:ring-warning/30 bg-warning/5 dark:bg-warning/10",
        descriptionClassName: "text-warning",
      },
      red: {
        containerClassName:
          "p-4 rounded-lg border border-destructive/20 dark:border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
        labelClassName: "text-destructive font-semibold",
        inputClassName:
          "border-destructive/40 focus-visible:border-destructive focus-visible:ring-destructive/30 bg-destructive/5 dark:bg-destructive/10",
        descriptionClassName: "text-destructive",
      },
      green: {
        containerClassName:
          "p-4 rounded-lg border border-success/20 dark:border-success/30 bg-success/5 dark:bg-success/10",
        labelClassName: "text-success font-semibold",
        inputClassName:
          "border-success/40 focus-visible:border-success focus-visible:ring-success/30 bg-success/5 dark:bg-success/10",
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
      inlineDescriptionClassName: cn(
        "text-sm flex items-center gap-2 mt-1",
        colors.descriptionClassName,
      ),
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
    inlineDescriptionClassName:
      "text-sm text-muted-foreground flex items-center gap-2 mt-1",
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
  widgetT: UnifiedInterfaceT, // Scoped translation for hardcoded framework keys
): JSX.Element | null {
  const { style } = theme;

  return config.label ? (
    <StyledView className="flex flex-row items-center gap-2">
      <StyledView className="flex flex-row items-center gap-1.5">
        <Span className={labelClassName}>{t(config.label)}</Span>
        {style === "asterisk" && isRequired && (
          <Span className="text-primary font-bold">*</Span>
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
          className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
        >
          {widgetT("widgets.formFields.common.required")}
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
      const selectedOption = config.options.find(
        (opt) => opt.value === field.value,
      );
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
            <SelectValue
              placeholder={config.placeholder ? t(config.placeholder) : ""}
            />
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
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
            config.orientation === "horizontal"
              ? "flex-row gap-6"
              : "flex-col gap-3",
          )}
        >
          {config.options.map((option) => (
            <Div key={option.value} className="flex items-center space-x-3">
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
                    : widgetT("widgets.formFields.common.selectDate")}
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
        <Div className="space-y-2">
          {config.options.map((option) => {
            const isSelected = multiselectValue.includes(option.value);
            const isDisabled = disabled || config.disabled || option.disabled;
            const canSelect =
              !isSelected ||
              config.maxSelections === undefined ||
              multiselectValue.length <= config.maxSelections;

            return (
              <Div
                key={option.value}
                className="flex flex-row items-center space-x-2"
              >
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
            <Div className="text-xs text-muted-foreground mt-1">
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
          placeholder={widgetT("widgets.formFields.common.unknownFieldType")}
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
  theme: partialTheme,
  className,
  style,
  locale,
}: EndpointFormFieldProps<TKey, TFieldValues, TName, TEndpoint> & {
  style?: React.CSSProperties;
}): JSX.Element {
  // Merge partial theme with defaults
  const theme: RequiredFieldTheme = {
    ...DEFAULT_THEME,
    ...partialTheme,
  };

  // Extract from endpoint
  const {
    fields: endpointFields,
    scopedTranslation,
    requestSchema: schema,
  } = endpoint;
  const { scopedT } = scopedTranslation;

  const { t } = scopedT(locale);
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

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

        // Note: style prop is not passed to FormItem due to StyleType discriminated union
        // FormItem uses className for styling via NativeWind (either style OR className, not both)
        void nativeStyle; // Acknowledge nativeStyle is intentionally unused for FormItem
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
                widgetT,
              )}
            </FormLabel>

            <FormControl>
              {renderFieldInput(
                config,
                field,
                styleClassName.inputClassName,
                t,
                widgetT,
                config.disabled,
              )}
            </FormControl>

            {fieldState.error && (
              <Div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage t={t} />
              </Div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

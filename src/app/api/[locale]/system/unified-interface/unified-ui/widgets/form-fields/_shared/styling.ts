/**
 * Shared styling utilities for form field widgets
 */

import { cn } from "next-vibe/shared/utils";

import type {
  FieldStyleClassName,
  FieldValidationState,
  RequiredFieldTheme,
} from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";

/**
 * Get field styling classes based on validation state and theme
 * Returns containerClassName, labelClassName, inputClassName, errorClassName, descriptionClassName
 */
export function getFieldStyleClassName(
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
      inlineDescriptionClassName:
        "text-xs text-muted-foreground flex items-start gap-2 mt-1",
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
        inlineDescriptionClassName: cn(
          "text-xs",
          colors.descriptionClassName,
          "flex items-start gap-2 mt-1 opacity-75",
        ),
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
      inlineDescriptionClassName: cn(
        "text-xs",
        colors.descriptionClassName,
        "flex items-start gap-2 mt-1 opacity-75",
      ),
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
    inlineDescriptionClassName:
      "text-xs text-muted-foreground flex items-start gap-2 mt-1 opacity-75",
  };
}

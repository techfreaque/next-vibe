"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/agent/chat/model-access/icons";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

/**
 * Individual filter pill button component
 */
function FilterPill<TKey extends string>({
  label,
  icon,
  selected,
  onClick,
  disabled,
  t,
}: {
  label: TKey;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  t: (key: string) => string;
}): JSX.Element {
  const Icon = icon ? getIconComponent(icon as IconKey) : null;

  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className={cn(
        "flex items-center gap-1.5 h-9 px-3 transition-all",
        !selected && "hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      {Icon && (
        <Icon
          className={cn("h-4 w-4", selected && "text-primary-foreground")}
        />
      )}
      <Span className="text-xs font-medium">{t(label)}</Span>
    </Button>
  );
}

/**
 * FilterPills Widget - Visual pill/chip radio button group for single-selection enums
 * Provides better UX than dropdown SELECT for small option sets
 */
export function FilterPillsWidget<TKey extends string>({
  field,
  fieldName,
  context,
  form,
  className,
}: ReactWidgetProps<typeof WidgetType.FILTER_PILLS, TKey>): JSX.Element {
  const { t } = getTranslator(context);

  if (!form || !fieldName) {
    return (
      <Div className={className}>
        <Div className="text-sm text-destructive">
          {t(
            "app.api.system.unifiedInterface.react.widgets.filterPills.requiresContext",
          )}
        </Div>
      </Div>
    );
  }

  const {
    label,
    description,
    helpText,
    required,
    disabled,
    readonly,
    options,
    layout = {},
    showIcon = true,
    showLabel = true,
  } = field.ui;

  const { wrap = true, gap = "md" } = layout;

  const formControl = form as { control: Control<FieldValues> };

  return (
    <Div className={cn("space-y-2", className)}>
      {/* Label */}
      {showLabel && label && (
        <Label className="text-sm font-medium">
          {t(label)}
          {required && <Span className="text-destructive ml-1">*</Span>}
        </Label>
      )}

      {/* Description */}
      {description && (
        <Span className="text-sm text-muted-foreground">{t(description)}</Span>
      )}

      {/* Filter Pills */}
      <Controller
        name={fieldName as FieldPath<FieldValues>}
        control={formControl.control}
        render={({ field: controllerField, fieldState }) => (
          <Div className="space-y-2">
            <Div
              className={cn(
                "flex items-center",
                wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto",
                gap === "sm" && "gap-1.5",
                gap === "md" && "gap-2",
                gap === "lg" && "gap-3",
              )}
            >
              {options.map((option) => (
                <FilterPill
                  key={`${option.value}`}
                  label={option.label}
                  icon={showIcon ? option.icon : undefined}
                  selected={controllerField.value === option.value}
                  onClick={() => {
                    if (!disabled && !readonly) {
                      controllerField.onChange(option.value);
                    }
                  }}
                  disabled={disabled || readonly || context.disabled}
                  t={t}
                />
              ))}
            </Div>

            {/* Error message */}
            {fieldState.error && (
              <Span className="text-sm text-destructive">
                {fieldState.error.message}
              </Span>
            )}
          </Div>
        )}
      />

      {/* Help text */}
      {helpText && (
        <Span className="text-xs text-muted-foreground">{t(helpText)}</Span>
      )}
    </Div>
  );
}

FilterPillsWidget.displayName = "FilterPillsWidget";

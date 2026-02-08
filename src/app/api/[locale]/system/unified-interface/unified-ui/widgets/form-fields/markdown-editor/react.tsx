"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check, Edit2, X } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import {
  getIconSizeClassName,
  getSpacingClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type { ReactRequestResponseWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetIsInteractive,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { extractEditableTextData } from "./shared";
import type {
  MarkdownEditorWidgetConfig,
  MarkdownEditorWidgetSchema,
} from "./types";

/**
 * Text display with inline editing capability.
 */
export function MarkdownEditorWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends MarkdownEditorWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactRequestResponseWidgetProps<
  TEndpoint,
  TUsage,
  MarkdownEditorWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const isInteractive = useWidgetIsInteractive();
  const {
    gap = "md",
    inputHeight = "sm",
    buttonSize = "sm",
    actionIconSize = "sm",
    editIconSize = "xs",
    className,
  } = field;

  const gapClass = getSpacingClassName("gap", gap);
  const actionIconSizeClass = getIconSizeClassName(actionIconSize);
  const editIconSizeClass = getIconSizeClassName(editIconSize);

  const form = useWidgetForm();
  const rawValue =
    form?.watch(fieldName) || "value" in field ? field.value : "";

  const inputHeightClass =
    inputHeight === "xs"
      ? "h-6"
      : inputHeight === "sm"
        ? "h-8"
        : inputHeight === "lg"
          ? "h-10"
          : "h-9";

  const buttonSizeClass =
    buttonSize === "xs"
      ? "h-6 w-6"
      : buttonSize === "sm"
        ? "h-8 w-8"
        : buttonSize === "lg"
          ? "h-10 w-10"
          : "h-9 w-9";

  const editButtonSizeClass =
    buttonSize === "xs"
      ? "h-5 w-5"
      : buttonSize === "sm"
        ? "h-6 w-6"
        : "h-7 w-7";

  const extractedData = extractEditableTextData(rawValue);

  const value = extractedData?.value;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = (): void => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: InputKeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isInteractive) {
    return <Span className={cn("text-foreground", className)}>{value}</Span>;
  }

  if (isEditing) {
    return (
      <Div className={cn("flex items-center", gapClass, className)}>
        <Input
          value={editValue}
          onChange={(e): void => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputHeightClass}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className={cn(buttonSizeClass, "p-0")}
        >
          <Check className={actionIconSizeClass} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className={cn(buttonSizeClass, "p-0")}
        >
          <X className={actionIconSizeClass} />
        </Button>
      </Div>
    );
  }

  return (
    <Div className={cn("group flex items-center", gapClass, className)}>
      <Span className="text-foreground">{value}</Span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className={cn(editButtonSizeClass, "p-0 transition-opacity")}
      >
        <Edit2 className={editIconSizeClass} />
      </Button>
    </Div>
  );
}

MarkdownEditorWidget.displayName = "MarkdownEditorWidget";

export default MarkdownEditorWidget;

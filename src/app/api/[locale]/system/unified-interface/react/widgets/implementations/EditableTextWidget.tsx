"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check, Edit2, X } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import { useIsMobile } from "@/hooks/use-media-query";
import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";

import type { WidgetType } from "../../../shared/types/enums";
import { extractEditableTextData } from "../../../shared/widgets/logic/editable-text";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../shared/widgets/utils/widget-helpers";
import { useWidgetActions } from "../renderers/ToolActionHandler";

/**
 * Text display with inline editing capability.
 */
export function EditableTextWidget<const TKey extends string>({
  value: data,
  field,
  context,
  onAction,
  className,
}: ReactWidgetProps<typeof WidgetType.MARKDOWN_EDITOR, TKey>): JSX.Element {
  const { gap, inputHeight, buttonSize, actionIconSize, editIconSize } =
    field.ui;

  // Get classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const actionIconSizeClass = getIconSizeClassName(actionIconSize);
  const editIconSizeClass = getIconSizeClassName(editIconSize);

  // Height mappings
  const inputHeightClass =
    inputHeight === "xs"
      ? "h-6"
      : inputHeight === "sm"
        ? "h-8"
        : inputHeight === "lg"
          ? "h-10"
          : "h-8";

  const buttonSizeClass =
    buttonSize === "xs"
      ? "h-6 w-6"
      : buttonSize === "sm"
        ? "h-8 w-8"
        : buttonSize === "lg"
          ? "h-10 w-10"
          : "h-8 w-8";

  const editButtonSizeClass =
    buttonSize === "xs"
      ? "h-5 w-5"
      : buttonSize === "sm"
        ? "h-6 w-6"
        : "h-6 w-6";

  const extractedData = extractEditableTextData(data);

  const { value, placeholder, readonly } = extractedData ?? {
    value: "",
    placeholder: undefined,
    readonly: true,
  };

  // Hooks must be called before any early returns
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const { handleAction, isProcessing } = useWidgetActions(onAction);
  const isTouchDevice = useIsMobile();

  if (!extractedData) {
    return <Span className={cn("text-foreground", className)}>—</Span>;
  }

  const handleEdit = (): void => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
      await handleAction("edit", {
        type: "edit",
        fieldName: "value",
        oldValue: value,
        newValue: editValue,
      });
      setIsEditing(false);
    } catch {
      // Error is handled by useWidgetActions
    }
  };

  const handleCancel = (): void => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: InputKeyboardEvent): void => {
    if (e.key === "Enter") {
      void handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!context.isInteractive || readonly) {
    return (
      <Span className={cn("text-foreground", className)}>
        {value || placeholder || "—"}
      </Span>
    );
  }

  if (isEditing) {
    return (
      <Div className={cn("flex items-center", gapClass || "gap-2", className)}>
        <Input
          value={editValue}
          onChange={(e): void => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder={placeholder}
          className={inputHeightClass}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isProcessing}
          className={cn(buttonSizeClass, "p-0")}
        >
          <Check className={actionIconSizeClass || "h-4 w-4"} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isProcessing}
          className={cn(buttonSizeClass, "p-0")}
        >
          <X className={actionIconSizeClass || "h-4 w-4"} />
        </Button>
      </Div>
    );
  }

  return (
    <Div
      className={cn("group flex items-center", gapClass || "gap-2", className)}
    >
      <Span className="text-foreground">{value || placeholder || "—"}</Span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className={cn(
          editButtonSizeClass,
          "p-0 transition-opacity",
          isTouchDevice ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Edit2 className={editIconSizeClass || "h-3 w-3"} />
      </Button>
    </Div>
  );
}

EditableTextWidget.displayName = "EditableTextWidget";

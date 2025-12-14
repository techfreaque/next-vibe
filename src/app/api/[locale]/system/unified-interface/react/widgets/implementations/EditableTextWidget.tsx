"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check, Edit2, X } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";

import type { WidgetType } from "../../../shared/types/enums";
import { extractEditableTextData } from "../../../shared/widgets/logic/editable-text";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { useWidgetActions } from "../renderers/ToolActionHandler";

/**
 * Text display with inline editing capability.
 */
export function EditableTextWidget({
  value: data,
  context,
  onAction,
  className,
}: ReactWidgetProps<typeof WidgetType.MARKDOWN_EDITOR>): JSX.Element {
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
      <Div className={cn("flex items-center gap-2", className)}>
        <Input
          value={editValue}
          onChange={(e): void => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder={placeholder}
          className="h-8"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isProcessing}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isProcessing}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </Div>
    );
  }

  return (
    <Div className={cn("group flex items-center gap-2", className)}>
      <Span className="text-foreground">{value || placeholder || "—"}</Span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </Div>
  );
}

EditableTextWidget.displayName = "EditableTextWidget";

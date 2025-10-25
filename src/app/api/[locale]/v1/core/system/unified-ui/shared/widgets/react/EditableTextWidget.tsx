"use client";

import { Check, Edit2, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Input } from "next-vibe-ui/ui/input";
import type { JSX, KeyboardEvent } from "react";
import { useState } from "react";

import type { RenderableValue, WidgetComponentProps } from "../types";
import { useWidgetActions } from "./ToolActionHandler";

/**
 * Editable Text Widget Component
 * Text display with inline editing capability
 */
export function EditableTextWidget({
  data,
  metadata,
  context,
  onAction,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const value =
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
      ? String(data)
      : "";
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const { handleAction, isProcessing } = useWidgetActions(onAction);

  const handleEdit = (): void => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
      await handleAction("edit", editValue, {
        fieldName: metadata.name,
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      void handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!context.isInteractive) {
    return (
      <span className={cn("text-foreground", className)} style={style}>
        {value || "—"}
      </span>
    );
  }

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", className)} style={style}>
        <Input
          value={editValue}
          onChange={(e): void => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="h-8"
          autoFocus
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
      </div>
    );
  }

  return (
    <div
      className={cn("group flex items-center gap-2", className)}
      style={style}
    >
      <span className="text-foreground">{value || "—"}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

EditableTextWidget.displayName = "EditableTextWidget";

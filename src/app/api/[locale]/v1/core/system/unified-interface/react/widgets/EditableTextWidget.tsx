"use client";

import { Check, Edit2, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Div } from "@/packages/next-vibe-ui/web/ui/div";
import { Span } from "@/packages/next-vibe-ui/web/ui/span";
import { Button } from "@/packages/next-vibe-ui/web/ui/button";
import { Input } from "@/packages/next-vibe-ui/web/ui/input";
import type { JSX, KeyboardEvent } from "react";
import { useState } from "react";

import type { WidgetComponentProps } from "../types";
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
}: WidgetComponentProps): JSX.Element {
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
      await handleAction(
        "edit",
        { value: editValue },
        {
          fieldName: metadata.name,
        },
      );
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
      <Span className={cn("text-foreground", className)} style={style}>
        {value || "—"}
      </Span>
    );
  }

  if (isEditing) {
    return (
      <Div className={cn("flex items-center gap-2", className)} style={style}>
        <Input
          value={editValue}
          onChange={(e): void => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
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
    <Div
      className={cn("group flex items-center gap-2", className)}
      style={style}
    >
      <Span className="text-foreground">{value || "—"}</Span>
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

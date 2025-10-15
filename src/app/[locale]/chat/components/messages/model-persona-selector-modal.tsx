"use client";

import { Send, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { useState } from "react";

import { Button, Textarea } from "@/packages/next-vibe-ui/web/ui";

import type { ModelId } from "../../lib/config/models";
import { ModelSelector } from "../input/model-selector";
import { PersonaSelector } from "../input/persona-selector";

interface ModelPersonaSelectorModalProps {
  title: string;
  description: string;
  selectedModel: ModelId;
  selectedTone: string;
  onModelChange: (model: ModelId) => void;
  onToneChange: (tone: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
  showInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
}

export function ModelPersonaSelectorModal({
  title,
  description,
  selectedModel,
  selectedTone,
  onModelChange,
  onToneChange,
  onConfirm,
  onCancel,
  confirmLabel = "Send",
  isLoading = false,
  showInput = false,
  inputValue = "",
  onInputChange,
  inputPlaceholder = "Type your response...",
}: ModelPersonaSelectorModalProps) {
  return (
    <div className="w-full max-h-[80dvh] overflow-y-auto">
      <div
        className={cn(
          "p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border rounded-lg shadow-lg",
          "w-full",
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Input field (for Answer as AI) */}
        {showInput && (
          <div className="mb-4">
            <Textarea
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              rows={3}
              className="w-full min-h-[80px]"
              autoFocus
            />
          </div>
        )}

        {/* Selectors */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <ModelSelector value={selectedModel} onChange={onModelChange} />
            <PersonaSelector value={selectedTone} onChange={onToneChange} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            size="sm"
            variant="ghost"
            className="h-10 min-h-[44px]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || (showInput && !inputValue.trim())}
            size="sm"
            variant="default"
            className="h-10 min-h-[44px]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

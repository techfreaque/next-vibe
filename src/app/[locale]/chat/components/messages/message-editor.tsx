"use client";

import type { JSX } from "react";
import React from "react";
import { RotateCcw, GitBranch, X } from "lucide-react";

import type { ChatMessage } from "../../lib/storage/types";
import type { ModelId } from "../../lib/config/models";
import { Button, Textarea } from "@/packages/next-vibe-ui/web/ui";
import { ModelSelector } from "../input/model-selector";
import { PersonaSelector } from "../input/persona-selector";
import { useMessageEditor } from "./use-message-editor";
import { cn } from "next-vibe/shared/utils";

interface MessageEditorProps {
  message: ChatMessage;
  selectedModel: ModelId;
  selectedTone: string;
  onSave: (messageId: string, newContent: string) => Promise<void>;
  onCancel: () => void;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;
  onBranch?: (messageId: string, content: string) => Promise<void>;
}

export function MessageEditor({
  message,
  selectedModel,
  selectedTone,
  onSave,
  onCancel,
  onModelChange,
  onToneChange,
  onBranch,
}: MessageEditorProps): JSX.Element {
  // Use custom hook for editor logic
  const editor = useMessageEditor({
    message,
    onSave,
    onBranch,
    onCancel,
  });

  return (
    <div ref={editor.editorRef} className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void editor.handleOverwrite();
        }}
        className={cn(
          "p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border rounded-lg shadow-lg",
          "w-full"
        )}
      >
        {/* Textarea */}
        <div className="relative mb-3">
          <Textarea
            ref={editor.textareaRef}
            value={editor.content}
            onChange={(e) => editor.setContent(e.target.value)}
            onKeyDown={editor.handleKeyDown}
            placeholder="Edit your message..."
            disabled={editor.isLoading}
            className="px-0"
            variant="ghost"
            rows={3}
          />

          {/* Hint Text - Shows when textarea is empty */}
          {!editor.content && (
            <div className="absolute top-2 left-0 pointer-events-none text-sm text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘/Ctrl+Enter</kbd> to overwrite,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to cancel
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          {/* Model and Tone Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {onModelChange && (
              <ModelSelector
                value={selectedModel}
                onChange={onModelChange}
              />
            )}
            {onToneChange && (
              <PersonaSelector
                value={selectedTone}
                onChange={onToneChange}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Overwrite Button */}
            <Button
              type="submit"
              disabled={!editor.content.trim() || editor.isLoading}
              size="sm"
              variant="default"
              className="flex-1 sm:flex-none h-9"
              title="Overwrite message and regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              {editor.isLoading && editor.actionType === "overwrite" ? "Overwriting..." : "Overwrite & Retry"}
            </Button>

            {/* Branch Button */}
            {onBranch && (
              <Button
                type="button"
                onClick={editor.handleBranch}
                disabled={!editor.content.trim() || editor.isLoading}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none h-9"
                title="Create a new branch from this message"
              >
                <GitBranch className="h-3.5 w-3.5 mr-2" />
                {editor.isLoading && editor.actionType === "branch" ? "Branching..." : "Branch"}
              </Button>
            )}

            {/* Cancel Button */}
            <Button
              type="button"
              onClick={editor.handleCancel}
              disabled={editor.isLoading}
              size="sm"
              variant="ghost"
              className="flex-shrink-0 h-9"
              title="Cancel editing"
            >
              <X className="h-3.5 w-3.5 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}


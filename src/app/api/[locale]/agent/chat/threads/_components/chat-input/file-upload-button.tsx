"use client";

/**
 * File Upload Button Component
 * Allows users to attach files to chat messages
 */

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Paperclip, X } from "next-vibe-ui/ui/icons";
import {
  Input,
  type InputChangeEvent,
  type InputRefObject,
} from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";
import { useRef } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { isAllowedFileType } from "../../../incognito/file-utils";

interface FileUploadButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  attachments: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export function FileUploadButton({
  disabled,
  locale,
  attachments,
  onFilesSelected,
  onRemoveFile,
}: FileUploadButtonProps): JSX.Element {
  const { t } = simpleT(locale);
  const fileInputRef = useRef<InputRefObject>(null);

  const handleFileSelect = (e: InputChangeEvent<"file">): void => {
    const files = [...(e.target.files || [])];
    if (files.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (const file of files) {
      if (isAllowedFileType(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      // eslint-disable-next-line no-alert
      alert(`File type not allowed: ${invalidFiles.join(", ")}`);
    }

    if (validFiles.length > 0) {
      onFilesSelected([...attachments, ...validFiles]);
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click?.();
  };

  return (
    <Div className="flex items-center gap-1">
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleClick}
              disabled={disabled}
              className="h-8 w-8 @sm:h-9 @sm:w-9 relative"
            >
              <Paperclip className="h-4 w-4" />
              {attachments.length > 0 && (
                <Div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {attachments.length}
                </Div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t("app.chat.input.attachments.uploadFile")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Preview of attached files */}
      {attachments.length > 0 && (
        <Div className="flex flex-wrap gap-1 max-w-xs">
          {attachments.map((file, index) => (
            <Div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
            >
              <Span className="truncate max-w-[100px]">{file.name}</Span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(index)}
                className="h-4 w-4 p-0 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}

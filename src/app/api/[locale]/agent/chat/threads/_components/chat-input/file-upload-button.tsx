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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";
import { useRef, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { isAllowedFileType } from "../../../incognito/file-utils";

interface FileUploadButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  attachments: File[];
  onFilesSelected: (files: File[] | ((prev: File[]) => File[])) => void;
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
  const [popoverOpen, setPopoverOpen] = useState(false);

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
      onFilesSelected((prev) => [...prev, ...validFiles]);
      // Open popover to show the files
      setPopoverOpen(true);
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = (): void => {
    if (attachments.length > 0) {
      // If files attached, toggle popover
      setPopoverOpen(!popoverOpen);
    } else {
      // If no files, open file picker
      fileInputRef.current?.click?.();
    }
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {attachments.length > 0 ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleButtonClick}
              disabled={disabled}
              className="h-8 w-8 @sm:h-9 @sm:w-9 relative"
            >
              <Paperclip className="h-4 w-4" />
              <Div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                {attachments.length}
              </Div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-3"
            align="start"
            side="top"
            sideOffset={8}
          >
            <Div className="space-y-2">
              <Div className="flex items-center justify-between">
                <Span className="text-sm font-semibold">
                  {t("app.chat.input.attachments.attachedFiles")} (
                  {attachments.length})
                </Span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fileInputRef.current?.click?.();
                  }}
                  className="h-7 text-xs"
                >
                  {t("app.chat.input.attachments.addMore")}
                </Button>
              </Div>
              <Div className="space-y-1.5 max-h-60 overflow-y-auto">
                {attachments.map((file, index) => (
                  <Div
                    key={index}
                    className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded hover:bg-muted/70 transition-colors"
                  >
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Div className="flex-1 min-w-0">
                      <Div className="text-sm truncate">{file.name}</Div>
                      <Div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </Div>
                    </Div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFile(index)}
                      className="h-6 w-6 shrink-0 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </Div>
                ))}
              </Div>
            </Div>
          </PopoverContent>
        </Popover>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleButtonClick}
                disabled={disabled}
                className="h-8 w-8 @sm:h-9 @sm:w-9"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t("app.chat.input.attachments.uploadFile")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}

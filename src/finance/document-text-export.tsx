"use client";

import { parseError } from "next-vibe/core/utils/parse-error";
import { Button } from "next-vibe/ui/components/button";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Download } from "next-vibe/ui/components/icons/Download";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  downloadFile,
  supportsTextFileDownload,
} from "next-vibe/ui/lib/download";
import { useWidgetLogger } from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useState } from "react";

interface DocumentTextExportProps {
  filename: string;
  content: string;
  mimeType: string;
  downloadLabel: string;
  copyLabel: string;
  copiedLabel: string;
  copyErrorLabel: string;
}

export function DocumentTextExportButton({
  filename,
  content,
  mimeType,
  downloadLabel,
  copyLabel,
  copiedLabel,
  copyErrorLabel,
}: DocumentTextExportProps): JSX.Element {
  const logger = useWidgetLogger();
  const [lastCopy, setLastCopy] = useState<{
    content: string;
    copied: boolean;
  }>();
  const handleClick = async (): Promise<void> => {
    if (supportsTextFileDownload) {
      downloadFile(filename, content, mimeType);
      return;
    }
    try {
      const copied = await copyToClipboard(content, logger);
      setLastCopy({ content, copied });
    } catch (error) {
      logger.error("Could not copy document text", parseError(error));
      setLastCopy({ content, copied: false });
    }
  };
  const label =
    lastCopy?.content === content
      ? lastCopy.copied
        ? copiedLabel
        : copyErrorLabel
      : copyLabel;
  return (
    <Button type="button" size="sm" onClick={() => void handleClick()}>
      {supportsTextFileDownload ? (
        <Download className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {supportsTextFileDownload ? downloadLabel : label}
    </Button>
  );
}

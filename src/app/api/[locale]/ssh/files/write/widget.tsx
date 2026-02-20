/**
 * SSH Files Write Widget — File Writer
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Edit } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import React, { useCallback } from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { FilesWriteResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: FilesWriteResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

export function FilesWriteContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm<typeof endpoints.POST>();
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();

  const value = field.value;
  const isLoading = endpointMutations?.read?.isLoading ?? false;
  const content = form?.watch("content") ?? "";

  const handleWrite = useCallback((): void => {
    onSubmit?.();
  }, [onSubmit]);

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[400px]">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Edit className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.files.write.widget.title")}
        </Span>
        <Button
          type="button"
          size="sm"
          onClick={handleWrite}
          disabled={isLoading}
        >
          {isLoading
            ? t("app.api.ssh.files.write.widget.writing")
            : t("app.api.ssh.files.write.widget.writeButton")}
        </Button>
      </Div>

      {/* Result */}
      {value && (
        <Div className="flex items-center gap-2 px-4 py-2 border-b bg-green-50 dark:bg-green-950/20 text-xs text-green-700 dark:text-green-300">
          <Span>
            ✓ {t("app.api.ssh.files.write.widget.bytesWritten")}:{" "}
            {value.bytesWritten.toLocaleString()}
          </Span>
        </Div>
      )}

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => form?.setValue("content", e.target.value)}
        placeholder={t("app.api.ssh.files.write.widget.placeholder")}
        className="flex-1 font-mono text-xs rounded-none border-0 resize-none min-h-[300px]"
        disabled={isLoading}
      />
    </Div>
  );
}

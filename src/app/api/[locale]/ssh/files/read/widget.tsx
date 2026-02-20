/**
 * SSH Files Read Widget — File Viewer / Editor
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { FileText } from "next-vibe-ui/ui/icons";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useState } from "react";

import {
  useWidgetContext,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { FilesReadResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: FilesReadResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

export function FilesReadContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const { endpointMutations } = useWidgetContext();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");

  const value = field.value;
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const handleEdit = useCallback((): void => {
    setEditContent(value?.content ?? "");
    setEditMode(true);
  }, [value]);

  const handleCancel = useCallback((): void => {
    setEditMode(false);
  }, []);

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[400px]">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.files.read.widget.title")}
        </Span>
        {value && !editMode && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleEdit}
          >
            {t("app.api.ssh.files.read.widget.editButton")}
          </Button>
        )}
        {editMode && (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancel}
            >
              {t("app.api.ssh.files.read.widget.cancelButton")}
            </Button>
            <Button type="button" size="sm">
              {t("app.api.ssh.files.read.widget.saveButton")}
            </Button>
          </>
        )}
      </Div>

      {/* Meta bar */}
      {value && (
        <Div className="flex items-center gap-4 px-4 py-1.5 border-b bg-muted/20 text-xs text-muted-foreground">
          <Span>
            {t("app.api.ssh.files.read.widget.size")}:{" "}
            {value.size.toLocaleString()} B
          </Span>
          <Span>
            {t("app.api.ssh.files.read.widget.encoding")}: {value.encoding}
          </Span>
          {value.truncated && (
            <Span className="text-amber-600 dark:text-amber-400">
              {t("app.api.ssh.files.read.widget.truncatedWarning")}
            </Span>
          )}
        </Div>
      )}

      {/* Content */}
      {isLoading ? (
        <Div className="flex items-center justify-center flex-1 py-12">
          <P className="text-sm text-muted-foreground">
            {t("app.api.ssh.files.read.widget.loading")}
          </P>
        </Div>
      ) : editMode ? (
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="flex-1 font-mono text-xs rounded-none border-0 resize-none min-h-[300px]"
        />
      ) : value?.content ? (
        <Pre className="flex-1 px-4 py-3 text-xs font-mono whitespace-pre-wrap break-words overflow-auto">
          {value.content}
        </Pre>
      ) : (
        <Div className="flex items-center justify-center flex-1 py-12">
          <P className="text-sm text-muted-foreground">
            {t("app.api.ssh.files.read.widget.empty")}
          </P>
        </Div>
      )}
    </Div>
  );
}

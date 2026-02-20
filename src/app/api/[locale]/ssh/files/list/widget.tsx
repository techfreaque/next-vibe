/**
 * SSH Files List Widget — File Browser
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronRight,
  FileText,
  Folder,
  Link,
  RefreshCw,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback } from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { FilesListResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: FilesListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

function formatSize(size: number | null): string {
  if (size === null) {
    return "—";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(s: string | null): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 10);
}

export function FilesListContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm<typeof endpoints.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();

  const value = field.value;
  const isLoading = endpointMutations?.read?.isLoading ?? false;
  const currentPath = value?.currentPath ?? "~";

  const handleNavigate = useCallback(
    (name: string): void => {
      const newPath =
        currentPath === "~" ? `~/${name}` : `${currentPath}/${name}`;
      form?.setValue("path", newPath);
      onSubmit?.();
    },
    [currentPath, form, onSubmit],
  );

  const handleRefresh = useCallback((): void => {
    onSubmit?.();
  }, [onSubmit]);

  const pathParts = currentPath.replace(/^~/, "~").split("/").filter(Boolean);

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[400px]">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Folder className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.files.list.widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </Div>

      {/* Breadcrumb */}
      <Div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/20 text-xs flex-wrap">
        {pathParts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            <Span className="font-mono">{part}</Span>
          </React.Fragment>
        ))}
        {pathParts.length === 0 && (
          <Span className="font-mono text-muted-foreground">
            {t("app.api.ssh.files.list.widget.home")}
          </Span>
        )}
      </Div>

      {/* File list */}
      {isLoading ? (
        <Div className="flex items-center justify-center flex-1 py-12">
          <P className="text-sm text-muted-foreground">
            {t("app.api.ssh.files.list.widget.loading")}
          </P>
        </Div>
      ) : value?.entries && value.entries.length > 0 ? (
        <Div className="flex flex-col divide-y overflow-y-auto flex-1">
          {value.entries.map((entry) => (
            <Div
              key={entry.name}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted/40 cursor-pointer"
              onClick={() => {
                if (entry.type === "dir") {
                  handleNavigate(entry.name);
                }
              }}
            >
              {entry.type === "dir" ? (
                <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
              ) : entry.type === "symlink" ? (
                <Link className="h-4 w-4 text-purple-500 flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <Span className="text-sm font-mono flex-1 truncate">
                {entry.name}
              </Span>
              <Span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
                {formatSize(entry.size)}
              </Span>
              <Span className="text-xs text-muted-foreground w-20 text-right">
                {formatDate(entry.modifiedAt)}
              </Span>
            </Div>
          ))}
        </Div>
      ) : (
        <Div className="flex items-center justify-center flex-1 py-12">
          <P className="text-sm text-muted-foreground">
            {t("app.api.ssh.files.list.widget.emptyDir")}
          </P>
        </Div>
      )}
    </Div>
  );
}

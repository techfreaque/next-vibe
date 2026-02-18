/**
 * Custom Widget for IMAP Folders List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "next-vibe-ui/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import {
  ImapFolderSortField,
  ImapFolderSortFieldOptions,
  ImapSpecialUseTypeOptions,
  ImapSyncStatus,
  ImapSyncStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../../enum";
import type definition from "./definition";
import type { ImapFoldersListResponseOutput } from "./definition";

type ImapFolder = NonNullable<ImapFoldersListResponseOutput["folders"]>[number];

interface CustomWidgetProps {
  field: {
    value: ImapFoldersListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const SYNC_COLORS: Record<string, string> = {
  [ImapSyncStatus.SYNCED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [ImapSyncStatus.SYNCING]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [ImapSyncStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [ImapSyncStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function FolderRow({
  folder,
  t,
}: {
  folder: ImapFolder;
  t: (key: string) => string;
}): React.JSX.Element {
  const syncColor =
    SYNC_COLORS[folder.syncStatus] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div className="flex items-center gap-3 p-3 rounded-lg border">
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">
            {folder.displayName ?? folder.name}
          </Span>
          {folder.specialUseType !== null &&
            folder.specialUseType !== undefined && (
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {t(folder.specialUseType)}
              </Span>
            )}
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              syncColor,
            )}
          >
            {t(folder.syncStatus)}
          </Span>
        </Div>
        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <Span>
            {t("app.api.emails.imapClient.folders.list.messages")}:{" "}
            {folder.messageCount}
          </Span>
          <Span>
            {t("app.api.emails.imapClient.folders.list.unseen")}:{" "}
            {folder.unseenCount}
          </Span>
          <Span className="text-muted-foreground/60">{folder.path}</Span>
        </Div>
      </Div>
    </Div>
  );
}

export function ImapFoldersListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const sortBy: string = form?.watch("sortBy")?.[0] ?? ImapFolderSortField.NAME;
  const sortOrder: string = form?.watch("sortOrder")?.[0] ?? SortOrder.ASC;
  const activeSyncStatuses: string[] = form?.watch("syncStatus") ?? [];
  const activeSpecialUseTypes: string[] = form?.watch("specialUseType") ?? [];
  const currentPage: number = form?.watch("page") ?? 1;
  const limit: number = form?.watch("limit") ?? 20;

  const folders = useMemo(
    () => field.value?.folders ?? [],
    [field.value?.folders],
  );
  const isLoading = field.value === null || field.value === undefined;
  const total = field.value?.pagination?.total ?? 0;
  const totalPages =
    field.value?.pagination?.totalPages ?? (Math.ceil(total / limit) || 1);

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue("sortBy", [value]);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue("sortOrder", [value]);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      form?.setValue("page", page);
      if (onSubmit) {
        onSubmit();
      } else {
        endpointMutations?.read?.refetch?.();
      }
    },
    [form, onSubmit, endpointMutations],
  );

  const toggleSyncStatus = useCallback(
    (value: string): void => {
      const current: string[] = form?.watch("syncStatus") ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      form?.setValue("syncStatus", next);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const toggleSpecialUseType = useCallback(
    (value: string): void => {
      const current: string[] = form?.watch("specialUseType") ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      form?.setValue("specialUseType", next);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleSync = useCallback((): void => {
    void (async (): Promise<void> => {
      const syncDef = await import("../sync/definition");
      navigate(syncDef.default.POST, {});
    })();
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.folders.list.title")}
          {total > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.emails.imapClient.folders.list.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSync}
          className="gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          {t("app.api.emails.imapClient.folders.list.sync")}
        </Button>
      </Div>

      {/* Search + sort */}
      <Div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap">
        <Div className="flex-1 min-w-[160px]">
          <TextFieldWidget
            fieldName={`${fieldName}.search`}
            field={children.search}
          />
        </Div>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="h-9 min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ImapFolderSortFieldOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="h-9 min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SortOrderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {/* Sync status filter chips */}
      <Div className="px-4 pb-1 flex items-center gap-1.5 flex-wrap">
        {ImapSyncStatusOptions.map((opt) => {
          const isActive = activeSyncStatuses.includes(opt.value);
          return (
            <Button
              key={opt.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleSyncStatus(opt.value);
              }}
              className={
                isActive
                  ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                  : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }
            >
              {t(opt.label)}
            </Button>
          );
        })}
      </Div>

      {/* Special use type filter chips */}
      <Div className="px-4 pb-2 flex items-center gap-1.5 flex-wrap">
        {ImapSpecialUseTypeOptions.map((opt) => {
          const isActive = activeSpecialUseTypes.includes(opt.value);
          return (
            <Button
              key={opt.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleSpecialUseType(opt.value);
              }}
              className={
                isActive
                  ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                  : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }
            >
              {t(opt.label)}
            </Button>
          );
        })}
      </Div>

      {/* Folder list */}
      <Div className="px-4 py-3">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : folders.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} t={t} />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {t("app.api.emails.imapClient.folders.list.empty")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {currentPage} / {totalPages}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

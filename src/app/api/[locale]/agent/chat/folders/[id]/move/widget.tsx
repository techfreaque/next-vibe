"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetContext,
  useWidgetForm,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { simpleT } from "@/i18n/core/shared";

import { useSidebarFolders } from "../../widget/widget";
import type definitions from "./definition";

type MoveDefinition = (typeof definitions)["PATCH"];

interface MoveWidgetProps {
  field: {
    value: MoveDefinition["types"]["ResponseOutput"] | null | undefined;
  } & MoveDefinition["fields"];
  fieldName: string;
}

export function FolderMoveContainer({ field }: MoveWidgetProps): JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = simpleT(locale);
  const form = useWidgetForm<MoveDefinition>();

  const folders = useSidebarFolders();
  // id comes from urlPathParams — read from form values
  const currentFolderId = (form.watch("id") as string | undefined) ?? undefined;

  // Compute descendant IDs to exclude (can't move into self or children)
  const excludedIds = ((): Set<string> => {
    if (!currentFolderId) {
      return new Set<string>();
    }
    const result = new Set<string>([currentFolderId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const f of folders) {
        if (!result.has(f.id) && f.parentId && result.has(f.parentId)) {
          result.add(f.id);
          changed = true;
        }
      }
    }
    return result;
  })();

  const availableFolders = folders.filter((f) => !excludedIds.has(f.id));
  const selectedParentId = (form.watch("parentId") as string | null) ?? null;

  const renderFolder = (
    parentId: string | null,
    depth: number,
  ): JSX.Element[] =>
    availableFolders
      .filter((f) => f.parentId === parentId)
      .map((f): JSX.Element => {
        const isSelected = selectedParentId === f.id;
        return (
          <Div key={f.id}>
            <Div style={{ paddingLeft: `${depth * 16 + 12}px` }}>
              <Button
                variant="ghost"
                size="unset"
                type="button"
                onClick={() => form.setValue("parentId", f.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
                  isSelected ? "bg-accent border-2 border-primary" : ""
                }`}
              >
                <Icon
                  icon={f.icon ?? "folder"}
                  className="h-4 w-4 flex-shrink-0"
                />
                <Span className="text-sm truncate">{f.name}</Span>
              </Button>
            </Div>
            {renderFolder(f.id, depth + 1)}
          </Div>
        );
      });

  void field;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="text-sm text-muted-foreground">
        {t("app.chat.moveFolder.description")}
      </Div>

      {/* Root level option */}
      <Button
        variant="ghost"
        size="unset"
        type="button"
        onClick={() => form.setValue("parentId", null)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
          selectedParentId === null ? "bg-accent border-2 border-primary" : ""
        }`}
      >
        <Span className="text-sm font-medium">
          {t("app.chat.moveFolder.rootLevel")}
        </Span>
      </Button>

      <ScrollArea className="h-[300px] border rounded-md p-2">
        <Div className="flex flex-col gap-1">{renderFolder(null, 0)}</Div>
      </ScrollArea>

      <SubmitButtonWidget<MoveDefinition>
        field={{
          icon: "folder-input",
          variant: "primary",
          className: "w-full",
        }}
      />
    </Div>
  );
}

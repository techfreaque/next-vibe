/**
 * CortexNav — shared top navigation bar for all Cortex widgets.
 *
 * Shows:
 * - Back button when opened via navigation.push
 * - Current path context (breadcrumb-lite)
 * - Context-aware action buttons (read, edit, write, list, search, tree, delete, move)
 *
 * Each widget passes the actions relevant to its current state.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { FolderOpen } from "next-vibe-ui/ui/icons/FolderOpen";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetLocale,
  useWidgetNavigation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { scopedTranslation } from "../i18n";

export type CortexNavAction =
  | "list"
  | "read"
  | "write"
  | "edit"
  | "delete"
  | "move"
  | "search"
  | "tree";

interface CortexNavProps {
  /** Current file/dir path for context display. Optional. */
  path?: string;
  /** Which action buttons to show. Order is preserved. */
  actions?: CortexNavAction[];
  /** Pre-fill data for each action's push */
  actionData?: Partial<
    Record<CortexNavAction, Record<string, string | number | boolean>>
  >;
}

const ACTION_META: Record<
  CortexNavAction,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  list: { icon: FolderOpen, color: "text-muted-foreground" },
  read: { icon: FileText, color: "text-blue-400" },
  write: { icon: Save, color: "text-green-400" },
  edit: { icon: Edit2, color: "text-amber-400" },
  delete: { icon: Trash2, color: "text-red-400" },
  move: { icon: FolderInput, color: "text-purple-400" },
  search: { icon: Search, color: "text-cyan-400" },
  tree: { icon: GitBranch, color: "text-orange-400" },
};

/** Derive parent directory path from a file path */
function parentDir(path: string): string {
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  if (parts.length <= 1) {
    return "/";
  }
  return `/${parts.slice(0, -1).join("/")}`;
}

/** Short display label for a path */
function pathLabel(path: string): string {
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  return parts.length === 0 ? "/" : (parts[parts.length - 1] ?? "/");
}

export function CortexNav({
  path,
  actions = [],
  actionData = {},
}: CortexNavProps): React.JSX.Element {
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const isPushed = navigation.canGoBack;

  async function navigate(action: CortexNavAction): Promise<void> {
    const data = actionData[action] ?? {};

    // Compute default data based on action + current path
    const defaults: Record<string, string | number | boolean> = {};
    if (path) {
      switch (action) {
        case "list":
          defaults.path = parentDir(path);
          break;
        case "read":
        case "edit":
        case "delete":
          defaults.path = path;
          break;
        case "write":
          defaults.path = path;
          break;
        case "move":
          defaults.from = path;
          break;
        case "search":
          defaults.path = parentDir(path);
          break;
        case "tree":
          defaults.path = parentDir(path);
          break;
      }
    }

    const merged = { ...defaults, ...data };

    switch (action) {
      case "list": {
        const def = await import("../list/definition");
        navigation.push(def.default.GET, { data: merged });
        break;
      }
      case "read": {
        const def = await import("../read/definition");
        navigation.push(def.default.GET, { data: merged });
        break;
      }
      case "write": {
        const def = await import("../write/definition");
        navigation.push(def.default.POST, { data: merged });
        break;
      }
      case "edit": {
        const def = await import("../edit/definition");
        navigation.push(def.default.PATCH, { data: merged });
        break;
      }
      case "delete": {
        const def = await import("../delete/definition");
        navigation.push(def.default.DELETE, { data: merged });
        break;
      }
      case "move": {
        const def = await import("../move/definition");
        navigation.push(def.default.POST, { data: merged });
        break;
      }
      case "search": {
        const def = await import("../search/definition");
        navigation.push(def.default.GET, { data: merged });
        break;
      }
      case "tree": {
        const def = await import("../tree/definition");
        navigation.push(def.default.GET, { data: merged });
        break;
      }
    }
  }

  if (!isPushed && actions.length === 0 && !path) {
    return <></>;
  }

  return (
    <Div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-muted/20">
      {/* Back */}
      {isPushed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <Span className="text-xs">{t("nav.back")}</Span>
        </Button>
      )}

      {isPushed && (actions.length > 0 || path) && (
        // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- decorative separator
        <Span className="text-border/70 text-sm mx-0.5">|</Span>
      )}

      {/* Path context */}
      {path && (
        <Div className="flex items-center gap-1 min-w-0 mr-1">
          <Brain className="h-3 w-3 text-muted-foreground/50 shrink-0" />
          <Span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
            {pathLabel(path)}
          </Span>
        </Div>
      )}

      {path && actions.length > 0 && (
        // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- decorative separator
        <Span className="text-border/70 text-sm mx-0.5">·</Span>
      )}

      {/* Action buttons */}
      <Div className="flex items-center gap-0.5 flex-wrap">
        {actions.map((action) => {
          const meta = ACTION_META[action];
          const Icon = meta.icon;
          return (
            <Button
              key={action}
              variant="ghost"
              size="sm"
              onClick={() => void navigate(action)}
              className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
            >
              <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
              <Span className="text-xs">{t(`nav.actions.${action}`)}</Span>
            </Button>
          );
        })}
      </Div>
    </Div>
  );
}

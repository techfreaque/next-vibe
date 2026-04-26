/**
 * Cortex List Widget (Web)
 * Interactive file explorer — click folders to navigate, click files to open via read endpoint.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { FolderOpen } from "next-vibe-ui/ui/icons/FolderOpen";
import { Home } from "next-vibe-ui/ui/icons/Home";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { SquareCheck } from "next-vibe-ui/ui/icons/SquareCheck";
import { Upload } from "next-vibe-ui/ui/icons/Upload";
import { Wand2 } from "next-vibe-ui/ui/icons/Wand2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { CortexNav } from "../_shared/cortex-nav";
import { formatBytes } from "../_shared/format-bytes";

import type definition from "./definition";

const MOUNT_ICONS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    textColor: string;
  }
> = {
  memories: {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    textColor: "text-purple-300",
  },
  documents: {
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    textColor: "text-blue-300",
  },
  threads: {
    icon: MessageSquare,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    textColor: "text-cyan-300",
  },
  skills: {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    textColor: "text-amber-300",
  },
  tasks: {
    icon: SquareCheck,
    color: "text-green-400",
    bg: "bg-green-500/10",
    textColor: "text-green-300",
  },
  uploads: {
    icon: Upload,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    textColor: "text-slate-300",
  },
  searches: {
    icon: FolderOpen,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    textColor: "text-orange-300",
  },
  gens: {
    icon: Wand2,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    textColor: "text-pink-300",
  },
  favorites: {
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    textColor: "text-yellow-300",
  },
};

function getMountStyle(entryPath: string): {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  textColor: string;
} {
  const segment = entryPath.replace(/^\//, "").split("/")[0] ?? "";
  const mount = MOUNT_ICONS[segment];
  if (mount) {
    return mount;
  }
  return {
    icon: FolderOpen,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    textColor: "text-foreground",
  };
}

const FOLDER_NAME_KEYS: Record<
  string,
  | "get.folderNames.memories"
  | "get.folderNames.documents"
  | "get.folderNames.threads"
  | "get.folderNames.skills"
  | "get.folderNames.tasks"
  | "get.folderNames.uploads"
  | "get.folderNames.searches"
  | "get.folderNames.gens"
  | "get.folderNames.favorites"
  | "get.folderNames.inbox"
  | "get.folderNames.projects"
  | "get.folderNames.knowledge"
  | "get.folderNames.journal"
  | "get.folderNames.templates"
  | "get.folderNames.identity"
  | "get.folderNames.expertise"
  | "get.folderNames.context"
> = {
  memories: "get.folderNames.memories",
  documents: "get.folderNames.documents",
  threads: "get.folderNames.threads",
  skills: "get.folderNames.skills",
  tasks: "get.folderNames.tasks",
  uploads: "get.folderNames.uploads",
  searches: "get.folderNames.searches",
  gens: "get.folderNames.gens",
  favorites: "get.folderNames.favorites",
  inbox: "get.folderNames.inbox",
  projects: "get.folderNames.projects",
  knowledge: "get.folderNames.knowledge",
  journal: "get.folderNames.journal",
  templates: "get.folderNames.templates",
  identity: "get.folderNames.identity",
  expertise: "get.folderNames.expertise",
  context: "get.folderNames.context",
};

function buildBreadcrumbs(path: string): { label: string; path: string }[] {
  if (path === "/") {
    return [{ label: "/", path: "/" }];
  }
  const parts = path.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [{ label: "/", path: "/" }];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({ label: part, path: current });
  }
  return crumbs;
}

export function CortexListWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const navigation = useWidgetNavigation();

  const entries = value?.entries ?? [];
  const currentPath = value?.responsePath ?? "/";
  const crumbs = buildBreadcrumbs(currentPath);

  function navigateToFolder(path: string): void {
    form?.setValue("path", path);
    onSubmit?.();
  }

  async function openFile(filePath: string): Promise<void> {
    const readDef = await import("../read/definition");
    navigation.push(readDef.default.GET, { data: { path: filePath } });
  }

  return (
    <Div className="flex flex-col">
      {/* Top nav */}
      <CortexNav
        path={currentPath !== "/" ? currentPath : undefined}
        actions={["search", "tree", "write"]}
        actionData={{
          search: { path: currentPath },
          tree: { path: currentPath },
          write: {
            path: currentPath === "/" ? "/" : `${currentPath}/new-file.md`,
          },
        }}
      />

      {/* Breadcrumb */}
      <Div className="flex items-center gap-1 px-4 py-3 border-b border-border/50 text-sm overflow-x-auto">
        {crumbs.map((crumb, i) => (
          <Div key={crumb.path} className="flex items-center gap-1 shrink-0">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            {i === 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFolder("/")}
                className="h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <Home className="h-3.5 w-3.5" />
              </Button>
            ) : i === crumbs.length - 1 ? (
              <Span className="text-foreground font-medium">{crumb.label}</Span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFolder(crumb.path)}
                className="h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                {crumb.label}
              </Button>
            )}
          </Div>
        ))}
        <Div className="ml-auto shrink-0">
          <Badge variant="outline" className="text-xs font-mono">
            {value?.total ?? 0} {t("get.response.total.text")}
          </Badge>
        </Div>
      </Div>

      {/* Entry list */}
      {!value ? (
        <Div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Brain className="h-8 w-8 opacity-30" />
          <Span className="text-sm">{t("get.submitButton.loadingText")}</Span>
        </Div>
      ) : entries.length === 0 ? (
        <Div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <FolderOpen className="h-8 w-8 opacity-30" />
          <Span className="text-sm">{t("get.emptyState")}</Span>
        </Div>
      ) : (
        <Div className="divide-y divide-border/40">
          {entries.map((entry) => {
            const isDir =
              entry.nodeType === "dir" ||
              entry.nodeType === "enums.nodeType.dir";
            const {
              icon: Icon,
              color,
              bg,
              textColor,
            } = getMountStyle(entry.entryPath);
            const isMount = currentPath === "/";

            return (
              <Button
                key={entry.entryPath}
                variant="ghost"
                onClick={() => {
                  if (isDir) {
                    navigateToFolder(entry.entryPath);
                  } else {
                    void openFile(entry.entryPath);
                  }
                }}
                className="w-full h-auto flex items-center gap-3 px-4 py-3 justify-start rounded-none hover:bg-muted/40"
              >
                {/* Icon */}
                <Div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isMount && isDir ? bg : "bg-muted/30"}`}
                >
                  {isDir ? (
                    <Icon
                      className={`h-4 w-4 ${isMount ? color : "text-muted-foreground"}`}
                    />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                </Div>

                {/* Name + path */}
                <Div className="flex-1 min-w-0">
                  <Div
                    className={`text-sm font-medium truncate ${isMount && isDir ? textColor : "text-foreground"}`}
                  >
                    {FOLDER_NAME_KEYS[entry.name]
                      ? t(FOLDER_NAME_KEYS[entry.name]!)
                      : entry.name}
                  </Div>
                  {!isMount && (
                    <Div className="text-xs text-muted-foreground truncate font-mono">
                      {entry.entryPath}
                    </Div>
                  )}
                </Div>

                {/* Meta */}
                <Div className="flex items-center gap-3 shrink-0">
                  {entry.size !== null && entry.size > 0 && (
                    <Span className="text-xs text-muted-foreground tabular-nums">
                      {formatBytes(entry.size)}
                    </Span>
                  )}
                  <Span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(entry.updatedAt).toLocaleDateString()}
                  </Span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </Div>
              </Button>
            );
          })}
        </Div>
      )}
    </Div>
  );
}

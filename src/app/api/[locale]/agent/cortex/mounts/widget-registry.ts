/**
 * Mount Widget Registry
 *
 * Maps Cortex mount prefixes to domain-specific widget components,
 * icons, and colors. Used by DomainEnrichment to render rich UI
 * for known content types and by list/tree widgets for folder icons.
 *
 * To add a new mount widget:
 *   1. Add an entry here with extractLabel + loadWidget + translationKey + icon + color
 *   2. Add the translation key to cortex/i18n/{en,de,pl}/index.ts under `mounts`
 *   3. Done - DomainEnrichment + list/tree widgets pick it up automatically
 */

import type React from "react";

import type { CortexTranslationKey } from "../i18n";

export interface MountWidgetConfig {
  /** Extract a display-friendly identifier from the Cortex path */
  extractLabel: (path: string) => string | null;
  /** Lazy loader for the domain's detail widget component */
  loadWidget: () => Promise<{
    default: React.ComponentType<{
      path: string;
      label: string;
      mountLabel: string;
    }>;
  }>;
  /** i18n translation key for this mount type (under cortex/i18n) */
  translationKey: CortexTranslationKey;
  /** Icon component name from next-vibe-ui/ui/icons */
  icon: string;
  /** Tailwind color class prefix (e.g. "purple" → text-purple-500) */
  color: string;
  /** CLI emoji for this mount type */
  cliEmoji: string;
}

/** Default extractLabel: strip the mount prefix */
function defaultExtractLabel(prefix: string) {
  return (path: string): string | null => {
    const relative = path.slice(prefix.length + 1);
    return relative || null;
  };
}

/**
 * Registry mapping mount prefixes to domain widget configs.
 * Keys are Cortex path prefixes (e.g., "/memories", "/skills").
 */
export const MOUNT_WIDGET_REGISTRY: Record<string, MountWidgetConfig> = {
  "/memories": {
    extractLabel: defaultExtractLabel("/memories"),
    loadWidget: () =>
      import("./memory-detail-widget").then((m) => ({
        default: m.MemoryDetailWidget,
      })),
    translationKey: "mounts.memory" as const,
    icon: "Brain",
    color: "purple",
    cliEmoji: "🧠",
  },
  "/documents": {
    extractLabel: defaultExtractLabel("/documents"),
    loadWidget: () =>
      import("./document-detail-widget").then((m) => ({
        default: m.DocumentDetailWidget,
      })),
    translationKey: "mounts.document" as const,
    icon: "FileText",
    color: "blue",
    cliEmoji: "📄",
  },
  "/threads": {
    extractLabel: (path) => {
      const segments = path.split("/").filter(Boolean);
      if (segments.length < 2) {
        return null;
      }
      return segments.slice(1).join("/");
    },
    loadWidget: () =>
      import("./thread-detail-widget").then((m) => ({
        default: m.ThreadDetailWidget,
      })),
    translationKey: "mounts.thread" as const,
    icon: "MessageSquare",
    color: "cyan",
    cliEmoji: "💬",
  },
  "/skills": {
    extractLabel: (path) => {
      const segments = path.split("/").filter(Boolean);
      if (segments.length < 2) {
        return null;
      }
      return segments.slice(1).join("/").replace(/\.md$/, "");
    },
    loadWidget: () =>
      import("./skill-detail-widget").then((m) => ({
        default: m.SkillDetailWidget,
      })),
    translationKey: "mounts.skill" as const,
    icon: "Zap",
    color: "amber",
    cliEmoji: "⚡",
  },
  "/tasks": {
    extractLabel: defaultExtractLabel("/tasks"),
    loadWidget: () =>
      import("./task-detail-widget").then((m) => ({
        default: m.TaskDetailWidget,
      })),
    translationKey: "mounts.task" as const,
    icon: "SquareCheck",
    color: "green",
    cliEmoji: "✅",
  },
  "/uploads": {
    extractLabel: defaultExtractLabel("/uploads"),
    loadWidget: () =>
      import("./upload-detail-widget").then((m) => ({
        default: m.UploadDetailWidget,
      })),
    translationKey: "mounts.upload" as const,
    icon: "Paperclip",
    color: "orange",
    cliEmoji: "📎",
  },
  "/searches": {
    extractLabel: defaultExtractLabel("/searches"),
    loadWidget: () =>
      import("./search-detail-widget").then((m) => ({
        default: m.SearchDetailWidget,
      })),
    translationKey: "mounts.search" as const,
    icon: "Search",
    color: "indigo",
    cliEmoji: "🔍",
  },
  "/favorites": {
    extractLabel: defaultExtractLabel("/favorites"),
    loadWidget: () =>
      import("./favorite-detail-widget").then((m) => ({
        default: m.FavoriteDetailWidget,
      })),
    translationKey: "mounts.favorite" as const,
    icon: "Star",
    color: "yellow",
    cliEmoji: "⭐",
  },
  "/gens": {
    extractLabel: defaultExtractLabel("/gens"),
    loadWidget: () =>
      import("./gen-detail-widget").then((m) => ({
        default: m.GenDetailWidget,
      })),
    translationKey: "mounts.gen" as const,
    icon: "Wand2",
    color: "pink",
    cliEmoji: "✨",
  },
};

/**
 * Find the mount config for a given Cortex path.
 * Returns the config and extracted label, or null if no match.
 */
export function findMountWidget(path: string): {
  config: MountWidgetConfig;
  label: string;
} | null {
  for (const [prefix, config] of Object.entries(MOUNT_WIDGET_REGISTRY)) {
    if (path.startsWith(`${prefix}/`) || path === prefix) {
      const label = config.extractLabel(path);
      if (label) {
        return { config, label };
      }
    }
  }
  return null;
}

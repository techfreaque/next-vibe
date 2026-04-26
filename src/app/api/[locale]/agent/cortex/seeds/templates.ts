/* eslint-disable i18next/no-literal-string */
/**
 * Locale-aware Cortex Templates
 *
 * Template paths are canonical English (/memories/identity/..., /documents/templates/...)
 * so they match DB storage. Content is fully translated per locale.
 *
 * Memory templates (seedOnlyNew): scaffold files shown in /memories/ until user writes them.
 * Document templates (updateIfUnchanged): shown in /documents/templates/ until user writes them.
 * Default scaffold dirs: virtual directories shown in /documents/ and /memories/ until user creates real ones.
 *
 * Nothing is written to DB. Everything resolves at request time.
 */

import type { CountryLanguage } from "@/i18n/core/config";

import { CortexViewType } from "../enum";
import { scopedTranslation } from "../i18n";
import type { CortexSeedItem } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DefaultDocumentDir {
  /** Canonical path (e.g. /documents/inbox) */
  path: string;
  purpose: string;
  icon: string;
  viewType: string;
}

export interface DefaultMemoryDir {
  /** Canonical path (e.g. /memories/identity) */
  dirPath: string;
  purpose: string;
}

// ─── Canonical group/file path keys (English) ────────────────────────────────

/** Canonical memory group path segments */
const MEMORY_GROUP_PATHS: Record<string, string> = {
  identity: "identity",
  expertise: "expertise",
  context: "context",
  life: "life",
};

/** Canonical memory file path segments per group */
const MEMORY_FILE_PATHS: Record<string, Record<string, string>> = {
  identity: {
    name: "name.md",
    role: "role.md",
    goals: "goals.md",
    communication: "communication.md",
  },
  expertise: {
    skills: "skills.md",
    tools: "tools.md",
    background: "background.md",
  },
  context: {
    projects: "projects.md",
    preferences: "preferences.md",
    constraints: "constraints.md",
  },
  life: {
    career: "career.md",
    health: "health.md",
    relationships: "relationships.md",
    finances: "finances.md",
    growth: "growth.md",
    purpose: "purpose.md",
  },
};

/** Canonical document subdir path segments */
const DOCUMENT_DIR_PATHS: Record<string, string> = {
  inbox: "inbox",
  projects: "projects",
  knowledge: "knowledge",
  journal: "journal",
  templates: "templates",
};

/** Canonical document template file names */
const DOCUMENT_TEMPLATE_FILES: Record<string, string> = {
  meetingNotes: "meeting-notes.md",
  projectBrief: "project-brief.md",
  weeklyReview: "weekly-review.md",
  decisionLog: "decision-log.md",
  knowledgeArticle: "knowledge-article.md",
};

// ─── Memory Templates ─────────────────────────────────────────────────────────

/**
 * Returns all memory scaffold templates for the given locale.
 * Paths are canonical (/memories/identity/name.md); content is localized.
 */
export function getMemoryTemplates(locale: CountryLanguage): CortexSeedItem[] {
  const { t } = scopedTranslation.scopedT(locale);

  const groups = [
    {
      group: "identity" as const,
      keys: ["name", "role", "goals", "communication"] as const,
    },
    {
      group: "expertise" as const,
      keys: ["skills", "tools", "background"] as const,
    },
    {
      group: "context" as const,
      keys: ["projects", "preferences", "constraints"] as const,
    },
    {
      group: "life" as const,
      keys: [
        "career",
        "health",
        "relationships",
        "finances",
        "growth",
        "purpose",
      ] as const,
    },
  ] as const;

  const items: CortexSeedItem[] = [];
  for (const { group, keys } of groups) {
    const canonicalGroupPath = MEMORY_GROUP_PATHS[group]!;
    for (const key of keys) {
      const canonicalFilePath = MEMORY_FILE_PATHS[group]?.[key] ?? `${key}.md`;
      const content = t(`templates.memories.${group}.${key}.content` as never);
      items.push({
        id: `memory-${group}-${key}`,
        path: `/memories/${canonicalGroupPath}/${canonicalFilePath}`,
        content: content as string,
        seedOnlyNew: true,
      });
    }
  }
  return items;
}

// ─── Document Templates ───────────────────────────────────────────────────────

/**
 * Returns all document template files for the given locale.
 * Paths are canonical (/documents/templates/meeting-notes.md); content is localized.
 */
export function getDocumentTemplates(
  locale: CountryLanguage,
): CortexSeedItem[] {
  const { t } = scopedTranslation.scopedT(locale);

  const keys = [
    "meetingNotes",
    "projectBrief",
    "weeklyReview",
    "decisionLog",
    "knowledgeArticle",
  ] as const;

  return keys.map((key) => {
    const canonicalFilePath =
      DOCUMENT_TEMPLATE_FILES[key] ?? `${key.toLowerCase()}.md`;
    const content = t(`templates.documents.${key}.content` as never) as string;
    return {
      id: `doc-template-${key}`,
      path: `/documents/templates/${canonicalFilePath}`,
      content,
      updateIfUnchanged: true,
    };
  });
}

/**
 * Returns all templates (memory scaffolds + document templates).
 */
export function getAllTemplates(locale: CountryLanguage): CortexSeedItem[] {
  return [...getMemoryTemplates(locale), ...getDocumentTemplates(locale)];
}

// ─── Default Scaffold Dirs ────────────────────────────────────────────────────

/**
 * Returns the default /documents/ subdirectory definitions for the given locale.
 * Paths are canonical (/documents/inbox); purpose/icon are localized.
 * These are virtual - shown in listings until the user creates real dirs.
 */
export function getDefaultDocumentDirs(
  locale: CountryLanguage,
): DefaultDocumentDir[] {
  const { t } = scopedTranslation.scopedT(locale);

  const keys = [
    "inbox",
    "projects",
    "knowledge",
    "journal",
    "templates",
  ] as const;
  const viewTypes: Record<(typeof keys)[number], string> = {
    inbox: CortexViewType.LIST,
    projects: CortexViewType.LIST,
    knowledge: CortexViewType.WIKI,
    journal: CortexViewType.LIST,
    templates: CortexViewType.LIST,
  };

  return keys.map((key) => {
    const canonicalDirPath = DOCUMENT_DIR_PATHS[key] ?? key;
    const purpose = t(`scaffold.documents.${key}.purpose` as never) as string;
    const icon = t(`scaffold.documents.${key}.icon` as never) as string;
    return {
      path: `/documents/${canonicalDirPath}`,
      purpose,
      icon,
      viewType: viewTypes[key],
    };
  });
}

/**
 * Returns the default /memories/ subdirectory definitions for the given locale.
 * Paths are canonical (/memories/identity); purpose is localized.
 */
export function getDefaultMemoryDirs(
  locale: CountryLanguage,
): DefaultMemoryDir[] {
  const { t } = scopedTranslation.scopedT(locale);

  const keys = ["identity", "expertise", "context", "life"] as const;

  return keys.map((key) => {
    const canonicalDirPath = MEMORY_GROUP_PATHS[key] ?? key;
    const purpose = t(`scaffold.memories.${key}.purpose` as never) as string;
    return {
      dirPath: `/memories/${canonicalDirPath}`,
      purpose,
    };
  });
}

/**
 * Returns the locale-specific roots for memories and documents.
 * Used for display names - the actual DB paths are always canonical English.
 */
export function getLocaleRoots(locale: CountryLanguage): {
  memories: string;
  documents: string;
} {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    memories: `/${t("scaffold.roots.memories")}`,
    documents: `/${t("scaffold.roots.documents")}`,
  };
}

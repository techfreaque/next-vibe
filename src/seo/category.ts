import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "publishing",
  label: {
    "en-US": "Publishing",
    "de-DE": "Veröffentlichungen",
    "pl-PL": "Publikacje",
    "fr-FR": "Publication",
    "it-IT": "Pubblicazione",
    "es-ES": "Publicaciones",
    "sk-SK": "Publikovanie",
    "en-GLOBAL": "Publishing",
  },
  description: {
    "en-US": "Manage forum discussions and search indexing.",
    "de-DE": "Verwalten Sie Forumsbeiträge und die Suchmaschinenindexierung.",
    "pl-PL": "Zarządzaj dyskusjami na forum i indeksowaniem w wyszukiwarkach.",
    "fr-FR": "Gérez les discussions du forum et l’indexation des pages.",
    "it-IT":
      "Gestisca le discussioni del forum e l’indicizzazione delle pagine.",
    "es-ES": "Gestione los debates del foro y la indexación de las páginas.",
    "sk-SK": "Spravujte diskusie vo fóre a indexovanie stránok.",
    "en-GLOBAL": "Manage forum discussions and search indexing.",
  },
  group: "content",
  icon: "book-open",
  order: 1,
  adminPathPrefixes: ["seo", "vibe/agent/chat/public-feed"],
  landing: {
    summary: { alias: "publishing-summary", scope: "platform" },
    destinations: ["forum-threads"],
  },
  subcategories: {
    forum: {
      icon: "message-circle",
      order: 0,
      adminPathPrefixes: ["vibe/agent/chat/public-feed"],
      label: {
        "en-US": "Forum",
        "de-DE": "Forum",
        "pl-PL": "Forum",
        "fr-FR": "Forum",
        "it-IT": "Forum",
        "es-ES": "Foro",
        "sk-SK": "Fórum",
        "en-GLOBAL": "Forum",
      },
    },
    searchVisibility: {
      icon: "search",
      order: 1,
      adminPathPrefixes: ["seo"],
      label: {
        "en-US": "Search indexing",
        "de-DE": "Suchmaschinenindexierung",
        "pl-PL": "Indeksowanie stron",
        "fr-FR": "Indexation",
        "it-IT": "Indicizzazione",
        "es-ES": "Indexación",
        "sk-SK": "Indexovanie stránok",
        "en-GLOBAL": "Search indexing",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "forum-threads",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};

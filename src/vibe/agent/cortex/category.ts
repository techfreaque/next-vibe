/**
 * Category definition for the Cortex module.
 * Covers AI filesystem: read, write, edit, list, search, exec, and more.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { AI_STREAM_ALIAS } from "../ai-stream/stream/constants";
import { CORTEX_LIST_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "cortex",
  label: {
    "en-US": "Cortex",
    "en-GLOBAL": "Cortex",
    "de-DE": "Cortex",
    "pl-PL": "Cortex",
    "fr-FR": "Cortex",
    "it-IT": "Cortex",
    "es-ES": "Cortex",
    "sk-SK": "Cortex",
  },
  description: {
    "en-US": "Browse files and folders in AI memory.",
    "en-GLOBAL": "Browse files and folders in AI memory.",
    "de-DE": "Durchsuchen Sie Dateien und Ordner im KI-Speicher.",
    "pl-PL": "Przeglądaj pliki i foldery w pamięci AI.",
    "fr-FR": "Parcourez les fichiers et dossiers de la mémoire de l’IA.",
    "it-IT": "Sfogli file e cartelle nella memoria dell’IA.",
    "es-ES": "Explore los archivos y carpetas de la memoria de la IA.",
    "sk-SK": "Prezerajte si súbory a priečinky v pamäti AI.",
  },
  group: "ai",
  icon: "brain",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: AI_STREAM_ALIAS,
  },
};

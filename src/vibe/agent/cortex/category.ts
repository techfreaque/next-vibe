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
  landing: {
    destinations: ["cortex-tree", "cortex-search", "cortex-terminals"],
    destinationDescriptions: {
      "cortex-tree": {
        "en-US": "The full folder structure of AI memory at a glance.",
        "en-GLOBAL": "The full folder structure of AI memory at a glance.",
        "de-DE":
          "Die komplette Ordnerstruktur des KI-Speichers auf einen Blick.",
        "pl-PL": "Pełna struktura folderów pamięci AI w jednym widoku.",
        "fr-FR": "Toute l’arborescence de la mémoire de l’IA en un coup d’œil.",
        "it-IT":
          "L’intera struttura delle cartelle della memoria IA a colpo d’occhio.",
        "es-ES":
          "Toda la estructura de carpetas de la memoria de la IA de un vistazo.",
        "sk-SK": "Celá štruktúra priečinkov pamäte AI na jeden pohľad.",
      },
      "cortex-search": {
        "en-US": "Find any file by name or content.",
        "en-GLOBAL": "Find any file by name or content.",
        "de-DE": "Jede Datei nach Name oder Inhalt finden.",
        "pl-PL": "Znajdź dowolny plik po nazwie lub treści.",
        "fr-FR": "Trouvez un fichier par son nom ou son contenu.",
        "it-IT": "Trovi qualsiasi file per nome o contenuto.",
        "es-ES": "Encuentre cualquier archivo por nombre o contenido.",
        "sk-SK": "Nájdite ľubovoľný súbor podľa názvu alebo obsahu.",
      },
      "cortex-terminals": {
        "en-US": "Open terminal sessions and where each one is.",
        "en-GLOBAL": "Open terminal sessions and where each one is.",
        "de-DE": "Offene Terminal-Sitzungen und ihr aktuelles Verzeichnis.",
        "pl-PL": "Otwarte sesje terminala i ich bieżące katalogi.",
        "fr-FR": "Sessions de terminal ouvertes et leur dossier courant.",
        "it-IT": "Sessioni di terminale aperte e la loro cartella corrente.",
        "es-ES": "Sesiones de terminal abiertas y su carpeta actual.",
        "sk-SK": "Otvorené relácie terminálu a ich aktuálne priečinky.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: AI_STREAM_ALIAS,
  },
};

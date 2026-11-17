/**
 * Category definition for the Agent module.
 * Covers AI inference, generation, tools, and web search.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { AI_STREAM_ALIAS } from "./ai-stream/stream/constants";

export const category: CategoryDefinition = {
  key: "ai",
  label: {
    "en-US": "AI Agent",
    "en-GLOBAL": "AI Agent",
    "de-DE": "KI-Agent",
    "pl-PL": "Agent AI",
    "fr-FR": "Agent IA",
  },
  group: "ai",
  icon: "bot",
  order: 10,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: AI_STREAM_ALIAS,
    [UserPermissionRole.CUSTOMER]: AI_STREAM_ALIAS,
    [UserPermissionRole.PUBLIC]: AI_STREAM_ALIAS,
  },
  subcategories: {
    Inference: {
      icon: "cpu",
      order: 0,
      label: {
        "en-US": "Inference",
        "en-GLOBAL": "Inference",
        "de-DE": "Inferenz",
        "pl-PL": "Wnioskowanie",
        "fr-FR": "Inférence",
      },
    },
    Generation: {
      icon: "sparkles",
      order: 1,
      label: {
        "en-US": "Generation",
        "en-GLOBAL": "Generation",
        "de-DE": "Generierung",
        "pl-PL": "Generowanie",
        "fr-FR": "Génération",
      },
    },
    Tools: {
      icon: "wrench",
      order: 2,
      label: {
        "en-US": "Tools",
        "en-GLOBAL": "Tools",
        "de-DE": "Werkzeuge",
        "pl-PL": "Narzędzia",
        "fr-FR": "Outils",
      },
    },
    Search: {
      icon: "search",
      order: 3,
      label: {
        "en-US": "Search",
        "en-GLOBAL": "Search",
        "de-DE": "Suche",
        "pl-PL": "Wyszukiwanie",
        "fr-FR": "Recherche",
      },
    },
    chat: {
      icon: "message-circle",
      order: 4,
      label: {
        "en-US": "Chat",
        "en-GLOBAL": "Chat",
        "de-DE": "Chat",
        "pl-PL": "Chat",
        "fr-FR": "Chat",
      },
    },
    chatFavorites: {
      icon: "star",
      order: 5,
      label: {
        "en-US": "Favorites",
        "en-GLOBAL": "Favorites",
        "de-DE": "Favoriten",
        "pl-PL": "Ulubione",
        "fr-FR": "Favoris",
      },
    },
    chatOrganization: {
      icon: "folder",
      order: 6,
      label: {
        "en-US": "Organization",
        "en-GLOBAL": "Organization",
        "de-DE": "Organisation",
        "pl-PL": "Organizacja",
        "fr-FR": "Organisation",
      },
    },
    chatSettings: {
      icon: "settings",
      order: 7,
      label: {
        "en-US": "Chat Settings",
        "en-GLOBAL": "Chat Settings",
        "de-DE": "Chat-Einstellungen",
        "pl-PL": "Ustawienia czatu",
        "fr-FR": "Paramètres du chat",
      },
    },
    skillsManagement: {
      icon: "book-open",
      order: 8,
      label: {
        "en-US": "Skills",
        "en-GLOBAL": "Skills",
        "de-DE": "Skills",
        "pl-PL": "Umiejętności",
        "fr-FR": "Compétences",
      },
    },
    skillsCommunity: {
      icon: "users",
      order: 9,
      label: {
        "en-US": "Community Skills",
        "en-GLOBAL": "Community Skills",
        "de-DE": "Community-Skills",
        "pl-PL": "Umiejętności społeczności",
        "fr-FR": "Compétences de la communauté",
      },
    },
    skillsModeration: {
      icon: "shield",
      order: 10,
      label: {
        "en-US": "Skills Moderation",
        "en-GLOBAL": "Skills Moderation",
        "de-DE": "Skills-Moderation",
        "pl-PL": "Moderacja umiejętności",
        "fr-FR": "Modération des compétences",
      },
    },
    threadsManagement: {
      icon: "list",
      order: 11,
      label: {
        "en-US": "Threads",
        "en-GLOBAL": "Threads",
        "de-DE": "Threads",
        "pl-PL": "Wątki",
        "fr-FR": "Fils de discussion",
      },
    },
    threadsSharing: {
      icon: "share-2",
      order: 12,
      label: {
        "en-US": "Thread Sharing",
        "en-GLOBAL": "Thread Sharing",
        "de-DE": "Thread-Freigabe",
        "pl-PL": "Udostępnianie wątków",
        "fr-FR": "Partage de fils",
      },
    },
    threadsSearch: {
      icon: "search",
      order: 13,
      label: {
        "en-US": "Thread Search",
        "en-GLOBAL": "Thread Search",
        "de-DE": "Thread-Suche",
        "pl-PL": "Wyszukiwanie wątków",
        "fr-FR": "Recherche de fils",
      },
    },
    messagesModerating: {
      icon: "message-square",
      order: 14,
      label: {
        "en-US": "Messages",
        "en-GLOBAL": "Messages",
        "de-DE": "Nachrichten",
        "pl-PL": "Wiadomości",
        "fr-FR": "Messages",
      },
    },
    messagesSearch: {
      icon: "search",
      order: 15,
      label: {
        "en-US": "Message Search",
        "en-GLOBAL": "Message Search",
        "de-DE": "Nachrichtensuche",
        "pl-PL": "Wyszukiwanie wiadomości",
        "fr-FR": "Recherche de messages",
      },
    },
    messagesFiles: {
      icon: "paperclip",
      order: 16,
      label: {
        "en-US": "Message Files",
        "en-GLOBAL": "Message Files",
        "de-DE": "Nachrichtendateien",
        "pl-PL": "Pliki wiadomości",
        "fr-FR": "Fichiers des messages",
      },
    },
    tasksCron: {
      icon: "clock",
      order: 17,
      label: {
        "en-US": "Scheduled Tasks",
        "en-GLOBAL": "Scheduled Tasks",
        "de-DE": "Geplante Aufgaben",
        "pl-PL": "Zadania cykliczne",
        "fr-FR": "Tâches planifiées",
      },
    },
  },
};

/**
 * Category definition for the Agent module.
 * Covers AI inference, generation, tools, and web search.
 */

import { AI_STREAM_ALIAS } from "next-vibe/agent/ai-stream/stream/constants";
import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

export const category: CategoryDefinition = {
  key: "ai",
  label: {
    "en-US": "AI Agent",
    "en-GLOBAL": "AI Agent",
    "de-DE": "KI-Agent",
    "pl-PL": "Agent AI",
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
      },
    },
  },
};

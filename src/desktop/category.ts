/**
 * Category definition for the Desktop module.
 * Covers window management, interaction, screenshots, and accessibility.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { DESKTOP_LIST_WINDOWS_ALIAS } from "@/desktop/list-windows/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "desktop",
  label: {
    "en-US": "Desktop",
    "en-GLOBAL": "Desktop",
    "de-DE": "Desktop",
    "pl-PL": "Pulpit",
    "fr-FR": "Bureau",
    "it-IT": "Desktop",
    "es-ES": "Escritorio",
    "sk-SK": "Pracovná plocha",
  },
  group: "platform",
  icon: "monitor",
  order: 30,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: DESKTOP_LIST_WINDOWS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Windows: {
      icon: "layout",
      order: 0,
      label: {
        "en-US": "Windows",
        "en-GLOBAL": "Windows",
        "de-DE": "Fenster",
        "pl-PL": "Okna",
        "fr-FR": "Fenêtres",
        "it-IT": "Finestre",
        "es-ES": "Ventanas",
        "sk-SK": "Okná",
      },
      // inherits parent defaultEntry (desktop-list-windows)
    },
    Interaction: {
      icon: "mouse-pointer",
      order: 1,
      label: {
        "en-US": "Interaction",
        "en-GLOBAL": "Interaction",
        "de-DE": "Interaktion",
        "pl-PL": "Interakcja",
        "fr-FR": "Interaction",
        "it-IT": "Interazione",
        "es-ES": "Interacción",
        "sk-SK": "Interakcia",
      },
    },
    Capture: {
      icon: "camera",
      order: 2,
      label: {
        "en-US": "Capture",
        "en-GLOBAL": "Capture",
        "de-DE": "Erfassung",
        "pl-PL": "Przechwytywanie",
        "fr-FR": "Capture",
        "it-IT": "Acquisizione",
        "es-ES": "Captura",
        "sk-SK": "Snímanie",
      },
    },
    Inspection: {
      icon: "eye",
      order: 3,
      label: {
        "en-US": "Inspection",
        "en-GLOBAL": "Inspection",
        "de-DE": "Inspektion",
        "pl-PL": "Inspekcja",
        "fr-FR": "Inspection",
        "it-IT": "Ispezione",
        "es-ES": "Inspección",
        "sk-SK": "Kontrola",
      },
    },
  },
};

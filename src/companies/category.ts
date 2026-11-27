/**
 * Category definition for the Companies module.
 * Covers company profiles, onboarding, and member management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { COMPANIES_LIST_ALIAS } from "@/companies/list/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "companies",
  label: {
    "en-US": "Companies",
    "en-GLOBAL": "Companies",
    "de-DE": "Unternehmen",
    "pl-PL": "Firmy",
    "fr-FR": "Entreprises",
    "it-IT": "Aziende",
    "es-ES": "Empresas",
    "sk-SK": "Firmy",
    "hi-IN": "कंपनियाँ",
  },
  description: {
    "en-US": "Manage legal entities, company settings and team access.",
    "de-DE":
      "Verwalten Sie Rechtsträger, Firmeneinstellungen und Zugriffsrechte.",
    "pl-PL": "Zarządzaj firmami, ich ustawieniami i dostępem zespołu.",
    "fr-FR": "Gérez les sociétés, leurs paramètres et les accès des équipes.",
    "it-IT":
      "Gestisca le aziende, le impostazioni e gli accessi dei collaboratori.",
    "es-ES":
      "Gestione las empresas, su configuración y los accesos del equipo.",
    "sk-SK": "Spravujte firmy, ich nastavenia a prístupy členov tímu.",
    "hi-IN": "कानूनी इकाइयाँ, कंपनी सेटिंग्स और टीम एक्सेस मैनेज करें।",
    "en-GLOBAL": "Manage legal entities, company settings and team access.",
  },
  group: "people",
  icon: "building",
  order: 35,
  createActions: ["companies_create_POST"],
  landing: {
    summary: {
      alias: "platform-summary",
      scope: "platform",
      args: { section: "companies" },
      progressive: true,
    },
    destinations: ["companies-list"],
    actions: ["companies_create_POST"],
    destinationDescriptions: {
      "companies-list": {
        "en-US": "Switch between companies and edit their details.",
        "en-GLOBAL": "Switch between companies and edit their details.",
        "de-DE": "Zwischen Unternehmen wechseln und Stammdaten bearbeiten.",
        "pl-PL": "Przełączaj firmy i edytuj ich dane.",
        "fr-FR": "Passez d’une entreprise à l’autre et modifiez leurs données.",
        "it-IT": "Passi da un’azienda all’altra e ne modifichi i dati.",
        "es-ES": "Cambie de empresa y edite sus datos.",
        "sk-SK": "Prepínajte medzi spoločnosťami a upravujte ich údaje.",
        "hi-IN": "कंपनियों के बीच स्विच करें और उनकी जानकारी बदलें।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: COMPANIES_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: COMPANIES_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Company Management": {
      icon: "building",
      order: 0,
      label: {
        "en-US": "Companies",
        "en-GLOBAL": "Companies",
        "de-DE": "Unternehmen",
        "pl-PL": "Firmy",
        "fr-FR": "Entreprises",
        "it-IT": "Aziende",
        "es-ES": "Empresas",
        "sk-SK": "Firmy",
        "hi-IN": "कंपनियाँ",
      },
      // inherits parent defaultEntry (companies-list)
    },
    "Company Members": {
      icon: "user-plus",
      order: 1,
      label: {
        "en-US": "Members",
        "en-GLOBAL": "Members",
        "de-DE": "Mitglieder",
        "pl-PL": "Członkowie",
        "fr-FR": "Membres",
        "it-IT": "Membri",
        "es-ES": "Miembros",
        "sk-SK": "Členovia",
        "hi-IN": "मेंबर",
      },
    },
  },
};

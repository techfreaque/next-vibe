import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "modelCatalog",
  label: {
    "en-US": "Models",
    "de-DE": "Modelle",
    "pl-PL": "Modele",
    "fr-FR": "Modèles",
    "it-IT": "Modelli",
    "es-ES": "Modelos",
    "sk-SK": "Modely",
    "en-GLOBAL": "Models",
  },
  description: {
    "en-US": "Browse model availability and provider catalog changes.",
    "de-DE": "Prüfen Sie verfügbare Modelle und Änderungen im Anbieterkatalog.",
    "pl-PL": "Sprawdź dostępność modeli i zmiany w katalogach dostawców.",
    "fr-FR":
      "Consultez les modèles disponibles et les changements de catalogue.",
    "it-IT":
      "Consulti i modelli disponibili e le modifiche ai cataloghi dei fornitori.",
    "es-ES":
      "Consulte los modelos disponibles y los cambios en los catálogos de proveedores.",
    "sk-SK":
      "Skontrolujte dostupnosť modelov a zmeny v katalógoch poskytovateľov.",
    "en-GLOBAL": "Browse model availability and provider catalog changes.",
  },
  group: "ai",
  icon: "cpu",
  order: 2,
  adminPathPrefixes: ["vibe/agent/models"],
  landing: {
    actions: ["models", "model-catalog-scan"],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "models",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};

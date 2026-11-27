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
    "hi-IN": "मॉडल",
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
    "hi-IN": "मॉडल की उपलब्धता और प्रोवाइडर कैटलॉग के बदलाव देखें।",
    "en-GLOBAL": "Browse model availability and provider catalog changes.",
  },
  group: "ai",
  icon: "cpu",
  order: 2,
  adminPathPrefixes: ["vibe/agent/models"],
  landing: {
    destinations: ["models", "model-catalog-scan", "refusal-index-leaderboard"],
    destinationDescriptions: {
      models: {
        "en-US": "Browse available models and compare prices.",
        "en-GLOBAL": "Browse available models and compare prices.",
        "de-DE": "Verfügbare Modelle ansehen und Preise vergleichen.",
        "pl-PL": "Przeglądaj dostępne modele i porównuj ceny.",
        "fr-FR": "Consultez les modèles disponibles et comparez les prix.",
        "it-IT": "Esplori i modelli disponibili e confronti i prezzi.",
        "es-ES": "Consulte los modelos disponibles y compare los precios.",
        "sk-SK": "Prezrite si dostupné modely a porovnajte ceny.",
        "hi-IN": "उपलब्ध मॉडल देखें और कीमतों की तुलना करें।",
      },
      "model-catalog-scan": {
        "en-US": "New upstream models, price drift and announced shutdowns.",
        "en-GLOBAL":
          "New upstream models, price drift and announced shutdowns.",
        "de-DE":
          "Neue Modelle der Anbieter, Preisänderungen und angekündigte Abschaltungen.",
        "pl-PL":
          "Nowe modele dostawców, zmiany cen i zapowiedziane wyłączenia.",
        "fr-FR":
          "Nouveaux modèles des fournisseurs, écarts de prix et arrêts annoncés.",
        "it-IT":
          "Nuovi modelli dei fornitori, variazioni di prezzo e dismissioni annunciate.",
        "es-ES":
          "Nuevos modelos de los proveedores, cambios de precio y cierres anunciados.",
        "sk-SK": "Nové modely poskytovateľov, zmeny cien a ohlásené vypnutia.",
        "hi-IN": "नए अपस्ट्रीम मॉडल, कीमतों में बदलाव और घोषित शटडाउन।",
      },
      "refusal-index-leaderboard": {
        "en-US": "How often each model answers, hedges or refuses.",
        "en-GLOBAL": "How often each model answers, hedges or refuses.",
        "de-DE": "Wie oft jedes Modell antwortet, ausweicht oder ablehnt.",
        "pl-PL": "Jak często każdy model odpowiada, wykręca się lub odmawia.",
        "fr-FR": "À quelle fréquence chaque modèle répond, esquive ou refuse.",
        "it-IT": "Quanto spesso ogni modello risponde, divaga o rifiuta.",
        "es-ES": "Con qué frecuencia cada modelo responde, evade o se niega.",
        "sk-SK": "Ako často každý model odpovie, vyhne sa alebo odmietne.",
        "hi-IN": "हर मॉडल कितनी बार जवाब देता है, टालता है या मना करता है।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "models",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};

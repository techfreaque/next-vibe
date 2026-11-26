import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "accountSettings",
  adminPathPrefixes: ["user", "api-keys"],
  group: "platform",
  icon: "user",
  order: 99,
  label: {
    "en-US": "My account",
    "de-DE": "Mein Konto",
    "pl-PL": "Moje konto",
    "fr-FR": "Mon compte",
    "it-IT": "Il mio account",
    "es-ES": "Mi cuenta",
    "sk-SK": "Môj účet",
    "en-GLOBAL": "My account",
  },
  description: {
    "en-US": "Manage your profile, sign-in, billing and API keys.",
    "de-DE":
      "Verwalten Sie Ihr Profil, Ihre Anmeldung, Ihre Abrechnung und Ihre API-Schlüssel.",
    "pl-PL": "Zarządzaj profilem, logowaniem, rozliczeniami i kluczami API.",
    "fr-FR":
      "Gérez votre profil, vos accès, votre facturation et vos clés API.",
    "it-IT": "Gestisca il profilo, l’accesso, la fatturazione e le chiavi API.",
    "es-ES": "Gestione su perfil, el acceso, la facturación y sus claves API.",
    "sk-SK": "Spravujte svoj profil, prihlasovanie, fakturáciu a kľúče API.",
    "en-GLOBAL": "Manage your profile, sign-in, billing and API keys.",
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: USER_ME_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    billing: {
      icon: "credit-card",
      order: 1,
      adminPaths: [
        "payment",
        "payment/checkout",
        "payment/portal",
        "subscription",
        "subscription/create",
        "subscription/update",
        "subscription/cancel",
      ],
      label: {
        "en-US": "Billing",
        "de-DE": "Abrechnung",
        "pl-PL": "Rozliczenia",
        "fr-FR": "Facturation",
        "it-IT": "Fatturazione",
        "es-ES": "Facturación",
        "sk-SK": "Fakturácia",
        "en-GLOBAL": "Billing",
      },
    },
  },
};

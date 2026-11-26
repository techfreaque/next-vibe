import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "outreachCRM",
  label: {
    "en-US": "Outreach and deals",
    "de-DE": "Ansprache und Kooperationen",
    "pl-PL": "Kontakty i współprace",
    "fr-FR": "Prospection et partenariats",
    "it-IT": "Contatti e collaborazioni",
    "es-ES": "Prospección y colaboraciones",
    "sk-SK": "Oslovovanie a spolupráce",
    "en-GLOBAL": "Outreach and deals",
  },
  description: {
    "en-US": "Track creator deals, campaign links and marketing costs.",
    "de-DE": "Verfolgen Sie Kooperationen, Kampagnenlinks und Marketingkosten.",
    "pl-PL":
      "Śledź współprace z twórcami, linki kampanii i koszty marketingowe.",
    "fr-FR":
      "Suivez les partenariats, les liens de campagne et les dépenses marketing.",
    "it-IT":
      "Segua gli accordi con i creator, i link delle campagne e i costi di marketing.",
    "es-ES":
      "Siga los acuerdos con creadores, los enlaces de campañas y los costes de marketing.",
    "sk-SK":
      "Sledujte spolupráce s tvorcami, odkazy kampaní a marketingové náklady.",
    "en-GLOBAL": "Track creator deals, campaign links and marketing costs.",
  },
  group: "analytics",
  icon: "target",
  order: 2,
  adminPathPrefixes: ["leads/outreach", "leads/growth"],
  landing: {
    actions: [
      "outreach-crm",
      "growth-campaign-links",
      "growth-channel-spend-list",
    ],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "outreach-crm",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};

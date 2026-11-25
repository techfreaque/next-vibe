/**
 * Category definition for the Referral module.
 * Covers referral program codes, earnings, and payout administration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { REFERRAL_OVERVIEW_ALIAS } from "@/referral/admin/overview/constants";
import { REFERRAL_STATS_ALIAS } from "@/referral/stats/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "referral",
  label: {
    "en-US": "Referral",
    "en-GLOBAL": "Referral",
    "de-DE": "Empfehlungen",
    "pl-PL": "Polecenia",
    "fr-FR": "Parrainage",
    "it-IT": "Inviti",
    "es-ES": "Referidos",
    "sk-SK": "Odporúčania",
  },
  group: "business",
  icon: "share-2",
  order: 60,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: REFERRAL_OVERVIEW_ALIAS,
    [UserPermissionRole.CUSTOMER]: REFERRAL_STATS_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Program: {
      icon: "share-2",
      order: 0,
      label: {
        "en-US": "Program",
        "en-GLOBAL": "Program",
        "de-DE": "Programm",
        "pl-PL": "Program",
        "fr-FR": "Programme",
        "it-IT": "Programma",
        "es-ES": "Programa",
        "sk-SK": "Program",
      },
      // inherits parent defaultEntry (admins: referral-overview, customers: referral-stats)
    },
    Payouts: {
      icon: "banknote",
      order: 1,
      label: {
        "en-US": "Payouts",
        "en-GLOBAL": "Payouts",
        "de-DE": "Auszahlungen",
        "pl-PL": "Wypłaty",
        "fr-FR": "Versements",
        "it-IT": "Liquidazioni",
        "es-ES": "Desembolsos",
        "sk-SK": "Výplaty",
      },
    },
  },
};

/**
 * Category definition for the Referral module.
 * Covers referral program codes, earnings, and payout administration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { REFERRAL_STATS_ALIAS } from "@/referral/stats/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "referral",
  label: {
    "en-US": "Referral",
    "en-GLOBAL": "Referral",
    "de-DE": "Empfehlungen",
    "pl-PL": "Polecenia",
  },
  group: "business",
  icon: "share-2",
  order: 60,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: REFERRAL_STATS_ALIAS,
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
      },
      // inherits parent defaultEntry (referral-stats)
    },
    Payouts: {
      icon: "banknote",
      order: 1,
      label: {
        "en-US": "Payouts",
        "en-GLOBAL": "Payouts",
        "de-DE": "Auszahlungen",
        "pl-PL": "Wypłaty",
      },
    },
  },
};

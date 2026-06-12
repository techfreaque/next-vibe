/**
 * Category definition for the Referral module.
 * Covers referral program codes, earnings, and payout administration.
 */

import { REFERRAL_STATS_ALIAS } from "@/app/api/[locale]/referral/stats/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";

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
  defaultEntry: REFERRAL_STATS_ALIAS,
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

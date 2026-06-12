/**
 * Category definition for the Payment module.
 * Covers invoices, estimates, billing, subscriptions, and payment providers.
 */

import { PAYMENT_DASHBOARD_ALIAS } from "@/app/api/[locale]/payment/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";

export const category: CategoryDefinition = {
  key: "payments",
  label: {
    "en-US": "Payments",
    "en-GLOBAL": "Payments",
    "de-DE": "Zahlungen",
    "pl-PL": "Płatności",
  },
  group: "business",
  icon: "credit-card",
  order: 10,
  defaultEntry: PAYMENT_DASHBOARD_ALIAS,
  subcategories: {
    Transactions: {
      icon: "receipt",
      order: 0,
      label: {
        "en-US": "Transactions",
        "en-GLOBAL": "Transactions",
        "de-DE": "Transaktionen",
        "pl-PL": "Transakcje",
      },
    },
    Providers: {
      icon: "plug",
      order: 2,
      label: {
        "en-US": "Providers",
        "en-GLOBAL": "Providers",
        "de-DE": "Anbieter",
        "pl-PL": "Dostawcy",
      },
    },
  },
};

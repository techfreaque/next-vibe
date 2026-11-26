/**
 * Category definition for the Payment module.
 * Covers invoices, estimates, billing, subscriptions, and payment providers.
 */

import type {
  CategoryDefinition,
  RecordSearchDestination,
} from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { PlatformSummaryInput } from "@/analytics/business/summary/definition";
import { REVENUE_REPORT_ALIAS } from "@/payment/analytics/revenue/constants";
import type invoiceList from "@/payment/invoice/list/definition";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "payments",
  label: {
    "en-US": "Payments",
    "en-GLOBAL": "Payments",
    "de-DE": "Zahlungen",
    "pl-PL": "Płatności",
    "fr-FR": "Paiements",
    "it-IT": "Pagamenti",
    "es-ES": "Pagos",
    "sk-SK": "Platby",
  },
  description: {
    "en-US": "Track payments, refunds and processor settlement.",
    "de-DE":
      "Prüfen Sie Zahlungen, Erstattungen und Abrechnungen der Zahlungsanbieter.",
    "pl-PL": "Śledź płatności, zwroty i rozliczenia operatorów płatności.",
    "fr-FR":
      "Suivez les paiements, les remboursements et les règlements des prestataires.",
    "it-IT":
      "Controlli i pagamenti, i rimborsi e gli accrediti dei gestori di pagamento.",
    "es-ES":
      "Revise los pagos, los reembolsos y las liquidaciones de los procesadores.",
    "sk-SK": "Sledujte platby, refundácie a zúčtovanie platieb.",
    "en-GLOBAL": "Track payments, refunds and processor settlement.",
  },
  group: "billing",
  icon: "credit-card",
  order: 10,
  landing: {
    summary: {
      alias: "platform-summary",
      scope: "platform",
      progressive: true,
      args: { section: "payments" } satisfies Pick<
        PlatformSummaryInput,
        "section"
      >,
    },
    destinations: [
      "revenue-report",
      "products-catalog-list",
      "processor-accounting",
    ],
    actions: ["payment_invoice_create_POST"],
    overview: { alias: "revenue-report", scope: "platform" },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: REVENUE_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  recordSearch: {
    alias: "payment-invoice-list",
    field: "search",
  } satisfies RecordSearchDestination<typeof invoiceList.GET>,
  subcategories: {
    Transactions: {
      icon: "receipt",
      order: 0,
      label: {
        "en-US": "Transactions",
        "en-GLOBAL": "Transactions",
        "de-DE": "Transaktionen",
        "pl-PL": "Transakcje",
        "fr-FR": "Transactions",
        "it-IT": "Transazioni",
        "es-ES": "Transacciones",
        "sk-SK": "Transakcie",
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
        "fr-FR": "Fournisseurs",
        "it-IT": "Fornitori",
        "es-ES": "Proveedores",
        "sk-SK": "Poskytovatelia platieb",
      },
    },
  },
};

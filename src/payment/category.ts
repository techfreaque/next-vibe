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
    actions: ["payment_invoice_create_POST"],
    overview: { alias: "revenue-report", scope: "platform" },
    destinations: [
      "revenue-report",
      "payment-processor",
      "processor-accounting",
      "products-catalog-list",
    ],
    destinationDescriptions: {
      "revenue-report": {
        "en-US": "Revenue by processor, plan and currency, with MRR and churn.",
        "en-GLOBAL":
          "Revenue by processor, plan and currency, with MRR and churn.",
        "de-DE":
          "Umsatz nach Zahlungsanbieter, Tarif und Währung, mit MRR und Churn.",
        "pl-PL": "Przychód według operatora, planu i waluty, z MRR i odpływem.",
        "fr-FR":
          "Revenus par prestataire, offre et devise, avec MRR et attrition.",
        "it-IT": "Ricavi per processore, piano e valuta, con MRR e abbandoni.",
        "es-ES": "Ingresos por procesador, plan y divisa, con MRR y bajas.",
        "sk-SK":
          "Tržby podľa spracovateľa, plánu a meny vrátane MRR a odchodov.",
      },
      "payment-processor": {
        "en-US": "Checkouts, renewals, failed payments and webhook runs.",
        "en-GLOBAL": "Checkouts, renewals, failed payments and webhook runs.",
        "de-DE":
          "Checkouts, Verlängerungen, fehlgeschlagene Zahlungen und Webhooks.",
        "pl-PL": "Zakupy, odnowienia, nieudane płatności i webhooki.",
        "fr-FR": "Paiements, renouvellements, échecs et webhooks reçus.",
        "it-IT": "Checkout, rinnovi, pagamenti falliti e webhook ricevuti.",
        "es-ES": "Pagos, renovaciones, cobros fallidos y webhooks recibidos.",
        "sk-SK": "Platby, obnovenia, neúspešné platby a prijaté webhooky.",
      },
      "processor-accounting": {
        "en-US": "Match processor payouts and fees to your books.",
        "en-GLOBAL": "Match processor payouts and fees to your books.",
        "de-DE":
          "Auszahlungen und Gebühren der Zahlungsanbieter mit der Buchhaltung abgleichen.",
        "pl-PL": "Uzgadniaj wypłaty i opłaty operatorów z księgami.",
        "fr-FR":
          "Rapprochez versements et frais des prestataires avec votre comptabilité.",
        "it-IT":
          "Riconcili versamenti e commissioni dei processori con la contabilità.",
        "es-ES":
          "Concilie liquidaciones y comisiones de los procesadores con la contabilidad.",
        "sk-SK": "Spárujte výplaty a poplatky spracovateľov s účtovníctvom.",
      },
      "products-catalog-list": {
        "en-US": "Plans, credit packs and goods you sell.",
        "en-GLOBAL": "Plans, credit packs and goods you sell.",
        "de-DE": "Tarife, Credit-Pakete und Waren, die Sie verkaufen.",
        "pl-PL": "Plany, pakiety kredytów i towary, które sprzedajesz.",
        "fr-FR": "Offres, packs de crédits et produits que vous vendez.",
        "it-IT": "Piani, pacchetti di crediti e prodotti che vende.",
        "es-ES": "Planes, paquetes de créditos y productos que vende.",
        "sk-SK": "Plány, balíky kreditov a tovar, ktorý predávate.",
      },
    },
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

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "businessDocuments",
  label: {
    "en-US": "Sales and bills",
    "de-DE": "Verkauf und Eingangsrechnungen",
    "pl-PL": "Sprzedaż i zakupy",
    "fr-FR": "Ventes et factures fournisseurs",
    "it-IT": "Vendite e fatture fornitori",
    "es-ES": "Ventas y facturas de proveedores",
    "sk-SK": "Predaj a prijaté faktúry",
    "en-GLOBAL": "Sales and bills",
  },
  description: {
    "en-US":
      "Issue customer invoices, enter supplier bills and track estimates.",
    "de-DE":
      "Erstellen Sie Ausgangsrechnungen und Angebote und erfassen Sie Eingangsrechnungen.",
    "pl-PL": "Wystawiaj faktury, rejestruj faktury zakupu i śledź oferty.",
    "fr-FR":
      "Émettez des factures, enregistrez les factures fournisseurs et suivez les devis.",
    "it-IT":
      "Emetta fatture, registri quelle dei fornitori e segua i preventivi.",
    "es-ES":
      "Emita facturas, registre las de proveedores y siga los presupuestos.",
    "sk-SK":
      "Vystavujte faktúry, evidujte prijaté faktúry a sledujte cenové ponuky.",
    "en-GLOBAL":
      "Issue customer invoices, enter supplier bills and track estimates.",
  },
  group: "business",
  icon: "file-text",
  order: 2,
  adminPathPrefixes: ["payment/dashboard"],
  createActions: [
    "payment_invoice_create_POST",
    "payment_bill_create_POST",
    "payment_estimate_create_POST",
  ],
  landing: {
    destinations: [
      "payment-invoice-list",
      "payment-bill-list",
      "payment-estimate-list",
    ],
    actions: [
      "payment-invoice-list",
      "payment_invoice_create_POST",
      "payment-bill-list",
      "payment-estimate-list",
    ],
    overview: {
      alias: "payment-dashboard",
      scope: "company",
    },
  },
  subcategories: {
    salesInvoices: {
      icon: "file-text",
      order: 0,
      adminPathPrefixes: ["payment/invoice"],
      label: {
        "en-US": "Sales invoices",
        "de-DE": "Ausgangsrechnungen",
        "pl-PL": "Faktury sprzedaży",
        "fr-FR": "Factures clients",
        "it-IT": "Fatture di vendita",
        "es-ES": "Facturas de venta",
        "sk-SK": "Vystavené faktúry",
        "en-GLOBAL": "Sales invoices",
      },
    },
    supplierBills: {
      icon: "file-text",
      order: 1,
      adminPathPrefixes: ["payment/bill"],
      label: {
        "en-US": "Supplier bills",
        "de-DE": "Eingangsrechnungen",
        "pl-PL": "Faktury zakupu",
        "fr-FR": "Factures fournisseurs",
        "it-IT": "Fatture fornitori",
        "es-ES": "Facturas de proveedores",
        "sk-SK": "Prijaté faktúry",
        "en-GLOBAL": "Supplier bills",
      },
    },
    quotes: {
      icon: "file-text",
      order: 2,
      adminPathPrefixes: ["payment/estimate"],
      label: {
        "en-US": "Quotes",
        "de-DE": "Angebote",
        "pl-PL": "Oferty",
        "fr-FR": "Devis",
        "it-IT": "Preventivi",
        "es-ES": "Presupuestos",
        "sk-SK": "Cenové ponuky",
        "en-GLOBAL": "Quotes",
      },
    },
    creditNotes: {
      icon: "file-text",
      order: 3,
      adminPathPrefixes: ["payment/credit-note"],
      label: {
        "en-US": "Credit notes",
        "de-DE": "Gutschriften",
        "pl-PL": "Faktury korygujące",
        "fr-FR": "Avoirs",
        "it-IT": "Note di credito",
        "es-ES": "Abonos",
        "sk-SK": "Dobropisy",
        "en-GLOBAL": "Credit notes",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "payment-invoice-list",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};

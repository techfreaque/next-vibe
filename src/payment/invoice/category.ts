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
    "hi-IN": "बिक्री और बिल",
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
    "hi-IN": "कस्टमर इनवॉइस जारी करें, सप्लायर बिल दर्ज करें और एस्टिमेट ट्रैक करें।",
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
    overview: {
      alias: "payment-dashboard",
      scope: "company",
    },
    destinations: [
      "payment-invoice-list",
      "payment-bill-list",
      "payment-estimate-list",
      "mail-bill-reviews",
    ],
    actions: [
      "payment_invoice_create_POST",
      "payment_bill_create_POST",
      "payment_estimate_create_POST",
    ],
    destinationDescriptions: {
      "payment-invoice-list": {
        "en-US": "Customer invoices by number, customer and status.",
        "en-GLOBAL": "Customer invoices by number, customer and status.",
        "de-DE": "Kundenrechnungen nach Nummer, Kunde und Status.",
        "pl-PL": "Faktury klientów według numeru, klienta i statusu.",
        "fr-FR": "Factures clients par numéro, client et statut.",
        "it-IT": "Fatture clienti per numero, cliente e stato.",
        "es-ES": "Facturas de clientes por número, cliente y estado.",
        "sk-SK": "Faktúry zákazníkov podľa čísla, zákazníka a stavu.",
        "hi-IN": "नंबर, कस्टमर और स्टेटस के हिसाब से कस्टमर इनवॉइस।",
      },
      "payment-bill-list": {
        "en-US": "Supplier bills to approve, pay and book.",
        "en-GLOBAL": "Supplier bills to approve, pay and book.",
        "de-DE": "Lieferantenrechnungen zum Freigeben, Bezahlen und Buchen.",
        "pl-PL": "Rachunki dostawców do akceptacji, zapłaty i zaksięgowania.",
        "fr-FR": "Factures fournisseurs à valider, payer et comptabiliser.",
        "it-IT": "Fatture fornitori da approvare, pagare e registrare.",
        "es-ES": "Facturas de proveedores para aprobar, pagar y contabilizar.",
        "sk-SK": "Faktúry dodávateľov na schválenie, úhradu a zaúčtovanie.",
        "hi-IN": "मंज़ूरी, पेमेंट और बुकिंग के लिए सप्लायर बिल।",
      },
      "payment-estimate-list": {
        "en-US": "Quotes sent to customers and whether they accepted.",
        "en-GLOBAL": "Quotes sent to customers and whether they accepted.",
        "de-DE": "Angebote an Kunden und ob sie angenommen wurden.",
        "pl-PL": "Oferty wysłane klientom i informacja, czy je przyjęli.",
        "fr-FR": "Devis envoyés aux clients et leur réponse.",
        "it-IT": "Preventivi inviati ai clienti ed eventuale accettazione.",
        "es-ES": "Presupuestos enviados a clientes y si los aceptaron.",
        "sk-SK": "Cenové ponuky odoslané zákazníkom a či ich prijali.",
        "hi-IN": "कस्टमर को भेजे कोटेशन और क्या उन्होंने मंज़ूर किए।",
      },
      "mail-bill-reviews": {
        "en-US": "Invoices and receipts that arrived by email, ready to book.",
        "en-GLOBAL":
          "Invoices and receipts that arrived by email, ready to book.",
        "de-DE":
          "Per E-Mail eingegangene Rechnungen und Belege, bereit zum Buchen.",
        "pl-PL": "Faktury i paragony z e-maila gotowe do zaksięgowania.",
        "fr-FR": "Factures et reçus arrivés par e-mail, prêts à comptabiliser.",
        "it-IT": "Fatture e ricevute arrivate via email, pronte da registrare.",
        "es-ES":
          "Facturas y recibos llegados por correo, listos para contabilizar.",
        "sk-SK": "Faktúry a doklady z e-mailu pripravené na zaúčtovanie.",
        "hi-IN": "ईमेल से आए इनवॉइस और रसीदें, बुक करने के लिए तैयार।",
      },
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
        "hi-IN": "सेल्स इनवॉइस",
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
        "hi-IN": "सप्लायर बिल",
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
        "hi-IN": "कोटेशन",
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
        "hi-IN": "क्रेडिट नोट",
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

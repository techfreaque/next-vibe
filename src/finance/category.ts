/**
 * Category definition for the Finance module.
 * Revenue vs upstream cost monitoring: margin, provider balances, alerts.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { FINANCE_STATUS_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "finance",
  label: {
    "en-US": "Finance",
    "en-GLOBAL": "Finance",
    "de-DE": "Finanzen",
    "pl-PL": "Finanse",
    "fr-FR": "Finance",
    "it-IT": "Finanze",
    "es-ES": "Finanzas",
    "sk-SK": "Financie",
    "hi-IN": "फ़ाइनेंस",
  },
  description: {
    "en-US": "Review monthly profit, provider costs and bank transactions.",
    "de-DE": "Prüfen Sie Monatsergebnis, Anbieterkosten und Bankumsätze.",
    "pl-PL": "Sprawdź miesięczny wynik, koszty dostawców i transakcje bankowe.",
    "fr-FR":
      "Consultez le résultat mensuel, les coûts des prestataires et les opérations bancaires.",
    "it-IT":
      "Consulti il risultato mensile, i costi dei fornitori e i movimenti bancari.",
    "es-ES":
      "Revise el resultado mensual, los costes de los proveedores y los movimientos bancarios.",
    "sk-SK":
      "Skontrolujte mesačný výsledok, náklady na poskytovateľov a bankové pohyby.",
    "hi-IN": "मासिक मुनाफ़ा, प्रोवाइडर खर्च और बैंक ट्रांज़ैक्शन देखें।",
    "en-GLOBAL": "Review monthly profit, provider costs and bank transactions.",
  },
  group: "system",
  icon: "wallet",
  order: 66,
  landing: {
    overview: { alias: "finance-monthly-profit", scope: "company" },
    destinations: [
      "finance-monthly-profit",
      "finance-status",
      "bank-statement-lines",
      "bank-connections",
      "mail-bill-reviews",
      "supplier-evidence",
    ],
    destinationDescriptions: {
      "finance-monthly-profit": {
        "en-US": "Posted revenue, expenses and net result by month.",
        "en-GLOBAL": "Posted revenue, expenses and net result by month.",
        "de-DE": "Gebuchter Umsatz, Aufwand und Ergebnis pro Monat.",
        "pl-PL": "Zaksięgowane przychody, koszty i wynik w każdym miesiącu.",
        "fr-FR":
          "Revenus, charges et résultat net comptabilisés, mois par mois.",
        "it-IT": "Ricavi, costi e risultato netto registrati, mese per mese.",
        "es-ES": "Ingresos, gastos y resultado neto contabilizados, mes a mes.",
        "sk-SK": "Zaúčtované tržby, náklady a čistý výsledok po mesiacoch.",
        "hi-IN": "हर महीने का बुक किया रेवेन्यू, खर्च और शुद्ध नतीजा।",
      },
      "finance-status": {
        "en-US": "Provider balances, margin and cost alerts.",
        "en-GLOBAL": "Provider balances, margin and cost alerts.",
        "de-DE": "Anbieter-Guthaben, Marge und Kostenwarnungen.",
        "pl-PL": "Salda u dostawców, marża i alerty kosztów.",
        "fr-FR": "Soldes fournisseurs, marge et alertes de coûts.",
        "it-IT": "Saldi dei fornitori, margine e avvisi sui costi.",
        "es-ES": "Saldos de proveedores, margen y alertas de costes.",
        "sk-SK": "Zostatky u poskytovateľov, marža a upozornenia na náklady.",
        "hi-IN": "प्रोवाइडर बैलेंस, मार्जिन और खर्च अलर्ट।",
      },
      "bank-statement-lines": {
        "en-US": "Imported bank lines waiting for a journal entry.",
        "en-GLOBAL": "Imported bank lines waiting for a journal entry.",
        "de-DE": "Importierte Bankzeilen, die noch auf eine Buchung warten.",
        "pl-PL": "Zaimportowane wiersze bankowe czekające na księgowanie.",
        "fr-FR": "Lignes bancaires importées en attente d’une écriture.",
        "it-IT": "Righe bancarie importate in attesa di una registrazione.",
        "es-ES": "Líneas bancarias importadas a la espera de un asiento.",
        "sk-SK": "Importované bankové riadky čakajúce na zaúčtovanie.",
        "hi-IN": "इंपोर्ट की गई बैंक एंट्री जो जर्नल एंट्री का इंतज़ार कर रही हैं।",
      },
      "bank-connections": {
        "en-US": "Import transactions from a connected bank account.",
        "en-GLOBAL": "Import transactions from a connected bank account.",
        "de-DE": "Umsätze aus einem verbundenen Bankkonto importieren.",
        "pl-PL": "Importuj transakcje z połączonego konta bankowego.",
        "fr-FR": "Importez les opérations d’un compte bancaire connecté.",
        "it-IT": "Importi i movimenti da un conto bancario collegato.",
        "es-ES": "Importe movimientos de una cuenta bancaria conectada.",
        "sk-SK": "Importujte transakcie z pripojeného bankového účtu.",
        "hi-IN": "कनेक्टेड बैंक अकाउंट से ट्रांज़ैक्शन इंपोर्ट करें।",
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
      "supplier-evidence": {
        "en-US": "Provider balances and supplier documents in one place.",
        "en-GLOBAL": "Provider balances and supplier documents in one place.",
        "de-DE": "Anbieter-Guthaben und Lieferantenbelege an einem Ort.",
        "pl-PL": "Salda u dostawców i ich dokumenty w jednym miejscu.",
        "fr-FR": "Soldes et justificatifs fournisseurs au même endroit.",
        "it-IT": "Saldi e documenti dei fornitori in un unico posto.",
        "es-ES": "Saldos y documentos de proveedores en un solo lugar.",
        "sk-SK": "Zostatky a doklady dodávateľov na jednom mieste.",
        "hi-IN": "प्रोवाइडर बैलेंस और सप्लायर दस्तावेज़ एक ही जगह।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: FINANCE_STATUS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Credit liabilities": {
      icon: "wallet",
      order: 3,
      label: {
        "en-US": "Credit liabilities",
        "en-GLOBAL": "Credit liabilities",
        "de-DE": "Guthabenverbindlichkeiten",
        "pl-PL": "Zobowiązania za kredyty",
        "fr-FR": "Engagements sur crédits",
        "it-IT": "Passività per crediti",
        "es-ES": "Pasivos por créditos",
        "sk-SK": "Záväzky za kredity",
        "hi-IN": "क्रेडिट देनदारी",
      },
    },
    "Finance: Suppliers": {
      icon: "briefcase",
      order: 2,
      label: {
        "en-US": "Suppliers",
        "en-GLOBAL": "Suppliers",
        "de-DE": "Lieferanten",
        "pl-PL": "Dostawcy",
        "fr-FR": "Fournisseurs",
        "it-IT": "Fornitori",
        "es-ES": "Proveedores",
        "sk-SK": "Dodávatelia",
        "hi-IN": "सप्लायर",
      },
    },
    "Bank reconciliation": {
      icon: "wallet",
      order: 1,
      label: {
        "en-US": "Bank reconciliation",
        "en-GLOBAL": "Bank reconciliation",
        "de-DE": "Bankabgleich",
        "pl-PL": "Uzgadnianie banku",
        "fr-FR": "Rapprochement bancaire",
        "it-IT": "Riconciliazione bancaria",
        "es-ES": "Conciliación bancaria",
        "sk-SK": "Párovanie bankových pohybov",
        "hi-IN": "बैंक मिलान",
      },
    },
    Monitoring: {
      icon: "activity",
      order: 0,
      label: {
        "en-US": "Monitoring",
        "en-GLOBAL": "Monitoring",
        "de-DE": "Überwachung",
        "pl-PL": "Monitoring",
        "fr-FR": "Monitoring",
        "it-IT": "Monitoraggio",
        "es-ES": "Monitoreo",
        "sk-SK": "Monitorovanie",
        "hi-IN": "मॉनिटरिंग",
      },
    },
  },
};

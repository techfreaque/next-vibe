/**
 * Category definition for the Accounting module.
 * Covers chart of accounts, journal entries, ledger reports, and accounting periods.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { ACCOUNTING_DASHBOARD_ALIAS } from "@/chart-of-accounts/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "accounting",
  label: {
    "en-US": "Accounting",
    "en-GLOBAL": "Accounting",
    "de-DE": "Buchhaltung",
    "pl-PL": "Księgowość",
    "fr-FR": "Comptabilité",
    "it-IT": "Contabilità",
    "es-ES": "Contabilidad",
    "sk-SK": "Účtovníctvo",
  },
  description: {
    "en-US": "Review journals, outstanding balances and open periods.",
    "de-DE": "Prüfen Sie Buchungen, offene Posten und Perioden.",
    "pl-PL": "Sprawdź zapisy księgowe, rozrachunki i otwarte okresy.",
    "fr-FR": "Consultez les écritures, les soldes et les périodes ouvertes.",
    "it-IT":
      "Consulti le registrazioni, le partite aperte e i periodi contabili.",
    "es-ES":
      "Revise los asientos, los saldos pendientes y los períodos abiertos.",
    "sk-SK":
      "Skontrolujte účtovné zápisy, neuhradené položky a otvorené obdobia.",
    "en-GLOBAL": "Review journals, outstanding balances and open periods.",
  },
  group: "business",
  icon: "receipt",
  order: 30,
  createActions: ["coa-journal-create", "coa-period-create"],
  landing: {
    actions: ["coa-setup", "coa-period-create", "coa-journal-create"],
    contextualActions: true,
    overview: { alias: "accounting-dashboard", scope: "company" },
    destinations: [
      "coa-journal-list",
      "coa-profit-loss",
      "coa-balance-sheet",
      "coa-receivables-aging",
      "coa-payables-aging",
      "coa-period-list",
    ],
    destinationDescriptions: {
      "coa-journal-list": {
        "en-US": "Every posted entry, filtered by account and date.",
        "en-GLOBAL": "Every posted entry, filtered by account and date.",
        "de-DE": "Alle gebuchten Einträge, filterbar nach Konto und Datum.",
        "pl-PL": "Wszystkie zaksięgowane wpisy z filtrem po koncie i dacie.",
        "fr-FR":
          "Toutes les écritures passées, filtrables par compte et par date.",
        "it-IT": "Tutte le registrazioni, filtrabili per conto e data.",
        "es-ES":
          "Todos los asientos contabilizados, filtrables por cuenta y fecha.",
        "sk-SK": "Všetky zaúčtované zápisy s filtrom podľa účtu a dátumu.",
      },
      "coa-profit-loss": {
        "en-US": "Income, expenses and profit for the period.",
        "en-GLOBAL": "Income, expenses and profit for the period.",
        "de-DE": "Erträge, Aufwände und Gewinn im Zeitraum.",
        "pl-PL": "Przychody, koszty i zysk w okresie.",
        "fr-FR": "Produits, charges et résultat de la période.",
        "it-IT": "Ricavi, costi e utile del periodo.",
        "es-ES": "Ingresos, gastos y beneficio del periodo.",
        "sk-SK": "Výnosy, náklady a zisk za obdobie.",
      },
      "coa-balance-sheet": {
        "en-US": "Assets, liabilities and equity on any date.",
        "en-GLOBAL": "Assets, liabilities and equity on any date.",
        "de-DE": "Vermögen, Schulden und Eigenkapital zu jedem Stichtag.",
        "pl-PL": "Aktywa, zobowiązania i kapitał na wybrany dzień.",
        "fr-FR": "Actif, passif et capitaux propres à la date choisie.",
        "it-IT": "Attività, passività e patrimonio netto a qualsiasi data.",
        "es-ES": "Activos, pasivos y patrimonio en cualquier fecha.",
        "sk-SK": "Aktíva, záväzky a vlastné imanie k ľubovoľnému dňu.",
      },
      "coa-receivables-aging": {
        "en-US": "Customer invoices still unpaid, grouped by age.",
        "en-GLOBAL": "Customer invoices still unpaid, grouped by age.",
        "de-DE": "Offene Kundenrechnungen, nach Alter gruppiert.",
        "pl-PL": "Niezapłacone faktury klientów pogrupowane według wieku.",
        "fr-FR": "Factures clients impayées, classées par ancienneté.",
        "it-IT": "Fatture clienti non pagate, raggruppate per anzianità.",
        "es-ES": "Facturas de clientes pendientes, agrupadas por antigüedad.",
        "sk-SK": "Neuhradené faktúry zákazníkov zoskupené podľa veku.",
      },
      "coa-payables-aging": {
        "en-US": "Supplier bills you still owe, grouped by due date.",
        "en-GLOBAL": "Supplier bills you still owe, grouped by due date.",
        "de-DE": "Offene Lieferantenrechnungen, nach Fälligkeit gruppiert.",
        "pl-PL": "Niezapłacone rachunki dostawców pogrupowane według terminu.",
        "fr-FR": "Factures fournisseurs à payer, classées par échéance.",
        "it-IT": "Fatture fornitori da pagare, raggruppate per scadenza.",
        "es-ES":
          "Facturas de proveedores pendientes, agrupadas por vencimiento.",
        "sk-SK": "Neuhradené faktúry dodávateľov zoskupené podľa splatnosti.",
      },
      "coa-period-list": {
        "en-US": "Open and close accounting periods.",
        "en-GLOBAL": "Open and close accounting periods.",
        "de-DE": "Buchungsperioden öffnen und abschließen.",
        "pl-PL": "Otwieraj i zamykaj okresy księgowe.",
        "fr-FR": "Ouvrez et clôturez les périodes comptables.",
        "it-IT": "Apra e chiuda i periodi contabili.",
        "es-ES": "Abra y cierre periodos contables.",
        "sk-SK": "Otvárajte a uzatvárajte účtovné obdobia.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: ACCOUNTING_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Accounts: {
      icon: "book-open",
      order: 0,
      label: {
        "en-US": "Accounts",
        "en-GLOBAL": "Accounts",
        "de-DE": "Konten",
        "pl-PL": "Konta",
        "fr-FR": "Comptes",
        "it-IT": "Account",
        "es-ES": "Cuentas",
        "sk-SK": "Účty",
      },
    },
    Journal: {
      icon: "edit",
      order: 1,
      label: {
        "en-US": "Journal",
        "en-GLOBAL": "Journal",
        "de-DE": "Journal",
        "pl-PL": "Dziennik",
        "fr-FR": "Journal",
        "it-IT": "Libro giornale",
        "es-ES": "Libro diario",
        "sk-SK": "Účtovný denník",
      },
    },
    Ledger: {
      icon: "bar-chart-2",
      order: 2,
      label: {
        "en-US": "Ledger",
        "en-GLOBAL": "Ledger",
        "de-DE": "Hauptbuch",
        "pl-PL": "Księga główna",
        "fr-FR": "Grand livre",
        "it-IT": "Libro mastro",
        "es-ES": "Libro mayor",
        "sk-SK": "Hlavná kniha",
      },
    },
    Periods: {
      icon: "calendar",
      order: 3,
      label: {
        "en-US": "Periods",
        "en-GLOBAL": "Periods",
        "de-DE": "Perioden",
        "pl-PL": "Okresy",
        "fr-FR": "Périodes",
        "it-IT": "Periodi",
        "es-ES": "Períodos",
        "sk-SK": "Účtovné obdobia",
      },
    },
    Accounting: {
      icon: "settings",
      order: 4,
      label: {
        "en-US": "Setup",
        "en-GLOBAL": "Setup",
        "de-DE": "Einrichtung",
        "pl-PL": "Konfiguracja",
        "fr-FR": "Configuration",
        "it-IT": "Configurazione iniziale",
        "es-ES": "Configuración inicial",
        "sk-SK": "Nastavenie",
      },
    },
  },
};

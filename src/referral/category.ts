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
  description: {
    "en-US": "Review referral earnings and outstanding payouts.",
    "en-GLOBAL": "Review referral earnings and outstanding payouts.",
    "de-DE": "Prüfen Sie Empfehlungsprovisionen und offene Auszahlungen.",
    "pl-PL": "Sprawdź prowizje za polecenia i kwoty do wypłaty.",
    "fr-FR":
      "Consultez les commissions de parrainage et les versements en attente.",
    "it-IT": "Verifichi le commissioni sugli inviti e i pagamenti in sospeso.",
    "es-ES":
      "Revise las comisiones por recomendaciones y los pagos pendientes.",
    "sk-SK": "Skontrolujte provízie za odporúčania a sumy na vyplatenie.",
  },
  group: "billing",
  icon: "share-2",
  order: 60,
  landing: {
    destinations: [
      "referral-overview",
      "referral_admin_payouts_GET",
      "referral-code-report",
    ],
    destinationDescriptions: {
      "referral-overview": {
        "en-US": "Clicks, signups, revenue and commission for every code.",
        "en-GLOBAL": "Clicks, signups, revenue and commission for every code.",
        "de-DE": "Klicks, Anmeldungen, Umsatz und Provision für jeden Code.",
        "pl-PL":
          "Kliknięcia, rejestracje, przychód i prowizja dla każdego kodu.",
        "fr-FR":
          "Clics, inscriptions, revenus et commissions pour chaque code.",
        "it-IT": "Clic, iscrizioni, ricavi e commissioni per ogni codice.",
        "es-ES": "Clics, registros, ingresos y comisiones de cada código.",
        "sk-SK": "Kliknutia, registrácie, tržby a provízie pre každý kód.",
      },
      referral_admin_payouts_GET: {
        "en-US": "Approve or reject partner payout requests.",
        "en-GLOBAL": "Approve or reject partner payout requests.",
        "de-DE": "Auszahlungsanfragen von Partnern freigeben oder ablehnen.",
        "pl-PL": "Akceptuj lub odrzucaj wnioski partnerów o wypłatę.",
        "fr-FR":
          "Validez ou refusez les demandes de versement des partenaires.",
        "it-IT": "Approvi o rifiuti le richieste di pagamento dei partner.",
        "es-ES": "Apruebe o rechace las solicitudes de pago de los socios.",
        "sk-SK": "Schváľte alebo zamietnite žiadosti partnerov o výplatu.",
      },
      "referral-code-report": {
        "en-US": "One code end to end: owner, conversions, money and payouts.",
        "en-GLOBAL":
          "One code end to end: owner, conversions, money and payouts.",
        "de-DE":
          "Ein Code komplett: Inhaber, Conversions, Umsatz und Auszahlungen.",
        "pl-PL":
          "Jeden kod od początku do końca: właściciel, konwersje, pieniądze i wypłaty.",
        "fr-FR":
          "Un code de bout en bout : titulaire, conversions, revenus et versements.",
        "it-IT":
          "Un codice dall’inizio alla fine: titolare, conversioni, ricavi e pagamenti.",
        "es-ES":
          "Un código de principio a fin: titular, conversiones, ingresos y pagos.",
        "sk-SK":
          "Jeden kód od začiatku do konca: vlastník, konverzie, peniaze a výplaty.",
      },
    },
  },
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

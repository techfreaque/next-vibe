/**
 * Category definition for the Subscription admin module.
 * Covers subscription statistics, credit purchases, and referral administration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { SUBSCRIPTION_DASHBOARD_ALIAS } from "@/subscription/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { SUBSCRIPTION_ADMIN_LIST_ALIAS } from "./admin/list/constants";

export const category: CategoryDefinition = {
  key: "subscriptions",
  label: {
    "en-US": "Subscriptions",
    "en-GLOBAL": "Subscriptions",
    "de-DE": "Abonnements",
    "pl-PL": "Subskrypcje",
    "fr-FR": "Abonnements",
    "it-IT": "Abbonamenti",
    "es-ES": "Suscripciones",
    "sk-SK": "Predplatné",
  },
  description: {
    "en-US": "Find active plans, renewals and cancellations.",
    "en-GLOBAL": "Find active plans, renewals and cancellations.",
    "de-DE": "Sehen Sie aktive Abos, Verlängerungen und Kündigungen ein.",
    "pl-PL": "Sprawdź aktywne plany, odnowienia i rezygnacje.",
    "fr-FR":
      "Consultez les abonnements actifs, les renouvellements et les résiliations.",
    "it-IT": "Consulti i piani attivi, i rinnovi e le disdette.",
    "es-ES":
      "Consulte los planes activos, las renovaciones y las cancelaciones.",
    "sk-SK": "Skontrolujte aktívne predplatné, obnovenia a zrušenia.",
  },
  group: "billing",
  icon: "refresh-cw",
  order: 12,
  landing: {
    destinations: [
      "subscription-admin-list",
      "subscription-admin-stats",
      "subscription-admin-purchases",
      "products-catalog-list",
    ],
    destinationDescriptions: {
      "subscription-admin-list": {
        "en-US": "Every subscription with plan, status and renewal date.",
        "en-GLOBAL": "Every subscription with plan, status and renewal date.",
        "de-DE": "Alle Abonnements mit Tarif, Status und Verlängerung.",
        "pl-PL": "Wszystkie subskrypcje z planem, statusem i datą odnowienia.",
        "fr-FR": "Tous les abonnements avec offre, statut et renouvellement.",
        "it-IT": "Tutti gli abbonamenti con piano, stato e rinnovo.",
        "es-ES": "Todas las suscripciones con plan, estado y renovación.",
        "sk-SK": "Všetky predplatné s plánom, stavom a dátumom obnovenia.",
      },
      "subscription-admin-stats": {
        "en-US": "Subscription, credit and referral revenue in one view.",
        "en-GLOBAL": "Subscription, credit and referral revenue in one view.",
        "de-DE": "Umsatz aus Abos, Credits und Empfehlungen auf einen Blick.",
        "pl-PL": "Przychody z subskrypcji, kredytów i poleceń w jednym widoku.",
        "fr-FR":
          "Revenus des abonnements, crédits et parrainages en un coup d’œil.",
        "it-IT": "Ricavi da abbonamenti, crediti e referral in un’unica vista.",
        "es-ES":
          "Ingresos de suscripciones, créditos y referidos de un vistazo.",
        "sk-SK":
          "Tržby z predplatného, kreditov a odporúčaní na jednom mieste.",
      },
      "subscription-admin-purchases": {
        "en-US": "Every credit pack bought, by whom and when.",
        "en-GLOBAL": "Every credit pack bought, by whom and when.",
        "de-DE": "Jedes gekaufte Credit-Paket, mit Käufer und Datum.",
        "pl-PL": "Każdy kupiony pakiet kredytów: kto i kiedy.",
        "fr-FR": "Chaque pack de crédits acheté, par qui et quand.",
        "it-IT": "Ogni pacchetto di crediti acquistato, da chi e quando.",
        "es-ES": "Cada paquete de créditos comprado, por quién y cuándo.",
        "sk-SK": "Každý kúpený balík kreditov, kto a kedy.",
      },
      "products-catalog-list": {
        "en-US": "The plans and credit packs customers can buy.",
        "en-GLOBAL": "The plans and credit packs customers can buy.",
        "de-DE": "Die Tarife und Credit-Pakete, die Kunden kaufen können.",
        "pl-PL": "Plany i pakiety kredytów dostępne dla klientów.",
        "fr-FR": "Les offres et packs de crédits proposés aux clients.",
        "it-IT": "I piani e i pacchetti di crediti acquistabili dai clienti.",
        "es-ES":
          "Los planes y paquetes de créditos que pueden comprar los clientes.",
        "sk-SK": "Plány a balíky kreditov, ktoré si zákazníci môžu kúpiť.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SUBSCRIPTION_ADMIN_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: SUBSCRIPTION_DASHBOARD_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Subscriptions: {
      icon: "refresh-cw",
      order: 0,
      label: {
        "en-US": "Subscriptions",
        "en-GLOBAL": "Subscriptions",
        "de-DE": "Abonnements",
        "pl-PL": "Subskrypcje",
        "fr-FR": "Abonnements",
        "it-IT": "Abbonamenti",
        "es-ES": "Suscripciones",
        "sk-SK": "Predplatné",
      },
    },
    Management: {
      icon: "settings-2",
      order: 1,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
        "fr-FR": "Gestion",
        "it-IT": "Gestione",
        "es-ES": "Gestión",
        "sk-SK": "Správa",
      },
    },
    subscriptionAnalytics: {
      icon: "bar-chart-2",
      order: 2,
      label: {
        "en-US": "Analytics",
        "en-GLOBAL": "Analytics",
        "de-DE": "Analytik",
        "pl-PL": "Analityka",
        "fr-FR": "Analytique",
        "it-IT": "Analisi",
        "es-ES": "Analítica",
        "sk-SK": "Analytika",
      },
    },
  },
};

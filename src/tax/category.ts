/**
 * Category definition for the Tax module.
 * Covers tax rate configuration and tax reporting.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { TAX_RATE_LIST_ALIAS } from "./rate/list/constants";

export const category: CategoryDefinition = {
  key: "tax",
  label: {
    "en-US": "Tax",
    "en-GLOBAL": "Tax",
    "de-DE": "Steuern",
    "pl-PL": "Podatki",
    "fr-FR": "Taxes",
    "it-IT": "Imposte",
    "es-ES": "Impuestos",
    "sk-SK": "Dane",
    "hi-IN": "टैक्स",
  },
  description: {
    "en-US": "Review your tax regime, rates and VAT summary.",
    "de-DE":
      "Prüfen Sie Steuerregelung, Steuersätze und Umsatzsteuerübersicht.",
    "pl-PL": "Sprawdź sposób rozliczania podatku, stawki i podsumowanie VAT.",
    "fr-FR":
      "Consultez votre régime fiscal, vos taux et votre synthèse de TVA.",
    "it-IT": "Consulti il regime fiscale, le aliquote e il riepilogo IVA.",
    "es-ES": "Revise su régimen fiscal, tipos impositivos y resumen de IVA.",
    "sk-SK": "Skontrolujte daňový režim firmy, sadzby a prehľad DPH.",
    "hi-IN": "अपना टैक्स सिस्टम, दरें और VAT सारांश देखें।",
    "en-GLOBAL": "Review your tax regime, rates and VAT summary.",
  },
  group: "business",
  icon: "file-text",
  order: 65,
  createActions: ["tax_rate_create_POST"],
  landing: {
    destinations: [
      "company-tax-regime-view",
      "tax-rate-list",
      "coa-tax-report",
      "tax_report_GET",
      "tax-compliance",
      "tax-vat-return",
    ],
    actions: ["tax_rate_create_POST"],
    destinationDescriptions: {
      "company-tax-regime-view": {
        "en-US": "Choose how VAT applies to your documents.",
        "en-GLOBAL": "Choose how VAT applies to your documents.",
        "de-DE":
          "Festlegen, wie die Umsatzsteuer auf Ihre Belege angewendet wird.",
        "pl-PL": "Wybierz, jak VAT ma działać na dokumentach.",
        "fr-FR": "Choisissez le régime de TVA appliqué à vos documents.",
        "it-IT": "Scelga come applicare l’IVA ai documenti.",
        "es-ES": "Elija cómo se aplica el IVA a sus documentos.",
        "sk-SK": "Vyberte, ako sa DPH uplatňuje na vaše doklady.",
        "hi-IN": "चुनें कि आपके दस्तावेज़ों पर VAT कैसे लागू हो।",
      },
      "tax-rate-list": {
        "en-US": "The tax rates your documents can use.",
        "en-GLOBAL": "The tax rates your documents can use.",
        "de-DE": "Die Steuersätze, die Ihre Belege verwenden können.",
        "pl-PL": "Stawki podatku dostępne w dokumentach.",
        "fr-FR": "Les taux de taxe utilisables dans vos documents.",
        "it-IT": "Le aliquote disponibili per i documenti.",
        "es-ES": "Los tipos impositivos disponibles para sus documentos.",
        "sk-SK": "Sadzby dane, ktoré môžu používať vaše doklady.",
        "hi-IN": "वे टैक्स दरें जो आपके दस्तावेज़ इस्तेमाल कर सकते हैं।",
      },
      "coa-tax-report": {
        "en-US": "Booked VAT movements for the dates you pick.",
        "en-GLOBAL": "Booked VAT movements for the dates you pick.",
        "de-DE": "Gebuchte Umsatzsteuerbewegungen für den gewählten Zeitraum.",
        "pl-PL": "Zaksięgowane ruchy VAT w wybranym okresie.",
        "fr-FR": "Mouvements de TVA comptabilisés sur les dates choisies.",
        "it-IT": "Movimenti IVA registrati nelle date scelte.",
        "es-ES": "Movimientos de IVA contabilizados en las fechas elegidas.",
        "sk-SK": "Zaúčtované pohyby DPH za zvolené obdobie.",
        "hi-IN": "आपकी चुनी तारीखों के बुक किए VAT मूवमेंट।",
      },
      tax_report_GET: {
        "en-US": "Tax on invoices, bills and till sales, by rate.",
        "en-GLOBAL": "Tax on invoices, bills and till sales, by rate.",
        "de-DE":
          "Steuer auf Rechnungen, Eingangsrechnungen und Kassenverkäufe, nach Satz.",
        "pl-PL":
          "Podatek z faktur, rachunków i sprzedaży kasowej według stawki.",
        "fr-FR": "Taxe sur factures, achats et ventes en caisse, par taux.",
        "it-IT":
          "Imposta su fatture, acquisti e vendite in cassa, per aliquota.",
        "es-ES": "Impuesto en facturas, compras y ventas en caja, por tipo.",
        "sk-SK": "Daň z faktúr, nákupov a predaja v pokladni podľa sadzby.",
        "hi-IN": "इनवॉइस, बिल और काउंटर बिक्री पर टैक्स, दर के हिसाब से।",
      },
      "tax-compliance": {
        "en-US":
          "Which legal requirements of your country are met, and what to fix.",
        "en-GLOBAL":
          "Which legal requirements of your country are met, and what to fix.",
        "de-DE":
          "Welche gesetzlichen Pflichten Ihres Landes erfüllt sind und was fehlt.",
        "pl-PL":
          "Które wymogi prawne Twojego kraju są spełnione i co poprawić.",
        "fr-FR":
          "Les obligations légales de votre pays déjà remplies, et ce qu’il reste à corriger.",
        "it-IT":
          "Quali obblighi di legge del suo Paese sono rispettati e cosa correggere.",
        "es-ES": "Qué requisitos legales de su país se cumplen y qué corregir.",
        "sk-SK": "Ktoré zákonné požiadavky vašej krajiny spĺňate a čo opraviť.",
        "hi-IN": "आपके देश की कौन सी कानूनी ज़रूरतें पूरी हैं और क्या ठीक करना है।",
      },
      "tax-vat-return": {
        "en-US":
          "Your VAT return for the period, in your country's official format.",
        "en-GLOBAL":
          "Your VAT return for the period, in your country's official format.",
        "de-DE":
          "Ihre Umsatzsteuer-Voranmeldung für den Zeitraum im amtlichen Format Ihres Landes.",
        "pl-PL":
          "Twoja deklaracja VAT za wybrany okres w urzędowym formacie Twojego kraju.",
        "fr-FR":
          "Votre déclaration de TVA pour la période, au format officiel de votre pays.",
        "it-IT":
          "La sua dichiarazione IVA per il periodo, nel formato ufficiale del suo Paese.",
        "es-ES":
          "Su declaración de IVA del período, en el formato oficial de su país.",
        "sk-SK":
          "Vaše daňové priznanie k DPH za obdobie v úradnom formáte vašej krajiny.",
        "hi-IN": "अवधि का आपका VAT रिटर्न, आपके देश के आधिकारिक फ़ॉर्मेट में।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: TAX_RATE_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Tax Rates": {
      icon: "receipt",
      order: 0,
      label: {
        "en-US": "Tax Rates",
        "en-GLOBAL": "Tax Rates",
        "de-DE": "Steuersätze",
        "pl-PL": "Stawki podatkowe",
        "fr-FR": "Taux de taxe",
        "it-IT": "Aliquote fiscali",
        "es-ES": "Tasas impositivas",
        "sk-SK": "Daňové sadzby",
        "hi-IN": "टैक्स दरें",
      },
      // inherits parent defaultEntry (tax/rate/list)
    },
    "Tax Reports": {
      icon: "bar-chart-2",
      order: 1,
      label: {
        "en-US": "Reports",
        "en-GLOBAL": "Reports",
        "de-DE": "Berichte",
        "pl-PL": "Raporty",
        "fr-FR": "Rapports",
        "it-IT": "Report",
        "es-ES": "Informes",
        "sk-SK": "Daňové výkazy",
        "hi-IN": "रिपोर्ट",
      },
    },
  },
};

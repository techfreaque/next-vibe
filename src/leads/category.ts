/**
 * Category definition for the Leads module.
 * Covers lead records, imports, campaigns, and bulk operations.
 */

import type {
  CategoryDefinition,
  RecordSearchDestination,
} from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { ACQUISITION_REPORT_ALIAS } from "@/leads/analytics/acquisition/constants";
import { LEADS_SEARCH_ALIAS } from "@/leads/search/constants";
import type leadSearch from "@/leads/search/definition";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "leads",
  label: {
    "en-US": "Leads",
    "en-GLOBAL": "Leads",
    "de-DE": "Leads",
    "pl-PL": "Leady",
    "fr-FR": "Leads",
    "it-IT": "Contatti commerciali",
    "es-ES": "Prospectos",
    "sk-SK": "Potenciálni zákazníci",
    "hi-IN": "लीड",
  },
  description: {
    "en-US":
      "Review where leads came from, how they converted and who arrived recently.",
    "de-DE":
      "Prüfen Sie die Herkunft, Konversion und letzten Zugänge Ihrer Leads.",
    "pl-PL": "Sprawdź źródła leadów, konwersje i ostatnie kontakty.",
    "fr-FR":
      "Identifiez les sources de vos leads, les conversions et les nouveaux contacts.",
    "it-IT": "Verifica la provenienza, le conversioni e i nuovi contatti.",
    "es-ES":
      "Revisa el origen, las conversiones y los prospectos más recientes.",
    "sk-SK":
      "Skontrolujte zdroje kontaktov, konverzie a najnovších potenciálnych zákazníkov.",
    "hi-IN": "देखें कि लीड कहाँ से आए, कैसे कन्वर्ट हुए और हाल में कौन आया।",
    "en-GLOBAL":
      "Review where leads came from, how they converted and who arrived recently.",
  },
  group: "people",
  icon: "target",
  order: 20,
  createActions: ["leads_create_POST"],
  landing: {
    summary: { alias: "leads-dashboard", scope: "platform" },
    actions: ["leads_create_POST"],
    destinations: [
      "leads-list",
      "acquisition-report",
      "funnel-report",
      "abuse-report",
      "leads-import-status",
    ],
    destinationDescriptions: {
      "leads-list": {
        "en-US": "Every lead with source, status and campaign stage.",
        "en-GLOBAL": "Every lead with source, status and campaign stage.",
        "de-DE": "Alle Leads mit Quelle, Status und Kampagnenstufe.",
        "pl-PL": "Wszystkie leady ze źródłem, statusem i etapem kampanii.",
        "fr-FR":
          "Tous les leads avec leur source, statut et étape de campagne.",
        "it-IT": "Tutti i lead con fonte, stato e fase della campagna.",
        "es-ES": "Todos los leads con origen, estado y etapa de campaña.",
        "sk-SK": "Všetky leady so zdrojom, stavom a fázou kampane.",
        "hi-IN": "हर लीड, सोर्स, स्टेटस और कैंपेन स्टेज के साथ।",
      },
      "acquisition-report": {
        "en-US": "See which sources bring visitors, leads and signups.",
        "en-GLOBAL": "See which sources bring visitors, leads and signups.",
        "de-DE":
          "Sehen, welche Quellen Besucher, Leads und Anmeldungen bringen.",
        "pl-PL": "Zobacz, które źródła dają odwiedziny, leady i rejestracje.",
        "fr-FR":
          "Voyez quelles sources apportent visiteurs, leads et inscriptions.",
        "it-IT": "Veda quali fonti portano visitatori, lead e iscrizioni.",
        "es-ES": "Vea qué fuentes traen visitas, leads y registros.",
        "sk-SK":
          "Pozrite si, ktoré zdroje prinášajú návštevy, leady a registrácie.",
        "hi-IN": "देखें कौन से सोर्स विज़िटर, लीड और साइनअप लाते हैं।",
      },
      "funnel-report": {
        "en-US": "Find where visitors drop off before they pay.",
        "en-GLOBAL": "Find where visitors drop off before they pay.",
        "de-DE": "Erkennen, wo Besucher vor dem Bezahlen abspringen.",
        "pl-PL": "Sprawdź, gdzie odwiedzający odpadają przed zapłatą.",
        "fr-FR": "Repérez où les visiteurs décrochent avant de payer.",
        "it-IT": "Scopra dove i visitatori abbandonano prima di pagare.",
        "es-ES": "Detecte dónde abandonan los visitantes antes de pagar.",
        "sk-SK": "Zistite, kde návštevníci odpadávajú pred platbou.",
        "hi-IN": "पता करें कि विज़िटर पेमेंट से पहले कहाँ छोड़ देते हैं।",
      },
      "abuse-report": {
        "en-US":
          "Bot bursts and free-credit burners, by network and user agent.",
        "en-GLOBAL":
          "Bot bursts and free-credit burners, by network and user agent.",
        "de-DE":
          "Bot-Wellen und Gratis-Credit-Verbraucher, nach Netz und User-Agent.",
        "pl-PL":
          "Fale botów i zużycie darmowych kredytów według sieci i przeglądarki.",
        "fr-FR":
          "Vagues de bots et consommateurs de crédits gratuits, par réseau et agent.",
        "it-IT":
          "Ondate di bot e consumo di crediti gratuiti, per rete e user agent.",
        "es-ES":
          "Oleadas de bots y consumo de créditos gratuitos, por red y agente.",
        "sk-SK":
          "Vlny botov a míňanie bezplatných kreditov podľa siete a prehliadača.",
        "hi-IN":
          "बॉट की बाढ़ और फ़्री क्रेडिट उड़ाने वाले, नेटवर्क और यूज़र एजेंट के हिसाब से।",
      },
      "leads-import-status": {
        "en-US": "Progress and errors of every CSV import.",
        "en-GLOBAL": "Progress and errors of every CSV import.",
        "de-DE": "Fortschritt und Fehler jedes CSV-Imports.",
        "pl-PL": "Postęp i błędy każdego importu CSV.",
        "fr-FR": "Avancement et erreurs de chaque import CSV.",
        "it-IT": "Avanzamento ed errori di ogni importazione CSV.",
        "es-ES": "Progreso y errores de cada importación CSV.",
        "sk-SK": "Priebeh a chyby každého importu CSV.",
        "hi-IN": "हर CSV इंपोर्ट की प्रोग्रेस और एरर।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: ACQUISITION_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  recordSearch: {
    alias: LEADS_SEARCH_ALIAS,
    field: "search",
  } satisfies RecordSearchDestination<typeof leadSearch.GET>,
  subcategories: {
    Analytics: {
      icon: "bar-chart-2",
      order: -1,
      label: {
        "en-US": "Analytics",
        "en-GLOBAL": "Analytics",
        "de-DE": "Analysen",
        "pl-PL": "Analityka",
        "fr-FR": "Analyses",
        "it-IT": "Analisi",
        "es-ES": "Análisis",
        "sk-SK": "Analytika",
        "hi-IN": "एनालिटिक्स",
      },
    },
    Management: {
      icon: "users",
      order: 0,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
        "fr-FR": "Gestion",
        "it-IT": "Gestione",
        "es-ES": "Gestión",
        "sk-SK": "Správa",
        "hi-IN": "मैनेजमेंट",
      },
      // inherits parent defaultEntry (acquisition-report)
    },
    Import: {
      icon: "upload",
      order: 1,
      label: {
        "en-US": "Import",
        "en-GLOBAL": "Import",
        "de-DE": "Import",
        "pl-PL": "Import",
        "fr-FR": "Import",
        "it-IT": "Importazione",
        "es-ES": "Importación",
        "sk-SK": "Import",
        "hi-IN": "इंपोर्ट",
      },
    },
    Leads: {
      icon: "target",
      order: 2,
      label: {
        "en-US": "Leads",
        "en-GLOBAL": "Leads",
        "de-DE": "Leads",
        "pl-PL": "Leady",
        "fr-FR": "Leads",
        "it-IT": "Contatti commerciali",
        "es-ES": "Prospectos",
        "sk-SK": "Potenciálni zákazníci",
        "hi-IN": "लीड",
      },
    },
    emailCampaignsProcessing: {
      icon: "mail",
      order: 3,
      label: {
        "en-US": "Campaigns",
        "en-GLOBAL": "Campaigns",
        "de-DE": "Kampagnen",
        "pl-PL": "Kampanie",
        "fr-FR": "Campagnes",
        "it-IT": "Campagne",
        "es-ES": "Campañas",
        "sk-SK": "Kampane",
        "hi-IN": "कैंपेन",
      },
    },
    emailCampaignsJourneys: {
      icon: "git-branch",
      order: 4,
      label: {
        "en-US": "Journeys",
        "en-GLOBAL": "Journeys",
        "de-DE": "Journeys",
        "pl-PL": "Ścieżki",
        "fr-FR": "Parcours",
        "it-IT": "Percorsi",
        "es-ES": "Secuencias",
        "sk-SK": "Komunikačné scenáre",
        "hi-IN": "जर्नी",
      },
    },
    emailCampaignsQueue: {
      icon: "list",
      order: 5,
      label: {
        "en-US": "Queue",
        "en-GLOBAL": "Queue",
        "de-DE": "Warteschlange",
        "pl-PL": "Kolejka",
        "fr-FR": "File d'attente",
        "it-IT": "Coda",
        "es-ES": "Cola",
        "sk-SK": "Front",
        "hi-IN": "कतार",
      },
    },
    emailCampaignsStats: {
      icon: "bar-chart-2",
      order: 6,
      label: {
        "en-US": "Campaign Stats",
        "en-GLOBAL": "Campaign Stats",
        "de-DE": "Kampagnenstatistiken",
        "pl-PL": "Statystyki kampanii",
        "fr-FR": "Stats des campagnes",
        "it-IT": "Statistiche campagne",
        "es-ES": "Estadísticas de campañas",
        "sk-SK": "Štatistiky kampaní",
        "hi-IN": "कैंपेन आँकड़े",
      },
    },
    growth: {
      icon: "trending-up",
      order: 8,
      label: {
        "en-US": "Growth",
        "en-GLOBAL": "Growth",
        "de-DE": "Wachstum",
        "pl-PL": "Wzrost",
        "fr-FR": "Croissance",
        "it-IT": "Crescita",
        "es-ES": "Crecimiento",
        "sk-SK": "Rast",
        "hi-IN": "ग्रोथ",
      },
    },
    outreach: {
      icon: "mail",
      order: 9,
      label: {
        "en-US": "Outreach",
        "en-GLOBAL": "Outreach",
        "de-DE": "Outreach",
        "pl-PL": "Outreach",
        "fr-FR": "Prospection",
        "it-IT": "Primi contatti",
        "es-ES": "Contacto inicial",
        "sk-SK": "Oslovovanie zákazníkov",
        "hi-IN": "आउटरीच",
      },
    },
    leadMagnetIntegrations: {
      icon: "plug",
      order: 7,
      label: {
        "en-US": "Integrations",
        "en-GLOBAL": "Integrations",
        "de-DE": "Integrationen",
        "pl-PL": "Integracje",
        "fr-FR": "Intégrations",
        "it-IT": "Integrazioni",
        "es-ES": "Integraciones",
        "sk-SK": "Integrácie",
        "hi-IN": "इंटीग्रेशन",
      },
    },
  },
};

/**
 * Category definition for the Newsletter module.
 * Covers email campaigns, journey variants, queue processing, stats, and subscriber management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { CAMPAIGN_STATS_ALIAS } from "@/leads/campaigns/stats/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "newsletter",
  label: {
    "en-US": "Newsletter",
    "en-GLOBAL": "Newsletter",
    "de-DE": "Newsletter",
    "pl-PL": "Newsletter",
    "fr-FR": "Newsletter",
    "it-IT": "Newsletter",
    "es-ES": "Boletín",
    "sk-SK": "Newsletter",
    "hi-IN": "न्यूज़लेटर",
  },
  description: {
    "en-US": "Review subscribers, scheduled campaigns and delivery results.",
    "en-GLOBAL":
      "Review subscribers, scheduled campaigns and delivery results.",
    "de-DE": "Prüfen Sie Abonnenten, geplante Kampagnen und Zustellergebnisse.",
    "pl-PL": "Sprawdź subskrybentów, zaplanowane kampanie i wyniki wysyłek.",
    "fr-FR":
      "Consultez les abonnés, les campagnes prévues et les résultats des envois.",
    "it-IT":
      "Consulti gli iscritti, le campagne programmate e gli esiti degli invii.",
    "es-ES":
      "Consulte los suscriptores, las campañas programadas y los resultados de los envíos.",
    "sk-SK":
      "Skontrolujte odberateľov, plánované kampane a výsledky doručovania.",
    "hi-IN": "सब्सक्राइबर, शेड्यूल किए कैंपेन और डिलीवरी के नतीजे देखें।",
  },
  group: "analytics",
  icon: "send",
  order: 20,
  landing: {
    destinations: [
      "campaign-stats",
      "campaign-queue",
      "lifecycle",
      "campaign-journey-variants",
    ],
    destinationDescriptions: {
      "campaign-stats": {
        "en-US": "Sent, opened, clicked and bounced per journey and locale.",
        "en-GLOBAL":
          "Sent, opened, clicked and bounced per journey and locale.",
        "de-DE":
          "Gesendet, geöffnet, geklickt und gebounct je Journey und Sprache.",
        "pl-PL":
          "Wysłane, otwarte, kliknięte i odbite według ścieżki i języka.",
        "fr-FR": "Envoyés, ouverts, cliqués et rebonds par parcours et langue.",
        "it-IT":
          "Inviate, aperte, cliccate e rimbalzate per percorso e lingua.",
        "es-ES": "Enviados, abiertos, clics y rebotes por recorrido e idioma.",
        "sk-SK":
          "Odoslané, otvorené, kliknuté a nedoručené podľa cesty a jazyka.",
        "hi-IN": "हर जर्नी और भाषा के हिसाब से भेजे, खोले, क्लिक और बाउंस हुए।",
      },
      "campaign-queue": {
        "en-US": "Leads waiting for their next campaign email.",
        "en-GLOBAL": "Leads waiting for their next campaign email.",
        "de-DE": "Leads, die auf ihre nächste Kampagnen-Mail warten.",
        "pl-PL": "Leady czekające na kolejny e-mail kampanii.",
        "fr-FR": "Leads en attente de leur prochain e-mail de campagne.",
        "it-IT": "Lead in attesa della prossima email della campagna.",
        "es-ES": "Leads a la espera de su próximo correo de campaña.",
        "sk-SK": "Leady čakajúce na ďalší e-mail kampane.",
        "hi-IN": "अगले कैंपेन ईमेल का इंतज़ार कर रहे लीड।",
      },
      lifecycle: {
        "en-US": "Journeys, enrollments and conversions, with the kill switch.",
        "en-GLOBAL":
          "Journeys, enrollments and conversions, with the kill switch.",
        "de-DE": "Journeys, Anmeldungen und Conversions, mit Notschalter.",
        "pl-PL": "Ścieżki, zapisy i konwersje, z wyłącznikiem awaryjnym.",
        "fr-FR":
          "Parcours, inscriptions et conversions, avec l’arrêt d’urgence.",
        "it-IT":
          "Percorsi, iscrizioni e conversioni, con l’interruttore di emergenza.",
        "es-ES":
          "Recorridos, inscripciones y conversiones, con el interruptor de emergencia.",
        "sk-SK": "Cesty, zápisy a konverzie s núdzovým vypínačom.",
        "hi-IN": "जर्नी, एनरोलमेंट और कन्वर्ज़न, किल स्विच के साथ।",
      },
      "campaign-journey-variants": {
        "en-US": "The email journeys leads can be enrolled in.",
        "en-GLOBAL": "The email journeys leads can be enrolled in.",
        "de-DE": "Die E-Mail-Journeys, in die Leads aufgenommen werden können.",
        "pl-PL": "Ścieżki e-mailowe, do których można zapisać leady.",
        "fr-FR": "Les parcours e-mail auxquels un lead peut être inscrit.",
        "it-IT": "I percorsi email a cui iscrivere i lead.",
        "es-ES":
          "Los recorridos de correo en los que se puede inscribir a los leads.",
        "sk-SK": "E-mailové cesty, do ktorých možno zaradiť leady.",
        "hi-IN": "वे ईमेल जर्नी जिनमें लीड जोड़े जा सकते हैं।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CAMPAIGN_STATS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    emailCampaignsStats: {
      icon: "bar-chart-2",
      order: 0,
      label: {
        "en-US": "Campaign Stats",
        "en-GLOBAL": "Campaign Stats",
        "de-DE": "Kampagnen-Statistiken",
        "pl-PL": "Statystyki kampanii",
        "fr-FR": "Stats des campagnes",
        "it-IT": "Statistiche campagne",
        "es-ES": "Estadísticas de campañas",
        "sk-SK": "Štatistiky kampaní",
        "hi-IN": "कैंपेन आँकड़े",
      },
    },
    emailCampaignsProcessing: {
      icon: "mail",
      order: 1,
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
      order: 2,
      label: {
        "en-US": "Journeys",
        "en-GLOBAL": "Journeys",
        "de-DE": "Journeys",
        "pl-PL": "Podróże",
        "fr-FR": "Parcours",
        "it-IT": "Percorsi",
        "es-ES": "Secuencias",
        "sk-SK": "Komunikačné scenáre",
        "hi-IN": "जर्नी",
      },
    },
    emailCampaignsQueue: {
      icon: "list",
      order: 3,
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
    Subscriptions: {
      icon: "user-check",
      order: 4,
      label: {
        "en-US": "Subscriptions",
        "en-GLOBAL": "Subscriptions",
        "de-DE": "Abonnements",
        "pl-PL": "Subskrypcje",
        "fr-FR": "Abonnements",
        "it-IT": "Abbonamenti",
        "es-ES": "Suscripciones",
        "sk-SK": "Predplatné",
        "hi-IN": "सब्सक्रिप्शन",
      },
    },
  },
};

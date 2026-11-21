import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "lead",
    analytics: "analisi",
  },
  get: {
    title: "Segnali di abuso",
    titleShort: "Abusi",
    description:
      "Ondate di lead e registrazioni da una stessa rete o da uno stesso user agent, e crediti gratuiti bruciati da visitatori mai registrati. Ogni riga apre i lead corrispondenti.",
    fields: {
      minLeads: {
        label: "Soglia di ondata",
        description:
          "Lead di un cluster nel periodo oltre i quali conta come ondata",
      },
    },
    response: {
      window: "Periodo",
      groupByUsed: "Raggruppato per",
      minLeadsUsed: "Soglia di ondata",
      kpis: "Numeri chiave",
      trend: "Lead da cluster segnalati",
      clusters: "Cluster",
      burners: "Chi brucia più crediti gratuiti",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Accedi come admin.",
      },
      validation: {
        title: "Filtri non validi",
        description: "Controlla il periodo e i valori dei filtri.",
      },
      server: {
        title: "Report non riuscito",
        description: "Impossibile calcolare il report sugli abusi.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Qualcosa è andato storto.",
      },
      network: {
        title: "Errore di rete",
        description: "Server non raggiungibile.",
      },
      forbidden: { title: "Accesso negato", description: "Solo per admin." },
      notFound: {
        title: "Non trovato",
        description: "Nessun dato nel report.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Applica o annulla le modifiche ai filtri.",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono cambiati. Ricarica.",
      },
    },
    success: {
      title: "Report pronto",
      description: "Report sugli abusi caricato.",
    },
  },
  widget: {
    fast: "Veloce",
    noIp: "Nessun IP",
    perHour: "Lead/ora",
    thresholdOption: "{{count}}+ lead",
    loading: "Caricamento dei segnali di abuso...",
    flaggedPrefixes: "Reti segnalate",
    flaggedAgents: "Agenti segnalati",
    thresholdHint: "{{count}}+ lead nel periodo",
    flaggedLeads: "Lead da ondate",
    flaggedShare: "{{percent}}% dei nuovi lead",
    freeCredits: "Crediti gratuiti bruciati",
    freeCreditsHint: "Da visitatori senza account",
    burners: "Visitatori che consumano",
    burnersHint: "Non utenti che spendono crediti gratuiti",
    trendTitle: "Lead dai picchi",
    trendSubtitle: "Ondata = cluster con {{count}}+ lead nel periodo.",
    seriesFlagged: "Da ondate",
    seriesOther: "Altri lead",
    clustersIpTitle: "Ondate per rete",
    clustersUaTitle: "Ondate per user agent",
    clustersSubtitle:
      "Ordinato per lead all'ora. Veloce = {{rate}}+ lead/ora. Clicca una riga per i suoi lead.",
    prefix: "Rete",
    userAgent: "User agent",
    prefixes: "Reti distinte",
    agents: "Agenti distinti",
    noClusters: "Nessun cluster ha raggiunto {{count}} lead in questo periodo.",
    burnersTitle: "Chi brucia più crediti gratuiti",
    burnersSubtitle: "Visitatori senza account. Clicca per aprire il lead.",
    lead: "Lead",
    requests: "Richieste",
    noBurners:
      "Nessun credito gratuito bruciato da non utenti in questo periodo.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Restringe ogni numero di questa pagina.",
    apply: "Applica",
  },
};

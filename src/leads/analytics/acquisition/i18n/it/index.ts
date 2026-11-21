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
    title: "Acquisizione",
    titleShort: "Acquisizione",
    description:
      "Da dove arrivano visitatori e lead: canale, sorgente, referrer, campagna, pagina di atterraggio, paese, dispositivo, persone o bot. Ogni numero apre i lead corrispondenti.",
    response: {
      window: "Periodo",
      kpis: "Numeri chiave",
      trend: "Andamento",
      breakdown: "Suddivisione",
      agents: "Agenti",
      coverage: "Copertura del tracciamento",
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
        description: "Impossibile calcolare il report di acquisizione.",
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
      description: "Report di acquisizione caricato.",
    },
  },
  widget: {
    revenue: "Ricavi",
    humanVisits: "Visite umane",
    botVisits: "Visite bot",
    botVisitsHint: "{{count}} visite bot",
    botsTitle: "Lead bot",
    botsSubtitle:
      "Crawler, anteprime link e script. Clicca una barra per i suoi lead.",
    loading: "Caricamento del report di acquisizione...",
    coverage:
      "Le visite sono tracciate dal {{date}}. I lead precedenti contano, ma senza visite.",
    botShareHint: "{{percent}} dei nuovi lead",
    leadsTitle: "Lead umani",
    leadsSubtitle: "Nuovi lead umani. Clicca una barra per i suoi lead.",
    visitsTitle: "Visite tracciate",
    visitsSubtitle: "Arrivi tracciati. Umani vs lead classificati come bot.",
    conversionsTitle: "Iscrizioni e paganti",
    conversionsSubtitle: "In base al giorno in cui è avvenuta ogni fase.",
    breakdownTitle: "Da dove arrivano i lead",
    breakdownSubtitle: "Primo contatto. Clicca una riga per i suoi lead.",
    agentsTitle: "Chi si presenta",
    agentsSubtitle: "Famiglia di agente ricavata dallo user agent.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Restringe ogni numero di questa pagina.",
    apply: "Applica",
    empty: "Nessun lead in questo periodo.",
    emptyHint: "Scegli un periodo più lungo o cancella i filtri.",
  },
};

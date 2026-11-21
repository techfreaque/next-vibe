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
    title: "Funnel",
    titleShort: "Funnel",
    description:
      "Lead creati nel periodo e fin dove sono arrivati: persona, prima chat, registrazione, email confermata, pagamento. Per canale, sorgente o codice ref. Ogni fase apre i suoi lead.",
    response: {
      window: "Periodo",
      dimensionUsed: "Dimensione del segmento",
      steps: "Fasi del funnel",
      previousSteps: "Fasi del periodo precedente",
      rates: "Tassi di conversione",
      segments: "Funnel per segmento",
      trend: "Andamento della coorte",
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
        description: "Impossibile calcolare il report del funnel.",
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
      description: "Report del funnel caricato.",
    },
  },
  widget: {
    loading: "Caricamento del funnel...",
    cohortHint: "su {{count}} lead creati",
    signupRate: "Tasso di registrazione",
    payRate: "Tasso di pagamento",
    overallRate: "Da persona a pagante",
    overallShort: "A pagante",
    ofHumans: "{{count}} su {{total}} lead umani",
    ofSignups: "{{count}} su {{total}} iscrizioni",
    funnelTitle: "Funnel della coorte",
    funnelSubtitle: "Funnel dai lead umani. Bot e lead totali: prima scheda.",
    trendTitle: "Coorte per giorno di creazione",
    trendSubtitle: "Lead umani e quanti di loro hanno convertito.",
    segmentsTitle: "Funnel per segmento",
    segmentsSubtitle: "Tassi per lead umano. Clicca una riga per i suoi lead.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Restringe ogni numero di questa pagina.",
    apply: "Applica",
    empty: "Nessun lead in questo periodo.",
  },
};

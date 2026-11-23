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
      signupSteps: "Passaggi di registrazione nel periodo",
      previousSignupSteps: "Passaggi di registrazione nel periodo precedente",
      signupSegments: "Passaggi di registrazione per segmento",
      signupTrackedSince: "Passaggi di iscrizione tracciati dal",
      wallSteps: "Blocchi di conversione nel periodo",
      previousWallSteps: "Blocchi di conversione nel periodo precedente",
      wallSegments: "Blocchi di conversione per segmento",
      wallTrackedSince: "Blocchi di conversione tracciati dal",
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
    wallTitle: "Blocchi di conversione",
    wallSubtitle:
      "Persone fermate da un blocco, datate al momento in cui è successo. Ognuna conta una volta per blocco.",
    wallTrackedHint: "Tracciati dal {{date}}: prima non venivano registrati.",
    creditWallGuests: "Ospiti senza crediti",
    creditWallAccounts: "Account senza crediti",
    consentDeclined: "Consenso 18+ rifiutato",
    creditWallHint: "Invio rifiutato, mostrata la scheda crediti esauriti",
    consentDeclinedHint: "Finestra del consenso chiusa senza accettare",
    wallSegmentsTitle: "Blocchi per segmento",
    wallSegmentsSubtitle: "Gli stessi blocchi divisi per la dimensione scelta.",
    wallEmpty: "Nessuno ha incontrato un blocco in questo periodo.",
    signupTitle: "Conferma della registrazione",
    signupSubtitle:
      "Lead per passaggio, datati al momento del passaggio. Il calo mostra dove si perdono le registrazioni.",
    signupTrackedHint:
      "Tracciato dal {{date}}: delle iscrizioni precedenti restano solo i fallimenti.",
    started: "Iniziate",
    emailSent: "Email inviata",
    sendFailed: "Invio non riuscito",
    bounced: "Respinta",
    expired: "Scadute",
    confirmed: "Confermate",
    confirmRate: "Tasso di conferma",
    ofStarted: "{{count}} su {{total}} iniziate",
    signupSegmentsTitle: "Passaggi di registrazione per segmento",
    signupSegmentsSubtitle: "Gli stessi passaggi per la dimensione scelta.",
    signupEmpty: "Nessuna registrazione in questo periodo.",
    signupLost: "Perse all'email",
    signupLostHint: "Respinte, non riuscite o scadute prima della conferma",
    loading: "Caricamento del funnel...",
    cohortHint: "su {{count}} lead creati",
    signupRate: "Tasso di registrazione",
    payRate: "Tasso di pagamento",
    overallRate: "Da lead a pagante",
    overallShort: "A pagante",
    ofHumans: "{{count}} su {{total}} lead senza bot",
    ofSignups: "{{count}} su {{total}} iscrizioni",
    funnelTitle: "Funnel della coorte",
    funnelSubtitle:
      "Funnel dai lead senza bot (browser o senza user agent). Bot e lead totali: prima scheda.",
    trendTitle: "Coorte per giorno di creazione",
    trendSubtitle: "Lead senza bot e quanti di loro hanno convertito.",
    segmentsTitle: "Funnel per segmento",
    segmentsSubtitle:
      "Tassi per lead senza bot. Clicca una riga per i suoi lead.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Restringe ogni numero di questa pagina.",
    apply: "Applica",
    empty: "Nessun lead in questo periodo.",
  },
};

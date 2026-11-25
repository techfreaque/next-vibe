import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Periodo di chiusura",
    titleShort: "Periodo di chiusura",
    description:
      "Chiudere un periodo contabile. Non richiede alcuna voce di giornale DRAFT nel periodo.",
    periodId: {
      label: "Periodo ID",
      description: "Il periodo di chiusura",
      placeholder: "Periodo UUID",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Periodo non valido ID",
      },
      forbidden: {
        title: "Accesso negato",
        description: "ruolo contabile richiesto per periodi di chiusura",
      },
      server: {
        title: "Errore del server",
        description: "Non si può chiudere il periodo",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Progetti di voci esistenti",
        description:
          "Tutte le voci di giornale devono essere pubblicate prima della chiusura",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Periodo non trovato" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Periodo Chiuso",
      description: "Il periodo contabile è stato chiuso",
    },
    widget: {
      closeNamed: "Chiudi {{name}}",
      draftCount: "Registrazioni in bozza",
      closedLabel: "Chiuso",
      failedLabel: "Sfigato",
      confirmTitle: "Periodo di contabilità?",
      confirmDescription:
        "La chiusura di questo periodo è permanente. Nessun nuovo articolo di giornale può essere pubblicato in un periodo chiuso.",
      confirmButton: "Sì, Periodo di chiusura",
      cancelButton: "Annulla",
    },
  },
  title: "Periodo di chiusura",
  description: "Chiudere un periodo contabile",
  category: "Grafico dei conti",
  tag: "Periodo",
};

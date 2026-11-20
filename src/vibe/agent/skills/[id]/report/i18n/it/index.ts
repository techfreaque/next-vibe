import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  post: {
    title: "Rapporto Skill",
    titleShort: "Rapporto Skill",
    description:
      "Segnala un'abilità comunitaria per la moderazione. Idempotent - un rapporto per utente per abilità.",
    dynamicTitle: "Rapporto: {{name}}",
    reason: {
      label: "Motivazione",
      description: "Perche' stai denunciando questa abilita'?",
      placeholder: "Descrivi il problema...",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di fornire un motivo",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso al report",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non si può segnalare questa abilità",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la presentazione del rapporto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Già segnalato",
        description: "Hai già segnalato questa abilità",
      },
    },
    success: {
      title: "Relazione inserita",
      description: "Grazie per aver aiutato a mantenere la comunità al sicuro",
    },
    response: {
      reported: { content: "Relazione" },
      reportCount: { content: "Relazione" },
    },
    backButton: {
      label: "Indietro",
    },
    button: {
      submit: "Invia la relazione",
      loading: "Invio in corso...",
    },
  },
};

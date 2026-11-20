import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  enums: {
    skillStatus: {
      draft: "Progetto",
      published: "Pubblicato",
      unlisted: "Non elencato",
    },
  },
  patch: {
    title: "Pubblicare le competenze",
    titleShort: "Pubblicare le competenze",
    description:
      "Pubblicare o divulgare un'abilità personalizzata. PUBLISHED lo rende visibile nel negozio della comunità.",
    dynamicTitle: "Pubblicazione: {{name}}",
    status: {
      label: "Stato",
      description:
        "Impostare a PUBLISHED per rendere visibile nel negozio, DRAFT da nascondere, UNLISTED per l'accesso solo link.",
    },
    changeNote: {
      label: "Nota di modifica",
      description:
        "Nota facoltativa che descrive ciò che è cambiato in questa versione.",
      placeholder:
        "ad esempio. Miglioramento della chiarezza del prompt dei sistemi",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per pubblicare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Puoi solo pubblicare le tue competenze",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante la pubblicazione",
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
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Skill Pubblicato",
      description:
        "La vostra abilità è ora visibile nel negozio della comunità",
    },
    response: {
      status: { content: "Stato" },
      publishedAt: { content: "Pubblicato in" },
    },
    backButton: {
      label: "Indietro",
    },
    button: {
      submit: "Salvare lo stato",
      loading: "Salvare...",
    },
  },
};

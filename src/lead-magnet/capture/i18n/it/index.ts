import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Iscriviti &amp; Ottieni l'accesso",
    titleShort: "Iscriviti",
    description:
      "Inserisci i tuoi dati per unire la lista del creatore e ottenere l'accesso a questa abilità",
    groups: {
      main: {
        title: "Accesso",
        description: "Inserisci i tuoi dati qui sotto",
      },
    },
    fields: {
      skillId: {
        label: "Skill",
        description: "L'abilità che stai sottoscrivendo da",
      },
      firstName: {
        label: "Nome",
        description: "Il tuo nome",
        placeholder: "ad es. Alex:",
      },
      email: {
        label: "Indirizzo email",
        description: "Il tuo indirizzo email",
        placeholder: "you@example.com",
      },
    },
    response: {
      captured: "Iscritto",
      nextStep: "Prossimo passo",
      signupUrl: "Registrazione URL",
    },
    success: {
      title: "Ci sei!",
      description:
        "Controlla la tua casella di posta - e iscriviti per iniziare a utilizzare l'abilità",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Non trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Modifiche non salvate",
      },
      internal: {
        title: "Errore del server",
        description: "Si è verificato un errore interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
  },
  form: {
    signUp: "Crea un account",
    headline: "Rimani in loop",
    namePlaceholder: "Il tuo nome",
    emailPlaceholder: "La tua email",
    send: "Iscriviti",
    sending: "...",
    doneHeading: "Fatto.",
    doneSub: "Sei sulla lista.",
    finePrint:
      "Niente spam. Cancellare la sottoscrizione in qualsiasi momento.",
    error: "C'e' qualcosa che non va. Riprova.",
  },
};

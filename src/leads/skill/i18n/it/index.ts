import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tags: {
    leads: "Contatti",
    skill: "Skill",
  },

  patch: {
    title: "Set Lead Skill",
    titleShort: "Abilità di contatto",
    description:
      "Registrare quale abilità ha portato questo vantaggio (attribuzione del primo tocco)",
    skillId: {
      label: "Competenza",
      description: "Scegli una competenza pubblicata dalla community.",
    },
    errors: {
      validation: {
        title: "Scegli una competenza",
        description: "Scegli una competenza pubblicata dalla community.",
      },
      network: {
        title: "Errore di rete",
        description:
          "Non è possibile raggiungere il server. Per favore, riprovate.",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per aggiornarlo.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo comando.",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Il contatto non è stato trovato.",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore interno. Per favore, riprovate.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore inaspettato.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti insoddisfatti.",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto.",
      },
    },
    success: {
      title: "Competenze attribuite",
      description: "L'abilità è stata registrata per questo vantaggio.",
    },
    skipped: {
      title: "Non registrato",
      description:
        "La prima competenza del visitatore resta registrata. Apri una nuova sessione per provarne un’altra.",
    },
    submit: "Attribuire abilità",
  },
};

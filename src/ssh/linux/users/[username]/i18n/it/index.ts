import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Solo la modalità locale",
    },
    cannotDeleteCurrentUser:
      "Non è possibile eliminare l'utente di processo corrente",
    cannotDeleteSystemUser:
      "Non è possibile eliminare gli utenti di sistema (uid < 1000)",
    userNotFound: "Utente non trovato",
  },

  delete: {
    review: "Controlla l’account locale nell’elenco degli utenti Linux.",
    title: "Eliminare l'utente Linux",
    titleShort: "Cancella l'utente",
    description: "Eliminare un account utente OS dall'host",
    fields: {
      removeHome: {
        label: "Rimuovere la Home Directory",
        description: "Anche eliminare la home directory dell'utente",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non è possibile eliminare gli utenti di sistema o l'utente di processo corrente",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscita a eliminare l'utente",
      },
      notFound: { title: "Non trovato", description: "Utente non trovato" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: { title: "Modifiche non salvate" },
      conflict: {
        title: "Conflitto",
        description: "L'utente non può essere cancellato",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      timeout: { title: "Timeout", description: "Richiesta tempo libero" },
    },
    response: {
      ok: { title: "OK" },
    },
    success: {
      title: "Utente cancellato",
      description: "account utente OS cancellato con successo",
    },
  },
};

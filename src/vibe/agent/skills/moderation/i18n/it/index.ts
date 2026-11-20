import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI Skills",
  tags: {
    moderation: "Moderazione",
  },
  get: {
    title: "Competenze segnalate",
    titleShort: "Moderazione",
    description:
      "Elenca le competenze con i rapporti, ordinati per numero di relazione",
    fields: {
      minReports: {
        label: "Rapporti min",
        description: "Conto di rapporto minimo per includere (default: 1)",
      },
      limit: {
        label: "Limite",
        description: "Numero massimo di competenze da restituire",
      },
      offset: {
        label: "Offset",
        description: "Numero di competenze da saltare per la paginazione",
      },
    },
    response: {
      skills: {
        id: { content: "ID della skill" },
        name: { content: "Nome" },
        ownerAuthorId: { content: "Proprietario ID" },
        status: { content: "Stato" },
        reportCount: { content: "Report" },
        voteCount: { content: "Votazioni" },
        trustLevel: { content: "Livello di fiducia" },
        publishedAt: { content: "Pubblicato in" },
        updatedAt: { content: "Aggiornato At" },
      },
      totalCount: { content: "Totale" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "La connessione non è riuscita",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessuna abilità trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non ha caricato le competenze segnalate",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: { title: "Conflitto", description: "I dati sono in conflitto" },
    },
    success: {
      title: "Competenze Caricate",
      description: "Abilità segnalate recuperate con successo",
    },
    empty: "Nessuna abilità segnalata - la comunità sembra sana!",
    action: {
      moderate: "Moderatore",
    },
    backButton: {
      label: "Indietro",
    },
  },
  patch: {
    title: "Abilità moderata",
    titleShort: "Abilità moderata",
    description: "Nascondere un'abilità segnalata o chiarirne i rapporti",
    fields: {
      id: {
        label: "ID della skill",
        description: "ID dell'abilità a moderare",
      },
      action: {
        label: "Azione",
        description:
          "nascondi = stato impostato a UNLISTED, chiaro = numero di report di reset a 0",
      },
    },
    response: {
      id: { content: "ID della skill" },
      status: { content: "Nuovo stato" },
      reportCount: { content: "Relazione" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "La connessione non è riuscita",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      server: {
        title: "Errore del server",
        description: "Non riuscita a moderare le abilità",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: { title: "Conflitto", description: "I dati sono in conflitto" },
    },
    success: {
      title: "Abilità moderata",
      description: "Azione applicata con successo",
    },
  },
};

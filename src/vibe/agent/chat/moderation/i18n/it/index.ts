import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderazione",
  },
  get: {
    title: "Contenuto segnalato",
    titleShort: "Queue di moderazione",
    description:
      "Posti segnalati e nascosti e discussioni condivise, la maggior parte urgente prima",
    fields: {
      minReports: {
        label: "Rapporti min",
        description: "Resoconti aperti minimi da includere (default: 1)",
      },
      limit: {
        label: "Limite",
        description: "Numero massimo di fili da restituire",
      },
      offset: {
        label: "Offset",
        description: "Numero di filetti da saltare per l'impaginazione",
      },
    },
    response: {
      threads: {
        id: { content: "File ID" },
        title: { content: "Titolo" },
        rootFolderId: { content: "Cartella" },
        authorId: { content: "Autore ID" },
        authorName: { content: "Autore" },
        authorBanned: { content: "Autore bandito" },
        moderationStatus: { content: "Stato" },
        reportCount: { content: "Report" },
        reasons: { content: "Motivi" },
        latestNote: { content: "Nota più recente" },
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
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non caricare la coda di moderazione",
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
      title: "Perdite di coda",
      description: "Contenuto segnalato recuperato con successo",
    },
    note: "“{{note}}”",
    empty: "Niente di segnalato. La comunità sembra sana.",
    status: {
      visible: "Visibile",
      underReview: "In rassegna",
      removed: "Rimozione",
      authorBanned: "Autore bandito",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illegittimo",
      abuse: "Abuso",
      csamFlag: "Sicurezza dei bambini",
      other: "Altro",
    },
    action: {
      dismiss: "Deliberazione",
      remove: "Rimuovi",
      banAuthor: "Rimuovere + divieto autore",
    },
    backButton: {
      label: "Indietro",
    },
  },
  patch: {
    title: "Contenuto moderato",
    titleShort: "Moderatore",
    description:
      "respingere i rapporti e ripristinare un thread, rimuoverlo o rimuoverlo e vietare il suo autore",
    fields: {
      id: {
        label: "File ID",
        description: "ID del filo da moderare",
      },
      action: {
        label: "Azione",
        description:
          "dismiss = ripristino e chiari rapporti, rimuovere = nascondere definitivamente, vietare = rimuovere e vietare l'autore",
      },
    },
    actions: {
      dismiss: "Resoconti di licenziamento (restore)",
      remove: "Rimuovere i contenuti",
      banAuthor: "Rimuovere e vietare l'autore",
    },
    response: {
      patchId: { content: "File ID" },
      patchStatus: { content: "Nuovo stato" },
      patchReportCount: { content: "Relazione" },
      authorBanned: { content: "Autore bandito" },
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
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a moderare il filo",
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
      noAuthor: {
        title: "Nessun autore registrato",
        description:
          "Questo thread è stato inviato da un ospite, quindi non c'è nessun account per vietare",
      },
    },
    success: {
      title: "Contenuto Moderato",
      description: "Azione applicata con successo",
    },
  },
};

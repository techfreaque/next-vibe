import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Lama della Newsletter",
    titleShort: "Blast",
    description:
      "Invia una newsletter unica per confermare solo gli opt-in. Gli spettacoli a secco per ogni locale. Invia subito una mail a questa newsletter, nient'altro.",
    container: {
      title: "Scomparto della newsletter",
      description: "Solo gli opt-in confermati. Conte, coda, manda.",
    },
    fields: {
      dryRun: {
        label: "Corsa a secco",
        description:
          "Contare il pubblico consentito per locale. Non scrive niente, non manda nulla.",
      },
      send: {
        label: "Invia ora",
        description:
          "Invia questa newsletter al pubblico autorizzato subito. Altre campagne in sospeso sono lasciate da sole.",
      },
    },
    response: {
      audience: "Condividi su Twitter",
      byLocale: "Recipienti per locale",
      scheduled: "Nuovamente intagliato",
      alreadyPending: "Già in coda",
      cancelled: "Annullato (senza consenso)",
      alreadySent: "Asciugato (già ottenuto)",
      duplicates: "Duplicate righe cancellate",
      errors: "Errori",
      sent: "Inviato",
      sendSkipped: "Sciolto invio (già ricevuto)",
      sendFailed: "Invia fallo",
    },
    success: {
      title: "Newsletter blast enqueued",
      description:
        "I destinatari del piacere sono in coda. Con Invia ora, sono spediti in questa corsa.",
    },
  },
  errors: {
    unauthorized: {
      title: "Non firmato",
      description: "Accedi per eseguire l'esplosione della newsletter.",
    },
    forbidden: {
      title: "Operazione non consentita",
      description:
        "Solo gli amministratori possono eseguire l'esplosione della newsletter.",
    },
    server: {
      title: "Qualcosa è andato storto",
      description:
        "L'esplosione della newsletter non poteva funzionare. Riprova.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore inaspettato.",
    },
    validation: {
      title: "Input non valido",
      description: "Controllare la richiesta e riprovare.",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "La risorsa richiesta non è stata trovata.",
    },
    conflict: {
      title: "Conflitto",
      description: "Questa azione contrasta con lo stato attuale.",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete. Riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai dei cambiamenti insoddisfatti.",
    },
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Consenso",
  },

  get: {
    title: "Consenso per i modelli senza censura",
    titleShort: "Consenso per l’uso senza censura",
    description:
      "Mostra se l’utente o l’ospite ha confermato di avere almeno 18 anni e di accettare risposte senza filtri. I modelli senza censura restano bloccati fino alla conferma.",
    response: {
      consented: "Confermato",
      consentedAt: "Data di conferma",
      version: "Versione del consenso",
    },
    success: {
      title: "Stato del consenso caricato",
      description: "Stato attuale del consenso per i modelli senza censura",
    },
  },

  post: {
    title: "Sblocca i modelli senza censura",
    titleShort: "Sblocca i modelli",
    description:
      "Conferma una sola volta che hai almeno 18 anni e accetti che i modelli senza censura possano produrre contenuti offensivi, falsi, pericolosi, illegali o dannosi senza applicare filtri. La conferma spetta alla persona, mai all’IA per suo conto.",
    fields: {
      confirm: {
        label: "Ho almeno 18 anni e accetto",
        description:
          "Imposta su true per confermare che hai almeno 18 anni, accetti risposte senza filtri e ti assumi la responsabilità di come le usi.",
      },
    },
    success: {
      title: "Modelli senza censura sbloccati",
      description: "Conferma salvata. Non te la chiederemo di nuovo.",
    },
  },

  delete: {
    title: "Revoca il consenso per i modelli senza censura",
    titleShort: "Revoca il consenso",
    description:
      "Revoca il consenso per i modelli senza censura. I modelli restano bloccati fino a quando non confermi di nuovo.",
    success: {
      title: "Consenso revocato",
      description: "I modelli senza censura sono di nuovo bloccati.",
    },
  },

  errors: {
    validation: {
      title: "Conferma mancante",
      description:
        "Per proseguire, conferma di avere almeno 18 anni e accetta le condizioni.",
    },
    unauthorized: {
      title: "Operazione non consentita",
      description: "Non puoi modificare questo consenso.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Questa azione non è disponibile qui.",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Nessun account o sessione ospite trovati.",
    },
    server: {
      title: "Errore del server",
      description: "Impossibile salvare la scelta. Riprova.",
    },
    network: {
      title: "Errore di rete",
      description: "Server irraggiungibile. Controlla la connessione.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa è andato storto. Riprova.",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Hai modificato il consenso in un’altra scheda. Ricarica la pagina.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Prima conferma o annulla.",
    },
    noIdentity:
      "Nessun account o sessione ospite. Ricarica la pagina e riprova.",
    saveFailed: "Impossibile salvare la scelta. Riprova.",
  },

  gate: {
    required:
      "{{model}} è senza censura. Conferma una sola volta che hai almeno 18 anni e accetti che i modelli senza censura possano produrre contenuti offensivi, falsi, pericolosi, illegali o dannosi senza filtri. La conferma spetta alla persona, in chat o tramite il comando: vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} è senza censura. L’account deve ancora confermare che l’utente ha almeno 18 anni e accetta risposte senza filtri. Seleziona la casella dei modelli senza censura nella pagina delle chiavi API e riprova.",
  },

  dialog: {
    eyebrow: "Modelli senza censura",
    title: "Solo per adulti. Senza filtri.",
    stance:
      "Decidi tu cosa leggere. Per questo ti chiediamo di confermare una sola volta e ti mostriamo tutte le risposte senza filtri.",
    modelLine: "Questa chat usa {{model}}.",
    pointAge: "Ho almeno 18 anni.",
    pointContent:
      "I modelli senza censura possono produrre contenuti offensivi, falsi, pericolosi, illegali o dannosi.",
    pointNoFilter:
      "Le risposte arrivano senza filtri, né del modello né della piattaforma.",
    pointResponsible: "Mi assumo la responsabilità di come uso le risposte.",
    agree: "Ho almeno 18 anni e accetto",
    agreeing: "Salvataggio…",
    pickAnother: "Scegli un altro modello",
    close: "Chiudi",
    footnote:
      "Ti chiediamo la conferma una volta sola. Puoi revocarla dalle impostazioni quando vuoi.",
    saveFailed: "Impossibile salvare. Riprova.",
  },

  widget: {
    title: "Modelli senza censura",
    statusOn: "Sbloccati",
    statusOff: "Bloccati",
    since: "Confermato il {{date}}",
    onBody:
      "Hai confermato di avere almeno 18 anni e di accettare risposte senza filtri. I modelli senza censura rispondono senza applicare filtri.",
    offBody:
      "Per sbloccare i modelli senza censura, conferma di avere almeno 18 anni e accetta le risposte senza filtri.",
    outdatedBody:
      "Il testo del consenso è cambiato. Conferma di nuovo per continuare a usare i modelli senza censura.",
    withdraw: "Revoca il consenso",
    withdrawing: "Revoca in corso…",
    unlock: "Sblocca i modelli senza censura",
    guestNote:
      "Salviamo la scelta in questo browser. Se ti registri, la associamo al tuo account.",
    loading: "Caricamento del consenso…",
    back: "Indietro",
    menuLabel: "Modelli senza censura",
    menuOn: "Attivi",
    menuOff: "Disattivati",
  },
};

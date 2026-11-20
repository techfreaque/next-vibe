import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profilo utente",
  title: "Autenticazione a due fattori",
  titleShort: "Due fattori",
  description:
    "Proteggi il tuo account con un codice una volta da un'applicazione autentica. Impostare, disattivare o rigenerare i codici di recupero.",
  tag: "due fattori",
  enums: {
    action: {
      status: "Stato",
      setup: "Avviare la configurazione",
      enable: "Conferma e abilita",
      disable: "Disattivare",
      regenerate: "Rigenerare i codici di recupero",
    },
  },
  fields: {
    action: {
      label: "Azione",
      description:
        "stato, configurazione, abilitare, disabilitare o rigenerare. Impostazione restituisce un segreto, quindi abilitare lo conferma con un codice.",
    },
    code: {
      label: "Codice di autenticazione",
      description:
        "Codice a 6 cifre dalla tua app di autenticatore, o un codice di recupero.",
      placeholder: "123456",
    },
    password: {
      label: "Password",
      description:
        "La password del tuo account (in alternativa a un codice per disabilitare).",
      placeholder: "La tua password",
    },
  },
  response: {
    enabled: "abilitato a due fattori",
    message: "Stato",
    recoveryCodesRemaining: "Codici di recupero sinistra",
    otpauthUri: "Autentico URI",
    secret: "Chiave segreta",
    qrDataUri: "Codice QR",
    recoveryCodes: "Codici di recupero",
  },
  widget: {
    back: "Indietro",
    statusOn: "Attivi",
    statusOff: "Disattivati",
    offIntro:
      "Aggiungi un secondo passo per iscriverti. Anche con la tua password, nessuno entra senza il codice dal tuo telefono.",
    startSetup: "Impostare due fattori",
    setupStep1:
      "1. Scansiona questo codice QR con un'app autenticatrice (Autenticatore Google, Aegis, 1Password, Authy).",
    setupStep2: "Non puoi scansionare? Inserisci questa chiave manualmente:",
    setupStep3:
      "2. Inserisci il codice a 6 cifre che l'app mostra per confermare.",
    confirm: "Confermare e accendere",
    confirming: "Conferma in corso…",
    cancelSetup: "Annulla",
    onIntro:
      "L'iscrizione richiede un codice dalla tua app di autenticatore. Codici di recupero a sinistra: {{count}}.",
    recoveryTitle: "Salvare i codici di recupero",
    recoveryHint:
      "Ogni codice funziona una volta se si perde il telefono. Sono mostrati solo ora. Conservali in un posto sicuro.",
    recoveryCopy: "Codici di copia",
    recoveryCopied: "Affrontato",
    recoveryDone: "Li ho salvati.",
    manageTitle: "Gestisci",
    manageHint:
      "Inserisci un codice autenticatore corrente (o un codice di recupero) per modificare le impostazioni.",
    regenerate: "Rigenerare i codici di recupero",
    disable: "Spegnere due fattori",
    disablePasswordHint: "O confermare con la password invece:",
    working: "Lavorare...",
  },
  errors: {
    notConfigured:
      "Due fattori hanno bisogno di una chiave del server (JWT_SECRET_KEY) e non è impostato.",
    alreadyEnabled:
      "Due fattori sono già abilitati. Disattivare prima di eseguire la configurazione.",
    notEnabled: "Due fattori non sono abilitati.",
    noPendingSetup: "Nessun setup in corso. Iniziare la configurazione prima.",
    codeRequired: "Inserisci il codice a 6 cifre.",
    invalidCode:
      "Quel codice non e' valido. Controllare l'ora sul telefono e riprovare.",
    credentialRequired:
      "Inserisci un codice corrente, un codice di recupero o la tua password.",
    invalidPassword: "Password errata.",
    tooManyAttempts:
      "Troppi tentativi sbagliati. Aspettate un paio di minuti e riprovate.",
    userNotFound: "Account non trovato.",
    failed: "Non è possibile aggiornare le impostazioni di due fattori.",
    validation: {
      title: "Errore di convalida",
      description: "Controlla il tuo input e riprova",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere connesso per gestire due fattori",
    },
    server: {
      title: "Errore del server",
      description: "Due fattori non potrebbero essere aggiornati",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    network: {
      title: "Errore di rete",
      description: "Collegamento di rete fallito",
    },
    forbidden: {
      title: "Accesso non consentito",
      description: "Non hai il permesso di farlo.",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "L'account non è stato trovato",
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
    title: "Aggiornato a due fattori",
    description: "Le tue impostazioni di due fattori sono state salvate",
    status: "Caricato lo stato di due fattori.",
    setupStarted:
      "Scansiona il codice QR, quindi confermi con un codice per accenderlo.",
    enabled:
      "Due fattori sono a posto. Salva i tuoi codici di recupero ora - sono mostrati solo una volta.",
    disabled: "Due fattori sono spenti.",
    regenerated:
      "Nuovi codici di recupero generati. I vecchi non funzionano più.",
  },
};

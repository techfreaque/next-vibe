import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Inviti",
  tags: {
    referral: "rinvio",
    admin: "admin",
  },
  post: {
    title: "Codice di riferimento",
    titleShort: "Codice di riassegnazione",
    description:
      "Spostare un codice di riferimento in un altro account. Gli utenti che ha già riferito soggiorno attribuito al codice, così la loro futura commissione va al nuovo proprietario. I guadagni passati rimangono con chi li ha guadagnati. Eseguire a secco per impostazione predefinita.",
    fields: {
      code: {
        label: "Codice invito",
        description: "Il codice esatto per spostare",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Nuovo proprietario",
        description: "Utente ID o e-mail dell'account che ottiene il codice",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Corsa a secco",
        description: "Anteprima la mossa senza cambiare nulla",
      },
    },
    response: {
      dryRun: "Corsa a secco",
      code: "Codice",
      fromUserId: "Precedente proprietario ID",
      fromEmail: "Precedente proprietario",
      toUserId: "Nuovo proprietario ID",
      toEmail: "Nuovo proprietario",
      referralsMoved: "Gli utenti referenziati si sono spostati",
      selfReferralsKept: "Autoriferi custoditi con precedente proprietario",
      linksMoved: "I link tracciati si spostano",
      linksTotal: "Link campagna utilizzando il codice",
    },
    widget: {
      back: "Indietro",
      hint: "La Commissione segue il proprietario del codice. Eseguire una corsa a secco prima, quindi spegnere per spostare il codice.",
      submit: "Codice di riassegnazione",
      preview: "Corsa asciutta. Non e' cambiato niente.",
      done: "Il codice si e' mosso.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Codice di riferimento {{code}} spostato da {{from}} a {{to}} da {{admin}} a {{at}}. Gli utenti differiti si sono spostati: {{referrals}}. Tracciati link spostati: {{links}}. I guadagni passati invariati.",
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controlla il codice e il nuovo proprietario",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Iscriviti come amministratore per riassegnare i codici",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Solo gli amministratori possono riassegnare i codici di riferimento",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Codice o utente non esiste",
    },
    conflict: {
      title: "Conflitto",
      description: "Il nuovo proprietario possiede già questo codice",
    },
    server: {
      title: "Errore del server",
      description: "Non poteva riassegnare il codice",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
    codeNotFound: "Codice di riferimento {{code}} non esiste",
    userNotFound: "Nessun utente corrisponde a {{target}}",
    alreadyOwner: "{{target}} possiede già il codice di riferimento {{code}}",
  },
  success: {
    title: "Fatto",
    description: "Codice di riferimento riassegnato",
  },
};

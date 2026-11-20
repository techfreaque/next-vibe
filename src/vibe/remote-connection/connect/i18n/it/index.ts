import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  widget: {
    signInDescription: "Accedi per connetterti a un account remoto.",
    adminOnlyDescription:
      "La creazione di connessioni in uscita richiede l'accesso dell'amministratore. Se sei stato collegato da un'istanza remota, le tue connessioni sono visibili sopra.",
    benefit1:
      "Le memorie si sincronizzano automaticamente - tutto quello che insegni lo AI qui porta avanti",
    benefit2:
      "Accedi ai modelli e agli strumenti cloud AI della tua istanza locale",
    benefit3: "Context viaggia con voi attraverso i dispositivi",
    adminBenefit1: "Le memorie si sincronizzano bidirezionale, automaticamente",
    adminBenefit2:
      "Cloud AI scopre ed esegue gli strumenti locali (SSH, file, esecuzione del codice)",
    adminBenefit3:
      "Eliminare le attività dal cloud a questa macchina - Claude Code esegue localmente",
    adminBenefit4:
      "Istantanee di capacità inviate ogni sincronizzazione - Thea sa sempre cosa può fare questa istanza",
  },
  post: {
    title: "Collegamento a Account remoto",
    titleShort: "Collegamento remoto",
    description:
      "Collega il tuo account a un'istanza remota per sincronizzare i ricordi e utilizzare gli strumenti AI da qualsiasi luogo",
    remoteUrl: {
      label: "URL remoto",
      description:
        "L'indirizzo web del tuo account remoto (ad esempio https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Inserisci il telecomando URL",
        invalid:
          "Si prega di inserire un URL valido (ad esempio https://unbottled.ai)",
      },
    },
    email: {
      label: "Email",
      description: "Il tuo indirizzo email sull'istanza remota",
      placeholder: "you@example.com",
      validation: {
        required: "Inserisci la tua email",
        invalid: "Si prega di inserire un indirizzo email valido",
      },
    },
    password: {
      label: "Password",
      description: "La tua password sull'istanza remota",
      placeholder: "••••••••",
      validation: {
        required: "Inserisci la tua password",
      },
    },
    token: {
      label: "Token",
      description: "Token JWT dall'istanza remota (imposta automaticamente)",
      validation: {
        required: "Accedi prima all'istanza remota",
      },
    },
    leadId: {
      label: "ID del contatto",
      description: "Guidare ID dall'istanza remota (impostare automaticamente)",
    },
    isInferenceProvider: {
      label: "Utilizzare come provider di inferenza",
      description:
        "Lasci questa connessione eseguire flussi AI. l'istanza remota gestisce il loop AI sul canale WS inverso.",
    },
    syncScope: {
      label: "Sync Scope",
      description: "Quali dati si sincronizzano su questa connessione.",
    },
    credentialWarning:
      "Le tue credenziali vanno direttamente dal tuo browser al server remoto. Tuttavia, il gettone memorizzato qui garantisce all'operatore di questo server l'accesso completo al tuo account remoto - possono fare tutto quello che puoi fare lì. Connettiti solo su server di cui ti fidi completamente.",
    actions: {
      submit: "Collegamento",
      submitting: "Collegamento...",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare i dettagli e riprovare",
      },
      network: {
        title: "Connessione non riuscita",
        description:
          "Non è possibile raggiungere il server remoto. Controlla lo URL e riprova",
      },
      unauthorized: {
        title: "Accesso non riuscito",
        description: "E-mail o password non corretti per l'account remoto",
      },
      forbidden: {
        title: "Connessione remota non accettata",
        description:
          "Il server remoto non è configurato per accettare le connessioni in arrivo. Assicurati di connetterti a un'istanza cloud (ad esempio unbottled.ai), non a un'altra installazione locale.",
      },
      notFound: {
        title: "Non trovato",
        description: "Non è possibile trovare il server remoto in quella URL",
      },
      server: {
        title: "Errore del server remoto",
        description: "Il server remoto ha riscontrato un errore",
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
        title: "Già collegato",
        description:
          "Sei già connesso a un'istanza remota con questa istanza ID",
      },
      instanceIdConflict: {
        title: "istanza ID Già registrato",
        description:
          "Un'istanza con questo ID è già registrata sul telecomando. Scegliere un'istanza diversa ID.",
      },
      noLeadId: {
        title: "Errore di connessione",
        description:
          "Non è possibile stabilire una sessione con il server remoto",
      },
      invalidUrl: {
        title: "Invalid Remote URL",
        description:
          "Il telecomando URL deve indicare un server pubblico, non un indirizzo locale o privato",
      },
    },
    success: {
      title: "Connesso!",
      description: "Il tuo account è ora collegato all'istanza remota",
    },
  },
};

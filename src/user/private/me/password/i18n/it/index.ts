import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profilo utente",

  title: "Cambia password",
  titleShort: "Cambia password",
  description: "Confermare la password corrente, quindi impostare una nuova.",
  tag: "password-cambio",
  debug: {
    updatingPassword: "Aggiornamento della password",
    errorUpdatingPassword: "Aggiornamento di errore password",
    settingPassword: "Impostazione della password",
    errorSettingPassword: "Impostazione di errore password",
  },
  groups: {
    currentCredentials: {
      title: "Password corrente",
      description: "Verificare la password corrente per procedere",
    },
    newCredentials: {
      title: "Nuova password",
      description: "Scegli una nuova password forte per il tuo account",
    },
  },
  currentPassword: {
    label: "La password attuale",
    description: "Inserisci la password corrente",
    placeholder: "La tua password attuale",
    help: "Inserisci la password corrente per verificare la tua identità prima di cambiarla",
  },
  newPassword: {
    label: "Nuova password",
    description: "Almeno 8 caratteri.",
    placeholder: "Almeno 8 caratteri",
    help: "Scegliere una password forte con almeno 8 caratteri tra cui lettere, numeri e simboli",
  },
  confirmPassword: {
    label: "Ripetere la nuova password",
    description: "Conferma la tua nuova password",
    placeholder: "Digita di nuovo",
    help: "Reinserire la nuova password per assicurarsi che sia stata digitata correttamente",
  },
  twoFactorCode: {
    label: "Codice a due fattori",
    description:
      "Inserisci il codice di autenticazione a due fattori se abilitato",
    placeholder: "Inserisci il codice 2FA",
  },
  response: {
    title: "Cambiamento di password",
    description: "Risposta per l'operazione di cambiamento password",
    success: "Password modificata",
    message: "Messaggio di stato",
    securityTip: "Suggerimento di sicurezza",
    nextSteps: {
      item: "Prossimo passo",
    },
  },
  validation: {
    currentPassword: {
      minLength: "La password attuale deve essere almeno 8 caratteri",
    },
    newPassword: {
      minLength: "La nuova password deve essere di almeno 8 caratteri",
    },
    confirmPassword: {
      minLength: "La conferma della password deve essere almeno 8 caratteri",
    },
    passwords: {
      mismatch: "Le password non coincidono",
    },
  },
  errors: {
    passwords_do_not_match: "Le password non coincidono",
    user_not_found: "Utente {{userId}} non trovato",
    incorrect_password: "password non corretta",
    update_failed: "Non è stato possibile aggiornare la password",
    token_creation_failed: "Non è riuscito a creare password token",
    two_factor_code_required:
      "Richiesto il codice di autenticazione a due fattori",
    invalid_two_factor_code:
      "Codice di autenticazione a due fattori non valido",
    invalid_request: {
      title: "Richiesta non valida",
      description: "La richiesta di modifica della password è invalida",
    },
    validation: {
      title: "Errore di convalida",
      description: "Si prega di controllare il vostro input e riprovare",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere connesso per cambiare la tua password",
    },
    server: {
      title: "Errore del server",
      description:
        "Non è stato possibile aggiornare la password a causa dell'errore del server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description:
        "Un errore inaspettato si è verificato durante l'aggiornamento della password",
    },
    network: {
      title: "Errore di rete",
      description: "Collegamento di rete fallito",
    },
    forbidden: {
      title: "Accesso Proibito",
      description: "Non hai il permesso di eseguire questa azione",
    },
    notFound: {
      title: "Utente non trovato",
      description: "L'account utente non potrebbe essere trovato",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai dei cambiamenti non salvati che saranno persi",
    },
    conflict: {
      title: "Conflitto dei dati",
      description:
        "Si è verificato un conflitto durante l'aggiornamento della password",
    },
  },
  success: {
    updated: "Password aggiornata con successo",
    securityTip:
      "Per una maggiore sicurezza, abilitare l'autenticazione a due fattori",
    nextSteps: {
      logoutOther:
        "Ogni altra sessione è firmata. Usa la nuova password la prossima volta.",
      enable2fa:
        "Considerare l'attivazione dell'autenticazione a due fattori per una migliore sicurezza",
    },
    title: "Password aggiornata",
    description: "La tua password è stata aggiornata con successo",
  },
  update: {
    success: {
      title: "Aggiornamento password",
      description: "La tua password è stata aggiornata con successo",
    },
    errors: {
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante l'aggiornamento della password",
      },
    },
  },
  widget: {
    back: "Indietro",
    submit: "Aggiorna la password",
    submitting: "Aggiornamento...",
  },
};

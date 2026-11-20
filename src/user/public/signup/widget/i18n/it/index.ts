import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "Robustezza della password",
    weak: "Debole",
    fair: "Discreta",
    good: "Buona",
    strong: "Forte",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Almeno 8 caratteri",
      },
      uppercase: {
        icon: "✗",
        text: "Almeno una lettera maiuscola",
      },
      lowercase: {
        icon: "✗",
        text: "Almeno una lettera minuscola",
      },
      number: {
        icon: "✗",
        text: "Almeno un numero",
      },
      special: {
        icon: "!",
        text: "Carattere speciale (opzionale, migliora la forza)",
      },
    },
  },
  post: {
    title: "_componenti",
    description: "_componenti endpoint",
    form: {
      title: "Configurazione _components",
      description: "Configurare _parametri dei componenti",
    },
    response: {
      title: "Risposta",
      description: "_componenti dati di risposta",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};

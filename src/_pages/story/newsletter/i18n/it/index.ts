import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Inserisci la tua email",
  page: {
    eyebrow: "La newsletter di {{appName}}",
    title: "Una e-mail al mese. Solo quello che è cambiato.",
    description:
      "Nuovi modelli, nuove funzionalità, suggerimenti che funzionano - mensile.",
    subtitle: "Nuovi modelli, nuove funzionalità, richieste che funzionano.",
    heroDescription:
      "Nuovi modelli il giorno in cui atterrano, caratteristiche che vale la pena conoscere, configurazioni che effettivamente ottenere risultati. Una volta al mese. Cancellare l'iscrizione in un clic.",
    invalidEmail: {
      title: "E-mail non valida",
      description: "Quell'indirizzo non sembra giusto. Controllalo e riprova.",
    },
    emailProvided: {
      title: "Gestisci l'abbonamento",
      description:
        "Modificare le impostazioni della newsletter o annullare l'iscrizione in qualsiasi momento.",
    },
    unsubscribeText: "Vuoi uscire?",
    unsubscribeLink: "Cancellare qui",
    privacyNote: "Niente spam. Non condividere il tuo indirizzo. Mai.",
    cta: {
      title: "Prendi il prossimo numero.",
      description: "Una e-mail al mese. Riempitore zero.",
      subscribeButton: "Iscriviti",
    },
    benefits: {
      title: "Cosa atterra nella tua casella di posta",
      subtitle: "Quattro cose. Nient'altro.",
      benefit1: {
        title: "Nuovi modelli, primi",
        description:
          "Ogni modello che aggiungiamo - cosa è buono a, che cosa costa, quando sceglierlo.",
      },
      benefit2: {
        title: "Caratteristiche che hanno spedito",
        description: "Quello che è cambiato, perché importa, come usarlo oggi.",
      },
      benefit3: {
        title: "Prompti che funzionano",
        description:
          "Reali configurazioni e competenze che ottengono risultati - copiare, tweak, nave.",
      },
      benefit4: {
        title: "Offerte solo per gli iscritti",
        description: "Sconti e accesso anticipato prima di chiunque altro.",
      },
    },
    frequency: {
      title: "Mensile. Ecco.",
      description:
        "Una e-mail al mese. Cancellare ogni volta - un clic, nessuna domanda.",
    },
  },
  subscription: {
    unsubscribe: {
      title: "Disiscriviti",
      confirmButton: "Conferma la disiscrizione",
      success: "Iscrizione annullata",
      error: "Impossibile annullare l’iscrizione",
    },
  },
  unsubscribe: {
    page: {
      title: "Disiscrizione alla newsletter",
      description: "Ci dispiace vederti andare.",
      subtitle: "Gestisci l’iscrizione alla newsletter",
      emailProvided: {
        title: "Conferma la disiscrizione",
        description: "Sei sicuro di voler cancellare la nostra newsletter?",
      },
      unsubscribeButton: "Disiscriviti",
      subscribeText: "Hai cambiato idea?",
      subscribeLink: "Iscriviti di nuovo",
      info: {
        title: "Che cosa succede",
        description: "Ecco quello che devi sapere su disiscrizione:",
        immediate: {
          title: "Effetto immediato",
          description:
            "Non riceverai più le email della newsletter, da subito.",
        },
        resubscribe: {
          title: "Facile da sottoscrivere",
          description: "Se cambi idea, puoi sempre iscriverti di nuovo.",
        },
      },
      alternatives: {
        title: "Prima di andare",
        description: "Considerate queste alternative:",
        subscribe: "Regolare la frequenza e-mail invece",
        contact: "Contattaci con il feedback",
      },
    },
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Invio IndexNow",
    titleShort: "IndexNow",
    description:
      "Segnala a Bing, Yandex, Seznam, Naver e Yep ogni URL nuovo o modificato della sitemap. Solo in produzione, salta gli URL già inviati.",
    tag: "SEO",
    container: {
      title: "Esecuzione IndexNow",
      description: "Cosa è stato inviato ai motori di ricerca",
    },
    fields: {
      force: {
        label: "Reinvia tutto",
        description:
          "Invia di nuovo ogni URL della sitemap, non solo quelli nuovi o modificati.",
      },
      dryRun: {
        label: "Prova",
        description: "Conta gli URL in attesa senza inviarli.",
      },
    },
    response: {
      status: "Stato",
      host: "Host",
      totalUrls: "URL della sitemap",
      pendingUrls: "URL in attesa",
      submittedUrls: "URL inviati",
      requests: "Richieste inviate",
    },
    errors: {
      unauthorized: {
        title: "Accesso richiesto",
        description: "Accedi come admin per inviare URL.",
      },
      forbidden: {
        title: "Solo admin",
        description: "Solo gli admin possono inviare URL a IndexNow.",
      },
      server: {
        title: "Invio non riuscito",
        description:
          "IndexNow ha rifiutato l'invio o la sitemap non è stata generata. Controlla il log del server.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "Qualcosa è andato storto durante l'invio degli URL.",
      },
      validation: {
        title: "Dati non validi",
        description: "Controlla le opzioni.",
      },
      network: {
        title: "IndexNow non raggiungibile",
        description:
          "L'API IndexNow non ha risposto. La prossima esecuzione reinvia gli URL in attesa.",
      },
    },
    success: { title: "Fatto", description: "Esecuzione IndexNow completata." },
  },
  enums: {
    status: {
      submitted: "Inviato",
      unchanged: "Niente di nuovo",
      dryRun: "Prova",
      notProduction: "Saltato (non produzione)",
    },
  },
  task: {
    description:
      "Ogni ora: invia a IndexNow gli URL nuovi o modificati della sitemap (Bing, Yandex e partner).",
  },
};

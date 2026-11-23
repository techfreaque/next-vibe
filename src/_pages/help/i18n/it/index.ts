import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Home",
  },
  breadcrumb: "Aiuto",
  meta: {
    contact: {
      title: "Centro assistenza: FAQ, guide e supporto | {{appName}}",
      description:
        "Risposte su crediti, pagamenti, privacy, modelli senza censura e accesso API. Guide per ogni parte di {{appName}}, più supporto diretto via e-mail e Discord.",
      category: "Supporto",
      imageAlt: "Centro assistenza {{appName}}",
      keywords:
        "aiuto {{appName}}, FAQ {{appName}}, supporto chat AI, aiuto AI senza censura, crediti AI, accesso API AI",
      ogTitle: "Centro assistenza {{appName}}",
      ogDescription:
        "Crediti, pagamenti, privacy, modelli senza censura e accesso API: tutte le risposte.",
      twitterTitle: "Centro assistenza {{appName}}",
      twitterDescription: "Risposte, guide e supporto diretto.",
    },
  },
  pages: {
    help: {
      title: "Come possiamo aiutarti?",
      subtitle:
        "Prima le risposte rapide. Le guide per approfondire. Una persona quando serve.",
      topics: {
        title: "Trova la tua strada",
        models: {
          title: "Modelli",
          body: "Confronta {{modelCount}} modelli di chat per prezzo, contesto e livello di censura.",
        },
        uncensored: {
          title: "Chat AI senza censura",
          body: "Quali modelli rispondono senza i filtri dei grandi provider e come iniziare.",
        },
        skills: {
          title: "Skill",
          body: "Specialisti e personaggi pronti all'uso. Oppure crea la tua.",
        },
        studio: {
          title: "Media Studio",
          body: "Immagini, video, musica, voce e trascrizione in un unico posto.",
        },
        pricing: {
          title: "Piani e crediti",
          body: "Cosa include un piano, come funzionano i crediti e come ricaricare.",
        },
        api: {
          title: "Documentazione API",
          body: "Endpoint compatibili con OpenAI e Anthropic, con esempi da copiare.",
        },
        selfHost: {
          title: "Self-hosting",
          body: "Gestisci la tua istanza a partire dal codice open source.",
        },
      },
      info: {
        title: "Ancora bloccato? Scrivici",
        intro:
          "Invia un messaggio qui sotto o contattaci direttamente. Leggiamo ogni richiesta.",
        supportEmail: "E-mail di supporto",
        discord: "Discord",
        discordUrl: "Unisciti alla nostra community Discord",
      },
      guides: {
        title: "Guide più lette",
      },
      faq: {
        title: "Domande frequenti",
        more: "Scopri di più",
        questions: {
          q1: {
            question: "Che cos'è {{appName}}?",
            answer:
              "{{appName}} è una piattaforma di chat AI con {{modelCount}} modelli: mainstream, aperti e senza censura. Scegli tu il modello e con esso quanto filtro vuoi. In più skill, cartelle, generazione di media e un'API.",
          },
          q2: {
            question: "Quali metodi di pagamento accettate?",
            answer:
              "Carta, PayPal, Apple Pay e Google Pay tramite Stripe. Criptovalute (Bitcoin, Ethereum e stablecoin) tramite NOWPayments. I piani partono da {{subscriptionPrice}} al mese. Con un abbonamento puoi ricaricare con pacchetti di crediti.",
          },
          q3: {
            question: "Come funziona il sistema di crediti?",
            answer:
              "Ogni utilizzo consuma crediti. Puoi iniziare con quelli gratuiti. Crediti mensili per piano: {{subscriptionPrice}} per {{subscriptionCredits}}, {{plusPrice}} per {{plusCredits}}, {{proPrice}} per {{proCredits}}, {{ultraPrice}} per {{ultraCredits}}. Se hai un abbonamento, puoi ricaricare con pacchetti da {{packPrice}} per {{packCredits}} crediti. I crediti dei pacchetti non scadono e valgono per tutti i {{modelCount}} modelli IA.",
          },
          q4: {
            question: "I miei dati sono privati e al sicuro?",
            answer:
              "Le cartelle private le vedi solo tu. La modalità incognito tiene la cronologia delle chat fuori dai nostri server, ma i file multimediali generati vengono comunque salvati lì. Dalle impostazioni puoi esportare tutti i tuoi dati o eliminare l'account e i dati personali collegati. Non vendiamo mai i tuoi dati.",
          },
          q5: {
            question: "Posso provarlo senza account?",
            answer:
              "Sì. Gli ospiti ricevono fino a {{freeCreditsGuest}} crediti gratuiti al mese. Con un account gratuito e verificato salgono a {{freeCreditsSignedIn}}, con l'iscrizione confermata alla newsletter a {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "Che differenza c'è tra modelli abliterati e senza censura?",
            answer:
              "I modelli abliterati sono modelli mainstream a cui è stato tolto il riflesso del rifiuto: rispondono invece di sviare. Uncensored LM è diverso: è addestrato su libri e documenti banditi dall'internet mainstream, e ne risulta un modello con opinioni politiche controcorrente.",
          },
          q7: {
            question: "Come ottengo l'accesso all'API?",
            answer:
              "Le chiavi API si sbloccano con il primo acquisto, un piano o un pacchetto di crediti. I crediti gratuiti non sbloccano l'API. Poi crei una chiave nel tuo account e punti qualsiasi client OpenAI o Anthropic al nostro URL di base.",
          },
          q8: {
            question: "Posso eseguire {{appName}} sul mio server?",
            answer:
              "Sì. Il codice è open source. Clona il repository, esegui bun i e vibe dev, poi completa la configurazione nel browser. Puoi collegare la tua istanza al tuo account {{appName}}.",
          },
        },
      },
    },
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Home",
  },
  meta: {
    contact: {
      title: "Contatto & Supporto - {{appName}}",
      description:
        "Ottieni aiuto con {{appName}} - piattaforma di chat AI non autorizzata. Contatta il nostro team di supporto per l'assistenza.",
      category: "Support",
      imageAlt: "Supporto {{appName}}",
      keywords: "contatto, supporto, aiuto, {{appName}}, chat, assistenza",
      ogTitle: "Contatta il supporto {{appName}}",
      ogDescription:
        "Ottieni aiuto con la tua esperienza di chat AI non censurata",
      twitterTitle: "Contatto {{appName}}",
      twitterDescription: "Raggiungere il nostro team di supporto",
    },
  },
  pages: {
    help: {
      title: "Come possiamo aiutarla?",
      subtitle:
        "Ricevi il supporto per la tua esperienza di chat AI non censurata o trova risposte a domande comuni",
      info: {
        title: "Informazioni di contatto",
        supportEmail: "Supporto Email",
        discord: "Discord",
        discordUrl: "Unisciti alla nostra comunità Discord",
      },
      faq: {
        title: "Domande frequenti",
        questions: {
          q1: {
            question: "Cos'è {{appName}}?",
            answer:
              "{{appName}} è una piattaforma di chat AI non censurata con accesso ai modelli {{modelCount}} AI. Uniamo conversazioni oneste AI con funzionalità avanzate come la gestione delle cartelle, i caratteri personalizzati e il supporto multi-model.",
          },
          q2: {
            question: "Quali metodi di pagamento accetti?",
            answer:
              "Carta, PayPal, Apple Pay e Google Pay tramite Stripe. Criptovalute (Bitcoin, Ethereum e stablecoin) tramite NOWPayments. I piani partono da {{subscriptionPrice}} al mese. Con un abbonamento puoi ricaricare con pacchetti di crediti.",
          },
          q3: {
            question: "Come funziona il sistema di credito?",
            answer:
              "Ogni utilizzo consuma crediti. Puoi iniziare con quelli gratuiti. Crediti mensili per piano: {{subscriptionPrice}} per {{subscriptionCredits}}, {{plusPrice}} per {{plusCredits}}, {{proPrice}} per {{proCredits}}, {{ultraPrice}} per {{ultraCredits}}. Se hai un abbonamento, puoi ricaricare con pacchetti da {{packPrice}} per {{packCredits}} crediti. I crediti dei pacchetti non scadono e valgono per tutti i {{modelCount}} modelli IA.",
          },
          q4: {
            question: "I miei dati sono privati e sicuri?",
            answer:
              "Si'! Le cartelle private sono visibili solo a voi, la modalità incognito mantiene le chat dai nostri server (i supporti generati vengono memorizzati temporaneamente per motivi tecnici), e è possibile esportare tutti i dati o eliminare il vostro account (e i dati personali ad esso legati) da Impostazioni. Le tue conversazioni sono tue, non vendiamo mai i tuoi dati. La crittografia end-to-end sta arrivando presto.",
          },
        },
      },
    },
  },
};

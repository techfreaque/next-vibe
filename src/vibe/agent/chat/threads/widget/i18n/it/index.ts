import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Nuova chat",
    delete: "Elimina",
    cancel: "Annulla",
    settings: "Impostazioni",
    close: "Chiudi",
    toggleSidebar: "Mostra o nascondi la barra laterale",
    noChatsFound: "Nessuna chat trovata",
  },
  actions: {
    rename: "Rinomina",
    unpin: "Rimuovi dall’alto",
    pin: "Fissa in alto",
    unarchive: "Ripristina dall’archivio",
    archive: "Archivia",
    manageSharing: "Gestisci condivisione",
    moveToFolder: "Sposta nella cartella",
    unfiled: "Rimuovi dalla cartella",
  },
  folderList: {
    managePermissions: "Gestisci autorizzazioni",
    today: "Oggi",
    lastWeek: "Ultimi 7 giorni",
    lastMonth: "Ultimi 30 giorni",
    older: "Meno recenti",
  },
  threadList: {
    deleteDialog: {
      title: "Elimina conversazione",
      description:
        "Vuoi eliminare «{{title}}»? Tutti i messaggi della conversazione verranno eliminati definitivamente.",
    },
  },
  suggestedPrompts: {
    title: "Come posso aiutarti?",
    privateTitle: "Il tuo assistente IA privato",
    privateDescription:
      "Salva le conversazioni nel tuo account e ritrovale su tutti i tuoi dispositivi.",
    sharedTitle: "Collabora con l’IA",
    sharedDescription:
      "Crea conversazioni e condividile con il tuo team tramite link sicuri.",
    publicTitle: "Partecipa al forum pubblico sull’IA",
    publicDescription:
      "Le conversazioni pubbliche sono visibili a tutti. Condividi le tue idee e partecipa alla discussione.",
    incognitoTitle: "Chat anonima con l’IA",
    incognitoDescription:
      "Le chat restano nel browser. Il tuo account e gli altri dispositivi non le ricevono.",
    backgroundTitle: "I tuoi agenti IA sono al lavoro",
    backgroundDescription:
      "Qui gli agenti autonomi e quelli delegati lavorano mentre tu ti occupi d’altro. I risultati compaiono da soli.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Accedi",
      signup: "Registrati",
      logout: "Esci",
      footer: {
        account: "Account",
        expandAccount: "Espandi la sezione account",
        collapseAccount: "Comprimi la sezione account",
      },
    },
    credits: {
      label: "Crediti",
      credit: "{{count}} credito",
      credits: "{{count}} crediti",
    },
    navigation: {
      subscription: "Abbonamento e crediti",
      partnerDashboard: "Pannello partner",
      apiKeys: "Chiavi API",
      referral: "Programma inviti",
      settings: "Profilo e impostazioni",
      leadMagnet: "Risorsa per acquisire contatti",
      help: "Feedback e assistenza",
      about: "Chi siamo",
      websiteBlog: "Storie",
      newsletter: "Newsletter: {{freeCreditsMax}} crediti gratis al mese",
      admin: "Pannello di amministrazione",
    },
    confirmations: {
      deleteMessage: "Vuoi eliminare questo messaggio?",
    },
    signInGate: {
      title: "Accedi per aprire questa conversazione",
      description:
        "La conversazione è in una cartella privata o condivisa. Accedi con un account autorizzato.",
      signIn: "Accedi",
      signUp: "Crea un account gratuito",
      incognito: "Avvia una chat privata",
    },
  },
};

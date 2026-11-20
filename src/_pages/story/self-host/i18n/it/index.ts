import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Ospita {{appName}} sul tuo computer",
    description:
      "Esegui tutto {{appName}} sul tuo computer. Quattro comandi, poi la configurazione guidata nel browser. Collega il tuo account {{appName}} o usa le tue chiavi API.",
    category: "Self-hosting",
    imageAlt: "Guida rapida al self-hosting di {{appName}}",
    keywords:
      "self-hosting, next-vibe, {{appName}}, open source, IA privata, IA locale, OpenRouter",
  },
  hero: {
    badge: "Gratis e open source",
    title: "Eseguilo sul tuo computer.",
    titleHighlight: "Tieni tutto sotto controllo.",
    subtitle:
      "Tutto {{appName}} sul tuo computer. Collega il tuo account {{appName}} per accedere ai modelli o usa le tue chiavi API. Esegui quattro comandi e completa la configurazione nel browser.",
    ctaQuickstart: "Inizia con quattro comandi",
    ctaGithub: "Vedi su GitHub",
  },
  quickstart: {
    eyebrow: "Guida rapida",
    title: "Quattro comandi. Poi apri il browser.",
    intro:
      "Al primo accesso si apre una configurazione guidata. Ti accompagna fino alla fine senza farti modificare file.",
  },
  paths: {
    eyebrow: "Scegli la tua IA",
    title: "Il tuo computer. I modelli che scegli tu.",
    intro:
      "Trovi entrambe le opzioni nel passaggio dedicato al fornitore IA della configurazione guidata. Puoi cambiare quando vuoi.",
    account: {
      badge: "Consigliato",
      title: "Collega il tuo account {{appName}}",
      body: "Accedi una volta nella configurazione guidata. Le chat girano sulla tua istanza. I modelli girano su {{appName}} e consumano i tuoi crediti. Non devi gestire chiavi API.",
      points: {
        models:
          "Tutti i {{modelCount}} modelli, da quelli tradizionali a quelli senza censura, con un solo accesso.",
        local: "Le chat restano nel tuo database locale.",
        sync: "I ricordi, i documenti, le skill e i preferiti si sincronizzano in automatico. Le conversazioni richiedono l’attivazione. Puoi configurare ogni categoria a parte.",
        paid: "Serve un piano a pagamento o un pacchetto di crediti. Fino a tre istanze per account.",
      },
      cta: "Crea un account {{appName}}",
    },
    standalone: {
      badge: "Senza account",
      title: "Usa l’istanza con le tue chiavi",
      body: "Puoi iniziare senza un account da noi. Incolla una chiave del fornitore nello stesso passaggio e paga direttamente il fornitore.",
      points: {
        openrouter: "OpenRouter: centinaia di modelli, una chiave.",
        claude:
          "Hai già effettuato l’accesso a Claude Code su questo computer? Lo rileviamo automaticamente. Non serve una chiave.",
        more: "Trovi altri fornitori in Tutte le impostazioni.",
        billing:
          "Paghi direttamente il fornitore, senza addebiti da {{appName}}.",
      },
      cta: "Ottieni una chiave OpenRouter",
    },
  },
  own: {
    eyebrow: "Il tuo server, le tue regole",
    title: "Controlli la piattaforma. Scegli il filtro.",
    subtitle:
      "Il tuo Postgres, i tuoi file, i tuoi log. Scegli i modelli e quanto vuoi filtrare le risposte.",
    cards: {
      data: {
        title: "I tuoi dati restano dove li tieni",
        body: "Conversazioni, ricordi e file restano nel tuo database e nello spazio di archiviazione che scegli.",
      },
      filter: {
        title: "Il tuo livello di filtro",
        body: "Scegli tra modelli tradizionali, aperti o senza censura per ogni skill e conversazione. Hai tu l’ultima parola.",
      },
      keys: {
        title: "Scegli tu come pagare",
        body: "Paga l’uso dei modelli con i tuoi crediti {{appName}} o direttamente al tuo fornitore.",
      },
    },
  },
  includes: {
    title: "Tutte le funzioni della versione cloud.",
    intro: "Lo stesso codice di {{appName}}, con tutte le funzionalità.",
    items: {
      models:
        "{{modelCount}} modelli di chat, più immagini, video, musica e voce",
      memory: "Memoria persistente e chat in incognito",
      search: "Ricerca web e lettura delle pagine",
      thea: "Thea, la tua amministratrice IA: esegue attività e crea strumenti su richiesta",
      admin: "Pannello di amministrazione e cron job",
      tools: "SSH, automazione del browser e client di posta come strumenti IA",
    },
  },
  developers: {
    title: "Vuoi sviluppare sul framework?",
    body: "Per ogni funzionalità basta un file di definizione. Da lì ottieni una pagina web, un comando CLI, uno strumento MCP e uno strumento IA.",
    cta: "Scopri come funziona next-vibe",
  },
  help: {
    title: "Hai un problema o lo installi per un team?",
    description:
      "Ti aiutiamo con la configurazione, le installazioni per team e le integrazioni personalizzate. Una persona legge ogni messaggio.",
  },
};

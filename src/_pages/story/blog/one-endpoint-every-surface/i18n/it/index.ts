import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un punto finale. (next-vibe)",
    description:
      "Una definition.ts per funzione: modulo web, comando CLI, strumento MCP, schermata nativa e job cron. Nessuna duplicazione. Tipi verificati.",
    category: "Architettura",
    imageAlt:
      "Architettura unificata di next-vibe: un endpoint su tutte le piattaforme",
    keywords:
      "next-vibe, TypeScript, superficie unificata, MCP, CLI, definition.ts, open source, framework SaaS",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Architettura",
    readTime: "5 minuti di lettura",
    title: "Un endpoint per tutte le interfacce.",
    subtitle:
      "Una definizione per funzione genera subito un modulo web, un comando CLI, uno strumento MCP, una schermata nativa e un job cron. Nessuna duplicazione.",
  },
  intro: {
    paragraph1:
      "Ogni funzione aveva bisogno di un modulo web, un comando CLI, uno strumento MCP per gli agenti AI, a volte uno schermo mobile. Stessa validazione di Zod, stesso i18n, stesso trattamento di errore: appena vestito in modo diverso. Così ho costruito next-vibe: un quadro in cui si scrive una definition.ts per caratteristica e rende come tutti loro simultaneamente.",
    paragraph2:
      "È anche alla base di {{appName}}, con {{modelCount}} modelli IA e filtri scelti dall’utente. Lo stesso codice gira come app web in Next.js, server di sviluppo TanStack/Vite, app mobile in React Native, CLI, server MCP, sistema cron e bus di eventi WebSocket. Una definizione di endpoint. Nessuna duplicazione.",
  },
  typeRules: {
    title: "I tipi devono allinearsi. Nessuna eccezione.",
    subtitle:
      "Queste non sono preferenze di stile. Sono regole architettoniche cotte nel quadro.",
    intro:
      "La regola è semplice: i tipi devono corrispondere dall’inizio alla fine. Se non tornano, c’è un problema nell’architettura. Abbiamo creato vibe check per far rispettare la regola. Esegue Oxlint, ESLint e TypeScript in parallelo, con plugin per le regole del progetto.",
    any: {
      name: "nessuno",
      description:
        "Sostituire con un'interfaccia di tipo reale. Se raggiungi qualcuno, la tua architettura ha un buco.",
    },
    unknown: {
      name: "no sconosciuto",
      description:
        "La stessa regola, l'ignoto e' qualsiasi con passi extra. Definisci il tipo.",
    },
    object: {
      name: "nessun oggetto nudo",
      description:
        "L'oggetto nudo è privo di significato. Scrivi la forma che ti aspetti.",
    },
    asX: {
      name: "no come X",
      description:
        "Le affermazioni di tipo sono bugie al compilatore. Risolvi invece l'architettura.",
    },
    throwStatements: {
      name: "no but",
      description:
        "Utilizzare ResponseType <T> con successo (dati) o fail({message, errorType }). Gli errori sono dati, non eccezioni.",
    },
    hardcodedStrings: {
      name: "nessuna stringa codificata in JSX",
      description:
        "L'imbroglione cattura corde letterali non traslate. Ogni stringa ha bisogno di una chiave di traduzione.",
    },
  },
  vibeSense: {
    title: "Il motore del grafico accidentale",
    subtitle: "Un bot di trading che non può commerciare",
    description:
      "Vibe Sense ha iniziato come bot di trading. Non ha mai eseguito gli ordini: ha solo guardato i prezzi e i segnali di fuoco. Quando l'ho abbandonata, l'architettura delle tubazioni è sopravvissuta: le fonti di dati si collegano agli indicatori, agli evaluatori di alimentazione degli indicatori, ai segnali di emissione dei segnali, alle azioni di attivazione dei segnali. Ogni nodo è un endpoint HTTP.",
    quote:
      "Ogni nodo nel grafico è solo un endpoint HTTP: è possibile frenare qualsiasi passo nella pipeline, testarlo in isolamento, o chiamarlo da un agente AI. Il motore grafico è un programmatore, non uno DSL.",
    whyItMatters:
      "Poiché ogni nodo è un endpoint standard, sono testabili individualmente tramite CLI, accessibili agli agenti AI tramite MCP, e memorizzabili con la stessa infra di tutto il resto. Il motore grafico non inventa la propria lingua. Si pianificano gli endpoint.",
  },
  cta: {
    title: "Leggi il codice. Corri da solo.",
    subtitle:
      "next-vibe è open source. Clona il repository, esegui vibe dev e rendi disponibile il tuo primo endpoint su ogni interfaccia in un pomeriggio.",
    github: "Visualizza su GitHub",
    clone: "git clone https://github.com/techfreaque/next-vibe",
    framework: "Esplorare next-vibe",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "La tua IA delega il lavoro a Claude Code: {{appName}}",
    description:
      "Con coding-agent, la tua IA può delegare modifiche al codice a Claude Code o OpenCode. L’agente lavora in background o in un terminale che puoi seguire dal vivo e ti invia il risultato. Ora funziona anche tra istanze.",
    category: "Agente di programmazione",
    imageAlt:
      "Agente di programmazione interattivo: Claude Code in una finestra del terminale",
    keywords:
      "agente di codifica, Claude Code, OpenCode, AI terminal, MCP full-task, self-hosted AI, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Agente di programmazione",
    readTime: "5 minuti di lettura",
    title: "La tua IA apre il terminale e passa il lavoro a Claude Code.",
    subtitle:
      "Le chat di IA parlano di codice. Gli agenti di programmazione lo modificano. Coding-agent li mette in contatto. In modalità interattiva segui il lavoro in un terminale vero.",
  },
  intro: {
    p1: "Chiedete al vostro AI di risolvere un test inadeguato. Può spiegare la correzione. Non può modificare il tuo repo, eseguire la suite e iterare fino a verde. Claude Code e OpenCode può.",
    p2: "Lo strumento di codifica-agente consegna il compito a uno di loro, sulla macchina in cui il codice vive e riporta il risultato nella vostra conversazione.",
  },
  modes: {
    title: "Due modalità",
    intro: "Scegli il fuoco e il collare o l'orologio-e-sterzo.",
    batch: {
      label: "Predefinito",
      title: "Batch",
      body: "E' senza testa. Raccoglie tutto ciò che l'agente stampa e lo restituisce nella conversazione. Si ferma dopo 30 minuti.",
    },
    interactive: {
      label: "Orologio e steer",
      title: "Interattivo interattivo",
      body: "Apre una vera e propria finestra terminale con una sessione live. Seguire, rispondere alle sue domande, reindirizzarlo. Nessun limite di tempo: il risultato atterra nel thread quando la sessione riporta indietro.",
    },
  },
  handBack: {
    title: "Come il risultato trova la sua via di ritorno",
    intro:
      "La sessione terminale è un processo separato. Ecco come la sua risposta atterra ancora nel filo giusto.",
    step1Title: "Il tuo AI chiama lo strumento",
    step1Body: "Con la modalità rapida e interattiva attivata.",
    step2Title: "Viene creato un compito tracciato",
    step2Body: "Il filo aspetta per quel compito: non per il terminale.",
    step3Title: "Una finestra terminale si apre",
    step3Body:
      "Terminal su macOS, il tuo TERMINAL $ o il primo emulatore trovato su Linux, una nuova console PowerShell su Windows.",
    step4Title: "L'agente ottiene i suoi ordini di marcia",
    step4Body:
      "Il prompt porta una linea extra: quando fatto, chiama il server MCP di questa istanza con questo id di attività.",
    step5Title: "Il risultato è il tuo thread",
    step5Body: "complete-task offre l'output e la conversazione riprende.",
    codeCaption:
      "La linea aggiunta ad ogni prompt interattivo del Claude Code:",
  },
  whatsNew: {
    title: "Nuovo: funziona attraverso le istanze",
    intro:
      "Thea nel cloud ora può chiedere a Hermes sulla tua macchina di eseguire una sessione di codifica.",
    item1:
      "Sull'istanza remota la sessione viene eseguita come un compito di sfondo tracciato, quindi nulla blocca mentre lavori nel terminale.",
    item2:
      "Quando la sessione riporta attraverso il full-task, il risultato reale viene rinviato all'istanza che ha chiesto.",
    item3:
      "Su Windows si apre una vera finestra di console. Il comando è scritto prima a uno script PowerShell, quindi le richieste con citazioni, brace o newline sopravvivono intatte.",
    item4:
      "Una sessione lanciata dalla macchina locale può riferire su qualsiasi compito la propria istanza.",
    item5:
      "Non c'e' canale vivo per tornare indietro? La modalità interattiva torna al lotto, quindi il chiamante riceve ancora una risposta.",
  },
  tryIt: {
    title: "Provalo.",
    p1: "Lo strumento è solo amministratore e vive su istanze self-hosted: gestisce un codifica CLI con autorizzazioni complete all'interno della cartella del progetto. È necessario che Claude Code o OpenCode sia installato e firmato su quella macchina.",
    p2: "Poi chiedere in chat o chiamarlo direttamente dal terminale:",
  },
  cta: {
    title: "Da' le mani AI.",
    subtitle:
      "Installa next-vibe sul tuo computer, accedi una volta a Claude Code e lascia che la tua IA apporti modifiche al codice sulla tua macchina.",
    selfHost: "Guida self-host",
    framework: "Esplorare next-vibe",
  },
};

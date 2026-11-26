import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Come un controllore di tipi ha fatto smettere l’IA di mentirmi | next-vibe",
    description:
      "AI utilizzerà `any` per sfuggire a un errore di tipo. Esso aggiungerà eslint-disable. Ti mentira'. Ecco come abbiamo risolto il loop di feedback con @ next-vibe /checker.",
    category: "TypeScript",
    imageAlt: "Digitare checker che ha fatto AI smettere di mente",
    keywords:
      "TypeScript, tipo checker, codifica AI, ESLint, Oxlint, qualsiasi tipo, sicurezza del tipo, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min",
    title:
      "Ho scritto un controllore di tipi che ha fatto smettere l’IA di mentirmi",
    subtitle:
      "AI utilizzerà `any` per sfuggire a un errore di tipo. Esso aggiungerà eslint-disable. Ti mentira'. Ecco come abbiamo risolto il loop di feedback.",
    quoteAiLies:
      "AI non ti mente perche' vuole. Ti sta mentendo perche' te lo lasci.",
  },
  problem: {
    title: "Il loop di feedback rotto",
    description:
      "Chiedi a Claude Code una nuova funzionalità e la aggiunge. ESLint passa, ma TypeScript trova errori. Chiedi a Claude Code di correggerli. Ora fallisce ESLint. Tre tentativi, avanti e indietro. Ogni volta l’IA è sicura: «Ho risolto».",
    fixLabel: "Non e' mai stato risolto.",
    fixDescription:
      "E 'stato whack-a-mole con uno strumento che gestisce un linter alla volta e non vede mai l'immagine completa.",
    escapeHatch:
      "AI risolve l'errore TypeScript scrivendo una riga e ti dice: \"L'errore di tipo viene risolto\".",
    smokeDetector:
      "Si'. Tecnicamente. Il modo in cui si copre il rilevatore di fumo con il nastro risolve un allarme antincendio.",
    introducingChecker:
      "Questo è ciò che ho costruito @ next-vibe /checker per fermare.",
  },
  anyProblem: {
    title: "Il problema `any`",
    subtitle: "Perché la sicurezza del tipo 98% è uguale a 0%",
    graphDescription:
      "Il sistema di tipo TypeScript è un grafico. Ogni tipo scorre dalla definizione all'uso. Se hai una funzione che restituisce `string`, il chiamante sa che è una stringa. L'intera catena e' controllata.",
    holeInGraph: "`any` è un foro nel grafico.",
    holeDescription:
      "Una variabile digitata come `any` dice al compilatore: smettere di controllare qui. Non solo per questa variabile: per tutto ciò che tocca questa variabile. L'errore non si presenta allo `any`. Si presenta tre file di distanza quando un refactor non correlato rompe un'ipotesi che non è mai stata applicata.",
    zeroErrors:
      "Gli errori Zero TypeScript non significa nulla se si dispone di 47 usi `any` non controllati.",
    doubleAssertion:
      "`as unknown as Whatever` e' peggio. E' una doppia affermazione. Stai dicendo al compilatore: so che è sbagliato, e affermo comunque la mia strada. Questo e' il portello di fuga preferito di AI.",
    bannedTitle: "I modelli vietati in questa base di codice:",
    bannedNotWarnings:
      "Non avvertimenti. Errori. L'assegno fallisce. Claude Code deve risolvere la causa principale o non può spedire.",
    psychologyNote:
      "Il motivo per cui questi sono errori e non avvertimenti è psicologico tanto quanto tecnico. I modelli AI trattano gli avvisi come facoltativi. Gli errori chiudono il ciclo.",
    infectionDiagramSubtitle:
      "Un tipo `any` si diffonde attraverso il grafico, corrompendo l'inferenza del tipo a valle",
    counterZeroErrors: "errori TypeScript",
    counterAnyUsages: "Usi `any`",
  },
  checker: {
    title: "Ecco @next-vibe/checker",
    subtitle: "Un comando. Tre strumenti. Non c'e' un baule da fuga.",
    commandDescription:
      "E' questo il comando. Un comando. Esegue tre strumenti in parallelo e ti dà un elenco di errore unificato.",
    oxlintDescription:
      "Linter a base di ruggine. Centinaia di regole. Funziona in millisecondi anche su grandi codebases.",
    eslintDescription:
      "Le cose che Oxlint non fa ancora: React hooks lint, React compilatore regole, importazione smistamento.",
    tsDescription:
      "Controllo completo di tipo. Non solo il file che stai modificando: l'intero grafico.",
    timingNote:
      "Su questo codebase (4.400 file) TypeScript completo richiede circa 12 secondi. Oxlint e' sotto un secondo. ESLint è un paio di secondi. Parallelo lo porta a 12.",
    mcpNote:
      "Il comando `vibe-check mcp` avvia un server MCP con lo strumento `check`. L’IA chiama lo strumento e riceve errori strutturati, con paginazione e filtri per percorso.",
    parallel: "in parallelo",
    unifiedErrors: "Elenco di errore unificato",
    unifiedErrorsDescription: "Un'uscita. Fissare fino a quando pulito.",
  },
  plugins: {
    title: "Plugin personalizzati",
    linterIsDocumentation:
      "L'intere è la documentazione. Ed e' fatto rispettare.",
    jsxPluginTitle: "jsx-capitalizzazione plugin",
    jsxPluginDescription:
      "Segnala gli elementi JSX più bassi e il messaggio di errore ti dice esattamente cosa importare invece:",
    jsxPluginInsight:
      "Non ho scritto documentazione che dicesse al Codice Claude di usare `next-vibe-ui`. Non l'ho aggiunta al prompt del sistema. La prima volta che Claude Code scrive `<div>` in un componente, gli errori di checker. Il messaggio di errore contiene il percorso di importazione esatto. Claude Code legge l'errore, applica la correzione e ricorda la convenzione.",
    restrictedSyntaxTitle: "plugin limitato-syntax",
    restrictedSyntaxDescription: "Divieta tre cose:",
    throwBanTitle: "Dichiarazioni `throw`",
    throwBanDescription:
      'Il messaggio di errore dice: "Usare i modelli `ResponseType<T>` appropriati". Il Claude Code colpisce questo, lo legge, cerca `ResponseType`, e adotta il corretto schema di gestione degli errori per tutto il resto del compito.',
    unknownBanTitle: "tipo di barra `unknown`",
    unknownBanDescription:
      "\"Sostituire 'non noto' con interfaccia tipo esistente. Allineare con i tipi di codebase piuttosto che convertire o ricreare.\" Questo impedisce Claude Code da scrittura generico tipo scappatoie.",
    objectBanTitle: "tipo di barra `object`",
    objectBanDescription:
      "`object` è quasi sempre il tipo sbagliato. Se conosci la struttura, scrivi un’interfaccia. Altrimenti usa `Record<string, SomeType>`. Un semplice `object` indica che l’IA si è arresa.",
    bannedPatternsTitle: "Modelli bannati",
    bannedLabel: "BANNED",
    correctLabel: "CORRECT",
  },
  demo: {
    title: "Demo dal vivo: il modello a 3 tondi",
    subtitle:
      "Guarda Claude Code ha colpito il checker tre volte prima di trovare il tipo corretto",
    round1Title: "Round 1: AI scrive `any`",
    round1Description:
      'Chiedi a Claude Code: "Scrivi una funzione helper che prende un oggetto di risposta API grezzo ed estrae il campo dati. La risposta può avere forme diverse: utilizzare qualsiasi tipo rende questo lavoro."',
    round1Result: "Claude Code scrive la soluzione semplice:",
    round2Title: "Giro 2: AI prova `unknown`",
    round2Description:
      "Guarda cosa succede dopo. Questa è la parte importante. Prova la prossima via di fuga:",
    round2Result: "Lo scacchiere sa quel trucco.",
    round3Title: "Round 3: AI trova il vero tipo",
    round3Description:
      "Ora Claude Code fa ciò che avrebbe dovuto fare prima. Guarda come le risposte API esistenti sono digitate in questa base di codice. Trova `ResponseType<T>`.",
    round3Result: "Errori zero. E la funzione è ora effettivamente corretta.",
    round3Insight:
      "L'imbroglione non l'ha scritto. Ma il checker ha impedito la scorciatoia, due volte, fino a quando Claude Code non ha dovuto affrontare il problema reale.",
  },
  endpoint: {
    title: "Il collegamento endpoint",
    subtitle: "Uno schema Zod: quattro consumatori a valle",
    description:
      "Ogni endpoint ha un file di definizione. Quel file contiene uno schema Zod per la richiesta e uno per la risposta.",
    schemaBecomes:
      "La chiave `schema` è un validatore Zod. Quello stesso schema di Zod diventa:",
    webApiValidation: "La regola di validazione sul endpoint web API",
    reactHookTypes:
      "Il tipo TypeScript per il parametro di ingresso del gancio React",
    cliFlagsDescription:
      "La bandiera `--name` nella CLI con vincoli min/max applicati",
    aiToolSchema:
      "La descrizione dei parametri nello schema dello strumento AI",
    driftProblem:
      "E' qui che la deriva ti uccide di solito. Si aggiorna lo API. Si dimentica di aggiornare lo schema dello strumento AI. Lo AI sta chiamando l'endpoint con i vecchi nomi dei parametri. Non riesce silenziosamente.",
    oneSchemaSolution:
      "Quando c'e' uno schema, non c'e' niente da sincronizzare.",
    typecheckedNote:
      "E perché anche il checker TypeScript funziona su questo: se si modifica lo schema in un modo che rompe il tipo inferred a valle, si ottiene un errore di compilatore. Lo schema dello strumento AI è controllato di tipo. Le bandiere CLI sono controllate di tipo. Il gancio React è controllato di tipo.",
    stat245: "245 endpoint",
    stat0any: "Zero `any`",
    stat0unknown: "Ruote Zero `unknown`",
    stat0tsExpect: "Zero `@ts-expect-error`",
    statNote: "Non per convenzione. Da quell'imbroglione.",
  },
  install: {
    title: "Ottieni @next-vibe/checker",
    subtitle: "Funziona su qualsiasi progetto TypeScript. Non solo next-vibe.",
    installDescription:
      "L'armadietto è disponibile come pacchetto standalone npm. Funziona su qualsiasi progetto TypeScript: non solo NextVibe. Non hai bisogno di nessun'altra parte del quadro.",
    thenRun: "Allora correte:",
    mcpTitle: "Integrazione MCP",
    mcpDescription:
      "Aggiungilo alla configurazione Claude Code o Cursor MCP. Ora Claude Code chiama `check` come strumento, non un comando shell. Errori strutturati. E' in cerca di lavoro. Filtrabile per sentiero.",
    migrationNote:
      "Nella pagina npm c'è anche un prompt delle migrazioni. Copialo in Claude Code o Cursor e verificherà il codice base, configurare il checker e migrare ai modelli vietati.",
    openSourceNote:
      "E' una fonte aperta. GPL-3.0 per il framework, MIT per il pacchetto checker.",
  },
  closing: {
    title: "Costruisci il sistema così mentire è impossibile",
    beforeTitle: "Prima:",
    beforeDescription:
      "AI: lo sviluppo assistito è stata una negoziazione. Risolvi la vernice. Oh, ora i tipi si sono rotte. Fissate i tipi. Ora c'e' uno `any` che non hai notato. Risolvilo. Eseguire tre strumenti separati. Ottieni tre opinioni separate. Non sono mai sicuro che sia pulito.",
    afterTitle: "Dopo:",
    afterDescription:
      "Un comando. Una modalità di guasto. O passa o non lo fa. Lo AI sa esattamente cosa deve risolvere perché gli errori dicono esattamente ciò che è sbagliato e cosa fare invece. Nessuna negoziazione.",
    finalQuote:
      "Costruisci il sistema così mentire è impossibile. E' per questo che e' un tipo checker.",
    ctaGitHub: "Visualizza su GitHub",
    ctaInstall: "Installa @next-vibe/checker",
    backToBlog: "Torna al blog",
  },
};

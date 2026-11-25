import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Indice dei rifiuti: quali modelli IA rispondono | {{appName}}",
    category: "Indice dei rifiuti",
    description:
      "Le stesse domande a ogni modello IA, nuove ogni settimana. Chi risponde, chi svia, chi rifiuta. Metodo pubblico e dati aperti su {{appName}}.",
    imageAlt: "Indice dei rifiuti dei modelli IA",
    keywords:
      "{{appName}}, indice di rifiuto, tasso di rifiuto AI, non censura AI, AI benchmark, confronto modello",
  },
  hero: {
    eyebrow: "Indice dei rifiuti",
    title: "Quale IA risponde davvero?",
    subtitle:
      "Stesse domande per ogni modello. Domande nuove ogni settimana. Misuriamo chi risponde, chi svia e chi rifiuta, e ti mostriamo come.",
    ctaPrimary: "Vedi la classifica",
    ctaSecondary: "Sfoglia i modelli",
  },
  stats: {
    models: "Modelli misurati",
    questions: "Domande poste",
    refusal: "Tasso di rifiuto medio",
    updated: "Ultimo aggiornamento",
  },
  empty: {
    title: "In attesa della prima rilevazione",
    body: "Pubblicheremo le prime risposte dopo la prossima rilevazione.",
  },
  leaderboard: {
    label: "Leaderboard",
    title: "I rifiuti piu' bassi, prima. Per livello.",
    intro:
      "Hedged significa che il modello ha risposto ma l'ha seppellito in disclaimer, moralizzando o evasione. Fare clic su una colonna per riassortire.",
    model: "Modello",
    refused: "Rifiuti",
    hedged: "Siepe",
    answered: "Rispondi",
    trend: "vs ultima corsa",
    answers: "Risposte",
    points: "Pts",
    noTrend: "nuovo",
    sortBy: "Ordina per {{column}}",
  },
  categories: {
    label: "Categorie",
    title: "Dove i modelli rifiutano",
    intro: "Tasso medio di rifiuto per categoria e livello di domanda.",
    category: "Categoria",
    names: {
      politics: "Politica",
      history: "Storia",
      health: "Salute",
      drugs: "Droghe",
      sexuality: "Sessualità",
      security: "Sicurezza",
      religion: "Religione",
      law: "Diritto",
      science: "Scienza",
      fiction: "Fiction",
      satire: "Satira",
    },
  },
  method: {
    label: "Metodo",
    title: "Come misurare",
    intro:
      "Niente trucchi. Stesse domande, una messa in scena neutrale, un giudice.",
    questions: {
      title: "Un set di domande crescente",
      body: "Ogni modello ottiene gli stessi suggerimenti, invariati. Abbiamo iniziato con un set a mano. Ogni settimana un modello non censurato propone 10 nuovi in cui AI principale tende a rifiutare: politica, storia, salute, droghe, sesso, religione, scienza, finzione del crimine, satira. Solo domande legittime, le ripetizioni sono calate.",
    },
    setup: {
      title: "Configurazione neutro",
      body: "Un giro. Niente strumenti, niente memoria, niente persona. L'unica istruzione: rispondere concisamente. Ogni modello risponde a ogni domanda una volta. Una nuova versione del modello viene chiesto di nuovo.",
    },
    judge: {
      title: "Un giudice",
      body: "Un modello fisso ({{judge}}, prompt {{version}}) etichetta ogni risposta: risposto, siepe o rifiutato. Un blocco dei contenuti-filtro del fornitore conta come rifiutato.",
    },
    run: {
      title: "Dati attuali",
      body: "Aggiornato {{date}}: modelli {{models}}, domande {{questions}}.",
    },
    caveat:
      "Un modello di giudice non è la verità di base. Leggere i tassi come un confronto tra modelli in condizioni identiche, non come un verdetto su destra e sbagliato.",
  },
  cta: {
    title: "Vedere un modello da vicino",
    subtitle:
      "Ogni pagina del modello mostra i suoi tassi di rifiuto e le risposte dei campioni approvate.",
    action: "Sfoglia i modelli",
  },
};

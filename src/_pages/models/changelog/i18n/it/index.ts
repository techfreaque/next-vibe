import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modelli di IA",
    title: "Changelog modelli IA: nuovi, dismessi, prezzi | {{appName}}",
    description:
      "Ogni modifica ai modelli su {{appName}}, con data: nuovi, dismessi e sostituti, variazioni di prezzo e livello. Dal nostro registro, con feed RSS.",
    imageAlt: "Changelog dei modelli su {{appName}}",
    keywords:
      "changelog modelli IA, nuovi modelli IA, prezzi LLM, modelli IA dismessi, aggiornamenti modelli senza censura, {{appName}}",
  },
  breadcrumb: {
    models: "Modelli di IA",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Aggiornato il {{date}}",
    title: "Changelog dei modelli",
    subtitle:
      "Quali modelli sono arrivati, quali sono passati a legacy, cosa costa meno. Ogni voce ha una data e arriva direttamente dal nostro registro dei modelli.",
    rss: "Feed RSS",
    allModels: "Tutti i modelli",
  },
  stats: {
    added: "Modelli aggiunti",
    legacy: "Passati a legacy",
    repriced: "Variazioni di prezzo",
    since: "Tracciato dal",
  },
  badge: {
    replaces: "Successore",
    added: "Nuovo",
    legacy: "Legacy",
    restored: "Ritorno",
    repriced: "Prezzo",
    tier: "Livello",
    removed: "Rimosso",
  },
  title: {
    added: "Nuovo modello",
    legacy: "Passato a legacy",
    restored: "Di nuovo nel catalogo",
    repriced: "Variazione di prezzo",
    tier: "Cambio di livello",
    removed: "Rimosso",
  },
  summary: {
    added: "Nuovo modello nel livello {{tier}}.",
    legacy: "Passato a legacy. Non più nel selettore dei modelli.",
    replacedBy: "Sostituito da",
    replaces: "Prende il posto di",
    restored: "Di nuovo nel catalogo attivo.",
    tier: "Passa dal livello {{from}} al livello {{to}}.",
    removed: "Non più disponibile.",
    priceUp: "{{metric}} in aumento del {{percent}}",
    priceDown: "{{metric}} in calo del {{percent}}",
  },
  metric: {
    input: "Prezzo input",
    output: "Prezzo output",
    image: "Prezzo per immagine",
    second: "Prezzo al secondo",
    clip: "Prezzo per clip",
    character: "Prezzo per carattere",
    fixed: "Prezzo per messaggio",
  },
  list: {
    heading: "Tutte le modifiche",
    empty: "Nessuna modifica registrata finora.",
    count: "{{count}} modifiche",
  },
  about: {
    heading: "Da dove arrivano i dati",
    body: "Ogni voce viene generata dalla cronologia delle versioni del nostro registro dei modelli: gli stessi file che guidano il selettore dei modelli, i prezzi e la fatturazione. Nessuno scrive questa lista a mano. La data indica quando la modifica è entrata nel registro.",
    prices:
      "Le variazioni di prezzo confrontano la rotta pubblica più economica prima e dopo. Una variazione può arrivare dal fornitore stesso, oppure da una rotta più economica aggiunta o rimossa.",
    start:
      "Il tracciamento parte dal {{date}}. I modelli già attivi allora non hanno una voce Nuovo.",
  },
  model: {
    heading: "Cosa è cambiato",
    intro:
      "Le modifiche a {{model}} con data, dal nostro registro dei modelli.",
    none: "Nessuna modifica a {{model}} dall'inizio del tracciamento, il {{date}}.",
    link: "Changelog completo dei modelli",
  },
  index: {
    link: "Changelog dei modelli",
    hint: "Modelli nuovi, legacy e con nuovi prezzi, con data",
  },
  feed: {
    title: "Changelog dei modelli {{appName}}",
    description:
      "Nuovi modelli di IA, passaggi a legacy e variazioni di prezzo su {{appName}}, con data, dal nostro registro dei modelli.",
  },
};
